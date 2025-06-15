import Sequelize from 'sequelize'

export const db = new Sequelize(
  process.env.DB_NAME, // nombre de la base de datos
  process.env.DB_USER, // usuario
  process.env.DB_PASSWORD, // contraseña
  {
    host: process.env.DB_HOST, // dirección del servidor de la base de datos
    port: process.env.DB_PORT, // puerto del servidor de la base de datos
    dialect: 'mysql' // o el que uses: 'postgres', 'sqlite', etc.
  }
)
