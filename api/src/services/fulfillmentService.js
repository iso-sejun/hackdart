const crypto = require('crypto');

const BuyerProfile = require('../models/BuyerProfile');
const FoodBank = require('../models/FoodBank');
const FulfillmentBatch = require('../models/FulfillmentBatch');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const SellerProfile = require('../models/SellerProfile');
const { HACKATHON_FOOD_BANK_EMAIL, sendFoodBankManifest } = require('./emailService');

function createError(message, statusCode, code) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function roundQuantity(value) {
  return Number(value.toFixed(2));
}

function createReadyToken() {
  return crypto.randomBytes(24).toString('hex');
}

async function ensureSellerProfile(userId) {
  const profile = await SellerProfile.findOne({ userId });

  if (!profile) {
    throw createError('Seller profile not found', 404, 'SELLER_PROFILE_NOT_FOUND');
  }

  return profile;
}

function aggregateItems(orders) {
  const byProduct = new Map();

  for (const order of orders) {
    for (const item of order.items) {
      const key = `${item.productId}-${item.unit}`;
      const current = byProduct.get(key) || {
        productId: item.productId,
        productNameSnapshot: item.productNameSnapshot,
        totalQuantity: 0,
        unit: item.unit,
      };

      current.totalQuantity = roundQuantity(current.totalQuantity + item.quantity);
      byProduct.set(key, current);
    }
  }

  return Array.from(byProduct.values());
}

async function attachPendingOrdersToBatches(sellerId) {
  const pendingOrders = await Order.find({
    sellerId,
    batchId: null,
    status: 'confirmed',
  }).sort({ createdAt: 1 });

  if (!pendingOrders.length) {
    return [];
  }

  const grouped = pendingOrders.reduce((accumulator, order) => {
    const key = order.foodBankId.toString();

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(order);
    return accumulator;
  }, {});

  const batches = [];

  for (const orders of Object.values(grouped)) {
    const batch = await FulfillmentBatch.create({
      sellerId,
      foodBankId: orders[0].foodBankId,
      status: 'ready_to_ship',
      orderIds: orders.map((order) => order._id),
      buyerIds: orders.map((order) => order.buyerId),
      aggregatedItems: aggregateItems(orders),
    });

    await Order.updateMany(
      { _id: { $in: orders.map((order) => order._id) } },
      {
        $set: {
          batchId: batch._id,
          fulfillmentStatus: 'batched',
        },
      }
    );

    batches.push(batch);
  }

  return batches;
}

async function buildBatchPayload(batchDoc) {
  const batch = batchDoc.toObject ? batchDoc.toObject() : batchDoc;
  const [foodBank, sellerProfile, orders] = await Promise.all([
    FoodBank.findById(batch.foodBankId).lean(),
    SellerProfile.findOne({ userId: batch.sellerId }).lean(),
    Order.find({ _id: { $in: batch.orderIds } }).sort({ createdAt: 1 }).lean(),
  ]);

  const orderGroups = await OrderGroup.find({
    _id: { $in: orders.map((order) => order.orderGroupId) },
  }).lean();
  const buyers = await BuyerProfile.find({
    userId: { $in: orders.map((order) => order.buyerId) },
  }).lean();

  const orderGroupMap = orderGroups.reduce((accumulator, group) => {
    accumulator[group._id.toString()] = group;
    return accumulator;
  }, {});

  const buyerMap = buyers.reduce((accumulator, buyer) => {
    accumulator[buyer.userId.toString()] = buyer;
    return accumulator;
  }, {});

  return {
    id: batch._id,
    status: batch.status,
    shippedAt: batch.shippedAt,
    manifestSentAt: batch.manifestSentAt,
    readyForPickupAt: batch.readyForPickupAt,
    aggregatedItems: batch.aggregatedItems,
    seller: {
      id: batch.sellerId,
      farmName: sellerProfile?.farmName || 'Seller farm',
      contactName: sellerProfile?.contactName || '',
    },
    foodBank: foodBank
      ? {
          id: foodBank._id,
          name: foodBank.name,
          email: HACKATHON_FOOD_BANK_EMAIL,
          address: foodBank.address,
          contactName: foodBank.contactName,
        }
      : null,
    orderCount: orders.length,
    orders: orders.map((order) => ({
      id: order._id,
      orderGroupId: order.orderGroupId,
      orderNumber: orderGroupMap[order.orderGroupId.toString()]?.orderNumber || null,
      buyerId: order.buyerId,
      buyerName: buyerMap[order.buyerId.toString()]?.fullName || 'Buyer',
      status: order.status,
      items: order.items,
      buyerTotal: order.buyerTotal,
      createdAt: order.createdAt,
    })),
  };
}

async function refreshOrderGroupStatuses(orderIds) {
  const orders = await Order.find({ _id: { $in: orderIds } }).lean();
  const grouped = orders.reduce((accumulator, order) => {
    const key = order.orderGroupId.toString();

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(order);
    return accumulator;
  }, {});

  for (const [orderGroupId, groupOrders] of Object.entries(grouped)) {
    const allReady = groupOrders.every((order) => order.status === 'ready_for_pickup');
    const allShippedOrReady = groupOrders.every((order) =>
      ['shipped', 'ready_for_pickup', 'picked_up'].includes(order.status)
    );

    const nextStatus = allReady
      ? 'ready_for_pickup'
      : allShippedOrReady
        ? 'shipped'
        : 'confirmed';

    const nextFulfillmentStatus = allReady
      ? 'ready_for_pickup'
      : allShippedOrReady
        ? 'shipped'
        : 'pending';

    await OrderGroup.findByIdAndUpdate(orderGroupId, {
      $set: {
        status: nextStatus,
        fulfillmentStatus: nextFulfillmentStatus,
      },
    });
  }
}

async function listSellerBatches(sellerId) {
  await ensureSellerProfile(sellerId);
  await attachPendingOrdersToBatches(sellerId);

  const batches = await FulfillmentBatch.find({ sellerId }).sort({ createdAt: -1 });
  return Promise.all(batches.map(buildBatchPayload));
}

async function getSellerBatch(sellerId, batchId) {
  await ensureSellerProfile(sellerId);

  const batch = await FulfillmentBatch.findOne({ _id: batchId, sellerId });

  if (!batch) {
    throw createError('Fulfillment batch not found', 404, 'FULFILLMENT_BATCH_NOT_FOUND');
  }

  return buildBatchPayload(batch);
}

async function markBatchShipped(sellerId, batchId) {
  const batch = await FulfillmentBatch.findOne({ _id: batchId, sellerId });

  if (!batch) {
    throw createError('Fulfillment batch not found', 404, 'FULFILLMENT_BATCH_NOT_FOUND');
  }

  if (batch.status !== 'ready_to_ship') {
    throw createError('Only ready-to-ship batches can be marked shipped', 400, 'BATCH_NOT_SHIPPABLE');
  }

  const now = new Date();
  const readyToken = createReadyToken();

  batch.status = 'shipped';
  batch.shippedAt = now;
  batch.manifestSentAt = now;
  batch.readyForPickupToken = readyToken;
  batch.readyForPickupTokenIssuedAt = now;
  batch.manifestVersion += 1;
  await batch.save();

  await Order.updateMany(
    { _id: { $in: batch.orderIds } },
    {
      $set: {
        status: 'shipped',
        fulfillmentStatus: 'shipped',
        shippedAt: now,
      },
    }
  );

  await refreshOrderGroupStatuses(batch.orderIds);

  const payload = await buildBatchPayload(batch);
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.PUBLIC_API_BASE_URL ||
    'http://localhost:4000';
  const readyLink = `${baseUrl.replace(/\/$/, '')}/api/v1/food-bank/ready/${readyToken}`;
  const emailResult = await sendFoodBankManifest({
    sellerName: payload.seller.farmName,
    foodBank: payload.foodBank,
    batch: {
      _id: payload.id,
      aggregatedItems: payload.aggregatedItems,
    },
    orders: payload.orders.map((order) => ({
      ...order,
      orderGroup: { orderNumber: order.orderNumber },
    })),
    readyLink,
  });

  return {
    batch: payload,
    email: emailResult,
  };
}

async function markBatchReadyForPickupByToken(token) {
  const batch = await FulfillmentBatch.findOne({ readyForPickupToken: token });

  if (!batch) {
    throw createError('Ready-for-pickup link is invalid or expired', 404, 'READY_LINK_INVALID');
  }

  if (batch.status !== 'shipped') {
    throw createError('Only shipped batches can be marked ready for pickup', 400, 'BATCH_NOT_READYABLE');
  }

  const now = new Date();

  batch.status = 'ready_for_pickup';
  batch.readyForPickupAt = now;
  batch.readyForPickupToken = null;
  await batch.save();

  await Order.updateMany(
    { _id: { $in: batch.orderIds } },
    {
      $set: {
        status: 'ready_for_pickup',
        fulfillmentStatus: 'ready_for_pickup',
        readyForPickupAt: now,
      },
    }
  );

  await refreshOrderGroupStatuses(batch.orderIds);

  return buildBatchPayload(batch);
}

module.exports = {
  listSellerBatches,
  getSellerBatch,
  markBatchShipped,
  markBatchReadyForPickupByToken,
};
