const { User } = require("../../db");

const getAllUsersController = async () => {
  const allUsers = await User.findAll({
    where: { status: "Activo" },
    order: [["name", "ASC"]]
  });
  return allUsers;
};

module.exports = { getAllUsersController };