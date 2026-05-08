const { sequelize } = require('./src/db.js');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('--- Iniciando migración de modelos ---');
    // Usamos alter: true para actualizar las tablas sin borrar los datos si ya existen,
    // o crearlas si no están.
    await sequelize.sync({ alter: true });
    console.log('✅ Migración completada exitosamente.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  }
};

migrate();
