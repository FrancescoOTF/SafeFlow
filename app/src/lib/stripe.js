import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

export const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 19.90,
    priceId: import.meta.env.VITE_STRIPE_PRICE_BASIC,
    features: [
      'Fino a 5 clienti corporate',
      'Controllo scadenze illimitato',
      'Alert via email',
      'Dashboard base'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 45.90,
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    featured: true,
    features: [
      'Fino a 20 clienti corporate',
      'Controllo scadenze illimitato',
      'Alert via email multipli',
      'Dashboard completa',
      'Calendario scadenze',
      'Storico completo'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199.90,
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE,
    features: [
      'Clienti corporate illimitati',
      'Tutto di Pro',
      'API access',
      'Supporto prioritario',
      'Onboarding dedicato'
    ]
  },
  {
    id: 'custom',
    name: 'Custom',
    price: null,
    features: [
      'Soluzione personalizzata',
      'Integrazione su misura',
      'SLA dedicato',
      'Account manager'
    ]
  }
]
