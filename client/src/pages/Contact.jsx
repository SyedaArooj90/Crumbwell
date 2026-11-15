import { useState } from 'react'

function Contact() {
  const [form, setForm] = useState({ name: '', order: '', date: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact-page">
      <header className="page-header">
        <p className="hero-kicker">Get in touch</p>
        <h1>Order ahead, or just say hello.</h1>
        <p className="hero-sub">
          Weekend loaves go fast, so a day or two of notice helps us set enough dough aside for
          you.
        </p>
      </header>

      <div className="contact-grid">
        <form className="order-form" onSubmit={handleSubmit}>
          {sent ? (
            <p className="form-success">
              Thanks, {form.name || 'friend'} — we've got your order and will confirm by phone.
            </p>
          ) : (
            <>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                What you'd like
                <input
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  placeholder="e.g. one sourdough, two cardamom buns"
                  required
                />
              </label>
              <label>
                Pickup date
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </label>
              <button type="submit" className="btn-primary">
                Send order
              </button>
            </>
          )}
        </form>

        <div className="contact-details">
          <div>
            <p className="footer-heading">Visit</p>
            <p>Cantonment Bazaar, Multan</p>
            <p>Tue–Sun, 7am–8pm</p>
          </div>
          <div>
            <p className="footer-heading">Reach us</p>
            <p>hello@crumbwell.pk</p>
            <p>+92 300 000 0000</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
