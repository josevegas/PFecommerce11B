const { Food } = require("../../db");

const getAdminFoodController = async () => {
  return await Food.findAll({
    order: sequelize.random() // Mezcla aleatoria nativa de la DB
  });
};

module.exports = { getAdminFoodController };
