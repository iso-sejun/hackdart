const BuyerProfile = require('../models/BuyerProfile');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function ensureBuyerProfile(userId) {
  const profile = await BuyerProfile.findOne({ userId });

  if (!profile) {
    const error = new Error('Buyer profile not found');
    error.statusCode = 404;
    error.code = 'BUYER_PROFILE_NOT_FOUND';
    throw error;
  }

  return profile;
}

function computeLineTotal(quantity, unitPrice) {
  return Number((quantity * unitPrice).toFixed(2));
}

function computeSubtotal(items) {
  return Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
}

async function getOrCreateCart(buyerId) {
  await ensureBuyerProfile(buyerId);

  let cart = await Cart.findOne({ buyerId });

  if (!cart) {
    cart = await Cart.create({
      buyerId,
      items: [],
      subtotal: 0,
    });
  }

  return cart;
}

async function getCart(buyerId) {
  return getOrCreateCart(buyerId);
}

async function addCartItem(buyerId, payload) {
  const cart = await getOrCreateCart(buyerId);
  const product = await Product.findById(payload.productId);

  if (!product || !['active', 'sold_out'].includes(product.status)) {
    const error = new Error('Product is not available');
    error.statusCode = 404;
    error.code = 'PRODUCT_UNAVAILABLE';
    throw error;
  }

  if (payload.quantity < product.minimumOrderQty) {
    const error = new Error(`Minimum order quantity is ${product.minimumOrderQty}`);
    error.statusCode = 400;
    error.code = 'MINIMUM_ORDER_NOT_MET';
    throw error;
  }

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === payload.productId.toString()
  );

  const nextQuantity = (existingItem ? existingItem.quantity : 0) + payload.quantity;

  if (nextQuantity > product.quantityAvailable) {
    const error = new Error('Requested quantity exceeds available inventory');
    error.statusCode = 400;
    error.code = 'INSUFFICIENT_INVENTORY';
    throw error;
  }

  if (existingItem) {
    existingItem.quantity = nextQuantity;
    existingItem.unitPriceSnapshot = product.price;
    existingItem.lineTotal = computeLineTotal(nextQuantity, product.price);
    existingItem.nameSnapshot = product.name;
    existingItem.imageSnapshot = product.images[0];
    existingItem.unit = product.unit;
  } else {
    cart.items.push({
      productId: product._id,
      sellerId: product.sellerId,
      nameSnapshot: product.name,
      imageSnapshot: product.images[0],
      unitPriceSnapshot: product.price,
      unit: product.unit,
      quantity: payload.quantity,
      lineTotal: computeLineTotal(payload.quantity, product.price),
    });
  }

  cart.subtotal = computeSubtotal(cart.items);
  await cart.save();
  return cart;
}

async function updateCartItem(buyerId, cartItemId, payload) {
  const cart = await getOrCreateCart(buyerId);
  const item = cart.items.id(cartItemId);

  if (!item) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    error.code = 'CART_ITEM_NOT_FOUND';
    throw error;
  }

  const product = await Product.findById(item.productId);

  if (!product || !['active', 'sold_out'].includes(product.status)) {
    const error = new Error('Product is no longer available');
    error.statusCode = 400;
    error.code = 'PRODUCT_UNAVAILABLE';
    throw error;
  }

  if (payload.quantity < product.minimumOrderQty) {
    const error = new Error(`Minimum order quantity is ${product.minimumOrderQty}`);
    error.statusCode = 400;
    error.code = 'MINIMUM_ORDER_NOT_MET';
    throw error;
  }

  if (payload.quantity > product.quantityAvailable) {
    const error = new Error('Requested quantity exceeds available inventory');
    error.statusCode = 400;
    error.code = 'INSUFFICIENT_INVENTORY';
    throw error;
  }

  item.quantity = payload.quantity;
  item.unitPriceSnapshot = product.price;
  item.lineTotal = computeLineTotal(payload.quantity, product.price);
  item.nameSnapshot = product.name;
  item.imageSnapshot = product.images[0];
  item.unit = product.unit;

  cart.subtotal = computeSubtotal(cart.items);
  await cart.save();
  return cart;
}

async function removeCartItem(buyerId, cartItemId) {
  const cart = await getOrCreateCart(buyerId);
  const item = cart.items.id(cartItemId);

  if (!item) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    error.code = 'CART_ITEM_NOT_FOUND';
    throw error;
  }

  item.deleteOne();
  cart.subtotal = computeSubtotal(cart.items);
  await cart.save();
  return cart;
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
