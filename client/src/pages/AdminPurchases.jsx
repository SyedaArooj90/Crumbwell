import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useMenu } from '../hooks/useMenu.js'
import { rs, formatDate } from '../utils/format.js'

const emptyLine = { product_id: '', quantity: '', unit_cost: '' }

function AdminPurchases() {
  const { token } = useAuth()
  const { menu } = useMenu()
  const [suppliers, setSuppliers] = useState([])
  const [orders, setOrders] = useState([])
  const [supplierId, setSupplierId] = useState('')
  const [line, setLine] = useState(emptyLine)
  const [lines, setLines] = useState([])
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setSuppliers(await api('/stock/suppliers', { token }))
      setOrders(await api('/stock/purchase-orders', { token }))
    } catch (err) {
      setError(err.message)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const productName = (id) => menu.products.find((p) => p.product_id === Number(id))?.name

  function handleLineChange(e) {
    setLine((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function addLine() {
    setError('')
    const quantity = Number(line.quantity)
    const unit_cost = Number(line.unit_cost)

    if (!line.product_id || !Number.isInteger(quantity) || quantity < 1 || !(unit_cost > 0)) {
      setError('Choose a product, a whole quantity and a cost per unit')
      return
    }
    setLines((prev) => [...prev, { product_id: Number(line.product_id), quantity, unit_cost }])
    setLine(emptyLine)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/stock/purchase-orders', {
        method: 'POST',
        token,
        body: { supplier_id: supplierId, items: lines },
      })
      setSupplierId('')
      setLines([])
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function act(order, action) {
    const message =
      action === 'receive'
        ? `Mark purchase order #${order.po_id} as received and add it to stock?`
        : `Cancel purchase order #${order.po_id}?`
    if (!window.confirm(message)) return

    setError('')
    try {
      await api(`/stock/purchase-orders/${order.po_id}/${action}`, { method: 'PATCH', token })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Purchase orders
      </p>
      <h1>Purchase orders</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Supplier
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
            <option value="">Choose a supplier</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Product
          <select name="product_id" value={line.product_id} onChange={handleLineChange}>
            <option value="">Choose a product</option>
            {menu.products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantity
          <input type="number" name="quantity" value={line.quantity} onChange={handleLineChange} />
        </label>
        <label>
          Cost per unit (Rs)
          <input type="number" name="unit_cost" value={line.unit_cost} onChange={handleLineChange} />
        </label>
        <button type="button" className="btn-ghost" onClick={addLine}>
          Add this item
        </button>

        {lines.length > 0 && (
          <ul className="po-lines">
            {lines.map((l, index) => (
              <li key={index}>
                <span>
                  {productName(l.product_id)} x {l.quantity} at {rs(l.unit_cost)}
                </span>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Place purchase order
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>PO</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Items</th>
            <th>Cost</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.po_id}>
              <td>#{o.po_id}</td>
              <td>{formatDate(o.order_date)}</td>
              <td>{o.supplier_name}</td>
              <td>{o.items.map((i) => `${i.product_name} x ${i.quantity}`).join(', ')}</td>
              <td>{rs(o.total_cost)}</td>
              <td>
                <span className={`status-badge ${o.status}`}>{o.status}</span>
              </td>
              <td>
                {o.status === 'ordered' && (
                  <>
                    <button className="btn-buy" onClick={() => act(o, 'receive')}>
                      Receive stock
                    </button>{' '}
                    <button className="btn-danger" onClick={() => act(o, 'cancel')}>
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AdminPurchases