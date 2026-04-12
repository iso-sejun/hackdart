const BuyerProfile = require('../models/BuyerProfile');
const Cart = require('../models/Cart');
const FoodBank = require('../models/FoodBank');
const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { getStripeClient } = require('../config/stripe');

const DEMO_FOOD_BANK_NAME_MAP = {
  'demo-food-bank-x': 'Food Bank X',
  'demo-food-bank-y': 'Food Bank Y',
};

const DEMO_FOOD_BANK_FIXTURES = {
  'demo-food-bank-x': {
    name: 'Food Bank X',
    email: 'hello@foodbankx.org',
    phone: '603-555-0101',
    hours: 'Mon-Fri 9am-5pm',
    contactName: 'Riley Hart',
    address: {
      line1: '101 Elm St',
      line2: '',
      city: 'Hanover',
      state: 'NH',
      postalCode: '03755',
      country: 'US',
    },
    geo: {
      type: 'Point',
      coordinates: [-72.2875, 43.7011],
    },
  },
  'demo-food-bank-y': {
    name: 'Food Bank Y',
    email: 'pickup@foodbanky.org',
    phone: '603-555-0142',
    hours: 'Tue-Sat 10am-4pm',
    contactName: 'Morgan Lee',
    address: {
      line1: '44 School St',
      line2: '',
      city: 'Lebanon',
      state: 'NH',
      postalCode: '03766',
      country: 'US',
    },
    geo: {
      type: 'Point',
      coordinates: [-72.2522, 43.6434],
    },
  },
};

function createError(message, statusCode, code, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
}

function roundCurrency(value) {
  return Number(value.toFixed(2));
}

function toCents(value) {
  return Math.round(value * 100);
}

function buildOrderNumber() {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${stamp}${random}`;
}

async function ensureBuyerProfile(buyerId) {
  const profile = await BuyerProfile.findOne({ userId: buyerId });

  if (!profile) {
    throw createError('Buyer profile not found', 404, 'BUYER_PROFILE_NOT_FOUND');
  }

  return profile;
}

async function getActiveCart(buyerId) {
  const cart = await Cart.findOne({ buyerId });

  if (!cart || cart.items.length === 0) {
    throw createError('Your cart is empty', 400, 'EMPTY_CART');
  }

  return cart;
}

async function resolveFoodBank(foodBankId, pickupAddress = {}) {
  if (!foodBankId) {
    throw createError('Pickup food bank not found', 404, 'FOOD_BANK_NOT_FOUND');
  }

  let foodBank = null;

  if (mongoose.Types.ObjectId.isValid(foodBankId)) {
    foodBank = await FoodBank.findOne({
      _id: foodBankId,
      acceptingOrders: true,
    });
  }

  if (foodBank) {
    return foodBank;
  }

  const mappedName = DEMO_FOOD_BANK_NAME_MAP[foodBankId];

  if (mappedName) {
    foodBank = await FoodBank.findOne({
      name: mappedName,
      acceptingOrders: true,
    });
  }

  if (!foodBank && DEMO_FOOD_BANK_FIXTURES[foodBankId]) {
    const fixture = DEMO_FOOD_BANK_FIXTURES[foodBankId];

    foodBank = await FoodBank.findOneAndUpdate(
      { name: fixture.name },
      {
        $setOnInsert: {
          ...fixture,
          acceptingOrders: true,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }

  if (!foodBank && pickupAddress.postalCode) {
    foodBank = await FoodBank.findOne({
      'address.postalCode': pickupAddress.postalCode,
      acceptingOrders: true,
    }).sort({ createdAt: 1 });
  }

  if (!foodBank) {
    throw createError('Pickup food bank not found', 404, 'FOOD_BANK_NOT_FOUND');
  }

  return foodBank;
}

async function validateCheckout(buyerId, payload) {
  await ensureBuyerProfile(buyerId);
  const cart = await getActiveCart(buyerId);
  const foodBank = await resolveFoodBank(payload.foodBankId, payload.pickupAddress);

  const normalizedItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product || product.status !== 'active') {
      throw createError(
        `${item.nameSnapshot} is no longer available`,
        400,
        'PRODUCT_UNAVAILABLE',
        { field: 'cart' }
      );
    }

    if (item.quantity < product.minimumOrderQty) {
      throw createError(
        `${product.name} requires a minimum quantity of ${product.minimumOrderQty}`,
        400,
        'MINIMUM_ORDER_NOT_MET',
        { field: 'cart' }
      );
    }

    if (item.quantity > product.quantityAvailable) {
      throw createError(
        `${product.name} does not have enough inventory`,
        400,
        'INSUFFICIENT_INVENTORY',
        { field: 'cart' }
      );
    }

    const lineTotal = roundCurrency(item.quantity * product.price);

    normalizedItems.push({
      productId: product._id,
      sellerId: product.sellerId,
      productNameSnapshot: product.name,
      imageSnapshot: product.images[0] || '',
      unit: product.unit,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  const subtotal = roundCurrency(
    normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0)
  );
  const paymentProcessingFee = roundCurrency(0);
  const platformFee = roundCurrency(0);
  const total = roundCurrency(subtotal + paymentProcessingFee + platformFee);

  cart.subtotal = subtotal;
  cart.selectedFoodBankId = foodBank._id;
  cart.pickupAddressSnapshot = payload.pickupAddress;
  cart.items = cart.items.map((item) => {
    const match = normalizedItems.find(
      (normalizedItem) => normalizedItem.productId.toString() === item.productId.toString()
    );

    return {
      ...item.toObject(),
      nameSnapshot: match.productNameSnapshot,
      imageSnapshot: match.imageSnapshot,
      unitPriceSnapshot: match.unitPrice,
      unit: match.unit,
      lineTotal: match.lineTotal,
    };
  });
  await cart.save();

  return {
    cart,
    foodBank,
    items: normalizedItems,
    subtotal,
    paymentProcessingFee,
    platformFee,
    total,
  };
}

function serializeValidationResult(result) {
  return {
    valid: true,
    subtotal: result.subtotal,
    fees: roundCurrency(result.paymentProcessingFee + result.platformFee),
    total: result.total,
    items: result.items.map((item) => ({
      productId: item.productId,
      sellerId: item.sellerId,
      name: item.productNameSnapshot,
      imageUrl: item.imageSnapshot,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })),
    foodBank: {
      id: result.foodBank._id,
      name: result.foodBank.name,
      address: result.foodBank.address,
      email: result.foodBank.email,
    },
  };
}

async function createCheckoutSession(buyerId, payload) {
  const result = await validateCheckout(buyerId, payload);
  const stripe = getStripeClient();

  const orderGroup = await OrderGroup.create({
    buyerId,
    orderNumber: buildOrderNumber(),
    status: 'pending_payment',
    paymentStatus: 'processing',
    fulfillmentStatus: 'pending',
    pickupAddressSnapshot: payload.pickupAddress,
    selectedFoodBankId: result.foodBank._id,
    selectedFoodBankSnapshot: {
      name: result.foodBank.name,
      email: result.foodBank.email,
      address: result.foodBank.address,
    },
    itemsSnapshot: result.items,
    subtotal: result.subtotal,
    paymentProcessingFee: result.paymentProcessingFee,
    platformFee: result.platformFee,
    total: result.total,
  });

  const payment = await Payment.create({
    orderGroupId: orderGroup._id,
    buyerId,
    amount: result.total,
    currency: 'usd',
    status: 'processing',
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: payload.successUrl,
    cancel_url: payload.cancelUrl,
    payment_method_types: ['card'],
    metadata: {
      orderGroupId: orderGroup._id.toString(),
      paymentId: payment._id.toString(),
      buyerId: buyerId.toString(),
    },
    line_items: result.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: toCents(item.unitPrice),
        product_data: {
          name: item.productNameSnapshot,
          images: item.imageSnapshot ? [item.imageSnapshot] : [],
          metadata: {
            productId: item.productId.toString(),
            sellerId: item.sellerId.toString(),
          },
        },
      },
    })),
  });

  orderGroup.stripeCheckoutSessionId = session.id;
  payment.stripeCheckoutSessionId = session.id;

  await orderGroup.save();
  await payment.save();

  return {
    orderGroup,
    session,
  };
}

async function finalizePaidOrderGroup(orderGroup, payment, paymentIntentId = null) {
  for (const item of orderGroup.itemsSnapshot) {
    const product = await Product.findById(item.productId);

    if (!product || product.status !== 'active') {
      throw createError(
        `${item.productNameSnapshot} is no longer available to fulfill`,
        400,
        'PRODUCT_UNAVAILABLE'
      );
    }

    if (product.quantityAvailable < item.quantity) {
      throw createError(
        `${item.productNameSnapshot} does not have enough inventory to fulfill`,
        400,
        'INSUFFICIENT_INVENTORY'
      );
    }
  }

  for (const item of orderGroup.itemsSnapshot) {
    const product = await Product.findById(item.productId);
    product.quantityAvailable -= item.quantity;
    product.status = product.quantityAvailable === 0 ? 'sold_out' : 'active';
    await product.save();
  }

  const existingOrders = await Order.countDocuments({ orderGroupId: orderGroup._id });

  if (existingOrders === 0) {
    await buildOrdersFromGroup(orderGroup);
  }

  payment.status = 'paid';
  payment.stripePaymentIntentId = paymentIntentId || payment.stripePaymentIntentId;

  orderGroup.status = 'confirmed';
  orderGroup.paymentStatus = 'paid';
  orderGroup.stripePaymentIntentId = paymentIntentId || orderGroup.stripePaymentIntentId;
  orderGroup.paidAt = new Date();

  await payment.save();
  await orderGroup.save();
  await Cart.findOneAndUpdate(
    { buyerId: orderGroup.buyerId },
    {
      $set: {
        items: [],
        subtotal: 0,
        selectedFoodBankId: null,
        pickupAddressSnapshot: null,
      },
    }
  );

  return { orderGroup, payment };
}

async function placeDemoOrder(buyerId, payload) {
  const result = await validateCheckout(buyerId, payload);

  const orderGroup = await OrderGroup.create({
    buyerId,
    orderNumber: buildOrderNumber(),
    status: 'confirmed',
    paymentStatus: 'paid',
    fulfillmentStatus: 'pending',
    pickupAddressSnapshot: payload.pickupAddress,
    selectedFoodBankId: result.foodBank._id,
    selectedFoodBankSnapshot: {
      name: result.foodBank.name,
      email: result.foodBank.email,
      address: result.foodBank.address,
    },
    itemsSnapshot: result.items,
    subtotal: result.subtotal,
    paymentProcessingFee: result.paymentProcessingFee,
    platformFee: result.platformFee,
    total: result.total,
    paidAt: new Date(),
  });

  const payment = await Payment.create({
    orderGroupId: orderGroup._id,
    buyerId,
    amount: result.total,
    currency: 'usd',
    status: 'paid',
  });

  await finalizePaidOrderGroup(orderGroup, payment, 'demo-payment-intent');

  return {
    orderGroup,
    payment,
  };
}

async function buildOrdersFromGroup(orderGroup) {
  const ordersBySeller = new Map();

  for (const item of orderGroup.itemsSnapshot) {
    const sellerKey = item.sellerId.toString();
    const current = ordersBySeller.get(sellerKey) || {
      orderGroupId: orderGroup._id,
      buyerId: orderGroup.buyerId,
      sellerId: item.sellerId,
      foodBankId: orderGroup.selectedFoodBankId,
      status: 'confirmed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'pending',
      items: [],
      sellerSubtotal: 0,
      buyerTotal: 0,
    };

    current.items.push({
      productId: item.productId,
      productNameSnapshot: item.productNameSnapshot,
      imageSnapshot: item.imageSnapshot,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    });
    current.sellerSubtotal = roundCurrency(current.sellerSubtotal + item.lineTotal);
    current.buyerTotal = roundCurrency(current.buyerTotal + item.lineTotal);

    ordersBySeller.set(sellerKey, current);
  }

  return Order.insertMany(Array.from(ordersBySeller.values()));
}

async function applySuccessfulCheckoutSession(session, eventId = null, eventType = null) {
  const orderGroupId = session.metadata?.orderGroupId;

  if (!orderGroupId) {
    throw createError('Stripe session is missing order group metadata', 400, 'STRIPE_METADATA_INVALID');
  }

  const orderGroup = await OrderGroup.findById(orderGroupId);

  if (!orderGroup) {
    throw createError('Order group not found for Stripe session', 404, 'ORDER_GROUP_NOT_FOUND');
  }

  const payment = await Payment.findOne({ orderGroupId: orderGroup._id });

  if (!payment) {
    throw createError('Payment record not found for Stripe session', 404, 'PAYMENT_NOT_FOUND');
  }

  if (eventId && payment.webhookEvents.some((entry) => entry.eventId === eventId)) {
    return { orderGroup, payment, alreadyProcessed: true };
  }

  if (payment.status === 'paid') {
    if (eventId) {
      payment.webhookEvents.push({
        eventId,
        type: eventType || 'checkout.session.completed',
      });
      await payment.save();
    }

    return { orderGroup, payment, alreadyProcessed: true };
  }

  payment.stripePaymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id || payment.stripePaymentIntentId;

  if (eventId) {
    payment.webhookEvents.push({
      eventId,
      type: eventType || 'checkout.session.completed',
    });
  }

  await finalizePaidOrderGroup(orderGroup, payment, payment.stripePaymentIntentId);

  return { orderGroup, payment, alreadyProcessed: false };
}

module.exports = {
  validateCheckout,
  serializeValidationResult,
  createCheckoutSession,
  placeDemoOrder,
  applySuccessfulCheckoutSession,
};
