import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { Transaction } from '../entities/Transaction'
import { User } from '../entities/User'

const transactionRepo = AppDataSource.getRepository(Transaction)
const userRepo = AppDataSource.getRepository(User)

interface AuthRequest extends Request {
  user?: User
}

export const createTransaction = async (req: AuthRequest, res: Response) => {
  const { to_account, amount } = req.body
  const fromUser = req.user

  if (!fromUser) return res.status(401).json({ message: 'No autorizado' })
  if (!to_account || !amount) return res.status(400).json({ message: 'Campos incompletos' })

  if (fromUser.account_number === to_account)
    return res.status(400).json({ message: 'No puedes transferir a tu propia cuenta' })

  const toUser = await userRepo.findOneBy({ account_number: to_account })
  if (!toUser) return res.status(404).json({ message: 'Cuenta de destino no encontrada' })

  const amountNumber = Number(amount)
  if (isNaN(amountNumber) || amountNumber <= 0)
    return res.status(400).json({ message: 'Monto inválido' })

  if (fromUser.balance < amountNumber)
    return res.status(400).json({ message: 'Saldo insuficiente' })

  // Actualizar saldos
  fromUser.balance -= amountNumber
  toUser.balance += amountNumber
  await userRepo.save([fromUser, toUser])

  // Guardar transacción
  const newTx = transactionRepo.create({
    from_user: fromUser,
    to_user: toUser,
    amount: amountNumber,
  })

  await transactionRepo.save(newTx)

  return res.status(201).json({ message: 'Transferencia realizada', transaction: newTx })
}

export const getMyTransactions = async (req: AuthRequest, res: Response) => {
  const user = req.user
  if (!user) return res.status(401).json({ message: 'No autorizado' })

  const transactions = await transactionRepo.find({
    where: [
      { from_user: { id: user.id } },
      { to_user: { id: user.id } }
    ],
    relations: ['from_user', 'to_user'],
    order: { created_at: 'DESC' },
  })

  return res.json(transactions)
}
