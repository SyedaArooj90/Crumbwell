const faqs = [
  { q: 'Do you take orders in advance?', a: 'Yes, especially for cakes and weekend loaves. A day or two of notice helps.' },
  { q: 'Do you deliver?', a: 'Currently pickup only, at our Cantonment Bazaar location.' },
  { q: 'Can you make egg-free items?', a: 'Some items can be adapted, ask when you order.' },
]

function FAQ() {
  return (
    <section className="page-header">
      <p className="hero-kicker">Questions</p>
      <h1>Frequently asked</h1>
      <div className="faq-list">
        {faqs.map((f) => (
          <div className="faq-item" key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQ