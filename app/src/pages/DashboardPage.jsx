import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp, FileX, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import DashboardNav from '../components/DashboardNav'
import './DashboardPage.css'

export default function DashboardPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClientsRisk()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchClientsRisk = async () => {
    try {
      setLoading(true)
      setError(null)

      // Single source of truth: DB view
      const { data, error } = await supabase
        .from('v_client_risk')
        .select(
          'corporate_client_id, client_name, effective_risk, risk_score, expired_count, risk_count, missing_count'
        )
        .order('risk_score', { ascending: false })
        .order('client_name', { ascending: true })

      if (error) throw error

      // Normalize shape for existing UI
      const mapped = (data || []).map((r) => ({
        client_id: r.corporate_client_id,
        name: r.client_name,
        level: r.effective_risk,
        score: r.risk_score,
        expired: r.expired_count ?? 0,
        risk: r.risk_count ?? 0,
        missing: r.missing_count ?? 0
      }))

      setClients(mapped)
    } catch (e) {
      console.error('Error fetching clients risk:', e)
      setError(e?.message ?? String(e))
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const getCtaClass = (level) => {
    if (level === 'HIGH') return 'btn btn-danger btn-sm'
    if (level === 'MEDIUM') return 'btn btn-warning btn-sm'
    return 'btn btn-secondary btn-sm'
  }

  // No more frontend risk logic: level comes from DB
  const getRiskColor = (level) => {
    if (level === 'HIGH') return '#ef4444'   // red
    if (level === 'MEDIUM') return '#f59e0b' // amber
    return '#22c55e'                         // green
  }

  const getTopReason = (client) => {
    const expired = client?.expired ?? 0
    const missing = client?.missing ?? 0
    const risk = client?.risk ?? 0

    if (expired > 0) return `${expired} scadut${expired === 1 ? 'o' : 'i'}`
    if (missing > 0) return `${missing} mancant${missing === 1 ? 'e' : 'i'}`
    if (risk > 0) return `${risk} in scadenza`
    return 'OK'
  }

  if (loading) {
    return (
      <div className="dashboard-layout">
        <DashboardNav />
        <div className="dashboard-content">
          <div className="loading-container">
            <div className="loading"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <DashboardNav />
        <div className="dashboard-content">
          <div className="empty-state">
            <AlertTriangle size={48} />
            <p>Errore nel caricamento dei dati</p>
            <span>{error}</span>
            <button className="btn btn-primary" onClick={fetchClientsRisk}>
              Riprova
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totals = clients.reduce(
    (acc, client) => ({
      expired: acc.expired + (client.expired ?? 0),
      risk: acc.risk + (client.risk ?? 0),
      missing: acc.missing + (client.missing ?? 0)
    }),
    { expired: 0, risk: 0, missing: 0 }
  )

  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Rischio Clienti</h1>
          <p>Priorità: clienti ordinati per risk score decrescente</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon clients">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Clienti Corporate</p>
              <h3 className="stat-value">{clients.length}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon danger">
              <FileX size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Documenti Scaduti</p>
              <h3 className="stat-value">{totals.expired}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertCircle size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">In Scadenza (30gg)</p>
              <h3 className="stat-value">{totals.risk}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-label">Documenti Mancanti</p>
              <h3 className="stat-value">{totals.missing}</h3>
            </div>
          </div>
        </div>

        <div className="risk-table-container">
          <h2>Clienti Corporate - Ordinamento per Rischio</h2>

          {clients.length === 0 ? (
            <div className="empty-state">
              <AlertTriangle size={48} />
              <p>Nessun cliente corporate</p>
              <Link to="/clients" className="btn btn-primary">
                Aggiungi Cliente
              </Link>
            </div>
          ) : (
            <div className="risk-table-scroll">
              <table className="risk-table">
                <colgroup>
                  <col style={{ width: '26%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>

                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Risk Level</th>
                    <th>Motivo</th>
                    <th>Risk Score</th>
                    <th className="text-center">Scaduti</th>
                    <th className="text-center">In Scadenza</th>
                    <th className="text-center">Mancanti</th>
                    <th>Azioni</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => {
                    const level = client.level
                    const color = getRiskColor(level)
                    const reason = getTopReason(client)

                    return (
                      <tr
                        key={client.client_id}
                        className={`risk-row risk-${String(level).toLowerCase()}`}
                      >
                        <td className="client-name">
                          <strong>{client.name}</strong>
                        </td>

                        <td>
                          <span
                            className="risk-badge"
                            style={{
                              backgroundColor: `${color}20`,
                              color,
                              border: 'none'
                            }}
                          >
                            {level}
                          </span>
                        </td>

                        <td>
                          <span className="risk-reason">{reason}</span>
                        </td>

                        <td>
                          <span className="risk-score" style={{ color }}>
                            {client.score}
                          </span>
                        </td>

                        <td className="text-center">
                          {client.expired > 0 ? (
                            <span className="count-badge expired">{client.expired}</span>
                          ) : (
                            <span className="count-badge ok">0</span>
                          )}
                        </td>

                        <td className="text-center">
                          {client.risk > 0 ? (
                            <span className="count-badge risk">{client.risk}</span>
                          ) : (
                            <span className="count-badge ok">0</span>
                          )}
                        </td>

                        <td className="text-center">
                          {client.missing > 0 ? (
                            <span className="count-badge missing">{client.missing}</span>
                          ) : (
                            <span className="count-badge ok">0</span>
                          )}
                        </td>

                        <td>
                          <Link
                            to={`/clients/${client.client_id}`}
                            className={getCtaClass(level)}
                          >
                            Vedi Dettaglio
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
