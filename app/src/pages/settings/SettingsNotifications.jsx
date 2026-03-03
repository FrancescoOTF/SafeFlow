import { useState, useEffect } from 'react'
import '../settings/SettingsLayout.css'

export default function SettingsNotifications() {
  const [email, setEmail]         = useState('')
  const [frequency, setFrequency] = useState('realtime')
  const [delay, setDelay]         = useState('immediately')
  const [billing, setBilling]     = useState(true)
  const [security, setSecurity]   = useState(true)
  const [product, setProduct]     = useState(false)
  const [toast, setToast]         = useState(false)

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }

  return (
    <>
      {/* Mail principale */}
      <div className="s-card">
        <p className="s-card-title">Mail principale</p>
        <div className="s-field">
          <span className="s-field-label">Indirizzo email</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              className="s-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="avvisi@tuaazienda.it"
            />
            <button className="s-btn s-btn--primary" onClick={showToast}>
              Salva
            </button>
          </div>
        </div>
      </div>

      {/* Frequenza */}
      <div className="s-card">
        <p className="s-card-title">Frequenza notifiche</p>
        {[
          { value: 'realtime', label: 'Real-time' },
          { value: 'daily',    label: 'Daily digest' },
          { value: 'weekly',   label: 'Weekly digest' },
        ].map(({ value, label }) => (
          <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', cursor: 'pointer' }}>
            <input
              type="radio"
              name="frequency"
              value={value}
              checked={frequency === value}
              onChange={() => setFrequency(value)}
              style={{ accentColor: 'var(--color-primary)', width: 16, height: 16 }}
            />
            <span style={{ fontSize: '0.875rem', color: frequency === value ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Ritardo */}
      <div className="s-card">
        <p className="s-card-title">Ritardo avviso</p>
        <div className="s-field">
          <span className="s-field-label">Invia dopo</span>
          <select
            className="s-select"
            value={delay}
            onChange={(e) => setDelay(e.target.value)}
          >
            <option value="immediately">Immediately</option>
            <option value="15min">15 minuti</option>
            <option value="1h">1 ora</option>
            <option value="24h">24 ore</option>
          </select>
        </div>
      </div>

      {/* Categorie */}
      <div className="s-card">
        <p className="s-card-title">Categorie</p>
        {[
          { key: 'billing',  label: 'Billing events',    val: billing,  set: setBilling },
          { key: 'security', label: 'Security alerts',   val: security, set: setSecurity },
          { key: 'product',  label: 'Product updates',   val: product,  set: setProduct },
        ].map(({ key, label, val, set }) => (
          <div key={key} className="s-field">
            <span className="s-field-label">{label}</span>
            <label className="s-toggle">
              <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
              <span className="s-toggle-track" />
            </label>
          </div>
        ))}

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="s-btn s-btn--primary" onClick={showToast}>
            Salva impostazioni
          </button>
        </div>
      </div>

      {toast && <div className="s-toast">✓ Salvato (mock)</div>}
    </>
  )
}
