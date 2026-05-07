const { User } = require("../../db");

const deleteFavoriteController = async (email, foodId) => {
    const userByEmail = await User.findOne({ where: { email } });
    await userByEmail.removeFood(foodId);
    return { message: 'Favorito eliminado con éxito.' };
}

module.exports = { deleteFavoriteController };