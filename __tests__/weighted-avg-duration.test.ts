/**
 * Tests unitaires — formule de durée moyenne pondérée
 *
 * Valide que la durée moyenne avant succès/échec utilise
 * une moyenne pondérée tenant compte du nombre réel de campagnes
 * dans chaque groupe (réussies vs échouées).
 *
 * Évite les biais causés par des groupes déséquilibrés.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getKpiData, computeAggregatedStats } from '@/lib/data/mock'

describe('avg-duration — moyenne pondérée', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('retourne une valeur numérique positive pour avg-duration', () => {
    const result = getKpiData('avg-duration', 'all')

    expect(result.value).toBeDefined()
    expect(typeof result.value).toBe('number')
    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it('retourne 0 si aucune campagne réussie ou échouée', () => {
    const stats = computeAggregatedStats()
    const totalFinished = stats.successfulCampaigns + stats.failedCampaigns

    if (totalFinished === 0) {
      const result = getKpiData('avg-duration', 'all')
      expect(result.value).toBe(0)
    }
  })

  it('la durée moyenne est comprise entre les durées min et max observées', () => {
    const stats = computeAggregatedStats()

    if (
      stats.successfulCampaigns > 0 ||
      stats.failedCampaigns > 0
    ) {
      const result = getKpiData('avg-duration', 'all')
      const minDuration = Math.min(
        stats.averageSuccessDuration,
        stats.averageFailureDuration,
      )
      const maxDuration = Math.max(
        stats.averageSuccessDuration,
        stats.averageFailureDuration,
      )

      // La moyenne pondérée doit être entre min et max
      expect(result.value).toBeGreaterThanOrEqual(minDuration)
      expect(result.value).toBeLessThanOrEqual(maxDuration)
    }
  })

  it('une moyenne pondérée ne donne pas un poids égal aux deux groupes', () => {
    const stats = computeAggregatedStats()
    const result = getKpiData('avg-duration', 'all')

    if (
      stats.successfulCampaigns > 0 &&
      stats.failedCampaigns > 0 &&
      result.value !== undefined
    ) {
      // Calcul de la moyenne naïve (poids 50/50)
      const naiveMean =
        (stats.averageSuccessDuration + stats.averageFailureDuration) / 2

      // Calcul de la moyenne pondérée correcte
      const weightedMean =
        (stats.successfulCampaigns * stats.averageSuccessDuration +
          stats.failedCampaigns * stats.averageFailureDuration) /
        (stats.successfulCampaigns + stats.failedCampaigns)

      // La vraie formule doit utiliser le résultat pondéré
      expect(result.value).toBeCloseTo(weightedMean, 1)

      // Si les groupes sont très déséquilibrés, la formule pondérée
      // devrait être très différente de la naïve
      if (stats.successfulCampaigns > stats.failedCampaigns * 5) {
        expect(Math.abs(result.value - naiveMean)).toBeGreaterThan(
          Math.abs(result.value - weightedMean) + 0.1,
        )
      }
    }
  })

  it('respecte la formule : (count_success × avg_success + count_failed × avg_failed) / total', () => {
    const stats = computeAggregatedStats()
    const totalCampaigns = stats.successfulCampaigns + stats.failedCampaigns

    if (totalCampaigns > 0) {
      const result = getKpiData('avg-duration', 'all')

      const expectedValue =
        (stats.successfulCampaigns * stats.averageSuccessDuration +
          stats.failedCampaigns * stats.averageFailureDuration) /
        totalCampaigns

      expect(result.value).toBeCloseTo(expectedValue, 2)
    }
  })

  it('if seulement des campagnes réussies existent, la durée moyenne = durée moyenne des réussies', () => {
    const stats = computeAggregatedStats()

    if (stats.successfulCampaigns > 0 && stats.failedCampaigns === 0) {
      const result = getKpiData('avg-duration', 'all')

      expect(result.value).toBeCloseTo(stats.averageSuccessDuration, 2)
    }
  })

  it('si seulement des campagnes échouées existent, la durée moyenne = durée moyenne des échouées', () => {
    const stats = computeAggregatedStats()

    if (stats.failedCampaigns > 0 && stats.successfulCampaigns === 0) {
      const result = getKpiData('avg-duration', 'all')

      expect(result.value).toBeCloseTo(stats.averageFailureDuration, 2)
    }
  })

  it('la durée moyenne ne contient pas NaN ou Infinity', () => {
    const result = getKpiData('avg-duration', 'all')

    expect(Number.isNaN(result.value)).toBe(false)
    expect(Number.isFinite(result.value)).toBe(true)
  })
})
