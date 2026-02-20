/**
 * Utilitaires pour la manipulation des dates
 */

import type { Period } from '@/types'

/**
 * Calcule la date de début d'une période
 */
export function getPeriodStartDate(period: Period): Date {
  const now = new Date()
  const start = new Date(now)

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0)
      return start

    case 'week':
      const dayOfWeek = now.getDay()
      start.setDate(now.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)
      return start

    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      return start

    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3)
      start.setMonth(quarter * 3, 1)
      start.setHours(0, 0, 0, 0)
      return start

    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      return start

    case 'all':
      // Retourne une date très ancienne
      return new Date(0)

    default:
      return start
  }
}

/**
 * Formate une date pour l'affichage
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formate une date pour l'axe d'un graphique
 */
export function formatDateForChart(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric',
  })
}
