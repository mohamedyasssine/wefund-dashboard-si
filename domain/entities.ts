export type CampaignStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'successful'
  | 'failed'
  | 'rejected'

export interface Project {
  id: string
  title: string
  description: string
  photo: string
  projectOwnerId: string
  createdAt: Date
  updatedAt: Date
}

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

export interface Contribution {
  id: string
  userId: string
  campaignId: string
  amount: number
  date: Date
  refunded: boolean
  refundDate?: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: 'project_owner' | 'contributor' | 'admin' | 'visitor'
}
