const { postItemController } = require("../controllers/itemControllers/postItemController");
const { putItemController } = require("../controllers/itemControllers/putItemController");
const { deleteItemController } = require("../controllers/itemControllers/deleteItemController");

const postItemHandler = async (req, res, next) => {
  try {
    const { FoodId, email, final_price, quantity, amount } = req.body;
    const setItem = await postItemController(
      email,
      FoodId,
      final_price,
      quantity,
      amount
    );
    res.status(200).json(setItem);
  } catch (error) {
    next(error);
  }
};

const deleteItemHandler = async (req, res, next) => {
  const { id } = req.params;
  const { OrderId } = req.body;
  try {
    await deleteItemController(id, OrderId);
    res.status(200).json({ message: "Se eliminó con éxito" });
  } catch (error) {
    next(error);
  }
};

const putItemHandler = async (req, res, next) => {
  const { orderId, itemId, quantity, amount } = req.body;
  try {
    const response = await putItemController(orderId, itemId, quantity, amount);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { postItemHandler, deleteItemHandler, putItemHandler };
