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
  const selectedDescription = kpis.find((kpi) => kpi.id === selectedId)?.description

  return (
    <div className="kpi-selector" role="group" aria-labelledby="kpi-selector-label">
      <label
        className="kpi-selector__label"
        htmlFor="kpi-selector"
        id="kpi-selector-label"
      >
        Indicateur
      </label>

      {/* Le label visible (htmlFor) suffit à nommer le contrôle.
          aria-describedby associe la description complémentaire au champ. */}
      <select
        id="kpi-selector"
        className="kpi-selector__select"
        value={selectedId}
        onChange={(e) => onSelect(e.target.value as KpiId)}
        aria-describedby="kpi-selector-hint"
      >
        {kpis.map((kpi) => (
          <option key={kpi.id} value={kpi.id}>
            {kpi.title}
          </option>
        ))}
      </select>

      <p className="kpi-selector__hint" id="kpi-selector-hint" aria-live="polite">
        {selectedDescription}
      </p>
    </div>
  )
}

