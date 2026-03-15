/**
 * Tests unitaires — utilitaires (date, format)
 *
 * Vérifie le comportement des fonctions utilitaires utilisées
 * par la couche de données KPI.
 */

import { describe, it, expect } from 'vitest'
import { getPeriodStartDate } from '@/lib/utils/date'
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDuration,
} from '@/lib/utils/format'

/* ================================================================
 * getPeriodStartDate — calcul de la borne de début
 * ================================================================ */

describe('getPeriodStartDate — borne de début de période', () => {
  it('la période « day » retourne une date environ 24 h dans le passé', () => {
    const now = new Date()
    const start = getPeriodStartDate('day')
    const diffMs = now.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    expect(diffHours).toBeGreaterThanOrEqual(23)
    expect(diffHours).toBeLessThanOrEqual(25)
  })

  it('la période « week » retourne une date environ 7 jours dans le passé', () => {
    const now = new Date()
    const start = getPeriodStartDate('week')
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    expect(diffDays).toBeGreaterThanOrEqual(6.9)
    expect(diffDays).toBeLessThanOrEqual(7.1)
  })

  it('la période « month » retourne une date environ 30 jours dans le passé', () => {
    const now = new Date()
    const start = getPeriodStartDate('month')
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    expect(diffDays).toBeGreaterThanOrEqual(29.9)
    expect(diffDays).toBeLessThanOrEqual(30.1)
  })

  it('la période « quarter » retourne une date environ 90 jours dans le passé', () => {
    const now = new Date()
    const start = getPeriodStartDate('quarter')
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    expect(diffDays).toBeGreaterThanOrEqual(89.9)
    expect(diffDays).toBeLessThanOrEqual(90.1)
  })

  it('la période « year » retourne une date environ 365 jours dans le passé', () => {
    const now = new Date()
    const start = getPeriodStartDate('year')
    const diffDays = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    expect(diffDays).toBeGreaterThanOrEqual(364.9)
    expect(diffDays).toBeLessThanOrEqual(365.1)
  })

  it('la période « all » retourne epoch (1er janvier 1970)', () => {
    const start = getPeriodStartDate('all')

    expect(start.getTime()).toBe(0)
  })

  it('retourne toujours une date antérieure à maintenant', () => {
    const periods = ['day', 'week', 'month', 'quarter', 'year', 'all'] as const
    const now = new Date()

    for (const period of periods) {
      const start = getPeriodStartDate(period)
      expect(start.getTime()).toBeLessThanOrEqual(now.getTime())
    }
  })
})

/* ================================================================
 * formatCurrency — affichage de montants en euros
 * ================================================================ */

describe('formatCurrency — formatage monétaire', () => {
  it('formate un montant entier avec le symbole €', () => {
    const result = formatCurrency(1000)

    expect(result).toContain('€')
    expect(result).toContain('1')
    expect(result).toContain('000')
  })

  it('formate zéro correctement', () => {
    const result = formatCurrency(0)

    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formate un montant décimal', () => {
    const result = formatCurrency(42.5)

    expect(result).toContain('42')
    expect(result).toContain('€')
  })
})

/* ================================================================
 * formatPercentage — affichage de pourcentages
 * ================================================================ */

describe('formatPercentage — formatage en pourcentage', () => {
  it('ajoute le symbole % à la fin', () => {
    expect(formatPercentage(75)).toContain('%')
  })

  it('formate 0 % correctement', () => {
    expect(formatPercentage(0)).toBe('0.0%')
  })

  it('formate 100 % correctement', () => {
    expect(formatPercentage(100)).toBe('100.0%')
  })

  it('respecte le nombre de décimales demandé', () => {
    expect(formatPercentage(33.333, 2)).toBe('33.33%')
  })
})

/* ================================================================
 * formatNumber — affichage de nombres
 * ================================================================ */

describe('formatNumber — formatage numérique', () => {
  it('retourne une chaîne non vide pour un nombre positif', () => {
    const result = formatNumber(12345)

    expect(result.length).toBeGreaterThan(0)
  })

  it('formate zéro', () => {
    expect(formatNumber(0)).toBe('0')
  })
})

/* ================================================================
 * formatDuration — affichage de durées en jours
 * ================================================================ */

describe('formatDuration — formatage de durées', () => {
  it('affiche « 1 jour » pour 1 jour', () => {
    expect(formatDuration(1)).toBe('1 jour')
  })

  it('affiche « 3 jours » pour 3 jours', () => {
    expect(formatDuration(3)).toBe('3 jours')
  })

  it('affiche en semaines pour 7-29 jours', () => {
    expect(formatDuration(14)).toContain('semaine')
  })

  it('affiche en mois pour 30-364 jours', () => {
    expect(formatDuration(60)).toContain('mois')
  })

  it('affiche en années pour 365+ jours', () => {
    expect(formatDuration(730)).toContain('an')
  })
})
