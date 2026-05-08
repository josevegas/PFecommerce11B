const { getOrdersController } = require("../controllers/orderControllers/getOrdersController");
const { postOrderController } = require("../controllers/orderControllers/postOrderController");
const { putOrderController } = require("../controllers/orderControllers/putOrderController");
const { getUserOrdersController } = require("../controllers/orderControllers/getUserOrdersController");
const { getOrderDetailController } = require("../controllers/orderControllers/getOrderDetailController");
const { getBestSellersController } = require("../controllers/orderControllers/getBestSellersController");
const { getOrderByUserEmailController } = require("../controllers/orderControllers/getOrderByUserEmailController");
const { putPickupDateController } = require("../controllers/orderControllers/putPickupDateController");
const { getOrderByIdsController } = require("../controllers/orderControllers/getOrderByIdsController");

// Retrieves all orders (typically for admin use)
const getOrdersHandler = async (req, res, next) => {
  try {
    const allOrders = await getOrdersController();
    res.status(200).json(allOrders);
  } catch (error) {
    next(error);
  }
};

const getOrderByUserEmailHandler = async (req, res, next) => {
  const { userEmail } = req.params;
  try {
    if (!userEmail) throw new Error("User email is required");
    const orderByUserId = await getOrderByUserEmailController(userEmail);
    res.status(200).json(orderByUserId);
  } catch (error) {
    next(error);
  }
};

// Retrieves details for a specific order
const getOrderDetailHandler = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    if (!orderId) throw new Error("Order ID is required");
    const detail = await getOrderDetailController(orderId);
    res.status(200).json(detail);
  } catch (error) {
    next(error);
  }
};

// Retrieves order history for a specific user
const getUserOrdersHandler = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) throw new Error("User ID is required");
    const openOrder = await getUserOrdersController(userId);
    res.status(200).json(openOrder);
  } catch (error) {
    next(error);
  }
};

const postOrderHandler = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) throw new Error("Email is required in request body");
    const newOrder = await postOrderController(email);
    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
};

const putOrderHandler = async (req, res, next) => {
  const { orderId, order_status } = req.body;
  try {
    if (!orderId) throw new Error("Order ID is required");
    await putOrderController({ orderId, order_status });
    res.status(200).json({ message: "Orden modificada correctamente." });
  } catch (error) {
    next(error);
  }
};

const getBestSellersHandler = async (req, res, next) => {
  const quantity = parseInt(req.query.quantity, 10) || 5;
  try {
    const bestSellers = await getBestSellersController(quantity);
    res.status(200).json(bestSellers);
  } catch (error) {
    next(error);
  }
};

const putPickupDateHandler = async (req, res, next) => {
  const { orderId, pickup_date } = req.body;
  try {
    if (!orderId || !pickup_date) throw new Error("Missing orderId or pickup_date");
    await putPickupDateController({ orderId, pickupDate: pickup_date });
    res.status(200).json({ message: "Fecha de retiro actualizada correctamente" });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdsHandler = async (req, res, next) => {
  const { paymentId } = req.params;
  try {
    if (!paymentId) throw new Error("Payment ID is required");
    const orderToRender = await getOrderByIdsController(paymentId);
    res.status(200).json(orderToRender);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrdersHandler,
  getOrderByUserEmailHandler,
  postOrderHandler,
  putOrderHandler,
  getBestSellersHandler,
  getUserOrdersHandler,
  getOrderDetailHandler,
  putPickupDateHandler,
  getOrderByIdsHandler,
};
