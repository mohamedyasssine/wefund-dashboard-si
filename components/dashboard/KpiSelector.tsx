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
    <div className="kpi-selector">
      <label className="kpi-selector__label" htmlFor="kpi-selector">
        Indicateur
      </label>
      <select
        id="kpi-selector"
        className="kpi-selector__select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value as KpiId)}
        aria-label="Sélection d'indicateur de performance"
      >
        {kpis.map((kpi) => (
          <option key={kpi.id} value={kpi.id}>
            {kpi.title}
          </option>
        ))}
      </select>

      <p className="kpi-selector__hint">
        {kpis.find((kpi) => kpi.id === selectedId)?.description}
      </p>
    </div>
  )
}

