import { Link } from 'react-router-dom'
import menu from '../data/menu.js'
import ItemVisual from '../components/ItemVisual.jsx'

// Pulled straight from the menu data, so this stays in sync automatically.
const highlights = [
  { category: 'breads', slug: 'country-sourdough' },
  { category: 'pastries', slug: 'cardamom-morning-bun' },
  { category: 'cakes', slug: 'pistachio-rose-cake' },
].map(({ category, slug }) => {
  const item = menu[category].items.find((i) => i.slug === slug)
  return { ...item, category }
})

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="hero-kicker">Multan's slow bakery</p>
          <h1>
            Bread proofed overnight,
            <br />
            pulled from the oven at dawn.
          </h1>
          <p className="hero-sub">
            We mill less, ferment longer, and bake in small batches so every loaf still tastes
            like someone made it by hand — because someone did.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-primary">
              See today's menu
            </Link>
            <Link to="/about" className="btn-ghost">
              Our story
            </Link>
          </div>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <div className="loaf-graphic">
            <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="100" cy="120" rx="85" ry="30" fill="var(--crust)" />
              <path
                d="M20 100 Q100 20 180 100 Q140 130 100 130 Q60 130 20 100 Z"
                fill="var(--crust-light)"
              />
              <path
                d="M55 70 Q65 55 75 68"
                stroke="var(--crust)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M95 62 Q105 47 115 60"
                stroke="var(--crust)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M135 70 Q145 55 155 68"
                stroke="var(--crust)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="highlights">
        <h2>What's coming out of the oven</h2>
        <div className="highlight-grid">
          {highlights.map((item) => (
            <Link
              to={`/menu?tab=${item.category}`}
              className="highlight-card"
              key={item.slug}
            >
              <ItemVisual item={item} className="highlight-thumb" />
              <h3>{item.name}</h3>
              <p>{item.shortNote}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="cta-strip">
        <p>Order ahead for weekend loaves — we cap each batch and they go quickly.</p>
        <Link to="/contact" className="btn-primary">
          Place an order
        </Link>
      </section>
    </>
  )
}

export default Home
