import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'
import './DashboardNav.css'

export default function DashboardNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/clients', icon: Users, label: 'Clienti' },
  ]

  return (
    <nav className="dashboard-nav">
      <div className="dashboard-nav-header">
        <Link to="/" className="dashboard-logo">
          <img src="/logo.png" alt="SafeFlow" />
        </Link>
      </div>

      <div className="dashboard-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      <div className="dashboard-nav-footer">
        <button onClick={handleLogout} className="dashboard-nav-item logout-btn">
          <LogOut size={20} />
          <span>Esci</span>
        </button>
      </div>
    </nav>
  )
}
