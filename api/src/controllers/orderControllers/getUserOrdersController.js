const { Order, Item, Food } = require("../../db");

/**
 * Retrieves all orders for a specific user ID.
 * @param {string|number} userId - The ID of the user.
 * @returns {Promise<Array>} - List of user orders.
 */
const getUserOrdersController = async (userId) => {
  if (!userId) throw new Error("userId is required");

  try {
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: {
        model: Item,
        include: Food,
      },
      order: [['createdAt', 'DESC']]
    });

    return orders;
  } catch (error) {
    console.error(`Error in getUserOrdersController for ID ${userId}:`, error.message);
    throw new Error(error.message || "Failed to retrieve user orders");
  }
};

module.exports = { getUserOrdersController };