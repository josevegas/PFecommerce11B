const { User, Food } = require("../../db");

const getFavoritesByEmailController = async (email) => {
    const favoritesByEmailRaw = await User.findOne({
        where: { email },
        attributes: [],
        include: [{
            model: Food,
            through: { attributes: [] },
            where: { status: true }
        }]
    });

    return favoritesByEmailRaw ? favoritesByEmailRaw.Food : [];
};

module.exports = { getFavoritesByEmailController }