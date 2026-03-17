import type { Campaign, CampaignStatus, Contribution, Project } from '@/domain/entities'
import type {
  AggregatedStats,
  KpiId,
  KpiMetadata,
  Period,
  TimeSeriesDataPoint,
  KpiData,
} from '@/domain/kpi'
import { formatDateForChart, getPeriodStartDate } from '@/lib/utils/date'

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const simulateLatency = (minMs = 80, maxMs = 220) =>
  new Promise<void>((resolve) => {
    const delay = random(minMs, maxMs)
    setTimeout(() => resolve(), delay)
  })

const projects: Project[] = Array.from({ length: 10 }).map((_, index) => {
  const createdAt = new Date()
  createdAt.setMonth(createdAt.getMonth() - random(1, 12))

  return {
    id: `proj-${index + 1}`,
    title: `Projet ${index + 1}`,
    description: `Description du projet ${index + 1}`,
    photo: `/placeholder-project-${index + 1}.jpg`,
    projectOwnerId: `owner-${((index % 3) + 1).toString()}`,
    createdAt,
    updatedAt: new Date(),
  }
})

const campaignStatuses: CampaignStatus[] = [
  'draft',
  'pending',
  'active',
  'successful',
  'failed',
  'rejected',
]

const campaigns: Campaign[] = projects.flatMap((project, index) => {
  const numberOfCampaigns = random(1, 3)

  return Array.from({ length: numberOfCampaigns }).map((_, cIndex) => {
    const createdAt = new Date(project.createdAt)
    createdAt.setMonth(createdAt.getMonth() + cIndex)

    const endDate = new Date(createdAt)
    endDate.setDate(endDate.getDate() + random(15, 60))

    const status =
      cIndex === numberOfCampaigns - 1 && Math.random() > 0.5
        ? 'active'
        : campaignStatuses[random(2, campaignStatuses.length - 1)]

    const financialGoal = random(5_000, 50_000)

    return {
      id: `camp-${index + 1}-${cIndex + 1}`,
      projectId: project.id,
      title: `Campagne ${index + 1}-${cIndex + 1}`,
      description: `Campagne de financement pour ${project.title}`,
      financialGoal,
      endDate,
      status,
      projectOwnerId: project.projectOwnerId,
      createdAt,
      updatedAt: endDate,
    }
  })
})

const contributions: Contribution[] = []

campaigns.forEach((campaign) => {
  const contributionCount =
    campaign.status === 'active'
      ? random(10, 60)
      : campaign.status === 'successful'
        ? random(40, 120)
        : random(0, 40)

  for (let i = 0; i < contributionCount; i++) {
    const contributionDate = new Date(campaign.createdAt)
    const daysOffset = random(
      0,
      Math.max(
        1,
        Math.round(
          (campaign.endDate.getTime() - campaign.createdAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      ),
    )
    contributionDate.setDate(contributionDate.getDate() + daysOffset)

    const amount = random(10, 500)

    const refunded =
      campaign.status === 'failed' ||
      (campaign.status === 'active' && Math.random() < 0.05)

    const refundDate =
      refunded && campaign.status !== 'active'
        ? new Date(campaign.endDate)
        : refunded
          ? contributionDate
          : undefined

    contributions.push({
      id: `contrib-${campaign.id}-${i + 1}`,
      userId: `user-${random(1, 50)}`,
      campaignId: campaign.id,
      amount,
      date: contributionDate,
      refunded,
      refundDate,
    })
  }
})

export const KPI_METADATA: KpiMetadata[] = [
  {
    id: 'active-campaigns',
    title: 'Campagnes actives',
    description: 'Nombre de campagnes actives sur une période donnée',
    unit: 'campagnes',
    chartType: 'line',
    periodRequired: true,
  },
  {
    id: 'total-collected',
    title: 'Montant collecté',
    description: 'Montant total collecté sur une période donnée',
    unit: '€',
    chartType: 'area',
    periodRequired: true,
  },
  {
    id: 'success-rate',
    title: 'Taux de succès global',
    description: 'Pourcentage de campagnes ayant atteint leur objectif',
    unit: '%',
    chartType: 'number',
    periodRequired: false,
  },
  {
    id: 'total-contributions',
    title: 'Contributions totales',
    description: 'Nombre de contributions sur une période donnée',
    unit: 'contributions',
    chartType: 'bar',
    periodRequired: true,
  },
  {
    id: 'avg-contributions-per-campaign',
    title: 'Moyenne de contributions / campagne',
    description: 'Nombre moyen de contributions par campagne',
    unit: 'contributions',
    chartType: 'number',
    periodRequired: false,
  },
  {
    id: 'avg-duration',
    title: 'Durée moyenne avant succès/échec',
    description: 'Durée moyenne avant la clôture des campagnes',
    unit: 'jours',
    chartType: 'number',
    periodRequired: false,
  },
  {
    id: 'avg-contribution-amount',
    title: 'Montant moyen par contribution',
    description: 'Montant moyen d’une contribution',
    unit: '€',
    chartType: 'number',
    periodRequired: false,
  },
  {
    id: 'avg-goal-achievement',
    title: 'Taux moyen d’atteinte des objectifs',
    description:
      "Pourcentage moyen d'atteinte des objectifs financiers des campagnes",
    unit: '%',
    chartType: 'bar',
    periodRequired: false,
  },
  {
    id: 'total-refunded',
    title: 'Volume remboursé',
    description: 'Montant total remboursé sur une période donnée',
    unit: '€',
    chartType: 'line',
    periodRequired: true,
  },
]

export function computeAggregatedStats(): AggregatedStats {
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length
  const successfulCampaigns = campaigns.filter(
    (c) => c.status === 'successful',
  ).length
  const failedCampaigns = campaigns.filter((c) => c.status === 'failed').length

  const totalContributions = contributions.length
  const totalAmountCollected = contributions.reduce(
    (sum, c) => sum + c.amount,
    0,
  )
  const refundedContributions = contributions.filter((c) => c.refunded)
  const totalAmountRefunded = refundedContributions.reduce(
    (sum, c) => sum + c.amount,
    0,
  )

  const averageContributionAmount =
    totalContributions === 0 ? 0 : totalAmountCollected / totalContributions

  const contributionsPerCampaign = campaigns.map(
    (campaign) =>
      contributions.filter((c) => c.campaignId === campaign.id).length,
  )
  const averageContributionsPerCampaign =
    contributionsPerCampaign.length === 0
      ? 0
      : contributionsPerCampaign.reduce((a, b) => a + b, 0) /
        contributionsPerCampaign.length

  const successfulDurations: number[] = []
  const failureDurations: number[] = []

  campaigns
    .filter((c) => c.status === 'successful' || c.status === 'failed')
    .forEach((campaign) => {
      const days =
        (campaign.endDate.getTime() - campaign.createdAt.getTime()) /
        (1000 * 60 * 60 * 24)

      if (campaign.status === 'successful') {
        successfulDurations.push(days)
      } else if (campaign.status === 'failed') {
        failureDurations.push(days)
      }
    })

  const averageSuccessDuration =
    successfulDurations.length === 0
      ? 0
      : successfulDurations.reduce((a, b) => a + b, 0) /
        successfulDurations.length

  const averageFailureDuration =
    failureDurations.length === 0
      ? 0
      : failureDurations.reduce((a, b) => a + b, 0) /
        failureDurations.length

  let totalCollectedForGoal = 0
  let totalGoals = 0

  campaigns.forEach((campaign) => {
    const campaignContributions = contributions.filter(
      (c) => c.campaignId === campaign.id && !c.refunded,
    )
    const collected =
      campaignContributions.reduce((sum, c) => sum + c.amount, 0)
    totalCollectedForGoal += collected
    totalGoals += campaign.financialGoal
  })

  const averageGoalAchievementRate =
    totalGoals === 0 ? 0 : (totalCollectedForGoal / totalGoals) * 100

  return {
    totalCampaigns,
    activeCampaigns,
    successfulCampaigns,
    failedCampaigns,
    totalContributions,
    totalAmountCollected,
    totalAmountRefunded,
    averageContributionAmount,
    averageContributionsPerCampaign,
    averageSuccessDuration,
    averageFailureDuration,
    averageGoalAchievementRate,
  }
}

export function getKpiData(kpiId: KpiId, period: Period): KpiData {
  const periodStart = getPeriodStartDate(period)

  const filterByPeriod = <T extends { date?: Date; endDate?: Date }>(
    items: T[],
    accessor: (item: T) => Date,
  ): T[] => items.filter((item) => accessor(item) >= periodStart)

  const timeBuckets: Record<string, number> = {}

  const addToBucket = (date: Date, value: number) => {
    const key = formatDateForChart(date)
    timeBuckets[key] = (timeBuckets[key] ?? 0) + value
  }

  let value: number | undefined

  switch (kpiId) {
    case 'active-campaigns': {
      const filteredCampaigns = campaigns.filter((c) => c.status === 'active')
      const perDay = filterByPeriod(filteredCampaigns, (c) => c.createdAt)
      perDay.forEach((campaign) => addToBucket(campaign.createdAt, 1))
      value = perDay.length
      break
    }

    case 'total-collected': {
      const filteredContributions = filterByPeriod(
        contributions,
        (c) => c.date,
      )
      filteredContributions.forEach((c) => addToBucket(c.date, c.amount))
      value = filteredContributions.reduce((sum, c) => sum + c.amount, 0)
      break
    }

    case 'success-rate': {
      const stats = computeAggregatedStats()
      const totalFinished =
        stats.successfulCampaigns + stats.failedCampaigns || 1
      value = (stats.successfulCampaigns / totalFinished) * 100
      break
    }

    case 'total-contributions': {
      const filteredContributions = filterByPeriod(
        contributions,
        (c) => c.date,
      )
      filteredContributions.forEach((c) => addToBucket(c.date, 1))
      value = filteredContributions.length
      break
    }

    case 'avg-contributions-per-campaign': {
      const stats = computeAggregatedStats()
      value = stats.averageContributionsPerCampaign
      break
    }

    case 'avg-duration': {
      const stats = computeAggregatedStats()
      const count = 2
      value =
        (stats.averageSuccessDuration + stats.averageFailureDuration) / count
      break
    }

    case 'avg-contribution-amount': {
      const stats = computeAggregatedStats()
      value = stats.averageContributionAmount
      break
    }

    case 'avg-goal-achievement': {
      const stats = computeAggregatedStats()
      value = stats.averageGoalAchievementRate
      break
    }

    case 'total-refunded': {
      const refunded = filterByPeriod(
        contributions.filter((c) => c.refunded && c.refundDate),
        (c) => c.refundDate ?? c.date,
      )
      refunded.forEach((c) =>
        addToBucket(c.refundDate ?? c.date, c.amount),
      )
      value = refunded.reduce((sum, c) => sum + c.amount, 0)
      break
    }

    default:
      break
  }

  const timeSeries: TimeSeriesDataPoint[] = Object.entries(timeBuckets)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, total]) => ({
      date,
      value: total,
    }))

  return {
    kpiId,
    period,
    value,
    timeSeries: timeSeries.length > 0 ? timeSeries : undefined,
  }
}

export async function fetchProjects(): Promise<Project[]> {
  await simulateLatency()
  return projects
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  await simulateLatency()
  return campaigns
}

export async function fetchContributions(): Promise<Contribution[]> {
  await simulateLatency()
  return contributions
}

export async function fetchKpiMetadata(): Promise<KpiMetadata[]> {
  await simulateLatency()
  return KPI_METADATA
}

export async function fetchAggregatedStats(): Promise<AggregatedStats> {
  await simulateLatency()
  return computeAggregatedStats()
}

export async function fetchKpiData(
  kpiId: KpiId,
  period: Period,
): Promise<KpiData> {
  await simulateLatency()
  return getKpiData(kpiId, period)
}

