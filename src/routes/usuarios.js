import Router from 'express'
import { deleteUser, getAllUsers, getUser, registerUser, loginUser, logoutUser, updateUser } from '../controllers/usuarios.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js' // Usamos el middleware para verificar el token

// Cambio el codigo de las rutas "app" por "router"
const router = Router()

// OBTENER TODOS LOS USUARIOS
router.get('/', authMiddleware, getAllUsers) // Usamos el middleware para verificar el token

// OBTENER UN SOLO USUARIO
router.get('/:id', authMiddleware, getUser) // Usamos el middleware para verificar el token

// REFISTRO DE UN USUARIO
router.post('/register', registerUser)

// INGRESO DE UN USUARIO
router.post('/login', loginUser)

// SALIDA DE UN USUARIO
router.post('/logout', logoutUser)

// ACTUALIZAR UN USUARIO
router.put('/:id', updateUser)

// ELIMINAR UN USUARIO
router.delete('/:id', deleteUser)

export default router
