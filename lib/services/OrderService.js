const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }
  static async getAllOrders() {
    const orders = await Order.getOrders();
    return orders;
  }
  static async getOneOrder({ id }) {
    const order = await Order.getOrders();
    return order;
  }
  static async changeAnOrder( id, quantity ) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order changed to ${quantity}`
    );
    const changed = await Order.changeOrder(id, quantity);
    return changed;
  }
  static async deleteAnItem(id) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order deleted`
    )
    const deleted = await Order.deleteOrder(id);
    return deleted;
  }
};


