type KpiCardProps = {
  title: string
  value: string
  variation?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
}

export default function KpiCard({
  title,
  value,
  variation,
  trend = 'neutral',
  subtitle,
}: KpiCardProps) {
  const hasVariation = Boolean(variation)
  const trendClassName =
    trend === 'up'
      ? 'kpi-card__variation--up'
      : trend === 'down'
        ? 'kpi-card__variation--down'
        : 'kpi-card__variation--neutral'

  return (
    <article className="kpi-card">
      <header className="kpi-card__header">
        <h3 className="kpi-card__title">{title}</h3>
      </header>

      <div className="kpi-card__body">
        <p className="kpi-card__value">{value}</p>

        {hasVariation && (
          <p className={`kpi-card__variation ${trendClassName}`}>
            <span
              aria-hidden="true"
              className="kpi-card__variation-icon"
            >
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '◆'}
            </span>
            <span className="kpi-card__variation-text">{variation}</span>
          </p>
        )}
      </div>

      {subtitle && <p className="kpi-card__subtitle">{subtitle}</p>}
    </article>
  )
}

