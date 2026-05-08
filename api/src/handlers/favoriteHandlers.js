const { postFavoriteController } = require("../controllers/favoriteControllers/postFavoriteController.js");
const { getFavoritesByEmailController } = require("../controllers/favoriteControllers/getFavoritesByEmailController.js");
const { deleteFavoriteController } = require("../controllers/favoriteControllers/deleteFavoriteController.js");

const postFavoriteHandler = async (req, res, next) => {
  const { email, foodId } = req.body;
  try {
    if (!email || !foodId) throw new Error("Falta información en el body (email, foodId)");
    const response = await postFavoriteController(email, foodId);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

const getFavoritesByEmailHandler = async (req, res, next) => {
  const { email } = req.params;
  try {
    if (!email) throw new Error("Email is required");
    const favoritesByEmail = await getFavoritesByEmailController(email);
    res.status(200).json(favoritesByEmail);
  } catch (error) {
    next(error);
  }
};

const deleteFavoriteHandler = async (req, res, next) => {
  const { email, foodId } = req.params;
  try {
    if (!email || !foodId) throw new Error("Missing email or foodId in params");
    const response = await deleteFavoriteController(email, foodId);
    res.status(200).json({ message: "Eliminado de favoritos", response });
  } catch (error) {
    next(error);
  }
};

module.exports = { postFavoriteHandler, getFavoritesByEmailHandler, deleteFavoriteHandler };