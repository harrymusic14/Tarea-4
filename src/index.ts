import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './config/data-source'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import transactionRoutes from './routes/transaction.routes'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/transactions', transactionRoutes)

// Ruta base
app.get('/', (_, res) => {
  res.send('Servidor bancario funcionando 🚀')
})

// Conexión a base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('📦 Base de datos conectada')
    app.listen(port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('❌ Error al conectar la base de datos:', error)
  })
