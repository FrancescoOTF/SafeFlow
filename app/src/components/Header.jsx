import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="SafeFlow" />
          </Link>
          
          <nav className="nav">
            <Link to="/pricing" className="nav-link">Prezzi</Link>
            <Link to="/login" className="nav-link">Accedi</Link>
            <Link to="/register" className="btn btn-primary">Richiedi demo</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
