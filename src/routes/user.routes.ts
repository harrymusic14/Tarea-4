import { Router, Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { authMiddleware } from '../middlewares/auth.middleware'
import { User } from '../entities/User'
import { Transaction } from '../entities/Transaction'

const router = Router()

router.get(
  '/me',
  authMiddleware,
  async (req: Request & { user?: User }, res: Response) => {
    try {
      const userRepo = AppDataSource.getRepository(User)

      const user = await userRepo.findOne({
        where: { id: req.user!.id },
        relations: ['sentTransactions', 'receivedTransactions'],
      })

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        account_number: user.account_number,
        balance: user.balance,
        sentTransactions: user.sentTransactions,
        receivedTransactions: user.receivedTransactions,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error en el servidor' })
    }
  }
)

export default router
