import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut, Settings, CreditCard, User, Globe, Receipt } from 'lucide-react'
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

  const settingsItems = [
    { path: '/settings/plan', icon: CreditCard, label: 'Piano & Pagamenti' },
    { path: '/settings/billing', icon: Receipt, label: 'Fatturazione' },
    { path: '/settings/account', icon: User, label: 'Account' },
    { path: '/settings/language', icon: Globe, label: 'Lingua' },
  ]

  const isPathActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

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
          const isActive = isPathActive(item.path)

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

      <div className="dashboard-nav-divider" />

      <div className="dashboard-nav-items">
        <div className="dashboard-nav-section-title">
          <Settings size={16} />
          <span>Impostazioni</span>
        </div>

        {settingsItems.map((item) => {
          const Icon = item.icon
          const isActive = isPathActive(item.path)

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
