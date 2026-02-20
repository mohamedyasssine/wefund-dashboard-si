/**
 * Types de base pour le dashboard WeFund
 */

/**
 * Statut d'une campagne de financement
 */
export type CampaignStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'successful'
  | 'failed'
  | 'rejected'

/**
 * Représentation d'un projet
 */
export interface Project {
  id: string
  title: string
  description: string
  photo: string
  projectOwnerId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Représentation d'une campagne de financement
 */
export interface Campaign {
  id: string
  projectId: string
  title: string
  description: string
  financialGoal: number
  endDate: Date
  status: CampaignStatus
  projectOwnerId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Représentation d'une contribution
 */
export interface Contribution {
  id: string
  userId: string
  campaignId: string
  amount: number
  date: Date
  refunded: boolean
  refundDate?: Date
}

/**
 * Représentation d'un utilisateur
 */
export interface User {
  id: string
  email: string
  name: string
  role: 'project_owner' | 'contributor' | 'admin' | 'visitor'
}

/**
 * Période pour les filtres de données
 */
export type Period = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all'

/**
 * Données pour un point de graphique temporel
 */
export interface TimeSeriesDataPoint {
  date: string
  value: number
  label?: string
}

/**
 * Données agrégées pour les statistiques
 */
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

/**
 * Identifiant d'un KPI
 */
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

/**
 * Métadonnées d'un KPI
 */
export interface KpiMetadata {
  id: KpiId
  title: string
  description: string
  unit?: string
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'area'
  periodRequired: boolean
}
