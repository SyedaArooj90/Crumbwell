import { Router } from 'express'
import {
  orders,
  orderItems,
  bills,
  purchaseOrders,
  purchaseOrderItems,
  salaryPayments,
} from '../data/store.js'

import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth, requireRole('admin', 'owner'))

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const round = (n) => Math.round(n * 100) / 100
const sum = (list, pick) => list.reduce((total, item) => total + pick(item), 0)

// The calendar day (in this computer's time zone) of a stored date
function dayOf(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

router.get('/summary', (req, res) => {
  const from = req.query.from || ''
  const to = req.query.to || ''

  if ((from && !DATE_PATTERN.test(from)) || (to && !DATE_PATTERN.test(to))) {
    return res.status(400).json({ message: 'Dates must look like 2026-10-29' })
  }
  if (from && to && from > to) {
    return res.status(400).json({ message: 'The start date is after the end date' })
  }

  const inRange = (iso) => {
    const day = dayOf(iso)
    return (!from || day >= from) && (!to || day <= to)
  }

  // ---------- Sales: paid bills only ----------
  const paidBills = bills.filter(
    (b) => b.payment_status === 'paid' && b.paid_date && inRange(b.paid_date)
  )
  const revenueOf = (b) => b.subtotal + b.delivery_fee

  const by_channel = {
    online: { orders: 0, revenue: 0 },
    counter: { orders: 0, revenue: 0 },
  }
  const by_payment = {}
  const paidOrderIds = new Set()

  paidBills.forEach((b) => {
    const order = orders.find((o) => o.order_id === b.order_id)
    const channel = order && order.order_type === 'counter' ? 'counter' : 'online'
    by_channel[channel].orders += 1
    by_channel[channel].revenue += revenueOf(b)

    if (!by_payment[b.payment_method]) by_payment[b.payment_method] = { orders: 0, revenue: 0 }
    by_payment[b.payment_method].orders += 1
    by_payment[b.payment_method].revenue += revenueOf(b)

    paidOrderIds.add(b.order_id)
  })

  const revenue = sum(paidBills, revenueOf)

  // ---------- Expenses: purchase orders that were received ----------
  const receivedPos = purchaseOrders.filter(
    (po) => po.status === 'received' && po.received_date && inRange(po.received_date)
  )
  const poCost = (po) =>
    sum(
      purchaseOrderItems.filter((i) => i.po_id === po.po_id),
      (i) => i.quantity * i.unit_cost
    )
  const purchaseCost = sum(receivedPos, poCost)

// Salaries paid inside the date range
const paidSalaries = salaryPayments.filter((p) => inRange(p.paid_date))
const salaryCost = sum(paidSalaries, (p) => p.amount)

const expenses = purchaseCost + salaryCost

  // ---------- Top products (from paid orders) ----------
  const productTotals = new Map()
  orderItems
    .filter((i) => paidOrderIds.has(i.order_id))
    .forEach((i) => {
      const row = productTotals.get(i.product_name) || { name: i.product_name, quantity: 0, revenue: 0 }
      row.quantity += i.quantity
      row.revenue += i.quantity * i.price_at_order
      productTotals.set(i.product_name, row)
    })
  const top_products = [...productTotals.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((p) => ({ ...p, revenue: round(p.revenue) }))

  // ---------- Day by day ----------
  const days = new Map()
  const dayRow = (day) => {
    if (!days.has(day)) days.set(day, { date: day, sales: 0, expenses: 0 })
    return days.get(day)
  }
  paidBills.forEach((b) => (dayRow(dayOf(b.paid_date)).sales += revenueOf(b)))
  receivedPos.forEach((po) => (dayRow(dayOf(po.received_date)).expenses += poCost(po)))
  paidSalaries.forEach((p) => (dayRow(dayOf(p.paid_date)).expenses += p.amount))
  const daily = [...days.values()]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((d) => ({
      date: d.date,
      sales: round(d.sales),
      expenses: round(d.expenses),
      profit: round(d.sales - d.expenses),
    }))

  // ---------- Orders still waiting (not counted anywhere above) ----------
  const waitingBills = bills.filter((b) => b.payment_status === 'unpaid')

  const roundGroup = (group) =>
    Object.fromEntries(
      Object.entries(group).map(([key, v]) => [key, { orders: v.orders, revenue: round(v.revenue) }])
    )

  res.json({
    range: { from, to },
    sales: {
      orders: paidBills.length,
      subtotal: round(sum(paidBills, (b) => b.subtotal)),
      delivery_fees: round(sum(paidBills, (b) => b.delivery_fee)),
      tax_collected: round(sum(paidBills, (b) => b.tax_amount)),
      revenue: round(revenue),
    },
    by_channel: roundGroup(by_channel),
    by_payment: roundGroup(by_payment),
    expenses: {
  purchase_orders: receivedPos.length,
  purchases: round(purchaseCost),
  salaries: round(salaryCost),
  total: round(expenses),
},
    profit: round(revenue - expenses),
    top_products,
    daily,
    waiting: {
      orders: waitingBills.length,
      amount: round(sum(waitingBills, (b) => b.total_amount)),
    },
  })
})

export default router