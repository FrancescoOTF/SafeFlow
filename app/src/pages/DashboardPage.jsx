import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, TrendingUp, FileX, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { getRiskLevelColor } from '../lib/riskCalculator'
import DashboardNav from '../components/DashboardNav'
import './DashboardPage.css'

export default function DashboardPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchClientsRisk()
  }, [])

  const fetchClientsRisk = async () => {
    try {
      const { data, error } = await supabase.rpc('get_clients_risk')
      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error('Error fetching clients risk:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  /* ===== RISK LOGIC FIX ===== */
  const getEffectiveRiskLevel = (client) => {
    if (client.expired > 0) return 'HIGH'
    return client.level
  }

  const getCtaClass = (level) => {
    if (level === 'HIGH') return 'btn btn-danger btn-sm'
    if (level === 'MEDIUM') return 'btn btn-warning btn-sm'
    return 'btn btn-secondary btn-sm'
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
      expired: acc.expired + client.expired,
      risk: acc.risk + client.risk,
      missing: acc.missing + client.missing
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
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '16%' }} />
                </colgroup>

                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Risk Level</th>
                    <th>Risk Score</th>
                    <th className="text-center">Scaduti</th>
                    <th className="text-center">In Scadenza</th>
                    <th className="text-center">Mancanti</th>
                    <th>Azioni</th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => {
                    const level = getEffectiveRiskLevel(client)
                    const color = getRiskLevelColor(level)

                    return (
                      <tr
                        key={client.client_id}
                        className={`risk-row risk-${level.toLowerCase()}`}
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
