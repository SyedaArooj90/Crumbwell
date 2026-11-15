import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from './AuthContext.jsx'
import { slugify } from '../utils/menuHelpers.js'

const CartContext = createContext(null)
const emptyCart = { cart_id: null, items: [], total: 0 }

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [serverCart, setServerCart] = useState(emptyCart)

  const load = useCallback(async (path, options) => {
    try {
      setServerCart(await api(path, { token, ...options }))
    } catch (err) {
      console.error(err.message)
    }
  }, [token])

  // Load the cart on start, and again whenever someone logs in or out
  useEffect(() => {
    load('/cart')
  }, [load])

  const addToCart = (item) =>
    load('/cart/items', { method: 'POST', body: { product_id: item.product_id } })

  const removeFromCart = (slug) => {
    const row = serverCart.items.find((i) => slugify(i.name) === slug)
    if (row) load(`/cart/items/${row.product_id}`, { method: 'DELETE' })
  }

  const clearCart = () => load('/cart', { method: 'DELETE' })

  const lines = serverCart.items.map((row) => ({
    item: {
      product_id: row.product_id,
      slug: slugify(row.name),
      name: row.name,
      price: `Rs ${row.price}`,
    },
    qty: row.quantity,
    lineTotal: row.line_total,
  }))

  const cart = Object.fromEntries(lines.map((line) => [line.item.slug, line]))
  const totalCount = lines.reduce((sum, line) => sum + line.qty, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        lines,
        cartId: serverCart.cart_id,
        total: serverCart.total,
        addToCart,
        removeFromCart,
        clearCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}