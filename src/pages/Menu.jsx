import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ItemVisual from '../components/ItemVisual.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useMenu } from '../hooks/useMenu.js'
import { buildItems, slugify } from '../utils/menuHelpers.js'

function Menu() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')

  const { menu, loading, error } = useMenu()
  const { cart, addToCart, removeFromCart } = useCart()

  const [activeId, setActiveId] = useState(null)
  const [activeSub, setActiveSub] = useState(null)
  const [query, setQuery] = useState('')

  const items = useMemo(() => buildItems(menu), [menu])

  const activeCategory =
    menu.categories.find((c) => c.category_id === activeId) ||
    menu.categories.find((c) => slugify(c.name) === tabParam) ||
    menu.categories[0]

  if (loading) {
    return (
      <section className="page-header">
        <p className="hero-sub">Loading the menu...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-header">
        <p className="form-error">Could not load the menu: {error}</p>
        <p className="hero-sub">Make sure the server is running.</p>
      </section>
    )
  }

  if (!activeCategory) {
    return (
      <section className="page-header">
        <p className="hero-sub">The menu is empty right now.</p>
      </section>
    )
  }

  const countFor = (categoryId) => items.filter((i) => i.categoryId === categoryId).length
  const subcategories = menu.subcategories.filter(
    (s) => s.category_id === activeCategory.category_id,
  )
  const visible = items.filter(
    (i) =>
      i.categoryId === activeCategory.category_id &&
      (!activeSub || i.subcategoryId === activeSub) &&
      i.name.toLowerCase().includes(query.toLowerCase()),
  )

  function chooseCategory(id) {
    setActiveId(id)
    setActiveSub(null)
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
          {menu.categories.map((c) => (
            <button
              key={c.category_id}
              className={`tab ${activeCategory.category_id === c.category_id ? 'active' : ''}`}
              onClick={() => chooseCategory(c.category_id)}
            >
              {c.name} <span className="tab-count">({countFor(c.category_id)})</span>
            </button>
          ))}
        </div>

        {subcategories.length > 0 && (
          <div className="sub-row">
            <button
              className={`sub-chip ${activeSub === null ? 'active' : ''}`}
              onClick={() => setActiveSub(null)}
            >
              All
            </button>
            {subcategories.map((s) => (
              <button
                key={s.subcategory_id}
                className={`sub-chip ${activeSub === s.subcategory_id ? 'active' : ''}`}
                onClick={() => setActiveSub(s.subcategory_id)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="item-grid">
        {visible.length === 0 && <p className="no-results">Nothing to show here yet.</p>}

        {visible.map((item) => {
          const count = cart[item.slug]?.qty || 0
          return (
            <div className="item-card" key={item.product_id}>
              <ItemVisual item={item} className="item-thumb" />
              <div className="item-card-body">
                <div className="menu-item-row">
                  <span className="menu-item-name">{item.name}</span>
                  <span className="menu-item-price">{item.price}</span>
                </div>
                <p className="menu-item-note">{item.shortNote}</p>

                {count > 0 ? (
  <div className="qty-control">
    <button className="qty-btn" onClick={() => removeFromCart(item.slug)}>
      −
    </button>
    <span className="qty-count">{count}</span>
    <button className="qty-btn" onClick={() => addToCart(item)}>
      +
    </button>
  </div>
) : item.inStock ? (
  <button className="btn-buy" onClick={() => addToCart(item)}>
    Buy
  </button>
) : (
  <button className="btn-buy" disabled>
    Sold out
  </button>
)}

                <Link to={`/menu/${item.categoryKey}/${item.slug}`} className="details-link">
                  View details
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Menu