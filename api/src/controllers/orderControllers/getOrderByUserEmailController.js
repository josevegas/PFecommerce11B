const { User, Order, Item, Food } = require("../../db");

/**
 * Retrieves pending orders for a specific user email.
 * @param {string} userEmail - The email of the user.
 * @returns {Promise<Array>} - List of pending orders.
 */
const getOrderByUserEmailController = async (userEmail) => {
  if (!userEmail) throw new Error("userEmail is required");

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    const orderByUserEmail = await Order.findAll({
      where: {
        UserId: user.id,
        status: "PENDIENTE",
      },
      include: {
        model: Item,
        include: Food,
      },
    });

    return orderByUserEmail;
  } catch (error) {
    console.error(`Error in getOrderByUserEmailController for ${userEmail}:`, error.message);
    throw new Error(error.message || "Failed to retrieve user orders");
  }
};

module.exports = { getOrderByUserEmailController };
