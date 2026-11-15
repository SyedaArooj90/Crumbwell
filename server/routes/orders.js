import { Router } from 'express'
import { orders, orderItems, bills } from '../data/store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { findCart, cartView, removeCart, requireSession } from './cart.js'
import { placeOrder } from '../services/orderService.js'
import { addStock } from '../services/stockService.js'

const router = Router()
const STAFF = ['admin', 'owner', 'salesperson']
const STATUSES = ['pending', 'ready', 'completed', 'cancelled']

// An order together with its items and its bill
function orderView(order) {
  return {
    ...order,
    items: orderItems.filter((i) => i.order_id === order.order_id),
    bill: bills.find((b) => b.order_id === order.order_id),
  }
}

// Place an order from my cart
router.post('/', requireAuth, requireSession, (req, res) => {
  const customer_name = (req.body.customer_name || '').trim()
  const phone = (req.body.phone || '').trim()
  const order_type = req.body.order_type
  const address = (req.body.address || '').trim()

  if (!customer_name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' })
  }
  if (!/^[0-9+\-\s]{7,15}$/.test(phone)) {
    return res.status(400).json({ message: 'Enter a valid phone number' })
  }
  if (!['pickup', 'delivery'].includes(order_type)) {
    return res.status(400).json({ message: 'Choose pickup or delivery' })
  }
  if (order_type === 'delivery' && !address) {
    return res.status(400).json({ message: 'An address is required for delivery' })
  }

  const cart = findCart(req)
  const view = cartView(cart)
  if (!cart || view.items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' })
  }

  try {
    const result = placeOrder({
      userId: req.user.user_id,
      customerName: customer_name,
      phone,
      orderType: order_type,
      address,
      items: view.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
    })

    // The order is saved, so now the cart can go
    removeCart(cart)
    res.status(201).json(orderView(result.order))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// My own orders
router.get('/mine', requireAuth, (req, res) => {
  const mine = orders.filter((o) => o.user_id === req.user.user_id)
  res.json([...mine].reverse().map(orderView))
})

// Every order (staff only)
router.get('/', requireAuth, requireRole(...STAFF), (req, res) => {
  res.json([...orders].reverse().map(orderView))
})

// One order with its bill: the customer who placed it, or staff
router.get('/:id', requireAuth, (req, res) => {
  const order = orders.find((o) => o.order_id === Number(req.params.id))
  if (!order) return res.status(404).json({ message: 'Order not found' })

  const isStaff = STAFF.includes(req.user.role)
  if (!isStaff && order.user_id !== req.user.user_id) {
    return res.status(403).json({ message: 'This is not your order' })
  }

  res.json(orderView(order))
})

// Change the status of an order (staff only)
router.patch('/:id/status', requireAuth, requireRole(...STAFF), (req, res) => {
  const order = orders.find((o) => o.order_id === Number(req.params.id))
  const { status } = req.body

  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Unknown status' })
  }
  if (order.status === 'completed' || order.status === 'cancelled') {
    return res.status(409).json({ message: 'This order is already closed' })
  }

  order.status = status

    // A cancelled order puts its items back into stock
  if (status === 'cancelled') {
    orderItems
      .filter((i) => i.order_id === order.order_id)
      .forEach((i) => addStock(i.product_id, i.quantity))
  }

  // Completing an order means the money was collected. Cancelling voids the bill.
  const bill = bills.find((b) => b.order_id === order.order_id)
    if (bill && status === 'completed') {
    bill.payment_status = 'paid'
    bill.paid_date = new Date().toISOString()
  }
  if (bill && status === 'cancelled') bill.payment_status = 'void'

  res.json(orderView(order))
})

const PAYMENT_METHODS = ['cash', 'card']

// A sale at the counter: paid on the spot, so the order is completed straight away
router.post('/counter', requireAuth, requireRole(...STAFF), (req, res) => {
  const customer_name = (req.body.customer_name || '').trim().slice(0, 60) || 'Walk-in customer'
  const payment_method = req.body.payment_method
  const lines = Array.isArray(req.body.items) ? req.body.items : []

  if (!PAYMENT_METHODS.includes(payment_method)) {
    return res.status(400).json({ message: 'Choose cash or card' })
  }
  if (lines.length === 0 || lines.length > 50) {
    return res.status(400).json({ message: 'Add at least one item' })
  }

  // Join repeated products into one line, so the stock check sees the full quantity
  const merged = new Map()
  for (const line of lines) {
    const id = Number(line.product_id)
    merged.set(id, (merged.get(id) || 0) + Number(line.quantity))
  }
  const items = [...merged].map(([product_id, quantity]) => ({ product_id, quantity }))

  try {
    const result = placeOrder({
      userId: null,
      customerName: customer_name,
      phone: '',
      orderType: 'counter',
      items,
      soldBy: req.user.user_id,
      paid: true,
      paymentMethod: payment_method,
    })
    res.status(201).json(orderView(result.order))
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export default router