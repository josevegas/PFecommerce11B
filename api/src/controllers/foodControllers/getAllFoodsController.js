const { Food, sequelize } = require("../../db");

const getAllFoodController = async () => {
  // Filtramos desde la base de datos (más rápido y eficiente)
  return await Food.findAll({
    where: { status: true },
    order: sequelize.random() // Mezcla aleatoria nativa de la DB
  });
};

module.exports = { getAllFoodController };
