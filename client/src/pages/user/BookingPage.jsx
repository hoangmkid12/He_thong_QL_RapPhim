import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useBooking } from '../../context/BookingContext'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { booking, setMovie, setRap, setDate, setShowtime } = useBooking()
  const [selectedRap, setSelectedRap] = useState(booking.rap?.id || null)
  const [selectedDate, setSelectedDateState] = useState(booking.selectedDate || null)
  const [selectedShowtime, setSelectedShowtimeState] = useState(null)

  const { data: phim } = useQuery({ queryKey: ['phim', id], queryFn: () => api.get(`/phim/${id}`).then(r => r.data.data) })
  const { data: raps = [] } = useQuery({ queryKey: ['raps-phim', id], queryFn: () => api.get(`/phim/${id}/raps`).then(r => r.data.data), enabled: !!id })
  const { data: dates = [] } = useQuery({
    queryKey: ['dates-phim-rap', id, selectedRap],
    queryFn: () => api.get(`/phim/${id}/raps/${selectedRap}/dates`).then(r => r.data.data),
    enabled: !!id && !!selectedRap,
  })
  const { data: showtimes = [] } = useQuery({
    queryKey: ['showtimes', id, selectedRap, selectedDate],
    queryFn: () => api.get(`/phim/${id}/raps/${selectedRap}/showtimes?ngay_chieu=${selectedDate}`).then(r => r.data.data),
    enabled: !!id && !!selectedRap && !!selectedDate,
  })

  useEffect(() => { if (phim) setMovie(phim) }, [phim])

  const handleNext = () => {
    if (!selectedShowtime) return
    const rap = raps.find(r => r.id === selectedRap)
    setRap(rap)
    setDate(selectedDate)
    setShowtime(selectedShowtime)
    navigate('/chon-ghe')
  }

  return (
    <div className="container page-enter" style={{ padding: '40px 16px', maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>🎟️ Đặt vé</h1>
        {phim && <p style={{ color: '#878797' }}>Phim: <strong style={{ color: '#e8e8f0' }}>{phim.tieu_de}</strong></p>}
      </div>

      {/* Step 1: Chọn rạp */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>1. Chọn rạp chiếu</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
            {raps.map(r => (
              <button key={r.id} onClick={() => { setSelectedRap(r.id); setSelectedDateState(null); setSelectedShowtimeState(null) }}
                style={{
                  padding: '12px 16px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                  border: selectedRap === r.id ? '2px solid #e50914' : '1px solid rgba(255,255,255,.1)',
                  background: selectedRap === r.id ? 'rgba(229,9,20,.1)' : 'rgba(255,255,255,.03)',
                  color: '#e8e8f0', transition: '.15s',
                }}>
                <div style={{ fontWeight: 600 }}>{r.ten_rap}</div>
                <div style={{ fontSize: '0.8rem', color: '#878797', marginTop: 4 }}>{r.dia_chi}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Chọn ngày */}
      {selectedRap && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>2. Chọn ngày chiếu</h3>
            {dates.length === 0 ? <p style={{ color: '#878797' }}>Không có lịch chiếu trong thời gian tới</p> : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {dates.map(d => {
                  const dt = new Date(d)
                  const dayNames = ['CN','T2','T3','T4','T5','T6','T7']
                  return (
                    <button key={d} onClick={() => { setSelectedDateState(d); setSelectedShowtimeState(null) }}
                      style={{
                        padding: '10px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'center', minWidth: 70,
                        border: selectedDate === d ? '2px solid #e50914' : '1px solid rgba(255,255,255,.1)',
                        background: selectedDate === d ? 'rgba(229,9,20,.1)' : 'rgba(255,255,255,.03)',
                        color: '#e8e8f0', transition: '.15s',
                      }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{dt.getDate()}/{dt.getMonth()+1}</div>
                      <div style={{ fontSize: '0.72rem', color: '#878797', marginTop: 2 }}>{dayNames[dt.getDay()]}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Chọn giờ */}
      {selectedDate && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>3. Chọn giờ chiếu</h3>
            {showtimes.length === 0 ? <p style={{ color: '#878797' }}>Không có suất chiếu trong ngày này</p> : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {showtimes.map(st => (
                  <button key={st.id_gio} onClick={() => setSelectedShowtimeState(st)}
                    style={{
                      padding: '10px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                      border: selectedShowtime?.id_gio === st.id_gio ? '2px solid #e50914' : '1px solid rgba(255,255,255,.1)',
                      background: selectedShowtime?.id_gio === st.id_gio ? 'rgba(229,9,20,.1)' : 'rgba(255,255,255,.03)',
                      color: '#e8e8f0', transition: '.15s',
                    }}>
                    <div style={{ fontWeight: 700 }}>{String(st.thoi_gian_chieu).slice(0,5)}</div>
                    <div style={{ fontSize: '0.72rem', color: '#878797', marginTop: 2 }}>{st.ten_phong}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={handleNext} disabled={!selectedShowtime} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
        Tiếp theo → Chọn ghế
      </button>
    </div>
  )
}
