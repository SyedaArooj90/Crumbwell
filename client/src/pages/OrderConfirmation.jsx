import { Link } from 'react-router-dom'

function OrderConfirmation() {
  return (
    <section className="page-header">
      <h1>Order placed</h1>
      <p className="hero-sub">Thanks, we will have it ready for pickup soon.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </section>
  )
}

export default OrderConfirmation