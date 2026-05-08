const { Item, sequelize } = require("../../db");
const { updateCartTotalPrice } = require("./updateCartTotalPrice");

const deleteItemController = async (id, OrderId) => {
  const t = await sequelize.transaction();
  try {
    const itemToDelete = await Item.findByPk(id);
    if (!itemToDelete) throw new Error('El ítem no existe');

    await Item.destroy({
      where: {
        id,
      },
    }, { transaction: t });

    await updateCartTotalPrice(OrderId, t);
    await t.commit();
    return 'El ítem se ha eliminado correctamente';
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

module.exports = { deleteItemController };
