const { Order } = require("../../db");

/**
 * Updates an order with new status or payment details.
 * @param {Object} params - Update parameters.
 * @param {string|number} params.orderId - The ID of the order to update.
 * @param {string} [params.order_status] - The internal order status (e.g., preparation status).
 * @param {string} [params.status] - The general order status (e.g., APROBADO).
 * @param {string} [params.payment_status_detail] - Details from the payment provider.
 * @param {string} [params.payment_id] - External payment ID.
 * @param {string} [params.payment_date] - Date of payment approval.
 */
const putOrderController = async ({
  orderId,
  order_status,
  status,
  payment_status_detail,
  payment_id,
  payment_date,
}) => {
  if (!orderId) throw new Error("orderId is required for update");

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const updateFields = {};
    
    // Conditionally add fields to update
    if (order_status !== undefined) updateFields.order_status = order_status;
    if (status !== undefined) updateFields.status = status;
    if (payment_status_detail !== undefined) updateFields.payment_status_detail = payment_status_detail;
    if (payment_id !== undefined) updateFields.payment_id = payment_id;
    if (payment_date !== undefined) updateFields.payment_date = payment_date;

    if (Object.keys(updateFields).length === 0) {
      return "No fields provided for update";
    }

    await order.update(updateFields);

    return "Order updated successfully";
  } catch (error) {
    console.error(`Error in putOrderController for ID ${orderId}:`, error.message);
    throw new Error(error.message || "Failed to update order");
  }
};

module.exports = { putOrderController };
