/**
 * Types spécifiques aux KPI du dashboard
 * (TypeDD : types somme, cardinalité, pas de primitive obsession)
 */

import type { KpiId, Period, TimeSeriesDataPoint } from './index'

/**
 * Données d'un KPI pour affichage
 */
export interface KpiData {
  kpiId: KpiId
  period: Period
  value?: number
  timeSeries?: TimeSeriesDataPoint[]
  metadata?: Record<string, unknown>
}

/**
 * Configuration d'un graphique KPI
 */
export interface KpiChartConfig {
  title: string
  xAxisLabel?: string
  yAxisLabel?: string
  color?: string
  showLegend?: boolean
  showGrid?: boolean
}

/* --------------------------------------------------------------------------
 * AsyncResult : modélisation "chargement / succès / erreur" (TypeDD)
 * Évite plusieurs useState non coordonnés et les chaînes magiques.
 * -------------------------------------------------------------------------- */

/**
 * Erreur typée pour le chargement des données KPI (évite string seule)
 */
export interface KpiLoadError {
  message: string
  code?: 'NETWORK' | 'UNKNOWN'
}

/**
 * Résultat asynchrone : union discriminée sur `status`.
 * - idle : pas encore de requête
 * - loading : requête en cours
 * - loaded : succès avec données
 * - error : échec avec erreur typée
 */
export type AsyncResult<T, E = KpiLoadError> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; error: E }

/**
 * État des données KPI dans le dashboard (spécialisation d'AsyncResult)
 */
export type KpiDashboardDataState = AsyncResult<KpiData, KpiLoadError>

/**
 * Garde de type : vérifie que l'état est en succès (loaded)
 */
export function isLoaded<T, E>(
  state: AsyncResult<T, E>,
): state is { status: 'loaded'; data: T } {
  return state.status === 'loaded'
}

/**
 * Garde de type : vérifie que l'état est en erreur
 */
export function isError<T, E>(
  state: AsyncResult<T, E>,
): state is { status: 'error'; error: E } {
  return state.status === 'error'
}
