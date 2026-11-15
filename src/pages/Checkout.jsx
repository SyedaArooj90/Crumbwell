import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { rs } from '../utils/format.js'

// Only for showing an estimate. The server works out the real bill.
const TAX_RATE = 0.05
const DELIVERY_FEE = 150

function Checkout() {
  const { user, token } = useAuth()
  const { lines, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    customer_name: user ? user.name : '',
    phone: '',
    order_type: 'pickup',
    address: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (lines.length === 0) {
    return (
      <section className="page-header">
        <h1>Checkout</h1>
        <p className="hero-sub">Your cart is empty.</p>
        <Link to="/menu" className="btn-primary">
          Browse the menu
        </Link>
      </section>
    )
  }

  const tax = total * TAX_RATE
  const delivery = form.order_type === 'delivery' ? DELIVERY_FEE : 0

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const order = await api('/orders', { method: 'POST', token, body: form })
      navigate(`/orders/${order.order_id}`)
      clearCart() // the server already removed the cart, this refreshes the cart count
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <section className="page-header">
      <h1>Checkout</h1>

      <div className="order-summary">
        {lines.map(({ item, qty, lineTotal }) => (
          <div className="summary-row" key={item.slug}>
            <span>
              {item.name} x {qty}
            </span>
            <span>{rs(lineTotal)}</span>
          </div>
        ))}
        <div className="summary-row">
          <span>Tax (5%)</span>
          <span>{rs(tax)}</span>
        </div>
        {delivery > 0 && (
          <div className="summary-row">
            <span>Delivery fee</span>
            <span>{rs(delivery)}</span>
          </div>
        )}
        <div className="cart-total">
          <span>Estimated total</span>
          <span>{rs(total + tax + delivery)}</span>
        </div>
      </div>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="customer_name" value={form.customer_name} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Pickup or delivery
          <select name="order_type" value={form.order_type} onChange={handleChange}>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </label>
        {form.order_type === 'delivery' && (
          <label>
            Delivery address
            <input name="address" value={form.address} onChange={handleChange} required />
          </label>
        )}
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </section>
  )
}

export default Checkout