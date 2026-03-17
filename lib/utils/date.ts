/**
 * Utilitaires pour la manipulation des dates
 */

import type { Period } from '@/domain/kpi'

/**
 * Calcule la date de début d'une période
 */
export function getPeriodStartDate(period: Period): Date {
  const now = new Date()
  const start = new Date(now)

  switch (period) {
    case 'day':
      // Fenêtre glissante : dernières 24h
      start.setDate(now.getDate() - 1)
      return start

    case 'week':
      // Fenêtre glissante : 7 derniers jours
      start.setDate(now.getDate() - 7)
      return start

    case 'month':
      // Fenêtre glissante : ~30 derniers jours
      start.setDate(now.getDate() - 30)
      return start

    case 'quarter':
      // Fenêtre glissante : ~90 derniers jours
      start.setDate(now.getDate() - 90)
      return start

    case 'year':
      // Fenêtre glissante : ~365 derniers jours
      start.setDate(now.getDate() - 365)
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
