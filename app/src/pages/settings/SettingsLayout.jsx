import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import DashboardNav from '../../components/DashboardNav'
import './SettingsLayout.css'

const subNav = [
  { path: '/settings/general',       label: 'Generali' },
  { path: '/settings/account',       label: 'Account' },
  { path: '/settings/notifications', label: 'Notifiche' },
  { path: '/settings/plan',          label: 'Piano' },
  { path: '/settings/billing',       label: 'Fatturazione' },
]

export default function SettingsLayout() {
  const { pathname } = useLocation()

  // redirect /settings → /settings/general
  if (pathname === '/settings') {
    return <Navigate to="/settings/general" replace />
  }

  return (
    <div className="dashboard-layout">
      <DashboardNav />
      <div className="dashboard-content settings-outer">
        <div className="settings-header">
          <h1>Impostazioni</h1>
          <p>Gestisci account, notifiche e piano.</p>
        </div>

        <div className="settings-body">
          {/* Sub-nav */}
          <aside className="settings-subnav">
            {subNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `settings-subnav-item ${isActive ? 'settings-subnav-item--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </aside>

          {/* Page content */}
          <main className="settings-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
