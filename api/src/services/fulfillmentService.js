const BuyerProfile = require('../models/BuyerProfile');
const FoodBank = require('../models/FoodBank');
const FulfillmentBatch = require('../models/FulfillmentBatch');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const SellerProfile = require('../models/SellerProfile');
const { sendFoodBankManifest } = require('./emailService');

function createError(message, statusCode, code) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

function roundQuantity(value) {
  return Number(value.toFixed(2));
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
          email: foodBank.email,
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

  batch.status = 'shipped';
  batch.shippedAt = now;
  batch.manifestSentAt = now;
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

  const payload = await buildBatchPayload(batch);
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
  });

  return {
    batch: payload,
    email: emailResult,
  };
}

module.exports = {
  listSellerBatches,
  getSellerBatch,
  markBatchShipped,
};
