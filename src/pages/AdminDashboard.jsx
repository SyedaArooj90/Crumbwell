import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

// roles: who sees the card. No roles means everyone who can open the portal.
const sections = [
  {
    title: 'Sales',
    links: [
      { to: '/admin/orders', label: 'Orders', note: 'Online and counter orders, and their status' },
      { to: '/admin/counter', label: 'Counter sale', note: 'Ring up a walk-in customer' },
      { to: '/admin/reports', label: 'Reports', note: 'Sales, expenses, profit and loss', roles: ['admin', 'owner'] },
    ],
  },
  {
    title: 'Inventory',
    links: [
      { to: '/admin/stock', label: 'Stock', note: 'Quantities and low stock warnings', roles: ['admin', 'owner'] },
      { to: '/admin/suppliers', label: 'Suppliers', note: 'Who we buy ingredients from', roles: ['admin', 'owner'] },
      { to: '/admin/purchases', label: 'Purchase orders', note: 'Order goods and receive them into stock', roles: ['admin', 'owner'] },
    ],
  },
  {
    title: 'Menu',
    links: [
      { to: '/admin/categories', label: 'Categories', note: 'Top level menu groups', roles: ['admin'] },
      { to: '/admin/subcategories', label: 'Sub categories', note: 'Groups inside a category', roles: ['admin'] },
      { to: '/admin/products', label: 'Products', note: 'Items, prices and descriptions', roles: ['admin'] },
    ],
  },
  {
    title: 'People',
    links: [
      { to: '/admin/employees', label: 'Employees', note: 'Staff records and salary payments', roles: ['admin', 'owner'] },
    ],
  },
]

const pad = (n) => String(n).padStart(2, '0')

// First day of this month up to today, in the same YYYY-MM-DD form the reports API expects
function monthRange() {
  const now = new Date()
  const prefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`
  return { from: `${prefix}-01`, to: `${prefix}-${pad(now.getDate())}` }
}

const money = (n) => `Rs ${Number(n).toLocaleString()}`

function AdminDashboard() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState(null)

  const isStaff = user.role === 'admin' || user.role === 'owner'

  useEffect(() => {
    if (!isStaff) return
    const { from, to } = monthRange()
    Promise.all([
      api(`/reports/summary?from=${from}&to=${to}`, { token }),
      api('/stock', { token }),
    ])
      .then(([summary, stockRows]) =>
        setStats({
          revenue: summary.sales.revenue,
          profit: summary.profit,
          waiting: summary.waiting.orders,
          low: stockRows.filter((row) => row.low).length,
        })
      )
      .catch(() => setStats(null))
  }, [token, isStaff])

  const canSee = (link) => !link.roles || link.roles.includes(user.role)

  return (
    <section className="page-header">
      <p className="hero-kicker">Admin portal</p>
      <h1>Welcome, {user.name}</h1>
      <p className="hero-sub">
        Signed in as {user.role}
      </p>

      {stats && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span>Sales this month</span>
              <strong>{money(stats.revenue)}</strong>
            </div>
            <div className={`stat-card ${stats.profit < 0 ? 'loss' : ''}`}>
              <span>{stats.profit < 0 ? 'Loss this month' : 'Profit this month'}</span>
              <strong>{money(stats.profit)}</strong>
            </div>
            <div className="stat-card">
              <span>Awaiting payment</span>
              <strong>{stats.waiting}</strong>
            </div>
            <div className="stat-card">
              <span>Low stock items</span>
              <strong>{stats.low}</strong>
            </div>
          </div>
        </>
      )}

      {sections.map((section) => {
        const visible = section.links.filter(canSee)
        if (visible.length === 0) return null
        return (
          <div className="admin-section" key={section.title}>
            <p className="admin-section-title">{section.title}</p>
            <div className="admin-grid">
              {visible.map((link) => (
                <Link to={link.to} className="admin-card" key={link.to}>
                  <h3>{link.label}</h3>
                  <p>{link.note}</p>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default AdminDashboard