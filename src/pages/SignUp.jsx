import { useState } from 'react'

function SignUp() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section className="page-header">
      <h1>Create an account</h1>
      {submitted ? (
        <p className="hero-sub">Logged in (demo only, no real account system yet).</p>
      ) : (
        <form className="order-form" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn-primary">Log in</button>
        </form>
      )}
    </section>
  )
}

export default SignUp