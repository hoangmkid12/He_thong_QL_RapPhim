import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserLayout, AdminLayout, ProtectedRoute } from './components/layout/AuthLayouts'

// ─── Loading Component ──────────────────────────────────────────
const PageLoading = () => (
  <div className="loading-center">
    <div className="spinner" />
  </div>
)

// ─── User Pages (Lazy Loaded) ───────────────────────────────────
const HomePage           = lazy(() => import('./pages/user/HomePage'))
const MovieListPage      = lazy(() => import('./pages/user/MovieListPage'))
const MovieDetailPage    = lazy(() => import('./pages/user/MovieDetailPage'))
const BookingPage        = lazy(() => import('./pages/user/BookingPage'))
const SeatPage           = lazy(() => import('./pages/user/SeatPage'))
const ComboPage          = lazy(() => import('./pages/user/ComboPage'))
const CheckoutPage       = lazy(() => import('./pages/user/CheckoutPage'))
const MomoPaymentPage    = lazy(() => import('./pages/user/MomoPaymentPage'))
const ConfirmPage        = lazy(() => import('./pages/user/ConfirmPage'))
const LoginPage          = lazy(() => import('./pages/user/LoginPage'))
const RegisterPage       = lazy(() => import('./pages/user/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/user/ForgotPasswordPage'))
const ProfilePage        = lazy(() => import('./pages/user/ProfilePage'))
const TicketListPage     = lazy(() => import('./pages/user/TicketListPage'))
const PointHistoryPage   = lazy(() => import('./pages/user/PointHistoryPage'))
const PromotionPage      = lazy(() => import('./pages/user/PromotionPage'))
const CinemaPage         = lazy(() => import('./pages/user/CinemaPage'))
const MovieByCinemaPage  = lazy(() => import('./pages/user/MovieByCinemaPage'))
const GenrePage          = lazy(() => import('./pages/user/GenrePage'))
const NewsPage           = lazy(() => import('./pages/user/NewsPage'))
const NewsDetailPage     = lazy(() => import('./pages/user/NewsDetailPage'))
const MyWorkSchedule     = lazy(() => import('./pages/user/MyWorkSchedule'))
const LeaveRequestPage   = lazy(() => import('./pages/user/LeaveRequestPage'))

// ─── Admin Pages (Lazy Loaded) ──────────────────────────────────
const DashboardPage           = lazy(() => import('./pages/admin/DashboardPage'))
const MovieManagePage         = lazy(() => import('./pages/admin/MovieManagePage'))
const GenreManagePage         = lazy(() => import('./pages/admin/GenreManagePage'))
const ScheduleManagePage      = lazy(() => import('./pages/admin/ScheduleManagePage'))
const CinemaManagePage        = lazy(() => import('./pages/admin/CinemaManagePage'))
const RoomManagePage          = lazy(() => import('./pages/admin/RoomManagePage'))
const TicketManagePage        = lazy(() => import('./pages/admin/TicketManagePage'))
const UserManagePage          = lazy(() => import('./pages/admin/UserManagePage'))
const ComboManagePage         = lazy(() => import('./pages/admin/ComboManagePage'))
const PromotionManagePage     = lazy(() => import('./pages/admin/PromotionManagePage'))
const StatisticsPage          = lazy(() => import('./pages/admin/StatisticsPage'))
const ScanTicketPage          = lazy(() => import('./pages/admin/ScanTicketPage'))
const StaffScheduleManagePage = lazy(() => import('./pages/admin/StaffScheduleManagePage'))
const LeaveManagePage         = lazy(() => import('./pages/admin/LeaveManagePage'))
const MovieDistributionPage   = lazy(() => import('./pages/admin/MovieDistributionPage'))
const CinemaStaffManagePage   = lazy(() => import('./pages/admin/CinemaStaffManagePage'))
const AttendancePage          = lazy(() => import('./pages/admin/AttendancePage'))
const EquipmentPage           = lazy(() => import('./pages/admin/EquipmentPage'))
const CommentManagePage       = lazy(() => import('./pages/admin/CommentManagePage'))
const POSPage                 = lazy(() => import('./pages/admin/POSPage'))
const SelfCheckInPage         = lazy(() => import('./pages/admin/SelfCheckInPage'))
const StaffReportPage         = lazy(() => import('./pages/admin/StaffReportPage'))
const LuongPage               = lazy(() => import('./pages/admin/LuongPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
          <Route path="/phim" element={<UserLayout><MovieListPage /></UserLayout>} />
          <Route path="/phim/:id" element={<UserLayout><MovieDetailPage /></UserLayout>} />
          <Route path="/the-loai/:id" element={<UserLayout><GenrePage /></UserLayout>} />
          <Route path="/rap-chieu" element={<UserLayout><CinemaPage /></UserLayout>} />
          <Route path="/rap-chieu/:id" element={<UserLayout><MovieByCinemaPage /></UserLayout>} />
          <Route path="/khuyen-mai" element={<UserLayout><PromotionPage /></UserLayout>} />
          <Route path="/tin-tuc" element={<UserLayout><NewsPage /></UserLayout>} />
          <Route path="/tin-tuc/:id" element={<UserLayout><NewsDetailPage /></UserLayout>} />

          {/* Auth Routes */}
          <Route path="/dang-nhap"  element={<UserLayout><LoginPage /></UserLayout>} />
          <Route path="/dang-ky"    element={<UserLayout><RegisterPage /></UserLayout>} />
          <Route path="/quen-mat-khau" element={<UserLayout><ForgotPasswordPage /></UserLayout>} />

          {/* Protected User Routes */}
          <Route path="/dat-ve/:id" element={<ProtectedRoute><UserLayout><BookingPage /></UserLayout></ProtectedRoute>} />
          <Route path="/chon-ghe"   element={<ProtectedRoute><UserLayout><SeatPage /></UserLayout></ProtectedRoute>} />
          <Route path="/chon-combo" element={<ProtectedRoute><UserLayout><ComboPage /></UserLayout></ProtectedRoute>} />
          <Route path="/thanh-toan" element={<ProtectedRoute><UserLayout><CheckoutPage /></UserLayout></ProtectedRoute>} />
          <Route path="/thanh-toan/momo" element={<ProtectedRoute><MomoPaymentPage /></ProtectedRoute>} />
          <Route path="/xac-nhan"   element={<ProtectedRoute><UserLayout><ConfirmPage /></UserLayout></ProtectedRoute>} />
          <Route path="/ho-so"      element={<ProtectedRoute><UserLayout><ProfilePage /></UserLayout></ProtectedRoute>} />
          <Route path="/ve-cua-toi" element={<ProtectedRoute><UserLayout><TicketListPage /></UserLayout></ProtectedRoute>} />
          <Route path="/lich-su-diem" element={<ProtectedRoute><UserLayout><PointHistoryPage /></UserLayout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><DashboardPage /></AdminLayout>} />
          <Route path="/admin/phim" element={<AdminLayout><MovieManagePage /></AdminLayout>} />
          <Route path="/admin/the-loai-phim" element={<AdminLayout><GenreManagePage /></AdminLayout>} />
          <Route path="/admin/lich-chieu" element={<AdminLayout><ScheduleManagePage /></AdminLayout>} />
          <Route path="/admin/rap" element={<AdminLayout><CinemaManagePage /></AdminLayout>} />
          <Route path="/admin/phong" element={<AdminLayout><RoomManagePage /></AdminLayout>} />
          <Route path="/admin/ve" element={<AdminLayout><TicketManagePage /></AdminLayout>} />
          <Route path="/admin/tai-khoan" element={<AdminLayout><UserManagePage /></AdminLayout>} />
          <Route path="/admin/combo" element={<AdminLayout><ComboManagePage /></AdminLayout>} />
          <Route path="/admin/khuyen-mai" element={<AdminLayout><PromotionManagePage /></AdminLayout>} />
          <Route path="/admin/thong-ke" element={<AdminLayout><StatisticsPage /></AdminLayout>} />
          <Route path="/admin/scan-ve" element={<AdminLayout><ScanTicketPage /></AdminLayout>} />
          <Route path="/admin/lich-lam-viec" element={<AdminLayout><StaffScheduleManagePage /></AdminLayout>} />
          <Route path="/admin/duyet-nghi-phep" element={<AdminLayout><LeaveManagePage /></AdminLayout>} />
          <Route path="/admin/phan-phoi-phim" element={<AdminLayout><MovieDistributionPage /></AdminLayout>} />
          <Route path="/admin/nhan-vien-rap" element={<AdminLayout><CinemaStaffManagePage /></AdminLayout>} />
          <Route path="/admin/lich-cua-toi" element={<AdminLayout><MyWorkSchedule /></AdminLayout>} />
          <Route path="/admin/dang-ky-nghi" element={<AdminLayout><LeaveRequestPage /></AdminLayout>} />
          <Route path="/admin/cham-cong" element={<AdminLayout><AttendancePage /></AdminLayout>} />
          <Route path="/admin/thiet-bi" element={<AdminLayout><EquipmentPage /></AdminLayout>} />
          <Route path="/admin/binh-luan" element={<AdminLayout><CommentManagePage /></AdminLayout>} />
          <Route path="/admin/pos" element={<AdminLayout><POSPage /></AdminLayout>} />
          <Route path="/admin/cham-cong-ca-nhan" element={<AdminLayout><SelfCheckInPage /></AdminLayout>} />
          <Route path="/admin/bao-cao-ca-nhan" element={<AdminLayout><StaffReportPage /></AdminLayout>} />
          <Route path="/admin/bang-luong" element={<AdminLayout><LuongPage /></AdminLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
