const { Item, sequelize, User, Order } = require("../../db");
const { updateCartTotalPrice } = require("./updateCartTotalPrice");
const postItemController = async (email, FoodId, final_price, quantity, amount) => {
  //Generamos índice de transacción para mantener la integridad referencial
  const t = await sequelize.transaction();

  try {
    // 1. Buscamos al usuario
    const user = await User.findOne({ where: { email }, transaction: t });
    if (!user) throw new Error("Usuario no encontrado");
    // 2. Buscamos la orden pendiente
    let [order, created] = await Order.findOrCreate({
      where: { UserId: user.id, status: "PENDIENTE" },
      defaults: {
        total_price: 0,
      },
      transaction: t
    });
    // Crear el nuevo artículo y asociarlo al carrito
    const newItem = await Item.create({
      FoodId,
      OrderId: order.id,
      final_price,
      quantity,
      amount,
    }, { transaction: t });

    await updateCartTotalPrice(order.id, t);
    await t.commit();
    return newItem;
  } catch (error) {
    await t.rollback(); //Deshace la operación si ocurre un error
    throw error; //Relanza el error
  }
};

module.exports = { postItemController };
