import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useMenu } from '../hooks/useMenu.js'
import { rs, formatDate } from '../utils/format.js'

// Only for showing an estimate. The server works out the real bill.
const TAX_RATE = 0.05

function AdminCounter() {
  const { token } = useAuth()
  const { menu } = useMenu()
  const navigate = useNavigate()

  const [cart, setCart] = useState({}) // product_id -> quantity
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState([])

  const loadRecent = useCallback(() => {
    api('/orders', { token })
      .then((all) => setRecent(all.filter((o) => o.order_type === 'counter').slice(0, 5)))
      .catch(() => {})
  }, [token])

  useEffect(() => {
    loadRecent()
  }, [loadRecent])

  function change(productId, delta) {
    setCart((prev) => {
      const next = (prev[productId] || 0) + delta
      const copy = { ...prev }
      if (next <= 0) delete copy[productId]
      else copy[productId] = next
      return copy
    })
  }

  const lines = menu.products
    .filter((p) => cart[p.product_id])
    .map((p) => ({ product: p, qty: cart[p.product_id] }))

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)
  const tax = subtotal * TAX_RATE

  async function handleSale() {
    setError('')
    setLoading(true)
    try {
      const order = await api('/orders/counter', {
        method: 'POST',
        token,
        body: {
          customer_name: customerName,
          payment_method: paymentMethod,
          items: lines.map((l) => ({ product_id: l.product.product_id, quantity: l.qty })),
        },
      })
      navigate(`/orders/${order.order_id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Counter sale
      </p>
      <h1>Counter sale</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {menu.products.map((p) => (
            <tr key={p.product_id}>
              <td>{p.name}</td>
              <td>{rs(p.price)}</td>
              <td>{p.in_stock ? 'In stock' : 'Sold out'}</td>
              <td>
                <div className="qty-control">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => change(p.product_id, -1)}
                    disabled={!cart[p.product_id]}
                  >
                    −
                  </button>
                  <span className="qty-count">{cart[p.product_id] || 0}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => change(p.product_id, 1)}
                    disabled={!p.in_stock}
                  >
                    +
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-summary">
        {lines.length === 0 && <p className="hero-sub">No items yet.</p>}
        {lines.map(({ product, qty }) => (
          <div className="summary-row" key={product.product_id}>
            <span>
              {product.name} x {qty}
            </span>
            <span>{rs(product.price * qty)}</span>
          </div>
        ))}
        {lines.length > 0 && (
          <>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>{rs(tax)}</span>
            </div>
            <div className="cart-total">
              <span>Estimated total</span>
              <span>{rs(subtotal + tax)}</span>
            </div>
          </>
        )}
      </div>

      <div className="order-form">
        <label>
          Customer name (optional)
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </label>
        <label>
          Payment
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
        </label>
        {error && <p className="form-error">{error}</p>}
        <button
          type="button"
          className="btn-primary"
          disabled={loading || lines.length === 0}
          onClick={handleSale}
        >
          {loading ? 'Saving...' : 'Complete sale'}
        </button>
      </div>

      {recent.length > 0 && (
        <>
          <h2>Recent counter sales</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.order_id}>
                  <td>
                    <Link to={`/orders/${o.order_id}`}>#{o.order_id}</Link>
                  </td>
                  <td>{formatDate(o.order_date)}</td>
                  <td>{o.customer_name}</td>
                  <td>{rs(o.bill.total_amount)}</td>
                  <td>{o.bill.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  )
}

export default AdminCounter