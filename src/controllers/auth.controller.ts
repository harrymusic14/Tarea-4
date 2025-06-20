import { Request, Response } from 'express'
import { User } from '../entities/User'
import { AppDataSource } from '../config/data-source'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generateAccountNumber } from '../utils/generateAccountNumber'
import { sendConfirmationEmail } from '../services/mailer'

const userRepo = AppDataSource.getRepository(User)

export const handleUserRegister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const userExists = await userRepo.findOneBy({ email })
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = userRepo.create({
      name,
      email,
      password: hashedPassword,
      account_number: generateAccountNumber(),
      balance: 0,
    })

    await userRepo.save(newUser)

    await sendConfirmationEmail(email, name, newUser.account_number)

    return res.status(201).json({ message: 'Usuario registrado con éxito' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}

// ✅ ESTA ES LA FUNCIÓN QUE FALTABA EXPORTAR
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }

    const user = await userRepo.findOneBy({ email })
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    )

    return res.json({ token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
}
