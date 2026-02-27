import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './PricingPage.css'

const MONTHLY = 109.90
const YEARLY = +(MONTHLY * 12 * 0.85).toFixed(2)

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="pricing-page">
      <Header />

      <div className="pricing-wrapper">
        {/* Subtitle */}
        <p className="pricing-intro">
          Un piano completo per gestire le scadenze documentali dei tuoi clienti corporate.
          Nessun costo nascosto.
        </p>

        {/* Toggle */}
        <div className="billing-toggle">
          <button
            className={`billing-btn ${!yearly ? 'billing-btn--active' : ''}`}
            onClick={() => setYearly(false)}
          >
            Monthly billing
          </button>
          <button
            className={`billing-btn ${yearly ? 'billing-btn--active' : ''}`}
            onClick={() => setYearly(true)}
          >
            Yearly billing
          </button>
        </div>

        {/* Top row — 3 cards */}
        <div className="plans-top">

          {/* Starter – coming soon */}
          <div className="plan-card">
            <h3 className="plan-name">Starter</h3>
            <p className="plan-desc">Prossimamente disponibile.</p>
            <div className="plan-price">
              <span className="plan-price--soon">Presto</span>
            </div>
            <button className="plan-btn" disabled>
              Subscribe
            </button>
          </div>

          {/* Business – piano reale, evidenziato */}
          <div className="plan-card plan-card--featured">
            <h3 className="plan-name">Business</h3>
            <p className="plan-desc">
              La soluzione completa per studi e aziende che gestiscono clienti corporate.
            </p>
            <div className="plan-price">
              {yearly ? (
                <>
                  <span className="plan-price--amount">€{YEARLY.toFixed(0)}</span>
                  <span className="plan-price--period">/year</span>
                </>
              ) : (
                <>
                  <span className="plan-price--amount">€{MONTHLY.toFixed(2).replace('.', ',')}</span>
                  <span className="plan-price--period">/month</span>
                </>
              )}
            </div>
            <button
              className="plan-btn plan-btn--featured"
              onClick={() => {}} // TODO integrate Stripe checkout
            >
              Subscribe
            </button>
          </div>

          {/* Pro – coming soon */}
          <div className="plan-card">
            <h3 className="plan-name">Pro</h3>
            <p className="plan-desc">Funzionalità avanzate in arrivo.</p>
            <div className="plan-price">
              <span className="plan-price--soon">Presto</span>
            </div>
            <button className="plan-btn" disabled>
              Subscribe
            </button>
          </div>

        </div>

        {/* Bottom row — Enterprise centrata */}
        <div className="plans-bottom">
          <div className="plan-card">
            <h3 className="plan-name">Enterprise</h3>
            <p className="plan-desc">
              Soluzione su misura con infrastruttura dedicata, SLA personalizzato e account manager.
            </p>
            <div className="plan-price">
              <span className="plan-price--custom">Su misura</span>
            </div>
            <button
              className="plan-btn"
              onClick={() => {
                window.location.href = 'mailto:info@safeflow.it?subject=Piano Enterprise'
              }}
            >
              Contattaci
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
