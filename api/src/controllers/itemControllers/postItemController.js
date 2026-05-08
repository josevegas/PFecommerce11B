const { Item, sequelize } = require("../../db");
const { updateCartTotalPrice } = require("./updateCartTotalPrice");
const postItemController = async (
  FoodId,
  OrderId,
  final_price,
  quantity,
  amount
) => {
  //Generamos índice de transacción para mantener la integridad referencial
  const t = await sequelize.transaction();
  // Crear el nuevo artículo y asociarlo al carrito
  try {
    const newItem = await Item.create({
      FoodId,
      OrderId,
      final_price,
      quantity,
      amount,
    }, { transaction: t });

    await updateCartTotalPrice(OrderId, t);
    await t.commit();
    return newItem;
  } catch (error) {
    await t.rollback(); //Deshace la operación si ocurre un error
    throw error; //Relanza el error
  }
};

module.exports = { postItemController };
