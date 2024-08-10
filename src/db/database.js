import Sequelize from 'sequelize'

export const db = new Sequelize('usuariosDB', 'asterion', '05abril1992', {
  host: 'localhost',
  dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
})
