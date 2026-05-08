const { Order } = require("../../db");

/**
 * Updates the pickup date for a specific order.
 * @param {Object} params - Update parameters.
 * @param {string|number} params.orderId - The ID of the order.
 * @param {string|Date} params.pickupDate - The new pickup date.
 */
const putPickupDateController = async ({ orderId, pickupDate }) => {
  if (!orderId || !pickupDate) {
    throw new Error("Missing orderId or pickupDate");
  }

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    await order.update({ pickup_date: pickupDate });
    
    return "Pickup date updated successfully";
  } catch (error) {
    console.error(`Error in putPickupDateController for ID ${orderId}:`, error.message);
    throw new Error(error.message || "Failed to update pickup date");
  }
};

module.exports = { putPickupDateController };