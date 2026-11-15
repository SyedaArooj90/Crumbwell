import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function Navbar() {
  const { totalCount } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">C</span>
        Crumbwell
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
          Menu
        </NavLink>
        <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>
          Blog
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>

        <div className="nav-dropdown">
          <button className="nav-dropdown-trigger">More ▾</button>
          <div className="nav-dropdown-menu">
            <p className="nav-dropdown-heading">Explore</p>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/testimonials">Testimonials</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/location">Location</NavLink>

            <p className="nav-dropdown-heading">Business</p>
            <NavLink to="/catering">Catering</NavLink>
            <NavLink to="/gift-cards">Gift cards</NavLink>
            <NavLink to="/careers">Careers</NavLink>

            <p className="nav-dropdown-heading">Account</p>
            <NavLink to="/my-orders">My orders</NavLink>
          </div>
        </div>
      </nav>

      <div className="nav-auth">
  {user ? (
    <>
      {user.role !== 'customer' && (
        <NavLink to="/admin" className="nav-login">
          Admin
        </NavLink>
      )}
      <span className="nav-user">Hi, {user.name}</span>
      <button className="nav-logout" onClick={logout}>
        Log out
      </button>
    </>
  ) : (
    <>
      <NavLink to="/login" className="nav-login">
        Log in
      </NavLink>
      <NavLink to="/signup" className="btn-signup">
        Sign up
      </NavLink>
    </>
  )}
  <NavLink to="/cart" className="nav-cart">
    Cart{totalCount > 0 ? ` (${totalCount})` : ''}
  </NavLink>
</div>
    </header>
  )
}

export default Navbar