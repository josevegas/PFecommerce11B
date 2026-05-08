const { Order, User, Food, Item, Review } = require("../../db");

/**
 * Retrieves detailed information for a specific order.
 * @param {string|number} orderId - The ID of the order.
 * @returns {Promise<Object>} - The order detail object.
 */
const getOrderDetailController = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");

  try {
    const order = await Order.findOne({
      where: { id: orderId },
      attributes: ['id', 'total_price', 'order_status', 'status', 'payment_status_detail', 'createdAt'],
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: Item,
          attributes: ['id', 'amount', 'unit_price'],
          include: [
            {
              model: Food,
              attributes: ['id', 'name', 'image', 'final_price'],
            },
            {
              model: Review,
              attributes: ["comment", "rating"]
            }
          ],
        },
      ],
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return order;
  } catch (error) {
    console.error(`Error in getOrderDetailController for ID ${orderId}:`, error.message);
    throw new Error(error.message || "Failed to retrieve order details");
  }
};

module.exports = { getOrderDetailController };
