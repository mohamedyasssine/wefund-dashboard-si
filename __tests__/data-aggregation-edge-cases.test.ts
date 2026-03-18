/**
 * Tests unitaires — cas limites d'agrégation des données KPI
 *
 * Vérifie les formules exactes et la cohérence forte entre
 * `computeAggregatedStats()` et `getKpiData()`.
 */

import { describe, it, expect } from 'vitest'
import { computeAggregatedStats, getKpiData } from '@/lib/data/mock'

describe('Data aggregation edge cases', () => {
  it('success-rate applique la formule métier exacte', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('success-rate', 'all')

    const totalFinished = stats.successfulCampaigns + stats.failedCampaigns
    const expected = totalFinished === 0
      ? 0
      : (stats.successfulCampaigns / totalFinished) * 100

    expect(result.value).toBeCloseTo(expected, 10)
  })

  it('avg-contribution-amount applique la formule exacte', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('avg-contribution-amount', 'all')

    const expected = stats.totalContributions === 0
      ? 0
      : stats.totalAmountCollected / stats.totalContributions

    expect(result.value).toBeCloseTo(expected, 10)
  })

  it('avg-contributions-per-campaign applique la formule exacte', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('avg-contributions-per-campaign', 'all')

    const expected = stats.totalCampaigns === 0
      ? 0
      : stats.totalContributions / stats.totalCampaigns

    expect(result.value).toBeCloseTo(expected, 10)
  })

  it('avg-duration applique la moyenne pondérée exacte', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('avg-duration', 'all')

    const totalFinished = stats.successfulCampaigns + stats.failedCampaigns
    const expected = totalFinished === 0
      ? 0
      : (
          stats.averageSuccessDuration * stats.successfulCampaigns +
          stats.averageFailureDuration * stats.failedCampaigns
        ) / totalFinished

    expect(result.value).toBeCloseTo(expected, 10)
  })

  it('total-collected est identique au total agrégé', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('total-collected', 'all')

    expect(result.value).toBe(stats.totalAmountCollected)
  })

  it('total-refunded est identique au total agrégé', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('total-refunded', 'all')

    expect(result.value).toBe(stats.totalAmountRefunded)
  })

  it('la somme des points timeSeries de total-collected égale la valeur agrégée', () => {
    const result = getKpiData('total-collected', 'all')
    const seriesTotal = (result.timeSeries ?? []).reduce(
      (sum, point) => sum + point.value,
      0,
    )

    expect(seriesTotal).toBe(result.value)
  })

  it('la somme des points timeSeries de total-contributions égale la valeur agrégée', () => {
    const result = getKpiData('total-contributions', 'all')
    const seriesTotal = (result.timeSeries ?? []).reduce(
      (sum, point) => sum + point.value,
      0,
    )

    expect(seriesTotal).toBe(result.value)
  })

  it('la somme des points timeSeries de total-refunded égale la valeur agrégée', () => {
    const result = getKpiData('total-refunded', 'all')
    const seriesTotal = (result.timeSeries ?? []).reduce(
      (sum, point) => sum + point.value,
      0,
    )

    expect(seriesTotal).toBe(result.value)
  })

  it('les KPI numériques globaux n exposent pas de timeSeries', () => {
    const numericKpis = [
      'success-rate',
      'avg-contributions-per-campaign',
      'avg-duration',
      'avg-contribution-amount',
    ] as const

    for (const kpiId of numericKpis) {
      const result = getKpiData(kpiId, 'all')
      expect(result.timeSeries).toBeUndefined()
    }
  })

  it('le montant remboursé ne dépasse jamais le montant collecté', () => {
    const collected = getKpiData('total-collected', 'all')
    const refunded = getKpiData('total-refunded', 'all')

    expect(refunded.value).toBeLessThanOrEqual(collected.value!)
  })

  it('active-campaigns sur all reste cohérent avec sa série temporelle', () => {
    const result = getKpiData('active-campaigns', 'all')
    const seriesTotal = (result.timeSeries ?? []).reduce(
      (sum, point) => sum + point.value,
      0,
    )

    expect(seriesTotal).toBe(result.value)
    expect(Number.isInteger(result.value)).toBe(true)
  })
})
