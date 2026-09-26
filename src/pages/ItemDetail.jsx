import { useParams, Link } from 'react-router-dom'
import menu from '../data/menu.js'
import ItemVisual from '../components/ItemVisual.jsx'
import { useCart } from '../context/CartContext.jsx'

function ItemDetail() {
  const { category, slug } = useParams()
  const categoryData = menu[category]
  const item = categoryData?.items.find((i) => i.slug === slug)
  const { addToCart } = useCart()

  if (!item) {
    return (
      <section className="page-header">
        <h1>Item not found</h1>
        <Link to="/menu">Back to the menu</Link>
      </section>
    )
  }

  return (
    <section className="item-detail-page page-header">
      <p className="hero-kicker">
        <Link to="/menu">Menu</Link> / {categoryData.label}
      </p>
      <div className="item-detail-grid">
        <ItemVisual item={item} className="item-detail-thumb" />
        <div>
          <h1>{item.name}</h1>
          <p className="item-detail-price">{item.price}</p>
          <p className="hero-sub">{item.description}</p>
          <button className="btn-buy" onClick={() => addToCart(item)}>
            Buy
          </button>
        </div>
      </div>
    </section>
  )
}

export default ItemDetail