import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { stripePromise, pricingPlans } from '../lib/stripe'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './PricingPage.css'

export default function PricingPage() {
  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      // Custom plan - redirect to contact
      window.location.href = 'mailto:info@safeflow.it?subject=Piano Custom'
      return
    }

    try {
      const stripe = await stripePromise
      
      // Here you would call your backend to create a checkout session
      // For now, this is a placeholder
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const session = await response.json()
      
      await stripe.redirectToCheckout({
        sessionId: session.id,
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Errore nel processo di pagamento. Riprova più tardi.')
    }
  }

  return (
    <div className="pricing-page">
      <Header />
      
      <section className="section pricing-hero">
        <div className="container">
          <h1 className="text-center">Prezzi chiari. Nessun costo nascosto.</h1>
          <p className="pricing-subtitle text-center">
            Scegli il piano più adatto alle dimensioni della tua azienda
          </p>
        </div>
      </section>

      <section className="section pricing-grid-section">
        <div className="container">
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              >
                {plan.featured && <div className="featured-badge">Più popolare</div>}
                
                <div className="pricing-header">
                  <h3>{plan.name}</h3>
                  <div className="pricing-price">
                    {plan.price ? (
                      <>
                        <span className="currency">€</span>
                        <span className="amount">{plan.price}</span>
                        <span className="period">/mese</span>
                      </>
                    ) : (
                      <span className="custom-price">Su misura</span>
                    )}
                  </div>
                </div>

                <ul className="pricing-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-large pricing-cta`}
                  onClick={() => handleSubscribe(plan.priceId)}
                >
                  {plan.price ? 'Inizia ora' : 'Contattaci'}
                </button>
              </div>
            ))}
          </div>

          <div className="pricing-info">
            <p>
              Tutti i piani includono: supporto via email, aggiornamenti gratuiti, 
              30 giorni di garanzia soddisfatti o rimborsati.
            </p>
            <p>
              Hai bisogno di aiuto nella scelta? <Link to="/register">Richiedi una demo gratuita</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
