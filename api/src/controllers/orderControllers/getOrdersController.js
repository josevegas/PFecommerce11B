const { Order, User } = require("../../db");

/**
 * Retrieves all orders with associated user information.
 * @returns {Promise<Array>} - List of all orders.
 */
const getOrdersController = async () => {
  try {
    const allOrders = await Order.findAll({
      attributes: ['id', 'total_price', 'createdAt', 'status', 'UserId', 'payment_status_detail', 'order_status'],
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']] // Show most recent orders first
    });

    return allOrders;
  } catch (error) {
    console.error("Error in getOrdersController:", error.message);
    throw new Error("Failed to retrieve orders list");
  }
};

module.exports = { getOrdersController };
