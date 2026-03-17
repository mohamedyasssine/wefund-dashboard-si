export type Period = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'

export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

export interface AggregatedStats {
  totalCampaigns: number
  activeCampaigns: number
  successfulCampaigns: number
  failedCampaigns: number
  totalContributions: number
  totalAmountCollected: number
  totalAmountRefunded: number
  averageContributionAmount: number
  averageContributionsPerCampaign: number
  averageSuccessDuration: number
  averageFailureDuration: number
  averageGoalAchievementRate: number
}

export type KpiId =
  | 'active-campaigns'
  | 'total-collected'
  | 'success-rate'
  | 'total-contributions'
  | 'avg-contributions-per-campaign'
  | 'avg-duration'
  | 'avg-contribution-amount'
  | 'avg-goal-achievement'
  | 'total-refunded'

export interface KpiMetadata {
  id: KpiId
  title: string
  description: string
  unit?: string
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'area'
  periodRequired: boolean
}

export interface KpiData {
  kpiId: KpiId
  period: Period
  value?: number
  timeSeries?: TimeSeriesDataPoint[]
  metadata?: Record<string, unknown>
}
