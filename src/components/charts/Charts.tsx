import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'

function useChartTheme() {
  const { isDark } = useTheme()
  return {
    tooltipStyle: {
      backgroundColor: isDark ? '#172040' : '#ffffff',
      border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
      borderRadius: '10px',
      fontSize: '12px',
      color: isDark ? '#e2e8f0' : '#0f172a',
      boxShadow: '0 8px 24px -8px rgba(15, 23, 42, 0.2)',
    },
    grid: isDark ? '#1e293b' : '#e2e8f0',
    tick: isDark ? '#94a3b8' : '#64748b',
  }
}

const brandDefault = '#4f46e5'

export function TrendChart({
  data,
  dataKey,
  name,
  color = brandDefault,
  height = 280,
}: {
  data: { [key: string]: string | number }[]
  dataKey: string
  name: string
  color?: string
  height?: number
}) {
  const theme = useChartTheme()
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.tick }} />
          <YAxis tick={{ fontSize: 11, fill: theme.tick }} width={44} />
          <Tooltip contentStyle={theme.tooltipStyle} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} name={name} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GroupedBarChart({
  data,
  keys,
  colors = ['#4f46e5', '#10b981'],
  height = 280,
}: {
  data: { [key: string]: string | number }[]
  keys: string[]
  colors?: string[]
  height?: number
}) {
  const theme = useChartTheme()
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.tick }} />
          <YAxis tick={{ fontSize: 11, fill: theme.tick }} width={44} />
          <Tooltip contentStyle={theme.tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[6, 6, 0, 0]} maxBarSize={36} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SimpleBarChart({
  data,
  dataKey,
  color = brandDefault,
  height = 280,
}: {
  data: { [key: string]: string | number }[]
  dataKey: string
  color?: string
  height?: number
}) {
  const theme = useChartTheme()
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.tick }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11, fill: theme.tick }} width={44} />
          <Tooltip contentStyle={theme.tooltipStyle} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const pieColors = [
  '#4f46e5',
  '#7c3aed',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
  '#f97316',
  '#ec4899',
  '#6366f1',
]

export function PieDonutChart({
  data,
  height = 280,
}: {
  data: { name: string; value: number }[]
  height?: number
}) {
  const theme = useChartTheme()
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={pieColors[i % pieColors.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={theme.tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MultiLineChart({
  data,
  series,
  height = 280,
}: {
  data: { [key: string]: string | number }[]
  series: { key: string; name: string; color: string }[]
  height?: number
}) {
  const theme = useChartTheme()
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: theme.tick }} />
          <YAxis tick={{ fontSize: 11, fill: theme.tick }} width={44} />
          <Tooltip contentStyle={theme.tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{ r: 3 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
