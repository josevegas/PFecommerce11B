const { User } = require("../../db");

const getUserByEmailController = async (email) => {
  const userByEmail = await User.findOne({
    where: {
      email
    }
  });
  return userByEmail || null;
};

module.exports = { getUserByEmailController };
