import { Download } from 'lucide-react'
import '../settings/SettingsLayout.css'
import './SettingsBilling.css'

const invoices = [
  { date: '01 Mar 2026', amount: '€109,90', status: 'Pagata' },
  { date: '01 Feb 2026', amount: '€109,90', status: 'Pagata' },
  { date: '01 Gen 2026', amount: '€109,90', status: 'Pagata' },
  { date: '01 Dic 2025', amount: '€109,90', status: 'Pagata' },
  { date: '01 Nov 2025', amount: '€109,90', status: 'Pagata' },
]

export default function SettingsBilling() {
  return (
    <>
      {/* Metodo pagamento */}
      <div className="s-card">
        <p className="s-card-title">Metodo di pagamento</p>
        <div className="s-field">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="billing-card-chip">VISA</div>
            <span className="s-field-value">•••• •••• •••• 4242</span>
            <span className="s-badge s-badge--green">Attiva</span>
          </div>
          <button className="s-btn" disabled>
            Aggiorna (stub)
          </button>
        </div>
      </div>

      {/* Invoices */}
      <div className="s-card">
        <p className="s-card-title">Fatture</p>
        <table className="billing-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Importo</th>
              <th>Stato</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i}>
                <td>{inv.date}</td>
                <td>{inv.amount}</td>
                <td>
                  <span className="s-badge s-badge--green">{inv.status}</span>
                </td>
                <td>
                  <button className="s-btn billing-dl-btn" disabled>
                    <Download size={14} />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
