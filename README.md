> 🎬 Galaxy Studio — Hệ thống đặt vé xem phim

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

## 📸 Giao diện ứng dụng

Dưới đây là một số hình ảnh giao diện của hệ thống:

### Trang chủ
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/470eefd7-b523-4357-b8fb-ae8ea69e5c01" />
<img width="1919" height="1015" alt="image" src="https://github.com/user-attachments/assets/b70c07b5-e6e5-4680-b9fd-8dde6f56871f" />

### Trang Quản Trị (Admin)
<img width="1919" height="1011" alt="image" src="https://github.com/user-attachments/assets/a1aa26f4-4add-498b-8690-187ef5458503" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/4bb37a04-1d43-48c6-87f3-24cb51b29846" />
<img width="1919" height="1008" alt="image" src="https://github.com/user-attachments/assets/1c3172dd-425a-48c3-9306-0bc1920d78a8" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/34964f85-3711-4aa8-a4a8-4b38773d3bdf" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/3788065d-1a84-4ab4-ae5d-faae5d4ee977" />
<img width="1919" height="1015" alt="image" src="https://github.com/user-attachments/assets/098c00bd-4c73-4644-960f-af37b4ebc5bb" />
<img width="1914" height="1008" alt="image" src="https://github.com/user-attachments/assets/041e24a4-820f-4d43-81c1-32c1816a6e2f" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/1e90038d-4a4a-4111-baff-019c504da53d" />
<img width="1919" height="1011" alt="image" src="https://github.com/user-attachments/assets/eea8c9f5-281d-4999-b22c-fa133df6c4d2" />
<img width="1919" height="1016" alt="image" src="https://github.com/user-attachments/assets/2570d86d-6c2d-42ac-8f4f-fe4717c4c01b" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/62b46004-f42d-462a-a35b-52afc4671fe9" />
<img width="1919" height="1013" alt="image" src="https://github.com/user-attachments/assets/5298274d-dd63-4f25-aa15-ecc9f2b0100a" />

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
