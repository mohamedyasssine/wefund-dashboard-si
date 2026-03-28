/**
 * Tests de composants — KpiCard, PeriodSelector
 *
 * Tests smoke simples pour vérifier le rendu des composants.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import KpiCard from '@/components/ui/KpiCard'
import PeriodSelector from '@/components/ui/PeriodSelector'
import KpiSelector from '@/components/dashboard/KpiSelector'
import type { Period, KpiMetadata } from '@/domain/kpi'

describe('KpiCard', () => {
  it('rend le titre et la valeur correctement', () => {
    render(
      <KpiCard
        title="Campagnes actives"
        value="42"
        subtitle="Nombre de campagnes actives"
      />,
    )

    expect(screen.getByText('Campagnes actives')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Nombre de campagnes actives')).toBeInTheDocument()
  })

  it('rend sans sous-titre si non fourni', () => {
    render(<KpiCard title="Test" value="100" />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('gère les valeurs formatées', () => {
    render(
      <KpiCard
        title="Montant"
        value="150 000 EUR"
        subtitle="Total collecté"
      />,
    )

    expect(screen.getByText('150 000 EUR')).toBeInTheDocument()
  })
})

describe('PeriodSelector', () => {
  it('rend un radiogroup avec les périodes', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month']

    const { container } = render(
      <PeriodSelector
        value="month"
        onChange={onChange}
        availablePeriods={periods}
      />,
    )

    const radioGroup = container.querySelector('[role="radiogroup"]')
    expect(radioGroup).toBeInTheDocument()

    const radios = container.querySelectorAll('[role="radio"]')
    expect(radios.length).toBe(2)
  })

  it('appelle onChange quand on clique sur une période', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month']

    render(
      <PeriodSelector
        value="month"
        onChange={onChange}
        availablePeriods={periods}
      />,
    )

    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

    expect(onChange).toHaveBeenCalledWith('week')
  })

  it('marque la période sélectionnée avec aria-checked=true', () => {
    const onChange = vi.fn()
    const periods: Period[] = ['week', 'month']

    render(
      <PeriodSelector
        value="month"
        onChange={onChange}
        availablePeriods={periods}
      />,
    )

    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('aria-checked', 'false')
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
  })

  it('avertit en console si la valeur courante est absente des périodes proposées', () => {
    const onChange = vi.fn()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <PeriodSelector
        value="month"
        onChange={onChange}
        availablePeriods={['week', 'day']}
      />,
    )

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[PeriodSelector] valeur inconnue "month"'),
    )

    warn.mockRestore()
  })

  it('sans availablePeriods, expose toutes les périodes avec libellés connus', () => {
    const onChange = vi.fn()
    render(
      <PeriodSelector value="all" onChange={onChange} aria-label="Période" />,
    )

    expect(screen.getByRole('radiogroup', { name: 'Période' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Période : Tout' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    expect(screen.getByRole('radio', { name: 'Période : Jour' })).toBeInTheDocument()
  })
})

describe('KpiSelector', () => {
  const mockKpis: KpiMetadata[] = [
    {
      id: 'active-campaigns',
      title: 'Campagnes actives',
      description: 'Nombre de campagnes actives',
      unit: 'campagnes',
      chartType: 'line',
      periodRequired: true,
    },
    {
      id: 'total-collected',
      title: 'Montant collecté',
      description: 'Montant total collecté',
      unit: 'EUR',
      chartType: 'area',
      periodRequired: true,
    },
  ]

  it('affiche tous les KPI disponibles', () => {
    const onSelect = vi.fn()

    render(
      <KpiSelector
        kpis={mockKpis}
        selectedId="active-campaigns"
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('Campagnes actives')).toBeInTheDocument()
    expect(screen.getByText('Montant collecté')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Indicateur' })).toBeInTheDocument()
  })

  it('affiche la description du KPI sélectionné', () => {
    const onSelect = vi.fn()

    render(
      <KpiSelector
        kpis={mockKpis}
        selectedId="active-campaigns"
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('Nombre de campagnes actives')).toBeInTheDocument()
  })

  it('met à jour la description quand le KPI sélectionné change', () => {
    const onSelect = vi.fn()

    const { rerender } = render(
      <KpiSelector
        kpis={mockKpis}
        selectedId="active-campaigns"
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('Nombre de campagnes actives')).toBeInTheDocument()

    rerender(
      <KpiSelector
        kpis={mockKpis}
        selectedId="total-collected"
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('Montant total collecté')).toBeInTheDocument()
  })

  it('appelle onSelect quand on change la valeur du select', () => {
    const onSelect = vi.fn()

    render(
      <KpiSelector
        kpis={mockKpis}
        selectedId="active-campaigns"
        onSelect={onSelect}
      />,
    )

    const select = screen.getByRole('combobox', { name: 'Indicateur' })
    fireEvent.change(select, { target: { value: 'total-collected' } })

    expect(onSelect).toHaveBeenCalledWith('total-collected')
  })

  it('gère une liste vide sans crash', () => {
    const onSelect = vi.fn()

    render(
      <KpiSelector kpis={[]} selectedId="active-campaigns" onSelect={onSelect} />,
    )

    expect(screen.queryByText('Campagnes actives')).not.toBeInTheDocument()
  })
})
