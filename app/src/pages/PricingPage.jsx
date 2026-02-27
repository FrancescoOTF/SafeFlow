import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './PricingPage.css'

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  const MONTHLY_PRICE = 109.90
  const YEARLY_PRICE = (MONTHLY_PRICE * 12 * 0.85).toFixed(0)

  return (
    <div className="pricing-page">
      <Header />

      {/* ── Hero ── */}
      <section className="section pricing-hero">
        <div className="container">
          <span className="pricing-eyebrow">Pricing</span>
          <h1 className="text-center">
            Un solo piano.<br />
            <span className="text-primary">Tutto incluso.</span>
          </h1>
          <p className="pricing-subtitle text-center">
            Nessuna sorpresa, nessun costo nascosto. SafeFlow Business ti dà
            accesso completo a tutte le funzionalità.
          </p>

          {/* Toggle */}
          <div className="pricing-toggle-row">
            <span className={`billing-label ${!yearly ? 'billing-active' : ''}`}>
              Mensile
            </span>
            <button
              className={`toggle-switch ${yearly ? 'toggle-on' : ''}`}
              onClick={() => setYearly(v => !v)}
              aria-label="Cambia periodo fatturazione"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={`billing-label ${yearly ? 'billing-active' : ''}`}>
              Annuale
              <span className="save-badge">–15%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="section pricing-cards-section">
        <div className="container">

          {/* Top row: 3 cards */}
          <div className="pricing-grid-top">

            {/* Starter – coming soon */}
            <div className="pricing-card card-soon">
              <span className="soon-label">Prossimamente</span>
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="pricing-price">
                  <span className="price-soon">—</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} /><span>Fino a 5 clienti</span></li>
                <li><Check size={16} /><span>Dashboard base</span></li>
                <li><Check size={16} /><span>Alert via email</span></li>
              </ul>
              <button className="btn btn-secondary btn-large pricing-cta" disabled>
                Prossimamente
              </button>
            </div>

            {/* Business – piano reale, evidenziato */}
            <div className="pricing-card card-featured">
              <div className="featured-badge">Più popolare</div>
              <div className="pricing-header">
                <h3>Business</h3>
                <div className="pricing-price">
                  {yearly ? (
                    <>
                      <span className="currency">€</span>
                      <span className="amount">{YEARLY_PRICE}</span>
                      <span className="period">/anno</span>
                    </>
                  ) : (
                    <>
                      <span className="currency">€</span>
                      <span className="amount">109,90</span>
                      <span className="period">/mese</span>
                    </>
                  )}
                </div>
                {yearly && (
                  <p className="yearly-note">
                    Equivale a €{(YEARLY_PRICE / 12).toFixed(2)}/mese
                  </p>
                )}
              </div>
              <ul className="pricing-features">
                <li><Check size={16} /><span>Clienti corporate illimitati</span></li>
                <li><Check size={16} /><span>Controllo scadenze illimitato</span></li>
                <li><Check size={16} /><span>Alert email multipli</span></li>
                <li><Check size={16} /><span>Dashboard completa</span></li>
                <li><Check size={16} /><span>Calendario scadenze</span></li>
                <li><Check size={16} /><span>Storico completo</span></li>
              </ul>
              <button
                className="btn btn-primary btn-large pricing-cta"
                onClick={() => {}} // TODO integrate Stripe checkout
              >
                {yearly ? 'Abbonati annuale' : 'Abbonati ora'}
              </button>
            </div>

            {/* Pro – coming soon */}
            <div className="pricing-card card-soon">
              <span className="soon-label">Prossimamente</span>
              <div className="pricing-header">
                <h3>Pro</h3>
                <div className="pricing-price">
                  <span className="price-soon">—</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><Check size={16} /><span>Tutto di Business</span></li>
                <li><Check size={16} /><span>Accesso API</span></li>
                <li><Check size={16} /><span>Garanzia SLA</span></li>
                <li><Check size={16} /><span>Supporto prioritario</span></li>
              </ul>
              <button className="btn btn-secondary btn-large pricing-cta" disabled>
                Prossimamente
              </button>
            </div>

          </div>

          {/* Bottom row: Enterprise centrata */}
          <div className="pricing-grid-bottom">
            <div className="pricing-card card-enterprise">
              <div className="enterprise-inner">
                <div className="enterprise-text">
                  <span className="enterprise-eyebrow">Per grandi realtà</span>
                  <h3>Enterprise</h3>
                  <p>
                    Pricing su misura, infrastruttura dedicata e onboarding
                    personalizzato per organizzazioni di grandi dimensioni.
                  </p>
                  <ul className="pricing-features features-row">
                    <li><Check size={16} /><span>Infrastruttura dedicata</span></li>
                    <li><Check size={16} /><span>SLA personalizzato</span></li>
                    <li><Check size={16} /><span>Opzione on-premise</span></li>
                    <li><Check size={16} /><span>Account manager dedicato</span></li>
                  </ul>
                </div>
                <div className="enterprise-action">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={() => {
                      window.location.href = 'mailto:info@safeflow.it?subject=Piano Enterprise'
                    }}
                  >
                    Contattaci
                  </button>
                  <p className="enterprise-note">Risposta entro 24 ore lavorative</p>
                </div>
              </div>
            </div>
          </div>

          {/* Garanzia */}
          <div className="pricing-guarantee">
            <p>
              Tutti i piani includono: supporto via email, aggiornamenti gratuiti e{' '}
              <strong>30 giorni di garanzia soddisfatti o rimborsati.</strong>
            </p>
            <p>
              Hai bisogno di aiuto nella scelta?{' '}
              <Link to="/register">Richiedi una demo gratuita</Link>
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
