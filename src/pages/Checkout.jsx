import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Checkout() {
  const { lines, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', address: '', phone: '' })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    clearCart()
    navigate('/order-confirmation')
  }

  return (
    <section className="page-header">
      <h1>Checkout</h1>
      <p className="hero-sub">{lines.length} item(s) in your order.</p>
      <form className="order-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Delivery address
          <input name="address" value={form.address} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <button type="submit" className="btn-primary">Place order</button>
      </form>
    </section>
  )
}

export default Checkout