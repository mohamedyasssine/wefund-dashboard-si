import type { TimeSeriesDataPoint } from '@/types'
import type { KpiChartConfig } from '@/types/kpi'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type LineKpiChartProps = {
  data: TimeSeriesDataPoint[]
  config?: KpiChartConfig
  height?: number
  ariaLabel?: string
  emptyMessage?: string
}

const DEFAULT_HEIGHT = 260

export default function LineKpiChart({
  data,
  config,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  emptyMessage = 'Aucune donnée à afficher pour cette période',
}: LineKpiChartProps) {
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
    <div className="kpi-chart" role="img" aria-label={ariaLabel ?? 'Graphique en courbe'}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.4}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name={config?.title ?? 'Valeur'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

