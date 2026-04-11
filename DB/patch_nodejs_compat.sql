-- ============================================================
-- PATCH: Cập nhật DB cinepass để tương thích với NodeJS API
-- Chạy file này sau khi đã import cinepass_chinhthuc.sql
-- ============================================================

USE `cinepass`;

-- ============================================================
-- 1. BẢNG `combo` — Code dùng tên `combo`, DB tên `combo_do_an`
--    Tạo view hoặc rename + migrate data
-- ============================================================

-- Tạo bảng `combo` chuẩn (nếu chưa có)
CREATE TABLE IF NOT EXISTS `combo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `gia` decimal(10,2) NOT NULL DEFAULT 0.00,
  `img` varchar(500) DEFAULT NULL,
  `id_rap` int(11) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_rap` (`id_rap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Migrate data từ combo_do_an sang combo (chỉ chạy 1 lần)
INSERT IGNORE INTO `combo` (`id`, `ten`, `mo_ta`, `gia`, `img`, `id_rap`, `trang_thai`, `ngay_tao`)
SELECT c.`id`, c.`ten_combo`, c.`mo_ta`, c.`gia`, c.`hinh_anh`, c.`id_rap`, c.`trang_thai`, c.`ngay_tao`
FROM `combo_do_an` c;

-- ============================================================
-- 2. BẢNG `khuyen_mai` — Code dùng cột `ten`, `ma_km`, `img`
--    DB có `ten_khuyen_mai`, `ma_khuyen_mai`, không có `img`
-- ============================================================

-- Thêm alias column (dùng ALTER nếu chưa có)
ALTER TABLE `khuyen_mai`
  ADD COLUMN IF NOT EXISTS `ten` varchar(255) GENERATED ALWAYS AS (`ten_khuyen_mai`) VIRTUAL,
  ADD COLUMN IF NOT EXISTS `ma_km` varchar(50) GENERATED ALWAYS AS (`ma_khuyen_mai`) VIRTUAL,
  ADD COLUMN IF NOT EXISTS `img` varchar(500) DEFAULT NULL;

-- ============================================================
-- 3. BẢNG `taikhoan` — Thiếu cột `trang_thai`
--    Code kiểm tra trang_thai = 1 (hoạt động) / 0 (khóa)
-- ============================================================

ALTER TABLE `taikhoan`
  ADD COLUMN IF NOT EXISTS `trang_thai` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=active, 0=locked';

-- ============================================================
-- 4. BẢNG `khung_gio_chieu` — Thiếu cột `gia_ve`
--    Code lưu gia_ve vào khung giờ
-- ============================================================

ALTER TABLE `khung_gio_chieu`
  ADD COLUMN IF NOT EXISTS `gia_ve` decimal(10,2) DEFAULT 55000.00 COMMENT 'Giá vé cho khung giờ này';

-- ============================================================
-- 5. BẢNG `ve` — Thiếu cột `price` (code dùng price, DB có gia_ve?)
--    Kiểm tra và thêm nếu thiếu
-- ============================================================

ALTER TABLE `ve`
  ADD COLUMN IF NOT EXISTS `price` decimal(10,2) DEFAULT 0.00 COMMENT 'Tổng giá vé';

-- ============================================================
-- 6. BẢNG `phong_ghe` — Code dùng cột `hang`, `so_ghe`, `trang_thai`
--    DB có `row_label`, `seat_number`, `active`
--    Thêm alias columns để tương thích
-- ============================================================

ALTER TABLE `phong_ghe`
  ADD COLUMN IF NOT EXISTS `hang` varchar(4) GENERATED ALWAYS AS (`row_label`) VIRTUAL COMMENT 'Alias for row_label',
  ADD COLUMN IF NOT EXISTS `so_ghe` int(11) GENERATED ALWAYS AS (`seat_number`) VIRTUAL COMMENT 'Alias for seat_number',
  ADD COLUMN IF NOT EXISTS `trang_thai` tinyint(1) GENERATED ALWAYS AS (`active`) VIRTUAL COMMENT 'Alias for active';

-- ============================================================
-- 7. BẢNG `binhluan` — Code dùng `id_phim`, `id_user`, `noidung`
--    DB có `id_phim`, `id_user`, `noidung` ✅ OK
--    Thiếu: `ngay_tao` dạng datetime chuẩn
-- ============================================================

ALTER TABLE `binhluan`
  ADD COLUMN IF NOT EXISTS `tra_loi` text DEFAULT NULL COMMENT 'Nội dung trả lời';

-- ============================================================
-- 8. BẢNG `tin_tuc` — Code dùng tên này nhưng DB dùng `tintuc`
--    Tạo alias
-- ============================================================

-- Kiểm tra xem bảng tên là tintuc hay tin_tuc
-- DB file có: CREATE TABLE `tintuc`
-- Code dùng: FROM tin_tuc
-- -> Cần rename hoặc tạo view

CREATE OR REPLACE VIEW `tin_tuc` AS SELECT * FROM `tintuc`;

-- ============================================================
-- 9. BẢNG `lich_su_diem` — Kiểm tra columns
-- ============================================================

CREATE TABLE IF NOT EXISTS `lich_su_diem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tk` int(11) NOT NULL,
  `loai_giao_dich` enum('cong','tru') NOT NULL DEFAULT 'cong',
  `so_diem` int(11) NOT NULL DEFAULT 0,
  `ly_do` varchar(500) DEFAULT NULL,
  `id_ve` int(11) DEFAULT NULL,
  `id_hd` int(11) DEFAULT NULL,
  `nguoi_thuc_hien` varchar(100) DEFAULT 'system',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_tk` (`id_tk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================
-- 10. BẢNG `rap_chieu` — Code dùng tên này, kiểm tra DB
-- ============================================================
-- DB có bảng `rap_chieu` ✅

-- Thêm cột img nếu thiếu
ALTER TABLE `rap_chieu`
  ADD COLUMN IF NOT EXISTS `dien_thoai` varchar(20) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `email` varchar(255) DEFAULT NULL;

-- ============================================================
-- 11. Cập nhật mật khẩu dạng plain text thành bcrypt
--     (Chạy script migrate-passwords.js riêng biệt)
-- ============================================================

-- Xem danh sách user cần migrate:
-- SELECT id, user, name, vai_tro FROM taikhoan WHERE pass NOT LIKE '$2%';

-- ============================================================
-- XONG — Verify:
-- ============================================================
SELECT 'combo' AS tbl, COUNT(*) AS rows FROM combo
UNION SELECT 'taikhoan', COUNT(*) FROM taikhoan
UNION SELECT 'khuyen_mai', COUNT(*) FROM khuyen_mai
UNION SELECT 'phongchieu', COUNT(*) FROM phongchieu
UNION SELECT 'lichchieu', COUNT(*) FROM lichchieu
UNION SELECT 've', COUNT(*) FROM ve
UNION SELECT 'tin_tuc (view)', COUNT(*) FROM tin_tuc;
