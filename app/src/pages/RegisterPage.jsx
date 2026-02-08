import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AuthPages.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    fullName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Register user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName
          }
        }
      })

      if (signUpError) throw signUpError

      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-box">
            <div className="success-message">
              <h2>✓ Registrazione completata!</h2>
              <p>Controlla la tua email per confermare l'account.</p>
              <p>Sarai reindirizzato al login...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-box">
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="SafeFlow" />
          </Link>
          
          <h1>Richiedi una demo</h1>
          <p className="auth-subtitle">Inizia a usare SafeFlow oggi stesso</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Nome e Cognome</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Mario Rossi"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Azienda</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Nome azienda"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email aziendale</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="nome@azienda.it"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
              />
              <small>Minimo 6 caratteri</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-large auth-submit"
              disabled={loading}
            >
              {loading ? <span className="loading"></span> : 'Crea account'}
            </button>
          </form>

          <p className="auth-footer">
            Hai già un account? <Link to="/login">Accedi</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
