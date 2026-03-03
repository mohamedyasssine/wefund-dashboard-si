import type { Period } from '@/types'

const PERIOD_LABELS: Record<Period, string> = {
  day: 'Jour',
  week: 'Semaine',
  month: 'Mois',
  quarter: 'Trimestre',
  year: 'Année',
  all: 'Tout',
}

type PeriodSelectorProps = {
  value: Period
  onChange: (next: Period) => void
  availablePeriods?: Period[]
  'aria-label'?: string
}

export default function PeriodSelector({
  value,
  onChange,
  availablePeriods,
  'aria-label': ariaLabel,
}: PeriodSelectorProps) {
  const periods = availablePeriods ?? (Object.keys(PERIOD_LABELS) as Period[])

  if (!periods.includes(value)) {
    // On garde un fallback sûr si jamais la valeur reçue est incohérente
    // plutôt que de planter silencieusement.
    // Cela reste un composant de présentation : la validation métier est ailleurs.
    // eslint-disable-next-line no-console
    console.warn(
      `[PeriodSelector] valeur inconnue "${value}", fallback sur "month"`,
    )
  }

  return (
    <div className="period-selector" role="radiogroup" aria-label={ariaLabel}>
      {periods.map((period) => {
        const isActive = period === value

        return (
          <button
            key={period}
            type="button"
            className={
              isActive
                ? 'period-selector__button period-selector__button--active'
                : 'period-selector__button'
            }
            onClick={() => onChange(period)}
            role="radio"
            aria-checked={isActive}
          >
            {PERIOD_LABELS[period]}
          </button>
        )
      })}
    </div>
  )
}

