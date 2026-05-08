const { Order, User } = require("../../db");

/**
 * Retrieves the ID of a pending order for a specific user email.
 * @param {string} userEmail - The email of the user.
 * @returns {Promise<string|number|null>} - The pending order ID or null.
 */
const getPendingOrderByUserEmailController = async (userEmail) => {
  if (!userEmail) throw new Error("userEmail is required");

  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    const userOrder = await Order.findOne({
      where: {
        UserId: user.id,
        status: "PENDIENTE",
      },
    });

    return userOrder ? userOrder.id : null;
  } catch (error) {
    console.error(`Error in getPendingOrderByUserEmailController for ${userEmail}:`, error.message);
    throw new Error(error.message || "Failed to retrieve pending order ID");
  }
};

module.exports = { getPendingOrderByUserEmailController };
