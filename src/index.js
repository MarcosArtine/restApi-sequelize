import express from 'express'
import usuarios from './routes/usuarios.js'
import { db } from './db/database.js'
import cors from 'cors' // soluciona los problemas de CORS
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT ?? 3000;

(async () => {
  try {
    // await db.authenticate();
    await db.sync({ force: false }) // Con el valor "true" crea la tabla, eliminándola primero si ya existía.
    console.log('Conectado a la base de datos.')
  } catch (error) {
    console.error('No se ha podido conectar con la base de dato:', error)
  }
})() // funcion autoejecutable asincrona.

app.disable('x-powered-by') // Deshabilitar el header que informa de la tecnologia utilizada.

// middleware
app.use(express.json())

app.use(cors({ // Puede utilizar solo app.use(cors()) pero esto estableceria todo los origins.
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:5500' // puerto del live server
      // Agregar dirección de la web en la que subimos el proyecto.
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('No lo permite el CORS'))
  }
}))

// hago que todas las direcciones de routes usuarios esten dentro del path usuarios
app.use('/usuarios', usuarios)

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`)
})
