import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { rs } from '../utils/format.js'

const pad = (n) => String(n).padStart(2, '0')
const dayString = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function AdminReports() {
  const { token } = useAuth()
  const [range, setRange] = useState({ from: '', to: '' })
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    api(`/reports/summary?from=${range.from}&to=${range.to}`, { token })
      .then(setReport)
      .catch((err) => setError(err.message))
  }, [range, token])

  function handleDate(e) {
    setRange((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function preset(kind) {
    const now = new Date()
    if (kind === 'today') {
      const today = dayString(now)
      setRange({ from: today, to: today })
    } else if (kind === 'month') {
      setRange({
        from: dayString(new Date(now.getFullYear(), now.getMonth(), 1)),
        to: dayString(now),
      })
    } else {
      setRange({ from: '', to: '' })
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Reports
      </p>
      <h1>Reports</h1>

      <div className="filter-bar">
        <label>
          From
          <input type="date" name="from" value={range.from} onChange={handleDate} />
        </label>
        <label>
          To
          <input type="date" name="to" value={range.to} onChange={handleDate} />
        </label>
        <button type="button" className="btn-ghost" onClick={() => preset('today')}>
          Today
        </button>
        <button type="button" className="btn-ghost" onClick={() => preset('month')}>
          This month
        </button>
        <button type="button" className="btn-ghost" onClick={() => preset('all')}>
          All time
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      {!report && !error && <p className="hero-sub">Loading...</p>}

      {report && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span>Sales ({report.sales.orders} orders)</span>
              <strong>{rs(report.sales.revenue)}</strong>
            </div>
            <div className="stat-card">
              <span>Expenses ({report.expenses.purchase_orders} purchase orders)</span>
              <strong>{rs(report.expenses.total)}</strong>
            </div>
            <div className={`stat-card ${report.profit < 0 ? 'loss' : ''}`}>
              <span>{report.profit < 0 ? 'Loss' : 'Profit'}</span>
              <strong>{rs(Math.abs(report.profit))}</strong>
            </div>
            <div className="stat-card">
              <span>Tax collected</span>
              <strong>{rs(report.sales.tax_collected)}</strong>
            </div>
          </div>

          <p className="hero-sub">
            Sales = items {rs(report.sales.subtotal)} + delivery fees {rs(report.sales.delivery_fees)}.
            Tax is not counted as sales.
          </p>

          {report.waiting.orders > 0 && (
            <p className="stock-warning">
              {report.waiting.orders} order(s) worth {rs(report.waiting.amount)} are still waiting to be
              completed. They are not counted until they are paid.
            </p>
          )}

          <h2>Where the sales came from</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Group</th>
                <th>Orders</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Online orders</td>
                <td>{report.by_channel.online.orders}</td>
                <td>{rs(report.by_channel.online.revenue)}</td>
              </tr>
              <tr>
                <td>Counter sales</td>
                <td>{report.by_channel.counter.orders}</td>
                <td>{rs(report.by_channel.counter.revenue)}</td>
              </tr>
              {Object.entries(report.by_payment).map(([method, v]) => (
                <tr key={method}>
                  <td>Paid by {method}</td>
                  <td>{v.orders}</td>
                  <td>{rs(v.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Top products</h2>
          {report.top_products.length === 0 ? (
            <p className="hero-sub">No sales in this period.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sold</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {report.top_products.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>{rs(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <h2>Day by day</h2>
          {report.daily.length === 0 ? (
            <p className="hero-sub">Nothing to show for this period.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sales</th>
                  <th>Expenses</th>
                  <th>Profit / loss</th>
                </tr>
              </thead>
              <tbody>
                {report.daily.map((d) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td>{rs(d.sales)}</td>
                    <td>{rs(d.expenses)}</td>
                    <td>{d.profit < 0 ? `-${rs(Math.abs(d.profit))}` : rs(d.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="admin-links no-print">
            <button className="btn-ghost" onClick={() => window.print()}>
              Print report
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default AdminReports