import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useMenu } from '../hooks/useMenu.js'

const emptyForm = { name: '', price: '', short_note: '', description: '', subcategory_id: '' }

function AdminProducts() {
  const { token } = useAuth()
  const { menu, reload } = useMenu()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/products', { method: 'POST', token, body: form })
      setForm(emptyForm)
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Remove "${product.name}"?`)) return
    setError('')
    try {
      await api(`/products/${product.product_id}`, { method: 'DELETE', token })
      reload()
    } catch (err) {
      setError(err.message)
    }
  }

  const categoryName = (id) => menu.categories.find((c) => c.category_id === id)?.name
  const subcategoryOf = (id) => menu.subcategories.find((s) => s.subcategory_id === id)

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Products
      </p>
      <h1>Products</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Sub category
          <select
            name="subcategory_id"
            value={form.subcategory_id}
            onChange={handleChange}
            required
          >
            <option value="">Choose a sub category</option>
            {menu.subcategories.map((s) => (
              <option key={s.subcategory_id} value={s.subcategory_id}>
                {categoryName(s.category_id)} / {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Product name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Price (Rs)
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </label>
        <label>
          Short note
          <input name="short_note" value={form.short_note} onChange={handleChange} />
        </label>
        <label>
          Description
          <input name="description" value={form.description} onChange={handleChange} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Add product
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Sub category</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {menu.products.map((p) => {
            const sub = subcategoryOf(p.subcategory_id)
            return (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>{p.name}</td>
                <td>Rs {p.price}</td>
                <td>{sub?.name}</td>
                <td>{categoryName(sub?.category_id)}</td>
                <td>
                  <button className="btn-danger" onClick={() => handleDelete(p)}>
                    Remove
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

export default AdminProducts