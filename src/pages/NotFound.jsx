import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page-header">
      <h1>Page not found</h1>
      <Link to="/" className="btn-primary">Back to home</Link>
    </section>
  )
}

export default NotFound