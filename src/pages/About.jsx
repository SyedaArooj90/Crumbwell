const process = [
  {
    step: 'Mix',
    detail: 'Flour, water, and our own starter, mixed by hand the evening before.',
  },
  {
    step: 'Ferment',
    detail: 'A slow, cool rise overnight develops flavor without needing much yeast.',
  },
  {
    step: 'Shape & score',
    detail: 'Each loaf is shaped individually, so no two look quite the same.',
  },
  {
    step: 'Bake',
    detail: 'Deck ovens at high heat from four in the morning, until the crust sings.',
  },
]

function About() {
  return (
    <section className="about-page">
      <header className="page-header">
        <p className="hero-kicker">Our story</p>
        <h1>A bakery that keeps bread's original pace.</h1>
        <p className="hero-sub">
          Hearth &amp; Crumb started in a home kitchen with one starter and a waitlist of
          neighbors. We've grown since, but the bread still takes as long as it needs to.
        </p>
      </header>

      <div className="about-body">
        <p>
          We began baking for a handful of people in our own street, using a starter that's now
          over three years old. What people kept coming back for wasn't novelty — it was bread
          that tasted like it had been given time. That's still the whole idea.
        </p>
        <p>
          We keep our batches small on purpose. It means we sell out sometimes, and it means the
          bread coming out of our ovens this morning was still flour yesterday afternoon.
        </p>
      </div>

      <div className="process-block">
        <h2>How a loaf gets made here</h2>
        <div className="process-grid">
          {process.map((p) => (
            <div className="process-card" key={p.step}>
              <h3>{p.step}</h3>
              <p>{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
