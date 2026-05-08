const { User } = require("../../db");

const putUserController = async (email, data) => {
  const userToUpdate = await User.findOne({
    where: { email },
  });
  if (!userToUpdate) throw new Error(`El usuario con email ${email} no existe en la base de datos.`);
  await userToUpdate.update(data);
  return userToUpdate;
};

module.exports = { putUserController };
