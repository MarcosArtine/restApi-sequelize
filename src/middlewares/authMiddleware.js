import jwt from 'jsonwebtoken'
import { secretKey } from '../config/config.js'

export default (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) return res.status(404).send({ auth: false, message: 'No se proveyó un token' })

  const token = authHeader.split(' ')[1]

  if (!token) return res.status(404).send({ auth: false, message: 'Token mal formado' })

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Ha fallado la autotentificación del token' })

    req.userId = decoded.id

    next()

  })

}