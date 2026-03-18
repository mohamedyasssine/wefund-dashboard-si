/**
 * Tests de composants — smoke tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import KpiCard from '@/components/ui/KpiCard'
import PeriodSelector from '@/components/ui/PeriodSelector'
import type { Period } from '@/domain/kpi'

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Campagnes actives" value="42" subtitle="Nombre de campagnes actives" />)

    expect(screen.getByText('Campagnes actives')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<KpiCard title="Montant collecté" value="150 000 €" subtitle="Total sur la période" />)

    expect(screen.getByText('Total sur la période')).toBeInTheDocument()
  })
})

describe('PeriodSelector', () => {
  it('renders a radiogroup', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month']

    const { container } = render(
      <PeriodSelector value="month" onChange={onChange} availablePeriods={periods} />,
    )

    expect(container.querySelector('[role="radiogroup"]')).toBeInTheDocument()
  })

  it('renders one radio per period', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month', 'year']

    render(<PeriodSelector value="month" onChange={onChange} availablePeriods={periods} />)

    expect(screen.getAllByRole('radio')).toHaveLength(3)
  })

  it('marks selected period with aria-checked true', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month']

    render(<PeriodSelector value="month" onChange={onChange} availablePeriods={periods} />)

    const selected = screen.getAllByRole('radio').find((radio) => radio.getAttribute('aria-checked') === 'true')
    expect(selected).toBeDefined()
  })
})
