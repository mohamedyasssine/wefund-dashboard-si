import type { TimeSeriesDataPoint } from '@/types'
import type { KpiChartConfig } from '@/types/kpi'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type BarKpiChartProps = {
  data: TimeSeriesDataPoint[]
  config?: KpiChartConfig
  height?: number
  ariaLabel?: string
  emptyMessage?: string
}

const DEFAULT_HEIGHT = 260

export default function BarKpiChart({
  data,
  config,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  emptyMessage = 'Aucune donnée à afficher pour cette période',
}: BarKpiChartProps) {
  if (data.length === 0) {
    return (
      <div className="kpi-chart kpi-chart--empty" role="img" aria-label={ariaLabel ?? 'Graphique vide'}>
        <p className="kpi-chart__empty-message">{emptyMessage}</p>
      </div>
    )
  }

  const color = config?.color ?? '#2563eb'
  const showGrid = config?.showGrid ?? true

  return (
    <div className="kpi-chart" role="img" aria-label={ariaLabel ?? 'Graphique en barres'}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            width={48}
            tickLine={false}
            axisLine={false}
            label={
              config?.yAxisLabel
                ? {
                    value: config.yAxisLabel,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#64748b', fontSize: 12 },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow:
                '0 10px 15px -3px rgb(15 23 42 / 0.15), 0 4px 6px -4px rgb(15 23 42 / 0.1)',
            }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[6, 6, 0, 0]}
            name={config?.title ?? 'Valeur'}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

