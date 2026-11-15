import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useMenu } from '../hooks/useMenu.js'

function AdminCategories() {
  const { token } = useAuth()
  const { menu, reload } = useMenu()
  const [form, setForm] = useState({ name: '', tagline: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/categories', { method: 'POST', token, body: form })
      setForm({ name: '', tagline: '' })
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Remove "${category.name}"?`)) return
    setError('')
    try {
      await api(`/categories/${category.category_id}`, { method: 'DELETE', token })
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Categories
      </p>
      <h1>Categories</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Category name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Tagline
          <input name="tagline" value={form.tagline} onChange={handleChange} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Add category
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Tagline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {menu.categories.map((c) => (
            <tr key={c.category_id}>
              <td>{c.category_id}</td>
              <td>{c.name}</td>
              <td>{c.tagline}</td>
              <td>
                <button className="btn-danger" onClick={() => handleDelete(c)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default AdminCategories