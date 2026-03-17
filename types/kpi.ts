import type { KpiData } from '@/domain/kpi'

export interface KpiChartConfig {
  title: string
  xAxisLabel?: string
  yAxisLabel?: string
  color?: string
  showLegend?: boolean
  showGrid?: boolean
}

export type KpiErrorCode = 'NETWORK' | 'TIMEOUT' | 'NOT_FOUND' | 'UNKNOWN'

export interface KpiLoadError {
  message: string
  code: KpiErrorCode
}

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

export type AsyncResult<T, E = KpiLoadError> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; error: E }

export type KpiDashboardDataState = AsyncResult<KpiData, KpiLoadError>

export function isLoaded<T, E>(
  state: AsyncResult<T, E>,
): state is { status: 'loaded'; data: T } {
  return state.status === 'loaded'
}

export function isError<T, E>(
  state: AsyncResult<T, E>,
): state is { status: 'error'; error: E } {
  return state.status === 'error'
}
