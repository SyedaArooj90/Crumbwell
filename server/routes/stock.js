import { Router } from 'express'
import {
  stock,
  suppliers,
  purchaseOrders,
  purchaseOrderItems,
  products,
} from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { addStock } from '../services/stockService.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'owner'))

let nextSupplierId = 6504
let nextPoId = 7001
let nextPoItemId = 7101

// ---------- Stock levels ----------
router.get('/', (req, res) => {
  const rows = stock.map((row) => {
    const product = products.find((p) => p.product_id === row.product_id)
    return {
      ...row,
      product_name: product ? product.name : 'Removed product',
      low: row.quantity <= row.reorder_level,
    }
  })
  res.json(rows)
})

// ---------- Suppliers ----------
router.get('/suppliers', (req, res) => {
  res.json(suppliers)
})

router.post('/suppliers', (req, res) => {
  const name = (req.body.name || '').trim()
  const contact_number = (req.body.contact_number || '').trim()

  if (!name) return res.status(400).json({ message: 'Supplier name is required' })
  if (!/^[0-9+\-\s]{7,15}$/.test(contact_number)) {
    return res.status(400).json({ message: 'Enter a valid contact number' })
  }
  if (suppliers.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ message: 'This supplier already exists' })
  }

  const supplier = { supplier_id: nextSupplierId++, name, contact_number }
  suppliers.push(supplier)
  res.status(201).json(supplier)
})

router.delete('/suppliers/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = suppliers.findIndex((s) => s.supplier_id === id)

  if (index === -1) return res.status(404).json({ message: 'Supplier not found' })
  if (purchaseOrders.some((po) => po.supplier_id === id)) {
    return res.status(409).json({ message: 'This supplier has purchase orders, so it cannot be removed' })
  }

  suppliers.splice(index, 1)
  res.json({ message: 'Supplier removed' })
})

// ---------- Purchase orders ----------
function poView(po) {
  const supplier = suppliers.find((s) => s.supplier_id === po.supplier_id)
  const items = purchaseOrderItems.filter((i) => i.po_id === po.po_id)
  return {
    ...po,
    supplier_name: supplier ? supplier.name : 'Removed supplier',
    items,
    total_cost: items.reduce((sum, i) => sum + i.quantity * i.unit_cost, 0),
  }
}

router.get('/purchase-orders', (req, res) => {
  res.json([...purchaseOrders].reverse().map(poView))
})

router.post('/purchase-orders', (req, res) => {
  const supplier_id = Number(req.body.supplier_id)
  const lines = Array.isArray(req.body.items) ? req.body.items : []

  if (!suppliers.some((s) => s.supplier_id === supplier_id)) {
    return res.status(400).json({ message: 'Choose a valid supplier' })
  }
  if (lines.length === 0 || lines.length > 30) {
    return res.status(400).json({ message: 'Add between 1 and 30 items' })
  }

  const cleaned = []
  for (const line of lines) {
    const product = products.find((p) => p.product_id === Number(line.product_id))
    const quantity = Number(line.quantity)
    const unit_cost = Number(line.unit_cost)

    if (!product) return res.status(400).json({ message: 'One of the products does not exist' })
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) {
      return res.status(400).json({ message: 'Quantity must be a whole number from 1 to 10000' })
    }
    if (!Number.isFinite(unit_cost) || unit_cost <= 0) {
      return res.status(400).json({ message: 'Cost per unit must be above 0' })
    }
    cleaned.push({ product, quantity, unit_cost })
  }

  const po = {
    po_id: nextPoId++,
    supplier_id,
    ordered_by: req.user.user_id,
    order_date: new Date().toISOString(),
    status: 'ordered',
    received_date: null,
  }
  purchaseOrders.push(po)

  cleaned.forEach(({ product, quantity, unit_cost }) => {
    purchaseOrderItems.push({
      po_item_id: nextPoItemId++,
      po_id: po.po_id,
      product_id: product.product_id,
      product_name: product.name,
      quantity,
      unit_cost,
    })
  })

  res.status(201).json(poView(po))
})

// The goods arrived: now the stock goes up
router.patch('/purchase-orders/:id/receive', (req, res) => {
  const po = purchaseOrders.find((p) => p.po_id === Number(req.params.id))

  if (!po) return res.status(404).json({ message: 'Purchase order not found' })
  if (po.status !== 'ordered') {
    return res.status(409).json({ message: 'This purchase order is already closed' })
  }

  purchaseOrderItems
    .filter((i) => i.po_id === po.po_id)
    .forEach((i) => addStock(i.product_id, i.quantity))

  po.status = 'received'
  po.received_date = new Date().toISOString()
  res.json(poView(po))
})

router.patch('/purchase-orders/:id/cancel', (req, res) => {
  const po = purchaseOrders.find((p) => p.po_id === Number(req.params.id))

  if (!po) return res.status(404).json({ message: 'Purchase order not found' })
  if (po.status !== 'ordered') {
    return res.status(409).json({ message: 'This purchase order is already closed' })
  }

  po.status = 'cancelled'
  res.json(poView(po))
})

export default router