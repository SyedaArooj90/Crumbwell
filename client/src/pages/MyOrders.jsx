import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { rs, formatDate } from '../utils/format.js'

function MyOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/orders/mine', { token })
      .then(setOrders)
      .catch((err) => setError(err.message))
  }, [token])

  return (
    <section className="page-header">
      <h1>My orders</h1>
      {error && <p className="form-error">{error}</p>}
      {orders && orders.length === 0 && <p className="hero-sub">No orders yet.</p>}

      {orders && orders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_id}>
                <td>#{o.order_id}</td>
                <td>{formatDate(o.order_date)}</td>
                <td>{o.order_type}</td>
                <td>
                  <span className={`status-badge ${o.status}`}>{o.status}</span>
                </td>
                <td>{rs(o.bill.total_amount)}</td>
                <td>
                  <Link to={`/orders/${o.order_id}`}>View bill</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default MyOrders