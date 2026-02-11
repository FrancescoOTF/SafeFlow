/**export const getEffectiveRiskLevel = (client) => {
  if (!client) return 'LOW'
  if ((client.expired ?? 0) > 0) return 'HIGH'
  if ((client.risk ?? 0) > 0 || (client.missing ?? 0) > 0) return 'MEDIUM'
  return 'LOW'
}

export const getRiskWeight = (client) => {
  if (!client) return 1
  if ((client.expired ?? 0) > 0) return 3
  if ((client.risk ?? 0) > 0 || (client.missing ?? 0) > 0) return 2
  return 1
}

