import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import PricingPage from './pages/PricingPage'
import SettingsLayout from './pages/settings/SettingsLayout'
import SettingsGeneral from './pages/settings/SettingsGeneral'
import SettingsAccount from './pages/settings/SettingsAccount'
import SettingsNotifications from './pages/settings/SettingsNotifications'
import SettingsPlan from './pages/settings/SettingsPlan'
import SettingsBilling from './pages/settings/SettingsBilling'

import './styles/global.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--color-bg)'
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/dashboard" /> : <RegisterPage />} 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={session ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={session ? <ClientsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients/:id"
          element={session ? <ClientDetailPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={session ? <SettingsLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="general" replace />} />
          <Route path="general"       element={<SettingsGeneral />} />
          <Route path="account"       element={<SettingsAccount />} />
          <Route path="notifications" element={<SettingsNotifications />} />
          <Route path="plan"          element={<SettingsPlan />} />
          <Route path="billing"       element={<SettingsBilling />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
