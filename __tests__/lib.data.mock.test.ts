/**
 * Tests ciblés — lib/data/mock.ts
 *
 * Chemins fetch*, retours structurés, branche default de getKpiData, fallbacks timeSeries.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import type { KpiId, Period } from '@/domain/kpi'

describe('lib/data/mock', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetchProjects résout vers un tableau de projets', async () => {
    const { fetchProjects } = await import('@/lib/data/mock')
    const p = fetchProjects()
    await vi.runAllTimersAsync()
    const data = await p

    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toMatchObject({
      id: expect.stringMatching(/^proj-/),
      title: expect.any(String),
      projectOwnerId: expect.any(String),
    })
  })

  it('fetchCampaigns résout vers des campagnes liées à un projectId', async () => {
    const { fetchCampaigns } = await import('@/lib/data/mock')
    const p = fetchCampaigns()
    await vi.runAllTimersAsync()
    const data = await p

    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toMatchObject({
      id: expect.stringMatching(/^camp-/),
      projectId: expect.stringMatching(/^proj-/),
      status: expect.any(String),
    })
  })

  it('fetchContributions résout vers des contributions avec montant et date', async () => {
    const { fetchContributions } = await import('@/lib/data/mock')
    const p = fetchContributions()
    await vi.runAllTimersAsync()
    const data = await p

    expect(data.length).toBeGreaterThanOrEqual(0)
    if (data.length > 0) {
      expect(data[0]).toMatchObject({
        campaignId: expect.any(String),
        amount: expect.any(Number),
        refunded: expect.any(Boolean),
      })
    }
  })

  it('fetchKpiMetadata renvoie la liste KPI_METADATA', async () => {
    const { fetchKpiMetadata, KPI_METADATA } = await import('@/lib/data/mock')
    const p = fetchKpiMetadata()
    await vi.runAllTimersAsync()
    const data = await p

    expect(data).toEqual(KPI_METADATA)
    expect(data.every((m) => m.id && m.title)).toBe(true)
  })

  it('fetchAggregatedStats renvoie des agrégats numériques cohérents', async () => {
    const { fetchAggregatedStats } = await import('@/lib/data/mock')
    const p = fetchAggregatedStats()
    await vi.runAllTimersAsync()
    const stats = await p

    const keys: (keyof typeof stats)[] = [
      'totalCampaigns',
      'activeCampaigns',
      'successfulCampaigns',
      'failedCampaigns',
      'totalContributions',
      'totalAmountCollected',
      'totalAmountRefunded',
      'averageContributionAmount',
      'averageContributionsPerCampaign',
      'averageSuccessDuration',
      'averageFailureDuration',
      'averageGoalAchievementRate',
    ]

    for (const k of keys) {
      expect(Number.isFinite(stats[k])).toBe(true)
    }
    expect(stats.totalCampaigns).toBeGreaterThanOrEqual(0)
  })

  it('computeAggregatedStats produit les mêmes champs que fetchAggregatedStats (sans latence)', async () => {
    const { computeAggregatedStats, fetchAggregatedStats } = await import(
      '@/lib/data/mock'
    )
    const direct = computeAggregatedStats()
    const p = fetchAggregatedStats()
    await vi.runAllTimersAsync()
    const fetched = await p

    expect(fetched).toEqual(direct)
  })

  it('getKpiData couvre chaque KpiId connu pour une période', async () => {
    const { getKpiData } = await import('@/lib/data/mock')
    const ids: KpiId[] = [
      'active-campaigns',
      'total-collected',
      'success-rate',
      'total-contributions',
      'avg-contributions-per-campaign',
      'avg-duration',
      'avg-contribution-amount',
      'avg-goal-achievement',
      'total-refunded',
    ]
    const period: Period = 'all'

    for (const kpiId of ids) {
      const row = getKpiData(kpiId, period)
      expect(row.kpiId).toBe(kpiId)
      expect(row.period).toBe(period)
      if (row.timeSeries !== undefined) {
        expect(Array.isArray(row.timeSeries)).toBe(true)
        for (const pt of row.timeSeries) {
          expect(pt).toMatchObject({ date: expect.any(String), value: expect.any(Number) })
        }
      }
    }
  })

  it('getKpiData — branche default : pas de valeur, timeSeries absent si vide', async () => {
    const { getKpiData } = await import('@/lib/data/mock')
    const row = getKpiData('not-a-kpi' as KpiId, 'month')

    expect(row.value).toBeUndefined()
    expect(row.timeSeries).toBeUndefined()
  })

  it('fetchKpiData délègue à getKpiData après latence simulée', async () => {
    const { fetchKpiData, getKpiData } = await import('@/lib/data/mock')
    const period: Period = 'week'
    const expected = getKpiData('success-rate', period)

    const p = fetchKpiData('success-rate', period)
    await vi.runAllTimersAsync()
    const got = await p

    expect(got).toEqual(expected)
  })
})
