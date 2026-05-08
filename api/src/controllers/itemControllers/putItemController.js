const { Item, sequelize } = require("../../db");
const { updateCartTotalPrice } = require("./updateCartTotalPrice");

const putItemController = async (orderId, itemId, quantity, amount) => {
  const t = await sequelize.transaction();
  try {
    const [uodatedRows] = await Item.update(
      { quantity, amount },
      {
        where: {
          id: itemId,
        },
        transaction: t
      }
    );
    if (updatedRows === 0) throw new Error("Item no actualizado");
    await updateCartTotalPrice(orderId, t);
    await t.commit();
    return "Item actualizado correctamente";
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = { putItemController };
