const { User } = require("../../db");

const postFavoriteController = async (email, foodId) => {
  const userByEmail = await User.findOne({ where: { email } });
  if (!userByEmail) throw new Error("Usuario no encontrado");
  await userByEmail.addFood(foodId);
  return { message: 'Favorito agregado con éxito.' }
};

module.exports = { postFavoriteController };