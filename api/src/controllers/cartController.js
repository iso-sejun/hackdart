const cartService = require('../services/cartService');

function serializeCart(cart) {
  return {
    id: cart._id,
    subtotal: cart.subtotal,
    selectedFoodBankId: cart.selectedFoodBankId,
    pickupAddressSnapshot: cart.pickupAddressSnapshot,
    items: cart.items.map((item) => ({
      cartItemId: item._id,
      productId: item.productId,
      sellerId: item.sellerId,
      name: item.nameSnapshot,
      imageUrl: item.imageSnapshot,
      unitPrice: item.unitPriceSnapshot,
      unit: item.unit,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    })),
  };
}

async function getCart(req, res, next) {
  try {
    const cart = await cartService.getCart(req.auth.sub);

    res.json({
      data: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

async function addCartItem(req, res, next) {
  try {
    const cart = await cartService.addCartItem(req.auth.sub, req.body);

    res.status(201).json({
      data: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

async function updateCartItem(req, res, next) {
  try {
    const cart = await cartService.updateCartItem(req.auth.sub, req.params.cartItemId, req.body);

    res.json({
      data: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

async function removeCartItem(req, res, next) {
  try {
    const cart = await cartService.removeCartItem(req.auth.sub, req.params.cartItemId);

    res.json({
      data: serializeCart(cart),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
};
