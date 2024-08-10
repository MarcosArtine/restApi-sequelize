import { DataTypes } from 'sequelize'
import { db } from '../db/database.js'

// No se define el id por que se genera automaticamente
export const Usuario = db.define('usuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreDeUsuario: {
    type: DataTypes.STRING,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING
  },
  nombreCompleto: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: false // Este objeto produce que la tabla no agrege las fechas de creación y edición.
})
