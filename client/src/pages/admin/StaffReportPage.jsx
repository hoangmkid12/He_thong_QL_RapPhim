import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function StaffReportPage() {
  const { user } = useAuth()
  
  const { data: report, isLoading } = useQuery({
    queryKey: ['staff-report'],
    queryFn: () => api.get('/thong-ke/staff-report').then(r => r.data.data)
  })

  if (isLoading) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div className="admin-page page-enter">
      <div className="admin-topbar" style={{ position: 'static', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800 }}>📊 Báo cáo cá nhân</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(34,197,94,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>⏰</div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.875rem' }}>Số giờ làm việc (tháng này)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{report?.totalHours || 0} <span style={{ fontSize: '1rem', fontWeight: 500 }}>giờ</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(59,130,246,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🎟️</div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.875rem' }}>Số vé đã bán (tổng)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{report?.ticketsSold || 0} <span style={{ fontSize: '1rem', fontWeight: 500 }}>vé</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💰</div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.875rem' }}>Doanh thu tạo ra</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{(report?.revenue || 0).toLocaleString('vi-VN')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>VND</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Thông tin nhân viên</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, color: '#e8e8f0' }}>
            <div>
              <div style={{ color: '#878797', fontSize: '0.85rem' }}>Họ tên</div>
              <div style={{ fontWeight: 600 }}>{user?.name}</div>
            </div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.85rem' }}>Email</div>
              <div style={{ fontWeight: 600 }}>{user?.email}</div>
            </div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.85rem' }}>Cơ sở làm việc</div>
              <div style={{ fontWeight: 600 }}>Cơ sở ID: {user?.id_rap}</div>
            </div>
            <div>
              <div style={{ color: '#878797', fontSize: '0.85rem' }}>Chức vụ</div>
              <div style={{ fontWeight: 600 }}>Nhân viên quầy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
