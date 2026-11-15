import { Router } from 'express'
import { employees, salaryPayments, nextId } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'owner'))

const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

router.get('/', (req, res) => {
  const rows = [...salaryPayments].reverse().map((p) => {
    const employee = employees.find((e) => e.employee_id === p.employee_id)
    return { ...p, employee_name: employee ? employee.name : 'Removed employee' }
  })
  res.json(rows)
})

router.post('/', (req, res) => {
  const employee_id = Number(req.body.employee_id)
  const amount = Number(req.body.amount)
  const month = (req.body.month || '').trim()

  const employee = employees.find((e) => e.employee_id === employee_id)
  if (!employee) return res.status(400).json({ message: 'Choose a valid employee' })
  if (!employee.active) return res.status(400).json({ message: 'This employee is not active' })
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be a number above 0' })
  }
  if (!MONTH_PATTERN.test(month)) {
    return res.status(400).json({ message: 'Month must look like 2026-11' })
  }
  if (salaryPayments.some((p) => p.employee_id === employee_id && p.month === month)) {
    return res.status(409).json({ message: 'This employee is already paid for that month' })
  }

  const payment = {
    salary_id: nextId(salaryPayments, 'salary_id', 6801),
    employee_id,
    amount,
    month,
    paid_date: new Date().toISOString(),
    paid_by: req.user.user_id,
  }
  salaryPayments.push(payment)
  res.status(201).json(payment)
})

export default router