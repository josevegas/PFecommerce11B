const { User, Order, Item, Food } = require("../../db");

/**
 * Creates or retrieves a pending order for a specific user email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - The pending order object.
 */
const postOrderController = async (email) => {
  if (!email) throw new Error("Se requiere el email del usuario para crear una orden");

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error(`Usuario con email ${email} no encontrado`);
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

  return userOrder || null;
};

module.exports = { postOrderController };

