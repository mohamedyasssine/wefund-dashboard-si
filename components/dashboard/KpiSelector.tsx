import type { KpiId, KpiMetadata } from '@/types'

type KpiSelectorProps = {
  kpis: KpiMetadata[]
  selectedId: KpiId
  onSelect: (id: KpiId) => void
}

export default function KpiSelector({
  kpis,
  selectedId,
  onSelect,
}: KpiSelectorProps) {
  return (
    <nav
      className="kpi-selector"
      aria-label="Sélection d'indicateurs de performance"
    >
      {kpis.map((kpi) => {
        const isActive = kpi.id === selectedId

        return (
          <button
            key={kpi.id}
            type="button"
            className={
              isActive
                ? 'kpi-selector__item kpi-selector__item--active'
                : 'kpi-selector__item'
            }
            onClick={() => onSelect(kpi.id)}
            aria-pressed={isActive}
          >
            <span className="kpi-selector__title">{kpi.title}</span>
            <span className="kpi-selector__description">
              {kpi.description}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

