import { useState } from 'react'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.email === 'admin@gmail.com' && form.password === '123456') {
      setError('')
      setSubmitted(true)
    } else {
      setError('Invalid email or password')
    }
  }

  return (
    <section className="page-header">
      <h1>Log in</h1>
      {submitted ? (
        <p className="hero-sub">Logged in (demo only, no real account system yet).</p>
      ) : (
        <form className="order-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary">Log in</button>
        </form>
      )}
    </section>
  )
}

export default Login