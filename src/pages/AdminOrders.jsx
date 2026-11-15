import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { rs, formatDate } from '../utils/format.js'

function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api('/orders', { token })
      .then(setOrders)
      .catch((err) => setError(err.message))
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function changeStatus(order, status) {
    setError('')
    try {
      await api(`/orders/${order.order_id}/status`, { method: 'PATCH', token, body: { status } })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Orders
      </p>
      <h1>Orders</h1>
      {error && <p className="form-error">{error}</p>}
      {orders.length === 0 && <p className="hero-sub">No orders yet.</p>}

      {orders.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Type</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const closed = o.status === 'completed' || o.status === 'cancelled'
              return (
                <tr key={o.order_id}>
                  <td>
                    <Link to={`/orders/${o.order_id}`}>#{o.order_id}</Link>
                  </td>
                  <td>{formatDate(o.order_date)}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.order_type}</td>
                  <td>{rs(o.bill.total_amount)}</td>
                  <td>{o.bill.payment_status}</td>
                  <td>
                    <select
                      value={o.status}
                      disabled={closed}
                      onChange={(e) => changeStatus(o, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="ready">ready</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default AdminOrders