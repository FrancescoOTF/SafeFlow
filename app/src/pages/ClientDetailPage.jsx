```jsx
import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileQuestion
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import DashboardNav from '../components/DashboardNav'
import './ClientDetailPage.css'

// --- UI helpers (no lib imports) ---
const getRiskColor = (level) => {
  const lv = String(level || 'LOW').toUpperCase()
  if (lv === 'HIGH') return '#ef4444'
  if (lv === 'MEDIUM') return '#f59e0b'
  return '#22c55e'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'OK':
      return '#22c55e'
    case 'RISK':
      return '#f59e0b'
    case 'EXPIRED':
      return '#ef4444'
    case 'MISSING':
      return '#94a3b8'
    default:
      return '#94a3b8'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'OK':
      return <CheckCircle size={20} />
    case 'RISK':
      return <AlertCircle size={20} />
    case 'EXPIRED':
      return <XCircle size={20} />
    case 'MISSING':
      return <FileQuestion size={20} />
    default:
      return null
  }
}

// used ONLY when inserting a new upload
const calcStatusFromDate = (expires_at) => {
  if (!expires_at) return 'MISSING'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exp = new Date(expires_at)
  exp.setHours(0, 0, 0, 0)

  if (exp < today) return 'EXPIRED'
  const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24))
  if (diffDays <= 30) return 'RISK'
  return 'OK'
}

export default function ClientDetailPage() {
  const { id } = useParams()

  const [client, setClient] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [latestRows, setLatestRows] = useState([])
  const [clientRisk, setClientRisk] = useState(null)

  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState(null)
  const [uploadForm, setUploadForm] = useState({ filename: '', expires_at: '' })

  useEffect(() => {
    let alive = true

    const fetchClientData = async () => {
      try {
        setLoading(true)

        // 1) client
        const { data: clientData, error: clientErr } = await supabase
          .from('corporate_clients')
          .select('*')
          .eq('id', id)
          .single()

        if (!alive) return
        if (clientErr) throw clientErr
        setClient(clientData)

        // 2) requirements + doc types (serve per “Carica/Aggiorna Documento”)
        const { data: reqData, error: reqErr } = await supabase
          .from('client_requirements')
          .select(`*, document_types (*)`)
          .eq('corporate_client_id', id)

        if (!alive) return
        if (reqErr) throw reqErr
        setRequirements(reqData || [])

        // 3) risk header from v_client_risk (single row)
        const { data: riskRow, error: riskErr } = await supabase
          .from('v_client_risk')
          .select(
            'corporate_client_id, client_name, risk_score, effective_risk, expired_count, risk_count, missing_count'
          )
          .eq('corporate_client_id', id)
          .maybeSingle()

        if (!alive) return
        if (riskErr) {
          setClientRisk(null)
        } else {
          setClientRisk(riskRow || null)
        }

        // 4) latest status rows from v_requirement_latest_status
        const { data: latest, error: latestErr } = await supabase
          .from('v_requirement_latest_status')
          .select('*')
          .eq('corporate_client_id', id)

        if (!alive) return
        if (latestErr) {
          console.error('v_requirement_latest_status read error:', latestErr)
          setLatestRows([])
        } else {
          setLatestRows(latest || [])
        }
      } catch (error) {
        if (!alive) return
        console.error('Error fetching client data:', error)
        setClient(null)
        setRequirements([])
        setLatestRows([])
        setClientRisk(null)
      } finally {
        if (!alive) return
        setLoading(false)
      }
    }

    if (id) fetchClientData()

    return () => {
      alive = false
    }
  }, [id])

  const latestByDocTypeId = useMemo(() => {
    const m = new Map()
    for (const r of latestRows || []) {
      if (r.document_type_id) m.set(r.document_type_id, r)
    }
    return m
  }, [latestRows])

  const latestByDocName = useMemo(() => {
    const m = new Map()
    for (const r of latestRows || []) {
      if (r.document_name) m.set(String(r.document_name).toLowerCase(), r)
      if (r.document_type_name) m.set(String(r.document_type_name).toLowerCase(), r)
    }
    return m
  }, [latestRows])

  const getRequirementStatus = (req) => {
    const dt = req.document_types
    if (!dt) {
      return { status: 'MISSING', message: 'Documento non configurato', bestUpload: null }
    }

    const row =
      (dt.id && latestByDocTypeId.get(dt.id)) ||
      (dt.name && latestByDocName.get(String(dt.name).toLowerCase()))

    if (!row) {
      return { status: 'MISSING', message: 'Nessun documento caricato', bestUpload: null }
    }

    const status = row.status || 'MISSING'

    let message = ''
    if (status === 'MISSING') message = 'Nessun documento caricato'
    else if (status === 'EXPIRED') {
      if (row.days_delta != null) message = `Scaduto da ${Math.abs(row.days_delta)} giorni`
      else message = 'Scaduto'
    } else if (status === 'RISK') {
      if (row.days_delta != null) message = `Scade tra ${row.days_delta} giorni`
      else message = 'In scadenza'
    } else {
      if (row.expires_at) message = `Valido fino al ${new Date(row.expires_at).toLocaleDateString('it-IT')}`
      else message = 'Valido'
    }

    const bestUpload = row.filename
      ? {
          filename: row.filename,
          uploaded_at: row.uploaded_at,
          expires_at: row.expires_at
        }
      : null

    return { status, message, bestUpload }
  }

  const openUploadModal = (docType) => {
    setSelectedDocType(docType)
    setUploadForm({ filename: '', expires_at: '' })
    setShowUploadModal(true)
  }

  const handleUploadDocument = async (e) => {
    e.preventDefault()
    if (!selectedDocType) return

    try {
      const payload = {
        corporate_client_id: id,
        document_type_id: selectedDocType.id,
        filename: uploadForm.filename,
        file_url: '#',
        expires_at: uploadForm.expires_at,
        status: calcStatusFromDate(uploadForm.expires_at)
      }

      const { error } = await supabase.from('document_uploads').insert([payload])
      if (error) throw error

      setUploadForm({ filename: '', expires_at: '' })
      setShowUploadModal(false)
      setSelectedDocType(null)

      // refresh view-backed data
      setLoading(true)

      const { data: riskRow } = await supabase
        .from('v_client_risk')
        .select(
          'corporate_client_id, client_name, risk_score, effective_risk, expired_count, risk_count, missing_count'
        )
        .eq('corporate_client_id', id)
        .maybeSingle()

      const { data: latest } = await supabase
        .from('v_requirement_latest_status')
        .select('*')
        .eq('corporate_client_id', id)

      setClientRisk(riskRow || null)
      setLatestRows(latest || [])
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setLoading(false)
    }
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

  if (!client) {
    return (
      <div className="dashboard-layout">
        <DashboardNav />
        <div className="dashboard-content">
          <div className="empty-state">
            <p>Cliente non trovato</p>
            <Link to="/dashboard" className="btn btn-primary">
              Torna alla Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const effectiveLevel = String(clientRisk?.effective_risk || 'LOW').toUpperCase()
  const riskScore = clientRisk?.risk_score ?? 0
  const expiredCount = clientRisk?.expired_count ?? 0
  const riskCount = clientRisk?.risk_count ?? 0
  const missingCount = clientRisk?.missing_count ?? 0
  const riskColor = getRiskColor(effectiveLevel)

  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <div className="dashboard-content">
        <div className="detail-header">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={20} />
            Torna alla Dashboard
          </Link>

          <div className="client-title-section">
            <h1>{client.name}</h1>

            <div className="client-risk-info">
              <span
                className="risk-badge-large"
                style={{
                  backgroundColor: `${riskColor}20`,
                  color: riskColor,
                  border: `2px solid ${riskColor}`
                }}
              >
                {effectiveLevel} RISK
              </span>

              <span className="risk-score-large" style={{ color: riskColor }}>
                Score: {riskScore}
              </span>
            </div>
          </div>

          <div className="risk-breakdown">
            <div className="risk-stat">
              <span className="risk-stat-value expired">{expiredCount}</span>
              <span className="risk-stat-label">Scaduti</span>
            </div>
            <div className="risk-stat">
              <span className="risk-stat-value risk">{riskCount}</span>
              <span className="risk-stat-label">In Scadenza</span>
            </div>
            <div className="risk-stat">
              <span className="risk-stat-value missing">{missingCount}</span>
              <span className="risk-stat-label">Mancanti</span>
            </div>
          </div>
        </div>

        <div className="checklist-container">
          <h2>Checklist Documenti Richiesti</h2>

          <div className="requirements-list">
            {requirements.map((req) => {
              const reqStatus = getRequirementStatus(req)

              return (
                <div
                  key={req.id}
                  className={`requirement-card status-${String(reqStatus.status).toLowerCase()}`}
                >
                  <div className="requirement-header">
                    <div className="requirement-title">
                      <div
                        className="status-icon"
                        style={{ color: getStatusColor(reqStatus.status) }}
                      >
                        {getStatusIcon(reqStatus.status)}
                      </div>
                      <div>
                        <h3>{req.document_types?.name}</h3>
                        {req.document_types?.description && (
                          <p className="doc-description">{req.document_types.description}</p>
                        )}
                      </div>
                    </div>

                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(reqStatus.status)}20`,
                        color: getStatusColor(reqStatus.status)
                      }}
                    >
                      {reqStatus.status}
                    </span>
                  </div>

                  <div className="requirement-body">
                    <div className="requirement-info">
                      <div className="info-row">
                        <span className="info-label">Stato:</span>
                        <span className="info-value">{reqStatus.message}</span>
                      </div>

                      {reqStatus.bestUpload && (
                        <>
                          <div className="info-row">
                            <span className="info-label">File:</span>
                            <span className="info-value">{reqStatus.bestUpload.filename}</span>
                          </div>

                          {reqStatus.bestUpload.uploaded_at && (
                            <div className="info-row">
                              <span className="info-label">Caricato il:</span>
                              <span className="info-value">
                                {new Date(reqStatus.bestUpload.uploaded_at).toLocaleDateString(
                                  'it-IT'
                                )}
                              </span>
                            </div>
                          )}

                          {reqStatus.bestUpload.expires_at && (
                            <div className="info-row">
                              <span className="info-label">Scadenza:</span>
                              <span
                                className="info-value"
                                style={{
                                  fontWeight: 600,
                                  color: getStatusColor(reqStatus.status)
                                }}
                              >
                                {new Date(reqStatus.bestUpload.expires_at).toLocaleDateString(
                                  'it-IT'
                                )}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openUploadModal(req.document_types)}
                    >
                      <Upload size={16} />
                      {reqStatus.status === 'MISSING'
                        ? 'Carica Documento'
                        : 'Aggiorna Documento'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Carica {selectedDocType?.name}</h3>

              <form onSubmit={handleUploadDocument}>
                <div className="form-group">
                  <label>Nome File *</label>
                  <input
                    type="text"
                    value={uploadForm.filename}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, filename: e.target.value })
                    }
                    required
                    placeholder="es. durc_2025.pdf"
                  />
                  <small>In produzione qui ci sarà l'upload file reale</small>
                </div>

                <div className="form-group">
                  <label>Data Scadenza *</label>
                  <input
                    type="date"
                    value={uploadForm.expires_at}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, expires_at: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salva Documento
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```
