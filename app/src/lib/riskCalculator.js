// src/lib/riskCalculator.js
// ============================================
// RISK SCORE CALCULATION LOGIC (client-side helpers)
// ============================================

/**
 * Calculate document status based on expiry date.
 * Rules:
 * - EXPIRED if expiresAt < today
 * - RISK if expiresAt <= today + 30 days
 * - OK otherwise
 *
 * @param {string|Date|null|undefined} expiresAt - ISO date string or Date
 * @returns {'OK'|'RISK'|'EXPIRED'}
 */
/**export function calculateDocumentStatus(expiresAt) {
  if (!expiresAt) return 'EXPIRED'

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiryDate = new Date(expiresAt)
  expiryDate.setHours(0, 0, 0, 0)

  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

  if (daysUntilExpiry < 0) return 'EXPIRED'
  if (daysUntilExpiry <= 30) return 'RISK'
  return 'OK'
}

/**
 * Calculate risk score for a corporate client.
 * Rules:
 * - +5 for each EXPIRED document
 * - +2 for each RISK document
 * - +3 for each required document without upload (MISSING)
 *
 * @param {Array} requirements
 * @param {Array} uploads
 * @returns {{score:number, level:'LOW'|'MEDIUM'|'HIGH', expired:number, risk:number, missing:number}}
 */
/**export function calculateRiskScore(requirements, uploads) {
  let score = 0
  let expiredCount = 0
  let riskCount = 0
  let missingCount = 0

  ;(requirements || []).forEach((req) => {
    if (!req?.required) return

    const relevantUploads = (uploads || []).filter(
      (u) => u.document_type_id === req.document_type_id
    )

    if (relevantUploads.length === 0) {
      score += 3
      missingCount += 1
      return
    }

    // Choose the "best" upload as the one with the farthest expires_at
    const bestUpload = relevantUploads
      .slice()
      .sort((a, b) => new Date(b.expires_at) - new Date(a.expires_at))[0]

    const status = calculateDocumentStatus(bestUpload.expires_at)

    if (status === 'EXPIRED') {
      score += 5
      expiredCount += 1
    } else if (status === 'RISK') {
      score += 2
      riskCount += 1
    }
  })

  let level = 'LOW'
  if (score >= 9) level = 'HIGH'
  else if (score >= 4) level = 'MEDIUM'

  return {
    score,
    level,
    expired: expiredCount,
    risk: riskCount,
    missing: missingCount,
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'OK':
      return 'var(--color-success)'
    case 'RISK':
      return 'var(--color-warning)'
    case 'EXPIRED':
      return 'var(--color-danger)'
    case 'MISSING':
      return 'var(--color-text-muted)'
    default:
      return 'var(--color-text-muted)'
  }
}

export function getRiskLevelColor(level) {
  switch (level) {
    case 'LOW':
      return 'var(--color-success)'
    case 'MEDIUM':
      return 'var(--color-warning)'
    case 'HIGH':
      return 'var(--color-danger)'
    default:
      return 'var(--color-text-muted)'
  }
}
