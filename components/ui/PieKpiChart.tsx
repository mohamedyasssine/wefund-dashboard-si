import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

type PieDatum = {
  name: string
  value: number
}

type PieKpiChartProps = {
  data: PieDatum[]
  height?: number
  ariaLabel?: string
  colors?: string[]
  innerRadius?: number | string
  outerRadius?: number | string
  showLegend?: boolean
  emptyMessage?: string
}

const DEFAULT_HEIGHT = 260

const DEFAULT_COLORS = [
  '#2563eb',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ec4899',
  '#6366f1',
]

export default function PieKpiChart({
  data,
  height = DEFAULT_HEIGHT,
  ariaLabel,
  colors = DEFAULT_COLORS,
  innerRadius = '55%',
  outerRadius = '80%',
  showLegend = true,
  emptyMessage = 'Aucune donnée à afficher pour cette répartition',
}: PieKpiChartProps) {
  if (data.length === 0) {
    return (
      <div className="kpi-chart kpi-chart--empty" aria-label={ariaLabel}>
        <p className="kpi-chart__empty-message">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="kpi-chart" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow:
                '0 10px 15px -3px rgb(15 23 42 / 0.15), 0 4px 6px -4px rgb(15 23 42 / 0.1)',
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 12, color: '#64748b' }}
            />
          )}
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            cornerRadius={6}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={colors[index % colors.length]}
                stroke="#ffffff"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

