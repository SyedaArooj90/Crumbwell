import { Link } from 'react-router-dom'
import menu from '../data/menu.js'
import ItemVisual from '../components/ItemVisual.jsx'

// Pulls every item across all categories that has a real photo (an `image`
// field in menu.js). Add a photo to any item there and it shows up here
// automatically, no separate gallery list to maintain.
const photographed = Object.entries(menu).flatMap(([category, data]) =>
  data.items
    .filter((item) => item.image)
    .map((item) => ({ ...item, category })),
)

function Gallery() {
  return (
    <section className="page-header">
      <p className="hero-kicker">Gallery</p>
      <h1>A look inside</h1>

      {photographed.length === 0 ? (
        <p className="hero-sub">
          Photos will appear here as we add them to the menu, check back soon.
        </p>
      ) : (
        <>
          <p className="hero-sub">A few of what's coming out of the oven.</p>
          <div className="gallery-grid">
            {photographed.map((item) => (
              <Link
                to={`/menu?tab=${item.category}`}
                className="gallery-tile"
                key={item.slug}
              >
                <ItemVisual item={item} className="gallery-photo" />
                <p className="gallery-caption">{item.name}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Gallery