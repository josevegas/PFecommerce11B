const { Item, Order } = require("../../db");

const updateCartTotalPrice = async (orderId, t) => {//Acepta una transacción 't'
  // Sumamos todos los 'amount' directamente en la base de datos
  const totalPrice = await Item.sum('amount', {
    where: {
      OrderId: orderId,
    },
    transaction: t,
  }) || 0;
  await Order.update(
    { total_price: totalPrice },
    {
      where: {
        id: orderId,
      },
      transaction: t,
    }
  );
};

module.exports = { updateCartTotalPrice };
