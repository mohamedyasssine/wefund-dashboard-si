/**
 * Tests unitaires — adaptateur KpiDataService et contexte React
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import type { KpiDataService } from '@/domain/ports/KpiDataService'
import { mockKpiDataAdapter } from '@/lib/adapters/mockKpiDataAdapter'
import {
  KpiDataServiceProvider,
  useKpiDataService,
} from '@/context/KpiDataServiceContext'

vi.mock('@/lib/data/mock', () => ({
  fetchKpiData: vi.fn(),
  fetchKpiMetadata: vi.fn(),
}))

import { fetchKpiData, fetchKpiMetadata } from '@/lib/data/mock'

afterEach(() => {
  vi.clearAllMocks()
})

describe('mockKpiDataAdapter', () => {
  it('delegue getKpiData vers fetchKpiData', async () => {
    const expected = {
      kpiId: 'total-collected',
      period: 'month',
      value: 1234,
    }

    vi.mocked(fetchKpiData).mockResolvedValue(expected as never)

    const result = await mockKpiDataAdapter.getKpiData('total-collected', 'month')

    expect(fetchKpiData).toHaveBeenCalledWith('total-collected', 'month')
    expect(result).toEqual(expected)
  })

  it('delegue getKpiMetadata vers fetchKpiMetadata', async () => {
    const expected = [
      {
        id: 'active-campaigns',
        title: 'Campagnes actives',
        description: 'Nombre de campagnes actives',
        unit: 'campagnes',
        chartType: 'line',
        periodRequired: true,
      },
    ]

    vi.mocked(fetchKpiMetadata).mockResolvedValue(expected as never)

    const result = await mockKpiDataAdapter.getKpiMetadata()

    expect(fetchKpiMetadata).toHaveBeenCalledTimes(1)
    expect(result).toEqual(expected)
  })
})

function Consumer() {
  const service = useKpiDataService()

  return (
    <div>
      <span data-testid="has-service">{service ? 'yes' : 'no'}</span>
      <span data-testid="has-getKpiData">
        {typeof service.getKpiData === 'function' ? 'yes' : 'no'}
      </span>
      <span data-testid="has-getKpiMetadata">
        {typeof service.getKpiMetadata === 'function' ? 'yes' : 'no'}
      </span>
    </div>
  )
}

describe('KpiDataServiceContext', () => {
  it('injecte le service fourni via KpiDataServiceProvider', () => {
    const customService: KpiDataService = {
      getKpiData: vi.fn(),
      getKpiMetadata: vi.fn(),
    }

    render(
      <KpiDataServiceProvider service={customService}>
        <Consumer />
      </KpiDataServiceProvider>,
    )

    expect(screen.getByTestId('has-service')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-getKpiData')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-getKpiMetadata')).toHaveTextContent('yes')
  })

  it('utilise mockKpiDataAdapter par defaut', () => {
    render(
      <KpiDataServiceProvider>
        <Consumer />
      </KpiDataServiceProvider>,
    )

    expect(screen.getByTestId('has-service')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-getKpiData')).toHaveTextContent('yes')
    expect(screen.getByTestId('has-getKpiMetadata')).toHaveTextContent('yes')
  })

  it('useKpiDataService lance une erreur hors provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => render(<Consumer />)).toThrow(
      'useKpiDataService doit être utilisé dans un KpiDataServiceProvider',
    )

    spy.mockRestore()
  })
})
