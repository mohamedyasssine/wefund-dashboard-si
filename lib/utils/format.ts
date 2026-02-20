/**
 * Utilitaires pour le formatage des données
 */

/**
 * Formate un montant en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formate un nombre avec séparateurs
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}

/**
 * Formate une durée en jours
 */
export function formatDuration(days: number): string {
  if (days < 7) {
    return `${days} jour${days > 1 ? 's' : ''}`
  }
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} semaine${weeks > 1 ? 's' : ''}`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `${months} mois`
  }
  const years = Math.floor(days / 365)
  return `${years} an${years > 1 ? 's' : ''}`
}
