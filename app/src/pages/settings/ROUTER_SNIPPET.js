// ─────────────────────────────────────────────────────────
// SNIPPET DA AGGIUNGERE IN App.jsx
// ─────────────────────────────────────────────────────────

// 1. Aggiungi questi import in cima ad App.jsx:
import SettingsLayout        from './pages/settings/SettingsLayout'
import SettingsGeneral       from './pages/settings/SettingsGeneral'
import SettingsAccount       from './pages/settings/SettingsAccount'
import SettingsNotifications from './pages/settings/SettingsNotifications'
import SettingsPlan          from './pages/settings/SettingsPlan'
import SettingsBilling       from './pages/settings/SettingsBilling'

// 2. Sostituisci/rimuovi le vecchie route /settings/* e aggiungi questo
//    blocco dentro <Routes> (dopo le altre route protette):

<Route
  path="/settings"
  element={session ? <SettingsLayout /> : <Navigate to="/login" />}
>
  <Route path="general"       element={<SettingsGeneral />} />
  <Route path="account"       element={<SettingsAccount />} />
  <Route path="notifications" element={<SettingsNotifications />} />
  <Route path="plan"          element={<SettingsPlan />} />
  <Route path="billing"       element={<SettingsBilling />} />
</Route>

// ─────────────────────────────────────────────────────────
// FILE DA CREARE/COPIARE in src/pages/settings/
// ─────────────────────────────────────────────────────────
// SettingsLayout.jsx   (+ SettingsLayout.css)
// SettingsGeneral.jsx
// SettingsAccount.jsx  (+ SettingsAccount.css)
// SettingsNotifications.jsx
// SettingsPlan.jsx
// SettingsBilling.jsx  (+ SettingsBilling.css)
//
// FILE DA MODIFICARE:
// src/components/DashboardNav.jsx  (sidebar semplificata)
