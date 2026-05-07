import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { QRCodeSVG } from 'qrcode.react'

const GHE_GIA = { thuong: 55000, vip: 80000, doi: 100000 }

export default function POSPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const id_rap = user?.id_rap
  
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('Tiền mặt')
  const [selectedCombos, setSelectedCombos] = useState({})
  const [promoCode, setPromoCode] = useState('')

  // 1. Get now showing movies
  const { data: movies = [] } = useQuery({
    queryKey: ['pos-movies'],
    queryFn: () => api.get('/phim?hot=1').then(r => r.data.data) // hot=1 returns 'da_duyet' movies
  })

  // 2. Get showtimes for selected movie & date
  const { data: showtimes = [] } = useQuery({
    queryKey: ['pos-showtimes', selectedMovie, id_rap, selectedDate],
    queryFn: () => api.get(`/phim/${selectedMovie}/raps/${id_rap}/showtimes?ngay_chieu=${selectedDate}`).then(r => r.data.data),
    enabled: !!selectedMovie && !!id_rap && !!selectedDate
  })

  // 3. Get seat layout for selected showtime
  const { data: seatInfo, isLoading: loadingSeats } = useQuery({
    queryKey: ['seats', selectedShowtime?.id_gio, selectedShowtime?.id_lc, selectedMovie],
    queryFn: () => api.get(`/lich-chieu/seat-info?id_gio=${selectedShowtime.id_gio}&id_lc=${selectedShowtime.id_lc}&id_phim=${selectedMovie}`).then(r => r.data.data),
    enabled: !!selectedShowtime && !!selectedMovie,
    refetchInterval: 5000
  })

  // 4. Get combos and promos
  const { data: comboList = [] } = useQuery({ queryKey: ['combos'], queryFn: () => api.get('/store/combo').then(r => r.data.data) })
  const { data: promoList = [] } = useQuery({ queryKey: ['promos'], queryFn: () => api.get('/store/khuyen-mai/active').then(r => r.data.data) })

  const seats = seatInfo?.seats || []
  const bookedSeats = seatInfo?.bookedSeats || []
  
  const rows = useMemo(() => {
    const map = {}
    seats.forEach(s => {
      if (!map[s.hang]) map[s.hang] = []
      map[s.hang].push(s)
    })
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [seats])

  const toggleSeat = (seatName) => {
    if (bookedSeats.includes(seatName)) return
    setSelectedSeats(prev => prev.includes(seatName) ? prev.filter(s => s !== seatName) : [...prev, seatName])
  }

  const getSeatType = (seat) => seat?.loai_ghe || 'thuong'
  const seatsPrice = selectedSeats.reduce((sum, name) => {
    const seat = seats.find(s => s.ten_ghe === name || String(s.so_ghe) === name)
    return sum + (GHE_GIA[getSeatType(seat)] || GHE_GIA.thuong)
  }, 0)

  const combosPrice = Object.entries(selectedCombos).reduce((sum, [id, qty]) => {
    const cb = comboList.find(c => String(c.id) === String(id))
    return sum + (cb ? cb.gia * qty : 0)
  }, 0)

  const totalPrice = seatsPrice + combosPrice

  const appliedPromo = useMemo(() => {
    if (!promoCode.trim()) return null;
    return promoList.find(p => p.ma_km.toLowerCase() === promoCode.trim().toLowerCase());
  }, [promoCode, promoList]);

  const discountAmount = appliedPromo ? (totalPrice * appliedPromo.gia_tri_giam) / 100 : 0;
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const [ticketReceipt, setTicketReceipt] = useState(null)

  const checkoutMut = useMutation({
    mutationFn: (payload) => api.post('/ve/pos', payload),
    onSuccess: (res) => {
      toast.success('Bán vé thành công!')
      setTicketReceipt({
        id_ve: res.data.data.id_ve,
        movie: movies.find(m => m.id === selectedMovie)?.tieu_de,
        showtime: `${String(selectedShowtime.thoi_gian_chieu).slice(0,5)} | ${selectedDate}`,
        room: selectedShowtime.ten_phong,
        seats: selectedSeats.join(', '),
        combo: Object.entries(selectedCombos).filter(([_, q]) => q > 0).map(([id, q]) => {
          const c = comboList.find(cb => String(cb.id) === String(id))
          return `${c.ten} x${q}`
        }).join('; '),
        total: finalPrice,
        discount: discountAmount,
        method: paymentMethod
      })
      qc.invalidateQueries({ queryKey: ['seats'] })
      setSelectedSeats([])
      setSelectedCombos({})
      setPromoCode('')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi thanh toán')
  })

  const handleCheckout = () => {
    if (!selectedSeats.length) return toast.error('Vui lòng chọn ghế')
    
    checkoutMut.mutate({
      id_phim: selectedMovie,
      id_lc: selectedShowtime.id_lc,
      id_gio: selectedShowtime.id_gio,
      ghe: selectedSeats,
      combo: Object.entries(selectedCombos).filter(([_, q]) => q > 0).map(([id, q]) => {
        const c = comboList.find(cb => String(cb.id) === String(id))
        return `${c.ten} x${q}`
      }).join('; '),
      gia_ghe: totalPrice,
      phuong_thuc: paymentMethod,
      id_khuyen_mai: appliedPromo ? appliedPromo.id : null,
      tien_giam: discountAmount,
      thanh_toan_cuoi: finalPrice
    })
  }

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>🎫 Bán vé tại quầy (POS)</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Lựa chọn */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Movies */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>1. Chọn phim</h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {movies.map(m => (
                  <button key={m.id} onClick={() => { setSelectedMovie(m.id); setSelectedShowtime(null); setSelectedSeats([]) }}
                    style={{
                      padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                      border: selectedMovie === m.id ? '2px solid #e50914' : '1px solid rgba(255,255,255,.1)',
                      background: selectedMovie === m.id ? 'rgba(229,9,20,.1)' : 'rgba(255,255,255,.03)',
                      color: '#e8e8f0', transition: '.15s',
                    }}>
                    {m.tieu_de}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Showtimes */}
          {selectedMovie && (
            <div className="card">
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontWeight: 700, margin: 0 }}>2. Suất chiếu</h3>
                  <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedShowtime(null) }} className="form-control" style={{ width: 150, padding: '4px 10px' }} />
                </div>
                {showtimes.length === 0 ? <p style={{ color: '#878797' }}>Không có suất chiếu</p> : (
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {showtimes.map(st => (
                      <button key={st.id_gio} onClick={() => { setSelectedShowtime(st); setSelectedSeats([]) }}
                        style={{
                          padding: '8px 16px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                          border: selectedShowtime?.id_gio === st.id_gio ? '2px solid #e50914' : '1px solid rgba(255,255,255,.1)',
                          background: selectedShowtime?.id_gio === st.id_gio ? 'rgba(229,9,20,.1)' : 'rgba(255,255,255,.03)',
                          color: '#e8e8f0', transition: '.15s',
                        }}>
                        <div style={{ fontWeight: 700 }}>{String(st.thoi_gian_chieu).slice(0,5)}</div>
                        <div style={{ fontSize: '0.72rem', color: '#878797' }}>{st.ten_phong}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seats */}
          {selectedShowtime && (
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>3. Chọn ghế</h3>
                {loadingSeats ? <div className="spinner mx-auto" /> : (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                      <div style={{ background: '#666', width: '60%', height: 4, margin: '0 auto 8px', borderRadius: 2 }} />
                      <span style={{ fontSize: '0.7rem', color: '#878797' }}>MÀN HÌNH</span>
                    </div>
                    <div className="seat-grid" style={{ marginBottom: 20, overflowX: 'auto' }}>
                      {rows.map(([rowLabel, rowSeats]) => (
                        <div key={rowLabel} className="seat-row">
                          <div className="seat-label" style={{ width: 20 }}>{rowLabel}</div>
                          {rowSeats.sort((a,b) => parseInt(a.so_ghe) - parseInt(b.so_ghe)).map(seat => {
                            const seatName = seat.ten_ghe || `${rowLabel}${seat.so_ghe}`
                            const isBooked = bookedSeats.includes(seatName)
                            const isSelected = selectedSeats.includes(seatName)
                            const type = getSeatType(seat)
                            let seatClass = 'seat seat-available'
                            if (isBooked) seatClass = 'seat seat-booked'
                            else if (isSelected) seatClass = 'seat seat-selected'
                            else if (type === 'vip') seatClass = 'seat seat-vip'
                            return (
                              <button key={seatName} className={seatClass} disabled={isBooked} onClick={() => toggleSeat(seatName)} style={{ width: 28, height: 24, fontSize: '0.6rem' }}>
                                {seat.so_ghe}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Combos */}
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>4. Combo đồ ăn</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {comboList.map(cb => (
                  <div key={cb.id} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontWeight: 700 }}>{cb.ten}</div>
                    <div style={{ fontSize: '0.8rem', color: '#878797' }}>{cb.mo_ta}</div>
                    <div style={{ color: '#e50914', fontWeight: 600 }}>{cb.gia.toLocaleString('vi-VN')}đ</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <button className="btn btn-sm" onClick={() => setSelectedCombos(p => ({ ...p, [cb.id]: Math.max(0, (p[cb.id] || 0) - 1) }))}>-</button>
                      <span style={{ fontWeight: 800 }}>{selectedCombos[cb.id] || 0}</span>
                      <button className="btn btn-sm" onClick={() => setSelectedCombos(p => ({ ...p, [cb.id]: (p[cb.id] || 0) + 1 }))}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cột Thanh toán */}
        <div className="card" style={{ position: 'sticky', top: 24 }}>
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 12 }}>Thông tin vé</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24, fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#878797' }}>Phim</span>
                <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: 150 }}>{movies.find(m => m.id === selectedMovie)?.tieu_de || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#878797' }}>Suất chiếu</span>
                <span style={{ fontWeight: 600 }}>{selectedShowtime ? `${String(selectedShowtime.thoi_gian_chieu).slice(0,5)} | ${selectedDate}` : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#878797' }}>Phòng</span>
                <span style={{ fontWeight: 600 }}>{selectedShowtime?.ten_phong || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#878797' }}>Ghế ({selectedSeats.length})</span>
                <span style={{ fontWeight: 800, color: '#e50914' }}>{selectedSeats.join(', ') || '—'}</span>
              </div>
              {combosPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#878797' }}>Combo</span>
                  <span style={{ fontWeight: 600 }}>{combosPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,.1)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#878797' }}>Tạm tính</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mã khuyến mãi</label>
              <input type="text" className="form-control" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Nhập mã KM..." />
              {appliedPromo && <div style={{ color: '#4caf50', fontSize: '0.8rem', marginTop: 4 }}>✓ Áp dụng: giảm {appliedPromo.gia_tri_giam}% (-{discountAmount.toLocaleString('vi-VN')}đ)</div>}
              {promoCode.trim() && !appliedPromo && <div style={{ color: '#e50914', fontSize: '0.8rem', marginTop: 4 }}>Mã không hợp lệ hoặc đã hết hạn</div>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#878797' }}>Thành tiền</span>
              <span style={{ fontWeight: 800, fontSize: '1.6rem', color: '#e50914' }}>{finalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="form-group">
              <label className="form-label">Phương thức thanh toán</label>
              <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản / Quẹt thẻ</option>
              </select>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={checkoutMut.isPending || selectedSeats.length === 0} 
              className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }}>
              {checkoutMut.isPending ? 'Đang xử lý...' : 'Thanh toán & In vé'}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Receipt Modal */}
      {ticketReceipt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', color: '#000', width: 350, padding: 24, borderRadius: 12, position: 'relative' }}>
            <button onClick={() => setTicketReceipt(null)} style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#000' }}>✖</button>
            <div id="print-area" style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '2px dashed #ccc' }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase' }}>Galaxy Studio</h2>
              <p style={{ margin: '4px 0 16px 0', fontSize: '0.8rem', color: '#666' }}>Hóa đơn điện tử - E-Ticket</p>
              
              <div style={{ textAlign: 'left', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <div><strong>Mã vé:</strong> #VE{ticketReceipt.id_ve}</div>
                <div><strong>Phim:</strong> {ticketReceipt.movie}</div>
                <div><strong>Suất:</strong> {ticketReceipt.showtime}</div>
                <div><strong>Phòng:</strong> {ticketReceipt.room}</div>
                <div><strong>Ghế:</strong> <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{ticketReceipt.seats}</span></div>
                {ticketReceipt.combo && <div><strong>Combo:</strong> {ticketReceipt.combo}</div>}
                {ticketReceipt.discount > 0 && <div style={{ color: '#e50914' }}><strong>Giảm giá:</strong> -{ticketReceipt.discount.toLocaleString('vi-VN')} đ</div>}
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee' }}>
                  <strong>Thanh toán:</strong> {ticketReceipt.method}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: 4 }}>
                  Tổng: {ticketReceipt.total.toLocaleString('vi-VN')} đ
                </div>
              </div>
              
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>MÃ NHẬN VÉ</div>
                  <QRCodeSVG value={String(ticketReceipt.id_ve)} size={120} level="H" includeMargin={true} />
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: 2 }}>#{ticketReceipt.id_ve}</div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => {
                const printContent = document.getElementById('print-area').innerHTML;
                const win = window.open('', '', 'width=400,height=600');
                win.document.write('<html><head><title>In vé</title></head><body style="font-family:sans-serif;padding:20px">' + printContent + '</body></html>');
                win.document.close();
                win.print();
              }} 
              className="btn btn-primary" style={{ width: '100%', marginTop: 16, background: '#e50914' }}>
              🖨️ IN VÉ
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
