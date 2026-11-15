import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useMenu } from '../hooks/useMenu.js'

function AdminSubcategories() {
  const { token } = useAuth()
  const { menu, reload } = useMenu()
  const [form, setForm] = useState({ name: '', category_id: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/subcategories', { method: 'POST', token, body: form })
      setForm({ name: '', category_id: '' })
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(sub) {
    if (!window.confirm(`Remove "${sub.name}"?`)) return
    setError('')
    try {
      await api(`/subcategories/${sub.subcategory_id}`, { method: 'DELETE', token })
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const categoryName = (id) => menu.categories.find((c) => c.category_id === id)?.name

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Sub categories
      </p>
      <h1>Sub categories</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Category
          <select name="category_id" value={form.category_id} onChange={handleChange} required>
            <option value="">Choose a category</option>
            {menu.categories.map((c) => (
              <option key={c.category_id} value={c.category_id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sub category name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Add sub category
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {menu.subcategories.map((s) => (
            <tr key={s.subcategory_id}>
              <td>{s.subcategory_id}</td>
              <td>{s.name}</td>
              <td>{categoryName(s.category_id)}</td>
              <td>
                <button className="btn-danger" onClick={() => handleDelete(s)}>
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

export default AdminSubcategories