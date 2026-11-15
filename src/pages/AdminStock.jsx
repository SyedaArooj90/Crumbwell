import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../utils/format.js'

function AdminStock() {
  const { token } = useAuth()
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/stock', { token })
      .then(setRows)
      .catch((err) => setError(err.message))
  }, [token])

  const lowCount = rows.filter((r) => r.low).length

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Stock
      </p>
      <h1>Stock</h1>
      {error && <p className="form-error">{error}</p>}

      {lowCount > 0 && (
        <p className="stock-warning">
          {lowCount} item(s) are low or out of stock. <Link to="/admin/purchases">Order stock</Link>
        </p>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>In stock</th>
            <th>Reorder level</th>
            <th>Status</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.quantity === 0 ? 'out' : row.low ? 'low' : 'ok'
            const label = status === 'out' ? 'Out of stock' : status === 'low' ? 'Low' : 'OK'
            return (
              <tr key={row.stock_id}>
                <td>{row.stock_id}</td>
                <td>{row.product_name}</td>
                <td>{row.quantity}</td>
                <td>{row.reorder_level}</td>
                <td>
                  <span className={`status-badge ${status}`}>{label}</span>
                </td>
                <td>{formatDate(row.updated_at)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default AdminStock