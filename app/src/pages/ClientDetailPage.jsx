import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileQuestion,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import {
  calculateDocumentStatus,
  getStatusColor,
  calculateRiskScore,
  getRiskLevelColor,
} from '../lib/riskCalculator'
import { getEffectiveRiskLevel } from '../lib/riskUtils'
import DashboardNav from '../components/DashboardNav'
import './ClientDetailPage.css'

export default function ClientDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [requirements, setRequirements] = useState([])
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState(null)
  const [uploadForm, setUploadForm] = useState({
    filename: '',
    expires_at: '',
  })

  useEffect(() => {
    fetchClientData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchClientData = async () => {
    try {
      // Client
      const { data: clientData, error: clientErr } = await supabase
        .from('corporate_clients')
        .select('*')
        .eq('id', id)
        .single()

      if (clientErr) throw clientErr
      setClient(clientData)

      // Requirements + doc types
      const { data: reqData, error: reqErr } = await supabase
        .from('client_requirements')
        .select(
          `
          *,
          document_types (*)
        `
        )
        .eq('corporate_client_id', id)

      if (reqErr) throw reqErr
      setRequirements(reqData || [])

      // Uploads
      const { data: uploadsData, error: upErr } = await supabase
        .from('document_uploads')
        .select('*')
        .eq('corporate_client_id', id)

      if (upErr) throw upErr
      setUploads(uploadsData || [])
    } catch (error) {
      console.error('Error fetching client data:', error)
      setClient(null)
      setRequirements([])
      setUploads([])
    } finally {
      setLoading(false)
    }
  }

  const handleUploadDocument = async (e) => {
    e.preventDefault()
    if (!selectedDocType) return

    try {
      const payload = {
        corporate_client_id: id,
        document_type_id: selectedDocType.id,
        filename: uploadForm.filename,
        file_url: '#', // MVP mock
        expires_at: uploadForm.expires_at,
        status: calculateDocumentStatus(uploadForm.expires_at),
      }

      const { error } = await supabase.from('document_uploads').insert([payload])
      if (error) throw error

      setUploadForm({ filename: '', expires_at: '' })
      setShowUploadModal(false)
      setSelectedDocType(null)
      fetchClientData()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Errore nel caricamento del documento')
    }
  }

  const openUploadModal = (docType) => {
    setSelectedDocType(docType)
    setShowUploadModal(true)
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

  const risk = calculateRiskScore(requirements, uploads)
  const effectiveLevel = getEffectiveRiskLevel({
    expired: risk.expired,
    risk: risk.risk,
    missing: risk.missing,
  })

  const getRequirementStatus = (requirement) => {
    const relevantUploads = uploads.filter(
      (u) => u.document_type_id === requirement.document_type_id
    )

    if (relevantUploads.length === 0) {
      return {
        status: 'MISSING',
        bestUpload: null,
        message: 'Nessun documento caricato',
      }
    }

    // Best upload = farthest expires_at
    const bestUpload = relevantUploads
      .slice()
      .sort((a, b) => new Date(b.expires_at) - new Date(a.expires_at))[0]

    const status = calculateDocumentStatus(bestUpload.expires_at)

    let message = ''
    if (status === 'EXPIRED') {
      const expiryDate = new Date(bestUpload.expires_at)
      const daysAgo = Math.abs(
        Math.ceil((new Date() - expiryDate) / (1000 * 60 * 60 * 24))
      )
      message = `Scaduto da ${daysAgo} giorni`
    } else if (status === 'RISK') {
      const expiryDate = new Date(bestUpload.expires_at)
      const daysLeft = Math.ceil(
        (expiryDate - new Date()) / (1000 * 60 * 60 * 24)
      )
      message = `Scade tra ${daysLeft} giorni`
    } else {
      const expiryDate = new Date(bestUpload.expires_at)
      message = `Valido fino al ${expiryDate.toLocaleDateString('it-IT')}`
    }

    return { status, bestUpload, message }
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
                  backgroundColor: `${getRiskLevelColor(effectiveLevel)}20`,
                  color: getRiskLevelColor(effectiveLevel),
                  border: `2px solid ${getRiskLevelColor(effectiveLevel)}`,
                }}
              >
                {effectiveLevel} RISK
              </span>
              <span
                className="risk-score-large"
                style={{ color: getRiskLevelColor(effectiveLevel) }}
              >
                Score: {risk.score}
              </span>
            </div>
          </div>

          <div className="risk-breakdown">
            <div className="risk-stat">
              <span className="risk-stat-value expired">{risk.expired}</span>
              <span className="risk-stat-label">Scaduti</span>
            </div>
            <div className="risk-stat">
              <span className="risk-stat-value risk">{risk.risk}</span>
              <span className="risk-stat-label">In Scadenza</span>
            </div>
            <div className="risk-stat">
              <span className="risk-stat-value missing">{risk.missing}</span>
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
                  className={`requirement-card status-${reqStatus.status.toLowerCase()}`}
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
                          <p className="doc-description">
                            {req.document_types.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(reqStatus.status)}20`,
                        color: getStatusColor(reqStatus.status),
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
                            <span className="info-value">
                              {reqStatus.bestUpload.filename}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Caricato il:</span>
                            <span className="info-value">
                              {new Date(reqStatus.bestUpload.uploaded_at).toLocaleDateString(
                                'it-IT'
                              )}
                            </span>
                          </div>
                          <div className="info-row">
                            <span className="info-label">Scadenza:</span>
                            <span
                              className="info-value"
                              style={{
                                fontWeight: 600,
                                color: getStatusColor(reqStatus.status),
                              }}
                            >
                              {new Date(reqStatus.bestUpload.expires_at).toLocaleDateString(
                                'it-IT'
                              )}
                            </span>
                          </div>
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
          <div
            className="modal-overlay"
            onClick={() => setShowUploadModal(false)}
          >
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
