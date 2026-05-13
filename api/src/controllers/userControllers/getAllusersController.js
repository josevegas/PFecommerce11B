const { User } = require("../../db");

const getAllUsersController = async () => {
  const allUsers = await User.findAll({
    where: { status: true },
    order: [["name", "ASC"]]
  });
  return allUsers;
};

module.exports = { getAllUsersController };