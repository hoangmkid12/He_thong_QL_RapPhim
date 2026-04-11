import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import api from '../../services/api'
import { useBooking } from '../../context/BookingContext'

const GHE_GIA = { thuong: 55000, vip: 80000, doi: 100000 }

export default function SeatPage() {
  const navigate = useNavigate()
  const { booking, setSeats } = useBooking()
  const { showtime, movie, rap } = booking

  const [selected, setSelected] = useState([])

  const { data: seatInfo, isLoading } = useQuery({
    queryKey: ['seats', showtime?.id_gio, showtime?.id_lc, movie?.id],
    queryFn: () => api.get(`/lich-chieu/seat-info?id_gio=${showtime.id_gio}&id_lc=${showtime.id_lc}&id_phim=${movie.id}`).then(r => r.data.data),
    enabled: !!showtime && !!movie,
    refetchInterval: 15000,
  })

  if (!showtime || !movie) {
    navigate('/phim'); return null
  }

  const seats = seatInfo?.seats || []
  const bookedSeats = seatInfo?.bookedSeats || []
  const meta = seatInfo?.meta

  // Group by row
  const rows = useMemo(() => {
    const map = {}
    seats.forEach(s => {
      if (!map[s.hang]) map[s.hang] = []
      map[s.hang].push(s)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [seats])

  const toggleSeat = (seatName, loai) => {
    if (bookedSeats.includes(seatName)) return
    setSelected(prev =>
      prev.includes(seatName) ? prev.filter(s => s !== seatName) : [...prev, seatName]
    )
  }

  const getSeatType = (seat) => seat?.loai_ghe || 'thuong'
  const totalPrice = selected.reduce((sum, name) => {
    const seat = seats.find(s => s.ten_ghe === name || String(s.so_ghe) === name)
    return sum + (GHE_GIA[getSeatType(seat)] || GHE_GIA.thuong)
  }, 0)

  const handleNext = () => {
    if (!selected.length) return
    setSeats(selected, totalPrice)
    navigate('/chon-combo')
  }

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="container page-enter" style={{ padding: '32px 16px', maxWidth: 900 }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(229,9,20,.3)' }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <div><span style={{ color: '#878797' }}>Phim: </span><strong>{movie?.tieu_de}</strong></div>
            <div><span style={{ color: '#878797' }}>Rạp: </span><strong>{meta?.ten_rap || rap?.ten_rap}</strong></div>
            <div><span style={{ color: '#878797' }}>Ngày: </span><strong>{meta?.ngay_chieu}</strong></div>
            <div><span style={{ color: '#878797' }}>Giờ: </span><strong>{meta?.thoi_gian_chieu}</strong></div>
            <div><span style={{ color: '#878797' }}>Phòng: </span><strong>{meta?.ten_phong}</strong></div>
          </div>
        </div>
      </div>

      {/* Screen indicator */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          background: 'linear-gradient(to bottom, #666, #333)',
          width: '60%', maxWidth: 400, height: 8, borderRadius: 4,
          margin: '0 auto 8px',
        }} />
        <span style={{ color: '#878797', fontSize: '0.8rem' }}>MÀN HÌNH</span>
      </div>

      {/* Seat grid */}
      {rows.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#878797' }}>Chưa có sơ đồ ghế cho phòng này</p>
      ) : (
        <div className="seat-grid" style={{ marginBottom: 32, overflowX: 'auto' }}>
          {rows.map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="seat-row">
              <div className="seat-label">{rowLabel}</div>
              {rowSeats.sort((a, b) => {
                const aNum = parseInt(a.so_ghe) || 0
                const bNum = parseInt(b.so_ghe) || 0
                return aNum - bNum
              }).map(seat => {
                const seatName = seat.ten_ghe || `${rowLabel}${seat.so_ghe}`
                const isBooked = bookedSeats.includes(seatName)
                const isSelected = selected.includes(seatName)
                const type = getSeatType(seat)
                let seatClass = 'seat seat-available'
                if (isBooked) seatClass = 'seat seat-booked'
                else if (isSelected) seatClass = `seat seat-selected`
                else if (type === 'vip') seatClass = 'seat seat-vip'
                return (
                  <button key={seatName} className={seatClass} title={seatName}
                    disabled={isBooked} onClick={() => toggleSeat(seatName, type)}>
                    {seat.so_ghe}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap', fontSize: '0.8rem' }}>
        {[['seat-available','Thường',`${(GHE_GIA.thuong/1000).toFixed(0)}k`],['seat-vip seat','VIP',`${(GHE_GIA.vip/1000).toFixed(0)}k`],['seat-selected','Đã chọn',''],['seat-booked','Đã đặt','']].map(([cls, label, price]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className={`seat ${cls}`} style={{ width: 24, height: 20, cursor: 'default', pointerEvents: 'none', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            <span style={{ color: '#878797' }}>{label} {price && <span style={{ color: '#e50914' }}>{price}</span>}</span>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div style={{ background: '#13131a', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ color: '#878797', fontSize: '0.875rem', marginBottom: 4 }}>Ghế đã chọn: <strong style={{ color: '#e8e8f0' }}>{selected.join(', ') || '(chưa chọn)'}</strong></div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#e50914' }}>{totalPrice.toLocaleString('vi-VN')} VND</div>
        </div>
        <button onClick={handleNext} disabled={selected.length === 0} className="btn btn-primary btn-lg">
          Tiếp theo → Chọn Combo
        </button>
      </div>
    </div>
  )
}
