import { Router } from 'express'
import { carts, cartItems, products } from '../data/store.js'
import { optionalAuth } from '../middleware/auth.js'
import { stockFor } from '../services/stockService.js'

const router = Router()
const MAX_QTY = 20

let nextCartId = 9001
let nextCartItemId = 9101

// Every cart request must carry the visitor's session id
export function requireSession(req, res, next) {
  const sessionId = req.headers['x-session-id']
  if (typeof sessionId !== 'string' || sessionId.length < 16) {
    return res.status(400).json({ message: 'Missing session id' })
  }
  req.sessionId = sessionId
  next()
}

router.use(optionalAuth, requireSession)

export function findCart(req) {
  const cart = carts.find((c) => c.session_id === req.sessionId)
  // If the visitor logged in after starting the cart, attach their user id
  if (cart && req.user && !cart.user_id) cart.user_id = req.user.user_id
  return cart
}

function getOrCreateCart(req) {
  let cart = findCart(req)
  if (!cart) {
    cart = {
      cart_id: nextCartId++,
      session_id: req.sessionId,
      user_id: req.user ? req.user.user_id : null,
      created_at: new Date().toISOString(),
    }
    carts.push(cart)
  }
  return cart
}

// If the admin removed a product, drop it from any cart that still holds it
function dropMissingProducts(cart) {
  for (let i = cartItems.length - 1; i >= 0; i--) {
    const row = cartItems[i]
    if (row.cart_id === cart.cart_id && !products.some((p) => p.product_id === row.product_id)) {
      cartItems.splice(i, 1)
    }
  }
}

// Shape the cart for the client, joining each row to its product
export function cartView(cart) {
  if (!cart) return { cart_id: null, items: [], total: 0 }

  dropMissingProducts(cart)

  const items = cartItems
    .filter((row) => row.cart_id === cart.cart_id)
    .map((row) => {
      const product = products.find((p) => p.product_id === row.product_id)
      return {
        cart_item_id: row.cart_item_id,
        product_id: row.product_id,
        name: product.name,
        price: product.price,
        quantity: row.quantity,
        line_total: product.price * row.quantity,
      }
    })

  const total = items.reduce((sum, item) => sum + item.line_total, 0)
  return { cart_id: cart.cart_id, items, total }
}

// Removes the cart and all of its items. Step 5 calls this after an order is saved.
export function removeCart(cart) {
  for (let i = cartItems.length - 1; i >= 0; i--) {
    if (cartItems[i].cart_id === cart.cart_id) cartItems.splice(i, 1)
  }
  const index = carts.findIndex((c) => c.cart_id === cart.cart_id)
  if (index !== -1) carts.splice(index, 1)
}

// Get my cart
router.get('/', (req, res) => {
  res.json(cartView(findCart(req)))
})

// Add one unit of a product
router.post('/items', (req, res) => {
  const product_id = Number(req.body.product_id)

  if (!products.some((p) => p.product_id === product_id)) {
    return res.status(404).json({ message: 'Product not found' })
  }

  const cart = getOrCreateCart(req)
  const row = cartItems.find((r) => r.cart_id === cart.cart_id && r.product_id === product_id)

  const available = stockFor(product_id)?.quantity || 0
  const inCart = row ? row.quantity : 0
  if (inCart + 1 > available) {
    return res.status(400).json({
      message: available === 0 ? 'This item is sold out' : `Only ${available} left`,
    })
  }

  if (row) {
    if (row.quantity >= MAX_QTY) {
      return res.status(400).json({ message: `You can add at most ${MAX_QTY} of one item` })
    }
    row.quantity += 1
  } else {
    cartItems.push({
      cart_item_id: nextCartItemId++,
      cart_id: cart.cart_id,
      product_id,
      quantity: 1,
    })
  }

  res.status(201).json(cartView(cart))
})

// Remove one unit of a product
router.delete('/items/:productId', (req, res) => {
  const cart = findCart(req)
  if (!cart) return res.json(cartView(null))

  const productId = Number(req.params.productId)
  const index = cartItems.findIndex((r) => r.cart_id === cart.cart_id && r.product_id === productId)

  if (index !== -1) {
    if (cartItems[index].quantity > 1) cartItems[index].quantity -= 1
    else cartItems.splice(index, 1)
  }

  res.json(cartView(cart))
})

// Remove the whole cart
router.delete('/', (req, res) => {
  const cart = findCart(req)
  if (cart) removeCart(cart)
  res.json(cartView(null))
})

export default router