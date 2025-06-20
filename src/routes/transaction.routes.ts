import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { createTransaction, getMyTransactions } from '../controllers/transaction.controller'

const router = Router()

// 🔐 Rutas protegidas
router.post('/', authMiddleware, createTransaction)
router.get('/my', authMiddleware, getMyTransactions)

export default router
