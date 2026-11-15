import { Router } from 'express'
import { employees, nextId } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { salaryPayments } from '../data/store.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'owner'))

router.get('/', (req, res) => {
  res.json(employees)
})

router.post('/', (req, res) => {
  const name = (req.body.name || '').trim()
  const role = (req.body.role || '').trim()
  const phone = (req.body.phone || '').trim()

  if (!name) return res.status(400).json({ message: 'Employee name is required' })
  if (!role) return res.status(400).json({ message: 'Employee role is required' })
  if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) {
    return res.status(400).json({ message: 'Enter a valid phone number' })
  
  }

  const employee = {
    employee_id: nextId(employees, 'employee_id', 6701),
    name,
    role,
    phone,
    join_date: new Date().toISOString().slice(0, 10),
    active: true,
  }
  employees.push(employee)
  res.status(201).json(employee)
})

router.put('/:id', (req, res) => {
  const employee = employees.find((e) => e.employee_id === Number(req.params.id))
  if (!employee) return res.status(404).json({ message: 'Employee not found' })

  const { name, role, phone, active } = req.body
  if (name !== undefined) employee.name = String(name).trim()
  if (role !== undefined) employee.role = String(role).trim()
  if (phone !== undefined) employee.phone = String(phone).trim()
  if (active !== undefined) employee.active = Boolean(active)

  res.json(employee)
})

router.delete('/:id', (req, res) => {
  const index = employees.findIndex((e) => e.employee_id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: 'Employee not found' })

  if (salaryPayments.some((p) => p.employee_id === employees[index].employee_id)) {
    return res.status(409).json({ message: 'This employee has salary records, so mark them inactive instead' })
  }

  employees.splice(index, 1)
  res.json({ message: 'Employee removed' })
})

export default router