import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import menuRoutes from './routes/menu.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import stockRoutes from './routes/stock.js'
import reportRoutes from './routes/reports.js'
import employeeRoutes from './routes/employees.js'
import salaryRoutes from './routes/salaries.js'

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/stock', stockRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/salaries', salaryRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api', menuRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))

