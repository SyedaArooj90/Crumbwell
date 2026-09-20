import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import menu from '../data/menu.js'
import ItemVisual from '../components/ItemVisual.jsx'

const categoryKeys = Object.keys(menu)

function Menu() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState(
    categoryKeys.includes(initialTab) ? initialTab : categoryKeys[0],
  )
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState({})

  const activeCategory = menu[activeTab]
  const items = activeCategory.items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  )

  function handleBuy(slug) {
    setCart((prev) => ({ ...prev, [slug]: (prev[slug] || 0) + 1 }))
  }

function handleRemove(slug) {
  setCart((prev) => {
    const next = { ...prev }
    if (next[slug] > 1) {
      next[slug] -= 1
    } else {
      delete next[slug]
    }
    return next
  })
}
  return (
    <section className="menu-page">
      <header className="page-header">
        <p className="hero-kicker">The full menu</p>
        <h1>What we're baking</h1>
        <p className="hero-sub">
          Everything is made from scratch in small batches, so a few items may sell out before
          close.
        </p>
      </header>

      <div className="menu-toolbar">
        <div className="search-bar">
          <span aria-hidden="true">Search</span>
          <input
            type="text"
            placeholder="Search this menu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="tab-row">
          {categoryKeys.map((key) => (
            <button
              key={key}
              className={`tab ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {menu[key].label} <span className="tab-count">({menu[key].items.length})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="item-grid">
        {items.length === 0 && <p className="no-results">Nothing matches "{query}" here.</p>}

        {items.map((item) => {
          const count = cart[item.slug] || 0
          return (
            <div className="item-card" key={item.slug}>
              <ItemVisual item={item} className="item-thumb" />
              <div className="item-card-body">
                <div className="menu-item-row">
                  <span className="menu-item-name">{item.name}</span>
                  <span className="menu-item-price">{item.price}</span>
                </div>
                <p className="menu-item-note">{item.shortNote}</p>
                {count > 0 ? (
  <div className="qty-control">
    <button className="qty-btn" onClick={() => handleRemove(item.slug)}>
      −
    </button>
    <span className="qty-count">{count}</span>
    <button className="qty-btn" onClick={() => handleBuy(item.slug)}>
      +
    </button>
  </div>
) : (
  <button className="btn-buy" onClick={() => handleBuy(item.slug)}>
    Buy
  </button>
)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Menu
