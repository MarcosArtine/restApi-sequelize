import { Usuario } from '../models/usuario.js'
import bcrypt from 'bcryptjs'
import { usuarioSchema } from '../schemas/usuarios.schemas.js'
import jwt from 'jsonwebtoken'
import { secretKey } from '../config/config.js'
import cookieParser from 'cookie-parser'
import express from 'express'

const app = express()

app.use(cookieParser())


// OBTENER TODO LOS USUARIOS
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener los usuarios' 
    })
  }
}

// OBTENER UN USUARIO
export const getUser = async (req, res) => {
  const id = req.params.id

  try {
    const usuario = await Usuario.findOne({ where: { id } })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(usuario)
  } catch (error) {
    // Manejo del error
    console.error(error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// REGISTRAR UN USUARIO
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

  res.json({
    mensaje: 'Usuario registrado correctamente'
  })
}

// LOGUEAR UN USUARIO
export const loginUser = async (req, res) => {
  const { nombreDeUsuario, contraseña } = req.body

  // Verificar si los campos están vacíos
  if (!nombreDeUsuario || !contraseña) {
    return res.status(400).json({
      error: 'Uno o más de los campos está vacío'
    })
  }

  try {
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

    res.cookie('access-token', token, {
      httpOnly: true, // La cookie solo se puede acceder desde el servidor.
      secure: process.env.NODE_ENV === 'production',  // La cookie solo se puede acceder en https.
      sameSite: 'strict' // La cookie solo se puede acceder desde la misma página.
    })

    res.json({
      mensaje: 'Usuario logueado correctamente' 
    })
  } catch (error) {
    // Manejo del error
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}


// DESLOGUEAR UN USUARIO
export const logoutUser = (req, res) => {
  res
  	.clearCookie('access-token')
  	.json({ mensaje: 'Usuario deslogueado correctamente' })
}

// ACTUALIZAR UN USUARIO
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

// ELIMINAR UN USUARIO
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const usuario = await Usuario.findOne({ where: { id } });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
}
