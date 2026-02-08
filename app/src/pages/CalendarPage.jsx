import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import DashboardNav from '../components/DashboardNav'
import './CalendarPage.css'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          clients!inner(name, user_id)
        `)
        .eq('clients.user_id', user.id)
        .order('expiry_date')

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getDocumentsForDate = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0]

    return documents.filter(doc => doc.expiry_date === dateStr)
  }

  const getDocumentStatus = (expiryDate) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return 'expired'
    if (daysUntilExpiry <= 60) return 'warning'
    return 'ok'
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const docsForDay = getDocumentsForDate(day)
      const today = new Date()
      const isToday = 
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${docsForDay.length > 0 ? 'has-docs' : ''}`}
        >
          <div className="day-number">{day}</div>
          {docsForDay.length > 0 && (
            <div className="day-indicators">
              {docsForDay.slice(0, 3).map((doc, idx) => {
                const status = getDocumentStatus(doc.expiry_date)
                return (
                  <div key={idx} className={`doc-indicator status-${status}`} title={doc.document_name}>
                    {status === 'ok' && <CheckCircle size={12} />}
                    {status === 'warning' && <AlertCircle size={12} />}
                    {status === 'expired' && <XCircle size={12} />}
                  </div>
                )
              })}
              {docsForDay.length > 3 && (
                <span className="more-indicator">+{docsForDay.length - 3}</span>
              )}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const getUpcomingDocuments = () => {
    const now = new Date()
    return documents
      .filter(doc => new Date(doc.expiry_date) >= now)
      .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))
      .slice(0, 10)
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

  const monthNames = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ]

  const upcomingDocs = getUpcomingDocuments()

  return (
    <div className="dashboard-layout">
      <DashboardNav />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Calendario Scadenze</h1>
            <p>Visualizza tutte le scadenze documentali in un unico calendario</p>
          </div>
        </div>

        <div className="calendar-layout">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button onClick={previousMonth} className="calendar-nav-btn">
                <ChevronLeft size={20} />
              </button>
              <h2>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button onClick={nextMonth} className="calendar-nav-btn">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="calendar-grid">
              <div className="calendar-weekday">Dom</div>
              <div className="calendar-weekday">Lun</div>
              <div className="calendar-weekday">Mar</div>
              <div className="calendar-weekday">Mer</div>
              <div className="calendar-weekday">Gio</div>
              <div className="calendar-weekday">Ven</div>
              <div className="calendar-weekday">Sab</div>
              
              {renderCalendar()}
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <CheckCircle size={16} className="status-ok" />
                <span>OK (oltre 60 giorni)</span>
              </div>
              <div className="legend-item">
                <AlertCircle size={16} className="status-warning" />
                <span>In scadenza (entro 60 giorni)</span>
              </div>
              <div className="legend-item">
                <XCircle size={16} className="status-expired" />
                <span>Scaduto</span>
              </div>
            </div>
          </div>

          {/* Upcoming Documents */}
          <div className="upcoming-section">
            <h3>Prossime Scadenze</h3>
            <div className="upcoming-list">
              {upcomingDocs.length === 0 ? (
                <div className="empty-state-small">
                  <p>Nessuna scadenza imminente</p>
                </div>
              ) : (
                upcomingDocs.map(doc => {
                  const status = getDocumentStatus(doc.expiry_date)
                  const expiryDate = new Date(doc.expiry_date)
                  const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))

                  return (
                    <div key={doc.id} className={`upcoming-item status-${status}`}>
                      <div className="upcoming-icon">
                        {status === 'ok' && <CheckCircle size={18} />}
                        {status === 'warning' && <AlertCircle size={18} />}
                        {status === 'expired' && <XCircle size={18} />}
                      </div>
                      <div className="upcoming-content">
                        <h4>{doc.document_name}</h4>
                        <p className="upcoming-client">{doc.clients.name}</p>
                        <p className="upcoming-date">
                          {expiryDate.toLocaleDateString('it-IT', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        {status === 'warning' && (
                          <p className="upcoming-warning">Tra {daysUntilExpiry} giorni</p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
