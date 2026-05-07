import { useState, useRef, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function SelfCheckInPage() {
  const [imgSrc, setImgSrc] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const { data: records = [], refetch } = useQuery({
    queryKey: ['self-chamcong'],
    queryFn: () => api.get('/cham-cong/self').then(r => r.data.data)
  })

  const checkInMut = useMutation({
    mutationFn: (loai) => api.post('/cham-cong/self', { anh: imgSrc, loai }),
    onSuccess: (data) => {
      toast.success(data.data.message || 'Thành công')
      setImgSrc(null)
      refetch()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Lỗi')
  })

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(s)
    } catch (err) {
      toast.error('Không thể truy cập camera. Vui lòng cấp quyền.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const context = canvasRef.current.getContext('2d')
    context.drawImage(videoRef.current, 0, 0, 400, 300)
    setImgSrc(canvasRef.current.toDataURL('image/jpeg'))
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream, imgSrc])

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📷 Chấm công khuôn mặt</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, margin: 0 }}>Chụp ảnh nhận diện</h3>
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e50914', fontFamily: 'monospace' }}>
                {currentTime.toLocaleTimeString('vi-VN')}
              </div>
            </div>
            
            <div style={{ background: '#13131a', borderRadius: 8, overflow: 'hidden', position: 'relative', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!stream && !imgSrc && (
                <button onClick={startCamera} className="btn btn-primary">Mở Camera</button>
              )}
              {stream && !imgSrc && (
                <>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={capture} className="btn btn-primary" style={{ position: 'absolute', bottom: 20 }}>📸 Chụp</button>
                </>
              )}
              {imgSrc && (
                <>
                  <img src={imgSrc} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setImgSrc(null)} className="btn btn-secondary" style={{ position: 'absolute', bottom: 20 }}>Chụp lại</button>
                </>
              )}
              <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => checkInMut.mutate('vao')} disabled={!imgSrc || checkInMut.isPending} className="btn btn-primary" style={{ flex: 1, background: '#22c55e' }}>
                👋 Check-IN (Vào ca)
              </button>
              <button onClick={() => checkInMut.mutate('ra')} disabled={!imgSrc || checkInMut.isPending} className="btn btn-primary" style={{ flex: 1, background: '#f59e0b' }}>
                🏃 Check-OUT (Ra về)
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Lịch sử chấm công (30 ngày)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Giờ vào</th>
                    <th>Giờ ra</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.ngay?.split('T')[0]}</td>
                      <td style={{ color: '#22c55e', fontWeight: 600 }}>{r.gio_vao?.slice(0,5)}</td>
                      <td style={{ color: r.gio_ra === '00:00:00' ? '#878797' : '#3b82f6', fontWeight: 600 }}>{r.gio_ra === '00:00:00' ? '—' : r.gio_ra?.slice(0,5)}</td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: '#878797', padding: 20 }}>Chưa có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
