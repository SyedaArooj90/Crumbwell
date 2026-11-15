import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { rs, formatDate } from '../utils/format.js'

function OrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api(`/orders/${id}`, { token })
      .then(setOrder)
      .catch((err) => setError(err.message))
  }, [id, token])

  if (error) {
    return (
      <section className="page-header">
        <p className="form-error">{error}</p>
        <Link to="/my-orders">Back to my orders</Link>
      </section>
    )
  }

  if (!order) {
    return (
      <section className="page-header">
        <p className="hero-sub">Loading...</p>
      </section>
    )
  }

  const { bill } = order

  return (
    <section className="page-header">
      <p className="hero-kicker">Bill #{bill.bill_id}</p>
      <h1>Order #{order.order_id}</h1>

      <p className="hero-sub">
        {formatDate(order.order_date)} · {order.order_type} ·{' '}
        <span className={`status-badge ${order.status}`}>{order.status}</span>
      </p>
      <p>
        <p>{[order.customer_name, order.phone, order.address].filter(Boolean).join(', ')}</p>
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.order_item_id}>
              <td>{i.product_name}</td>
              <td>{rs(i.price_at_order)}</td>
              <td>{i.quantity}</td>
              <td>{rs(i.price_at_order * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{rs(bill.subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Tax</span>
          <span>{rs(bill.tax_amount)}</span>
        </div>
        {bill.delivery_fee > 0 && (
          <div className="summary-row">
            <span>Delivery fee</span>
            <span>{rs(bill.delivery_fee)}</span>
          </div>
        )}
        <div className="cart-total">
          <span>Total</span>
          <span>{rs(bill.total_amount)}</span>
        </div>
        <div className="summary-row">
          <span>Payment</span>
          <span>
            {bill.payment_method}, {bill.payment_status}
          </span>
        </div>
      </div>

      <div className="admin-links no-print">
        <button className="btn-ghost" onClick={() => window.print()}>
          Print bill
        </button>
        <Link to="/my-orders" className="btn-ghost">
          My orders
        </Link>
        {order.order_type === 'counter' && (
  <Link to="/admin/counter" className="btn-ghost">
    New counter sale
  </Link>
)}
      </div>
    </section>
  )
}

export default OrderDetail