/**
 * Tests unitaires — couche de données KPI
 *
 * Vérifie le COMPORTEMENT de getKpiData et computeAggregatedStats :
 * - Contrat de retour (structure, champs obligatoires)
 * - Cohérence métier (valeurs ≥ 0, bornes, relation entre KPIs)
 * - Effet de la période sur les résultats
 *
 * Les données sous-jacentes sont celles du mock (POC) : on ne teste
 * pas les valeurs exactes (aléatoires) mais les invariants métier.
 */

import { describe, it, expect } from 'vitest'
import { getKpiData, computeAggregatedStats, KPI_METADATA } from '@/lib/data/mock'
import type { KpiId, Period, KpiData } from '@/domain/kpi'

/* ================================================================
 * getKpiData — structure et contrat de retour
 * ================================================================ */

describe('getKpiData — contrat de retour', () => {
  const kpis: KpiId[] = [
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

  const periods: Period[] = ['day', 'week', 'month', 'quarter', 'year', 'all']

  it.each(kpis)(
    'retourne un objet KpiData valide pour le KPI « %s »',
    (kpiId) => {
      const result: KpiData = getKpiData(kpiId, 'month')

      expect(result).toBeDefined()
      expect(result.kpiId).toBe(kpiId)
      expect(result.period).toBe('month')
    },
  )

  it.each(periods)(
    'la période « %s » est correctement reportée dans le résultat',
    (period) => {
      const result = getKpiData('total-collected', period)

      expect(result.period).toBe(period)
    },
  )

  it('contient toujours une valeur numérique définie pour chaque KPI', () => {
    for (const kpiId of kpis) {
      const result = getKpiData(kpiId, 'all')

      expect(result.value).toBeDefined()
      expect(typeof result.value).toBe('number')
    }
  })
})

/* ================================================================
 * getKpiData — cohérence métier des valeurs
 * ================================================================ */

describe('getKpiData — cohérence métier', () => {
  it('le nombre de campagnes actives est un entier ≥ 0', () => {
    const result = getKpiData('active-campaigns', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
    expect(Number.isInteger(result.value)).toBe(true)
  })

  it('le montant total collecté est ≥ 0', () => {
    const result = getKpiData('total-collected', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it('le taux de succès est compris entre 0 et 100 %', () => {
    const result = getKpiData('success-rate', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
    expect(result.value).toBeLessThanOrEqual(100)
  })

  it('le nombre de contributions est un entier ≥ 0', () => {
    const result = getKpiData('total-contributions', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
    expect(Number.isInteger(result.value)).toBe(true)
  })

  it('la moyenne de contributions par campagne est ≥ 0', () => {
    const result = getKpiData('avg-contributions-per-campaign', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it('la durée moyenne avant succès/échec est ≥ 0 jours', () => {
    const result = getKpiData('avg-duration', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it('le montant moyen par contribution est ≥ 0 €', () => {
    const result = getKpiData('avg-contribution-amount', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it("le taux d'atteinte moyen des objectifs est ≥ 0 %", () => {
    const result = getKpiData('avg-goal-achievement', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })

  it('le volume remboursé est ≥ 0', () => {
    const result = getKpiData('total-refunded', 'all')

    expect(result.value).toBeGreaterThanOrEqual(0)
  })
})

/* ================================================================
 * getKpiData — série temporelle (timeSeries)
 * ================================================================ */

describe('getKpiData — série temporelle', () => {
  it('les KPI avec période retournent une série temporelle pour la période « all »', () => {
    const kpisAvecPeriode: KpiId[] = [
      'active-campaigns',
      'total-collected',
      'total-contributions',
      'total-refunded',
    ]

    for (const kpiId of kpisAvecPeriode) {
      const result = getKpiData(kpiId, 'all')

      expect(result.timeSeries).toBeDefined()
      expect(Array.isArray(result.timeSeries)).toBe(true)
    }
  })

  it('chaque point de la série a une date (string) et une valeur (number)', () => {
    const result = getKpiData('total-collected', 'all')

    if (result.timeSeries && result.timeSeries.length > 0) {
      for (const point of result.timeSeries) {
        expect(typeof point.date).toBe('string')
        expect(point.date.length).toBeGreaterThan(0)
        expect(typeof point.value).toBe('number')
      }
    }
  })

  it('la série temporelle contient au moins un point pour « total-collected » sur « all »', () => {
    const result = getKpiData('total-collected', 'all')

    // Sur la période « all », les contributions existent donc la série
    // doit contenir au moins un point agrégé.
    expect(result.timeSeries).toBeDefined()
    expect(result.timeSeries!.length).toBeGreaterThan(0)
  })

  it("les KPI de type « number » (pas de période) n'ont pas de série temporelle", () => {
    const kpisSansSerie: KpiId[] = [
      'success-rate',
      'avg-contributions-per-campaign',
      'avg-duration',
      'avg-contribution-amount',
    ]

    for (const kpiId of kpisSansSerie) {
      const result = getKpiData(kpiId, 'month')

      expect(result.timeSeries).toBeUndefined()
    }
  })
})

/* ================================================================
 * getKpiData — effet de la période sur le périmètre
 * ================================================================ */

describe('getKpiData — filtrage par période', () => {
  it('le montant collecté sur « week » est ≤ au montant sur « all »', () => {
    const week = getKpiData('total-collected', 'week')
    const all = getKpiData('total-collected', 'all')

    expect(week.value).toBeLessThanOrEqual(all.value!)
  })

  it('le nombre de contributions sur « month » est ≤ au nombre sur « year »', () => {
    const month = getKpiData('total-contributions', 'month')
    const year = getKpiData('total-contributions', 'year')

    expect(month.value).toBeLessThanOrEqual(year.value!)
  })

  it('le volume remboursé sur « day » est ≤ au volume sur « all »', () => {
    const day = getKpiData('total-refunded', 'day')
    const all = getKpiData('total-refunded', 'all')

    expect(day.value).toBeLessThanOrEqual(all.value!)
  })
})

/* ================================================================
 * computeAggregatedStats — structure et cohérence
 * ================================================================ */

describe('computeAggregatedStats — structure', () => {
  it('retourne toutes les clés attendues', () => {
    const stats = computeAggregatedStats()

    expect(stats).toHaveProperty('totalCampaigns')
    expect(stats).toHaveProperty('activeCampaigns')
    expect(stats).toHaveProperty('successfulCampaigns')
    expect(stats).toHaveProperty('failedCampaigns')
    expect(stats).toHaveProperty('totalContributions')
    expect(stats).toHaveProperty('totalAmountCollected')
    expect(stats).toHaveProperty('totalAmountRefunded')
    expect(stats).toHaveProperty('averageContributionAmount')
    expect(stats).toHaveProperty('averageContributionsPerCampaign')
    expect(stats).toHaveProperty('averageSuccessDuration')
    expect(stats).toHaveProperty('averageFailureDuration')
    expect(stats).toHaveProperty('averageGoalAchievementRate')
  })

  it('toutes les valeurs sont des nombres finis', () => {
    const stats = computeAggregatedStats()

    for (const [, val] of Object.entries(stats)) {
      expect(typeof val).toBe('number')
      expect(Number.isFinite(val)).toBe(true)
    }
  })
})

describe('computeAggregatedStats — cohérence métier', () => {
  it('le nombre de campagnes actives + réussies + échouées ≤ total', () => {
    const stats = computeAggregatedStats()

    const sommePartielle =
      stats.activeCampaigns + stats.successfulCampaigns + stats.failedCampaigns

    expect(sommePartielle).toBeLessThanOrEqual(stats.totalCampaigns)
  })

  it('le montant remboursé est ≤ au montant collecté', () => {
    const stats = computeAggregatedStats()

    expect(stats.totalAmountRefunded).toBeLessThanOrEqual(
      stats.totalAmountCollected,
    )
  })

  it('la moyenne de contribution est ≥ 0 et ≤ au montant total collecté', () => {
    const stats = computeAggregatedStats()

    expect(stats.averageContributionAmount).toBeGreaterThanOrEqual(0)
    expect(stats.averageContributionAmount).toBeLessThanOrEqual(
      stats.totalAmountCollected,
    )
  })

  it('les durées moyennes sont ≥ 0 jours', () => {
    const stats = computeAggregatedStats()

    expect(stats.averageSuccessDuration).toBeGreaterThanOrEqual(0)
    expect(stats.averageFailureDuration).toBeGreaterThanOrEqual(0)
  })
})

/* ================================================================
 * KPI_METADATA — catalogue complet des 9 KPIs
 * ================================================================ */

describe('KPI_METADATA — catalogue', () => {
  it('contient exactement 9 KPI', () => {
    expect(KPI_METADATA).toHaveLength(9)
  })

  it('chaque KPI possède un id, un titre, une description et un chartType', () => {
    for (const meta of KPI_METADATA) {
      expect(meta.id).toBeTruthy()
      expect(meta.title).toBeTruthy()
      expect(meta.description).toBeTruthy()
      expect(['line', 'bar', 'pie', 'number', 'area']).toContain(meta.chartType)
    }
  })

  it('tous les identifiants de KPI sont uniques', () => {
    const ids = KPI_METADATA.map((m) => m.id)
    const unique = new Set(ids)

    expect(unique.size).toBe(ids.length)
  })
})
