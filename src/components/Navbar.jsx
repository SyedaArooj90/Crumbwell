import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">&</span>
        Hearth &amp; Crumb
      </NavLink>
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/menu" className={({ isActive }) => (isActive ? 'active' : '')}>
          Menu
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
          About
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
          Contact
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
