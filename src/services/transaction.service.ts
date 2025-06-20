// src/services/transaction.service.ts
import { AppDataSource } from '../config/data-source'
import { User } from '../entities/User'
import { Transaction } from '../entities/Transaction'

export const makeTransfer = async (
  fromUserId: string,
  toAccountNumber: string,
  amount: number
) => {
  const userRepo = AppDataSource.getRepository(User)
  const transactionRepo = AppDataSource.getRepository(Transaction)

  if (amount <= 0) {
    throw new Error('El monto debe ser mayor a cero')
  }

  const fromUser = await userRepo.findOneBy({ id: fromUserId })
  if (!fromUser) {
    throw new Error('Usuario emisor no encontrado')
  }

  if (fromUser.balance < amount) {
    throw new Error('Saldo insuficiente')
  }

  const toUser = await userRepo.findOneBy({ account_number: toAccountNumber })
  if (!toUser) {
    throw new Error('Usuario receptor no encontrado')
  }

  if (fromUser.id === toUser.id) {
    throw new Error('No puedes transferirte a ti mismo')
  }

  // Crear y guardar la transacción
  const transaction = transactionRepo.create({
    amount,
    from_user: fromUser,
    to_user: toUser,
  })
  await transactionRepo.save(transaction)

  // Actualizar saldos
  fromUser.balance -= amount
  toUser.balance += amount

  await userRepo.save(fromUser)
  await userRepo.save(toUser)

  return transaction
}
