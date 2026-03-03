import { useState } from 'react'
import { KeyRound, UserPen, MapPin, Mail, ShieldCheck, Trash2 } from 'lucide-react'
import '../settings/SettingsLayout.css'
import './SettingsAccount.css'

function Modal({ title, onClose, children }) {
  return (
    <div className="s-modal-backdrop" onClick={onClose}>
      <div className="s-modal" onClick={(e) => e.stopPropagation()}>
        <p className="s-modal-title">{title}</p>
        <div className="s-modal-body">{children}</div>
        <div className="s-modal-footer">
          <button className="s-btn" onClick={onClose}>Chiudi</button>
        </div>
      </div>
    </div>
  )
}

function ComingSoonModal({ title, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
        Questa funzionalità sarà disponibile presto. 🚀
      </p>
    </Modal>
  )
}

export default function SettingsAccount() {
  const [modal, setModal] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [address, setAddress]     = useState('')
  const [city, setCity]           = useState('')
  const [zip, setZip]             = useState('')

  const cards = [
    {
      id: 'password',
      icon: KeyRound,
      label: 'Password',
      desc: 'Cambia la password del tuo account',
    },
    {
      id: 'name',
      icon: UserPen,
      label: 'Nome e Cognome',
      desc: 'Aggiorna i dati personali',
    },
    {
      id: 'address',
      icon: MapPin,
      label: 'Indirizzo',
      desc: 'Modifica il tuo indirizzo di fatturazione',
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      desc: 'info@tuaazienda.it',
    },
    {
      id: 'security',
      icon: ShieldCheck,
      label: 'Sicurezza',
      desc: 'Autenticazione a due fattori',
    },
    {
      id: 'delete',
      icon: Trash2,
      label: 'Danger zone',
      desc: 'Elimina account',
      danger: true,
    },
  ]

  return (
    <>
      <div className="account-grid">
        {cards.map(({ id, icon: Icon, label, desc, danger }) => (
          <button
            key={id}
            className={`account-card ${danger ? 'account-card--danger' : ''} ${id === 'delete' ? 'account-card--disabled' : ''}`}
            onClick={() => id !== 'delete' && setModal(id)}
            disabled={id === 'delete'}
          >
            <div className={`account-card-icon ${danger ? 'account-card-icon--danger' : ''}`}>
              <Icon size={22} />
            </div>
            <div className="account-card-text">
              <span className="account-card-label">{label}</span>
              <span className="account-card-desc">{desc}</span>
            </div>
            {id === 'delete' && (
              <span className="s-badge s-badge--orange" style={{ marginLeft: 'auto' }}>
                Coming soon
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Modal: Password */}
      {modal === 'password' && (
        <ComingSoonModal title="Cambia password" onClose={() => setModal(null)} />
      )}

      {/* Modal: Nome */}
      {modal === 'name' && (
        <Modal title="Modifica nome e cognome" onClose={() => setModal(null)}>
          <div>
            <p className="s-modal-label">Nome</p>
            <input
              className="s-input"
              style={{ width: '100%' }}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Mario"
            />
          </div>
          <div>
            <p className="s-modal-label">Cognome</p>
            <input
              className="s-input"
              style={{ width: '100%' }}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Rossi"
            />
          </div>
          <button className="s-btn s-btn--primary" style={{ alignSelf: 'flex-end' }} onClick={() => setModal(null)}>
            Salva (mock)
          </button>
        </Modal>
      )}

      {/* Modal: Indirizzo */}
      {modal === 'address' && (
        <Modal title="Modifica indirizzo" onClose={() => setModal(null)}>
          <div>
            <p className="s-modal-label">Indirizzo</p>
            <input className="s-input" style={{ width: '100%' }} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Via Roma 1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <p className="s-modal-label">Città</p>
              <input className="s-input" style={{ width: '100%' }} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Milano" />
            </div>
            <div>
              <p className="s-modal-label">CAP</p>
              <input className="s-input" style={{ width: '100%' }} value={zip} onChange={(e) => setZip(e.target.value)} placeholder="20100" />
            </div>
          </div>
          <button className="s-btn s-btn--primary" style={{ alignSelf: 'flex-end' }} onClick={() => setModal(null)}>
            Salva (mock)
          </button>
        </Modal>
      )}

      {/* Modal: Email */}
      {modal === 'email' && (
        <Modal title="Email account" onClose={() => setModal(null)}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Email attuale:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input className="s-input" style={{ flex: 1 }} value="info@tuaazienda.it" readOnly />
            <button className="s-btn" disabled>Cambia (stub)</button>
          </div>
        </Modal>
      )}

      {/* Modal: Security */}
      {modal === 'security' && (
        <ComingSoonModal title="Autenticazione a due fattori" onClose={() => setModal(null)} />
      )}
    </>
  )
}
