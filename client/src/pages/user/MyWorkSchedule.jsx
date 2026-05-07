import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function MyWorkSchedule() {
  const { user } = useAuth()
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  })
  const [selectedWeekUi, setSelectedWeekUi] = useState(() => {
    return new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  })

  // Lấy 7 ngày trong tuần từ ngày đã chọn
  const weekDays = useMemo(() => {
    const start = new Date(selectedWeek)
    const day = start.getDay() // 0-6
    const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Start from Monday
    const monday = new Date(start.setDate(diff))
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      return d
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek])

  const from = weekDays[0].toISOString().slice(0, 10)
  const to = weekDays[6].toISOString().slice(0, 10)

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['my-schedules', from, to],
    queryFn: () => api.get(`/lich-lam-viec/my?from=${from}&to=${to}`).then(r => r.data.data),
  })

  const getShiftInDay = (dateObj) => {
    const dStr = dateObj.toISOString().slice(0, 10)
    return schedules.filter(s => s.ngay.slice(0, 10) === dStr)
  }

  const fmtTime = (t) => t?.slice(0, 5)

  return (
    <div className="admin-page page-enter">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>💼 Lịch làm việc của tôi</h1>
        <p style={{ color: '#878797' }}>Chào {user?.name}, theo dõi các ca làm việc của bạn trong tuần.</p>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', background: 'var(--c-surface2)' }}>
            {weekDays.map((date, i) => {
              const shifts = getShiftInDay(date)
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div key={i} style={{ 
                  padding: '20px 16px', 
                  borderRight: i < 6 ? '1px solid var(--c-border)' : 'none',
                  borderBottom: '1px solid var(--c-border)',
                  minHeight: 200,
                  background: isToday ? 'rgba(229,9,20,0.03)' : 'transparent'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#e50914' : '#878797', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isToday ? '#e50914' : '#e8e8f0' }}>
                      {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {shifts.map(s => (
                      <div key={s.id} style={{ 
                        background: 'var(--c-surface)', padding: '10px', borderRadius: 8, 
                        borderLeft: '3px solid #e50914', fontSize: '0.85rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        <div style={{ fontWeight: 800, color: '#e8e8f0' }}>{s.ca_lam}</div>
                        <div style={{ fontSize: '0.75rem', color: '#878797', marginTop: 2 }}>
                          {fmtTime(s.gio_bat_dau)} - {fmtTime(s.gio_ket_thuc)}
                        </div>
                        {s.ghi_chu && (
                          <div style={{ fontSize: '0.7rem', color: '#666', marginTop: 4, fontStyle: 'italic' }}>
                            📝 {s.ghi_chu}
                          </div>
                        )}
                      </div>
                    ))}
                    {shifts.length === 0 && (
                      <div style={{ textAlign: 'center', color: '#444', fontSize: '0.75rem', marginTop: 20 }}>Trống</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <input 
          type="text" 
          className="form-control" 
          style={{ maxWidth: 180 }} 
          value={selectedWeekUi} 
          onChange={e => {
            const v = e.target.value;
            setSelectedWeekUi(v);
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
              const [d, m, y] = v.split('/');
              setSelectedWeek(`${y}-${m}-${d}`);
            }
          }} 
          placeholder="dd/mm/yyyy"
        />
        <span style={{ marginLeft: 12, color: '#878797', fontSize: '0.85rem' }}>
          Chọn ngày (dd/mm/yyyy) để xem lịch tuần đó
        </span>
      </div>
    </div>
  )
}
