import { useParams, Link } from 'react-router-dom'
import ItemVisual from '../components/ItemVisual.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useMenu } from '../hooks/useMenu.js'
import { buildItems } from '../utils/menuHelpers.js'

function ItemDetail() {
  const { slug } = useParams()
  const { menu, loading } = useMenu()
  const { addToCart } = useCart()

  if (loading) {
    return (
      <section className="page-header">
        <p className="hero-sub">Loading...</p>
      </section>
    )
  }

  const item = buildItems(menu).find((i) => i.slug === slug)

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
        <Link to="/menu">Menu</Link> /{' '}
        <Link to={`/menu?tab=${item.categoryKey}`}>{item.categoryName}</Link>
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