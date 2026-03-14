/**
 * Constantes typées pour le dashboard (évite les chaînes magiques)
 */

import type { KpiId, Period } from '@/types'

/** Périodes proposées dans le sélecteur (type Period[], pas de string arbitraire) */
export const AVAILABLE_PERIODS: readonly Period[] = [
  'week',
  'month',
  'quarter',
  'year',
  'all',
] as const

export type AvailablePeriod = (typeof AVAILABLE_PERIODS)[number]

/** KPI sélectionné par défaut au chargement */
export const DEFAULT_KPI_ID: KpiId = 'active-campaigns'

/** Période sélectionnée par défaut */
export const DEFAULT_PERIOD: Period = 'month'
