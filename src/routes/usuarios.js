import Router from 'express'
import { deleteUser, getAllUsers, getUser, registerUser, loginUser, logoutUser, updateUser } from '../controllers/usuarios.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js' // Usamos el middleware para verificar el token

// Cambio el codigo de las rutas "app" por "router"
const router = Router()

// Obtener todos los usuarios
router.get('/', authMiddleware, getAllUsers) // Usamos el middleware para verificar el token

// Obtener un solo usuario
router.get('/:id', authMiddleware, getUser) // Usamos el middleware para verificar el token

// Registro un usuario
router.post('/register', registerUser)

// Ingreso de un usuario
router.post('/login', loginUser)

// Salida de un usuario
router.post('/logout', logoutUser)

// Actualizar un usuario
router.put('/:id', updateUser)

// Eliminar un usuario
router.delete('/:id', deleteUser)

export default router
