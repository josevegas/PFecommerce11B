const { Op } = require("sequelize");
const { Food } = require("../../db");

const getFoodByNameController = async (name) => {
  return await Food.findAll({
    where: { status: true, name: { [Op.iLike]: `%${name}%` } },
  });
};

module.exports = { getFoodByNameController };
