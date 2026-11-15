import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

function AdminSuppliers() {
  const { token } = useAuth()
  const [suppliers, setSuppliers] = useState([])
  const [form, setForm] = useState({ name: '', contact_number: '' })
  const [error, setError] = useState('')

  const load = useCallback(() => {
    api('/stock/suppliers', { token })
      .then(setSuppliers)
      .catch((err) => setError(err.message))
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await api('/stock/suppliers', { method: 'POST', token, body: form })
      setForm({ name: '', contact_number: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(supplier) {
    if (!window.confirm(`Remove "${supplier.name}"?`)) return
    setError('')
    try {
      await api(`/stock/suppliers/${supplier.supplier_id}`, { method: 'DELETE', token })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">
        <Link to="/admin">Admin</Link> / Suppliers
      </p>
      <h1>Suppliers</h1>

      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Supplier name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Contact number
          <input name="contact_number" value={form.contact_number} onChange={handleChange} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Add supplier
        </button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s.supplier_id}>
              <td>{s.supplier_id}</td>
              <td>{s.name}</td>
              <td>{s.contact_number}</td>
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

export default AdminSuppliers