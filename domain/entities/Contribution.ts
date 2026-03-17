export interface Contribution {
  id: string
  userId: string
  campaignId: string
  amount: number
  date: Date
  refunded: boolean
  refundDate?: Date
}
