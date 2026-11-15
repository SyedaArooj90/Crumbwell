import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const { lines, cartId, total, addToCart, removeFromCart } = useCart()

  if (lines.length === 0) {
    return (
      <section className="page-header">
        <h1>Your cart</h1>
        <p className="hero-sub">Nothing here yet.</p>
        <Link to="/menu" className="btn-primary">
          Browse the menu
        </Link>
      </section>
    )
  }

  return (
    <section className="page-header">
      <p className="hero-kicker">Cart ID: {cartId}</p>
      <h1>Your cart</h1>

      <div className="cart-list">
        {lines.map(({ item, qty, lineTotal }) => (
          <div className="cart-row" key={item.slug}>
            <span>{item.name}</span>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => removeFromCart(item.slug)}>
                −
              </button>
              <span className="qty-count">{qty}</span>
              <button className="qty-btn" onClick={() => addToCart(item)}>
                +
              </button>
            </div>
            <span>Rs {lineTotal}</span>
          </div>
        ))}

        <div className="cart-total">
          <span>Total</span>
          <span>Rs {total}</span>
        </div>
      </div>

      <Link to="/checkout" className="btn-primary">
        Checkout
      </Link>
    </section>
  )
}

export default Cart