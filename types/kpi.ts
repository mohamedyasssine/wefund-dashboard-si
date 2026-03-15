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
 * Codes d'erreur explicites pour le chargement des données KPI.
 * Chaque code correspond à une cause identifiable (pas de string arbitraire).
 */
export type KpiErrorCode = 'NETWORK' | 'TIMEOUT' | 'NOT_FOUND' | 'UNKNOWN'

/**
 * Erreur typée pour le chargement des données KPI (évite string seule).
 * Modélise l'erreur comme une donnée à part entière (TypeDD).
 */
export interface KpiLoadError {
  message: string
  code: KpiErrorCode
}

/**
 * Convertit une erreur inconnue (catch) en KpiLoadError typée.
 * Évite les catch silencieux et produit toujours un message exploitable.
 */
export function toKpiLoadError(error: unknown): KpiLoadError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return { message: 'Erreur réseau : impossible de contacter le serveur.', code: 'NETWORK' }
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return { message: 'La requête a expiré. Veuillez réessayer.', code: 'TIMEOUT' }
  }

  if (error instanceof Error) {
    return { message: error.message, code: 'UNKNOWN' }
  }

  return { message: 'Une erreur inattendue est survenue.', code: 'UNKNOWN' }
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
