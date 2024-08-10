import { Usuario } from '../models/usuario.js'
import bcrypt from 'bcryptjs'
import { usuarioSchema } from '../schemas/usuarios.schemas.js'
import jwt from 'jsonwebtoken'
import { secretKey } from '../config/config.js'

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  const usuarios = await Usuario.findAll()

  // Array de usuarios.
  res.json(usuarios)
}

// Obtener un solo usuario
export const getUser = async (req, res) => {
  const id = req.params.id
  const usuario = await Usuario.findOne({ where: { id } })

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  res.json(usuario)
}

// Registrar un usuario
export const registerUser = async (req, res) => {
  // Recupero de req.body los valores
  const { nombreDeUsuario, contraseña, nombreCompleto, email } = req.body

  // Verificar si los campos están vacíos o no cumple con los requisitos de validación
  try {
    usuarioSchema.parse({ nombreDeUsuario, contraseña, nombreCompleto, email })
  } catch (error) {
    return res.status(400).json({
      error: 'Uno o más de los campos está vacío o no cumple con los requisitos de validación'
    })
  }

  const contraseñaHasheada = await bcrypt.hash(contraseña, 10) // Se escripta la contraseña usando bcrypt

  const usuario = await Usuario.create({ nombreDeUsuario, contraseña: contraseñaHasheada, nombreCompleto, email }) // crear los usuarios

  const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1h' }) // Generar el token JWT

  res.json({
    mensaje: 'Usuario registrado correctamente'
  })
}

// Loguear un usuario
export const loginUser = async (req, res) => {
  const { nombreDeUsuario, contraseña } = req.body

  // Verificar si los campos están vacíos
  if (!nombreDeUsuario || !contraseña) {
    return res.status(400).json({
      error: 'Uno o más de los campos está vacío'
    })
  }

  const usuario = await Usuario.findOne({ where: { nombreDeUsuario } })

  // Verificar si el usuario existe
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  // Verificar la contraseña
  const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)

  if (!contraseñaValida) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }

  const token = jwt.sign({ id: usuario.id }, secretKey, { expiresIn: '1h' }) // Generar el token JWT

  res.json({
    mensaje: 'Usuario logueado correctamente' 
  })
}

// Desloguear un usuario
export const logoutUser = async (req, res) => {

}

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const id = req.params.id
  const { nombreDeUsuario, contraseña, nombreCompleto, email } = req.body

  // Verificar si los campos están vacíos o no cumple con los requisitos de validación
  try {
    usuarioSchema.parse({ nombreDeUsuario, contraseña })
  } catch (error) {
    return res.status(400).json({
      error: 'Uno o más de los campos está vacío o no cumple con los requisitos de validación'
    })
  }

  const usuario = await Usuario.findOne({ where: { id } })

  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }

  const contraseñaHasheada = await bcrypt.hash(contraseña, 10) // Se escripta la contraseña usando bcrypt

  usuario.nombreDeUsuario = nombreDeUsuario
  usuario.contraseña = contraseñaHasheada
  usuario.nombreCompleto = nombreCompleto
  usuario.email = email
  await usuario.save()
  res.json({
    mensage: 'Usuario actualizado correctamente'
  })
}

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const id = req.params.id
  const usuario = await Usuario.findOne({ where: { id } })
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }
  await usuario.destroy()
  res.json({ 
    mensaje: 'Usuario eliminado correctamente'
  })
}
