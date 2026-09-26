const reviews = [
  { name: 'Hina M.', text: 'The sourdough alone is worth the trip across town.' },
  { name: 'Bilal R.', text: 'Cardamom bun is the best pastry I have had in Multan.' },
  { name: 'Sana K.', text: 'Ordered the pistachio rose cake for a birthday, everyone asked where it was from.' },
]

function Testimonials() {
  return (
    <section className="page-header">
      <p className="hero-kicker">What people say</p>
      <h1>Testimonials</h1>
      <div className="testimonial-grid">
        {reviews.map((r) => (
          <div className="testimonial-card" key={r.name}>
            <p>"{r.text}"</p>
            <p className="testimonial-name">— {r.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Testimonials