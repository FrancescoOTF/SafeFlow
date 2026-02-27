import { useState } from "react";
import "./PricingPage.css";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tag: "Coming soon",
    price: null,
    description: "Perfect for small teams getting started.",
    features: ["Up to 5 users", "Basic analytics", "Email support"],
    comingSoon: true,
    highlighted: false,
  },
  {
    id: "business",
    name: "Business",
    tag: "Most Popular",
    monthlyPrice: 109.9,
    yearlyPrice: (109.9 * 12 * 0.85).toFixed(2),
    description: "The complete SafeFlow suite for growing companies.",
    features: [
      "Unlimited users",
      "Advanced analytics & reporting",
      "Priority support",
      "Custom integrations",
      "Role-based access control",
      "Audit logs",
    ],
    comingSoon: false,
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    tag: "Coming soon",
    price: null,
    description: "Expanded capabilities for scaling operations.",
    features: ["Everything in Business", "API access", "SLA guarantee"],
    comingSoon: true,
    highlighted: false,
  },
];

const enterprise = {
  id: "enterprise",
  name: "Enterprise",
  description:
    "Custom pricing, dedicated infrastructure, and white-glove onboarding for large organisations.",
  features: [
    "Dedicated infrastructure",
    "Custom SLAs",
    "On-premise option",
    "Dedicated account manager",
  ],
};

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="pricing-root">
      {/* Background decorations */}
      <div className="pricing-bg-blob blob-1" />
      <div className="pricing-bg-blob blob-2" />

      <div className="pricing-container">
        {/* Hero */}
        <header className="pricing-hero">
          <span className="pricing-eyebrow">Pricing</span>
          <h1 className="pricing-title">
            Simple pricing,<br />
            <span className="pricing-title-accent">serious results.</span>
          </h1>
          <p className="pricing-subtitle">
            One powerful plan, zero hidden costs. Scale your safety operations
            without scaling your budget.
          </p>

          {/* Toggle */}
          <div className="pricing-toggle-wrap">
            <span className={`toggle-label ${!yearly ? "active" : ""}`}>
              Monthly billing
            </span>
            <button
              className={`pricing-toggle ${yearly ? "yearly" : "monthly"}`}
              onClick={() => setYearly(!yearly)}
              aria-label="Switch billing period"
            >
              <span className="toggle-knob" />
            </button>
            <span className={`toggle-label ${yearly ? "active" : ""}`}>
              Yearly billing
              <span className="toggle-badge">Save 15%</span>
            </span>
          </div>
        </header>

        {/* Top row: 3 cards */}
        <div className="pricing-grid-top">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.highlighted ? "card-highlighted" : ""} ${plan.comingSoon ? "card-soon" : ""}`}
            >
              {plan.tag && (
                <span
                  className={`card-tag ${plan.highlighted ? "tag-accent" : "tag-soon"}`}
                >
                  {plan.tag}
                </span>
              )}

              <h2 className="card-name">{plan.name}</h2>
              <p className="card-desc">{plan.description}</p>

              <div className="card-price-area">
                {plan.comingSoon ? (
                  <span className="card-coming-soon-price">—</span>
                ) : yearly ? (
                  <div className="card-price">
                    <span className="price-currency">€</span>
                    <span className="price-amount">{plan.yearlyPrice}</span>
                    <span className="price-period">/year</span>
                  </div>
                ) : (
                  <div className="card-price">
                    <span className="price-currency">€</span>
                    <span className="price-amount">
                      {plan.monthlyPrice?.toFixed(2)}
                    </span>
                    <span className="price-period">/month</span>
                  </div>
                )}
              </div>

              <ul className="card-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`card-btn ${plan.highlighted ? "btn-accent" : "btn-ghost"}`}
                disabled={plan.comingSoon || (plan.highlighted && yearly)}
                onClick={() => {}} // TODO integrate Stripe checkout
              >
                {plan.comingSoon
                  ? "Coming Soon"
                  : plan.highlighted && yearly
                    ? "Coming Soon"
                    : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom row: Enterprise */}
        <div className="pricing-grid-bottom">
          <div className="pricing-card card-enterprise">
            <span className="card-tag tag-enterprise">Enterprise</span>
            <h2 className="card-name">{enterprise.name}</h2>
            <p className="card-desc">{enterprise.description}</p>

            <ul className="card-features features-horizontal">
              {enterprise.features.map((f) => (
                <li key={f}>
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className="card-btn btn-outline"
              onClick={() => {}} // TODO integrate Stripe checkout
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
