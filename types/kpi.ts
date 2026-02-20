/**
 * Types spécifiques aux KPI du dashboard
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
