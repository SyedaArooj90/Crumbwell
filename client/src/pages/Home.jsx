import { Link } from 'react-router-dom'
import menu from '../data/menu.js'
import ItemVisual from '../components/ItemVisual.jsx'
import heroPhoto from '../assets/Main-cake.png'

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
            From sourdough to celebration cakes,
            <br />
            made by hand every day.
          </h1>
          <p className="hero-sub">
            We mill less, ferment longer, and bake in small batches so every loaf still tastes
            like someone made it by hand, because someone did.
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
        <div className="hero-panel">
          <img src={heroPhoto} alt="Fresh bakes at Crumbwell" className="hero-photo" />
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
