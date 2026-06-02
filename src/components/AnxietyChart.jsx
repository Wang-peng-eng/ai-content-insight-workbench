import { useState } from 'react'
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#155e75', '#0e7490', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9']

function PieView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={120}
          paddingAngle={3}
          dataKey="percentage"
          nameKey="label"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, _name, props) => [`${value}%`, props.payload.label]}
          contentStyle={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function BarView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24, top: 4, bottom: 4 }}>
        <XAxis type="number" unit="%" tick={{ fontSize: 12 }} stroke="#a8a29e" />
        <YAxis
          type="category"
          dataKey="label"
          width={80}
          tick={{ fontSize: 13, fill: '#44403c' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, '占比']}
          contentStyle={{
            border: '1px solid #e7e5e4',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnxietyChart({ anxieties }) {
  const [view, setView] = useState('bar')

  const data = anxieties.map((a) => ({
    label: a.label,
    percentage: a.percentage,
    count: a.count,
  }))

  if (data.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-1 mb-3">
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
            view === 'bar'
              ? 'bg-cyan-50 text-cyan-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setView('bar')}
        >
          <BarChartIcon size={14} />
          柱状图
        </button>
        <button
          type="button"
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
            view === 'pie'
              ? 'bg-cyan-50 text-cyan-800'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setView('pie')}
        >
          <PieChartIcon size={14} />
          饼图
        </button>
      </div>
      {view === 'bar' ? <BarView data={data} /> : <PieView data={data} />}
    </div>
  )
}
