import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import DashboardNav from '../components/DashboardNav'
import './ClientsPage.css'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [newClientName, setNewClientName] = useState('')

  useEffect(() => {
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchClients = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utente non autenticato')

      const { data, error } = await supabase
        .from('corporate_clients')
        .select('id, name')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) throw error

      setClients(data || [])
    } catch (e) {
      console.error('Error fetching clients:', e)
      setError(e?.message ?? 'Errore nel caricamento clienti')
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClient = async (e) => {
    e.preventDefault()
    if (!newClientName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utente non autenticato')

      const { error } = await supabase
        .from('corporate_clients')
        .insert([{ user_id: user.id, name: newClientName.trim() }])

      if (error) throw error

      setNewClientName('')
      setShowClientModal(false)
      fetchClients()
    } catch (e) {
      console.error('Error creating client:', e)
      alert('Errore nella creazione del cliente')
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

  if (error) {
    return (
      <div className="dashboard-layout">
        <DashboardNav />
        <div className="dashboard-content">
          <div className="empty-state">
            <Users size={48} />
            <p>Errore nel caricamento</p>
            <span>{error}</span>
            <button className="btn btn-primary" onClick={fetchClients}>
              Riprova
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <DashboardNav />

      <div className="dashboard-content">
        <div className="clients-header">
          <div>
            <h1>Clienti Corporate</h1>
            <p>Elenco clienti. Clicca per vedere la checklist documentale.</p>
          </div>

          <button className="btn btn-primary" onClick={() => setShowClientModal(true)}>
            <Plus size={16} />
            Nuovo Cliente
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <p>Nessun cliente inserito</p>
            <button className="btn btn-primary" onClick={() => setShowClientModal(true)}>
              Aggiungi primo cliente
            </button>
          </div>
        ) : (
          <div className="clients-grid">
            {clients.map((c) => (
              <Link key={c.id} to={`/clients/${c.id}`} className="client-card">
                <div className="client-card-name">{c.name}</div>
                <div className="client-card-meta">Apri dettaglio →</div>
              </Link>
            ))}
          </div>
        )}

        {showClientModal && (
          <div className="modal-overlay" onClick={() => setShowClientModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Nuovo Cliente Corporate</h3>
              <form onSubmit={handleCreateClient}>
                <div className="form-group">
                  <label>Nome Cliente *</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    required
                    placeholder="es. Enel Energia S.p.A."
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowClientModal(false)}
                  >
                    Annulla
                  </button>

                  <button type="submit" className="btn btn-primary">
                    Crea Cliente
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
