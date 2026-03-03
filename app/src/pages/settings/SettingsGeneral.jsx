import { useState } from 'react'
import '../settings/SettingsLayout.css'

export default function SettingsGeneral() {
  const [workspace, setWorkspace] = useState('La mia azienda')
  const [editingWs, setEditingWs] = useState(false)
  const [timezone, setTimezone] = useState('Europe/Rome')
  const [language, setLanguage] = useState('it')
  const [darkMode, setDarkMode] = useState(true)
  const [analytics, setAnalytics] = useState(true)

  return (
    <>
      {/* Card 1 — Workspace */}
      <div className="s-card">
        <p className="s-card-title">Workspace</p>

        <div className="s-field">
          <span className="s-field-label">Nome workspace</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {editingWs ? (
              <>
                <input
                  className="s-input"
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  autoFocus
                />
                <button className="s-btn s-btn--primary" onClick={() => setEditingWs(false)}>
                  Salva
                </button>
              </>
            ) : (
              <>
                <span className="s-field-value">{workspace}</span>
                <button className="s-btn" onClick={() => setEditingWs(true)}>
                  Modifica
                </button>
              </>
            )}
          </div>
        </div>

        <div className="s-field">
          <span className="s-field-label">Timezone</span>
          <select
            className="s-select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="Europe/Rome">Europe/Rome (UTC+1)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
          </select>
        </div>

        <div className="s-field">
          <span className="s-field-label">Lingua</span>
          <select
            className="s-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>

      {/* Card 2 — Aspetto */}
      <div className="s-card">
        <p className="s-card-title">Aspetto</p>
        <div className="s-field">
          <span className="s-field-label">Dark mode</span>
          <label className="s-toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="s-toggle-track" />
          </label>
        </div>
      </div>

      {/* Card 3 — Privacy */}
      <div className="s-card">
        <p className="s-card-title">Privacy</p>
        <div className="s-field">
          <span className="s-field-label">Analytics anonimi</span>
          <label className="s-toggle">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
            <span className="s-toggle-track" />
          </label>
        </div>
      </div>
    </>
  )
}
