import { z } from 'zod'

export const usuarioSchema = z.object({
  nombreDeUsuario: z.string(),
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos 1 letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos 1 letra minúscula')
    .regex(/\d/, 'La contraseña debe contener al menos 1 número'),
  nombreCompleto: z.string(),
  email: z.string().email()
})
