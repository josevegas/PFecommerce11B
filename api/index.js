const app = require('./src/app.js');
const { sequelize } = require('./src/db.js');
require('dotenv').config();

// Definimos un valor por defecto por seguridad, 
// aunque Railway debería inyectar esta variable.
const PORT = process.env.PORT || 3000;

// Sincronización de la base de datos
// 'force: false' es vital en producción para no borrar tus tablas.
sequelize.sync({ force: false }).then(() => {
  console.log('Conectado a la base de datos correctamente');

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});