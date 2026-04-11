<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/da82e0c1-a0de-4c98-aa02-f01bb64f3654" /><img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/122d57eb-6c0b-44f7-b7e0-f7abf884a88a" /># 🎬 Galaxy Studio — Hệ thống đặt vé xem phim

> Dự án fullstack React + NodeJS, migrate từ PHP/MySQL legacy.

## 📁 Cấu trúc dự án

```
webphim/
├── client/                 # React (Vite)
│   └── src/
│       ├── components/     # Layout components (Header, Footer, AdminSidebar)
│       ├── context/        # AuthContext, BookingContext
│       ├── pages/
│       │   ├── user/       # 12 trang người dùng
│       │   └── admin/      # 11 trang quản trị
│       ├── services/       # api.js (Axios + auto-refresh)
│       └── main.jsx
├── server/                 # NodeJS (Express)
│   └── src/
│       ├── config/         # db.js (MySQL2 pool)
│       ├── controllers/    # 14 controllers
│       ├── middleware/     # JWT auth, RBAC, Multer upload
│       ├── routes/         # 10 route files
│       └── scripts/        # migrate-passwords.js
└── package.json            # Root dev scripts
```

## 🚀 Khởi động

### Cài đặt dependencies
```bash
cd server && npm install
cd client && npm install
```

### Cấu hình môi trường
Tạo file `server/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=webphim

JWT_SECRET=galaxy_studio_secret_2024
JWT_REFRESH_SECRET=galaxy_studio_refresh_2024

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Galaxy Studio <your@gmail.com>

FRONTEND_URL=http://localhost:5173
PORT=3001
```

### Chạy development
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm run dev
```

### Migration mật khẩu (chạy 1 lần)
```bash
cd server && node src/scripts/migrate-passwords.js
```

## 📸 Giao diện ứng dụng (Screenshots)

Dưới đây là một số hình ảnh giao diện của hệ thống:

### Trang Khách Hàng (User)
> 💡 **Ghi chú**: Hãy chụp màn hình trang chủ và trang đặt vé của khách hàng rồi lưu vào thư mục `assets/` với tên `home.png` và `booking.png`.

| Trang Chủ | Đặt Vé |
| --------- | -------- |
| ![Trang Chủ](assets/home.png) | ![Đặt Vé](assets/booking.png) |

### Trang Quản Trị (Admin)
> 💡 **Ghi chú**: Hãy chụp màn hình trang quản lý (Dashboard) và chức năng khác rồi lưu vào thư mục `assets/` với tên `admin_dashboard.png` và `admin_movies.png`.

| Dashboard | Quản Lý Phim |
| --------- | -------- |
| ![Dashboard]<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/a51bb8fd-a6ce-47ed-a05e-fb4c688d15a6" />
| ![Quản Lý Phim]<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/bd9b8f09-59f1-4ec0-b7df-22ccf2ba58bc" />
| ![Quản Lý Rạp]<img width="1918" height="1014" alt="image" src="https://github.com/user-attachments/assets/c1e9f35e-030b-448d-8808-a1031492626c" />
| ![Quản Lý Vé]<img width="1919" height="1010" alt="image" src="https://github.com/user-attachments/assets/055360d6-b06e-445d-9a11-d0763bc81f96" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/9ef81916-dcc3-45e4-ae44-e768090e5128" />
<img width="1919" height="1010" alt="image" src="https://github.com/user-attachments/assets/8be7e2b7-cfbe-40c3-b7f6-e9608b801783" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/77824c63-05d9-44ae-b0ea-8201f45bcb31" />
<img width="1919" height="1011" alt="image" src="https://github.com/user-attachments/assets/d9f3c458-1113-4f29-a9e6-74b0f7fa2a96" />



## 🌐 URLs

| Service  | URL                         |
|----------|-----------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:3001        |
| API Docs | http://localhost:3001/api/health |

## 🔐 Vai trò hệ thống

| Vai trò | Mô tả | Quyền hạn |
|---------|-------|-----------|
| 0 | Khách hàng | Đặt vé, tích điểm |
| 1 | Nhân viên | Quét vé, xem lịch |
| 2 | Admin | Toàn quyền hệ thống |
| 3 | Quản lý Rạp | Quản lý rạp cụ thể |
| 4 | Quản lý Cụm | Quản lý nhiều rạp |

## 📋 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/register | Đăng ký |
| GET | /api/phim | Danh sách phim |
| GET | /api/rap | Danh sách rạp |
| GET | /api/lich-chieu | Lịch chiếu |
| POST | /api/ve/dat-ve | Đặt vé |
| POST | /api/scan-ve | Quét vé |
| GET | /api/thong-ke/summary | Tổng quan thống kê |
