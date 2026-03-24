import { describe, it, expect, vi } from 'vitest'
import type { KpiDataService } from '@/domain/ports/KpiDataService'
import type { KpiData, KpiMetadata } from '@/domain/kpi'
import { createKpiDashboardUseCases } from '@/lib/application/kpiDashboardUseCases'

describe('kpiDashboardUseCases', () => {
  it('loadMetadata retourne les metadonnees du service', async () => {
    const metadata: KpiMetadata[] = [
      {
        id: 'active-campaigns',
        title: 'Campagnes actives',
        description: 'Nombre de campagnes actives',
        unit: 'campagnes',
        chartType: 'line',
        periodRequired: true,
      },
    ]

    const service: KpiDataService = {
      getKpiMetadata: vi.fn().mockResolvedValue(metadata),
      getKpiData: vi.fn(),
    }

    const useCases = createKpiDashboardUseCases(service)
    const result = await useCases.loadMetadata()

    expect(service.getKpiMetadata).toHaveBeenCalledTimes(1)
    expect(result).toEqual(metadata)
  })

  it('loadKpiData retourne status loaded en cas de succes', async () => {
    const data: KpiData = {
      kpiId: 'total-collected',
      period: 'month',
      value: 4200,
      timeSeries: [{ date: '12 janv.', value: 4200 }],
    }

    const service: KpiDataService = {
      getKpiMetadata: vi.fn(),
      getKpiData: vi.fn().mockResolvedValue(data),
    }

    const useCases = createKpiDashboardUseCases(service)
    const result = await useCases.loadKpiData({
      kpiId: 'total-collected',
      period: 'month',
    })

    expect(service.getKpiData).toHaveBeenCalledWith('total-collected', 'month')
    expect(result).toEqual({ status: 'loaded', data })
  })

  it('loadKpiData mappe une erreur reseau en status error NETWORK', async () => {
    const service: KpiDataService = {
      getKpiMetadata: vi.fn(),
      getKpiData: vi.fn().mockRejectedValue(new TypeError('fetch failed')),
    }

    const useCases = createKpiDashboardUseCases(service)
    const result = await useCases.loadKpiData({
      kpiId: 'total-collected',
      period: 'month',
    })

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.error.code).toBe('NETWORK')
    }
  })

  it('loadKpiData mappe une erreur generique en status error UNKNOWN', async () => {
    const service: KpiDataService = {
      getKpiMetadata: vi.fn(),
      getKpiData: vi.fn().mockRejectedValue(new Error('boom')),
    }

    const useCases = createKpiDashboardUseCases(service)
    const result = await useCases.loadKpiData({
      kpiId: 'active-campaigns',
      period: 'week',
    })

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.error.code).toBe('UNKNOWN')
      expect(result.error.message).toBe('boom')
    }
  })
})
