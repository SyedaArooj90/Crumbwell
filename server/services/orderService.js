import { orders, orderItems, bills, products } from '../data/store.js'
import { stockFor, addStock } from './stockService.js'

export const TAX_RATE = 0.05
export const DELIVERY_FEE = 150

let nextOrderId = 4001
let nextOrderItemId = 5001
let nextBillId = 6001

export function placeOrder({
  userId,
  customerName,
  phone,
  orderType,
  address = '',
  items,
  soldBy = null,
  paid = false,
  paymentMethod = 'cash',
}) {
  // Look every product up on the server, so prices cannot be faked from the browser
  const lines = items.map(({ product_id, quantity }) => ({
    product: products.find((p) => p.product_id === product_id),
    quantity,
  }))

  if (
    lines.length === 0 ||
    lines.some((l) => !l.product || !Number.isInteger(l.quantity) || l.quantity < 1)
  ) {
    throw new Error('The order has no valid items')
  }

    // Make sure there is enough stock for every line
  for (const { product, quantity } of lines) {
    const row = stockFor(product.product_id)
    if (!row || row.quantity < quantity) {
      throw new Error(`Not enough stock for ${product.name}`)
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)
  const delivery_fee = orderType === 'delivery' ? DELIVERY_FEE : 0
  const tax_amount = Math.round(subtotal * TAX_RATE * 100) / 100
  const total_amount = subtotal + tax_amount + delivery_fee
  const now = new Date().toISOString()

  const order = {
    order_id: nextOrderId++,
    user_id: userId,
    customer_name: customerName,
    phone,
    order_type: orderType,
    address,
    status: paid ? 'completed' : 'pending',
    order_date: now,
    sold_by: soldBy,
  }
  orders.push(order)

  const savedItems = lines.map(({ product, quantity }) => {
    const row = {
      order_item_id: nextOrderItemId++,
      order_id: order.order_id,
      product_id: product.product_id,
      product_name: product.name,
      quantity,
      price_at_order: product.price,
    }
    orderItems.push(row)
    return row
  })

    // Take the sold items out of stock
  lines.forEach(({ product, quantity }) => addStock(product.product_id, -quantity))

  const bill = {
    bill_id: nextBillId++,
    order_id: order.order_id,
    subtotal,
    tax_amount,
    delivery_fee,
    total_amount,
    payment_method: paymentMethod,
    payment_status: paid ? 'paid' : 'unpaid',
    paid_date: paid ? now : null,
    generated_date: now,
  }
  bills.push(bill)

  return { order, items: savedItems, bill }
}