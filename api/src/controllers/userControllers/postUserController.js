const { User } = require("../../db");
const sendEmailWelcome = require("../../nodemailer/SendEmailWelcome/sendEmail.js");

const postUserController = async (name, email, type, status, address) => {
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());

  // Determinamos el rol
  let userRole = type;
  if (ADMIN_EMAILS.includes(email)) {
    userRole = "Admin";
  }

  //findOrCreate es más eficiente y evita condiciones de carrera
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { name, email, type: userRole, status, address }
  });

  // Si el usuario ya existía, actualizamos sus datos (opcional)
  if (!created) {
    await user.update({ name, email, type: userRole, status, address });
  }

  // Solo enviar email de bienvenida si es un usuario nuevo
  if (created && userRole !== "Admin") {
    await sendEmailWelcome(email);
  }

  return user;
};

module.exports = { postUserController };
