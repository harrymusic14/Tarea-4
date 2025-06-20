import { Router } from 'express'
import { handleUserRegister, loginUser } from '../controllers/auth.controller'

const router = Router()

router.post('/register', handleUserRegister)
router.post('/login', loginUser)

export default router
