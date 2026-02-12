// src/lib/riskUtils.js

export function getEffectiveRiskLevel(client) {
  const expired =
    client?.expired_count ?? client?.expired ?? 0
  const risk =
    client?.risk_count ?? client?.risk ?? 0
  const missing =
    client?.missing_count ?? client?.missing ?? 0

  if (expired > 0) return 'HIGH'
  if (risk > 0 || missing > 0) return 'MEDIUM'
  return 'LOW'
}

export function getRiskLevelColor(level) {
  if (level === 'HIGH') return '#ef4444'
  if (level === 'MEDIUM') return '#f59e0b'
  return '#6b7280'
}