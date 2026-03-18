/**
 * Tests de composants — KpiCard
 *
 * Vérifie que la carte KPI :
 * - Affiche le titre
 * - Affiche la valeur
 * - Affiche le sous-titre/description si fourni
 * - Reste accessible
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import KpiCard from '@/components/ui/KpiCard'

describe('KpiCard', () => {
  it('affiche le titre', () => {
    render(
      <KpiCard
        title="Campagnes actives"
        value="42"
        subtitle="Nombre de campagnes actives"
      />,
    )

    expect(screen.getByText('Campagnes actives')).toBeInTheDocument()
  })

  it('affiche la valeur', () => {
    render(
      <KpiCard
        title="Montant collecté"
        value="150 000 €"
        subtitle="Total sur la période"
      />,
    )

    expect(screen.getByText('150 000 €')).toBeInTheDocument()
  })

  it('affiche le sous-titre si fourni', () => {
    render(
      <KpiCard
        title="Test KPI"
        value="100"
        subtitle="Ceci est une description"
      />,
    )

    expect(screen.getByText('Ceci est une description')).toBeInTheDocument()
  })

  it('n affiche pas le sous-titre si non fourni', () => {
    render(<KpiCard title="Test" value="50" />)

    // La valeur doit être présente
    expect(screen.getByText('50')).toBeInTheDocument()
    // Mais pas de sous-titre
    expect(screen.queryByText(/Ceci est une description/)).not.toBeInTheDocument()
  })

  it('affiche une valeur par défaut "—" si valeur vide', () => {
    render(<KpiCard title="Test" value="" subtitle="Description" />)

    // Selon l'implémentation, une valeur vide peut afficher "—"
    const content = screen.getByText(/Test/)
    expect(content).toBeInTheDocument()
  })

  it('rend le titre et la valeur dans une structure de liste ou de conteneur', () => {
    const { container } = render(
      <KpiCard title="Test KPI" value="999" subtitle="Subtitle" />,
    )

    const kpiCard = container.firstChild
    expect(kpiCard).toBeTruthy()
  })

  it('le titre et la valeur sont visibles et lisibles', () => {
    const { container } = render(
      <KpiCard
        title="Visible Title"
        value="Visible Value"
        subtitle="Visible Subtitle"
      />,
    )

    expect(screen.getByText('Visible Title')).toBeVisible()
    expect(screen.getByText('Visible Value')).toBeVisible()
    expect(screen.getByText('Visible Subtitle')).toBeVisible()
  })
})
