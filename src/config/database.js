const { Sequelize } = require('sequelize');

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    ssl: isProduction, // Habilitar SSL solo en producción
    dialectOptions: {
      ssl: {
        require: isProduction, // Requiere certificado SSL solo en producción
        rejectUnauthorized: false // Ignorar errores de certificado no válidos (solo para desarrollo, no lo uses en producción)
      }
    }
  }
);

module.exports = sequelize;
