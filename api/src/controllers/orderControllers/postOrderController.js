const { User, Order, Item, Food } = require("../../db");

/**
 * Creates or retrieves a pending order for a specific user email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - The pending order object.
 */
const postOrderController = async (email) => {
  if (!email) throw new Error("Email is required to create/fetch an order");

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    const userId = user.id;

    // Find or Create logic for a PENDING order
    let userOrder = await Order.findOne({
      where: {
        UserId: userId,
        status: "PENDIENTE",
      },
      include: [
        {
          model: Item,
          include: Food,
        },
      ],
    });

    if (!userOrder) {
      userOrder = await Order.create({
        UserId: userId,
        status: "PENDIENTE",
      });
      
      // Reload to include associations if needed, though a new order is empty
      userOrder = await Order.findByPk(userOrder.id, {
        include: [
          {
            model: Item,
            include: Food,
          },
        ],
      });
    }

    return userOrder;
  } catch (error) {
    console.error(`Error in postOrderController for email ${email}:`, error.message);
    throw new Error(error.message || "Failed to process order request");
  }
};

module.exports = { postOrderController };

