import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import '../settings/SettingsLayout.css'

export default function SettingsPlan() {
  const navigate = useNavigate()

  return (
    <>
      <div className="s-card">
        <p className="s-card-title">Piano attuale</p>

        <div className="s-field">
          <span className="s-field-label">Piano</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="s-field-value">Business — Mensile</span>
            <span className="s-badge s-badge--green">Attivo</span>
          </div>
        </div>

        <div className="s-field">
          <span className="s-field-label">Importo</span>
          <span className="s-field-value">€109,90 / mese</span>
        </div>

        <div className="s-field">
          <span className="s-field-label">Prossimo rinnovo</span>
          <span className="s-field-value">1 Aprile 2026</span>
        </div>

        <div className="s-field">
          <span className="s-field-label">Stato accesso</span>
          <span className="s-badge s-badge--green">Completo</span>
        </div>
      </div>

      <div className="s-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <p style={{ color: 'var(--color-text)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.95rem' }}>
            Vuoi cambiare piano?
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: 0 }}>
            Visualizza tutti i piani disponibili e gestisci il tuo abbonamento.
          </p>
        </div>
        <button
          className="s-btn s-btn--primary"
          style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
          onClick={() => navigate('/pricing')}
        >
          <Zap size={16} />
          Upgrade / Gestisci piano
        </button>
      </div>
    </>
  )
}
