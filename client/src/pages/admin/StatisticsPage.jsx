import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const fmtVND = (n) => n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : (n || 0).toLocaleString('vi-VN')

export default function StatisticsPage() {
  const { user, isCinemaManager } = useAuth()
  const [from, setFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().slice(0, 10) })
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10))
  const [fromUi, setFromUi] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) })
  const [toUi, setToUi] = useState(() => new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))
  const [range, setRange] = useState('30d')

  const applyRange = (r) => {
    const end = new Date()
    const start = new Date()
    setRange(r)
    if (r === '7d') start.setDate(start.getDate() - 7)
    else if (r === '30d') start.setDate(start.getDate() - 30)
    else if (r === '90d') start.setDate(start.getDate() - 90)
    else if (r === 'year') start.setMonth(start.getMonth() - 12)
    const sStr = start.toISOString().slice(0, 10)
    const eStr = end.toISOString().slice(0, 10)
    setFrom(sStr)
    setTo(eStr)
    setFromUi(new Date(sStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))
    setToUi(new Date(eStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))
  }

  const q = { queryOptions: { staleTime: 60000 } }
  const { data: revenueDate = [] } = useQuery({ queryKey: ['stats-date', from, to], queryFn: () => api.get(`/thong-ke/revenue-by-date?from=${from}&to=${to}`).then(r => r.data.data) })
  const { data: revenueRap = [] } = useQuery({ queryKey: ['stats-rap', from, to], queryFn: () => api.get(`/thong-ke/revenue-by-rap?from=${from}&to=${to}`).then(r => r.data.data) })
  const { data: topMovies = [] } = useQuery({ queryKey: ['stats-movies', from, to], queryFn: () => api.get(`/thong-ke/top-movies?from=${from}&to=${to}&limit=10`).then(r => r.data.data) })
  const { data: summary } = useQuery({ queryKey: ['stats-summary', from, to], queryFn: () => api.get(`/thong-ke/summary?from=${from}&to=${to}`).then(r => r.data.data) })

  const chartData = revenueDate.map(d => ({
    name: new Date(d.ngay).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
    'Doanh thu': parseInt(d.revenue || 0),
    'Số vé': parseInt(d.so_ve || 0),
  }))

  const rapChart = revenueRap.slice(0, 8).map(r => ({
    name: r.ten_rap || 'N/A',
    'Doanh thu': parseInt(r.doanh_thu || 0),
  }))

  const TOOLTIP_STYLE = { contentStyle: { background: '#1c1c27', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#e8e8f0' } }

  const getRangeText = () => {
    if (range === '7d') return '(7 ngày)'
    if (range === '30d') return '(30 ngày)'
    if (range === '90d') return '(90 ngày)'
    if (range === 'year') return '(1 năm)'
    return `(${new Date(from).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })} → ${new Date(to).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })})`
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📊 Thống kê & Báo cáo</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {[['7d','7 ngày'],['30d','30 ngày'],['90d','90 ngày'],['year','1 năm']].map(([v, label]) => (
            <button key={v} onClick={() => applyRange(v)} className={`btn btn-sm ${range === v ? 'btn-primary' : 'btn-ghost'}`}>{label}</button>
          ))}
          <input type="text" className="form-control" style={{ width: 140 }} value={fromUi} 
            onChange={e => {
              const v = e.target.value;
              setFromUi(v);
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                const [d, m, y] = v.split('/');
                setFrom(`${y}-${m}-${d}`);
                setRange('custom');
              }
            }} 
            placeholder="dd/mm/yyyy" />
          <span style={{ color: '#878797' }}>→</span>
          <input type="text" className="form-control" style={{ width: 140 }} value={toUi} 
            onChange={e => {
              const v = e.target.value;
              setToUi(v);
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                const [d, m, y] = v.split('/');
                setTo(`${y}-${m}-${d}`);
                setRange('custom');
              }
            }} 
            placeholder="dd/mm/yyyy" />
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          [`💰 Doanh thu ${getRangeText()}`, fmtVND(summary?.total_revenue) + ' ₫', '#e50914'],
          [`🎟️ Vé bán ra ${getRangeText()}`, (summary?.total_tickets || 0).toLocaleString(), '#22c55e'],
          ['🎬 Phim chiếu', summary?.total_movies, '#8b5cf6'],
          ['👥 Khách hàng', (summary?.total_customers || 0).toLocaleString(), '#f59e0b'],
        ].map(([label, value, color]) => (
          <div key={label} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ color: '#878797', fontSize: '0.8rem', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color }}>{value || 0}</div>
          </div>
        ))}
      </div>

      {/* Revenue line chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📈 Doanh thu {getRangeText()}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#878797' }} interval="preserveStartEnd" />
              <YAxis yAxisId="left" tickFormatter={v => fmtVND(v)} tick={{ fontSize: 11, fill: '#878797' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#878797' }} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [n === 'Doanh thu' ? `${v.toLocaleString('vi-VN')} ₫` : v, n]} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Doanh thu" stroke="#e50914" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="Số vé" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isCinemaManager ? '1fr' : '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Revenue by cinema bar chart */}
        {!isCinemaManager && (
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏟️ Doanh thu theo rạp {getRangeText()}</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={rapChart} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => fmtVND(v)} tick={{ fontSize: 10, fill: '#878797' }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10, fill: '#878797' }} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={v => [`${v.toLocaleString('vi-VN')} ₫`, 'Doanh thu']} />
                  <Bar dataKey="Doanh thu" fill="#e50914" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top movies table */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏆 Top phim bán chạy {getRangeText()}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {topMovies.slice(0, 8).map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <span style={{ color: i < 3 ? '#f5c518' : '#878797', minWidth: 20, fontWeight: 700 }}>#{i + 1}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.tieu_de}</span>
                  <span style={{ color: '#e50914', fontWeight: 700, flexShrink: 0 }}>{fmtVND(m.doanh_thu)}₫</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
