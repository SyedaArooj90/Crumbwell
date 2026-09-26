import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}) // { slug: { item, qty } }

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev[item.slug]
      return {
        ...prev,
        [item.slug]: { item, qty: existing ? existing.qty + 1 : 1 },
      }
    })
  }

  function removeFromCart(slug) {
    setCart((prev) => {
      const existing = prev[slug]
      if (!existing) return prev
      if (existing.qty > 1) {
        return { ...prev, [slug]: { ...existing, qty: existing.qty - 1 } }
      }
      const next = { ...prev }
      delete next[slug]
      return next
    })
  }

  function clearCart() {
    setCart({})
  }

  const lines = Object.values(cart)
  const totalCount = lines.reduce((sum, l) => sum + l.qty, 0)

  return (
    <CartContext.Provider value={{ cart, lines, addToCart, removeFromCart, clearCart, totalCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}