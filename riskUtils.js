export const getEffectiveRiskLevel = (client) => {
  if (client.expired > 0) return 'HIGH'
  if (client.risk > 0 || client.missing > 0) return 'MEDIUM'
  return 'LOW'
}

export const getRiskWeight = (client) => {
  if (client.expired > 0) return 3
  if (client.risk > 0 || client.missing > 0) return 2
  return 1
}
