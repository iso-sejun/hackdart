const buyerService = require('../services/buyerService');

function serializeOrder(order) {
  return {
    orderId: order._id,
    sellerId: order.sellerId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    fulfillmentStatus: order.fulfillmentStatus,
    items: order.items.map((item) => ({
      productId: item.productId,
      productName: item.productNameSnapshot,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      imageUrl: item.imageSnapshot,
    })),
    buyerTotal: order.buyerTotal,
    createdAt: order.createdAt,
  };
}

async function listOrders(req, res, next) {
  try {
    const orderGroups = await buyerService.listBuyerOrders(req.auth.sub);
    const ordersByGroup = await buyerService.getBuyerOrderSummary(orderGroups.map((group) => group._id));

    res.json({
      data: {
        orders: orderGroups.map((group) => ({
          orderGroupId: group._id,
          orderNumber: group.orderNumber,
          status: group.status,
          paymentStatus: group.paymentStatus,
          fulfillmentStatus: group.fulfillmentStatus,
          total: group.total,
          createdAt: group.createdAt,
          foodBank: {
            id: group.selectedFoodBankId,
            name: group.selectedFoodBankSnapshot.name,
            address: group.selectedFoodBankSnapshot.address,
          },
          orders: (ordersByGroup[group._id.toString()] || []).map(serializeOrder),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrders,
};
