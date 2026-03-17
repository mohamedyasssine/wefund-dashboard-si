export type CampaignStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'successful'
  | 'failed'
  | 'rejected'

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
