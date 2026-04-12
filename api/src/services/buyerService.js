const Order = require('../models/Order');
const OrderGroup = require('../models/OrderGroup');

async function listBuyerOrders(buyerId) {
  return OrderGroup.find({ buyerId }).sort({ createdAt: -1 }).lean();
}

async function getBuyerOrderSummary(orderGroupIds) {
  const orders = await Order.find({ orderGroupId: { $in: orderGroupIds } }).lean();

  return orders.reduce((accumulator, order) => {
    const key = order.orderGroupId.toString();

    if (!accumulator[key]) {
      accumulator[key] = [];
    }

    accumulator[key].push(order);
    return accumulator;
  }, {});
}

module.exports = {
  listBuyerOrders,
  getBuyerOrderSummary,
};
