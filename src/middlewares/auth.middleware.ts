import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppDataSource } from '../config/data-source'
import { User } from '../entities/User'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET || 'secretkey'
    const decoded = jwt.verify(token, secret) as { id: string }

    const userRepo = AppDataSource.getRepository(User)
    const user = await userRepo.findOneBy({ id: decoded.id })

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    // 👇 Esta línea es CLAVE para que TypeScript no marque error
    (req as Request & { user?: User }).user = user

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}
