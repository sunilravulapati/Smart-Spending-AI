import { NavLink, useNavigate } from 'react-router-dom'
import { logout, getMe } from '../utils/api'
import { useState, useEffect } from 'react'

const NavBar = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getMe().then(data => setUser(data))
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        <span>Prosper</span>OS
      </NavLink>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-email">{user.email}</span>
            <NavLink to="/dashboard" className="navbar-btn outline">Dashboard</NavLink>
            <button onClick={handleLogout} className="navbar-btn ghost">Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-btn outline">Login</NavLink>
            <NavLink to="/register" className="navbar-btn primary">Get Started</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default NavBar