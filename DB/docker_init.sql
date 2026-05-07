-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: cinepass
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bang_luong`
--

DROP TABLE IF EXISTS `bang_luong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bang_luong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL COMMENT 'ID nhân viên',
  `id_rap` int(11) NOT NULL COMMENT 'ID rạp',
  `thang` varchar(7) NOT NULL COMMENT 'Tháng tính lương (YYYY-MM)',
  `so_gio` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng số giờ làm việc',
  `luong_theo_gio` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Lương = số giờ × đơn giá',
  `phu_cap` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng phụ cấp (cố định + khác)',
  `khau_tru` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng khấu trừ (đi muộn, về sớm...)',
  `thuong` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Thưởng (nếu có)',
  `tong_luong` decimal(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng thực lãnh = lương + phụ cấp + thưởng - khấu trừ',
  `trang_thai` enum('nhap','cho_duyet','da_duyet','da_thanh_toan') DEFAULT 'nhap' COMMENT 'Trạng thái bảng lương',
  `trang_thai_thanh_toan` enum('chua_thanh_toan','da_thanh_toan') DEFAULT 'chua_thanh_toan',
  `ngay_thanh_toan` datetime DEFAULT NULL,
  `id_nguoi_thanh_toan` int(11) DEFAULT NULL,
  `ghi_chu_thanh_toan` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL COMMENT 'Ghi chú',
  `nguoi_duyet` int(11) DEFAULT NULL COMMENT 'ID người duyệt',
  `ngay_duyet` datetime DEFAULT NULL COMMENT 'Ngày duyệt',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `id_loai_luong` int(11) DEFAULT NULL,
  `bhxh` decimal(12,2) DEFAULT 0.00 COMMENT 'B?o hi?m x? h?i',
  `thue_thu_nhap` decimal(12,2) DEFAULT 0.00 COMMENT 'Thu? thu nh?p c? nh?n',
  `tong_khau_tru` decimal(12,2) DEFAULT 0.00 COMMENT 'T?ng kh?u tr? (kh?u tr? t? l??ng + BHXH + thu?)',
  `trang_thai_khoa` enum('mo','khoa') DEFAULT 'mo' COMMENT 'Kh?a b?ng l??ng sau thanh to?n',
  `ly_do_thay_doi` text DEFAULT NULL COMMENT 'Ghi ch? khi thay ??i l??ng',
  PRIMARY KEY (`id`),
  KEY `idx_nv_thang` (`id_nv`,`thang`),
  KEY `idx_rap_thang` (`id_rap`,`thang`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_trang_thai_thanh_toan` (`trang_thai_thanh_toan`),
  KEY `idx_ngay_thanh_toan` (`ngay_thanh_toan`),
  KEY `idx_id_nv_thanh_toan` (`id_nv`,`trang_thai_thanh_toan`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lương chi tiết của nhân viên';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_luong`
--

LOCK TABLES `bang_luong` WRITE;
/*!40000 ALTER TABLE `bang_luong` DISABLE KEYS */;
INSERT INTO `bang_luong` VALUES (7,30,1,'2025-11',0.00,0.00,200000.00,50000.00,0.00,450000.00,'cho_duyet','da_thanh_toan','2025-11-30 17:00:58',10,NULL,NULL,NULL,NULL,'2025-11-30 16:51:52','2025-11-30 17:01:18',NULL,0.00,0.00,0.00,'mo',NULL);
/*!40000 ALTER TABLE `bang_luong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bang_luong_chi_tiet`
--

DROP TABLE IF EXISTS `bang_luong_chi_tiet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bang_luong_chi_tiet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL COMMENT 'ID bảng lương',
  `loai` enum('phu_cap','khau_tru') NOT NULL COMMENT 'Loại khoản',
  `ten_khoan` varchar(255) NOT NULL COMMENT 'Tên khoản (ví dụ: Ăn trưa, Đi muộn...)',
  `so_tien` decimal(12,2) NOT NULL COMMENT 'Số tiền',
  `ghi_chu` varchar(500) DEFAULT NULL COMMENT 'Ghi chú',
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_bang_luong` (`id_bang_luong`),
  CONSTRAINT `bang_luong_chi_tiet_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Chi tiết các khoản phụ cấp/khấu trừ trong bảng lương';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_luong_chi_tiet`
--

LOCK TABLES `bang_luong_chi_tiet` WRITE;
/*!40000 ALTER TABLE `bang_luong_chi_tiet` DISABLE KEYS */;
/*!40000 ALTER TABLE `bang_luong_chi_tiet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bang_luong_khautru`
--

DROP TABLE IF EXISTS `bang_luong_khautru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bang_luong_khautru` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `loai_khautru` varchar(100) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `so_tien` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bang_luong` (`id_bang_luong`),
  CONSTRAINT `bang_luong_khautru_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_luong_khautru`
--

LOCK TABLES `bang_luong_khautru` WRITE;
/*!40000 ALTER TABLE `bang_luong_khautru` DISABLE KEYS */;
/*!40000 ALTER TABLE `bang_luong_khautru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bang_luong_lich_su`
--

DROP TABLE IF EXISTS `bang_luong_lich_su`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bang_luong_lich_su` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `hanh_dong` varchar(100) DEFAULT NULL,
  `gia_tri_cu` text DEFAULT NULL,
  `gia_tri_moi` text DEFAULT NULL,
  `nguoi_thuc_hien` int(11) DEFAULT NULL,
  `ngay_thay_doi` datetime DEFAULT current_timestamp(),
  `ghi_chu` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bang_luong` (`id_bang_luong`),
  KEY `nguoi_thuc_hien` (`nguoi_thuc_hien`),
  KEY `idx_ngay` (`ngay_thay_doi`),
  CONSTRAINT `bang_luong_lich_su_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bang_luong_lich_su_ibfk_2` FOREIGN KEY (`nguoi_thuc_hien`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_luong_lich_su`
--

LOCK TABLES `bang_luong_lich_su` WRITE;
/*!40000 ALTER TABLE `bang_luong_lich_su` DISABLE KEYS */;
/*!40000 ALTER TABLE `bang_luong_lich_su` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bang_luong_phucap`
--

DROP TABLE IF EXISTS `bang_luong_phucap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bang_luong_phucap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `loai_phucap` varchar(100) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `so_tien` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_bang_luong` (`id_bang_luong`),
  CONSTRAINT `bang_luong_phucap_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_luong_phucap`
--

LOCK TABLES `bang_luong_phucap` WRITE;
/*!40000 ALTER TABLE `bang_luong_phucap` DISABLE KEYS */;
/*!40000 ALTER TABLE `bang_luong_phucap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `binhluan`
--

DROP TABLE IF EXISTS `binhluan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `binhluan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phim` int(11) NOT NULL,
  `id_tk` int(11) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `so_sao` int(11) DEFAULT 5,
  `ngay_bl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_phim` (`id_phim`),
  KEY `id_user` (`id_tk`),
  CONSTRAINT `binhluan_ibfk_1` FOREIGN KEY (`id_phim`) REFERENCES `phim` (`id`),
  CONSTRAINT `binhluan_ibfk_2` FOREIGN KEY (`id_tk`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `binhluan`
--

LOCK TABLES `binhluan` WRITE;
/*!40000 ALTER TABLE `binhluan` DISABLE KEYS */;
INSERT INTO `binhluan` VALUES (30,5,48,'Hay quá bạn',5,'10:06:am 20-04-2025'),(31,5,50,'Đỉnh vãi',5,'09:26:pm 22-04-2025'),(32,5,48,'Hay lắm',5,'02:08:pm 27-05-2025'),(33,39,48,'Phim hay lắm nha cả nhà',5,'2026-04-07 23:49:35'),(34,37,50,'Hay lắm nha',5,'2026-05-04 20:44:03');
/*!40000 ALTER TABLE `binhluan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cau_hinh_luong_nv`
--

DROP TABLE IF EXISTS `cau_hinh_luong_nv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cau_hinh_luong_nv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL,
  `id_loai_luong` int(11) DEFAULT NULL,
  `luong_co_ban` decimal(12,2) DEFAULT NULL COMMENT 'L??ng c? b?n ri?ng (override m?c ??nh)',
  `he_so_luong` decimal(4,2) DEFAULT 1.00,
  `ngay_ap_dung` date NOT NULL DEFAULT curdate(),
  `ngay_ket_thuc` date DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nv` (`id_nv`),
  KEY `id_loai_luong` (`id_loai_luong`),
  CONSTRAINT `cau_hinh_luong_nv_ibfk_1` FOREIGN KEY (`id_nv`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cau_hinh_luong_nv_ibfk_2` FOREIGN KEY (`id_loai_luong`) REFERENCES `loai_luong` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cau_hinh_luong_nv`
--

LOCK TABLES `cau_hinh_luong_nv` WRITE;
/*!40000 ALTER TABLE `cau_hinh_luong_nv` DISABLE KEYS */;
/*!40000 ALTER TABLE `cau_hinh_luong_nv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cham_cong`
--

DROP TABLE IF EXISTS `cham_cong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cham_cong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay` date NOT NULL,
  `gio_vao` time NOT NULL,
  `anh_vao` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn ảnh check-in',
  `gio_ra` time NOT NULL,
  `anh_ra` varchar(500) DEFAULT NULL COMMENT 'Đường dẫn ảnh check-out',
  `break_duration` int(11) DEFAULT 60,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `location_accuracy` float DEFAULT NULL,
  `fingerprint_vao` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fingerprint_vao`)),
  `fingerprint_ra` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fingerprint_ra`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cham_cong`
--

LOCK TABLES `cham_cong` WRITE;
/*!40000 ALTER TABLE `cham_cong` DISABLE KEYS */;
/*!40000 ALTER TABLE `cham_cong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_analytics`
--

DROP TABLE IF EXISTS `chat_analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `total_messages` int(11) DEFAULT 0,
  `user_satisfaction` tinyint(1) DEFAULT NULL,
  `resolved_issues` text DEFAULT NULL,
  `chat_duration` int(11) DEFAULT NULL,
  `bot_accuracy` decimal(5,4) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_analytics`
--

LOCK TABLES `chat_analytics` WRITE;
/*!40000 ALTER TABLE `chat_analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_analytics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_history`
--

DROP TABLE IF EXISTS `chat_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_user_message` tinyint(1) NOT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `intent` varchar(100) DEFAULT NULL,
  `confidence` decimal(5,4) DEFAULT NULL,
  `response_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_history`
--

LOCK TABLES `chat_history` WRITE;
/*!40000 ALTER TABLE `chat_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_combo`
--

DROP TABLE IF EXISTS `chi_tiet_combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_combo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_combo` int(11) NOT NULL,
  `ten_mon` varchar(255) NOT NULL,
  `so_luong` int(11) DEFAULT 1,
  `don_gia` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `id_combo` (`id_combo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_combo`
--

LOCK TABLES `chi_tiet_combo` WRITE;
/*!40000 ALTER TABLE `chi_tiet_combo` DISABLE KEYS */;
INSERT INTO `chi_tiet_combo` VALUES (1,1,'Bắp rang bơ',1,30000.00),(2,1,'Nước ngọt',1,15000.00),(3,2,'Bắp rang bơ',1,30000.00),(4,2,'Nước ngọt',1,15000.00),(5,2,'Hotdog',1,40000.00),(6,3,'Bắp rang bơ',2,30000.00),(7,3,'Nước ngọt',2,15000.00),(8,3,'Bánh ngọt',1,30000.00);
/*!40000 ALTER TABLE `chi_tiet_combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_khau_tru_thang`
--

DROP TABLE IF EXISTS `chi_tiet_khau_tru_thang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_khau_tru_thang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `id_loai_khau_tru` int(11) NOT NULL,
  `so_lan` int(11) DEFAULT 0 COMMENT 'S? l?n (n?u t?nh theo l?n)',
  `so_gio` decimal(10,2) DEFAULT 0.00 COMMENT 'S? gi? (n?u t?nh theo gi?)',
  `so_tien` decimal(12,2) NOT NULL,
  `ghi_chu` varchar(500) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_bang_luong` (`id_bang_luong`),
  KEY `id_loai_khau_tru` (`id_loai_khau_tru`),
  CONSTRAINT `chi_tiet_khau_tru_thang_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_khau_tru_thang_ibfk_2` FOREIGN KEY (`id_loai_khau_tru`) REFERENCES `loai_khau_tru` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_khau_tru_thang`
--

LOCK TABLES `chi_tiet_khau_tru_thang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_khau_tru_thang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_khau_tru_thang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phu_cap_thang`
--

DROP TABLE IF EXISTS `chi_tiet_phu_cap_thang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chi_tiet_phu_cap_thang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `id_loai_phu_cap` int(11) NOT NULL,
  `so_tien` decimal(12,2) NOT NULL,
  `ghi_chu` varchar(500) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_bang_luong` (`id_bang_luong`),
  KEY `id_loai_phu_cap` (`id_loai_phu_cap`),
  CONSTRAINT `chi_tiet_phu_cap_thang_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chi_tiet_phu_cap_thang_ibfk_2` FOREIGN KEY (`id_loai_phu_cap`) REFERENCES `loai_phu_cap` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phu_cap_thang`
--

LOCK TABLES `chi_tiet_phu_cap_thang` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phu_cap_thang` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_phu_cap_thang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo`
--

DROP TABLE IF EXISTS `combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `combo` (
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo`
--

LOCK TABLES `combo` WRITE;
/*!40000 ALTER TABLE `combo` DISABLE KEYS */;
INSERT INTO `combo` VALUES (1,'Combo Standard','Bắp rang + Nước ngọt',45000.00,NULL,1,1,'2025-08-15 14:48:59'),(2,'Combo Premium','Bắp rang + Nước ngọt + Hotdog',85000.00,NULL,1,1,'2025-08-15 14:48:59'),(3,'Combo Family','2 Bắp rang + 2 Nước ngọt + 1 Bánh ngọt',120000.00,NULL,1,1,'2025-08-15 14:48:59'),(4,'Combo VIP','Bắp rang + Nước ngọt + Hotdog + Bánh ngọt + Kẹo',150000.00,'images/combo/combo_1764153912_6926da384b604.jpeg',1,1,'2025-08-15 14:48:59'),(6,'Cocacola','',20000.00,NULL,2,1,'2025-10-02 13:55:57'),(7,'Bắp rang bơ','',50000.00,'images/combo/combo_7_1761569372.jpg',1,1,'2025-10-02 13:57:21'),(8,'Combo VIP','Quá vip',50000.00,'images/combo/combo_1764611542_692dd5d636747.jpeg',7,1,'2025-12-01 17:52:22');
/*!40000 ALTER TABLE `combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_do_an`
--

DROP TABLE IF EXISTS `combo_do_an`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `combo_do_an` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_rap` int(11) DEFAULT NULL COMMENT 'ID rạp (NULL = áp dụng tất cả rạp)',
  `ten_combo` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `gia` decimal(10,2) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_combo_rap` (`id_rap`),
  CONSTRAINT `fk_combo_rap` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_do_an`
--

LOCK TABLES `combo_do_an` WRITE;
/*!40000 ALTER TABLE `combo_do_an` DISABLE KEYS */;
INSERT INTO `combo_do_an` VALUES (7,NULL,'Combo Tiết kiệm','Tiết kiệm 20%',99000.00,'1775577964810-437711645.jpg',1,'2025-10-02 13:57:21'),(8,NULL,'Combo Ký ức tuổi thơ','Ngon bổ rẻ',130000.00,'1775577897048-307812864.jpg',1,'2025-12-01 17:52:22'),(9,NULL,'Combo Độc thân','Cho người độc thân',69000.00,'1775579687402-374652319.webp',1,'2026-04-07 16:07:03'),(10,NULL,'Combo Cặp đôi','Dành cho các cặp đôi',120000.00,'1775578051608-556351981.webp',1,'2026-04-07 16:07:31'),(11,NULL,'Combo dành riêng U22','Chỉ dành riêng cho U22',129000.00,'1775578107000-795103680.webp',1,'2026-04-07 16:08:27');
/*!40000 ALTER TABLE `combo_do_an` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cong_them_gio`
--

DROP TABLE IF EXISTS `cong_them_gio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cong_them_gio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay` date NOT NULL,
  `so_gio` decimal(5,2) NOT NULL,
  `don_gia_them_gio` decimal(12,2) NOT NULL COMMENT 'Gi? c?ng th?m (th??ng 150% l??ng)',
  `trang_thai` enum('cho_duyet','duyet','da_thanh_toan') DEFAULT 'cho_duyet',
  `ghi_chu` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_rap` (`id_rap`),
  KEY `idx_nv_thang` (`id_nv`,`ngay`),
  CONSTRAINT `cong_them_gio_ibfk_1` FOREIGN KEY (`id_nv`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cong_them_gio_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong_them_gio`
--

LOCK TABLES `cong_them_gio` WRITE;
/*!40000 ALTER TABLE `cong_them_gio` DISABLE KEYS */;
/*!40000 ALTER TABLE `cong_them_gio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cum_rap`
--

DROP TABLE IF EXISTS `cum_rap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cum_rap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `dia_chi` text DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cum_rap`
--

LOCK TABLES `cum_rap` WRITE;
/*!40000 ALTER TABLE `cum_rap` DISABLE KEYS */;
/*!40000 ALTER TABLE `cum_rap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `don_nghi_phep`
--

DROP TABLE IF EXISTS `don_nghi_phep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `don_nghi_phep` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nhan_vien` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `tu_ngay` date NOT NULL,
  `den_ngay` date NOT NULL,
  `ly_do` varchar(255) NOT NULL,
  `trang_thai` enum('Chờ duyệt','Đã duyệt','Từ chối') DEFAULT 'Chờ duyệt',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nhan_vien` (`id_nhan_vien`),
  KEY `id_rap` (`id_rap`),
  CONSTRAINT `dnp_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `taikhoan` (`id`),
  CONSTRAINT `dnp_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_nghi_phep`
--

LOCK TABLES `don_nghi_phep` WRITE;
/*!40000 ALTER TABLE `don_nghi_phep` DISABLE KEYS */;
INSERT INTO `don_nghi_phep` VALUES (2,30,1,'2025-10-01','2025-10-05','Về quê cưới chồng','Đã duyệt','2025-09-04 07:33:45'),(3,30,1,'2025-09-11','2025-09-14','Bệnh','Từ chối','2025-09-04 08:04:17'),(4,34,1,'2025-09-22','2025-09-28','Về quê cưới vợ','Đã duyệt','2025-09-22 05:28:54'),(5,30,1,'2025-10-01','2025-10-05','Về quê cưới chồng','Từ chối','2025-10-02 07:09:19'),(6,30,1,'2025-11-21','2025-11-25','Về quê chống bão','Đã duyệt','2025-11-21 14:24:30'),(8,37,1,'2026-04-08','2026-04-10','té xe','Đã duyệt','2026-04-07 16:48:25'),(9,50,1,'2026-04-09','2026-04-10','gia đình','Đã duyệt','2026-04-08 00:43:21');
/*!40000 ALTER TABLE `don_nghi_phep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ghe_ngoi`
--

DROP TABLE IF EXISTS `ghe_ngoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ghe_ngoi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phong` int(11) NOT NULL,
  `ten_ghe` varchar(10) NOT NULL,
  `loai_ghe` enum('standard','vip','couple','disabled') DEFAULT 'standard',
  `gia_ghe` decimal(10,2) NOT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ghe_phong` (`id_phong`,`ten_ghe`),
  KEY `id_phong` (`id_phong`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ghe_ngoi`
--

LOCK TABLES `ghe_ngoi` WRITE;
/*!40000 ALTER TABLE `ghe_ngoi` DISABLE KEYS */;
INSERT INTO `ghe_ngoi` VALUES (1,1,'A1','standard',100000.00,1),(2,1,'A2','standard',100000.00,1),(3,1,'A3','standard',100000.00,1),(4,1,'A4','standard',100000.00,1),(5,1,'A5','standard',100000.00,1),(6,1,'B1','vip',150000.00,1),(7,1,'B2','vip',150000.00,1),(8,1,'B3','vip',150000.00,1),(9,1,'C1','couple',200000.00,1),(10,1,'C2','couple',200000.00,1);
/*!40000 ALTER TABLE `ghe_ngoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_thanh_vien`
--

DROP TABLE IF EXISTS `hang_thanh_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hang_thanh_vien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_hang` varchar(50) NOT NULL,
  `ten_hang` varchar(100) NOT NULL,
  `diem_toi_thieu` int(11) NOT NULL,
  `ti_le_tich_diem` decimal(5,2) NOT NULL COMMENT 'Nhân hệ số (VD: 1.5 = tích x1.5)',
  `ti_le_giam_gia` decimal(5,2) DEFAULT 0.00 COMMENT 'Giảm % khi đặt vé',
  `uu_dai_khac` text DEFAULT NULL COMMENT 'JSON ưu đãi khác',
  `mau_sac` varchar(7) DEFAULT '#999999',
  `thu_tu` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_hang` (`ma_hang`),
  KEY `idx_diem` (`diem_toi_thieu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_thanh_vien`
--

LOCK TABLES `hang_thanh_vien` WRITE;
/*!40000 ALTER TABLE `hang_thanh_vien` DISABLE KEYS */;
INSERT INTO `hang_thanh_vien` VALUES (1,'Dong','Đồng',0,1.00,0.00,NULL,'#CD7F32',1),(2,'Bac','Bạc',1000,1.20,5.00,NULL,'#C0C0C0',2),(3,'Vang','Vàng',5000,1.50,10.00,NULL,'#FFD700',3),(4,'Kim cuong','Kim Cương',15000,2.00,15.00,NULL,'#B9F2FF',4);
/*!40000 ALTER TABLE `hang_thanh_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don`
--

DROP TABLE IF EXISTS `hoa_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hoa_don` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ngay_tt` datetime NOT NULL,
  `trang_thai` int(1) DEFAULT 0,
  `thanh_tien` int(10) NOT NULL,
  `id_khuyen_mai` int(11) DEFAULT NULL,
  `tien_giam` decimal(10,2) DEFAULT 0.00,
  `thanh_toan_cuoi` decimal(10,2) DEFAULT 0.00,
  `phuong_thuc` varchar(50) DEFAULT 'ATM',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don`
--

LOCK TABLES `hoa_don` WRITE;
/*!40000 ALTER TABLE `hoa_don` DISABLE KEYS */;
INSERT INTO `hoa_don` VALUES (1,'2025-04-20 10:15:44',0,659000,NULL,0.00,0.00,'ATM'),(2,'2025-04-20 10:25:52',0,459000,NULL,0.00,0.00,'ATM'),(3,'2025-04-22 21:23:56',0,658000,NULL,0.00,0.00,'ATM'),(4,'2025-04-23 12:36:43',0,200000,NULL,0.00,0.00,'ATM'),(5,'2025-04-23 12:37:45',0,459000,NULL,0.00,0.00,'ATM'),(6,'2025-04-23 12:43:23',0,425000,NULL,0.00,0.00,'ATM'),(7,'2025-04-23 13:24:13',0,625000,NULL,0.00,0.00,'ATM'),(8,'2025-04-23 13:25:41',0,1346000,NULL,0.00,0.00,'ATM'),(9,'2025-04-23 13:26:51',0,859000,NULL,0.00,0.00,'ATM'),(10,'2025-04-23 13:31:10',0,399000,NULL,0.00,0.00,'ATM'),(11,'2025-04-25 17:57:38',0,425000,NULL,0.00,0.00,'ATM'),(12,'2025-05-04 13:06:49',0,100000,NULL,0.00,0.00,'ATM'),(13,'2025-05-25 21:31:39',0,459000,NULL,0.00,0.00,'ATM'),(14,'2025-05-26 18:33:03',0,459000,NULL,0.00,0.00,'ATM'),(15,'2025-05-26 19:24:37',0,100000,NULL,0.00,0.00,'ATM'),(16,'2025-05-26 19:30:05',0,359000,NULL,0.00,0.00,'ATM'),(17,'2025-05-26 20:46:23',0,559000,NULL,0.00,0.00,'ATM'),(18,'2025-05-26 21:08:55',0,1883000,NULL,0.00,0.00,'ATM'),(19,'2025-05-26 21:16:31',0,300000,NULL,0.00,0.00,'ATM'),(20,'2025-05-27 11:57:27',0,200000,NULL,0.00,0.00,'ATM'),(21,'2025-05-27 12:04:00',0,100000,NULL,0.00,0.00,'ATM'),(22,'2025-05-27 15:58:25',0,300000,NULL,0.00,0.00,'ATM'),(23,'2025-05-27 19:11:50',0,100000,NULL,0.00,0.00,'ATM'),(24,'2025-05-28 08:32:47',0,359000,NULL,0.00,0.00,'ATM'),(25,'2025-06-30 16:35:53',0,800000,NULL,0.00,0.00,'ATM'),(26,'2025-07-02 09:19:16',0,859000,NULL,0.00,0.00,'ATM'),(27,'2025-08-07 16:08:20',0,600000,NULL,0.00,0.00,'ATM'),(28,'2025-09-04 15:34:33',0,200000,NULL,0.00,0.00,'ATM'),(29,'2025-09-26 18:18:05',0,400000,NULL,0.00,0.00,'ATM'),(30,'2025-09-26 18:18:57',0,100000,NULL,0.00,0.00,'ATM'),(31,'2025-09-26 19:37:11',0,100000,NULL,0.00,0.00,'ATM'),(32,'2025-10-07 18:23:37',0,400000,NULL,0.00,0.00,'ATM'),(33,'2025-10-07 22:33:25',0,0,NULL,0.00,0.00,'ATM'),(34,'2025-10-09 13:44:29',0,200000,NULL,0.00,0.00,'ATM'),(35,'2025-10-09 13:54:48',0,245000,NULL,0.00,0.00,'ATM'),(36,'2025-10-09 13:58:48',0,320000,NULL,0.00,0.00,'ATM'),(37,'2025-10-09 14:07:23',0,445000,NULL,0.00,0.00,'ATM'),(38,'2025-10-09 14:09:53',0,520000,NULL,0.00,0.00,'ATM'),(39,'2025-10-09 14:18:05',0,245000,NULL,0.00,0.00,'ATM'),(40,'2025-10-09 16:42:37',0,320000,NULL,0.00,0.00,'ATM'),(41,'2025-10-17 10:39:01',0,520000,NULL,0.00,0.00,'ATM'),(42,'2025-10-24 23:45:20',0,105000,NULL,0.00,0.00,'ATM'),(43,'2025-10-24 23:46:28',0,300000,NULL,0.00,0.00,'ATM'),(44,'2025-10-24 23:48:47',0,260000,NULL,0.00,0.00,'ATM'),(45,'2025-10-24 23:57:22',0,465000,NULL,0.00,0.00,'ATM'),(46,'2025-10-25 00:04:39',0,1550000,NULL,0.00,0.00,'ATM'),(47,'2025-10-25 21:53:49',0,370000,NULL,0.00,0.00,'ATM'),(48,'2025-10-25 22:02:39',0,1316000,NULL,0.00,0.00,'ATM'),(49,'2025-10-25 22:06:55',0,1600000,NULL,0.00,0.00,'ATM'),(50,'2025-10-25 22:16:30',0,1280000,NULL,0.00,0.00,'ATM'),(51,'2025-10-25 22:18:21',0,1020000,NULL,0.00,0.00,'ATM'),(52,'2025-10-26 09:36:42',0,1316000,NULL,0.00,0.00,'ATM'),(53,'2025-10-26 10:42:18',0,1600000,NULL,0.00,0.00,'ATM'),(54,'2025-10-26 10:46:44',1,1376000,NULL,0.00,0.00,'ATM'),(55,'2025-10-26 10:50:25',1,640000,NULL,0.00,0.00,'ATM'),(56,'2025-10-27 19:56:42',0,960000,NULL,0.00,0.00,'ATM'),(57,'2025-10-27 20:00:56',0,960000,NULL,0.00,0.00,'ATM'),(58,'2025-10-27 20:01:36',0,960000,NULL,0.00,0.00,'ATM'),(59,'2025-10-27 20:04:19',0,1850000,NULL,0.00,0.00,'ATM'),(60,'2025-10-27 20:04:31',0,1850000,NULL,0.00,0.00,'ATM'),(61,'2025-10-27 20:06:23',0,1850000,NULL,0.00,0.00,'ATM'),(62,'2025-10-27 20:06:39',0,1850000,NULL,0.00,0.00,'ATM'),(63,'2025-10-27 20:14:53',1,1850000,NULL,0.00,0.00,'ATM'),(64,'2025-10-27 20:36:21',1,1690000,NULL,0.00,0.00,'ATM'),(65,'2025-10-27 20:45:37',1,430000,NULL,0.00,0.00,'ATM'),(66,'2025-10-27 20:54:04',1,805000,NULL,0.00,0.00,'ATM'),(67,'2025-10-28 10:22:15',1,600000,NULL,0.00,0.00,'ATM'),(68,'2025-10-28 10:24:35',1,390000,NULL,0.00,0.00,'ATM'),(69,'2025-11-01 07:48:07',1,450000,NULL,0.00,0.00,'ATM'),(70,'2025-11-01 22:26:57',1,1568000,NULL,0.00,0.00,'ATM'),(71,'2025-11-12 15:29:42',1,240000,NULL,0.00,0.00,'ATM'),(72,'2025-11-20 21:20:26',1,300000,NULL,0.00,0.00,'ATM'),(73,'2025-11-20 23:41:33',1,200000,NULL,0.00,0.00,'ATM'),(74,'2025-11-21 00:18:53',1,750000,NULL,0.00,0.00,'ATM'),(75,'2025-11-21 13:54:03',1,550000,NULL,0.00,0.00,'ATM'),(80,'2026-04-07 14:17:01',1,200000,NULL,0.00,0.00,'ATM'),(81,'2026-04-07 14:19:25',1,130000,NULL,0.00,0.00,'ATM'),(82,'2026-04-07 14:26:08',1,310000,NULL,0.00,0.00,'Momo'),(83,'2026-04-07 14:31:51',1,260000,NULL,0.00,0.00,'Visa'),(84,'2026-04-07 14:59:39',1,260000,NULL,0.00,0.00,'ATM'),(85,'2026-04-07 15:05:22',1,230000,NULL,0.00,0.00,'ATM'),(86,'2026-04-07 15:12:31',1,195000,NULL,0.00,0.00,'Momo'),(87,'2026-04-07 15:14:39',1,180000,NULL,0.00,0.00,'Momo'),(88,'2026-04-07 15:15:58',1,245000,NULL,0.00,0.00,'Momo'),(89,'2026-04-07 15:28:46',1,180000,NULL,0.00,0.00,'Momo'),(90,'2026-04-07 17:27:45',1,139000,NULL,0.00,0.00,'Momo'),(91,'2026-04-07 18:14:04',1,111600,NULL,0.00,0.00,'Momo'),(92,'2026-04-07 18:17:35',1,148750,NULL,0.00,0.00,'Momo'),(93,'2026-04-07 18:19:41',1,240000,NULL,0.00,0.00,'ATM'),(94,'2026-04-07 18:28:01',1,179000,NULL,0.00,0.00,'ATM'),(95,'2026-05-04 13:36:54',1,230000,NULL,0.00,0.00,'Momo');
/*!40000 ALTER TABLE `hoa_don` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khung_gio_chieu`
--

DROP TABLE IF EXISTS `khung_gio_chieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `khung_gio_chieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_lich_chieu` int(11) NOT NULL,
  `id_phong` int(11) NOT NULL,
  `thoi_gian_chieu` time NOT NULL,
  `gia_ve` int(11) DEFAULT 55000,
  PRIMARY KEY (`id`),
  KEY `id_lich_chieu` (`id_lich_chieu`),
  KEY `id_phong` (`id_phong`)
) ENGINE=InnoDB AUTO_INCREMENT=5958 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khung_gio_chieu`
--

LOCK TABLES `khung_gio_chieu` WRITE;
/*!40000 ALTER TABLE `khung_gio_chieu` DISABLE KEYS */;
INSERT INTO `khung_gio_chieu` VALUES (101,74,1,'17:00:00',55000),(102,75,1,'17:12:00',55000),(103,75,2,'18:12:00',55000),(104,161,1,'12:00:00',55000),(105,161,2,'15:00:00',55000),(106,162,1,'12:00:00',55000),(107,162,2,'15:00:00',55000),(108,163,1,'12:00:00',55000),(109,163,2,'15:00:00',55000),(110,164,1,'12:00:00',55000),(111,164,2,'15:00:00',55000),(112,165,1,'12:00:00',55000),(113,165,2,'15:00:00',55000),(114,166,1,'12:00:00',55000),(115,166,2,'15:00:00',55000),(116,167,1,'12:00:00',55000),(117,167,2,'15:00:00',55000),(118,168,1,'12:00:00',55000),(119,168,2,'15:00:00',55000),(120,169,1,'12:00:00',55000),(121,169,2,'15:00:00',55000),(122,170,1,'12:00:00',55000),(123,170,2,'15:00:00',55000),(124,171,1,'12:00:00',55000),(125,171,2,'15:00:00',55000),(126,172,1,'12:00:00',55000),(127,172,2,'15:00:00',55000),(128,173,1,'12:00:00',55000),(129,173,2,'15:00:00',55000),(130,174,1,'12:00:00',55000),(131,174,2,'15:00:00',55000),(132,175,1,'12:00:00',55000),(133,175,2,'15:00:00',55000),(134,176,1,'12:00:00',55000),(135,176,2,'15:00:00',55000),(136,177,1,'10:00:00',55000),(137,178,1,'10:00:00',55000),(138,179,1,'10:00:00',55000),(139,180,1,'18:00:00',55000),(140,180,1,'20:00:00',55000),(141,181,1,'18:00:00',55000),(142,181,1,'20:00:00',55000),(143,182,1,'18:00:00',55000),(144,182,1,'20:00:00',55000),(145,183,1,'18:00:00',55000),(146,183,1,'20:00:00',55000),(147,184,1,'18:00:00',55000),(148,184,1,'20:00:00',55000),(149,185,1,'18:00:00',55000),(150,185,1,'20:00:00',55000),(151,186,1,'18:00:00',55000),(152,186,1,'20:00:00',55000),(153,187,1,'18:00:00',55000),(154,187,1,'20:00:00',55000),(155,188,1,'18:00:00',55000),(156,188,1,'20:00:00',55000),(157,189,1,'18:00:00',55000),(158,189,1,'20:00:00',55000),(159,190,1,'18:00:00',55000),(160,190,1,'20:00:00',55000),(161,191,1,'18:00:00',55000),(162,191,1,'20:00:00',55000),(163,192,1,'18:00:00',55000),(164,192,1,'20:00:00',55000),(165,193,1,'18:00:00',55000),(166,193,1,'20:00:00',55000),(167,194,1,'18:00:00',55000),(168,194,1,'20:00:00',55000),(169,195,1,'19:00:00',55000),(170,196,1,'19:00:00',55000),(171,197,1,'19:00:00',55000),(172,198,1,'19:00:00',55000),(173,199,1,'19:00:00',55000),(174,199,1,'22:00:00',55000),(175,200,1,'19:00:00',55000),(176,200,1,'22:00:00',55000),(177,201,1,'19:00:00',55000),(178,201,1,'22:00:00',55000),(179,202,1,'19:00:00',55000),(180,202,1,'22:00:00',55000),(199,216,1,'19:00:00',55000),(200,217,1,'19:00:00',55000),(201,218,1,'19:00:00',55000),(202,219,1,'19:00:00',55000),(203,220,2,'19:00:00',55000),(204,221,1,'22:00:00',55000),(205,222,1,'19:00:00',55000),(206,222,1,'22:00:00',55000),(207,223,1,'19:00:00',55000),(208,223,1,'22:00:00',55000),(209,224,1,'19:00:00',55000),(210,224,1,'22:00:00',55000),(211,225,1,'22:00:00',55000),(212,225,1,'23:00:00',55000),(213,226,1,'22:00:00',55000),(214,226,1,'23:00:00',55000),(215,227,1,'22:00:00',55000),(216,227,1,'23:00:00',55000),(217,228,2,'22:00:00',55000),(218,229,2,'22:00:00',55000),(219,230,2,'22:00:00',55000),(220,231,2,'22:00:00',55000),(221,232,1,'12:00:00',55000),(228,236,16,'23:30:00',55000),(229,237,16,'23:30:00',55000),(230,238,16,'23:30:00',55000),(231,239,16,'22:00:00',55000),(232,240,16,'22:00:00',55000),(233,241,16,'22:00:00',55000),(234,242,16,'22:00:00',55000),(235,243,16,'22:00:00',55000),(247,250,1,'19:00:00',55000),(248,251,1,'19:00:00',55000),(249,252,1,'19:00:00',55000),(250,253,1,'19:00:00',55000),(251,254,1,'19:00:00',55000),(252,255,1,'12:00:00',55000),(253,256,1,'12:00:00',55000),(254,257,1,'12:00:00',55000),(255,258,1,'12:00:00',55000),(256,259,1,'12:00:00',55000),(257,260,1,'19:00:00',55000),(258,260,1,'22:00:00',55000),(259,261,1,'19:00:00',55000),(260,261,1,'22:00:00',55000),(261,262,1,'19:00:00',55000),(262,262,1,'22:00:00',55000),(263,263,1,'19:00:00',55000),(264,263,1,'22:00:00',55000),(265,264,1,'19:00:00',55000),(266,264,1,'22:00:00',55000),(267,265,1,'19:00:00',55000),(268,265,1,'22:00:00',55000),(269,266,1,'19:00:00',55000),(270,266,1,'22:00:00',55000),(271,267,1,'19:00:00',55000),(272,267,1,'22:00:00',55000),(273,268,1,'19:00:00',55000),(274,268,1,'22:00:00',55000),(275,269,1,'19:00:00',55000),(276,269,1,'22:00:00',55000),(277,270,1,'19:00:00',55000),(278,270,27,'20:00:00',55000),(279,271,1,'19:00:00',55000),(280,271,27,'20:00:00',55000),(281,272,1,'19:00:00',55000),(282,272,27,'20:00:00',55000),(283,273,1,'19:00:00',55000),(284,273,27,'20:00:00',55000),(285,274,1,'19:00:00',55000),(286,274,27,'20:00:00',55000),(287,275,1,'19:00:00',55000),(288,275,27,'20:00:00',55000),(289,276,1,'19:00:00',55000),(290,276,27,'20:00:00',55000),(291,277,1,'19:00:00',55000),(292,277,27,'20:00:00',55000),(293,278,1,'19:00:00',55000),(294,278,27,'20:00:00',55000),(295,279,1,'19:00:00',55000),(296,279,27,'20:00:00',55000),(297,280,1,'19:00:00',55000),(298,280,27,'20:00:00',55000),(299,281,1,'19:00:00',55000),(300,281,27,'20:00:00',55000),(301,282,1,'19:00:00',55000),(302,282,27,'20:00:00',55000),(303,283,1,'19:00:00',55000),(304,283,27,'20:00:00',55000),(305,284,1,'19:00:00',55000),(306,284,27,'20:00:00',55000),(307,285,1,'19:00:00',55000),(308,285,27,'20:00:00',55000),(309,286,1,'19:00:00',55000),(310,286,27,'20:00:00',55000),(311,287,1,'19:00:00',55000),(312,287,27,'20:00:00',55000),(313,288,1,'19:00:00',55000),(314,288,27,'20:00:00',55000),(315,289,1,'19:00:00',55000),(316,289,27,'20:00:00',55000),(317,290,1,'19:00:00',55000),(318,290,27,'20:00:00',55000),(319,291,1,'19:00:00',55000),(320,291,27,'20:00:00',55000),(321,292,1,'19:00:00',55000),(322,292,27,'20:00:00',55000),(323,293,1,'19:00:00',55000),(324,293,27,'20:00:00',55000),(325,294,1,'19:00:00',55000),(326,294,27,'20:00:00',55000),(327,295,1,'19:00:00',55000),(328,295,27,'20:00:00',55000),(329,296,1,'19:00:00',55000),(330,296,27,'20:00:00',55000),(331,297,1,'19:00:00',55000),(332,297,27,'20:00:00',55000),(333,298,1,'19:00:00',55000),(334,298,27,'20:00:00',55000),(335,299,1,'19:00:00',55000),(336,299,27,'20:00:00',55000),(337,300,1,'19:00:00',55000),(338,300,27,'20:00:00',55000),(339,301,1,'18:00:00',55000),(340,302,1,'18:00:00',55000),(341,303,1,'18:00:00',55000),(342,304,1,'18:00:00',55000),(343,305,1,'18:00:00',55000),(344,306,1,'18:00:00',55000),(345,307,1,'18:00:00',55000),(346,308,16,'20:00:00',55000),(347,308,18,'22:00:00',55000),(348,309,16,'20:00:00',55000),(349,309,18,'22:00:00',55000),(350,310,16,'20:00:00',55000),(351,310,18,'22:00:00',55000),(352,311,16,'20:00:00',55000),(353,311,18,'22:00:00',55000),(354,312,16,'20:00:00',55000),(355,312,18,'22:00:00',55000),(356,313,16,'20:00:00',55000),(357,313,18,'22:00:00',55000),(358,314,16,'20:00:00',55000),(359,314,18,'22:00:00',55000),(360,315,16,'20:00:00',55000),(361,315,18,'22:00:00',55000),(362,316,16,'20:00:00',55000),(363,316,18,'22:00:00',55000),(364,317,16,'20:00:00',55000),(365,317,18,'22:00:00',55000),(366,318,16,'20:00:00',55000),(367,319,16,'20:00:00',55000),(368,320,16,'20:00:00',55000),(369,321,16,'20:00:00',55000),(370,322,16,'20:00:00',55000),(371,323,16,'20:00:00',55000),(372,324,16,'20:00:00',55000),(373,325,16,'20:00:00',55000),(374,326,16,'20:00:00',55000),(375,327,16,'20:00:00',55000),(376,328,16,'22:00:00',55000),(377,329,16,'22:00:00',55000),(378,330,16,'22:00:00',55000),(379,331,16,'22:00:00',55000),(380,332,1,'12:00:00',55000),(381,333,1,'12:00:00',55000),(382,334,1,'12:00:00',55000),(383,335,1,'12:00:00',55000),(384,336,1,'12:00:00',55000),(385,337,1,'12:00:00',55000),(386,338,1,'12:00:00',55000),(496,382,1,'12:00:00',55000),(497,382,1,'15:00:00',55000),(498,382,1,'17:00:00',55000),(499,382,1,'20:00:00',55000),(500,382,1,'22:00:00',55000),(501,383,1,'12:00:00',55000),(502,383,1,'15:00:00',55000),(503,383,1,'17:00:00',55000),(504,383,1,'20:00:00',55000),(505,383,1,'22:00:00',55000),(506,384,1,'12:00:00',55000),(507,384,1,'15:00:00',55000),(508,384,1,'17:00:00',55000),(509,384,1,'20:00:00',55000),(510,384,1,'22:00:00',55000),(511,385,1,'12:00:00',55000),(512,385,1,'15:00:00',55000),(513,385,1,'17:00:00',55000),(514,385,1,'20:00:00',55000),(515,385,1,'22:00:00',55000),(516,386,1,'12:00:00',55000),(517,386,1,'15:00:00',55000),(518,386,1,'17:00:00',55000),(519,386,1,'20:00:00',55000),(520,386,1,'22:00:00',55000),(521,387,1,'12:00:00',55000),(522,387,1,'15:00:00',55000),(523,387,1,'17:00:00',55000),(524,387,1,'20:00:00',55000),(525,387,1,'22:00:00',55000),(526,388,1,'12:00:00',55000),(527,388,1,'15:00:00',55000),(528,388,1,'17:00:00',55000),(529,388,1,'20:00:00',55000),(530,388,1,'22:00:00',55000),(531,389,1,'12:00:00',55000),(532,389,1,'15:00:00',55000),(533,389,1,'17:00:00',55000),(534,389,1,'20:00:00',55000),(535,389,1,'22:00:00',55000),(536,390,1,'12:00:00',55000),(537,390,1,'15:00:00',55000),(538,390,1,'17:00:00',55000),(539,390,1,'20:00:00',55000),(540,390,1,'22:00:00',55000),(541,391,1,'12:00:00',55000),(542,391,1,'15:00:00',55000),(543,391,1,'17:00:00',55000),(544,391,1,'20:00:00',55000),(545,391,1,'22:00:00',55000),(546,392,1,'12:00:00',55000),(547,392,1,'15:00:00',55000),(548,392,1,'17:00:00',55000),(549,392,1,'20:00:00',55000),(550,392,1,'22:00:00',55000),(551,393,1,'12:00:00',55000),(552,393,1,'15:00:00',55000),(553,393,1,'17:00:00',55000),(554,393,1,'20:00:00',55000),(555,393,1,'22:00:00',55000),(556,394,1,'12:00:00',55000),(557,394,1,'15:00:00',55000),(558,394,1,'17:00:00',55000),(559,394,1,'20:00:00',55000),(560,394,1,'22:00:00',55000),(561,395,1,'12:00:00',55000),(562,395,1,'15:00:00',55000),(563,395,1,'17:00:00',55000),(564,395,1,'20:00:00',55000),(565,395,1,'22:00:00',55000),(566,396,1,'12:00:00',55000),(567,396,1,'15:00:00',55000),(568,396,1,'17:00:00',55000),(569,396,1,'20:00:00',55000),(570,396,1,'22:00:00',55000),(571,397,1,'12:00:00',55000),(572,397,1,'15:00:00',55000),(573,397,1,'17:00:00',55000),(574,397,1,'20:00:00',55000),(575,397,1,'22:00:00',55000),(576,398,1,'12:00:00',55000),(577,398,1,'15:00:00',55000),(578,398,1,'17:00:00',55000),(579,398,1,'20:00:00',55000),(580,398,1,'22:00:00',55000),(581,399,1,'12:00:00',55000),(582,399,1,'15:00:00',55000),(583,399,1,'17:00:00',55000),(584,399,1,'20:00:00',55000),(585,399,1,'22:00:00',55000),(586,400,1,'12:00:00',55000),(587,400,1,'15:00:00',55000),(588,400,1,'17:00:00',55000),(589,400,1,'20:00:00',55000),(590,400,1,'22:00:00',55000),(591,401,1,'12:00:00',55000),(592,401,1,'15:00:00',55000),(593,401,1,'17:00:00',55000),(594,401,1,'20:00:00',55000),(595,401,1,'22:00:00',55000),(596,402,1,'12:00:00',55000),(597,402,1,'15:00:00',55000),(598,402,1,'17:00:00',55000),(599,402,1,'20:00:00',55000),(600,402,1,'22:00:00',55000),(601,403,1,'12:00:00',55000),(602,403,1,'15:00:00',55000),(603,403,1,'17:00:00',55000),(604,403,1,'20:00:00',55000),(605,403,1,'22:00:00',55000),(606,404,1,'20:00:00',55000),(607,404,1,'22:00:00',55000),(608,405,1,'20:00:00',55000),(609,405,1,'22:00:00',55000),(610,406,1,'20:00:00',55000),(611,406,1,'22:00:00',55000),(612,407,1,'20:00:00',55000),(613,407,1,'22:00:00',55000),(614,408,1,'20:00:00',55000),(615,408,1,'22:00:00',55000),(616,409,1,'20:00:00',55000),(617,409,1,'22:00:00',55000),(618,410,1,'20:00:00',55000),(619,410,1,'22:00:00',55000),(620,411,1,'20:00:00',55000),(621,411,1,'22:00:00',55000),(622,412,1,'20:00:00',55000),(623,412,1,'22:00:00',55000),(624,413,1,'20:00:00',55000),(625,413,1,'22:00:00',55000),(626,414,1,'20:00:00',55000),(627,414,1,'22:00:00',55000),(628,415,1,'20:00:00',55000),(629,415,1,'22:00:00',55000),(630,416,1,'20:00:00',55000),(631,416,1,'22:00:00',55000),(632,417,1,'20:00:00',55000),(633,417,1,'22:00:00',55000),(634,418,1,'20:00:00',55000),(635,418,1,'22:00:00',55000),(636,419,1,'20:00:00',55000),(637,419,1,'22:00:00',55000),(638,420,1,'20:00:00',55000),(639,420,1,'22:00:00',55000),(640,421,1,'20:00:00',55000),(641,421,1,'22:00:00',55000),(642,422,1,'20:00:00',55000),(643,422,1,'22:00:00',55000),(644,423,1,'20:00:00',55000),(645,423,1,'22:00:00',55000),(646,424,1,'20:00:00',55000),(647,424,1,'22:00:00',55000),(648,425,1,'20:00:00',55000),(649,425,1,'22:00:00',55000),(650,426,1,'20:00:00',55000),(651,426,1,'22:00:00',55000),(652,427,1,'20:00:00',55000),(653,427,1,'22:00:00',55000),(654,428,1,'20:00:00',55000),(655,428,1,'22:00:00',55000),(656,429,1,'20:00:00',55000),(657,429,1,'22:00:00',55000),(658,430,1,'20:00:00',55000),(659,430,1,'22:00:00',55000),(660,431,1,'20:00:00',55000),(661,431,1,'22:00:00',55000),(662,432,1,'20:00:00',55000),(663,432,1,'22:00:00',55000),(664,433,1,'20:00:00',55000),(665,433,1,'22:00:00',55000),(666,434,28,'12:00:00',55000),(667,435,28,'12:00:00',55000),(668,436,28,'12:00:00',55000),(669,437,28,'12:00:00',55000),(670,438,28,'12:00:00',55000),(671,439,28,'22:00:00',55000),(672,440,28,'22:00:00',55000),(673,441,28,'22:00:00',55000),(674,442,28,'22:00:00',55000),(675,443,28,'22:00:00',55000),(676,444,18,'20:00:00',55000),(677,444,18,'22:00:00',55000),(678,445,18,'20:00:00',55000),(679,445,18,'22:00:00',55000),(680,446,18,'20:00:00',55000),(681,446,18,'22:00:00',55000),(682,447,18,'20:00:00',55000),(683,447,18,'22:00:00',55000),(684,448,18,'20:00:00',55000),(685,448,18,'22:00:00',55000),(686,449,18,'20:00:00',55000),(687,449,18,'22:00:00',55000),(688,450,18,'20:00:00',55000),(689,450,18,'22:00:00',55000),(690,451,18,'20:00:00',55000),(691,451,18,'22:00:00',55000),(692,452,18,'20:00:00',55000),(693,452,18,'22:00:00',55000),(694,453,18,'20:00:00',55000),(695,453,18,'22:00:00',55000),(696,454,18,'20:00:00',55000),(697,454,18,'22:00:00',55000),(698,455,18,'20:00:00',55000),(699,455,18,'22:00:00',55000),(700,456,18,'20:00:00',55000),(701,456,18,'22:00:00',55000),(702,457,18,'20:00:00',55000),(703,457,18,'22:00:00',55000),(704,458,18,'20:00:00',55000),(705,458,18,'22:00:00',55000),(706,459,18,'20:00:00',55000),(707,459,18,'22:00:00',55000),(708,460,18,'20:00:00',55000),(709,460,18,'22:00:00',55000),(710,461,18,'20:00:00',55000),(711,461,18,'22:00:00',55000),(712,462,18,'20:00:00',55000),(713,462,18,'22:00:00',55000),(714,463,18,'20:00:00',55000),(715,463,18,'22:00:00',55000),(716,464,18,'20:00:00',55000),(717,464,18,'22:00:00',55000),(718,465,29,'17:00:00',55000),(719,465,29,'19:00:00',55000),(720,465,29,'21:00:00',55000),(721,465,29,'23:00:00',55000),(722,466,29,'17:00:00',55000),(723,466,29,'19:00:00',55000),(724,466,29,'21:00:00',55000),(725,466,29,'23:00:00',55000),(726,467,29,'17:00:00',55000),(727,467,29,'19:00:00',55000),(728,467,29,'21:00:00',55000),(729,467,29,'23:00:00',55000),(730,468,29,'17:00:00',55000),(731,468,29,'19:00:00',55000),(732,468,29,'21:00:00',55000),(733,468,29,'23:00:00',55000),(734,469,29,'17:00:00',55000),(735,469,29,'19:00:00',55000),(736,469,29,'21:00:00',55000),(737,469,29,'23:00:00',55000),(738,470,29,'17:00:00',55000),(739,470,29,'19:00:00',55000),(740,470,29,'21:00:00',55000),(741,470,29,'23:00:00',55000),(742,471,29,'17:00:00',55000),(743,471,29,'19:00:00',55000),(744,471,29,'21:00:00',55000),(745,471,29,'23:00:00',55000),(746,472,29,'17:00:00',55000),(747,472,29,'19:00:00',55000),(748,472,29,'21:00:00',55000),(749,472,29,'23:00:00',55000),(750,473,29,'17:00:00',55000),(751,473,29,'19:00:00',55000),(752,473,29,'21:00:00',55000),(753,473,29,'23:00:00',55000),(754,474,29,'17:00:00',55000),(755,474,29,'19:00:00',55000),(756,474,29,'21:00:00',55000),(757,474,29,'23:00:00',55000),(758,475,29,'17:00:00',55000),(759,475,29,'19:00:00',55000),(760,475,29,'21:00:00',55000),(761,475,29,'23:00:00',55000),(762,476,29,'17:00:00',55000),(763,476,29,'19:00:00',55000),(764,476,29,'21:00:00',55000),(765,476,29,'23:00:00',55000),(766,477,29,'17:00:00',55000),(767,477,29,'19:00:00',55000),(768,477,29,'21:00:00',55000),(769,477,29,'23:00:00',55000),(770,478,29,'17:00:00',55000),(771,478,29,'19:00:00',55000),(772,478,29,'21:00:00',55000),(773,478,29,'23:00:00',55000),(774,479,29,'17:00:00',55000),(775,479,29,'19:00:00',55000),(776,479,29,'21:00:00',55000),(777,479,29,'23:00:00',55000),(778,480,29,'17:00:00',55000),(779,480,29,'19:00:00',55000),(780,480,29,'21:00:00',55000),(781,480,29,'23:00:00',55000),(782,481,29,'17:00:00',55000),(783,481,29,'19:00:00',55000),(784,481,29,'21:00:00',55000),(785,481,29,'23:00:00',55000),(786,482,29,'17:00:00',55000),(787,482,29,'19:00:00',55000),(788,482,29,'21:00:00',55000),(789,482,29,'23:00:00',55000),(790,483,29,'17:00:00',55000),(791,483,29,'19:00:00',55000),(792,483,29,'21:00:00',55000),(793,483,29,'23:00:00',55000),(794,484,29,'17:00:00',55000),(795,484,29,'19:00:00',55000),(796,484,29,'21:00:00',55000),(797,484,29,'23:00:00',55000),(798,485,29,'17:00:00',55000),(799,485,29,'19:00:00',55000),(800,485,29,'21:00:00',55000),(801,485,29,'23:00:00',55000),(802,486,1,'18:00:00',55000),(803,486,1,'22:00:00',55000),(804,487,1,'18:00:00',55000),(805,487,1,'22:00:00',55000),(806,488,1,'18:00:00',55000),(807,488,1,'22:00:00',55000),(808,489,1,'18:00:00',55000),(809,489,1,'22:00:00',55000),(810,490,1,'18:00:00',55000),(811,490,1,'22:00:00',55000),(812,491,1,'18:00:00',55000),(813,491,1,'22:00:00',55000),(814,492,1,'18:00:00',55000),(815,492,1,'22:00:00',55000),(816,493,1,'18:00:00',55000),(817,493,1,'22:00:00',55000),(818,494,1,'18:00:00',55000),(819,494,1,'22:00:00',55000),(820,495,1,'18:00:00',55000),(821,495,1,'22:00:00',55000),(822,496,1,'18:00:00',55000),(823,496,1,'22:00:00',55000),(824,497,1,'18:00:00',55000),(825,497,1,'22:00:00',55000),(826,498,1,'18:00:00',55000),(827,498,1,'22:00:00',55000),(828,499,1,'18:00:00',55000),(829,499,1,'22:00:00',55000),(830,500,1,'18:00:00',55000),(831,500,1,'22:00:00',55000),(832,501,1,'18:00:00',55000),(833,501,1,'22:00:00',55000),(834,502,1,'18:00:00',55000),(835,502,1,'22:00:00',55000),(836,503,1,'18:00:00',55000),(837,503,1,'22:00:00',55000),(838,504,1,'18:00:00',55000),(839,504,1,'22:00:00',55000),(840,505,1,'18:00:00',55000),(841,505,1,'22:00:00',55000),(842,506,1,'18:00:00',55000),(843,506,1,'22:00:00',55000),(844,507,1,'18:00:00',55000),(845,507,1,'22:00:00',55000),(846,508,1,'18:00:00',55000),(847,508,1,'22:00:00',55000),(848,509,1,'18:00:00',55000),(849,509,1,'22:00:00',55000),(850,510,1,'18:00:00',55000),(851,510,1,'22:00:00',55000),(852,511,1,'18:00:00',55000),(853,511,1,'22:00:00',55000),(854,512,28,'22:00:00',55000),(855,513,28,'22:00:00',55000),(856,514,28,'22:00:00',55000),(857,515,28,'22:00:00',55000),(858,516,28,'22:00:00',55000),(859,517,28,'22:00:00',55000),(860,518,28,'22:00:00',55000),(861,519,28,'22:00:00',55000),(862,520,28,'22:00:00',55000),(863,521,28,'22:00:00',55000),(864,522,28,'22:00:00',55000),(865,523,28,'22:00:00',55000),(866,524,28,'22:00:00',55000),(867,525,28,'22:00:00',55000),(868,526,28,'22:00:00',55000),(869,527,28,'22:00:00',55000),(870,528,28,'22:00:00',55000),(871,529,28,'22:00:00',55000),(872,530,28,'22:00:00',55000),(873,531,28,'22:00:00',55000),(874,532,28,'22:00:00',55000),(875,533,28,'22:00:00',55000),(876,534,28,'22:00:00',55000),(877,535,28,'22:00:00',55000),(878,536,28,'22:00:00',55000),(879,537,16,'16:00:00',55000),(880,537,16,'17:00:00',55000),(881,538,16,'16:00:00',55000),(882,538,16,'17:00:00',55000),(883,539,16,'16:00:00',55000),(884,539,16,'17:00:00',55000),(885,540,16,'16:00:00',55000),(886,540,16,'17:00:00',55000),(887,541,16,'16:00:00',55000),(888,541,16,'17:00:00',55000),(889,542,16,'16:00:00',55000),(890,542,16,'17:00:00',55000),(891,543,16,'16:00:00',55000),(892,543,16,'17:00:00',55000),(893,544,16,'16:00:00',55000),(894,544,16,'17:00:00',55000),(895,545,16,'16:00:00',55000),(896,545,16,'17:00:00',55000),(897,546,16,'16:00:00',55000),(898,546,16,'17:00:00',55000),(899,547,16,'16:00:00',55000),(900,547,16,'17:00:00',55000),(901,548,16,'16:00:00',55000),(902,548,16,'17:00:00',55000),(903,549,16,'16:00:00',55000),(904,549,16,'17:00:00',55000),(905,550,16,'16:00:00',55000),(906,550,16,'17:00:00',55000),(907,551,16,'16:00:00',55000),(908,551,16,'17:00:00',55000),(909,552,16,'16:00:00',55000),(910,552,16,'17:00:00',55000),(911,553,16,'16:00:00',55000),(912,553,16,'17:00:00',55000),(913,554,16,'16:00:00',55000),(914,554,16,'17:00:00',55000),(915,555,16,'16:00:00',55000),(916,555,16,'17:00:00',55000),(917,556,16,'16:00:00',55000),(918,556,16,'17:00:00',55000),(919,557,16,'16:00:00',55000),(920,557,16,'17:00:00',55000),(921,558,16,'16:00:00',55000),(922,558,16,'17:00:00',55000),(923,559,16,'16:00:00',55000),(924,559,16,'17:00:00',55000),(925,560,29,'22:00:00',55000),(926,560,29,'00:00:00',55000),(927,561,29,'22:00:00',55000),(928,561,29,'00:00:00',55000),(929,562,29,'22:00:00',55000),(930,562,29,'00:00:00',55000),(931,563,29,'22:00:00',55000),(932,563,29,'00:00:00',55000),(933,564,29,'22:00:00',55000),(934,564,29,'00:00:00',55000),(935,565,29,'22:00:00',55000),(936,565,29,'00:00:00',55000),(937,566,29,'22:00:00',55000),(938,566,29,'00:00:00',55000),(939,567,29,'22:00:00',55000),(940,567,29,'00:00:00',55000),(941,568,29,'22:00:00',55000),(942,568,29,'00:00:00',55000),(943,569,29,'22:00:00',55000),(944,569,29,'00:00:00',55000),(945,570,29,'22:00:00',55000),(946,570,29,'00:00:00',55000),(947,571,29,'22:00:00',55000),(948,571,29,'00:00:00',55000),(949,572,29,'22:00:00',55000),(950,572,29,'00:00:00',55000),(951,573,29,'22:00:00',55000),(952,573,29,'00:00:00',55000),(953,574,29,'22:00:00',55000),(954,574,29,'00:00:00',55000),(955,575,29,'22:00:00',55000),(956,575,29,'00:00:00',55000),(957,576,29,'22:00:00',55000),(958,576,29,'00:00:00',55000),(959,577,29,'22:00:00',55000),(960,577,29,'00:00:00',55000),(961,578,29,'22:00:00',55000),(962,578,29,'00:00:00',55000),(963,579,29,'22:00:00',55000),(964,579,29,'00:00:00',55000),(965,580,29,'22:00:00',55000),(966,580,29,'00:00:00',55000),(967,581,1,'22:00:00',55000),(968,581,2,'23:00:00',55000),(969,581,1,'23:00:00',55000),(970,582,1,'22:00:00',55000),(971,582,2,'23:00:00',55000),(972,582,1,'23:00:00',55000),(973,583,1,'22:00:00',55000),(974,583,2,'23:00:00',55000),(975,583,1,'23:00:00',55000),(976,584,1,'22:00:00',55000),(977,584,2,'23:00:00',55000),(978,584,1,'23:00:00',55000),(979,585,1,'22:00:00',55000),(980,585,2,'23:00:00',55000),(981,585,1,'23:00:00',55000),(982,586,1,'22:00:00',55000),(983,586,2,'23:00:00',55000),(984,586,1,'23:00:00',55000),(985,587,1,'22:00:00',55000),(986,587,2,'23:00:00',55000),(987,587,1,'23:00:00',55000),(988,588,1,'22:00:00',55000),(989,588,2,'23:00:00',55000),(990,588,1,'23:00:00',55000),(991,589,1,'22:00:00',55000),(992,589,2,'23:00:00',55000),(993,589,1,'23:00:00',55000),(994,590,1,'22:00:00',55000),(995,590,2,'23:00:00',55000),(996,590,1,'23:00:00',55000),(997,591,1,'22:00:00',55000),(998,591,2,'23:00:00',55000),(999,591,1,'23:00:00',55000),(1000,592,1,'22:00:00',55000),(1001,592,2,'23:00:00',55000),(1002,592,1,'23:00:00',55000),(1003,593,1,'22:00:00',55000),(1004,593,2,'23:00:00',55000),(1005,593,1,'23:00:00',55000),(1006,594,1,'22:00:00',55000),(1007,594,2,'23:00:00',55000),(1008,594,1,'23:00:00',55000),(1009,595,1,'22:00:00',55000),(1010,595,2,'23:00:00',55000),(1011,595,1,'23:00:00',55000),(1012,596,1,'22:00:00',55000),(1013,596,2,'23:00:00',55000),(1014,596,1,'23:00:00',55000),(1015,597,1,'22:00:00',55000),(1016,597,2,'23:00:00',55000),(1017,597,1,'23:00:00',55000),(1018,598,1,'22:00:00',55000),(1019,598,2,'23:00:00',55000),(1020,598,1,'23:00:00',55000),(1021,599,1,'22:00:00',55000),(1022,599,2,'23:00:00',55000),(1023,599,1,'23:00:00',55000),(1024,600,1,'22:00:00',55000),(1025,600,2,'23:00:00',55000),(1026,600,1,'23:00:00',55000),(1027,601,1,'22:00:00',55000),(1028,601,2,'23:00:00',55000),(1029,601,1,'23:00:00',55000),(1030,602,1,'22:00:00',55000),(1031,602,2,'23:00:00',55000),(1032,602,1,'23:00:00',55000),(1033,603,1,'19:00:00',55000),(1034,603,1,'22:00:00',55000),(1035,604,1,'19:00:00',55000),(1036,604,1,'22:00:00',55000),(1037,605,1,'19:00:00',55000),(1038,605,1,'22:00:00',55000),(1039,606,1,'19:00:00',55000),(1040,606,1,'22:00:00',55000),(1041,607,1,'19:00:00',55000),(1042,607,1,'22:00:00',55000),(1043,608,1,'19:00:00',55000),(1044,608,1,'22:00:00',55000),(1045,609,1,'19:00:00',55000),(1046,609,1,'22:00:00',55000),(1047,610,1,'19:00:00',55000),(1048,610,1,'22:00:00',55000),(1049,611,1,'19:00:00',55000),(1050,611,1,'22:00:00',55000),(1051,612,1,'19:00:00',55000),(1052,612,1,'22:00:00',55000),(1053,613,1,'19:00:00',55000),(1054,613,1,'22:00:00',55000),(1055,614,1,'19:00:00',55000),(1056,614,1,'22:00:00',55000),(1057,615,1,'19:00:00',55000),(1058,615,1,'22:00:00',55000),(1059,616,1,'19:00:00',55000),(1060,616,1,'22:00:00',55000),(1061,617,1,'19:00:00',55000),(1062,617,1,'22:00:00',55000),(1063,618,1,'18:00:00',55000),(1064,618,1,'20:00:00',55000),(1065,619,1,'18:00:00',55000),(1066,619,1,'20:00:00',55000),(1067,620,1,'18:00:00',55000),(1068,620,1,'20:00:00',55000),(1069,621,1,'18:00:00',55000),(1070,621,1,'20:00:00',55000),(1071,622,1,'18:00:00',55000),(1072,622,1,'20:00:00',55000),(1073,623,1,'18:00:00',55000),(1074,623,1,'20:00:00',55000),(1075,624,1,'18:00:00',55000),(1076,624,1,'20:00:00',55000),(1077,625,1,'18:00:00',55000),(1078,625,1,'20:00:00',55000),(1079,626,1,'18:00:00',55000),(1080,626,1,'20:00:00',55000),(1081,627,1,'18:00:00',55000),(1082,627,1,'20:00:00',55000),(1083,628,1,'18:00:00',55000),(1084,628,1,'20:00:00',55000),(1085,629,1,'18:00:00',55000),(1086,629,1,'20:00:00',55000),(1087,630,1,'18:00:00',55000),(1088,630,1,'20:00:00',55000),(1089,631,1,'18:00:00',55000),(1090,631,1,'20:00:00',55000),(1091,632,1,'18:00:00',55000),(1092,632,1,'20:00:00',55000),(1093,633,1,'18:00:00',55000),(1094,633,1,'20:00:00',55000),(1095,634,1,'18:00:00',55000),(1096,634,1,'20:00:00',55000),(1097,635,1,'18:00:00',55000),(1098,635,1,'20:00:00',55000),(1099,636,1,'18:00:00',55000),(1100,636,1,'20:00:00',55000),(1101,637,1,'18:00:00',55000),(1102,637,1,'20:00:00',55000),(1103,638,1,'18:00:00',55000),(1104,638,1,'20:00:00',55000),(1105,639,1,'18:00:00',55000),(1106,639,1,'20:00:00',55000),(1107,640,1,'18:00:00',55000),(1108,640,1,'20:00:00',55000),(1109,641,1,'18:00:00',55000),(1110,641,1,'20:00:00',55000),(1111,642,1,'18:00:00',55000),(1112,642,1,'20:00:00',55000),(1113,643,1,'18:00:00',55000),(1114,643,1,'20:00:00',55000),(1115,644,1,'18:00:00',55000),(1116,644,1,'20:00:00',55000),(1117,645,1,'18:00:00',55000),(1118,645,1,'20:00:00',55000),(1119,646,1,'18:00:00',55000),(1120,646,1,'20:00:00',55000),(1121,647,1,'18:00:00',55000),(1122,647,1,'20:00:00',55000),(1123,648,1,'20:00:00',55000),(1124,648,1,'22:00:00',55000),(1125,649,1,'20:00:00',55000),(1126,649,1,'22:00:00',55000),(1127,650,1,'20:00:00',55000),(1128,650,1,'22:00:00',55000),(1129,651,1,'20:00:00',55000),(1130,651,1,'22:00:00',55000),(1131,652,1,'20:00:00',55000),(1132,652,1,'22:00:00',55000),(1133,653,1,'20:00:00',55000),(1134,653,1,'22:00:00',55000),(1135,654,1,'20:00:00',55000),(1136,654,1,'22:00:00',55000),(1137,655,1,'20:00:00',55000),(1138,655,1,'22:00:00',55000),(1139,656,1,'20:00:00',55000),(1140,656,1,'22:00:00',55000),(1141,657,1,'20:00:00',55000),(1142,657,1,'22:00:00',55000),(1143,658,1,'20:00:00',55000),(1144,658,1,'22:00:00',55000),(1145,659,1,'20:00:00',55000),(1146,659,1,'22:00:00',55000),(1147,660,1,'20:00:00',55000),(1148,660,1,'22:00:00',55000),(1149,661,1,'20:00:00',55000),(1150,661,1,'22:00:00',55000),(1151,662,1,'20:00:00',55000),(1152,662,1,'22:00:00',55000),(1153,663,1,'20:00:00',55000),(1154,663,1,'22:00:00',55000),(1155,664,1,'20:00:00',55000),(1156,664,1,'22:00:00',55000),(1157,665,1,'20:00:00',55000),(1158,665,1,'22:00:00',55000),(1159,666,1,'20:00:00',55000),(1160,666,1,'22:00:00',55000),(1161,667,1,'20:00:00',55000),(1162,667,1,'22:00:00',55000),(1203,688,1,'18:00:00',55000),(1204,688,2,'20:00:00',55000),(1205,688,27,'22:00:00',55000),(1206,688,28,'00:00:00',55000),(1207,689,1,'18:00:00',55000),(1208,689,2,'20:00:00',55000),(1209,689,27,'22:00:00',55000),(1210,689,28,'00:00:00',55000),(1211,690,1,'18:00:00',55000),(1212,690,2,'20:00:00',55000),(1213,690,27,'22:00:00',55000),(1214,690,28,'00:00:00',55000),(1215,691,1,'18:00:00',55000),(1216,691,2,'20:00:00',55000),(1217,691,27,'22:00:00',55000),(1218,691,28,'00:00:00',55000),(1219,692,1,'18:00:00',55000),(1220,692,2,'20:00:00',55000),(1221,692,27,'22:00:00',55000),(1222,692,28,'00:00:00',55000),(1223,693,1,'18:00:00',55000),(1224,693,2,'20:00:00',55000),(1225,693,27,'22:00:00',55000),(1226,693,28,'00:00:00',55000),(1227,694,1,'18:00:00',55000),(1228,694,2,'20:00:00',55000),(1229,694,27,'22:00:00',55000),(1230,694,28,'00:00:00',55000),(1231,695,1,'18:00:00',55000),(1232,695,2,'20:00:00',55000),(1233,695,27,'22:00:00',55000),(1234,695,28,'00:00:00',55000),(1235,696,1,'18:00:00',55000),(1236,696,2,'20:00:00',55000),(1237,696,27,'22:00:00',55000),(1238,696,28,'00:00:00',55000),(1239,697,1,'18:00:00',55000),(1240,697,2,'20:00:00',55000),(1241,697,27,'22:00:00',55000),(1242,697,28,'00:00:00',55000),(1243,698,1,'18:00:00',55000),(1244,698,2,'20:00:00',55000),(1245,698,27,'22:00:00',55000),(1246,698,28,'00:00:00',55000),(1247,699,1,'18:00:00',55000),(1248,699,2,'20:00:00',55000),(1249,699,27,'22:00:00',55000),(1250,699,28,'00:00:00',55000),(1251,700,1,'18:00:00',55000),(1252,700,2,'20:00:00',55000),(1253,700,27,'22:00:00',55000),(1254,700,28,'00:00:00',55000),(1255,701,1,'18:00:00',55000),(1256,701,2,'20:00:00',55000),(1257,701,27,'22:00:00',55000),(1258,701,28,'00:00:00',55000),(1259,702,1,'18:00:00',55000),(1260,702,2,'20:00:00',55000),(1261,702,27,'22:00:00',55000),(1262,702,28,'00:00:00',55000),(1263,703,1,'18:00:00',55000),(1264,703,2,'20:00:00',55000),(1265,703,27,'22:00:00',55000),(1266,703,28,'00:00:00',55000),(1267,704,1,'18:00:00',55000),(1268,704,2,'20:00:00',55000),(1269,704,27,'22:00:00',55000),(1270,704,28,'00:00:00',55000),(1271,705,1,'18:00:00',55000),(1272,705,2,'20:00:00',55000),(1273,705,27,'22:00:00',55000),(1274,705,28,'00:00:00',55000),(1275,706,1,'18:00:00',55000),(1276,706,2,'20:00:00',55000),(1277,706,27,'22:00:00',55000),(1278,706,28,'00:00:00',55000),(1279,707,1,'18:00:00',55000),(1280,707,2,'20:00:00',55000),(1281,707,27,'22:00:00',55000),(1282,707,28,'00:00:00',55000),(1283,708,1,'18:00:00',55000),(1284,708,2,'20:00:00',55000),(1285,708,27,'22:00:00',55000),(1286,708,28,'00:00:00',55000),(1287,709,1,'18:00:00',55000),(1288,709,2,'20:00:00',55000),(1289,709,27,'22:00:00',55000),(1290,709,28,'00:00:00',55000),(1291,710,1,'18:00:00',55000),(1292,710,2,'20:00:00',55000),(1293,710,27,'22:00:00',55000),(1294,710,28,'00:00:00',55000),(1295,711,1,'18:00:00',55000),(1296,711,2,'20:00:00',55000),(1297,711,27,'22:00:00',55000),(1298,711,28,'00:00:00',55000),(1299,712,1,'18:00:00',55000),(1300,712,2,'20:00:00',55000),(1301,712,27,'22:00:00',55000),(1302,712,28,'00:00:00',55000),(1303,713,1,'18:00:00',55000),(1304,713,2,'20:00:00',55000),(1305,713,27,'22:00:00',55000),(1306,713,28,'00:00:00',55000),(1307,714,1,'18:00:00',55000),(1308,714,2,'20:00:00',55000),(1309,714,27,'22:00:00',55000),(1310,714,28,'00:00:00',55000),(1311,715,1,'18:00:00',55000),(1312,715,2,'20:00:00',55000),(1313,715,27,'22:00:00',55000),(1314,715,28,'00:00:00',55000),(1315,716,1,'18:00:00',55000),(1316,716,2,'20:00:00',55000),(1317,716,27,'22:00:00',55000),(1318,716,28,'00:00:00',55000),(1319,717,1,'18:00:00',55000),(1320,717,2,'20:00:00',55000),(1321,717,27,'22:00:00',55000),(1322,717,28,'00:00:00',55000),(1323,718,1,'18:00:00',55000),(1324,718,2,'20:00:00',55000),(1325,718,27,'22:00:00',55000),(1326,718,28,'00:00:00',55000),(1327,719,1,'18:00:00',55000),(1328,719,2,'20:00:00',55000),(1329,719,27,'22:00:00',55000),(1330,719,28,'00:00:00',55000),(1331,720,1,'18:00:00',55000),(1332,720,2,'20:00:00',55000),(1333,720,27,'22:00:00',55000),(1334,720,28,'00:00:00',55000),(1335,721,1,'18:00:00',55000),(1336,721,2,'20:00:00',55000),(1337,721,27,'22:00:00',55000),(1338,721,28,'00:00:00',55000),(1339,722,1,'18:00:00',55000),(1340,722,2,'20:00:00',55000),(1341,722,27,'22:00:00',55000),(1342,722,28,'00:00:00',55000),(1343,723,1,'18:00:00',55000),(1344,723,2,'20:00:00',55000),(1345,723,27,'22:00:00',55000),(1346,723,28,'00:00:00',55000),(1347,724,1,'18:00:00',55000),(1348,724,2,'20:00:00',55000),(1349,724,27,'22:00:00',55000),(1350,724,28,'00:00:00',55000),(1351,725,1,'18:00:00',55000),(1352,725,2,'20:00:00',55000),(1353,725,27,'22:00:00',55000),(1354,725,28,'00:00:00',55000),(1355,726,1,'18:00:00',55000),(1356,726,2,'20:00:00',55000),(1357,726,27,'22:00:00',55000),(1358,726,28,'00:00:00',55000),(1359,727,1,'18:00:00',55000),(1360,727,2,'20:00:00',55000),(1361,727,27,'22:00:00',55000),(1362,727,28,'00:00:00',55000),(1363,728,1,'18:00:00',55000),(1364,728,2,'20:00:00',55000),(1365,728,27,'22:00:00',55000),(1366,728,28,'00:00:00',55000),(1367,729,1,'18:00:00',55000),(1368,729,2,'20:00:00',55000),(1369,729,27,'22:00:00',55000),(1370,729,28,'00:00:00',55000),(1371,730,1,'18:00:00',55000),(1372,730,2,'20:00:00',55000),(1373,730,27,'22:00:00',55000),(1374,730,28,'00:00:00',55000),(1375,731,1,'18:00:00',55000),(1376,731,2,'20:00:00',55000),(1377,731,27,'22:00:00',55000),(1378,731,28,'00:00:00',55000),(1379,732,1,'18:00:00',55000),(1380,732,2,'20:00:00',55000),(1381,732,27,'22:00:00',55000),(1382,732,28,'00:00:00',55000),(1383,733,1,'18:00:00',55000),(1384,733,2,'20:00:00',55000),(1385,733,27,'22:00:00',55000),(1386,733,28,'00:00:00',55000),(1387,734,1,'18:00:00',55000),(1388,734,2,'20:00:00',55000),(1389,734,27,'22:00:00',55000),(1390,734,28,'00:00:00',55000),(1391,735,1,'18:00:00',55000),(1392,735,2,'20:00:00',55000),(1393,735,27,'22:00:00',55000),(1394,735,28,'00:00:00',55000),(1395,736,1,'18:00:00',55000),(1396,736,2,'20:00:00',55000),(1397,736,27,'22:00:00',55000),(1398,736,28,'00:00:00',55000),(1399,737,1,'18:00:00',55000),(1400,737,2,'20:00:00',55000),(1401,737,27,'22:00:00',55000),(1402,737,28,'00:00:00',55000),(1403,738,1,'18:00:00',55000),(1404,738,2,'20:00:00',55000),(1405,738,27,'22:00:00',55000),(1406,738,28,'00:00:00',55000),(1407,739,1,'18:00:00',55000),(1408,739,2,'20:00:00',55000),(1409,739,27,'22:00:00',55000),(1410,739,28,'00:00:00',55000),(1411,740,1,'18:00:00',55000),(1412,740,2,'20:00:00',55000),(1413,740,27,'22:00:00',55000),(1414,740,28,'00:00:00',55000),(1415,741,1,'18:00:00',55000),(1416,741,2,'20:00:00',55000),(1417,741,27,'22:00:00',55000),(1418,741,28,'00:00:00',55000),(1419,742,1,'18:00:00',55000),(1420,742,2,'20:00:00',55000),(1421,742,27,'22:00:00',55000),(1422,742,28,'00:00:00',55000),(1423,743,1,'18:00:00',55000),(1424,743,2,'20:00:00',55000),(1425,743,27,'22:00:00',55000),(1426,743,28,'00:00:00',55000),(1427,744,1,'18:00:00',55000),(1428,744,2,'20:00:00',55000),(1429,744,27,'22:00:00',55000),(1430,744,28,'00:00:00',55000),(1431,745,1,'18:00:00',55000),(1432,745,2,'20:00:00',55000),(1433,745,27,'22:00:00',55000),(1434,745,28,'00:00:00',55000),(1435,746,1,'18:00:00',55000),(1436,746,2,'20:00:00',55000),(1437,746,27,'22:00:00',55000),(1438,746,28,'00:00:00',55000),(1439,747,1,'18:00:00',55000),(1440,747,2,'20:00:00',55000),(1441,747,27,'22:00:00',55000),(1442,747,28,'00:00:00',55000),(1443,748,1,'18:00:00',55000),(1444,748,2,'20:00:00',55000),(1445,748,27,'22:00:00',55000),(1446,748,28,'00:00:00',55000),(1447,749,1,'18:00:00',55000),(1448,749,2,'20:00:00',55000),(1449,749,27,'22:00:00',55000),(1450,749,28,'00:00:00',55000),(1451,750,1,'18:00:00',55000),(1452,750,2,'20:00:00',55000),(1453,750,27,'22:00:00',55000),(1454,750,28,'00:00:00',55000),(1455,751,1,'18:00:00',55000),(1456,751,2,'20:00:00',55000),(1457,751,27,'22:00:00',55000),(1458,751,28,'00:00:00',55000),(1459,752,1,'18:00:00',55000),(1460,752,2,'20:00:00',55000),(1461,752,27,'22:00:00',55000),(1462,752,28,'00:00:00',55000),(1463,753,1,'18:00:00',55000),(1464,753,2,'20:00:00',55000),(1465,753,27,'22:00:00',55000),(1466,753,28,'00:00:00',55000),(1467,754,1,'18:00:00',55000),(1468,754,2,'20:00:00',55000),(1469,754,27,'22:00:00',55000),(1470,754,28,'00:00:00',55000),(1471,755,1,'18:00:00',55000),(1472,755,2,'20:00:00',55000),(1473,755,27,'22:00:00',55000),(1474,755,28,'00:00:00',55000),(1475,756,1,'18:00:00',55000),(1476,756,2,'20:00:00',55000),(1477,756,27,'22:00:00',55000),(1478,756,28,'00:00:00',55000),(1479,757,1,'18:00:00',55000),(1480,757,2,'20:00:00',55000),(1481,757,27,'22:00:00',55000),(1482,757,28,'00:00:00',55000),(1483,758,1,'18:00:00',55000),(1484,758,2,'20:00:00',55000),(1485,758,27,'22:00:00',55000),(1486,758,28,'00:00:00',55000),(1487,759,1,'18:00:00',55000),(1488,759,2,'20:00:00',55000),(1489,759,27,'22:00:00',55000),(1490,759,28,'00:00:00',55000),(1491,760,1,'18:00:00',55000),(1492,760,2,'20:00:00',55000),(1493,760,27,'22:00:00',55000),(1494,760,28,'00:00:00',55000),(1495,761,1,'18:00:00',55000),(1496,761,2,'20:00:00',55000),(1497,761,27,'22:00:00',55000),(1498,761,28,'00:00:00',55000),(1499,762,1,'18:00:00',55000),(1500,762,2,'20:00:00',55000),(1501,762,27,'22:00:00',55000),(1502,762,28,'00:00:00',55000),(1503,763,1,'18:00:00',55000),(1504,763,2,'20:00:00',55000),(1505,763,27,'22:00:00',55000),(1506,763,28,'00:00:00',55000),(1507,764,1,'18:00:00',55000),(1508,764,2,'20:00:00',55000),(1509,764,27,'22:00:00',55000),(1510,764,28,'00:00:00',55000),(1511,765,1,'18:00:00',55000),(1512,765,2,'20:00:00',55000),(1513,765,27,'22:00:00',55000),(1514,765,28,'00:00:00',55000),(1515,766,1,'18:00:00',55000),(1516,766,2,'20:00:00',55000),(1517,766,27,'22:00:00',55000),(1518,766,28,'00:00:00',55000),(1519,767,1,'18:00:00',55000),(1520,767,2,'20:00:00',55000),(1521,767,27,'22:00:00',55000),(1522,767,28,'00:00:00',55000),(1523,768,1,'18:00:00',55000),(1524,768,2,'20:00:00',55000),(1525,768,27,'22:00:00',55000),(1526,768,28,'00:00:00',55000),(1527,769,1,'18:00:00',55000),(1528,769,2,'20:00:00',55000),(1529,769,27,'22:00:00',55000),(1530,769,28,'00:00:00',55000),(1531,770,1,'18:00:00',55000),(1532,770,2,'20:00:00',55000),(1533,770,27,'22:00:00',55000),(1534,770,28,'00:00:00',55000),(1535,771,1,'18:00:00',55000),(1536,771,2,'20:00:00',55000),(1537,771,27,'22:00:00',55000),(1538,771,28,'00:00:00',55000),(1539,772,1,'18:00:00',55000),(1540,772,2,'20:00:00',55000),(1541,772,27,'22:00:00',55000),(1542,772,28,'00:00:00',55000),(1543,773,1,'18:00:00',55000),(1544,773,2,'20:00:00',55000),(1545,773,27,'22:00:00',55000),(1546,773,28,'00:00:00',55000),(1547,774,1,'18:00:00',55000),(1548,774,2,'20:00:00',55000),(1549,774,27,'22:00:00',55000),(1550,774,28,'00:00:00',55000),(1551,775,1,'18:00:00',55000),(1552,775,2,'20:00:00',55000),(1553,775,27,'22:00:00',55000),(1554,775,28,'00:00:00',55000),(1555,776,1,'18:00:00',55000),(1556,776,2,'20:00:00',55000),(1557,776,27,'22:00:00',55000),(1558,776,28,'00:00:00',55000),(1559,777,1,'18:00:00',55000),(1560,777,2,'20:00:00',55000),(1561,777,27,'22:00:00',55000),(1562,777,28,'00:00:00',55000),(1563,778,1,'18:00:00',55000),(1564,778,2,'20:00:00',55000),(1565,778,27,'22:00:00',55000),(1566,778,28,'00:00:00',55000),(1567,779,1,'18:00:00',55000),(1568,779,2,'20:00:00',55000),(1569,779,27,'22:00:00',55000),(1570,779,28,'00:00:00',55000),(1571,780,1,'18:00:00',55000),(1572,780,2,'20:00:00',55000),(1573,780,27,'22:00:00',55000),(1574,780,28,'00:00:00',55000),(1575,781,1,'18:00:00',55000),(1576,781,2,'20:00:00',55000),(1577,781,27,'22:00:00',55000),(1578,781,28,'00:00:00',55000),(1579,782,1,'18:00:00',55000),(1580,782,2,'20:00:00',55000),(1581,782,27,'22:00:00',55000),(1582,782,28,'00:00:00',55000),(1583,783,1,'18:00:00',55000),(1584,783,2,'20:00:00',55000),(1585,783,27,'22:00:00',55000),(1586,783,28,'00:00:00',55000),(1587,784,1,'18:00:00',55000),(1588,784,2,'20:00:00',55000),(1589,784,27,'22:00:00',55000),(1590,784,28,'00:00:00',55000),(1591,785,1,'18:00:00',55000),(1592,785,2,'20:00:00',55000),(1593,785,27,'22:00:00',55000),(1594,785,28,'00:00:00',55000),(1595,786,1,'18:00:00',55000),(1596,786,2,'20:00:00',55000),(1597,786,27,'22:00:00',55000),(1598,786,28,'00:00:00',55000),(1599,787,1,'18:00:00',55000),(1600,787,2,'20:00:00',55000),(1601,787,27,'22:00:00',55000),(1602,787,28,'00:00:00',55000),(1603,788,1,'18:00:00',55000),(1604,788,2,'20:00:00',55000),(1605,788,27,'22:00:00',55000),(1606,788,28,'00:00:00',55000),(1607,789,1,'18:00:00',55000),(1608,789,2,'20:00:00',55000),(1609,789,27,'22:00:00',55000),(1610,789,28,'00:00:00',55000),(1611,790,1,'18:00:00',55000),(1612,790,2,'20:00:00',55000),(1613,790,27,'22:00:00',55000),(1614,790,28,'00:00:00',55000),(1615,791,1,'18:00:00',55000),(1616,791,2,'20:00:00',55000),(1617,791,27,'22:00:00',55000),(1618,791,28,'00:00:00',55000),(1619,792,1,'18:00:00',55000),(1620,792,2,'20:00:00',55000),(1621,792,27,'22:00:00',55000),(1622,792,28,'00:00:00',55000),(1623,793,1,'18:00:00',55000),(1624,793,2,'20:00:00',55000),(1625,793,27,'22:00:00',55000),(1626,793,28,'00:00:00',55000),(1627,794,1,'18:00:00',55000),(1628,794,2,'20:00:00',55000),(1629,794,27,'22:00:00',55000),(1630,794,28,'00:00:00',55000),(1631,795,1,'18:00:00',55000),(1632,795,2,'20:00:00',55000),(1633,795,27,'22:00:00',55000),(1634,795,28,'00:00:00',55000),(1635,796,1,'18:00:00',55000),(1636,796,2,'20:00:00',55000),(1637,796,27,'22:00:00',55000),(1638,796,28,'00:00:00',55000),(1639,797,1,'18:00:00',55000),(1640,797,2,'20:00:00',55000),(1641,797,27,'22:00:00',55000),(1642,797,28,'00:00:00',55000),(1643,798,1,'18:00:00',55000),(1644,798,2,'20:00:00',55000),(1645,798,27,'22:00:00',55000),(1646,798,28,'00:00:00',55000),(1647,799,1,'18:00:00',55000),(1648,799,2,'20:00:00',55000),(1649,799,27,'22:00:00',55000),(1650,799,28,'00:00:00',55000),(1651,800,1,'18:00:00',55000),(1652,800,2,'20:00:00',55000),(1653,800,27,'22:00:00',55000),(1654,800,28,'00:00:00',55000),(1655,801,1,'18:00:00',55000),(1656,801,2,'20:00:00',55000),(1657,801,27,'22:00:00',55000),(1658,801,28,'00:00:00',55000),(1659,802,1,'18:00:00',55000),(1660,802,2,'20:00:00',55000),(1661,802,27,'22:00:00',55000),(1662,802,28,'00:00:00',55000),(1663,803,1,'18:00:00',55000),(1664,803,2,'20:00:00',55000),(1665,803,27,'22:00:00',55000),(1666,803,28,'00:00:00',55000),(1667,804,1,'18:00:00',55000),(1668,804,2,'20:00:00',55000),(1669,804,27,'22:00:00',55000),(1670,804,28,'00:00:00',55000),(1671,805,1,'18:00:00',55000),(1672,805,2,'20:00:00',55000),(1673,805,27,'22:00:00',55000),(1674,805,28,'00:00:00',55000),(1675,806,1,'18:00:00',55000),(1676,806,2,'20:00:00',55000),(1677,806,27,'22:00:00',55000),(1678,806,28,'00:00:00',55000),(1679,807,1,'18:00:00',55000),(1680,807,2,'20:00:00',55000),(1681,807,27,'22:00:00',55000),(1682,807,28,'00:00:00',55000),(1683,808,1,'18:00:00',55000),(1684,808,2,'20:00:00',55000),(1685,808,27,'22:00:00',55000),(1686,808,28,'00:00:00',55000),(1687,809,1,'18:00:00',55000),(1688,809,2,'20:00:00',55000),(1689,809,27,'22:00:00',55000),(1690,809,28,'00:00:00',55000),(1691,810,1,'18:00:00',55000),(1692,810,2,'20:00:00',55000),(1693,810,27,'22:00:00',55000),(1694,810,28,'00:00:00',55000),(1695,811,1,'18:00:00',55000),(1696,811,2,'20:00:00',55000),(1697,811,27,'22:00:00',55000),(1698,811,28,'00:00:00',55000),(1699,812,1,'18:00:00',55000),(1700,812,2,'20:00:00',55000),(1701,812,27,'22:00:00',55000),(1702,812,28,'00:00:00',55000),(1703,813,1,'18:00:00',55000),(1704,813,2,'20:00:00',55000),(1705,813,27,'22:00:00',55000),(1706,813,28,'00:00:00',55000),(1707,814,1,'18:00:00',55000),(1708,814,2,'20:00:00',55000),(1709,814,27,'22:00:00',55000),(1710,814,28,'00:00:00',55000),(1711,815,1,'18:00:00',55000),(1712,815,2,'20:00:00',55000),(1713,815,27,'22:00:00',55000),(1714,815,28,'00:00:00',55000),(1715,816,1,'18:00:00',55000),(1716,816,2,'20:00:00',55000),(1717,816,27,'22:00:00',55000),(1718,816,28,'00:00:00',55000),(1719,817,1,'18:00:00',55000),(1720,817,2,'20:00:00',55000),(1721,817,27,'22:00:00',55000),(1722,817,28,'00:00:00',55000),(1723,818,1,'18:00:00',55000),(1724,818,2,'20:00:00',55000),(1725,818,27,'22:00:00',55000),(1726,818,28,'00:00:00',55000),(1727,819,1,'18:00:00',55000),(1728,819,2,'20:00:00',55000),(1729,819,27,'22:00:00',55000),(1730,819,28,'00:00:00',55000),(1731,820,1,'18:00:00',55000),(1732,820,2,'20:00:00',55000),(1733,820,27,'22:00:00',55000),(1734,820,28,'00:00:00',55000),(1735,821,1,'18:00:00',55000),(1736,821,2,'20:00:00',55000),(1737,821,27,'22:00:00',55000),(1738,821,28,'00:00:00',55000),(1739,822,1,'18:00:00',55000),(1740,822,2,'20:00:00',55000),(1741,822,27,'22:00:00',55000),(1742,822,28,'00:00:00',55000),(1743,823,1,'18:00:00',55000),(1744,823,2,'20:00:00',55000),(1745,823,27,'22:00:00',55000),(1746,823,28,'00:00:00',55000),(1747,824,1,'18:00:00',55000),(1748,824,2,'20:00:00',55000),(1749,824,27,'22:00:00',55000),(1750,824,28,'00:00:00',55000),(1751,825,1,'18:00:00',55000),(1752,825,2,'20:00:00',55000),(1753,825,27,'22:00:00',55000),(1754,825,28,'00:00:00',55000),(1755,826,1,'18:00:00',55000),(1756,826,2,'20:00:00',55000),(1757,826,27,'22:00:00',55000),(1758,826,28,'00:00:00',55000),(1759,827,1,'18:00:00',55000),(1760,827,2,'20:00:00',55000),(1761,827,27,'22:00:00',55000),(1762,827,28,'00:00:00',55000),(1763,828,1,'18:00:00',55000),(1764,828,2,'20:00:00',55000),(1765,828,27,'22:00:00',55000),(1766,828,28,'00:00:00',55000),(1767,829,1,'18:00:00',55000),(1768,829,2,'20:00:00',55000),(1769,829,27,'22:00:00',55000),(1770,829,28,'00:00:00',55000),(1771,830,1,'18:00:00',55000),(1772,830,2,'20:00:00',55000),(1773,830,27,'22:00:00',55000),(1774,830,28,'00:00:00',55000),(1775,831,1,'18:00:00',55000),(1776,831,2,'20:00:00',55000),(1777,831,27,'22:00:00',55000),(1778,831,28,'00:00:00',55000),(1779,832,1,'18:00:00',55000),(1780,832,2,'20:00:00',55000),(1781,832,27,'22:00:00',55000),(1782,832,28,'00:00:00',55000),(1783,833,1,'18:00:00',55000),(1784,833,2,'20:00:00',55000),(1785,833,27,'22:00:00',55000),(1786,833,28,'00:00:00',55000),(1787,834,1,'18:00:00',55000),(1788,834,2,'20:00:00',55000),(1789,834,27,'22:00:00',55000),(1790,834,28,'00:00:00',55000),(1791,835,1,'18:00:00',55000),(1792,835,2,'20:00:00',55000),(1793,835,27,'22:00:00',55000),(1794,835,28,'00:00:00',55000),(1795,836,1,'18:00:00',55000),(1796,836,2,'20:00:00',55000),(1797,836,27,'22:00:00',55000),(1798,836,28,'00:00:00',55000),(1799,837,1,'18:00:00',55000),(1800,837,2,'20:00:00',55000),(1801,837,27,'22:00:00',55000),(1802,837,28,'00:00:00',55000),(1803,838,1,'18:00:00',55000),(1804,838,2,'20:00:00',55000),(1805,838,27,'22:00:00',55000),(1806,838,28,'00:00:00',55000),(1807,839,1,'18:00:00',55000),(1808,839,2,'20:00:00',55000),(1809,839,27,'22:00:00',55000),(1810,839,28,'00:00:00',55000),(1811,840,1,'18:00:00',55000),(1812,840,2,'20:00:00',55000),(1813,840,27,'22:00:00',55000),(1814,840,28,'00:00:00',55000),(1815,841,1,'18:00:00',55000),(1816,841,2,'20:00:00',55000),(1817,841,27,'22:00:00',55000),(1818,841,28,'00:00:00',55000),(1819,842,1,'18:00:00',55000),(1820,842,2,'20:00:00',55000),(1821,842,27,'22:00:00',55000),(1822,842,28,'00:00:00',55000),(1823,843,1,'18:00:00',55000),(1824,843,2,'20:00:00',55000),(1825,843,27,'22:00:00',55000),(1826,843,28,'00:00:00',55000),(1827,844,1,'18:00:00',55000),(1828,844,2,'20:00:00',55000),(1829,844,27,'22:00:00',55000),(1830,844,28,'00:00:00',55000),(1831,845,1,'18:00:00',55000),(1832,845,2,'20:00:00',55000),(1833,845,27,'22:00:00',55000),(1834,845,28,'00:00:00',55000),(1835,846,1,'18:00:00',55000),(1836,846,2,'20:00:00',55000),(1837,846,27,'22:00:00',55000),(1838,846,28,'00:00:00',55000),(1839,847,1,'18:00:00',55000),(1840,847,2,'20:00:00',55000),(1841,847,27,'22:00:00',55000),(1842,847,28,'00:00:00',55000),(1843,848,1,'18:00:00',55000),(1844,848,2,'20:00:00',55000),(1845,848,27,'22:00:00',55000),(1846,848,28,'00:00:00',55000),(1847,849,1,'18:00:00',55000),(1848,849,2,'20:00:00',55000),(1849,849,27,'22:00:00',55000),(1850,849,28,'00:00:00',55000),(1851,850,1,'18:00:00',55000),(1852,850,2,'20:00:00',55000),(1853,850,27,'22:00:00',55000),(1854,850,28,'00:00:00',55000),(1855,851,1,'18:00:00',55000),(1856,851,2,'20:00:00',55000),(1857,851,27,'22:00:00',55000),(1858,851,28,'00:00:00',55000),(1859,852,1,'18:00:00',55000),(1860,852,2,'20:00:00',55000),(1861,852,27,'22:00:00',55000),(1862,852,28,'00:00:00',55000),(1863,853,1,'18:00:00',55000),(1864,853,2,'20:00:00',55000),(1865,853,27,'22:00:00',55000),(1866,853,28,'00:00:00',55000),(1867,854,1,'18:00:00',55000),(1868,854,2,'20:00:00',55000),(1869,854,27,'22:00:00',55000),(1870,854,28,'00:00:00',55000),(1871,855,1,'18:00:00',55000),(1872,855,2,'20:00:00',55000),(1873,855,27,'22:00:00',55000),(1874,855,28,'00:00:00',55000),(1875,856,1,'18:00:00',55000),(1876,856,2,'20:00:00',55000),(1877,856,27,'22:00:00',55000),(1878,856,28,'00:00:00',55000),(1879,857,1,'18:00:00',55000),(1880,857,2,'20:00:00',55000),(1881,857,27,'22:00:00',55000),(1882,857,28,'00:00:00',55000),(1883,858,1,'18:00:00',55000),(1884,858,2,'20:00:00',55000),(1885,858,27,'22:00:00',55000),(1886,858,28,'00:00:00',55000),(1887,859,1,'18:00:00',55000),(1888,859,2,'20:00:00',55000),(1889,859,27,'22:00:00',55000),(1890,859,28,'00:00:00',55000),(1891,860,1,'18:00:00',55000),(1892,860,2,'20:00:00',55000),(1893,860,27,'22:00:00',55000),(1894,860,28,'00:00:00',55000),(1895,861,1,'18:00:00',55000),(1896,861,2,'20:00:00',55000),(1897,861,27,'22:00:00',55000),(1898,861,28,'00:00:00',55000),(1899,862,1,'18:00:00',55000),(1900,862,2,'20:00:00',55000),(1901,862,27,'22:00:00',55000),(1902,862,28,'00:00:00',55000),(1903,863,1,'18:00:00',55000),(1904,863,2,'20:00:00',55000),(1905,863,27,'22:00:00',55000),(1906,863,28,'00:00:00',55000),(1907,864,1,'18:00:00',55000),(1908,864,2,'20:00:00',55000),(1909,864,27,'22:00:00',55000),(1910,864,28,'00:00:00',55000),(1911,865,1,'18:00:00',55000),(1912,865,2,'20:00:00',55000),(1913,865,27,'22:00:00',55000),(1914,865,28,'00:00:00',55000),(1915,866,1,'18:00:00',55000),(1916,866,2,'20:00:00',55000),(1917,866,27,'22:00:00',55000),(1918,866,28,'00:00:00',55000),(1919,867,1,'18:00:00',55000),(1920,867,2,'20:00:00',55000),(1921,867,27,'22:00:00',55000),(1922,867,28,'00:00:00',55000),(1923,868,1,'18:00:00',55000),(1924,868,2,'20:00:00',55000),(1925,868,27,'22:00:00',55000),(1926,868,28,'00:00:00',55000),(1927,869,1,'18:00:00',55000),(1928,869,2,'20:00:00',55000),(1929,869,27,'22:00:00',55000),(1930,869,28,'00:00:00',55000),(1931,870,1,'18:00:00',55000),(1932,870,2,'20:00:00',55000),(1933,870,27,'22:00:00',55000),(1934,870,28,'00:00:00',55000),(1935,871,1,'18:00:00',55000),(1936,871,2,'20:00:00',55000),(1937,871,27,'22:00:00',55000),(1938,871,28,'00:00:00',55000),(1939,872,1,'18:00:00',55000),(1940,872,2,'20:00:00',55000),(1941,872,27,'22:00:00',55000),(1942,872,28,'00:00:00',55000),(1943,873,1,'18:00:00',55000),(1944,873,2,'20:00:00',55000),(1945,873,27,'22:00:00',55000),(1946,873,28,'00:00:00',55000),(1947,874,1,'18:00:00',55000),(1948,874,2,'20:00:00',55000),(1949,874,27,'22:00:00',55000),(1950,874,28,'00:00:00',55000),(1951,875,1,'18:00:00',55000),(1952,875,2,'20:00:00',55000),(1953,875,27,'22:00:00',55000),(1954,875,28,'00:00:00',55000),(1955,876,1,'18:00:00',55000),(1956,876,2,'20:00:00',55000),(1957,876,27,'22:00:00',55000),(1958,876,28,'00:00:00',55000),(1959,877,1,'18:00:00',55000),(1960,877,2,'20:00:00',55000),(1961,877,27,'22:00:00',55000),(1962,877,28,'00:00:00',55000),(1963,878,1,'18:00:00',55000),(1964,878,2,'20:00:00',55000),(1965,878,27,'22:00:00',55000),(1966,878,28,'00:00:00',55000),(1967,879,1,'18:00:00',55000),(1968,879,2,'20:00:00',55000),(1969,879,27,'22:00:00',55000),(1970,879,28,'00:00:00',55000),(1971,880,1,'18:00:00',55000),(1972,880,2,'20:00:00',55000),(1973,880,27,'22:00:00',55000),(1974,880,28,'00:00:00',55000),(1975,881,1,'18:00:00',55000),(1976,881,2,'20:00:00',55000),(1977,881,27,'22:00:00',55000),(1978,881,28,'00:00:00',55000),(1979,882,1,'18:00:00',55000),(1980,882,2,'20:00:00',55000),(1981,882,27,'22:00:00',55000),(1982,882,28,'00:00:00',55000),(1983,883,1,'18:00:00',55000),(1984,883,2,'20:00:00',55000),(1985,883,27,'22:00:00',55000),(1986,883,28,'00:00:00',55000),(1987,884,1,'18:00:00',55000),(1988,884,2,'20:00:00',55000),(1989,884,27,'22:00:00',55000),(1990,884,28,'00:00:00',55000),(1991,885,1,'18:00:00',55000),(1992,885,2,'20:00:00',55000),(1993,885,27,'22:00:00',55000),(1994,885,28,'00:00:00',55000),(1995,886,1,'18:00:00',55000),(1996,886,2,'20:00:00',55000),(1997,886,27,'22:00:00',55000),(1998,886,28,'00:00:00',55000),(1999,887,1,'18:00:00',55000),(2000,887,2,'20:00:00',55000),(2001,887,27,'22:00:00',55000),(2002,887,28,'00:00:00',55000),(2003,888,1,'18:00:00',55000),(2004,888,2,'20:00:00',55000),(2005,888,27,'22:00:00',55000),(2006,888,28,'00:00:00',55000),(2007,889,1,'18:00:00',55000),(2008,889,2,'20:00:00',55000),(2009,889,27,'22:00:00',55000),(2010,889,28,'00:00:00',55000),(2011,890,1,'18:00:00',55000),(2012,890,2,'20:00:00',55000),(2013,890,27,'22:00:00',55000),(2014,890,28,'00:00:00',55000),(2015,891,1,'18:00:00',55000),(2016,891,2,'20:00:00',55000),(2017,891,27,'22:00:00',55000),(2018,891,28,'00:00:00',55000),(2019,892,1,'18:00:00',55000),(2020,892,2,'20:00:00',55000),(2021,892,27,'22:00:00',55000),(2022,892,28,'00:00:00',55000),(2023,893,1,'18:00:00',55000),(2024,893,2,'20:00:00',55000),(2025,893,27,'22:00:00',55000),(2026,893,28,'00:00:00',55000),(2027,894,1,'18:00:00',55000),(2028,894,2,'20:00:00',55000),(2029,894,27,'22:00:00',55000),(2030,894,28,'00:00:00',55000),(2031,895,1,'18:00:00',55000),(2032,895,2,'20:00:00',55000),(2033,895,27,'22:00:00',55000),(2034,895,28,'00:00:00',55000),(2035,896,1,'18:00:00',55000),(2036,896,2,'20:00:00',55000),(2037,896,27,'22:00:00',55000),(2038,896,28,'00:00:00',55000),(2039,897,1,'18:00:00',55000),(2040,897,2,'20:00:00',55000),(2041,897,27,'22:00:00',55000),(2042,897,28,'00:00:00',55000),(2043,898,1,'18:00:00',55000),(2044,898,2,'20:00:00',55000),(2045,898,27,'22:00:00',55000),(2046,898,28,'00:00:00',55000),(2047,899,1,'18:00:00',55000),(2048,899,2,'20:00:00',55000),(2049,899,27,'22:00:00',55000),(2050,899,28,'00:00:00',55000),(2051,900,1,'18:00:00',55000),(2052,900,2,'20:00:00',55000),(2053,900,27,'22:00:00',55000),(2054,900,28,'00:00:00',55000),(2055,901,1,'18:00:00',55000),(2056,901,2,'20:00:00',55000),(2057,901,27,'22:00:00',55000),(2058,901,28,'00:00:00',55000),(2059,902,1,'18:00:00',55000),(2060,902,2,'20:00:00',55000),(2061,902,27,'22:00:00',55000),(2062,902,28,'00:00:00',55000),(2063,903,1,'18:00:00',55000),(2064,903,2,'20:00:00',55000),(2065,903,27,'22:00:00',55000),(2066,903,28,'00:00:00',55000),(2067,904,1,'18:00:00',55000),(2068,904,2,'20:00:00',55000),(2069,904,27,'22:00:00',55000),(2070,904,28,'00:00:00',55000),(2071,905,1,'18:00:00',55000),(2072,905,2,'20:00:00',55000),(2073,905,27,'22:00:00',55000),(2074,905,28,'00:00:00',55000),(2075,906,1,'18:00:00',55000),(2076,906,2,'20:00:00',55000),(2077,906,27,'22:00:00',55000),(2078,906,28,'00:00:00',55000),(2079,907,1,'18:00:00',55000),(2080,907,2,'20:00:00',55000),(2081,907,27,'22:00:00',55000),(2082,907,28,'00:00:00',55000),(2083,908,1,'18:00:00',55000),(2084,908,2,'20:00:00',55000),(2085,908,27,'22:00:00',55000),(2086,908,28,'00:00:00',55000),(2087,909,1,'18:00:00',55000),(2088,909,2,'20:00:00',55000),(2089,909,27,'22:00:00',55000),(2090,909,28,'00:00:00',55000),(2091,910,1,'18:00:00',55000),(2092,910,2,'20:00:00',55000),(2093,910,27,'22:00:00',55000),(2094,910,28,'00:00:00',55000),(2095,911,1,'18:00:00',55000),(2096,911,2,'20:00:00',55000),(2097,911,27,'22:00:00',55000),(2098,911,28,'00:00:00',55000),(2099,912,1,'18:00:00',55000),(2100,912,2,'20:00:00',55000),(2101,912,27,'22:00:00',55000),(2102,912,28,'00:00:00',55000),(2103,913,1,'18:00:00',55000),(2104,913,2,'20:00:00',55000),(2105,913,27,'22:00:00',55000),(2106,913,28,'00:00:00',55000),(2107,914,1,'18:00:00',55000),(2108,914,2,'20:00:00',55000),(2109,914,27,'22:00:00',55000),(2110,914,28,'00:00:00',55000),(2111,915,1,'18:00:00',55000),(2112,915,2,'20:00:00',55000),(2113,915,27,'22:00:00',55000),(2114,915,28,'00:00:00',55000),(2115,916,1,'18:00:00',55000),(2116,916,2,'20:00:00',55000),(2117,916,27,'22:00:00',55000),(2118,916,28,'00:00:00',55000),(2119,917,1,'18:00:00',55000),(2120,917,2,'20:00:00',55000),(2121,917,27,'22:00:00',55000),(2122,917,28,'00:00:00',55000),(2123,918,1,'18:00:00',55000),(2124,918,2,'20:00:00',55000),(2125,918,27,'22:00:00',55000),(2126,918,28,'00:00:00',55000),(2127,919,1,'18:00:00',55000),(2128,919,2,'20:00:00',55000),(2129,919,27,'22:00:00',55000),(2130,919,28,'00:00:00',55000),(2131,920,1,'18:00:00',55000),(2132,920,2,'20:00:00',55000),(2133,920,27,'22:00:00',55000),(2134,920,28,'00:00:00',55000),(2135,921,1,'18:00:00',55000),(2136,921,2,'20:00:00',55000),(2137,921,27,'22:00:00',55000),(2138,921,28,'00:00:00',55000),(2139,922,1,'18:00:00',55000),(2140,922,2,'20:00:00',55000),(2141,922,27,'22:00:00',55000),(2142,922,28,'00:00:00',55000),(2143,923,1,'18:00:00',55000),(2144,923,2,'20:00:00',55000),(2145,923,27,'22:00:00',55000),(2146,923,28,'00:00:00',55000),(2147,924,1,'18:00:00',55000),(2148,924,2,'20:00:00',55000),(2149,924,27,'22:00:00',55000),(2150,924,28,'00:00:00',55000),(2151,925,1,'18:00:00',55000),(2152,925,2,'20:00:00',55000),(2153,925,27,'22:00:00',55000),(2154,925,28,'00:00:00',55000),(2155,926,1,'18:00:00',55000),(2156,926,2,'20:00:00',55000),(2157,926,27,'22:00:00',55000),(2158,926,28,'00:00:00',55000),(2159,927,1,'18:00:00',55000),(2160,927,2,'20:00:00',55000),(2161,927,27,'22:00:00',55000),(2162,927,28,'00:00:00',55000),(2163,928,1,'18:00:00',55000),(2164,928,2,'20:00:00',55000),(2165,928,27,'22:00:00',55000),(2166,928,28,'00:00:00',55000),(2167,929,1,'18:00:00',55000),(2168,929,2,'20:00:00',55000),(2169,929,27,'22:00:00',55000),(2170,929,28,'00:00:00',55000),(2171,930,1,'18:00:00',55000),(2172,930,2,'20:00:00',55000),(2173,930,27,'22:00:00',55000),(2174,930,28,'00:00:00',55000),(2175,931,1,'18:00:00',55000),(2176,931,2,'20:00:00',55000),(2177,931,27,'22:00:00',55000),(2178,931,28,'00:00:00',55000),(2179,932,1,'18:00:00',55000),(2180,932,2,'20:00:00',55000),(2181,932,27,'22:00:00',55000),(2182,932,28,'00:00:00',55000),(2183,933,1,'18:00:00',55000),(2184,933,2,'20:00:00',55000),(2185,933,27,'22:00:00',55000),(2186,933,28,'00:00:00',55000),(2187,934,1,'18:00:00',55000),(2188,934,2,'20:00:00',55000),(2189,934,27,'22:00:00',55000),(2190,934,28,'00:00:00',55000),(2191,935,1,'18:00:00',55000),(2192,935,2,'20:00:00',55000),(2193,935,27,'22:00:00',55000),(2194,935,28,'00:00:00',55000),(2195,936,1,'18:00:00',55000),(2196,936,2,'20:00:00',55000),(2197,936,27,'22:00:00',55000),(2198,936,28,'00:00:00',55000),(2199,937,1,'18:00:00',55000),(2200,937,2,'20:00:00',55000),(2201,937,27,'22:00:00',55000),(2202,937,28,'00:00:00',55000),(2203,938,1,'18:00:00',55000),(2204,938,2,'20:00:00',55000),(2205,938,27,'22:00:00',55000),(2206,938,28,'00:00:00',55000),(2207,939,1,'18:00:00',55000),(2208,939,2,'20:00:00',55000),(2209,939,27,'22:00:00',55000),(2210,939,28,'00:00:00',55000),(2211,940,1,'18:00:00',55000),(2212,940,2,'20:00:00',55000),(2213,940,27,'22:00:00',55000),(2214,940,28,'00:00:00',55000),(2215,941,1,'18:00:00',55000),(2216,941,2,'20:00:00',55000),(2217,941,27,'22:00:00',55000),(2218,941,28,'00:00:00',55000),(2219,942,1,'18:00:00',55000),(2220,942,2,'20:00:00',55000),(2221,942,27,'22:00:00',55000),(2222,942,28,'00:00:00',55000),(2223,943,1,'18:00:00',55000),(2224,943,2,'20:00:00',55000),(2225,943,27,'22:00:00',55000),(2226,943,28,'00:00:00',55000),(2227,944,1,'18:00:00',55000),(2228,944,2,'20:00:00',55000),(2229,944,27,'22:00:00',55000),(2230,944,28,'00:00:00',55000),(2231,945,1,'18:00:00',55000),(2232,945,2,'20:00:00',55000),(2233,945,27,'22:00:00',55000),(2234,945,28,'00:00:00',55000),(2235,946,1,'18:00:00',55000),(2236,946,2,'20:00:00',55000),(2237,946,27,'22:00:00',55000),(2238,946,28,'00:00:00',55000),(2239,947,1,'18:00:00',55000),(2240,947,2,'20:00:00',55000),(2241,947,27,'22:00:00',55000),(2242,947,28,'00:00:00',55000),(2243,948,1,'18:00:00',55000),(2244,948,2,'20:00:00',55000),(2245,948,27,'22:00:00',55000),(2246,948,28,'00:00:00',55000),(2247,949,1,'18:00:00',55000),(2248,949,2,'20:00:00',55000),(2249,949,27,'22:00:00',55000),(2250,949,28,'00:00:00',55000),(2251,950,1,'18:00:00',55000),(2252,950,2,'20:00:00',55000),(2253,950,27,'22:00:00',55000),(2254,950,28,'00:00:00',55000),(2255,951,1,'18:00:00',55000),(2256,951,2,'20:00:00',55000),(2257,951,27,'22:00:00',55000),(2258,951,28,'00:00:00',55000),(2259,952,1,'18:00:00',55000),(2260,952,2,'20:00:00',55000),(2261,952,27,'22:00:00',55000),(2262,952,28,'00:00:00',55000),(2263,953,1,'18:00:00',55000),(2264,953,2,'20:00:00',55000),(2265,953,27,'22:00:00',55000),(2266,953,28,'00:00:00',55000),(2267,954,1,'18:00:00',55000),(2268,954,2,'20:00:00',55000),(2269,954,27,'22:00:00',55000),(2270,954,28,'00:00:00',55000),(2271,955,1,'18:00:00',55000),(2272,955,2,'20:00:00',55000),(2273,955,27,'22:00:00',55000),(2274,955,28,'00:00:00',55000),(2275,956,1,'18:00:00',55000),(2276,956,2,'20:00:00',55000),(2277,956,27,'22:00:00',55000),(2278,956,28,'00:00:00',55000),(2279,957,1,'18:00:00',55000),(2280,957,2,'20:00:00',55000),(2281,957,27,'22:00:00',55000),(2282,957,28,'00:00:00',55000),(2283,958,1,'18:00:00',55000),(2284,958,2,'20:00:00',55000),(2285,958,27,'22:00:00',55000),(2286,958,28,'00:00:00',55000),(2287,959,1,'18:00:00',55000),(2288,959,2,'20:00:00',55000),(2289,959,27,'22:00:00',55000),(2290,959,28,'00:00:00',55000),(2291,960,1,'18:00:00',55000),(2292,960,2,'20:00:00',55000),(2293,960,27,'22:00:00',55000),(2294,960,28,'00:00:00',55000),(2295,961,1,'18:00:00',55000),(2296,961,2,'20:00:00',55000),(2297,961,27,'22:00:00',55000),(2298,961,28,'00:00:00',55000),(2299,962,1,'18:00:00',55000),(2300,962,2,'20:00:00',55000),(2301,962,27,'22:00:00',55000),(2302,962,28,'00:00:00',55000),(2303,963,1,'18:00:00',55000),(2304,963,2,'20:00:00',55000),(2305,963,27,'22:00:00',55000),(2306,963,28,'00:00:00',55000),(2307,964,1,'18:00:00',55000),(2308,964,2,'20:00:00',55000),(2309,964,27,'22:00:00',55000),(2310,964,28,'00:00:00',55000),(2311,965,1,'18:00:00',55000),(2312,965,2,'20:00:00',55000),(2313,965,27,'22:00:00',55000),(2314,965,28,'00:00:00',55000),(2315,966,1,'18:00:00',55000),(2316,966,2,'20:00:00',55000),(2317,966,27,'22:00:00',55000),(2318,966,28,'00:00:00',55000),(2319,967,1,'18:00:00',55000),(2320,967,2,'20:00:00',55000),(2321,967,27,'22:00:00',55000),(2322,967,28,'00:00:00',55000),(2323,968,1,'18:00:00',55000),(2324,968,2,'20:00:00',55000),(2325,968,27,'22:00:00',55000),(2326,968,28,'00:00:00',55000),(2327,969,1,'18:00:00',55000),(2328,969,2,'20:00:00',55000),(2329,969,27,'22:00:00',55000),(2330,969,28,'00:00:00',55000),(2331,970,1,'18:00:00',55000),(2332,970,2,'20:00:00',55000),(2333,970,27,'22:00:00',55000),(2334,970,28,'00:00:00',55000),(2335,971,1,'18:00:00',55000),(2336,971,2,'20:00:00',55000),(2337,971,27,'22:00:00',55000),(2338,971,28,'00:00:00',55000),(2339,972,1,'18:00:00',55000),(2340,972,2,'20:00:00',55000),(2341,972,27,'22:00:00',55000),(2342,972,28,'00:00:00',55000),(2343,973,1,'18:00:00',55000),(2344,973,2,'20:00:00',55000),(2345,973,27,'22:00:00',55000),(2346,973,28,'00:00:00',55000),(2347,974,1,'18:00:00',55000),(2348,974,2,'20:00:00',55000),(2349,974,27,'22:00:00',55000),(2350,974,28,'00:00:00',55000),(2351,975,1,'18:00:00',55000),(2352,975,2,'20:00:00',55000),(2353,975,27,'22:00:00',55000),(2354,975,28,'00:00:00',55000),(2355,976,1,'18:00:00',55000),(2356,976,2,'20:00:00',55000),(2357,976,27,'22:00:00',55000),(2358,976,28,'00:00:00',55000),(2359,977,1,'18:00:00',55000),(2360,977,2,'20:00:00',55000),(2361,977,27,'22:00:00',55000),(2362,977,28,'00:00:00',55000),(2363,978,1,'18:00:00',55000),(2364,978,2,'20:00:00',55000),(2365,978,27,'22:00:00',55000),(2366,978,28,'00:00:00',55000),(2367,979,1,'18:00:00',55000),(2368,979,2,'20:00:00',55000),(2369,979,27,'22:00:00',55000),(2370,979,28,'00:00:00',55000),(2371,980,1,'18:00:00',55000),(2372,980,2,'20:00:00',55000),(2373,980,27,'22:00:00',55000),(2374,980,28,'00:00:00',55000),(2375,981,1,'18:00:00',55000),(2376,981,2,'20:00:00',55000),(2377,981,27,'22:00:00',55000),(2378,981,28,'00:00:00',55000),(2379,982,1,'18:00:00',55000),(2380,982,2,'20:00:00',55000),(2381,982,27,'22:00:00',55000),(2382,982,28,'00:00:00',55000),(2383,983,1,'18:00:00',55000),(2384,983,2,'20:00:00',55000),(2385,983,27,'22:00:00',55000),(2386,983,28,'00:00:00',55000),(2387,984,1,'18:00:00',55000),(2388,984,2,'20:00:00',55000),(2389,984,27,'22:00:00',55000),(2390,984,28,'00:00:00',55000),(2391,985,1,'18:00:00',55000),(2392,985,2,'20:00:00',55000),(2393,985,27,'22:00:00',55000),(2394,985,28,'00:00:00',55000),(2395,986,1,'18:00:00',55000),(2396,986,2,'20:00:00',55000),(2397,986,27,'22:00:00',55000),(2398,986,28,'00:00:00',55000),(2399,987,1,'18:00:00',55000),(2400,987,2,'20:00:00',55000),(2401,987,27,'22:00:00',55000),(2402,987,28,'00:00:00',55000),(2403,988,1,'18:00:00',55000),(2404,988,2,'20:00:00',55000),(2405,988,27,'22:00:00',55000),(2406,988,28,'00:00:00',55000),(2407,989,1,'18:00:00',55000),(2408,989,2,'20:00:00',55000),(2409,989,27,'22:00:00',55000),(2410,989,28,'00:00:00',55000),(2411,990,1,'18:00:00',55000),(2412,990,2,'20:00:00',55000),(2413,990,27,'22:00:00',55000),(2414,990,28,'00:00:00',55000),(2415,991,1,'18:00:00',55000),(2416,991,2,'20:00:00',55000),(2417,991,27,'22:00:00',55000),(2418,991,28,'00:00:00',55000),(2419,992,1,'18:00:00',55000),(2420,992,2,'20:00:00',55000),(2421,992,27,'22:00:00',55000),(2422,992,28,'00:00:00',55000),(2423,993,1,'18:00:00',55000),(2424,993,2,'20:00:00',55000),(2425,993,27,'22:00:00',55000),(2426,993,28,'00:00:00',55000),(2427,994,1,'18:00:00',55000),(2428,994,2,'20:00:00',55000),(2429,994,27,'22:00:00',55000),(2430,994,28,'00:00:00',55000),(2431,995,1,'18:00:00',55000),(2432,995,2,'20:00:00',55000),(2433,995,27,'22:00:00',55000),(2434,995,28,'00:00:00',55000),(2435,996,1,'18:00:00',55000),(2436,996,2,'20:00:00',55000),(2437,996,27,'22:00:00',55000),(2438,996,28,'00:00:00',55000),(2439,997,1,'18:00:00',55000),(2440,997,2,'20:00:00',55000),(2441,997,27,'22:00:00',55000),(2442,997,28,'00:00:00',55000),(2443,998,1,'18:00:00',55000),(2444,998,2,'20:00:00',55000),(2445,998,27,'22:00:00',55000),(2446,998,28,'00:00:00',55000),(2447,999,1,'18:00:00',55000),(2448,999,2,'20:00:00',55000),(2449,999,27,'22:00:00',55000),(2450,999,28,'00:00:00',55000),(2451,1000,1,'18:00:00',55000),(2452,1000,2,'20:00:00',55000),(2453,1000,27,'22:00:00',55000),(2454,1000,28,'00:00:00',55000),(2455,1001,1,'18:00:00',55000),(2456,1001,2,'20:00:00',55000),(2457,1001,27,'22:00:00',55000),(2458,1001,28,'00:00:00',55000),(2459,1002,1,'18:00:00',55000),(2460,1002,2,'20:00:00',55000),(2461,1002,27,'22:00:00',55000),(2462,1002,28,'00:00:00',55000),(2463,1003,1,'18:00:00',55000),(2464,1003,2,'20:00:00',55000),(2465,1003,27,'22:00:00',55000),(2466,1003,28,'00:00:00',55000),(2467,1004,1,'18:00:00',55000),(2468,1004,2,'20:00:00',55000),(2469,1004,27,'22:00:00',55000),(2470,1004,28,'00:00:00',55000),(2471,1005,1,'18:00:00',55000),(2472,1005,2,'20:00:00',55000),(2473,1005,27,'22:00:00',55000),(2474,1005,28,'00:00:00',55000),(2475,1006,1,'18:00:00',55000),(2476,1006,2,'20:00:00',55000),(2477,1006,27,'22:00:00',55000),(2478,1006,28,'00:00:00',55000),(2479,1007,1,'18:00:00',55000),(2480,1007,2,'20:00:00',55000),(2481,1007,27,'22:00:00',55000),(2482,1007,28,'00:00:00',55000),(2483,1008,1,'18:00:00',55000),(2484,1008,2,'20:00:00',55000),(2485,1008,27,'22:00:00',55000),(2486,1008,28,'00:00:00',55000),(2487,1009,1,'18:00:00',55000),(2488,1009,2,'20:00:00',55000),(2489,1009,27,'22:00:00',55000),(2490,1009,28,'00:00:00',55000),(2491,1010,1,'18:00:00',55000),(2492,1010,2,'20:00:00',55000),(2493,1010,27,'22:00:00',55000),(2494,1010,28,'00:00:00',55000),(2495,1011,1,'18:00:00',55000),(2496,1011,2,'20:00:00',55000),(2497,1011,27,'22:00:00',55000),(2498,1011,28,'00:00:00',55000),(2499,1012,1,'18:00:00',55000),(2500,1012,2,'20:00:00',55000),(2501,1012,27,'22:00:00',55000),(2502,1012,28,'00:00:00',55000),(2503,1013,1,'18:00:00',55000),(2504,1013,2,'20:00:00',55000),(2505,1013,27,'22:00:00',55000),(2506,1013,28,'00:00:00',55000),(2507,1014,1,'18:00:00',55000),(2508,1014,2,'20:00:00',55000),(2509,1014,27,'22:00:00',55000),(2510,1014,28,'00:00:00',55000),(2511,1015,1,'18:00:00',55000),(2512,1015,2,'20:00:00',55000),(2513,1015,27,'22:00:00',55000),(2514,1015,28,'00:00:00',55000),(2515,1016,1,'18:00:00',55000),(2516,1016,2,'20:00:00',55000),(2517,1016,27,'22:00:00',55000),(2518,1016,28,'00:00:00',55000),(2519,1017,1,'18:00:00',55000),(2520,1017,2,'20:00:00',55000),(2521,1017,27,'22:00:00',55000),(2522,1017,28,'00:00:00',55000),(2523,1018,1,'18:00:00',55000),(2524,1018,2,'20:00:00',55000),(2525,1018,27,'22:00:00',55000),(2526,1018,28,'00:00:00',55000),(2527,1019,1,'18:00:00',55000),(2528,1019,2,'20:00:00',55000),(2529,1019,27,'22:00:00',55000),(2530,1019,28,'00:00:00',55000),(2531,1020,1,'18:00:00',55000),(2532,1020,2,'20:00:00',55000),(2533,1020,27,'22:00:00',55000),(2534,1020,28,'00:00:00',55000),(2535,1021,1,'18:00:00',55000),(2536,1021,2,'20:00:00',55000),(2537,1021,27,'22:00:00',55000),(2538,1021,28,'00:00:00',55000),(2539,1022,1,'18:00:00',55000),(2540,1022,2,'20:00:00',55000),(2541,1022,27,'22:00:00',55000),(2542,1022,28,'00:00:00',55000),(2543,1023,1,'18:00:00',55000),(2544,1023,2,'20:00:00',55000),(2545,1023,27,'22:00:00',55000),(2546,1023,28,'00:00:00',55000),(2547,1024,1,'18:00:00',55000),(2548,1024,2,'20:00:00',55000),(2549,1024,27,'22:00:00',55000),(2550,1024,28,'00:00:00',55000),(2551,1025,1,'18:00:00',55000),(2552,1025,2,'20:00:00',55000),(2553,1025,27,'22:00:00',55000),(2554,1025,28,'00:00:00',55000),(2555,1026,1,'18:00:00',55000),(2556,1026,2,'20:00:00',55000),(2557,1026,27,'22:00:00',55000),(2558,1026,28,'00:00:00',55000),(2559,1027,1,'18:00:00',55000),(2560,1027,2,'20:00:00',55000),(2561,1027,27,'22:00:00',55000),(2562,1027,28,'00:00:00',55000),(2563,1028,1,'18:00:00',55000),(2564,1028,2,'20:00:00',55000),(2565,1028,27,'22:00:00',55000),(2566,1028,28,'00:00:00',55000),(2567,1029,1,'18:00:00',55000),(2568,1029,2,'20:00:00',55000),(2569,1029,27,'22:00:00',55000),(2570,1029,28,'00:00:00',55000),(2571,1030,1,'18:00:00',55000),(2572,1030,2,'20:00:00',55000),(2573,1030,27,'22:00:00',55000),(2574,1030,28,'00:00:00',55000),(2575,1031,1,'18:00:00',55000),(2576,1031,2,'20:00:00',55000),(2577,1031,27,'22:00:00',55000),(2578,1031,28,'00:00:00',55000),(2579,1032,1,'18:00:00',55000),(2580,1032,2,'20:00:00',55000),(2581,1032,27,'22:00:00',55000),(2582,1032,28,'00:00:00',55000),(2583,1033,1,'18:00:00',55000),(2584,1033,2,'20:00:00',55000),(2585,1033,27,'22:00:00',55000),(2586,1033,28,'00:00:00',55000),(2587,1034,1,'18:00:00',55000),(2588,1034,2,'20:00:00',55000),(2589,1034,27,'22:00:00',55000),(2590,1034,28,'00:00:00',55000),(2591,1035,1,'18:00:00',55000),(2592,1035,2,'20:00:00',55000),(2593,1035,27,'22:00:00',55000),(2594,1035,28,'00:00:00',55000),(2595,1036,1,'18:00:00',55000),(2596,1036,2,'20:00:00',55000),(2597,1036,27,'22:00:00',55000),(2598,1036,28,'00:00:00',55000),(2599,1037,1,'18:00:00',55000),(2600,1037,2,'20:00:00',55000),(2601,1037,27,'22:00:00',55000),(2602,1037,28,'00:00:00',55000),(2603,1038,1,'18:00:00',55000),(2604,1038,2,'20:00:00',55000),(2605,1038,27,'22:00:00',55000),(2606,1038,28,'00:00:00',55000),(2607,1039,1,'18:00:00',55000),(2608,1039,2,'20:00:00',55000),(2609,1039,27,'22:00:00',55000),(2610,1039,28,'00:00:00',55000),(2611,1040,1,'18:00:00',55000),(2612,1040,2,'20:00:00',55000),(2613,1040,27,'22:00:00',55000),(2614,1040,28,'00:00:00',55000),(2615,1041,1,'18:00:00',55000),(2616,1041,2,'20:00:00',55000),(2617,1041,27,'22:00:00',55000),(2618,1041,28,'00:00:00',55000),(2619,1042,1,'18:00:00',55000),(2620,1042,2,'20:00:00',55000),(2621,1042,27,'22:00:00',55000),(2622,1042,28,'00:00:00',55000),(2623,1043,1,'18:00:00',55000),(2624,1043,2,'20:00:00',55000),(2625,1043,27,'22:00:00',55000),(2626,1043,28,'00:00:00',55000),(2627,1044,1,'18:00:00',55000),(2628,1044,2,'20:00:00',55000),(2629,1044,27,'22:00:00',55000),(2630,1044,28,'00:00:00',55000),(2631,1045,1,'18:00:00',55000),(2632,1045,2,'20:00:00',55000),(2633,1045,27,'22:00:00',55000),(2634,1045,28,'00:00:00',55000),(2635,1046,1,'18:00:00',55000),(2636,1046,2,'20:00:00',55000),(2637,1046,27,'22:00:00',55000),(2638,1046,28,'00:00:00',55000),(2639,1047,1,'18:00:00',55000),(2640,1047,2,'20:00:00',55000),(2641,1047,27,'22:00:00',55000),(2642,1047,28,'00:00:00',55000),(2643,1048,1,'18:00:00',55000),(2644,1048,2,'20:00:00',55000),(2645,1048,27,'22:00:00',55000),(2646,1048,28,'00:00:00',55000),(2647,1049,1,'18:00:00',55000),(2648,1049,2,'20:00:00',55000),(2649,1049,27,'22:00:00',55000),(2650,1049,28,'00:00:00',55000),(2651,1050,1,'18:00:00',55000),(2652,1050,2,'20:00:00',55000),(2653,1050,27,'22:00:00',55000),(2654,1050,28,'00:00:00',55000),(2655,1051,1,'18:00:00',55000),(2656,1051,2,'20:00:00',55000),(2657,1051,27,'22:00:00',55000),(2658,1051,28,'00:00:00',55000),(2659,1052,1,'18:00:00',55000),(2660,1052,2,'20:00:00',55000),(2661,1052,27,'22:00:00',55000),(2662,1052,28,'00:00:00',55000),(2663,1053,1,'18:00:00',55000),(2664,1053,2,'20:00:00',55000),(2665,1053,27,'22:00:00',55000),(2666,1053,28,'00:00:00',55000),(2667,1054,1,'18:00:00',55000),(2668,1054,2,'20:00:00',55000),(2669,1054,27,'22:00:00',55000),(2670,1054,28,'00:00:00',55000),(2671,1055,1,'18:00:00',55000),(2672,1055,2,'20:00:00',55000),(2673,1055,27,'22:00:00',55000),(2674,1055,28,'00:00:00',55000),(2675,1056,1,'18:00:00',55000),(2676,1056,2,'20:00:00',55000),(2677,1056,27,'22:00:00',55000),(2678,1056,28,'00:00:00',55000),(2679,1057,1,'18:00:00',55000),(2680,1057,2,'20:00:00',55000),(2681,1057,27,'22:00:00',55000),(2682,1057,28,'00:00:00',55000),(2683,1058,1,'18:00:00',55000),(2684,1058,2,'20:00:00',55000),(2685,1058,27,'22:00:00',55000),(2686,1058,28,'00:00:00',55000),(2687,1059,1,'18:00:00',55000),(2688,1059,2,'20:00:00',55000),(2689,1059,27,'22:00:00',55000),(2690,1059,28,'00:00:00',55000),(2691,1060,1,'18:00:00',55000),(2692,1060,2,'20:00:00',55000),(2693,1060,27,'22:00:00',55000),(2694,1060,28,'00:00:00',55000),(2695,1061,1,'18:00:00',55000),(2696,1061,2,'20:00:00',55000),(2697,1061,27,'22:00:00',55000),(2698,1061,28,'00:00:00',55000),(2699,1062,1,'18:00:00',55000),(2700,1062,2,'20:00:00',55000),(2701,1062,27,'22:00:00',55000),(2702,1062,28,'00:00:00',55000),(2703,1063,1,'18:00:00',55000),(2704,1063,2,'20:00:00',55000),(2705,1063,27,'22:00:00',55000),(2706,1063,28,'00:00:00',55000),(2707,1064,1,'18:00:00',55000),(2708,1064,2,'20:00:00',55000),(2709,1064,27,'22:00:00',55000),(2710,1064,28,'00:00:00',55000),(2711,1065,1,'18:00:00',55000),(2712,1065,2,'20:00:00',55000),(2713,1065,27,'22:00:00',55000),(2714,1065,28,'00:00:00',55000),(2715,1066,1,'18:00:00',55000),(2716,1066,2,'20:00:00',55000),(2717,1066,27,'22:00:00',55000),(2718,1066,28,'00:00:00',55000),(2719,1067,1,'18:00:00',55000),(2720,1067,2,'20:00:00',55000),(2721,1067,27,'22:00:00',55000),(2722,1067,28,'00:00:00',55000),(2723,1068,1,'18:00:00',55000),(2724,1068,2,'20:00:00',55000),(2725,1068,27,'22:00:00',55000),(2726,1068,28,'00:00:00',55000),(2727,1069,1,'18:00:00',55000),(2728,1069,2,'20:00:00',55000),(2729,1069,27,'22:00:00',55000),(2730,1069,28,'00:00:00',55000),(2731,1070,1,'18:00:00',55000),(2732,1070,2,'20:00:00',55000),(2733,1070,27,'22:00:00',55000),(2734,1070,28,'00:00:00',55000),(2735,1071,1,'18:00:00',55000),(2736,1071,2,'20:00:00',55000),(2737,1071,27,'22:00:00',55000),(2738,1071,28,'00:00:00',55000),(2739,1072,1,'18:00:00',55000),(2740,1072,2,'20:00:00',55000),(2741,1072,27,'22:00:00',55000),(2742,1072,28,'00:00:00',55000),(2743,1073,1,'18:00:00',55000),(2744,1073,2,'20:00:00',55000),(2745,1073,27,'22:00:00',55000),(2746,1073,28,'00:00:00',55000),(2747,1074,1,'18:00:00',55000),(2748,1074,2,'20:00:00',55000),(2749,1074,27,'22:00:00',55000),(2750,1074,28,'00:00:00',55000),(2751,1075,1,'18:00:00',55000),(2752,1075,2,'20:00:00',55000),(2753,1075,27,'22:00:00',55000),(2754,1075,28,'00:00:00',55000),(2755,1076,1,'18:00:00',55000),(2756,1076,2,'20:00:00',55000),(2757,1076,27,'22:00:00',55000),(2758,1076,28,'00:00:00',55000),(2759,1077,1,'18:00:00',55000),(2760,1077,2,'20:00:00',55000),(2761,1077,27,'22:00:00',55000),(2762,1077,28,'00:00:00',55000),(2763,1078,1,'18:00:00',55000),(2764,1078,2,'20:00:00',55000),(2765,1078,27,'22:00:00',55000),(2766,1078,28,'00:00:00',55000),(2767,1079,1,'18:00:00',55000),(2768,1079,2,'20:00:00',55000),(2769,1079,27,'22:00:00',55000),(2770,1079,28,'00:00:00',55000),(2771,1080,1,'18:00:00',55000),(2772,1080,2,'20:00:00',55000),(2773,1080,27,'22:00:00',55000),(2774,1080,28,'00:00:00',55000),(2775,1081,1,'18:00:00',55000),(2776,1081,2,'20:00:00',55000),(2777,1081,27,'22:00:00',55000),(2778,1081,28,'00:00:00',55000),(2779,1082,1,'18:00:00',55000),(2780,1082,2,'20:00:00',55000),(2781,1082,27,'22:00:00',55000),(2782,1082,28,'00:00:00',55000),(2783,1083,1,'18:00:00',55000),(2784,1083,2,'20:00:00',55000),(2785,1083,27,'22:00:00',55000),(2786,1083,28,'00:00:00',55000),(2787,1084,1,'18:00:00',55000),(2788,1084,2,'20:00:00',55000),(2789,1084,27,'22:00:00',55000),(2790,1084,28,'00:00:00',55000),(2791,1085,1,'18:00:00',55000),(2792,1085,2,'20:00:00',55000),(2793,1085,27,'22:00:00',55000),(2794,1085,28,'00:00:00',55000),(2795,1086,1,'18:00:00',55000),(2796,1086,2,'20:00:00',55000),(2797,1086,27,'22:00:00',55000),(2798,1086,28,'00:00:00',55000),(2799,1087,1,'18:00:00',55000),(2800,1087,2,'20:00:00',55000),(2801,1087,27,'22:00:00',55000),(2802,1087,28,'00:00:00',55000),(2803,1088,1,'18:00:00',55000),(2804,1088,2,'20:00:00',55000),(2805,1088,27,'22:00:00',55000),(2806,1088,28,'00:00:00',55000),(2807,1089,1,'18:00:00',55000),(2808,1089,2,'20:00:00',55000),(2809,1089,27,'22:00:00',55000),(2810,1089,28,'00:00:00',55000),(2811,1090,1,'18:00:00',55000),(2812,1090,2,'20:00:00',55000),(2813,1090,27,'22:00:00',55000),(2814,1090,28,'00:00:00',55000),(2815,1091,1,'18:00:00',55000),(2816,1091,2,'20:00:00',55000),(2817,1091,27,'22:00:00',55000),(2818,1091,28,'00:00:00',55000),(2819,1092,1,'18:00:00',55000),(2820,1092,2,'20:00:00',55000),(2821,1092,27,'22:00:00',55000),(2822,1092,28,'00:00:00',55000),(2823,1093,1,'18:00:00',55000),(2824,1093,2,'20:00:00',55000),(2825,1093,27,'22:00:00',55000),(2826,1093,28,'00:00:00',55000),(2827,1094,1,'18:00:00',55000),(2828,1094,2,'20:00:00',55000),(2829,1094,27,'22:00:00',55000),(2830,1094,28,'00:00:00',55000),(2831,1095,1,'18:00:00',55000),(2832,1095,2,'20:00:00',55000),(2833,1095,27,'22:00:00',55000),(2834,1095,28,'00:00:00',55000),(2835,1096,1,'18:00:00',55000),(2836,1096,2,'20:00:00',55000),(2837,1096,27,'22:00:00',55000),(2838,1096,28,'00:00:00',55000),(2839,1097,1,'18:00:00',55000),(2840,1097,2,'20:00:00',55000),(2841,1097,27,'22:00:00',55000),(2842,1097,28,'00:00:00',55000),(2843,1098,1,'18:00:00',55000),(2844,1098,2,'20:00:00',55000),(2845,1098,27,'22:00:00',55000),(2846,1098,28,'00:00:00',55000),(2847,1099,1,'18:00:00',55000),(2848,1099,2,'20:00:00',55000),(2849,1099,27,'22:00:00',55000),(2850,1099,28,'00:00:00',55000),(2851,1100,1,'18:00:00',55000),(2852,1100,2,'20:00:00',55000),(2853,1100,27,'22:00:00',55000),(2854,1100,28,'00:00:00',55000),(2855,1101,1,'18:00:00',55000),(2856,1101,2,'20:00:00',55000),(2857,1101,27,'22:00:00',55000),(2858,1101,28,'00:00:00',55000),(2859,1102,1,'18:00:00',55000),(2860,1102,2,'20:00:00',55000),(2861,1102,27,'22:00:00',55000),(2862,1102,28,'00:00:00',55000),(2863,1103,1,'18:00:00',55000),(2864,1103,2,'20:00:00',55000),(2865,1103,27,'22:00:00',55000),(2866,1103,28,'00:00:00',55000),(2867,1104,1,'18:00:00',55000),(2868,1104,2,'20:00:00',55000),(2869,1104,27,'22:00:00',55000),(2870,1104,28,'00:00:00',55000),(2871,1105,1,'18:00:00',55000),(2872,1105,2,'20:00:00',55000),(2873,1105,27,'22:00:00',55000),(2874,1105,28,'00:00:00',55000),(2875,1106,1,'18:00:00',55000),(2876,1106,2,'20:00:00',55000),(2877,1106,27,'22:00:00',55000),(2878,1106,28,'00:00:00',55000),(2879,1107,1,'18:00:00',55000),(2880,1107,2,'20:00:00',55000),(2881,1107,27,'22:00:00',55000),(2882,1107,28,'00:00:00',55000),(2883,1108,1,'18:00:00',55000),(2884,1108,2,'20:00:00',55000),(2885,1108,27,'22:00:00',55000),(2886,1108,28,'00:00:00',55000),(2887,1109,1,'18:00:00',55000),(2888,1109,2,'20:00:00',55000),(2889,1109,27,'22:00:00',55000),(2890,1109,28,'00:00:00',55000),(2891,1110,1,'18:00:00',55000),(2892,1110,2,'20:00:00',55000),(2893,1110,27,'22:00:00',55000),(2894,1110,28,'00:00:00',55000),(2895,1111,1,'18:00:00',55000),(2896,1111,2,'20:00:00',55000),(2897,1111,27,'22:00:00',55000),(2898,1111,28,'00:00:00',55000),(2899,1112,1,'18:00:00',55000),(2900,1112,2,'20:00:00',55000),(2901,1112,27,'22:00:00',55000),(2902,1112,28,'00:00:00',55000),(2903,1113,1,'18:00:00',55000),(2904,1113,2,'20:00:00',55000),(2905,1113,27,'22:00:00',55000),(2906,1113,28,'00:00:00',55000),(2907,1114,1,'18:00:00',55000),(2908,1114,2,'20:00:00',55000),(2909,1114,27,'22:00:00',55000),(2910,1114,28,'00:00:00',55000),(2911,1115,1,'18:00:00',55000),(2912,1115,2,'20:00:00',55000),(2913,1115,27,'22:00:00',55000),(2914,1115,28,'00:00:00',55000),(2915,1116,1,'18:00:00',55000),(2916,1116,2,'20:00:00',55000),(2917,1116,27,'22:00:00',55000),(2918,1116,28,'00:00:00',55000),(2919,1117,1,'18:00:00',55000),(2920,1117,2,'20:00:00',55000),(2921,1117,27,'22:00:00',55000),(2922,1117,28,'00:00:00',55000),(2923,1118,1,'18:00:00',55000),(2924,1118,2,'20:00:00',55000),(2925,1118,27,'22:00:00',55000),(2926,1118,28,'00:00:00',55000),(2927,1119,1,'18:00:00',55000),(2928,1119,2,'20:00:00',55000),(2929,1119,27,'22:00:00',55000),(2930,1119,28,'00:00:00',55000),(2931,1120,1,'18:00:00',55000),(2932,1120,2,'20:00:00',55000),(2933,1120,27,'22:00:00',55000),(2934,1120,28,'00:00:00',55000),(2935,1121,1,'18:00:00',55000),(2936,1121,2,'20:00:00',55000),(2937,1121,27,'22:00:00',55000),(2938,1121,28,'00:00:00',55000),(2939,1122,1,'18:00:00',55000),(2940,1122,2,'20:00:00',55000),(2941,1122,27,'22:00:00',55000),(2942,1122,28,'00:00:00',55000),(2943,1123,1,'18:00:00',55000),(2944,1123,2,'20:00:00',55000),(2945,1123,27,'22:00:00',55000),(2946,1123,28,'00:00:00',55000),(2947,1124,1,'18:00:00',55000),(2948,1124,2,'20:00:00',55000),(2949,1124,27,'22:00:00',55000),(2950,1124,28,'00:00:00',55000),(2951,1125,1,'18:00:00',55000),(2952,1125,2,'20:00:00',55000),(2953,1125,27,'22:00:00',55000),(2954,1125,28,'00:00:00',55000),(2955,1126,1,'18:00:00',55000),(2956,1126,2,'20:00:00',55000),(2957,1126,27,'22:00:00',55000),(2958,1126,28,'00:00:00',55000),(2959,1127,1,'18:00:00',55000),(2960,1127,2,'20:00:00',55000),(2961,1127,27,'22:00:00',55000),(2962,1127,28,'00:00:00',55000),(2963,1128,1,'18:00:00',55000),(2964,1128,2,'20:00:00',55000),(2965,1128,27,'22:00:00',55000),(2966,1128,28,'00:00:00',55000),(2967,1129,1,'18:00:00',55000),(2968,1129,2,'20:00:00',55000),(2969,1129,27,'22:00:00',55000),(2970,1129,28,'00:00:00',55000),(2971,1130,29,'18:00:00',55000),(2972,1130,29,'20:00:00',55000),(2973,1130,29,'22:00:00',55000),(2974,1131,29,'18:00:00',55000),(2975,1131,29,'20:00:00',55000),(2976,1131,29,'22:00:00',55000),(2977,1132,29,'18:00:00',55000),(2978,1132,29,'20:00:00',55000),(2979,1132,29,'22:00:00',55000),(2980,1133,29,'18:00:00',55000),(2981,1133,29,'20:00:00',55000),(2982,1133,29,'22:00:00',55000),(2983,1134,29,'18:00:00',55000),(2984,1134,29,'20:00:00',55000),(2985,1134,29,'22:00:00',55000),(2986,1135,29,'18:00:00',55000),(2987,1135,29,'20:00:00',55000),(2988,1135,29,'22:00:00',55000),(2989,1136,29,'18:00:00',55000),(2990,1136,29,'20:00:00',55000),(2991,1136,29,'22:00:00',55000),(2992,1137,29,'18:00:00',55000),(2993,1137,29,'20:00:00',55000),(2994,1137,29,'22:00:00',55000),(2995,1138,29,'18:00:00',55000),(2996,1138,29,'20:00:00',55000),(2997,1138,29,'22:00:00',55000),(2998,1139,29,'18:00:00',55000),(2999,1139,29,'20:00:00',55000),(3000,1139,29,'22:00:00',55000),(3001,1140,29,'18:00:00',55000),(3002,1140,29,'20:00:00',55000),(3003,1140,29,'22:00:00',55000),(3004,1141,29,'18:00:00',55000),(3005,1141,29,'20:00:00',55000),(3006,1141,29,'22:00:00',55000),(3007,1142,29,'18:00:00',55000),(3008,1142,29,'20:00:00',55000),(3009,1142,29,'22:00:00',55000),(3010,1143,29,'18:00:00',55000),(3011,1143,29,'20:00:00',55000),(3012,1143,29,'22:00:00',55000),(3013,1144,29,'18:00:00',55000),(3014,1144,29,'20:00:00',55000),(3015,1144,29,'22:00:00',55000),(3016,1145,29,'18:00:00',55000),(3017,1145,29,'20:00:00',55000),(3018,1145,29,'22:00:00',55000),(3019,1146,29,'18:00:00',55000),(3020,1146,29,'20:00:00',55000),(3021,1146,29,'22:00:00',55000),(3022,1147,29,'18:00:00',55000),(3023,1147,29,'20:00:00',55000),(3024,1147,29,'22:00:00',55000),(3025,1148,29,'18:00:00',55000),(3026,1148,29,'20:00:00',55000),(3027,1148,29,'22:00:00',55000),(3028,1149,29,'18:00:00',55000),(3029,1149,29,'20:00:00',55000),(3030,1149,29,'22:00:00',55000),(3031,1150,29,'18:00:00',55000),(3032,1150,29,'20:00:00',55000),(3033,1150,29,'22:00:00',55000),(3034,1151,29,'18:00:00',55000),(3035,1151,29,'20:00:00',55000),(3036,1151,29,'22:00:00',55000),(3037,1152,29,'18:00:00',55000),(3038,1152,29,'20:00:00',55000),(3039,1152,29,'22:00:00',55000),(3040,1153,29,'18:00:00',55000),(3041,1153,29,'20:00:00',55000),(3042,1153,29,'22:00:00',55000),(3043,1154,29,'18:00:00',55000),(3044,1154,29,'20:00:00',55000),(3045,1154,29,'22:00:00',55000),(3046,1155,29,'18:00:00',55000),(3047,1155,29,'20:00:00',55000),(3048,1155,29,'22:00:00',55000),(3049,1156,29,'18:00:00',55000),(3050,1156,29,'20:00:00',55000),(3051,1156,29,'22:00:00',55000),(3052,1157,29,'18:00:00',55000),(3053,1157,29,'20:00:00',55000),(3054,1157,29,'22:00:00',55000),(3055,1158,29,'18:00:00',55000),(3056,1158,29,'20:00:00',55000),(3057,1158,29,'22:00:00',55000),(3058,1159,29,'18:00:00',55000),(3059,1159,29,'20:00:00',55000),(3060,1159,29,'22:00:00',55000),(3061,1160,29,'18:00:00',55000),(3062,1160,29,'20:00:00',55000),(3063,1160,29,'22:00:00',55000),(3064,1161,29,'18:00:00',55000),(3065,1161,29,'20:00:00',55000),(3066,1161,29,'22:00:00',55000),(3067,1162,29,'18:00:00',55000),(3068,1162,29,'20:00:00',55000),(3069,1162,29,'22:00:00',55000),(3070,1163,29,'18:00:00',55000),(3071,1163,29,'20:00:00',55000),(3072,1163,29,'22:00:00',55000),(3073,1164,29,'18:00:00',55000),(3074,1164,29,'20:00:00',55000),(3075,1164,29,'22:00:00',55000),(3076,1165,29,'18:00:00',55000),(3077,1165,29,'20:00:00',55000),(3078,1165,29,'22:00:00',55000),(3079,1166,29,'18:00:00',55000),(3080,1166,29,'20:00:00',55000),(3081,1166,29,'22:00:00',55000),(3082,1167,29,'18:00:00',55000),(3083,1167,29,'20:00:00',55000),(3084,1167,29,'22:00:00',55000),(3085,1168,29,'18:00:00',55000),(3086,1168,29,'20:00:00',55000),(3087,1168,29,'22:00:00',55000),(3088,1169,29,'18:00:00',55000),(3089,1169,29,'20:00:00',55000),(3090,1169,29,'22:00:00',55000),(3091,1170,29,'18:00:00',55000),(3092,1170,29,'20:00:00',55000),(3093,1170,29,'22:00:00',55000),(3094,1171,29,'18:00:00',55000),(3095,1171,29,'20:00:00',55000),(3096,1171,29,'22:00:00',55000),(3097,1172,29,'18:00:00',55000),(3098,1172,29,'20:00:00',55000),(3099,1172,29,'22:00:00',55000),(3100,1173,29,'18:00:00',55000),(3101,1173,29,'20:00:00',55000),(3102,1173,29,'22:00:00',55000),(3103,1174,29,'18:00:00',55000),(3104,1174,29,'20:00:00',55000),(3105,1174,29,'22:00:00',55000),(3106,1175,29,'18:00:00',55000),(3107,1175,29,'20:00:00',55000),(3108,1175,29,'22:00:00',55000),(3109,1176,29,'18:00:00',55000),(3110,1176,29,'20:00:00',55000),(3111,1176,29,'22:00:00',55000),(3112,1177,29,'18:00:00',55000),(3113,1177,29,'20:00:00',55000),(3114,1177,29,'22:00:00',55000),(3115,1178,29,'18:00:00',55000),(3116,1178,29,'20:00:00',55000),(3117,1178,29,'22:00:00',55000),(3118,1179,29,'18:00:00',55000),(3119,1179,29,'20:00:00',55000),(3120,1179,29,'22:00:00',55000),(3121,1180,29,'18:00:00',55000),(3122,1180,29,'20:00:00',55000),(3123,1180,29,'22:00:00',55000),(3124,1181,29,'18:00:00',55000),(3125,1181,29,'20:00:00',55000),(3126,1181,29,'22:00:00',55000),(3127,1182,29,'18:00:00',55000),(3128,1182,29,'20:00:00',55000),(3129,1182,29,'22:00:00',55000),(3130,1183,29,'18:00:00',55000),(3131,1183,29,'20:00:00',55000),(3132,1183,29,'22:00:00',55000),(3133,1184,29,'18:00:00',55000),(3134,1184,29,'20:00:00',55000),(3135,1184,29,'22:00:00',55000),(3136,1185,29,'18:00:00',55000),(3137,1185,29,'20:00:00',55000),(3138,1185,29,'22:00:00',55000),(3139,1186,29,'18:00:00',55000),(3140,1186,29,'20:00:00',55000),(3141,1186,29,'22:00:00',55000),(3142,1187,29,'18:00:00',55000),(3143,1187,29,'20:00:00',55000),(3144,1187,29,'22:00:00',55000),(3145,1188,29,'18:00:00',55000),(3146,1188,29,'20:00:00',55000),(3147,1188,29,'22:00:00',55000),(3148,1189,29,'18:00:00',55000),(3149,1189,29,'20:00:00',55000),(3150,1189,29,'22:00:00',55000),(3151,1190,29,'18:00:00',55000),(3152,1190,29,'20:00:00',55000),(3153,1190,29,'22:00:00',55000),(3154,1191,29,'18:00:00',55000),(3155,1191,29,'20:00:00',55000),(3156,1191,29,'22:00:00',55000),(3157,1192,29,'18:00:00',55000),(3158,1192,29,'20:00:00',55000),(3159,1192,29,'22:00:00',55000),(3160,1193,29,'18:00:00',55000),(3161,1193,29,'20:00:00',55000),(3162,1193,29,'22:00:00',55000),(3163,1194,29,'18:00:00',55000),(3164,1194,29,'20:00:00',55000),(3165,1194,29,'22:00:00',55000),(3166,1195,29,'18:00:00',55000),(3167,1195,29,'20:00:00',55000),(3168,1195,29,'22:00:00',55000),(3169,1196,29,'18:00:00',55000),(3170,1196,29,'20:00:00',55000),(3171,1196,29,'22:00:00',55000),(3172,1197,29,'18:00:00',55000),(3173,1197,29,'20:00:00',55000),(3174,1197,29,'22:00:00',55000),(3175,1198,29,'18:00:00',55000),(3176,1198,29,'20:00:00',55000),(3177,1198,29,'22:00:00',55000),(3178,1199,29,'18:00:00',55000),(3179,1199,29,'20:00:00',55000),(3180,1199,29,'22:00:00',55000),(3181,1200,29,'18:00:00',55000),(3182,1200,29,'20:00:00',55000),(3183,1200,29,'22:00:00',55000),(3184,1201,29,'18:00:00',55000),(3185,1201,29,'20:00:00',55000),(3186,1201,29,'22:00:00',55000),(3187,1202,29,'18:00:00',55000),(3188,1202,29,'20:00:00',55000),(3189,1202,29,'22:00:00',55000),(3190,1203,29,'18:00:00',55000),(3191,1203,29,'20:00:00',55000),(3192,1203,29,'22:00:00',55000),(3193,1204,29,'18:00:00',55000),(3194,1204,29,'20:00:00',55000),(3195,1204,29,'22:00:00',55000),(3196,1205,29,'18:00:00',55000),(3197,1205,29,'20:00:00',55000),(3198,1205,29,'22:00:00',55000),(3199,1206,29,'18:00:00',55000),(3200,1206,29,'20:00:00',55000),(3201,1206,29,'22:00:00',55000),(3202,1207,29,'18:00:00',55000),(3203,1207,29,'20:00:00',55000),(3204,1207,29,'22:00:00',55000),(3205,1208,29,'18:00:00',55000),(3206,1208,29,'20:00:00',55000),(3207,1208,29,'22:00:00',55000),(3208,1209,29,'18:00:00',55000),(3209,1209,29,'20:00:00',55000),(3210,1209,29,'22:00:00',55000),(3211,1210,29,'18:00:00',55000),(3212,1210,29,'20:00:00',55000),(3213,1210,29,'22:00:00',55000),(3214,1211,29,'18:00:00',55000),(3215,1211,29,'20:00:00',55000),(3216,1211,29,'22:00:00',55000),(3217,1212,29,'18:00:00',55000),(3218,1212,29,'20:00:00',55000),(3219,1212,29,'22:00:00',55000),(3220,1213,29,'18:00:00',55000),(3221,1213,29,'20:00:00',55000),(3222,1213,29,'22:00:00',55000),(3223,1214,29,'18:00:00',55000),(3224,1214,29,'20:00:00',55000),(3225,1214,29,'22:00:00',55000),(3226,1215,29,'18:00:00',55000),(3227,1215,29,'20:00:00',55000),(3228,1215,29,'22:00:00',55000),(3229,1216,29,'18:00:00',55000),(3230,1216,29,'20:00:00',55000),(3231,1216,29,'22:00:00',55000),(3232,1217,29,'18:00:00',55000),(3233,1217,29,'20:00:00',55000),(3234,1217,29,'22:00:00',55000),(3235,1218,29,'18:00:00',55000),(3236,1218,29,'20:00:00',55000),(3237,1218,29,'22:00:00',55000),(3238,1219,29,'18:00:00',55000),(3239,1219,29,'20:00:00',55000),(3240,1219,29,'22:00:00',55000),(3241,1220,29,'18:00:00',55000),(3242,1220,29,'20:00:00',55000),(3243,1220,29,'22:00:00',55000),(3244,1221,29,'18:00:00',55000),(3245,1221,29,'20:00:00',55000),(3246,1221,29,'22:00:00',55000),(3247,1222,29,'18:00:00',55000),(3248,1222,29,'20:00:00',55000),(3249,1222,29,'22:00:00',55000),(3250,1223,29,'18:00:00',55000),(3251,1223,29,'20:00:00',55000),(3252,1223,29,'22:00:00',55000),(3253,1224,29,'18:00:00',55000),(3254,1224,29,'20:00:00',55000),(3255,1224,29,'22:00:00',55000),(3256,1225,29,'18:00:00',55000),(3257,1225,29,'20:00:00',55000),(3258,1225,29,'22:00:00',55000),(3259,1226,29,'18:00:00',55000),(3260,1226,29,'20:00:00',55000),(3261,1226,29,'22:00:00',55000),(3262,1227,29,'18:00:00',55000),(3263,1227,29,'20:00:00',55000),(3264,1227,29,'22:00:00',55000),(3265,1228,29,'18:00:00',55000),(3266,1228,29,'20:00:00',55000),(3267,1228,29,'22:00:00',55000),(3268,1229,29,'18:00:00',55000),(3269,1229,29,'20:00:00',55000),(3270,1229,29,'22:00:00',55000),(3271,1230,29,'18:00:00',55000),(3272,1230,29,'20:00:00',55000),(3273,1230,29,'22:00:00',55000),(3274,1231,29,'18:00:00',55000),(3275,1231,29,'20:00:00',55000),(3276,1231,29,'22:00:00',55000),(3277,1232,29,'18:00:00',55000),(3278,1232,29,'20:00:00',55000),(3279,1232,29,'22:00:00',55000),(3280,1233,29,'18:00:00',55000),(3281,1233,29,'20:00:00',55000),(3282,1233,29,'22:00:00',55000),(3283,1234,29,'18:00:00',55000),(3284,1234,29,'20:00:00',55000),(3285,1234,29,'22:00:00',55000),(3286,1235,29,'18:00:00',55000),(3287,1235,29,'20:00:00',55000),(3288,1235,29,'22:00:00',55000),(3289,1236,29,'18:00:00',55000),(3290,1236,29,'20:00:00',55000),(3291,1236,29,'22:00:00',55000),(3292,1237,29,'18:00:00',55000),(3293,1237,29,'20:00:00',55000),(3294,1237,29,'22:00:00',55000),(3295,1238,29,'18:00:00',55000),(3296,1238,29,'20:00:00',55000),(3297,1238,29,'22:00:00',55000),(3298,1239,29,'18:00:00',55000),(3299,1239,29,'20:00:00',55000),(3300,1239,29,'22:00:00',55000),(3301,1240,29,'18:00:00',55000),(3302,1240,29,'20:00:00',55000),(3303,1240,29,'22:00:00',55000),(3304,1241,29,'18:00:00',55000),(3305,1241,29,'20:00:00',55000),(3306,1241,29,'22:00:00',55000),(3307,1242,29,'18:00:00',55000),(3308,1242,29,'20:00:00',55000),(3309,1242,29,'22:00:00',55000),(3310,1243,29,'18:00:00',55000),(3311,1243,29,'20:00:00',55000),(3312,1243,29,'22:00:00',55000),(3313,1244,29,'18:00:00',55000),(3314,1244,29,'20:00:00',55000),(3315,1244,29,'22:00:00',55000),(3316,1245,29,'18:00:00',55000),(3317,1245,29,'20:00:00',55000),(3318,1245,29,'22:00:00',55000),(3319,1246,29,'18:00:00',55000),(3320,1246,29,'20:00:00',55000),(3321,1246,29,'22:00:00',55000),(3322,1247,29,'18:00:00',55000),(3323,1247,29,'20:00:00',55000),(3324,1247,29,'22:00:00',55000),(3325,1248,29,'18:00:00',55000),(3326,1248,29,'20:00:00',55000),(3327,1248,29,'22:00:00',55000),(3328,1249,29,'18:00:00',55000),(3329,1249,29,'20:00:00',55000),(3330,1249,29,'22:00:00',55000),(3331,1250,29,'18:00:00',55000),(3332,1250,29,'20:00:00',55000),(3333,1250,29,'22:00:00',55000),(3334,1251,29,'18:00:00',55000),(3335,1251,29,'20:00:00',55000),(3336,1251,29,'22:00:00',55000),(3337,1252,29,'18:00:00',55000),(3338,1252,29,'20:00:00',55000),(3339,1252,29,'22:00:00',55000),(3340,1253,29,'18:00:00',55000),(3341,1253,29,'20:00:00',55000),(3342,1253,29,'22:00:00',55000),(3343,1254,29,'18:00:00',55000),(3344,1254,29,'20:00:00',55000),(3345,1254,29,'22:00:00',55000),(3346,1255,29,'18:00:00',55000),(3347,1255,29,'20:00:00',55000),(3348,1255,29,'22:00:00',55000),(3349,1256,29,'18:00:00',55000),(3350,1256,29,'20:00:00',55000),(3351,1256,29,'22:00:00',55000),(3352,1257,29,'18:00:00',55000),(3353,1257,29,'20:00:00',55000),(3354,1257,29,'22:00:00',55000),(3355,1258,29,'18:00:00',55000),(3356,1258,29,'20:00:00',55000),(3357,1258,29,'22:00:00',55000),(3358,1259,29,'18:00:00',55000),(3359,1259,29,'20:00:00',55000),(3360,1259,29,'22:00:00',55000),(3361,1260,29,'18:00:00',55000),(3362,1260,29,'20:00:00',55000),(3363,1260,29,'22:00:00',55000),(3364,1261,29,'18:00:00',55000),(3365,1261,29,'20:00:00',55000),(3366,1261,29,'22:00:00',55000),(3367,1262,29,'18:00:00',55000),(3368,1262,29,'20:00:00',55000),(3369,1262,29,'22:00:00',55000),(3370,1263,29,'18:00:00',55000),(3371,1263,29,'20:00:00',55000),(3372,1263,29,'22:00:00',55000),(3373,1264,29,'18:00:00',55000),(3374,1264,29,'20:00:00',55000),(3375,1264,29,'22:00:00',55000),(3376,1265,29,'18:00:00',55000),(3377,1265,29,'20:00:00',55000),(3378,1265,29,'22:00:00',55000),(3379,1266,29,'18:00:00',55000),(3380,1266,29,'20:00:00',55000),(3381,1266,29,'22:00:00',55000),(3382,1267,29,'18:00:00',55000),(3383,1267,29,'20:00:00',55000),(3384,1267,29,'22:00:00',55000),(3385,1268,29,'18:00:00',55000),(3386,1268,29,'20:00:00',55000),(3387,1268,29,'22:00:00',55000),(3388,1269,29,'18:00:00',55000),(3389,1269,29,'20:00:00',55000),(3390,1269,29,'22:00:00',55000),(3391,1270,29,'18:00:00',55000),(3392,1270,29,'20:00:00',55000),(3393,1270,29,'22:00:00',55000),(3394,1271,29,'18:00:00',55000),(3395,1271,29,'20:00:00',55000),(3396,1271,29,'22:00:00',55000),(3397,1272,29,'18:00:00',55000),(3398,1272,29,'20:00:00',55000),(3399,1272,29,'22:00:00',55000),(3400,1273,29,'18:00:00',55000),(3401,1273,29,'20:00:00',55000),(3402,1273,29,'22:00:00',55000),(3403,1274,29,'18:00:00',55000),(3404,1274,29,'20:00:00',55000),(3405,1274,29,'22:00:00',55000),(3406,1275,29,'18:00:00',55000),(3407,1275,29,'20:00:00',55000),(3408,1275,29,'22:00:00',55000),(3409,1276,29,'18:00:00',55000),(3410,1276,29,'20:00:00',55000),(3411,1276,29,'22:00:00',55000),(3412,1277,29,'18:00:00',55000),(3413,1277,29,'20:00:00',55000),(3414,1277,29,'22:00:00',55000),(3415,1278,29,'18:00:00',55000),(3416,1278,29,'20:00:00',55000),(3417,1278,29,'22:00:00',55000),(3418,1279,29,'18:00:00',55000),(3419,1279,29,'20:00:00',55000),(3420,1279,29,'22:00:00',55000),(3421,1280,29,'18:00:00',55000),(3422,1280,29,'20:00:00',55000),(3423,1280,29,'22:00:00',55000),(3424,1281,29,'18:00:00',55000),(3425,1281,29,'20:00:00',55000),(3426,1281,29,'22:00:00',55000),(3427,1282,29,'18:00:00',55000),(3428,1282,29,'20:00:00',55000),(3429,1282,29,'22:00:00',55000),(3430,1283,29,'18:00:00',55000),(3431,1283,29,'20:00:00',55000),(3432,1283,29,'22:00:00',55000),(3433,1284,29,'18:00:00',55000),(3434,1284,29,'20:00:00',55000),(3435,1284,29,'22:00:00',55000),(3436,1285,29,'18:00:00',55000),(3437,1285,29,'20:00:00',55000),(3438,1285,29,'22:00:00',55000),(3439,1286,29,'18:00:00',55000),(3440,1286,29,'20:00:00',55000),(3441,1286,29,'22:00:00',55000),(3442,1287,29,'18:00:00',55000),(3443,1287,29,'20:00:00',55000),(3444,1287,29,'22:00:00',55000),(3445,1288,29,'18:00:00',55000),(3446,1288,29,'20:00:00',55000),(3447,1288,29,'22:00:00',55000),(3448,1289,29,'18:00:00',55000),(3449,1289,29,'20:00:00',55000),(3450,1289,29,'22:00:00',55000),(3451,1290,29,'18:00:00',55000),(3452,1290,29,'20:00:00',55000),(3453,1290,29,'22:00:00',55000),(3454,1291,29,'18:00:00',55000),(3455,1291,29,'20:00:00',55000),(3456,1291,29,'22:00:00',55000),(3457,1292,29,'18:00:00',55000),(3458,1292,29,'20:00:00',55000),(3459,1292,29,'22:00:00',55000),(3460,1293,29,'18:00:00',55000),(3461,1293,29,'20:00:00',55000),(3462,1293,29,'22:00:00',55000),(3463,1294,29,'18:00:00',55000),(3464,1294,29,'20:00:00',55000),(3465,1294,29,'22:00:00',55000),(3466,1295,29,'18:00:00',55000),(3467,1295,29,'20:00:00',55000),(3468,1295,29,'22:00:00',55000),(3469,1296,29,'18:00:00',55000),(3470,1296,29,'20:00:00',55000),(3471,1296,29,'22:00:00',55000),(3472,1297,29,'18:00:00',55000),(3473,1297,29,'20:00:00',55000),(3474,1297,29,'22:00:00',55000),(3475,1298,29,'18:00:00',55000),(3476,1298,29,'20:00:00',55000),(3477,1298,29,'22:00:00',55000),(3478,1299,29,'18:00:00',55000),(3479,1299,29,'20:00:00',55000),(3480,1299,29,'22:00:00',55000),(3481,1300,29,'18:00:00',55000),(3482,1300,29,'20:00:00',55000),(3483,1300,29,'22:00:00',55000),(3484,1301,29,'18:00:00',55000),(3485,1301,29,'20:00:00',55000),(3486,1301,29,'22:00:00',55000),(3487,1302,29,'18:00:00',55000),(3488,1302,29,'20:00:00',55000),(3489,1302,29,'22:00:00',55000),(3490,1303,29,'18:00:00',55000),(3491,1303,29,'20:00:00',55000),(3492,1303,29,'22:00:00',55000),(3493,1304,29,'18:00:00',55000),(3494,1304,29,'20:00:00',55000),(3495,1304,29,'22:00:00',55000),(3496,1305,29,'18:00:00',55000),(3497,1305,29,'20:00:00',55000),(3498,1305,29,'22:00:00',55000),(3499,1306,29,'18:00:00',55000),(3500,1306,29,'20:00:00',55000),(3501,1306,29,'22:00:00',55000),(3502,1307,29,'18:00:00',55000),(3503,1307,29,'20:00:00',55000),(3504,1307,29,'22:00:00',55000),(3505,1308,29,'18:00:00',55000),(3506,1308,29,'20:00:00',55000),(3507,1308,29,'22:00:00',55000),(3508,1309,29,'18:00:00',55000),(3509,1309,29,'20:00:00',55000),(3510,1309,29,'22:00:00',55000),(3511,1310,29,'18:00:00',55000),(3512,1310,29,'20:00:00',55000),(3513,1310,29,'22:00:00',55000),(3514,1311,29,'18:00:00',55000),(3515,1311,29,'20:00:00',55000),(3516,1311,29,'22:00:00',55000),(3517,1312,29,'18:00:00',55000),(3518,1312,29,'20:00:00',55000),(3519,1312,29,'22:00:00',55000),(3520,1313,29,'18:00:00',55000),(3521,1313,29,'20:00:00',55000),(3522,1313,29,'22:00:00',55000),(3523,1314,29,'18:00:00',55000),(3524,1314,29,'20:00:00',55000),(3525,1314,29,'22:00:00',55000),(3526,1315,29,'18:00:00',55000),(3527,1315,29,'20:00:00',55000),(3528,1315,29,'22:00:00',55000),(3529,1316,29,'18:00:00',55000),(3530,1316,29,'20:00:00',55000),(3531,1316,29,'22:00:00',55000),(3532,1317,29,'18:00:00',55000),(3533,1317,29,'20:00:00',55000),(3534,1317,29,'22:00:00',55000),(3535,1318,29,'18:00:00',55000),(3536,1318,29,'20:00:00',55000),(3537,1318,29,'22:00:00',55000),(3538,1319,29,'18:00:00',55000),(3539,1319,29,'20:00:00',55000),(3540,1319,29,'22:00:00',55000),(3541,1320,29,'18:00:00',55000),(3542,1320,29,'20:00:00',55000),(3543,1320,29,'22:00:00',55000),(3544,1321,29,'18:00:00',55000),(3545,1321,29,'20:00:00',55000),(3546,1321,29,'22:00:00',55000),(3547,1322,29,'18:00:00',55000),(3548,1322,29,'20:00:00',55000),(3549,1322,29,'22:00:00',55000),(3550,1323,29,'18:00:00',55000),(3551,1323,29,'20:00:00',55000),(3552,1323,29,'22:00:00',55000),(3553,1324,29,'18:00:00',55000),(3554,1324,29,'20:00:00',55000),(3555,1324,29,'22:00:00',55000),(3556,1325,29,'18:00:00',55000),(3557,1325,29,'20:00:00',55000),(3558,1325,29,'22:00:00',55000),(3559,1326,29,'18:00:00',55000),(3560,1326,29,'20:00:00',55000),(3561,1326,29,'22:00:00',55000),(3562,1327,29,'18:00:00',55000),(3563,1327,29,'20:00:00',55000),(3564,1327,29,'22:00:00',55000),(3565,1328,29,'18:00:00',55000),(3566,1328,29,'20:00:00',55000),(3567,1328,29,'22:00:00',55000),(3568,1329,29,'18:00:00',55000),(3569,1329,29,'20:00:00',55000),(3570,1329,29,'22:00:00',55000),(3571,1330,29,'18:00:00',55000),(3572,1330,29,'20:00:00',55000),(3573,1330,29,'22:00:00',55000),(3574,1331,29,'18:00:00',55000),(3575,1331,29,'20:00:00',55000),(3576,1331,29,'22:00:00',55000),(3577,1332,29,'18:00:00',55000),(3578,1332,29,'20:00:00',55000),(3579,1332,29,'22:00:00',55000),(3580,1333,29,'18:00:00',55000),(3581,1333,29,'20:00:00',55000),(3582,1333,29,'22:00:00',55000),(3583,1334,29,'18:00:00',55000),(3584,1334,29,'20:00:00',55000),(3585,1334,29,'22:00:00',55000),(3586,1335,29,'18:00:00',55000),(3587,1335,29,'20:00:00',55000),(3588,1335,29,'22:00:00',55000),(3589,1336,29,'18:00:00',55000),(3590,1336,29,'20:00:00',55000),(3591,1336,29,'22:00:00',55000),(3592,1337,29,'18:00:00',55000),(3593,1337,29,'20:00:00',55000),(3594,1337,29,'22:00:00',55000),(3595,1338,29,'18:00:00',55000),(3596,1338,29,'20:00:00',55000),(3597,1338,29,'22:00:00',55000),(3598,1339,29,'18:00:00',55000),(3599,1339,29,'20:00:00',55000),(3600,1339,29,'22:00:00',55000),(3601,1340,29,'18:00:00',55000),(3602,1340,29,'20:00:00',55000),(3603,1340,29,'22:00:00',55000),(3604,1341,29,'18:00:00',55000),(3605,1341,29,'20:00:00',55000),(3606,1341,29,'22:00:00',55000),(3607,1342,29,'18:00:00',55000),(3608,1342,29,'20:00:00',55000),(3609,1342,29,'22:00:00',55000),(3610,1343,29,'18:00:00',55000),(3611,1343,29,'20:00:00',55000),(3612,1343,29,'22:00:00',55000),(3613,1344,29,'18:00:00',55000),(3614,1344,29,'20:00:00',55000),(3615,1344,29,'22:00:00',55000),(3616,1345,29,'18:00:00',55000),(3617,1345,29,'20:00:00',55000),(3618,1345,29,'22:00:00',55000),(3619,1346,29,'18:00:00',55000),(3620,1346,29,'20:00:00',55000),(3621,1346,29,'22:00:00',55000),(3622,1347,29,'18:00:00',55000),(3623,1347,29,'20:00:00',55000),(3624,1347,29,'22:00:00',55000),(3625,1348,29,'18:00:00',55000),(3626,1348,29,'20:00:00',55000),(3627,1348,29,'22:00:00',55000),(3628,1349,29,'18:00:00',55000),(3629,1349,29,'20:00:00',55000),(3630,1349,29,'22:00:00',55000),(3631,1350,29,'18:00:00',55000),(3632,1350,29,'20:00:00',55000),(3633,1350,29,'22:00:00',55000),(3634,1351,29,'18:00:00',55000),(3635,1351,29,'20:00:00',55000),(3636,1351,29,'22:00:00',55000),(3637,1352,29,'18:00:00',55000),(3638,1352,29,'20:00:00',55000),(3639,1352,29,'22:00:00',55000),(3640,1353,29,'18:00:00',55000),(3641,1353,29,'20:00:00',55000),(3642,1353,29,'22:00:00',55000),(3643,1354,29,'18:00:00',55000),(3644,1354,29,'20:00:00',55000),(3645,1354,29,'22:00:00',55000),(3646,1355,29,'18:00:00',55000),(3647,1355,29,'20:00:00',55000),(3648,1355,29,'22:00:00',55000),(3649,1356,29,'18:00:00',55000),(3650,1356,29,'20:00:00',55000),(3651,1356,29,'22:00:00',55000),(3652,1357,29,'18:00:00',55000),(3653,1357,29,'20:00:00',55000),(3654,1357,29,'22:00:00',55000),(3655,1358,29,'18:00:00',55000),(3656,1358,29,'20:00:00',55000),(3657,1358,29,'22:00:00',55000),(3658,1359,29,'18:00:00',55000),(3659,1359,29,'20:00:00',55000),(3660,1359,29,'22:00:00',55000),(3661,1360,29,'18:00:00',55000),(3662,1360,29,'20:00:00',55000),(3663,1360,29,'22:00:00',55000),(3664,1361,29,'18:00:00',55000),(3665,1361,29,'20:00:00',55000),(3666,1361,29,'22:00:00',55000),(3667,1362,29,'18:00:00',55000),(3668,1362,29,'20:00:00',55000),(3669,1362,29,'22:00:00',55000),(3670,1363,29,'18:00:00',55000),(3671,1363,29,'20:00:00',55000),(3672,1363,29,'22:00:00',55000),(3673,1364,29,'18:00:00',55000),(3674,1364,29,'20:00:00',55000),(3675,1364,29,'22:00:00',55000),(3676,1365,29,'18:00:00',55000),(3677,1365,29,'20:00:00',55000),(3678,1365,29,'22:00:00',55000),(3679,1366,29,'18:00:00',55000),(3680,1366,29,'20:00:00',55000),(3681,1366,29,'22:00:00',55000),(3682,1367,29,'18:00:00',55000),(3683,1367,29,'20:00:00',55000),(3684,1367,29,'22:00:00',55000),(3685,1368,29,'18:00:00',55000),(3686,1368,29,'20:00:00',55000),(3687,1368,29,'22:00:00',55000),(3688,1369,29,'18:00:00',55000),(3689,1369,29,'20:00:00',55000),(3690,1369,29,'22:00:00',55000),(3691,1370,29,'18:00:00',55000),(3692,1370,29,'20:00:00',55000),(3693,1370,29,'22:00:00',55000),(3694,1371,29,'18:00:00',55000),(3695,1371,29,'20:00:00',55000),(3696,1371,29,'22:00:00',55000),(3697,1372,29,'18:00:00',55000),(3698,1372,29,'20:00:00',55000),(3699,1372,29,'22:00:00',55000),(3700,1373,29,'18:00:00',55000),(3701,1373,29,'20:00:00',55000),(3702,1373,29,'22:00:00',55000),(3703,1374,29,'18:00:00',55000),(3704,1374,29,'20:00:00',55000),(3705,1374,29,'22:00:00',55000),(3706,1375,29,'18:00:00',55000),(3707,1375,29,'20:00:00',55000),(3708,1375,29,'22:00:00',55000),(3709,1376,29,'18:00:00',55000),(3710,1376,29,'20:00:00',55000),(3711,1376,29,'22:00:00',55000),(3712,1377,29,'18:00:00',55000),(3713,1377,29,'20:00:00',55000),(3714,1377,29,'22:00:00',55000),(3715,1378,29,'18:00:00',55000),(3716,1378,29,'20:00:00',55000),(3717,1378,29,'22:00:00',55000),(3718,1379,29,'18:00:00',55000),(3719,1379,29,'20:00:00',55000),(3720,1379,29,'22:00:00',55000),(3721,1380,29,'18:00:00',55000),(3722,1380,29,'20:00:00',55000),(3723,1380,29,'22:00:00',55000),(3724,1381,29,'18:00:00',55000),(3725,1381,29,'20:00:00',55000),(3726,1381,29,'22:00:00',55000),(3727,1382,29,'18:00:00',55000),(3728,1382,29,'20:00:00',55000),(3729,1382,29,'22:00:00',55000),(3730,1383,29,'18:00:00',55000),(3731,1383,29,'20:00:00',55000),(3732,1383,29,'22:00:00',55000),(3733,1384,29,'18:00:00',55000),(3734,1384,29,'20:00:00',55000),(3735,1384,29,'22:00:00',55000),(3736,1385,29,'18:00:00',55000),(3737,1385,29,'20:00:00',55000),(3738,1385,29,'22:00:00',55000),(3739,1386,29,'18:00:00',55000),(3740,1386,29,'20:00:00',55000),(3741,1386,29,'22:00:00',55000),(3742,1387,29,'18:00:00',55000),(3743,1387,29,'20:00:00',55000),(3744,1387,29,'22:00:00',55000),(3745,1388,29,'18:00:00',55000),(3746,1388,29,'20:00:00',55000),(3747,1388,29,'22:00:00',55000),(3748,1389,29,'18:00:00',55000),(3749,1389,29,'20:00:00',55000),(3750,1389,29,'22:00:00',55000),(3751,1390,29,'18:00:00',55000),(3752,1390,29,'20:00:00',55000),(3753,1390,29,'22:00:00',55000),(3754,1391,29,'18:00:00',55000),(3755,1391,29,'20:00:00',55000),(3756,1391,29,'22:00:00',55000),(3757,1392,29,'18:00:00',55000),(3758,1392,29,'20:00:00',55000),(3759,1392,29,'22:00:00',55000),(3760,1393,29,'18:00:00',55000),(3761,1393,29,'20:00:00',55000),(3762,1393,29,'22:00:00',55000),(3763,1394,29,'18:00:00',55000),(3764,1394,29,'20:00:00',55000),(3765,1394,29,'22:00:00',55000),(3766,1395,29,'18:00:00',55000),(3767,1395,29,'20:00:00',55000),(3768,1395,29,'22:00:00',55000),(3769,1396,29,'18:00:00',55000),(3770,1396,29,'20:00:00',55000),(3771,1396,29,'22:00:00',55000),(3772,1397,29,'18:00:00',55000),(3773,1397,29,'20:00:00',55000),(3774,1397,29,'22:00:00',55000),(3775,1398,29,'18:00:00',55000),(3776,1398,29,'20:00:00',55000),(3777,1398,29,'22:00:00',55000),(3778,1399,29,'18:00:00',55000),(3779,1399,29,'20:00:00',55000),(3780,1399,29,'22:00:00',55000),(3781,1400,29,'18:00:00',55000),(3782,1400,29,'20:00:00',55000),(3783,1400,29,'22:00:00',55000),(3784,1401,29,'18:00:00',55000),(3785,1401,29,'20:00:00',55000),(3786,1401,29,'22:00:00',55000),(3787,1402,29,'18:00:00',55000),(3788,1402,29,'20:00:00',55000),(3789,1402,29,'22:00:00',55000),(3790,1403,29,'18:00:00',55000),(3791,1403,29,'20:00:00',55000),(3792,1403,29,'22:00:00',55000),(3793,1404,29,'18:00:00',55000),(3794,1404,29,'20:00:00',55000),(3795,1404,29,'22:00:00',55000),(3796,1405,29,'18:00:00',55000),(3797,1405,29,'20:00:00',55000),(3798,1405,29,'22:00:00',55000),(3799,1406,29,'18:00:00',55000),(3800,1406,29,'20:00:00',55000),(3801,1406,29,'22:00:00',55000),(3802,1407,29,'18:00:00',55000),(3803,1407,29,'20:00:00',55000),(3804,1407,29,'22:00:00',55000),(3805,1408,29,'18:00:00',55000),(3806,1408,29,'20:00:00',55000),(3807,1408,29,'22:00:00',55000),(3808,1409,29,'18:00:00',55000),(3809,1409,29,'20:00:00',55000),(3810,1409,29,'22:00:00',55000),(3811,1410,29,'18:00:00',55000),(3812,1410,29,'20:00:00',55000),(3813,1410,29,'22:00:00',55000),(3814,1411,29,'18:00:00',55000),(3815,1411,29,'20:00:00',55000),(3816,1411,29,'22:00:00',55000),(3817,1412,29,'18:00:00',55000),(3818,1412,29,'20:00:00',55000),(3819,1412,29,'22:00:00',55000),(3820,1413,29,'18:00:00',55000),(3821,1413,29,'20:00:00',55000),(3822,1413,29,'22:00:00',55000),(3823,1414,29,'18:00:00',55000),(3824,1414,29,'20:00:00',55000),(3825,1414,29,'22:00:00',55000),(3826,1415,29,'18:00:00',55000),(3827,1415,29,'20:00:00',55000),(3828,1415,29,'22:00:00',55000),(3829,1416,29,'18:00:00',55000),(3830,1416,29,'20:00:00',55000),(3831,1416,29,'22:00:00',55000),(3832,1417,29,'18:00:00',55000),(3833,1417,29,'20:00:00',55000),(3834,1417,29,'22:00:00',55000),(3835,1418,29,'18:00:00',55000),(3836,1418,29,'20:00:00',55000),(3837,1418,29,'22:00:00',55000),(3838,1419,29,'18:00:00',55000),(3839,1419,29,'20:00:00',55000),(3840,1419,29,'22:00:00',55000),(3841,1420,29,'18:00:00',55000),(3842,1420,29,'20:00:00',55000),(3843,1420,29,'22:00:00',55000),(3844,1421,29,'18:00:00',55000),(3845,1421,29,'20:00:00',55000),(3846,1421,29,'22:00:00',55000),(3847,1422,29,'18:00:00',55000),(3848,1422,29,'20:00:00',55000),(3849,1422,29,'22:00:00',55000),(3850,1423,29,'18:00:00',55000),(3851,1423,29,'20:00:00',55000),(3852,1423,29,'22:00:00',55000),(3853,1424,29,'18:00:00',55000),(3854,1424,29,'20:00:00',55000),(3855,1424,29,'22:00:00',55000),(3856,1425,29,'18:00:00',55000),(3857,1425,29,'20:00:00',55000),(3858,1425,29,'22:00:00',55000),(3859,1426,29,'18:00:00',55000),(3860,1426,29,'20:00:00',55000),(3861,1426,29,'22:00:00',55000),(3862,1427,29,'18:00:00',55000),(3863,1427,29,'20:00:00',55000),(3864,1427,29,'22:00:00',55000),(3865,1428,29,'18:00:00',55000),(3866,1428,29,'20:00:00',55000),(3867,1428,29,'22:00:00',55000),(3868,1429,29,'18:00:00',55000),(3869,1429,29,'20:00:00',55000),(3870,1429,29,'22:00:00',55000),(3871,1430,29,'18:00:00',55000),(3872,1430,29,'20:00:00',55000),(3873,1430,29,'22:00:00',55000),(3874,1431,29,'18:00:00',55000),(3875,1431,29,'20:00:00',55000),(3876,1431,29,'22:00:00',55000),(3877,1432,29,'18:00:00',55000),(3878,1432,29,'20:00:00',55000),(3879,1432,29,'22:00:00',55000),(3880,1433,29,'18:00:00',55000),(3881,1433,29,'20:00:00',55000),(3882,1433,29,'22:00:00',55000),(3883,1434,29,'18:00:00',55000),(3884,1434,29,'20:00:00',55000),(3885,1434,29,'22:00:00',55000),(3886,1435,29,'18:00:00',55000),(3887,1435,29,'20:00:00',55000),(3888,1435,29,'22:00:00',55000),(3889,1436,29,'18:00:00',55000),(3890,1436,29,'20:00:00',55000),(3891,1436,29,'22:00:00',55000),(3892,1437,29,'18:00:00',55000),(3893,1437,29,'20:00:00',55000),(3894,1437,29,'22:00:00',55000),(3895,1438,29,'18:00:00',55000),(3896,1438,29,'20:00:00',55000),(3897,1438,29,'22:00:00',55000),(3898,1439,29,'18:00:00',55000),(3899,1439,29,'20:00:00',55000),(3900,1439,29,'22:00:00',55000),(3901,1440,29,'18:00:00',55000),(3902,1440,29,'20:00:00',55000),(3903,1440,29,'22:00:00',55000),(3904,1441,29,'18:00:00',55000),(3905,1441,29,'20:00:00',55000),(3906,1441,29,'22:00:00',55000),(3907,1442,29,'18:00:00',55000),(3908,1442,29,'20:00:00',55000),(3909,1442,29,'22:00:00',55000),(3910,1443,29,'18:00:00',55000),(3911,1443,29,'20:00:00',55000),(3912,1443,29,'22:00:00',55000),(3913,1444,29,'18:00:00',55000),(3914,1444,29,'20:00:00',55000),(3915,1444,29,'22:00:00',55000),(3916,1445,29,'18:00:00',55000),(3917,1445,29,'20:00:00',55000),(3918,1445,29,'22:00:00',55000),(3919,1446,29,'18:00:00',55000),(3920,1446,29,'20:00:00',55000),(3921,1446,29,'22:00:00',55000),(3922,1447,29,'18:00:00',55000),(3923,1447,29,'20:00:00',55000),(3924,1447,29,'22:00:00',55000),(3925,1448,29,'18:00:00',55000),(3926,1448,29,'20:00:00',55000),(3927,1448,29,'22:00:00',55000),(3928,1449,29,'18:00:00',55000),(3929,1449,29,'20:00:00',55000),(3930,1449,29,'22:00:00',55000),(3931,1450,29,'18:00:00',55000),(3932,1450,29,'20:00:00',55000),(3933,1450,29,'22:00:00',55000),(3934,1451,29,'18:00:00',55000),(3935,1451,29,'20:00:00',55000),(3936,1451,29,'22:00:00',55000),(3937,1452,29,'18:00:00',55000),(3938,1452,29,'20:00:00',55000),(3939,1452,29,'22:00:00',55000),(3940,1453,29,'18:00:00',55000),(3941,1453,29,'20:00:00',55000),(3942,1453,29,'22:00:00',55000),(3943,1454,29,'18:00:00',55000),(3944,1454,29,'20:00:00',55000),(3945,1454,29,'22:00:00',55000),(3946,1455,29,'18:00:00',55000),(3947,1455,29,'20:00:00',55000),(3948,1455,29,'22:00:00',55000),(3949,1456,29,'18:00:00',55000),(3950,1456,29,'20:00:00',55000),(3951,1456,29,'22:00:00',55000),(3952,1457,29,'18:00:00',55000),(3953,1457,29,'20:00:00',55000),(3954,1457,29,'22:00:00',55000),(3955,1458,29,'18:00:00',55000),(3956,1458,29,'20:00:00',55000),(3957,1458,29,'22:00:00',55000),(3958,1459,29,'18:00:00',55000),(3959,1459,29,'20:00:00',55000),(3960,1459,29,'22:00:00',55000),(3961,1460,29,'18:00:00',55000),(3962,1460,29,'20:00:00',55000),(3963,1460,29,'22:00:00',55000),(3964,1461,29,'18:00:00',55000),(3965,1461,29,'20:00:00',55000),(3966,1461,29,'22:00:00',55000),(3967,1462,29,'18:00:00',55000),(3968,1462,29,'20:00:00',55000),(3969,1462,29,'22:00:00',55000),(3970,1463,29,'18:00:00',55000),(3971,1463,29,'20:00:00',55000),(3972,1463,29,'22:00:00',55000),(3973,1464,29,'18:00:00',55000),(3974,1464,29,'20:00:00',55000),(3975,1464,29,'22:00:00',55000),(3976,1465,29,'18:00:00',55000),(3977,1465,29,'20:00:00',55000),(3978,1465,29,'22:00:00',55000),(3979,1466,29,'18:00:00',55000),(3980,1466,29,'20:00:00',55000),(3981,1466,29,'22:00:00',55000),(3982,1467,29,'18:00:00',55000),(3983,1467,29,'20:00:00',55000),(3984,1467,29,'22:00:00',55000),(3985,1468,29,'18:00:00',55000),(3986,1468,29,'20:00:00',55000),(3987,1468,29,'22:00:00',55000),(3988,1469,29,'18:00:00',55000),(3989,1469,29,'20:00:00',55000),(3990,1469,29,'22:00:00',55000),(3991,1470,29,'18:00:00',55000),(3992,1470,29,'20:00:00',55000),(3993,1470,29,'22:00:00',55000),(3994,1471,29,'18:00:00',55000),(3995,1471,29,'20:00:00',55000),(3996,1471,29,'22:00:00',55000),(3997,1472,29,'18:00:00',55000),(3998,1472,29,'20:00:00',55000),(3999,1472,29,'22:00:00',55000),(4000,1473,29,'18:00:00',55000),(4001,1473,29,'20:00:00',55000),(4002,1473,29,'22:00:00',55000),(4003,1474,29,'18:00:00',55000),(4004,1474,29,'20:00:00',55000),(4005,1474,29,'22:00:00',55000),(4006,1475,29,'18:00:00',55000),(4007,1475,29,'20:00:00',55000),(4008,1475,29,'22:00:00',55000),(4009,1476,29,'18:00:00',55000),(4010,1476,29,'20:00:00',55000),(4011,1476,29,'22:00:00',55000),(4012,1477,29,'18:00:00',55000),(4013,1477,29,'20:00:00',55000),(4014,1477,29,'22:00:00',55000),(4015,1478,29,'18:00:00',55000),(4016,1478,29,'20:00:00',55000),(4017,1478,29,'22:00:00',55000),(4018,1479,29,'18:00:00',55000),(4019,1479,29,'20:00:00',55000),(4020,1479,29,'22:00:00',55000),(4021,1480,29,'18:00:00',55000),(4022,1480,29,'20:00:00',55000),(4023,1480,29,'22:00:00',55000),(4024,1481,29,'18:00:00',55000),(4025,1481,29,'20:00:00',55000),(4026,1481,29,'22:00:00',55000),(4027,1482,29,'18:00:00',55000),(4028,1482,29,'20:00:00',55000),(4029,1482,29,'22:00:00',55000),(4030,1483,29,'18:00:00',55000),(4031,1483,29,'20:00:00',55000),(4032,1483,29,'22:00:00',55000),(4033,1484,29,'18:00:00',55000),(4034,1484,29,'20:00:00',55000),(4035,1484,29,'22:00:00',55000),(4036,1485,29,'18:00:00',55000),(4037,1485,29,'20:00:00',55000),(4038,1485,29,'22:00:00',55000),(4039,1486,29,'18:00:00',55000),(4040,1486,29,'20:00:00',55000),(4041,1486,29,'22:00:00',55000),(4042,1487,29,'18:00:00',55000),(4043,1487,29,'20:00:00',55000),(4044,1487,29,'22:00:00',55000),(4045,1488,29,'18:00:00',55000),(4046,1488,29,'20:00:00',55000),(4047,1488,29,'22:00:00',55000),(4048,1489,29,'18:00:00',55000),(4049,1489,29,'20:00:00',55000),(4050,1489,29,'22:00:00',55000),(4051,1490,29,'18:00:00',55000),(4052,1490,29,'20:00:00',55000),(4053,1490,29,'22:00:00',55000),(4054,1491,29,'18:00:00',55000),(4055,1491,29,'20:00:00',55000),(4056,1491,29,'22:00:00',55000),(4057,1492,29,'18:00:00',55000),(4058,1492,29,'20:00:00',55000),(4059,1492,29,'22:00:00',55000),(4060,1493,29,'18:00:00',55000),(4061,1493,29,'20:00:00',55000),(4062,1493,29,'22:00:00',55000),(4063,1494,29,'18:00:00',55000),(4064,1494,29,'20:00:00',55000),(4065,1494,29,'22:00:00',55000),(4066,1495,29,'18:00:00',55000),(4067,1495,29,'20:00:00',55000),(4068,1495,29,'22:00:00',55000),(4069,1496,29,'18:00:00',55000),(4070,1496,29,'20:00:00',55000),(4071,1496,29,'22:00:00',55000),(4072,1497,29,'18:00:00',55000),(4073,1497,29,'20:00:00',55000),(4074,1497,29,'22:00:00',55000),(4075,1498,29,'18:00:00',55000),(4076,1498,29,'20:00:00',55000),(4077,1498,29,'22:00:00',55000),(4078,1499,29,'18:00:00',55000),(4079,1499,29,'20:00:00',55000),(4080,1499,29,'22:00:00',55000),(4081,1500,29,'18:00:00',55000),(4082,1500,29,'20:00:00',55000),(4083,1500,29,'22:00:00',55000),(4084,1501,29,'18:00:00',55000),(4085,1501,29,'20:00:00',55000),(4086,1501,29,'22:00:00',55000),(4087,1502,29,'18:00:00',55000),(4088,1502,29,'20:00:00',55000),(4089,1502,29,'22:00:00',55000),(4090,1503,29,'18:00:00',55000),(4091,1503,29,'20:00:00',55000),(4092,1503,29,'22:00:00',55000),(4093,1504,29,'18:00:00',55000),(4094,1504,29,'20:00:00',55000),(4095,1504,29,'22:00:00',55000),(4096,1505,29,'18:00:00',55000),(4097,1505,29,'20:00:00',55000),(4098,1505,29,'22:00:00',55000),(4099,1506,29,'18:00:00',55000),(4100,1506,29,'20:00:00',55000),(4101,1506,29,'22:00:00',55000),(4102,1507,29,'18:00:00',55000),(4103,1507,29,'20:00:00',55000),(4104,1507,29,'22:00:00',55000),(4105,1508,29,'18:00:00',55000),(4106,1508,29,'20:00:00',55000),(4107,1508,29,'22:00:00',55000),(4108,1509,29,'18:00:00',55000),(4109,1509,29,'20:00:00',55000),(4110,1509,29,'22:00:00',55000),(4111,1510,29,'18:00:00',55000),(4112,1510,29,'20:00:00',55000),(4113,1510,29,'22:00:00',55000),(4114,1511,29,'18:00:00',55000),(4115,1511,29,'20:00:00',55000),(4116,1511,29,'22:00:00',55000),(4117,1512,29,'18:00:00',55000),(4118,1512,29,'20:00:00',55000),(4119,1512,29,'22:00:00',55000),(4120,1513,29,'18:00:00',55000),(4121,1513,29,'20:00:00',55000),(4122,1513,29,'22:00:00',55000),(4123,1514,29,'18:00:00',55000),(4124,1514,29,'20:00:00',55000),(4125,1514,29,'22:00:00',55000),(4126,1515,29,'18:00:00',55000),(4127,1515,29,'20:00:00',55000),(4128,1515,29,'22:00:00',55000),(4129,1516,29,'18:00:00',55000),(4130,1516,29,'20:00:00',55000),(4131,1516,29,'22:00:00',55000),(4132,1517,29,'18:00:00',55000),(4133,1517,29,'20:00:00',55000),(4134,1517,29,'22:00:00',55000),(4135,1518,29,'18:00:00',55000),(4136,1518,29,'20:00:00',55000),(4137,1518,29,'22:00:00',55000),(4138,1519,29,'18:00:00',55000),(4139,1519,29,'20:00:00',55000),(4140,1519,29,'22:00:00',55000),(4141,1520,29,'18:00:00',55000),(4142,1520,29,'20:00:00',55000),(4143,1520,29,'22:00:00',55000),(4144,1521,29,'18:00:00',55000),(4145,1521,29,'20:00:00',55000),(4146,1521,29,'22:00:00',55000),(4147,1522,29,'18:00:00',55000),(4148,1522,29,'20:00:00',55000),(4149,1522,29,'22:00:00',55000),(4150,1523,29,'18:00:00',55000),(4151,1523,29,'20:00:00',55000),(4152,1523,29,'22:00:00',55000),(4153,1524,29,'18:00:00',55000),(4154,1524,29,'20:00:00',55000),(4155,1524,29,'22:00:00',55000),(4156,1525,29,'18:00:00',55000),(4157,1525,29,'20:00:00',55000),(4158,1525,29,'22:00:00',55000),(4159,1526,29,'18:00:00',55000),(4160,1526,29,'20:00:00',55000),(4161,1526,29,'22:00:00',55000),(4162,1527,29,'18:00:00',55000),(4163,1527,29,'20:00:00',55000),(4164,1527,29,'22:00:00',55000),(4165,1528,29,'18:00:00',55000),(4166,1528,29,'20:00:00',55000),(4167,1528,29,'22:00:00',55000),(4168,1529,29,'18:00:00',55000),(4169,1529,29,'20:00:00',55000),(4170,1529,29,'22:00:00',55000),(4171,1530,29,'18:00:00',55000),(4172,1530,29,'20:00:00',55000),(4173,1530,29,'22:00:00',55000),(4174,1531,29,'18:00:00',55000),(4175,1531,29,'20:00:00',55000),(4176,1531,29,'22:00:00',55000),(4177,1532,29,'18:00:00',55000),(4178,1532,29,'20:00:00',55000),(4179,1532,29,'22:00:00',55000),(4180,1533,29,'18:00:00',55000),(4181,1533,29,'20:00:00',55000),(4182,1533,29,'22:00:00',55000),(4183,1534,29,'18:00:00',55000),(4184,1534,29,'20:00:00',55000),(4185,1534,29,'22:00:00',55000),(4186,1535,29,'18:00:00',55000),(4187,1535,29,'20:00:00',55000),(4188,1535,29,'22:00:00',55000),(4189,1536,29,'18:00:00',55000),(4190,1536,29,'20:00:00',55000),(4191,1536,29,'22:00:00',55000),(4192,1537,29,'18:00:00',55000),(4193,1537,29,'20:00:00',55000),(4194,1537,29,'22:00:00',55000),(4195,1538,29,'18:00:00',55000),(4196,1538,29,'20:00:00',55000),(4197,1538,29,'22:00:00',55000),(4198,1539,29,'18:00:00',55000),(4199,1539,29,'20:00:00',55000),(4200,1539,29,'22:00:00',55000),(4201,1540,29,'18:00:00',55000),(4202,1540,29,'20:00:00',55000),(4203,1540,29,'22:00:00',55000),(4204,1541,29,'18:00:00',55000),(4205,1541,29,'20:00:00',55000),(4206,1541,29,'22:00:00',55000),(4207,1542,29,'18:00:00',55000),(4208,1542,29,'20:00:00',55000),(4209,1542,29,'22:00:00',55000),(4210,1543,29,'18:00:00',55000),(4211,1543,29,'20:00:00',55000),(4212,1543,29,'22:00:00',55000),(4213,1544,29,'18:00:00',55000),(4214,1544,29,'20:00:00',55000),(4215,1544,29,'22:00:00',55000),(4216,1545,29,'18:00:00',55000),(4217,1545,29,'20:00:00',55000),(4218,1545,29,'22:00:00',55000),(4219,1546,29,'18:00:00',55000),(4220,1546,29,'20:00:00',55000),(4221,1546,29,'22:00:00',55000),(4222,1547,29,'18:00:00',55000),(4223,1547,29,'20:00:00',55000),(4224,1547,29,'22:00:00',55000),(4225,1548,29,'18:00:00',55000),(4226,1548,29,'20:00:00',55000),(4227,1548,29,'22:00:00',55000),(4228,1549,29,'18:00:00',55000),(4229,1549,29,'20:00:00',55000),(4230,1549,29,'22:00:00',55000),(4231,1550,29,'18:00:00',55000),(4232,1550,29,'20:00:00',55000),(4233,1550,29,'22:00:00',55000),(4234,1551,29,'18:00:00',55000),(4235,1551,29,'20:00:00',55000),(4236,1551,29,'22:00:00',55000),(4237,1552,29,'18:00:00',55000),(4238,1552,29,'20:00:00',55000),(4239,1552,29,'22:00:00',55000),(4240,1553,29,'18:00:00',55000),(4241,1553,29,'20:00:00',55000),(4242,1553,29,'22:00:00',55000),(4243,1554,29,'18:00:00',55000),(4244,1554,29,'20:00:00',55000),(4245,1554,29,'22:00:00',55000),(4246,1555,29,'18:00:00',55000),(4247,1555,29,'20:00:00',55000),(4248,1555,29,'22:00:00',55000),(4249,1556,29,'18:00:00',55000),(4250,1556,29,'20:00:00',55000),(4251,1556,29,'22:00:00',55000),(4252,1557,29,'18:00:00',55000),(4253,1557,29,'20:00:00',55000),(4254,1557,29,'22:00:00',55000),(4255,1558,29,'18:00:00',55000),(4256,1558,29,'20:00:00',55000),(4257,1558,29,'22:00:00',55000),(4258,1559,29,'18:00:00',55000),(4259,1559,29,'20:00:00',55000),(4260,1559,29,'22:00:00',55000),(4261,1560,29,'18:00:00',55000),(4262,1560,29,'20:00:00',55000),(4263,1560,29,'22:00:00',55000),(4264,1561,29,'18:00:00',55000),(4265,1561,29,'20:00:00',55000),(4266,1561,29,'22:00:00',55000),(4267,1562,29,'18:00:00',55000),(4268,1562,29,'20:00:00',55000),(4269,1562,29,'22:00:00',55000),(4270,1563,29,'18:00:00',55000),(4271,1563,29,'20:00:00',55000),(4272,1563,29,'22:00:00',55000),(4273,1564,29,'18:00:00',55000),(4274,1564,29,'20:00:00',55000),(4275,1564,29,'22:00:00',55000),(4276,1565,29,'18:00:00',55000),(4277,1565,29,'20:00:00',55000),(4278,1565,29,'22:00:00',55000),(4279,1566,29,'18:00:00',55000),(4280,1566,29,'20:00:00',55000),(4281,1566,29,'22:00:00',55000),(4282,1567,29,'18:00:00',55000),(4283,1567,29,'20:00:00',55000),(4284,1567,29,'22:00:00',55000),(4285,1568,29,'18:00:00',55000),(4286,1568,29,'20:00:00',55000),(4287,1568,29,'22:00:00',55000),(4288,1569,29,'18:00:00',55000),(4289,1569,29,'20:00:00',55000),(4290,1569,29,'22:00:00',55000),(4291,1570,29,'18:00:00',55000),(4292,1570,29,'20:00:00',55000),(4293,1570,29,'22:00:00',55000),(4294,1571,29,'18:00:00',55000),(4295,1571,29,'20:00:00',55000),(4296,1571,29,'22:00:00',55000),(4297,1572,1,'19:00:00',55000),(4298,1573,1,'19:00:00',55000),(4299,1574,1,'19:00:00',55000),(4300,1575,1,'19:00:00',55000),(4301,1576,1,'19:00:00',55000),(4302,1577,1,'19:00:00',55000),(4303,1578,1,'19:00:00',55000),(4304,1579,1,'19:00:00',55000),(4305,1580,1,'19:00:00',55000),(4306,1581,1,'19:00:00',55000),(4307,1582,1,'19:00:00',55000),(4308,1583,1,'19:00:00',55000),(4309,1584,1,'19:00:00',55000),(4310,1585,1,'19:00:00',55000),(4311,1586,1,'19:00:00',55000),(4312,1587,1,'19:00:00',55000),(4313,1588,1,'19:00:00',55000),(4314,1589,1,'19:00:00',55000),(4315,1590,1,'19:00:00',55000),(4316,1591,1,'19:00:00',55000),(4317,1592,1,'19:00:00',55000),(4318,1593,1,'19:00:00',55000),(4319,1594,1,'19:00:00',55000),(4320,1595,1,'19:00:00',55000),(4321,1596,1,'19:00:00',55000),(4322,1597,1,'19:00:00',55000),(4323,1598,1,'19:00:00',55000),(4324,1599,1,'19:00:00',55000),(4325,1600,1,'19:00:00',55000),(4326,1601,1,'19:00:00',55000),(4327,1602,1,'19:00:00',55000),(4328,1603,1,'18:00:00',55000),(4329,1603,1,'20:00:00',55000),(4330,1604,1,'18:00:00',55000),(4331,1604,1,'20:00:00',55000),(4332,1605,1,'18:00:00',55000),(4333,1605,1,'20:00:00',55000),(4334,1606,1,'18:00:00',55000),(4335,1606,1,'20:00:00',55000),(4336,1607,1,'18:00:00',55000),(4337,1607,1,'20:00:00',55000),(4338,1608,1,'18:00:00',55000),(4339,1608,1,'20:00:00',55000),(4340,1609,1,'18:00:00',55000),(4341,1609,1,'20:00:00',55000),(4342,1610,1,'18:00:00',55000),(4343,1610,1,'20:00:00',55000),(4344,1611,1,'18:00:00',55000),(4345,1611,1,'20:00:00',55000),(4346,1612,1,'18:00:00',55000),(4347,1612,1,'20:00:00',55000),(4348,1613,1,'18:00:00',55000),(4349,1613,1,'20:00:00',55000),(4350,1614,1,'18:00:00',55000),(4351,1614,1,'20:00:00',55000),(4352,1615,1,'18:00:00',55000),(4353,1615,1,'20:00:00',55000),(4354,1616,1,'18:00:00',55000),(4355,1616,1,'20:00:00',55000),(4356,1617,1,'18:00:00',55000),(4357,1617,1,'20:00:00',55000),(4358,1618,1,'18:00:00',55000),(4359,1618,1,'20:00:00',55000),(4360,1619,1,'18:00:00',55000),(4361,1619,1,'20:00:00',55000),(4362,1620,1,'18:00:00',55000),(4363,1620,1,'20:00:00',55000),(4364,1621,1,'18:00:00',55000),(4365,1621,1,'20:00:00',55000),(4366,1622,1,'18:00:00',55000),(4367,1622,1,'20:00:00',55000),(4368,1623,1,'18:00:00',55000),(4369,1623,1,'20:00:00',55000),(4370,1624,1,'18:00:00',55000),(4371,1624,1,'20:00:00',55000),(4372,1625,1,'18:00:00',55000),(4373,1625,1,'20:00:00',55000),(4374,1626,1,'18:00:00',55000),(4375,1626,1,'20:00:00',55000),(4376,1627,1,'18:00:00',55000),(4377,1627,1,'20:00:00',55000),(4378,1628,1,'18:00:00',55000),(4379,1628,1,'20:00:00',55000),(4380,1629,1,'18:00:00',55000),(4381,1629,1,'20:00:00',55000),(4382,1630,1,'18:00:00',55000),(4383,1630,1,'20:00:00',55000),(4384,1631,1,'18:00:00',55000),(4385,1631,1,'20:00:00',55000),(4386,1632,1,'18:00:00',55000),(4387,1632,1,'20:00:00',55000),(4388,1633,1,'18:00:00',55000),(4389,1633,1,'20:00:00',55000),(4390,1634,1,'18:00:00',55000),(4391,1634,1,'20:00:00',55000),(4392,1635,1,'18:00:00',55000),(4393,1635,1,'20:00:00',55000),(4394,1636,1,'18:00:00',55000),(4395,1636,1,'20:00:00',55000),(4396,1637,1,'18:00:00',55000),(4397,1637,1,'20:00:00',55000),(4398,1638,1,'18:00:00',55000),(4399,1638,1,'20:00:00',55000),(4400,1639,1,'18:00:00',55000),(4401,1639,1,'20:00:00',55000),(4402,1640,1,'18:00:00',55000),(4403,1640,1,'20:00:00',55000),(4404,1641,1,'18:00:00',55000),(4405,1641,1,'20:00:00',55000),(4406,1642,1,'18:00:00',55000),(4407,1642,1,'20:00:00',55000),(4408,1643,1,'18:00:00',55000),(4409,1643,1,'20:00:00',55000),(4410,1644,1,'18:00:00',55000),(4411,1644,1,'20:00:00',55000),(4412,1645,1,'18:00:00',55000),(4413,1645,1,'20:00:00',55000),(4414,1646,1,'18:00:00',55000),(4415,1646,1,'20:00:00',55000),(4416,1647,1,'18:00:00',55000),(4417,1647,1,'20:00:00',55000),(4418,1648,1,'18:00:00',55000),(4419,1648,1,'20:00:00',55000),(4420,1649,1,'18:00:00',55000),(4421,1649,1,'20:00:00',55000),(4422,1650,1,'18:00:00',55000),(4423,1650,1,'20:00:00',55000),(4424,1651,1,'18:00:00',55000),(4425,1651,1,'20:00:00',55000),(4426,1652,1,'18:00:00',55000),(4427,1652,1,'20:00:00',55000),(4428,1653,1,'18:00:00',55000),(4429,1653,1,'20:00:00',55000),(4430,1654,1,'18:00:00',55000),(4431,1654,1,'20:00:00',55000),(4432,1655,1,'18:00:00',55000),(4433,1655,1,'20:00:00',55000),(4434,1656,1,'18:00:00',55000),(4435,1656,1,'20:00:00',55000),(4436,1657,1,'18:00:00',55000),(4437,1657,1,'20:00:00',55000),(4438,1658,1,'18:00:00',55000),(4439,1658,1,'20:00:00',55000),(4440,1659,1,'18:00:00',55000),(4441,1659,1,'20:00:00',55000),(4442,1660,1,'18:00:00',55000),(4443,1660,1,'20:00:00',55000),(4444,1661,1,'18:00:00',55000),(4445,1661,1,'20:00:00',55000),(4446,1662,1,'18:00:00',55000),(4447,1662,1,'20:00:00',55000),(4448,1663,1,'18:00:00',55000),(4449,1663,1,'20:00:00',55000),(4450,1664,1,'18:00:00',55000),(4451,1664,1,'20:00:00',55000),(4452,1665,1,'18:00:00',55000),(4453,1665,1,'20:00:00',55000),(4454,1666,1,'18:00:00',55000),(4455,1666,1,'20:00:00',55000),(4456,1667,1,'18:00:00',55000),(4457,1667,1,'20:00:00',55000),(4458,1668,1,'18:00:00',55000),(4459,1668,1,'20:00:00',55000),(4460,1669,1,'18:00:00',55000),(4461,1669,1,'20:00:00',55000),(4462,1670,1,'18:00:00',55000),(4463,1670,1,'20:00:00',55000),(4464,1671,1,'18:00:00',55000),(4465,1671,1,'20:00:00',55000),(4466,1672,1,'18:00:00',55000),(4467,1672,1,'20:00:00',55000),(4468,1673,1,'18:00:00',55000),(4469,1673,1,'20:00:00',55000),(4470,1674,1,'18:00:00',55000),(4471,1674,1,'20:00:00',55000),(4472,1675,1,'18:00:00',55000),(4473,1675,1,'20:00:00',55000),(4474,1676,1,'18:00:00',55000),(4475,1676,1,'20:00:00',55000),(4476,1677,1,'18:00:00',55000),(4477,1677,1,'20:00:00',55000),(4478,1678,1,'18:00:00',55000),(4479,1678,1,'20:00:00',55000),(4480,1679,1,'18:00:00',55000),(4481,1679,1,'20:00:00',55000),(4482,1680,1,'18:00:00',55000),(4483,1680,1,'20:00:00',55000),(4484,1681,1,'18:00:00',55000),(4485,1681,1,'20:00:00',55000),(4486,1682,1,'18:00:00',55000),(4487,1682,1,'20:00:00',55000),(4488,1683,1,'18:00:00',55000),(4489,1683,1,'20:00:00',55000),(4490,1684,1,'18:00:00',55000),(4491,1684,1,'20:00:00',55000),(4492,1685,1,'18:00:00',55000),(4493,1685,1,'20:00:00',55000),(4494,1686,1,'18:00:00',55000),(4495,1686,1,'20:00:00',55000),(4496,1687,1,'18:00:00',55000),(4497,1687,1,'20:00:00',55000),(4498,1688,1,'18:00:00',55000),(4499,1688,1,'20:00:00',55000),(4500,1689,1,'18:00:00',55000),(4501,1689,1,'20:00:00',55000),(4502,1690,1,'18:00:00',55000),(4503,1690,1,'20:00:00',55000),(4504,1691,1,'18:00:00',55000),(4505,1691,1,'20:00:00',55000),(4506,1692,1,'18:00:00',55000),(4507,1692,1,'20:00:00',55000),(4508,1693,1,'18:00:00',55000),(4509,1693,1,'20:00:00',55000),(4510,1694,1,'18:00:00',55000),(4511,1694,1,'20:00:00',55000),(4512,1695,1,'18:00:00',55000),(4513,1695,1,'20:00:00',55000),(4514,1696,1,'18:00:00',55000),(4515,1696,1,'20:00:00',55000),(4516,1697,1,'18:00:00',55000),(4517,1697,1,'20:00:00',55000),(4518,1698,1,'18:00:00',55000),(4519,1698,1,'20:00:00',55000),(4520,1699,1,'18:00:00',55000),(4521,1699,1,'20:00:00',55000),(4522,1700,1,'18:00:00',55000),(4523,1700,1,'20:00:00',55000),(4524,1701,1,'18:00:00',55000),(4525,1701,1,'20:00:00',55000),(4526,1702,1,'18:00:00',55000),(4527,1702,1,'20:00:00',55000),(4528,1703,1,'18:00:00',55000),(4529,1703,1,'20:00:00',55000),(4530,1704,1,'18:00:00',55000),(4531,1704,1,'20:00:00',55000),(4532,1705,1,'18:00:00',55000),(4533,1705,1,'20:00:00',55000),(4534,1706,1,'18:00:00',55000),(4535,1706,1,'20:00:00',55000),(4536,1707,1,'18:00:00',55000),(4537,1707,1,'20:00:00',55000),(4538,1708,1,'18:00:00',55000),(4539,1708,1,'20:00:00',55000),(4540,1709,1,'18:00:00',55000),(4541,1709,1,'20:00:00',55000),(4542,1710,1,'18:00:00',55000),(4543,1710,1,'20:00:00',55000),(4544,1711,1,'18:00:00',55000),(4545,1711,1,'20:00:00',55000),(4546,1712,1,'18:00:00',55000),(4547,1712,1,'20:00:00',55000),(4548,1713,1,'18:00:00',55000),(4549,1713,1,'20:00:00',55000),(4550,1714,1,'18:00:00',55000),(4551,1714,1,'20:00:00',55000),(4552,1715,1,'18:00:00',55000),(4553,1715,1,'20:00:00',55000),(4554,1716,1,'18:00:00',55000),(4555,1716,1,'20:00:00',55000),(4556,1717,1,'18:00:00',55000),(4557,1717,1,'20:00:00',55000),(4558,1718,1,'18:00:00',55000),(4559,1718,1,'20:00:00',55000),(4560,1719,1,'18:00:00',55000),(4561,1719,1,'20:00:00',55000),(4562,1720,1,'18:00:00',55000),(4563,1720,1,'20:00:00',55000),(4564,1721,1,'18:00:00',55000),(4565,1721,1,'20:00:00',55000),(4566,1722,1,'18:00:00',55000),(4567,1722,1,'20:00:00',55000),(4568,1723,1,'18:00:00',55000),(4569,1723,1,'20:00:00',55000),(4570,1724,1,'18:00:00',55000),(4571,1724,1,'20:00:00',55000),(4572,1725,1,'18:00:00',55000),(4573,1725,1,'20:00:00',55000),(4574,1726,1,'18:00:00',55000),(4575,1726,1,'20:00:00',55000),(4576,1727,1,'18:00:00',55000),(4577,1727,1,'20:00:00',55000),(4578,1728,1,'18:00:00',55000),(4579,1728,1,'20:00:00',55000),(4580,1729,1,'18:00:00',55000),(4581,1729,1,'20:00:00',55000),(4582,1730,1,'18:00:00',55000),(4583,1730,1,'20:00:00',55000),(4584,1731,1,'18:00:00',55000),(4585,1731,1,'20:00:00',55000),(4586,1732,1,'18:00:00',55000),(4587,1732,1,'20:00:00',55000),(4588,1733,1,'18:00:00',55000),(4589,1733,1,'20:00:00',55000),(4590,1734,1,'18:00:00',55000),(4591,1734,1,'20:00:00',55000),(4592,1735,1,'18:00:00',55000),(4593,1735,1,'20:00:00',55000),(4594,1736,1,'18:00:00',55000),(4595,1736,1,'20:00:00',55000),(4596,1737,1,'18:00:00',55000),(4597,1737,1,'20:00:00',55000),(4598,1738,1,'18:00:00',55000),(4599,1738,1,'20:00:00',55000),(4600,1739,1,'18:00:00',55000),(4601,1739,1,'20:00:00',55000),(4602,1740,1,'18:00:00',55000),(4603,1740,1,'20:00:00',55000),(4604,1741,1,'18:00:00',55000),(4605,1741,1,'20:00:00',55000),(4606,1742,1,'18:00:00',55000),(4607,1742,1,'20:00:00',55000),(4608,1743,1,'18:00:00',55000),(4609,1743,1,'20:00:00',55000),(4610,1744,1,'18:00:00',55000),(4611,1744,1,'20:00:00',55000),(4612,1745,1,'18:00:00',55000),(4613,1745,1,'20:00:00',55000),(4614,1746,1,'18:00:00',55000),(4615,1746,1,'20:00:00',55000),(4616,1747,1,'18:00:00',55000),(4617,1747,1,'20:00:00',55000),(4618,1748,1,'18:00:00',55000),(4619,1748,1,'20:00:00',55000),(4620,1749,1,'18:00:00',55000),(4621,1749,1,'20:00:00',55000),(4622,1750,1,'18:00:00',55000),(4623,1750,1,'20:00:00',55000),(4624,1751,1,'18:00:00',55000),(4625,1751,1,'20:00:00',55000),(4626,1752,1,'18:00:00',55000),(4627,1752,1,'20:00:00',55000),(4628,1753,1,'18:00:00',55000),(4629,1753,1,'20:00:00',55000),(4630,1754,1,'18:00:00',55000),(4631,1754,1,'20:00:00',55000),(4632,1755,1,'18:00:00',55000),(4633,1755,1,'20:00:00',55000),(4634,1756,1,'18:00:00',55000),(4635,1756,1,'20:00:00',55000),(4636,1757,1,'18:00:00',55000),(4637,1757,1,'20:00:00',55000),(4638,1758,1,'18:00:00',55000),(4639,1758,1,'20:00:00',55000),(4640,1759,1,'18:00:00',55000),(4641,1759,1,'20:00:00',55000),(4642,1760,1,'18:00:00',55000),(4643,1760,1,'20:00:00',55000),(4644,1761,1,'18:00:00',55000),(4645,1761,1,'20:00:00',55000),(4646,1762,1,'18:00:00',55000),(4647,1762,1,'20:00:00',55000),(4648,1763,1,'18:00:00',55000),(4649,1763,1,'20:00:00',55000),(4650,1764,1,'18:00:00',55000),(4651,1764,1,'20:00:00',55000),(4652,1765,1,'18:00:00',55000),(4653,1765,1,'20:00:00',55000),(4654,1766,1,'18:00:00',55000),(4655,1766,1,'20:00:00',55000),(4656,1767,1,'18:00:00',55000),(4657,1767,1,'20:00:00',55000),(4658,1768,1,'18:00:00',55000),(4659,1768,1,'20:00:00',55000),(4660,1769,1,'18:00:00',55000),(4661,1769,1,'20:00:00',55000),(4662,1770,1,'18:00:00',55000),(4663,1770,1,'20:00:00',55000),(4664,1771,1,'18:00:00',55000),(4665,1771,1,'20:00:00',55000),(4666,1772,1,'18:00:00',55000),(4667,1772,1,'20:00:00',55000),(4668,1773,1,'18:00:00',55000),(4669,1773,1,'20:00:00',55000),(4670,1774,1,'18:00:00',55000),(4671,1774,1,'20:00:00',55000),(4672,1775,1,'18:00:00',55000),(4673,1775,1,'20:00:00',55000),(4674,1776,1,'18:00:00',55000),(4675,1776,1,'20:00:00',55000),(4676,1777,1,'18:00:00',55000),(4677,1777,1,'20:00:00',55000),(4678,1778,1,'18:00:00',55000),(4679,1778,1,'20:00:00',55000),(4680,1779,1,'18:00:00',55000),(4681,1779,1,'20:00:00',55000),(4682,1780,1,'18:00:00',55000),(4683,1780,1,'20:00:00',55000),(4684,1781,1,'18:00:00',55000),(4685,1781,1,'20:00:00',55000),(4686,1782,1,'18:00:00',55000),(4687,1782,1,'20:00:00',55000),(4688,1783,1,'18:00:00',55000),(4689,1783,1,'20:00:00',55000),(4690,1784,1,'18:00:00',55000),(4691,1784,1,'20:00:00',55000),(4692,1785,1,'18:00:00',55000),(4693,1785,1,'20:00:00',55000),(4694,1786,1,'18:00:00',55000),(4695,1786,1,'20:00:00',55000),(4696,1787,1,'18:00:00',55000),(4697,1787,1,'20:00:00',55000),(4698,1788,1,'18:00:00',55000),(4699,1788,1,'20:00:00',55000),(4700,1789,1,'18:00:00',55000),(4701,1789,1,'20:00:00',55000),(4702,1790,1,'18:00:00',55000),(4703,1790,1,'20:00:00',55000),(4704,1791,1,'18:00:00',55000),(4705,1791,1,'20:00:00',55000),(4706,1792,1,'18:00:00',55000),(4707,1792,1,'20:00:00',55000),(4708,1793,1,'18:00:00',55000),(4709,1793,1,'20:00:00',55000),(4710,1794,1,'18:00:00',55000),(4711,1794,1,'20:00:00',55000),(4712,1795,1,'18:00:00',55000),(4713,1795,1,'20:00:00',55000),(4714,1796,1,'18:00:00',55000),(4715,1796,1,'20:00:00',55000),(4716,1797,1,'18:00:00',55000),(4717,1797,1,'20:00:00',55000),(4718,1798,1,'18:00:00',55000),(4719,1798,1,'20:00:00',55000),(4720,1799,1,'18:00:00',55000),(4721,1799,1,'20:00:00',55000),(4722,1800,1,'18:00:00',55000),(4723,1800,1,'20:00:00',55000),(4724,1801,1,'18:00:00',55000),(4725,1801,1,'20:00:00',55000),(4726,1802,1,'18:00:00',55000),(4727,1802,1,'20:00:00',55000),(4728,1803,1,'18:00:00',55000),(4729,1803,1,'20:00:00',55000),(4730,1804,1,'18:00:00',55000),(4731,1804,1,'20:00:00',55000),(4732,1805,1,'18:00:00',55000),(4733,1805,1,'20:00:00',55000),(4734,1806,1,'18:00:00',55000),(4735,1806,1,'20:00:00',55000),(4736,1807,1,'18:00:00',55000),(4737,1807,1,'20:00:00',55000),(4738,1808,1,'18:00:00',55000),(4739,1808,1,'20:00:00',55000),(4740,1809,1,'18:00:00',55000),(4741,1809,1,'20:00:00',55000),(4742,1810,1,'18:00:00',55000),(4743,1810,1,'20:00:00',55000),(4744,1811,1,'18:00:00',55000),(4745,1811,1,'20:00:00',55000),(4746,1812,1,'18:00:00',55000),(4747,1812,1,'20:00:00',55000),(4748,1813,1,'18:00:00',55000),(4749,1813,1,'20:00:00',55000),(4750,1814,1,'18:00:00',55000),(4751,1814,1,'20:00:00',55000),(4752,1815,1,'18:00:00',55000),(4753,1815,1,'20:00:00',55000),(4754,1816,1,'18:00:00',55000),(4755,1816,1,'20:00:00',55000),(4756,1817,1,'18:00:00',55000),(4757,1817,1,'20:00:00',55000),(4758,1818,1,'18:00:00',55000),(4759,1818,1,'20:00:00',55000),(4760,1819,1,'18:00:00',55000),(4761,1819,1,'20:00:00',55000),(4762,1820,1,'18:00:00',55000),(4763,1820,1,'20:00:00',55000),(4764,1821,1,'18:00:00',55000),(4765,1821,1,'20:00:00',55000),(4766,1822,1,'18:00:00',55000),(4767,1822,1,'20:00:00',55000),(4768,1823,1,'18:00:00',55000),(4769,1823,1,'20:00:00',55000),(4770,1824,1,'18:00:00',55000),(4771,1824,1,'20:00:00',55000),(4772,1825,1,'18:00:00',55000),(4773,1825,1,'20:00:00',55000),(4774,1826,1,'18:00:00',55000),(4775,1826,1,'20:00:00',55000),(4776,1827,1,'18:00:00',55000),(4777,1827,1,'20:00:00',55000),(4778,1828,1,'18:00:00',55000),(4779,1828,1,'20:00:00',55000),(4780,1829,1,'18:00:00',55000),(4781,1829,1,'20:00:00',55000),(4782,1830,1,'18:00:00',55000),(4783,1830,1,'20:00:00',55000),(4784,1831,1,'18:00:00',55000),(4785,1831,1,'20:00:00',55000),(4786,1832,1,'18:00:00',55000),(4787,1832,1,'20:00:00',55000),(4788,1833,1,'18:00:00',55000),(4789,1833,1,'20:00:00',55000),(4790,1834,1,'18:00:00',55000),(4791,1834,1,'20:00:00',55000),(4792,1835,1,'18:00:00',55000),(4793,1835,1,'20:00:00',55000),(4794,1836,1,'18:00:00',55000),(4795,1836,1,'20:00:00',55000),(4796,1837,1,'18:00:00',55000),(4797,1837,1,'20:00:00',55000),(4798,1838,1,'18:00:00',55000),(4799,1838,1,'20:00:00',55000),(4800,1839,1,'18:00:00',55000),(4801,1839,1,'20:00:00',55000),(4802,1840,1,'18:00:00',55000),(4803,1840,1,'20:00:00',55000),(4804,1841,1,'18:00:00',55000),(4805,1841,1,'20:00:00',55000),(4806,1842,1,'18:00:00',55000),(4807,1842,1,'20:00:00',55000),(4808,1843,1,'18:00:00',55000),(4809,1843,1,'20:00:00',55000),(4810,1844,1,'18:00:00',55000),(4811,1844,1,'20:00:00',55000),(4812,1845,1,'18:00:00',55000),(4813,1845,1,'20:00:00',55000),(4814,1846,1,'18:00:00',55000),(4815,1846,1,'20:00:00',55000),(4816,1847,1,'18:00:00',55000),(4817,1847,1,'20:00:00',55000),(4818,1848,1,'18:00:00',55000),(4819,1848,1,'20:00:00',55000),(4820,1849,1,'18:00:00',55000),(4821,1849,1,'20:00:00',55000),(4822,1850,1,'18:00:00',55000),(4823,1850,1,'20:00:00',55000),(4824,1851,1,'18:00:00',55000),(4825,1851,1,'20:00:00',55000),(4826,1852,1,'18:00:00',55000),(4827,1852,1,'20:00:00',55000),(4828,1853,1,'18:00:00',55000),(4829,1853,1,'20:00:00',55000),(4830,1854,1,'18:00:00',55000),(4831,1854,1,'20:00:00',55000),(4832,1855,1,'18:00:00',55000),(4833,1855,1,'20:00:00',55000),(4834,1856,1,'18:00:00',55000),(4835,1856,1,'20:00:00',55000),(4836,1857,1,'18:00:00',55000),(4837,1857,1,'20:00:00',55000),(4838,1858,1,'18:00:00',55000),(4839,1858,1,'20:00:00',55000),(4840,1859,1,'18:00:00',55000),(4841,1859,1,'20:00:00',55000),(4842,1860,1,'18:00:00',55000),(4843,1860,1,'20:00:00',55000),(4844,1861,1,'18:00:00',55000),(4845,1861,1,'20:00:00',55000),(4846,1862,1,'18:00:00',55000),(4847,1862,1,'20:00:00',55000),(4848,1863,1,'18:00:00',55000),(4849,1863,1,'20:00:00',55000),(4850,1864,1,'18:00:00',55000),(4851,1864,1,'20:00:00',55000),(4852,1865,1,'18:00:00',55000),(4853,1865,1,'20:00:00',55000),(4854,1866,1,'18:00:00',55000),(4855,1866,1,'20:00:00',55000),(4856,1867,1,'18:00:00',55000),(4857,1867,1,'20:00:00',55000),(4858,1868,1,'18:00:00',55000),(4859,1868,1,'20:00:00',55000),(4860,1869,1,'18:00:00',55000),(4861,1869,1,'20:00:00',55000),(4862,1870,1,'18:00:00',55000),(4863,1870,1,'20:00:00',55000),(4864,1871,1,'18:00:00',55000),(4865,1871,1,'20:00:00',55000),(4866,1872,1,'18:00:00',55000),(4867,1872,1,'20:00:00',55000),(4868,1873,1,'18:00:00',55000),(4869,1873,1,'20:00:00',55000),(4870,1874,1,'18:00:00',55000),(4871,1874,1,'20:00:00',55000),(4872,1875,1,'18:00:00',55000),(4873,1875,1,'20:00:00',55000),(4874,1876,1,'18:00:00',55000),(4875,1876,1,'20:00:00',55000),(4876,1877,1,'18:00:00',55000),(4877,1877,1,'20:00:00',55000),(4878,1878,1,'18:00:00',55000),(4879,1878,1,'20:00:00',55000),(4880,1879,1,'18:00:00',55000),(4881,1879,1,'20:00:00',55000),(4882,1880,1,'18:00:00',55000),(4883,1880,1,'20:00:00',55000),(4884,1881,1,'18:00:00',55000),(4885,1881,1,'20:00:00',55000),(4886,1882,1,'18:00:00',55000),(4887,1882,1,'20:00:00',55000),(4888,1883,1,'18:00:00',55000),(4889,1883,1,'20:00:00',55000),(4890,1884,1,'18:00:00',55000),(4891,1884,1,'20:00:00',55000),(4892,1885,1,'18:00:00',55000),(4893,1885,1,'20:00:00',55000),(4894,1886,1,'18:00:00',55000),(4895,1886,1,'20:00:00',55000),(4896,1887,1,'18:00:00',55000),(4897,1887,1,'20:00:00',55000),(4898,1888,1,'18:00:00',55000),(4899,1888,1,'20:00:00',55000),(4900,1889,1,'18:00:00',55000),(4901,1889,1,'20:00:00',55000),(4902,1890,1,'18:00:00',55000),(4903,1890,1,'20:00:00',55000),(4904,1891,1,'18:00:00',55000),(4905,1891,1,'20:00:00',55000),(4906,1892,1,'18:00:00',55000),(4907,1892,1,'20:00:00',55000),(4908,1893,1,'18:00:00',55000),(4909,1893,1,'20:00:00',55000),(4910,1894,1,'18:00:00',55000),(4911,1894,1,'20:00:00',55000),(4912,1895,1,'18:00:00',55000),(4913,1895,1,'20:00:00',55000),(4914,1896,1,'18:00:00',55000),(4915,1896,1,'20:00:00',55000),(4916,1897,1,'18:00:00',55000),(4917,1897,1,'20:00:00',55000),(4918,1898,1,'18:00:00',55000),(4919,1898,1,'20:00:00',55000),(4920,1899,1,'18:00:00',55000),(4921,1899,1,'20:00:00',55000),(4922,1900,1,'18:00:00',55000),(4923,1900,1,'20:00:00',55000),(4924,1901,1,'18:00:00',55000),(4925,1901,1,'20:00:00',55000),(4926,1902,1,'18:00:00',55000),(4927,1902,1,'20:00:00',55000),(4928,1903,1,'18:00:00',55000),(4929,1903,1,'20:00:00',55000),(4930,1904,1,'18:00:00',55000),(4931,1904,1,'20:00:00',55000),(4932,1905,1,'18:00:00',55000),(4933,1905,1,'20:00:00',55000),(4934,1906,1,'18:00:00',55000),(4935,1906,1,'20:00:00',55000),(4936,1907,1,'18:00:00',55000),(4937,1907,1,'20:00:00',55000),(4938,1908,1,'18:00:00',55000),(4939,1908,1,'20:00:00',55000),(4940,1909,1,'18:00:00',55000),(4941,1909,1,'20:00:00',55000),(4942,1910,1,'18:00:00',55000),(4943,1910,1,'20:00:00',55000),(4944,1911,1,'18:00:00',55000),(4945,1911,1,'20:00:00',55000),(4946,1912,1,'18:00:00',55000),(4947,1912,1,'20:00:00',55000),(4948,1913,1,'18:00:00',55000),(4949,1913,1,'20:00:00',55000),(4950,1914,1,'18:00:00',55000),(4951,1914,1,'20:00:00',55000),(4952,1915,1,'18:00:00',55000),(4953,1915,1,'20:00:00',55000),(4954,1916,1,'18:00:00',55000),(4955,1916,1,'20:00:00',55000),(4956,1917,1,'18:00:00',55000),(4957,1917,1,'20:00:00',55000),(4958,1918,1,'18:00:00',55000),(4959,1918,1,'20:00:00',55000),(4960,1919,1,'18:00:00',55000),(4961,1919,1,'20:00:00',55000),(4962,1920,1,'18:00:00',55000),(4963,1920,1,'20:00:00',55000),(4964,1921,1,'18:00:00',55000),(4965,1921,1,'20:00:00',55000),(4966,1922,1,'18:00:00',55000),(4967,1922,1,'20:00:00',55000),(4968,1923,1,'18:00:00',55000),(4969,1923,1,'20:00:00',55000),(4970,1924,1,'18:00:00',55000),(4971,1924,1,'20:00:00',55000),(4972,1925,1,'18:00:00',55000),(4973,1925,1,'20:00:00',55000),(4974,1926,1,'18:00:00',55000),(4975,1926,1,'20:00:00',55000),(4976,1927,1,'18:00:00',55000),(4977,1927,1,'20:00:00',55000),(4978,1928,1,'18:00:00',55000),(4979,1928,1,'20:00:00',55000),(4980,1929,1,'18:00:00',55000),(4981,1929,1,'20:00:00',55000),(4982,1930,1,'18:00:00',55000),(4983,1930,1,'20:00:00',55000),(4984,1931,1,'18:00:00',55000),(4985,1931,1,'20:00:00',55000),(4986,1932,1,'18:00:00',55000),(4987,1932,1,'20:00:00',55000),(4988,1933,1,'18:00:00',55000),(4989,1933,1,'20:00:00',55000),(4990,1934,1,'18:00:00',55000),(4991,1934,1,'20:00:00',55000),(4992,1935,1,'18:00:00',55000),(4993,1935,1,'20:00:00',55000),(4994,1936,1,'18:00:00',55000),(4995,1936,1,'20:00:00',55000),(4996,1937,1,'18:00:00',55000),(4997,1937,1,'20:00:00',55000),(4998,1938,1,'18:00:00',55000),(4999,1938,1,'20:00:00',55000),(5000,1939,1,'18:00:00',55000),(5001,1939,1,'20:00:00',55000),(5002,1940,1,'18:00:00',55000),(5003,1940,1,'20:00:00',55000),(5004,1941,1,'18:00:00',55000),(5005,1941,1,'20:00:00',55000),(5006,1942,1,'18:00:00',55000),(5007,1942,1,'20:00:00',55000),(5008,1943,1,'18:00:00',55000),(5009,1943,1,'20:00:00',55000),(5010,1944,1,'18:00:00',55000),(5011,1944,1,'20:00:00',55000),(5012,1945,1,'18:00:00',55000),(5013,1945,1,'20:00:00',55000),(5014,1946,1,'18:00:00',55000),(5015,1946,1,'20:00:00',55000),(5016,1947,1,'18:00:00',55000),(5017,1947,1,'20:00:00',55000),(5018,1948,1,'18:00:00',55000),(5019,1948,1,'20:00:00',55000),(5020,1949,1,'18:00:00',55000),(5021,1949,1,'20:00:00',55000),(5022,1950,1,'18:00:00',55000),(5023,1950,1,'20:00:00',55000),(5024,1951,1,'18:00:00',55000),(5025,1951,1,'20:00:00',55000),(5026,1952,1,'18:00:00',55000),(5027,1952,1,'20:00:00',55000),(5028,1953,1,'18:00:00',55000),(5029,1953,1,'20:00:00',55000),(5030,1954,1,'18:00:00',55000),(5031,1954,1,'20:00:00',55000),(5032,1955,1,'18:00:00',55000),(5033,1955,1,'20:00:00',55000),(5034,1956,1,'18:00:00',55000),(5035,1956,1,'20:00:00',55000),(5036,1957,1,'18:00:00',55000),(5037,1957,1,'20:00:00',55000),(5038,1958,1,'18:00:00',55000),(5039,1958,1,'20:00:00',55000),(5040,1959,1,'18:00:00',55000),(5041,1959,1,'20:00:00',55000),(5042,1960,1,'18:00:00',55000),(5043,1960,1,'20:00:00',55000),(5044,1961,1,'18:00:00',55000),(5045,1961,1,'20:00:00',55000),(5046,1962,1,'18:00:00',55000),(5047,1962,1,'20:00:00',55000),(5048,1963,1,'18:00:00',55000),(5049,1963,1,'20:00:00',55000),(5050,1964,1,'18:00:00',55000),(5051,1964,1,'20:00:00',55000),(5052,1965,1,'18:00:00',55000),(5053,1965,1,'20:00:00',55000),(5054,1966,1,'18:00:00',55000),(5055,1966,1,'20:00:00',55000),(5056,1967,1,'18:00:00',55000),(5057,1967,1,'20:00:00',55000),(5058,1968,1,'18:00:00',55000),(5059,1968,1,'20:00:00',55000),(5060,1969,1,'18:00:00',55000),(5061,1969,1,'20:00:00',55000),(5062,1970,1,'18:00:00',55000),(5063,1970,1,'20:00:00',55000),(5064,1971,1,'18:00:00',55000),(5065,1971,1,'20:00:00',55000),(5066,1972,1,'18:00:00',55000),(5067,1972,1,'20:00:00',55000),(5068,1973,1,'18:00:00',55000),(5069,1973,1,'20:00:00',55000),(5070,1974,1,'18:00:00',55000),(5071,1974,1,'20:00:00',55000),(5072,1975,1,'18:00:00',55000),(5073,1975,1,'20:00:00',55000),(5074,1976,1,'18:00:00',55000),(5075,1976,1,'20:00:00',55000),(5076,1977,1,'18:00:00',55000),(5077,1977,1,'20:00:00',55000),(5078,1978,1,'18:00:00',55000),(5079,1978,1,'20:00:00',55000),(5080,1979,1,'18:00:00',55000),(5081,1979,1,'20:00:00',55000),(5082,1980,1,'18:00:00',55000),(5083,1980,1,'20:00:00',55000),(5084,1981,1,'18:00:00',55000),(5085,1981,1,'20:00:00',55000),(5086,1982,1,'18:00:00',55000),(5087,1982,1,'20:00:00',55000),(5088,1983,1,'18:00:00',55000),(5089,1983,1,'20:00:00',55000),(5090,1984,1,'18:00:00',55000),(5091,1984,1,'20:00:00',55000),(5092,1985,1,'18:00:00',55000),(5093,1985,1,'20:00:00',55000),(5094,1986,1,'18:00:00',55000),(5095,1986,1,'20:00:00',55000),(5096,1987,1,'18:00:00',55000),(5097,1987,1,'20:00:00',55000),(5098,1988,1,'18:00:00',55000),(5099,1988,1,'20:00:00',55000),(5100,1989,1,'18:00:00',55000),(5101,1989,1,'20:00:00',55000),(5102,1990,1,'18:00:00',55000),(5103,1990,1,'20:00:00',55000),(5104,1991,1,'18:00:00',55000),(5105,1991,1,'20:00:00',55000),(5106,1992,1,'18:00:00',55000),(5107,1992,1,'20:00:00',55000),(5108,1993,1,'18:00:00',55000),(5109,1993,1,'20:00:00',55000),(5110,1994,1,'18:00:00',55000),(5111,1994,1,'20:00:00',55000),(5112,1995,1,'18:00:00',55000),(5113,1995,1,'20:00:00',55000),(5114,1996,1,'18:00:00',55000),(5115,1996,1,'20:00:00',55000),(5116,1997,1,'18:00:00',55000),(5117,1997,1,'20:00:00',55000),(5118,1998,1,'18:00:00',55000),(5119,1998,1,'20:00:00',55000),(5120,1999,1,'18:00:00',55000),(5121,1999,1,'20:00:00',55000),(5122,2000,1,'18:00:00',55000),(5123,2000,1,'20:00:00',55000),(5124,2001,1,'18:00:00',55000),(5125,2001,1,'20:00:00',55000),(5126,2002,1,'18:00:00',55000),(5127,2002,1,'20:00:00',55000),(5128,2003,1,'18:00:00',55000),(5129,2003,1,'20:00:00',55000),(5130,2004,1,'18:00:00',55000),(5131,2004,1,'20:00:00',55000),(5132,2005,1,'18:00:00',55000),(5133,2005,1,'20:00:00',55000),(5134,2006,1,'18:00:00',55000),(5135,2006,1,'20:00:00',55000),(5136,2007,1,'18:00:00',55000),(5137,2007,1,'20:00:00',55000),(5138,2008,1,'18:00:00',55000),(5139,2008,1,'20:00:00',55000),(5140,2009,1,'18:00:00',55000),(5141,2009,1,'20:00:00',55000),(5142,2010,1,'18:00:00',55000),(5143,2010,1,'20:00:00',55000),(5144,2011,1,'18:00:00',55000),(5145,2011,1,'20:00:00',55000),(5146,2012,1,'18:00:00',55000),(5147,2012,1,'20:00:00',55000),(5148,2013,1,'18:00:00',55000),(5149,2013,1,'20:00:00',55000),(5150,2014,1,'18:00:00',55000),(5151,2014,1,'20:00:00',55000),(5152,2015,1,'18:00:00',55000),(5153,2015,1,'20:00:00',55000),(5154,2016,1,'18:00:00',55000),(5155,2016,1,'20:00:00',55000),(5156,2017,1,'18:00:00',55000),(5157,2017,1,'20:00:00',55000),(5158,2018,1,'18:00:00',55000),(5159,2018,1,'20:00:00',55000),(5160,2019,1,'18:00:00',55000),(5161,2019,1,'20:00:00',55000),(5162,2020,1,'18:00:00',55000),(5163,2020,1,'20:00:00',55000),(5164,2021,1,'18:00:00',55000),(5165,2021,1,'20:00:00',55000),(5166,2022,1,'18:00:00',55000),(5167,2022,1,'20:00:00',55000),(5168,2023,1,'18:00:00',55000),(5169,2023,1,'20:00:00',55000),(5170,2024,1,'18:00:00',55000),(5171,2024,1,'20:00:00',55000),(5172,2025,1,'18:00:00',55000),(5173,2025,1,'20:00:00',55000),(5174,2026,1,'18:00:00',55000),(5175,2026,1,'20:00:00',55000),(5176,2027,1,'18:00:00',55000),(5177,2027,1,'20:00:00',55000),(5178,2028,1,'18:00:00',55000),(5179,2028,1,'20:00:00',55000),(5180,2029,1,'18:00:00',55000),(5181,2029,1,'20:00:00',55000),(5182,2030,1,'18:00:00',55000),(5183,2030,1,'20:00:00',55000),(5184,2031,1,'18:00:00',55000),(5185,2031,1,'20:00:00',55000),(5186,2032,1,'18:00:00',55000),(5187,2032,1,'20:00:00',55000),(5188,2033,1,'18:00:00',55000),(5189,2033,1,'20:00:00',55000),(5190,2034,1,'18:00:00',55000),(5191,2034,1,'20:00:00',55000),(5192,2035,1,'18:00:00',55000),(5193,2035,1,'20:00:00',55000),(5194,2036,1,'18:00:00',55000),(5195,2036,1,'20:00:00',55000),(5196,2037,1,'18:00:00',55000),(5197,2037,1,'20:00:00',55000),(5198,2038,1,'18:00:00',55000),(5199,2038,1,'20:00:00',55000),(5200,2039,1,'18:00:00',55000),(5201,2039,1,'20:00:00',55000),(5202,2040,1,'18:00:00',55000),(5203,2040,1,'20:00:00',55000),(5204,2041,1,'18:00:00',55000),(5205,2041,1,'20:00:00',55000),(5206,2042,1,'18:00:00',55000),(5207,2042,1,'20:00:00',55000),(5208,2043,1,'18:00:00',55000),(5209,2043,1,'20:00:00',55000),(5210,2044,1,'18:00:00',55000),(5211,2044,1,'20:00:00',55000),(5212,2045,1,'18:00:00',55000),(5213,2045,1,'20:00:00',55000),(5214,2046,1,'18:00:00',55000),(5215,2046,1,'20:00:00',55000),(5216,2047,1,'18:00:00',55000),(5217,2047,1,'20:00:00',55000),(5218,2048,1,'18:00:00',55000),(5219,2048,1,'20:00:00',55000),(5220,2049,1,'18:00:00',55000),(5221,2049,1,'20:00:00',55000),(5222,2050,1,'18:00:00',55000),(5223,2050,1,'20:00:00',55000),(5224,2051,1,'18:00:00',55000),(5225,2051,1,'20:00:00',55000),(5226,2052,1,'18:00:00',55000),(5227,2052,1,'20:00:00',55000),(5228,2053,1,'18:00:00',55000),(5229,2053,1,'20:00:00',55000),(5230,2054,1,'18:00:00',55000),(5231,2054,1,'20:00:00',55000),(5232,2055,1,'18:00:00',55000),(5233,2055,1,'20:00:00',55000),(5234,2056,1,'18:00:00',55000),(5235,2056,1,'20:00:00',55000),(5236,2057,1,'18:00:00',55000),(5237,2057,1,'20:00:00',55000),(5238,2058,1,'18:00:00',55000),(5239,2058,1,'20:00:00',55000),(5240,2059,1,'18:00:00',55000),(5241,2059,1,'20:00:00',55000),(5242,2060,1,'18:00:00',55000),(5243,2060,1,'20:00:00',55000),(5244,2061,1,'18:00:00',55000),(5245,2061,1,'20:00:00',55000),(5246,2062,1,'18:00:00',55000),(5247,2062,1,'20:00:00',55000),(5248,2063,1,'18:00:00',55000),(5249,2063,1,'20:00:00',55000),(5250,2064,1,'18:00:00',55000),(5251,2064,1,'20:00:00',55000),(5252,2065,1,'18:00:00',55000),(5253,2065,1,'20:00:00',55000),(5254,2066,1,'18:00:00',55000),(5255,2066,1,'20:00:00',55000),(5256,2067,1,'18:00:00',55000),(5257,2067,1,'20:00:00',55000),(5258,2068,1,'18:00:00',55000),(5259,2068,1,'20:00:00',55000),(5260,2069,1,'18:00:00',55000),(5261,2069,1,'20:00:00',55000),(5262,2070,1,'18:00:00',55000),(5263,2070,1,'20:00:00',55000),(5264,2071,1,'18:00:00',55000),(5265,2071,1,'20:00:00',55000),(5266,2072,1,'18:00:00',55000),(5267,2072,1,'20:00:00',55000),(5268,2073,1,'18:00:00',55000),(5269,2073,1,'20:00:00',55000),(5270,2074,1,'18:00:00',55000),(5271,2074,1,'20:00:00',55000),(5272,2075,1,'18:00:00',55000),(5273,2075,1,'20:00:00',55000),(5274,2076,1,'18:00:00',55000),(5275,2076,1,'20:00:00',55000),(5276,2077,1,'18:00:00',55000),(5277,2077,1,'20:00:00',55000),(5278,2078,1,'18:00:00',55000),(5279,2078,1,'20:00:00',55000),(5280,2079,1,'18:00:00',55000),(5281,2079,1,'20:00:00',55000),(5282,2080,1,'18:00:00',55000),(5283,2080,1,'20:00:00',55000),(5284,2081,1,'18:00:00',55000),(5285,2081,1,'20:00:00',55000),(5286,2082,1,'18:00:00',55000),(5287,2082,1,'20:00:00',55000),(5288,2083,1,'18:00:00',55000),(5289,2083,1,'20:00:00',55000),(5290,2084,1,'18:00:00',55000),(5291,2084,1,'20:00:00',55000),(5292,2085,1,'18:00:00',55000),(5293,2085,1,'20:00:00',55000),(5294,2086,1,'18:00:00',55000),(5295,2086,1,'20:00:00',55000),(5296,2087,1,'18:00:00',55000),(5297,2087,1,'20:00:00',55000),(5298,2088,1,'18:00:00',55000),(5299,2088,1,'20:00:00',55000),(5300,2089,1,'18:00:00',55000),(5301,2089,1,'20:00:00',55000),(5302,2090,1,'18:00:00',55000),(5303,2090,1,'20:00:00',55000),(5304,2091,1,'18:00:00',55000),(5305,2091,1,'20:00:00',55000),(5306,2092,1,'18:00:00',55000),(5307,2092,1,'20:00:00',55000),(5308,2093,1,'18:00:00',55000),(5309,2093,1,'20:00:00',55000),(5310,2094,1,'18:00:00',55000),(5311,2094,1,'20:00:00',55000),(5312,2095,1,'18:00:00',55000),(5313,2095,1,'20:00:00',55000),(5314,2096,1,'18:00:00',55000),(5315,2096,1,'20:00:00',55000),(5316,2097,1,'18:00:00',55000),(5317,2097,1,'20:00:00',55000),(5318,2098,1,'18:00:00',55000),(5319,2098,1,'20:00:00',55000),(5320,2099,1,'18:00:00',55000),(5321,2099,1,'20:00:00',55000),(5322,2100,1,'18:00:00',55000),(5323,2100,1,'20:00:00',55000),(5324,2101,1,'18:00:00',55000),(5325,2101,1,'20:00:00',55000),(5326,2102,1,'18:00:00',55000),(5327,2102,1,'20:00:00',55000),(5328,2103,1,'18:00:00',55000),(5329,2103,1,'20:00:00',55000),(5330,2104,1,'18:00:00',55000),(5331,2104,1,'20:00:00',55000),(5332,2105,1,'18:00:00',55000),(5333,2105,1,'20:00:00',55000),(5334,2106,1,'18:00:00',55000),(5335,2106,1,'20:00:00',55000),(5336,2107,1,'18:00:00',55000),(5337,2107,1,'20:00:00',55000),(5338,2108,1,'18:00:00',55000),(5339,2108,1,'20:00:00',55000),(5340,2109,1,'18:00:00',55000),(5341,2109,1,'20:00:00',55000),(5342,2110,1,'18:00:00',55000),(5343,2110,1,'20:00:00',55000),(5344,2111,1,'18:00:00',55000),(5345,2111,1,'20:00:00',55000),(5346,2112,1,'18:00:00',55000),(5347,2112,1,'20:00:00',55000),(5348,2113,1,'18:00:00',55000),(5349,2113,1,'20:00:00',55000),(5350,2114,1,'18:00:00',55000),(5351,2114,1,'20:00:00',55000),(5352,2115,1,'18:00:00',55000),(5353,2115,1,'20:00:00',55000),(5354,2116,1,'18:00:00',55000),(5355,2116,1,'20:00:00',55000),(5356,2117,1,'18:00:00',55000),(5357,2117,1,'20:00:00',55000),(5358,2118,1,'18:00:00',55000),(5359,2118,1,'20:00:00',55000),(5360,2119,1,'18:00:00',55000),(5361,2119,1,'20:00:00',55000),(5362,2120,1,'18:00:00',55000),(5363,2120,1,'20:00:00',55000),(5364,2121,1,'18:00:00',55000),(5365,2121,1,'20:00:00',55000),(5366,2122,1,'18:00:00',55000),(5367,2122,1,'20:00:00',55000),(5368,2123,1,'18:00:00',55000),(5369,2123,1,'20:00:00',55000),(5370,2124,1,'18:00:00',55000),(5371,2124,1,'20:00:00',55000),(5372,2125,1,'18:00:00',55000),(5373,2125,1,'20:00:00',55000),(5374,2126,1,'18:00:00',55000),(5375,2126,1,'20:00:00',55000),(5376,2127,1,'18:00:00',55000),(5377,2127,1,'20:00:00',55000),(5378,2128,1,'18:00:00',55000),(5379,2128,1,'20:00:00',55000),(5380,2129,1,'18:00:00',55000),(5381,2129,1,'20:00:00',55000),(5382,2130,29,'18:00:00',55000),(5383,2130,29,'20:00:00',55000),(5384,2131,29,'18:00:00',55000),(5385,2131,29,'20:00:00',55000),(5386,2132,29,'18:00:00',55000),(5387,2132,29,'20:00:00',55000),(5388,2133,29,'18:00:00',55000),(5389,2133,29,'20:00:00',55000),(5390,2134,29,'18:00:00',55000),(5391,2134,29,'20:00:00',55000),(5392,2135,29,'18:00:00',55000),(5393,2135,29,'20:00:00',55000),(5394,2136,29,'18:00:00',55000),(5395,2136,29,'20:00:00',55000),(5396,2137,29,'18:00:00',55000),(5397,2137,29,'20:00:00',55000),(5398,2138,29,'18:00:00',55000),(5399,2138,29,'20:00:00',55000),(5400,2139,29,'18:00:00',55000),(5401,2139,29,'20:00:00',55000),(5402,2140,29,'18:00:00',55000),(5403,2140,29,'20:00:00',55000),(5404,2141,29,'18:00:00',55000),(5405,2141,29,'20:00:00',55000),(5406,2142,29,'18:00:00',55000),(5407,2142,29,'20:00:00',55000),(5408,2143,29,'18:00:00',55000),(5409,2143,29,'20:00:00',55000),(5410,2144,29,'18:00:00',55000),(5411,2144,29,'20:00:00',55000),(5412,2145,29,'18:00:00',55000),(5413,2145,29,'20:00:00',55000),(5414,2146,29,'18:00:00',55000),(5415,2146,29,'20:00:00',55000),(5416,2147,29,'18:00:00',55000),(5417,2147,29,'20:00:00',55000),(5418,2148,29,'18:00:00',55000),(5419,2148,29,'20:00:00',55000),(5420,2149,29,'18:00:00',55000),(5421,2149,29,'20:00:00',55000),(5422,2150,29,'18:00:00',55000),(5423,2150,29,'20:00:00',55000),(5424,2151,29,'18:00:00',55000),(5425,2151,29,'20:00:00',55000),(5426,2152,29,'18:00:00',55000),(5427,2152,29,'20:00:00',55000),(5428,2153,29,'18:00:00',55000),(5429,2153,29,'20:00:00',55000),(5430,2154,29,'18:00:00',55000),(5431,2154,29,'20:00:00',55000),(5432,2155,29,'18:00:00',55000),(5433,2155,29,'20:00:00',55000),(5434,2156,29,'18:00:00',55000),(5435,2156,29,'20:00:00',55000),(5436,2157,29,'18:00:00',55000),(5437,2157,29,'20:00:00',55000),(5438,2158,29,'18:00:00',55000),(5439,2158,29,'20:00:00',55000),(5440,2159,29,'18:00:00',55000),(5441,2159,29,'20:00:00',55000),(5442,2160,29,'18:00:00',55000),(5443,2160,29,'20:00:00',55000),(5444,2161,29,'18:00:00',55000),(5445,2161,29,'20:00:00',55000),(5446,2162,29,'18:00:00',55000),(5447,2162,29,'20:00:00',55000),(5448,2163,29,'18:00:00',55000),(5449,2163,29,'20:00:00',55000),(5450,2164,29,'18:00:00',55000),(5451,2164,29,'20:00:00',55000),(5452,2165,29,'18:00:00',55000),(5453,2165,29,'20:00:00',55000),(5454,2166,29,'18:00:00',55000),(5455,2166,29,'20:00:00',55000),(5456,2167,29,'18:00:00',55000),(5457,2167,29,'20:00:00',55000),(5458,2168,29,'18:00:00',55000),(5459,2168,29,'20:00:00',55000),(5460,2169,29,'18:00:00',55000),(5461,2169,29,'20:00:00',55000),(5462,2170,29,'18:00:00',55000),(5463,2170,29,'20:00:00',55000),(5464,2171,29,'18:00:00',55000),(5465,2171,29,'20:00:00',55000),(5466,2172,29,'18:00:00',55000),(5467,2172,29,'20:00:00',55000),(5468,2173,29,'18:00:00',55000),(5469,2173,29,'20:00:00',55000),(5470,2174,29,'18:00:00',55000),(5471,2174,29,'20:00:00',55000),(5472,2175,29,'18:00:00',55000),(5473,2175,29,'20:00:00',55000),(5474,2176,29,'18:00:00',55000),(5475,2176,29,'20:00:00',55000),(5476,2177,29,'18:00:00',55000),(5477,2177,29,'20:00:00',55000),(5478,2178,29,'18:00:00',55000),(5479,2178,29,'20:00:00',55000),(5480,2179,29,'18:00:00',55000),(5481,2179,29,'20:00:00',55000),(5482,2180,29,'18:00:00',55000),(5483,2180,29,'20:00:00',55000),(5484,2181,29,'18:00:00',55000),(5485,2181,29,'20:00:00',55000),(5486,2182,29,'18:00:00',55000),(5487,2182,29,'20:00:00',55000),(5488,2183,29,'18:00:00',55000),(5489,2183,29,'20:00:00',55000),(5490,2184,29,'18:00:00',55000),(5491,2184,29,'20:00:00',55000),(5492,2185,29,'18:00:00',55000),(5493,2185,29,'20:00:00',55000),(5494,2186,29,'18:00:00',55000),(5495,2186,29,'20:00:00',55000),(5496,2187,29,'18:00:00',55000),(5497,2187,29,'20:00:00',55000),(5498,2188,29,'18:00:00',55000),(5499,2188,29,'20:00:00',55000),(5500,2189,29,'18:00:00',55000),(5501,2189,29,'20:00:00',55000),(5502,2190,29,'18:00:00',55000),(5503,2190,29,'20:00:00',55000),(5504,2191,29,'18:00:00',55000),(5505,2191,29,'20:00:00',55000),(5506,2192,29,'18:00:00',55000),(5507,2192,29,'20:00:00',55000),(5508,2193,29,'18:00:00',55000),(5509,2193,29,'20:00:00',55000),(5510,2194,29,'18:00:00',55000),(5511,2194,29,'20:00:00',55000),(5512,2195,29,'18:00:00',55000),(5513,2195,29,'20:00:00',55000),(5514,2196,29,'18:00:00',55000),(5515,2196,29,'20:00:00',55000),(5516,2197,29,'18:00:00',55000),(5517,2197,29,'20:00:00',55000),(5518,2198,29,'18:00:00',55000),(5519,2198,29,'20:00:00',55000),(5520,2199,29,'18:00:00',55000),(5521,2199,29,'20:00:00',55000),(5522,2200,29,'18:00:00',55000),(5523,2200,29,'20:00:00',55000),(5524,2201,29,'18:00:00',55000),(5525,2201,29,'20:00:00',55000),(5526,2202,29,'18:00:00',55000),(5527,2202,29,'20:00:00',55000),(5528,2203,29,'18:00:00',55000),(5529,2203,29,'20:00:00',55000),(5530,2204,29,'18:00:00',55000),(5531,2204,29,'20:00:00',55000),(5532,2205,29,'18:00:00',55000),(5533,2205,29,'20:00:00',55000),(5534,2206,29,'18:00:00',55000),(5535,2206,29,'20:00:00',55000),(5536,2207,29,'18:00:00',55000),(5537,2207,29,'20:00:00',55000),(5538,2208,29,'18:00:00',55000),(5539,2208,29,'20:00:00',55000),(5540,2209,29,'18:00:00',55000),(5541,2209,29,'20:00:00',55000),(5542,2210,29,'18:00:00',55000),(5543,2210,29,'20:00:00',55000),(5544,2211,29,'18:00:00',55000),(5545,2211,29,'20:00:00',55000),(5546,2212,29,'18:00:00',55000),(5547,2212,29,'20:00:00',55000),(5548,2213,29,'18:00:00',55000),(5549,2213,29,'20:00:00',55000),(5550,2214,29,'18:00:00',55000),(5551,2214,29,'20:00:00',55000),(5552,2215,29,'18:00:00',55000),(5553,2215,29,'20:00:00',55000),(5554,2216,29,'18:00:00',55000),(5555,2216,29,'20:00:00',55000),(5556,2217,29,'18:00:00',55000),(5557,2217,29,'20:00:00',55000),(5558,2218,29,'18:00:00',55000),(5559,2218,29,'20:00:00',55000),(5560,2219,29,'18:00:00',55000),(5561,2219,29,'20:00:00',55000),(5562,2220,29,'18:00:00',55000),(5563,2220,29,'20:00:00',55000),(5564,2221,29,'18:00:00',55000),(5565,2221,29,'20:00:00',55000),(5566,2222,29,'18:00:00',55000),(5567,2222,29,'20:00:00',55000),(5568,2223,29,'18:00:00',55000),(5569,2223,29,'20:00:00',55000),(5570,2224,29,'18:00:00',55000),(5571,2224,29,'20:00:00',55000),(5572,2225,29,'18:00:00',55000),(5573,2225,29,'20:00:00',55000),(5574,2226,29,'18:00:00',55000),(5575,2226,29,'20:00:00',55000),(5576,2227,29,'18:00:00',55000),(5577,2227,29,'20:00:00',55000),(5578,2228,29,'18:00:00',55000),(5579,2228,29,'20:00:00',55000),(5580,2229,29,'18:00:00',55000),(5581,2229,29,'20:00:00',55000),(5582,2230,29,'18:00:00',55000),(5583,2230,29,'20:00:00',55000),(5584,2231,29,'18:00:00',55000),(5585,2231,29,'20:00:00',55000),(5586,2232,29,'18:00:00',55000),(5587,2232,29,'20:00:00',55000),(5588,2233,29,'18:00:00',55000),(5589,2233,29,'20:00:00',55000),(5590,2234,29,'18:00:00',55000),(5591,2234,29,'20:00:00',55000),(5592,2235,29,'18:00:00',55000),(5593,2235,29,'20:00:00',55000),(5594,2236,29,'18:00:00',55000),(5595,2236,29,'20:00:00',55000),(5596,2237,29,'18:00:00',55000),(5597,2237,29,'20:00:00',55000),(5598,2238,29,'18:00:00',55000),(5599,2238,29,'20:00:00',55000),(5600,2239,29,'18:00:00',55000),(5601,2239,29,'20:00:00',55000),(5602,2240,29,'18:00:00',55000),(5603,2240,29,'20:00:00',55000),(5604,2241,29,'18:00:00',55000),(5605,2241,29,'20:00:00',55000),(5606,2242,29,'18:00:00',55000),(5607,2242,29,'20:00:00',55000),(5608,2243,29,'18:00:00',55000),(5609,2243,29,'20:00:00',55000),(5610,2244,29,'18:00:00',55000),(5611,2244,29,'20:00:00',55000),(5612,2245,29,'18:00:00',55000),(5613,2245,29,'20:00:00',55000),(5614,2246,29,'18:00:00',55000),(5615,2246,29,'20:00:00',55000),(5616,2247,29,'18:00:00',55000),(5617,2247,29,'20:00:00',55000),(5618,2248,29,'18:00:00',55000),(5619,2248,29,'20:00:00',55000),(5620,2249,29,'18:00:00',55000),(5621,2249,29,'20:00:00',55000),(5622,2250,29,'18:00:00',55000),(5623,2250,29,'20:00:00',55000),(5624,2251,29,'18:00:00',55000),(5625,2251,29,'20:00:00',55000),(5626,2252,29,'18:00:00',55000),(5627,2252,29,'20:00:00',55000),(5628,2253,29,'18:00:00',55000),(5629,2253,29,'20:00:00',55000),(5630,2254,29,'18:00:00',55000),(5631,2254,29,'20:00:00',55000),(5632,2255,29,'18:00:00',55000),(5633,2255,29,'20:00:00',55000),(5634,2256,29,'18:00:00',55000),(5635,2256,29,'20:00:00',55000),(5636,2257,29,'18:00:00',55000),(5637,2257,29,'20:00:00',55000),(5638,2258,29,'18:00:00',55000),(5639,2258,29,'20:00:00',55000),(5640,2259,29,'18:00:00',55000),(5641,2259,29,'20:00:00',55000),(5642,2260,29,'18:00:00',55000),(5643,2260,29,'20:00:00',55000),(5644,2261,29,'18:00:00',55000),(5645,2261,29,'20:00:00',55000),(5646,2262,29,'18:00:00',55000),(5647,2262,29,'20:00:00',55000),(5648,2263,29,'18:00:00',55000),(5649,2263,29,'20:00:00',55000),(5650,2264,29,'18:00:00',55000),(5651,2264,29,'20:00:00',55000),(5652,2265,29,'18:00:00',55000),(5653,2265,29,'20:00:00',55000),(5654,2266,29,'18:00:00',55000),(5655,2266,29,'20:00:00',55000),(5656,2267,29,'18:00:00',55000),(5657,2267,29,'20:00:00',55000),(5658,2268,29,'18:00:00',55000),(5659,2268,29,'20:00:00',55000),(5660,2269,29,'18:00:00',55000),(5661,2269,29,'20:00:00',55000),(5662,2270,29,'20:00:00',55000),(5663,2271,29,'20:00:00',55000),(5664,2272,29,'20:00:00',55000),(5665,2273,29,'20:00:00',55000),(5666,2274,29,'20:00:00',55000),(5667,2275,33,'18:00:00',55000),(5668,2275,33,'20:00:00',55000),(5669,2276,33,'18:00:00',55000),(5670,2276,33,'20:00:00',55000),(5671,2277,33,'18:00:00',55000),(5672,2277,33,'20:00:00',55000),(5673,2278,33,'18:00:00',55000),(5674,2278,33,'20:00:00',55000),(5675,2279,33,'18:00:00',55000),(5676,2279,33,'20:00:00',55000),(5677,2280,33,'18:00:00',55000),(5678,2280,33,'20:00:00',55000),(5679,2281,33,'18:00:00',55000),(5680,2281,33,'20:00:00',55000),(5681,2282,33,'18:00:00',55000),(5682,2282,33,'20:00:00',55000),(5683,2283,33,'18:00:00',55000),(5684,2283,33,'20:00:00',55000),(5685,2284,33,'18:00:00',55000),(5686,2284,33,'20:00:00',55000),(5687,2285,33,'18:00:00',55000),(5688,2285,33,'20:00:00',55000),(5689,2286,33,'18:00:00',55000),(5690,2286,33,'20:00:00',55000),(5691,2287,33,'18:00:00',55000),(5692,2287,33,'20:00:00',55000),(5693,2288,33,'18:00:00',55000),(5694,2288,33,'20:00:00',55000),(5695,2289,33,'18:00:00',55000),(5696,2289,33,'20:00:00',55000),(5697,2290,33,'18:00:00',55000),(5698,2290,33,'20:00:00',55000),(5699,2291,33,'18:00:00',55000),(5700,2291,33,'20:00:00',55000),(5701,2292,33,'18:00:00',55000),(5702,2292,33,'20:00:00',55000),(5703,2293,33,'18:00:00',55000),(5704,2293,33,'20:00:00',55000),(5743,2313,33,'18:00:00',55000),(5744,2313,33,'20:00:00',55000),(5745,2314,33,'18:00:00',55000),(5746,2314,33,'20:00:00',55000),(5747,2315,33,'18:00:00',55000),(5748,2315,33,'20:00:00',55000),(5749,2316,33,'18:00:00',55000),(5750,2316,33,'20:00:00',55000),(5751,2317,33,'18:00:00',55000),(5752,2317,33,'20:00:00',55000),(5753,2318,33,'18:00:00',55000),(5754,2318,33,'20:00:00',55000),(5755,2319,33,'18:00:00',55000),(5756,2319,33,'20:00:00',55000),(5757,2320,33,'18:00:00',55000),(5758,2320,33,'20:00:00',55000),(5759,2321,33,'18:00:00',55000),(5760,2321,33,'20:00:00',55000),(5761,2322,33,'18:00:00',55000),(5762,2322,33,'20:00:00',55000),(5763,2323,33,'18:00:00',55000),(5764,2323,33,'20:00:00',55000),(5765,2324,33,'18:00:00',55000),(5766,2324,33,'20:00:00',55000),(5767,2325,33,'18:00:00',55000),(5768,2325,33,'20:00:00',55000),(5769,2326,33,'18:00:00',55000),(5770,2326,33,'20:00:00',55000),(5771,2327,33,'18:00:00',55000),(5772,2327,33,'20:00:00',55000),(5773,2328,33,'18:00:00',55000),(5774,2328,33,'20:00:00',55000),(5775,2329,33,'18:00:00',55000),(5776,2329,33,'20:00:00',55000),(5777,2330,33,'18:00:00',55000),(5778,2330,33,'20:00:00',55000),(5779,2331,33,'18:00:00',55000),(5780,2331,33,'20:00:00',55000),(5781,2332,1,'09:00:00',55000),(5782,2332,1,'13:30:00',55000),(5783,2332,1,'18:00:00',55000),(5784,2332,1,'21:30:00',55000),(5785,2333,1,'09:00:00',55000),(5786,2333,1,'13:30:00',55000),(5787,2333,1,'18:00:00',55000),(5788,2333,1,'21:30:00',55000),(5789,2334,1,'09:00:00',55000),(5790,2334,1,'13:30:00',55000),(5791,2334,1,'18:00:00',55000),(5792,2334,1,'21:30:00',55000),(5793,2335,1,'09:00:00',55000),(5794,2335,1,'13:30:00',55000),(5795,2335,1,'18:00:00',55000),(5796,2335,1,'21:30:00',55000),(5797,2336,1,'09:00:00',55000),(5798,2336,1,'13:30:00',55000),(5799,2336,1,'18:00:00',55000),(5800,2336,1,'21:30:00',55000),(5801,2337,1,'09:00:00',55000),(5802,2337,1,'13:30:00',55000),(5803,2337,1,'18:00:00',55000),(5804,2337,1,'21:30:00',55000),(5805,2338,1,'09:00:00',55000),(5806,2338,1,'13:30:00',55000),(5807,2338,1,'18:00:00',55000),(5808,2338,1,'21:30:00',55000),(5809,2339,16,'09:00:00',55000),(5810,2339,16,'13:30:00',55000),(5811,2339,16,'18:00:00',55000),(5812,2339,16,'21:30:00',55000),(5813,2340,16,'09:00:00',55000),(5814,2340,16,'13:30:00',55000),(5815,2340,16,'18:00:00',55000),(5816,2340,16,'21:30:00',55000),(5817,2341,16,'09:00:00',55000),(5818,2341,16,'13:30:00',55000),(5819,2341,16,'18:00:00',55000),(5820,2341,16,'21:30:00',55000),(5821,2342,16,'09:00:00',55000),(5822,2342,16,'13:30:00',55000),(5823,2342,16,'18:00:00',55000),(5824,2342,16,'21:30:00',55000),(5825,2343,16,'09:00:00',55000),(5826,2343,16,'13:30:00',55000),(5827,2343,16,'18:00:00',55000),(5828,2343,16,'21:30:00',55000),(5829,2344,16,'09:00:00',55000),(5830,2344,16,'13:30:00',55000),(5831,2344,16,'18:00:00',55000),(5832,2344,16,'21:30:00',55000),(5833,2345,16,'09:00:00',55000),(5834,2345,16,'13:30:00',55000),(5835,2345,16,'18:00:00',55000),(5836,2345,16,'21:30:00',55000),(5837,2346,19,'09:00:00',55000),(5838,2346,19,'13:30:00',55000),(5839,2346,19,'18:00:00',55000),(5840,2346,19,'21:30:00',55000),(5841,2347,19,'09:00:00',55000),(5842,2347,19,'13:30:00',55000),(5843,2347,19,'18:00:00',55000),(5844,2347,19,'21:30:00',55000),(5845,2348,19,'09:00:00',55000),(5846,2348,19,'13:30:00',55000),(5847,2348,19,'18:00:00',55000),(5848,2348,19,'21:30:00',55000),(5849,2349,19,'09:00:00',55000),(5850,2349,19,'13:30:00',55000),(5851,2349,19,'18:00:00',55000),(5852,2349,19,'21:30:00',55000),(5853,2350,19,'09:00:00',55000),(5854,2350,19,'13:30:00',55000),(5855,2350,19,'18:00:00',55000),(5856,2350,19,'21:30:00',55000),(5857,2351,19,'09:00:00',55000),(5858,2351,19,'13:30:00',55000),(5859,2351,19,'18:00:00',55000),(5860,2351,19,'21:30:00',55000),(5861,2352,19,'09:00:00',55000),(5862,2352,19,'13:30:00',55000),(5863,2352,19,'18:00:00',55000),(5864,2352,19,'21:30:00',55000),(5949,2374,1,'00:00:00',55000),(5950,2374,2,'13:50:00',55000),(5951,2377,16,'10:30:00',65000),(5952,2377,18,'18:15:00',65000),(5953,2378,27,'10:30:00',70000),(5954,2379,1,'16:30:00',55000),(5955,2380,2,'14:00:00',55000),(5956,2381,1,'22:35:00',65000),(5957,2381,2,'13:40:00',55000);
/*!40000 ALTER TABLE `khung_gio_chieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khuyen_mai`
--

DROP TABLE IF EXISTS `khuyen_mai`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `khuyen_mai` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_khuyen_mai` varchar(255) NOT NULL,
  `ma_khuyen_mai` varchar(50) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `phan_tram_giam` decimal(5,2) NOT NULL,
  `gia_tri_giam` decimal(10,2) DEFAULT 0.00,
  `loai_giam` enum('phan_tram','tien_mat') NOT NULL DEFAULT 'phan_tram',
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `dieu_kien_ap_dung` text DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_rap` int(11) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_ma_khuyen_mai` (`ma_khuyen_mai`),
  KEY `fk_khuyen_mai_rap` (`id_rap`),
  CONSTRAINT `fk_khuyen_mai_rap` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khuyen_mai`
--

LOCK TABLES `khuyen_mai` WRITE;
/*!40000 ALTER TABLE `khuyen_mai` DISABLE KEYS */;
INSERT INTO `khuyen_mai` VALUES (2,'Khuyến mãi học sinh sinh viên','HSSV15','Giảm 15% cho HSSV với thẻ học sinh/sinh viên',15.00,0.00,'phan_tram','2025-01-01','2025-12-31','Xuất trình thẻ HSSV hợp lệ',1,'2025-08-15 14:49:08',NULL,NULL),(3,'Khuyến mãi ngày lễ','NGAYLE10','Giảm 10% cho tất cả khách hàng vào ngày lễ',10.00,0.00,'phan_tram','2025-01-01','2025-12-31','Áp dụng vào các ngày lễ quốc gia',1,'2025-08-15 14:49:08',NULL,NULL),(6,'Chào Hè 2026','HE2026','Chào hè giảm sốc',15.00,100000.00,'phan_tram','2026-01-09','2026-12-28','Áp dụng mọi loại vé',1,'2025-12-01 17:51:24',NULL,NULL),(7,'Giảm giá cho Học sinh/Sinh viên','STUDENT','Giảm sốc cho học sinh/sinh viên',10.00,0.00,'phan_tram','2026-04-07','2026-11-11',NULL,1,'2026-04-07 17:48:05',NULL,NULL),(8,'TEST','TEST10','',10.00,0.00,'phan_tram','2026-01-01','2026-12-31',NULL,-1,'2026-04-07 17:58:50',NULL,NULL);
/*!40000 ALTER TABLE `khuyen_mai` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_lam_viec`
--

DROP TABLE IF EXISTS `lich_lam_viec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_lam_viec` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nhan_vien` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay` date NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `ca_lam` varchar(50) DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `trang_thai` enum('lich','doi','huy') DEFAULT 'lich',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nhan_vien` (`id_nhan_vien`),
  KEY `id_rap` (`id_rap`),
  CONSTRAINT `llv_ibfk_1` FOREIGN KEY (`id_nhan_vien`) REFERENCES `taikhoan` (`id`),
  CONSTRAINT `llv_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=808 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_lam_viec`
--

LOCK TABLES `lich_lam_viec` WRITE;
/*!40000 ALTER TABLE `lich_lam_viec` DISABLE KEYS */;
INSERT INTO `lich_lam_viec` VALUES (605,30,1,'2025-12-02','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:43'),(606,30,1,'2025-12-03','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:43'),(607,30,1,'2025-12-04','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:43'),(608,30,1,'2025-12-05','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:43'),(610,30,1,'2025-12-08','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:43'),(611,30,1,'2025-12-09','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(612,30,1,'2025-12-10','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(613,30,1,'2025-12-11','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(614,30,1,'2025-12-12','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(615,30,1,'2025-12-13','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(616,30,1,'2025-12-15','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(617,30,1,'2025-12-16','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(618,30,1,'2025-12-17','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(619,30,1,'2025-12-18','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(620,30,1,'2025-12-19','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(621,30,1,'2025-12-20','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(622,30,1,'2025-12-22','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(623,30,1,'2025-12-23','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(624,30,1,'2025-12-24','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(625,30,1,'2025-12-25','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(626,30,1,'2025-12-26','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(627,30,1,'2025-12-27','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(628,30,1,'2025-12-29','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(629,30,1,'2025-12-30','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(630,30,1,'2025-12-31','08:00:00','12:00:00','Sáng','Chúc em làm việc tốt','lich','2025-12-01 13:26:44'),(631,34,1,'2025-12-01','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(632,34,1,'2025-12-02','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(633,34,1,'2025-12-03','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(634,34,1,'2025-12-04','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(635,34,1,'2025-12-05','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(636,34,1,'2025-12-08','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(637,34,1,'2025-12-09','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(638,34,1,'2025-12-10','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(639,34,1,'2025-12-11','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(640,34,1,'2025-12-12','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(641,34,1,'2025-12-15','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(642,34,1,'2025-12-16','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(643,34,1,'2025-12-17','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(644,34,1,'2025-12-18','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(645,34,1,'2025-12-19','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(646,34,1,'2025-12-22','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(647,34,1,'2025-12-23','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(648,34,1,'2025-12-24','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(649,34,1,'2025-12-25','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(650,34,1,'2025-12-26','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(651,34,1,'2025-12-29','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(652,34,1,'2025-12-30','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(653,34,1,'2025-12-31','13:00:00','17:00:00','Chiều',NULL,'lich','2025-12-01 13:28:06'),(654,37,1,'2025-12-01','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(655,37,1,'2025-12-02','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(656,37,1,'2025-12-03','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(657,37,1,'2025-12-04','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(658,37,1,'2025-12-05','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(659,37,1,'2025-12-08','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(660,37,1,'2025-12-09','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(661,37,1,'2025-12-10','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(662,37,1,'2025-12-11','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(663,37,1,'2025-12-12','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(664,37,1,'2025-12-15','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(665,37,1,'2025-12-16','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(666,37,1,'2025-12-17','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(667,37,1,'2025-12-18','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(668,37,1,'2025-12-19','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(669,37,1,'2025-12-22','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(670,37,1,'2025-12-23','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(671,37,1,'2025-12-24','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(672,37,1,'2025-12-25','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(673,37,1,'2025-12-26','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(674,37,1,'2025-12-29','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:34'),(675,37,1,'2025-12-30','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:35'),(676,37,1,'2025-12-31','17:00:00','22:00:00','Tối',NULL,'lich','2025-12-01 13:28:35'),(765,30,1,'2026-01-01','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(766,30,1,'2026-01-02','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(767,30,1,'2026-01-03','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(768,30,1,'2026-01-04','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(769,30,1,'2026-01-05','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(770,30,1,'2026-01-06','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(771,30,1,'2026-01-07','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:52'),(772,30,1,'2026-01-08','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:53'),(773,30,1,'2026-01-09','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:53'),(774,30,1,'2026-01-10','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:04:53'),(775,34,1,'2026-01-12','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(776,34,1,'2026-01-13','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(777,34,1,'2026-01-14','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(778,34,1,'2026-01-15','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(779,34,1,'2026-01-16','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(780,34,1,'2026-01-19','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(781,34,1,'2026-01-20','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(782,34,1,'2026-01-21','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(783,34,1,'2026-01-22','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(784,34,1,'2026-01-23','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(785,34,1,'2026-01-26','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(786,34,1,'2026-01-27','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(787,34,1,'2026-01-28','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(788,34,1,'2026-01-29','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(789,34,1,'2026-01-30','09:00:00','18:00:00','Hành chính',NULL,'lich','2025-12-04 05:45:48'),(804,37,1,'2026-04-07','08:00:00','16:00:00','Ca sáng','Làm nghiêm túc','lich','2026-04-07 15:18:03'),(805,34,1,'2026-04-07','14:00:00','21:00:00','Ca chiều','Ca tối','lich','2026-04-07 16:35:17'),(806,50,1,'2026-05-04','08:00:00','17:00:00','Ca sáng','Ca BT01','lich','2026-05-04 13:40:58'),(807,50,1,'2026-05-06','08:00:00','17:00:00','Ca sáng','Ca BT01','lich','2026-05-04 13:41:24');
/*!40000 ALTER TABLE `lich_lam_viec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_diem`
--

DROP TABLE IF EXISTS `lich_su_diem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_diem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tk` int(11) NOT NULL,
  `loai_giao_dich` enum('cong','tru','huy') NOT NULL,
  `so_diem` int(11) NOT NULL,
  `ly_do` varchar(500) NOT NULL,
  `id_ve` int(11) DEFAULT NULL COMMENT 'ID vé liên quan (nếu có)',
  `id_hoa_don` int(11) DEFAULT NULL COMMENT 'ID hóa đơn liên quan (nếu có)',
  `nguoi_thuc_hien` varchar(100) DEFAULT 'system' COMMENT 'Ai thực hiện (system/admin/user)',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_ve` (`id_ve`),
  KEY `id_hoa_don` (`id_hoa_don`),
  KEY `idx_user_date` (`id_tk`,`ngay_tao`),
  KEY `idx_transaction_type` (`loai_giao_dich`),
  CONSTRAINT `lich_su_diem_ibfk_1` FOREIGN KEY (`id_tk`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_diem_ibfk_2` FOREIGN KEY (`id_ve`) REFERENCES `ve` (`id`) ON DELETE SET NULL,
  CONSTRAINT `lich_su_diem_ibfk_3` FOREIGN KEY (`id_hoa_don`) REFERENCES `hoa_don` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_diem`
--

LOCK TABLES `lich_su_diem` WRITE;
/*!40000 ALTER TABLE `lich_su_diem` DISABLE KEYS */;
INSERT INTO `lich_su_diem` VALUES (27,17,'cong',600,'Thanh toán vé phim qua MoMo',NULL,NULL,'system','2025-12-03 11:58:22'),(28,17,'cong',200,'Thanh toán vé phim qua MoMo',NULL,NULL,'system','2025-12-03 12:20:28'),(29,17,'cong',1200,'Thanh toán vé phim qua MoMo',NULL,NULL,'system','2025-12-03 12:31:26'),(30,17,'tru',1000,'Sử dụng điểm để giảm giá vé phim',NULL,NULL,'system','2025-12-03 16:29:26'),(31,17,'cong',360,'Thanh toán vé phim qua MoMo',NULL,NULL,'system','2025-12-03 16:29:26'),(36,48,'cong',260,'Tích điểm từ đơn hàng #84',456,84,'system','2026-04-07 21:59:39'),(37,48,'cong',230,'Tích điểm từ đơn hàng #85',457,85,'system','2026-04-07 22:05:22'),(38,48,'cong',195,'Tích điểm từ đơn hàng #86',458,86,'system','2026-04-07 22:12:31'),(39,48,'cong',180,'Tích điểm từ đơn hàng #87',459,87,'system','2026-04-07 22:14:39'),(40,48,'cong',245,'Tích điểm từ đơn hàng #88',460,88,'system','2026-04-07 22:15:58'),(41,48,'cong',180,'Tích điểm từ đơn hàng #89',461,89,'system','2026-04-07 22:28:46'),(42,48,'cong',139,'Tích điểm từ đơn hàng #90',462,90,'system','2026-04-08 00:27:45'),(43,48,'cong',148,'Tích điểm từ đơn hàng #92',464,92,'system','2026-04-08 01:17:35'),(44,48,'cong',240,'Tích điểm từ đơn hàng #93',465,93,'system','2026-04-08 01:19:41'),(45,48,'cong',179,'Tích điểm từ đơn hàng #94',466,94,'system','2026-04-08 01:28:01'),(46,48,'cong',230,'Tích điểm từ đơn hàng #95',467,95,'system','2026-05-04 20:36:54');
/*!40000 ALTER TABLE `lich_su_diem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_phe_duyet_bangluong`
--

DROP TABLE IF EXISTS `lich_su_phe_duyet_bangluong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_phe_duyet_bangluong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `id_user_duyet` int(11) DEFAULT NULL,
  `trang_thai_cu` varchar(50) DEFAULT NULL,
  `trang_thai_moi` varchar(50) NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `ngay_phe_duyet` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_user_duyet` (`id_user_duyet`),
  KEY `idx_thang_trang_thai` (`id_bang_luong`,`ngay_phe_duyet`),
  CONSTRAINT `lich_su_phe_duyet_bangluong_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_phe_duyet_bangluong_ibfk_2` FOREIGN KEY (`id_user_duyet`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_phe_duyet_bangluong`
--

LOCK TABLES `lich_su_phe_duyet_bangluong` WRITE;
/*!40000 ALTER TABLE `lich_su_phe_duyet_bangluong` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_phe_duyet_bangluong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_thanh_toan`
--

DROP TABLE IF EXISTS `lich_su_thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_thanh_toan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `id_nv` int(11) NOT NULL,
  `thang` varchar(7) NOT NULL COMMENT 'YYYY-MM format',
  `so_tien` decimal(15,2) NOT NULL COMMENT 'Amount paid',
  `phuong_thuc` varchar(50) DEFAULT 'mock_transfer' COMMENT 'Payment method',
  `status` varchar(50) DEFAULT 'da_thanh_toan' COMMENT 'Transaction status',
  `ngay_thanh_toan` datetime DEFAULT current_timestamp() COMMENT 'Payment date/time',
  `ghi_chu` text DEFAULT NULL COMMENT 'Notes',
  `receipt_id` varchar(50) DEFAULT NULL COMMENT 'Receipt/transaction reference number',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_transaction` (`id_bang_luong`,`id_nv`,`thang`),
  KEY `idx_thang` (`thang`),
  KEY `idx_id_nv` (`id_nv`),
  KEY `idx_id_bang_luong` (`id_bang_luong`),
  KEY `idx_receipt_id` (`receipt_id`),
  CONSTRAINT `lich_su_thanh_toan_ibfk_1` FOREIGN KEY (`id_nv`) REFERENCES `nhan_vien_rap` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_thanh_toan_ibfk_2` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment transaction history - L?ch s? thanh to?n l??ng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_thanh_toan`
--

LOCK TABLES `lich_su_thanh_toan` WRITE;
/*!40000 ALTER TABLE `lich_su_thanh_toan` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_thanh_toan_ve`
--

DROP TABLE IF EXISTS `lich_su_thanh_toan_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_thanh_toan_ve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ve` int(11) NOT NULL,
  `id_tk` int(11) NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `phuong_thuc` varchar(50) DEFAULT 'sepay' COMMENT 'Payment method',
  `transaction_id` varchar(100) DEFAULT NULL COMMENT 'Sepay transaction ID',
  `status` varchar(50) DEFAULT 'pending' COMMENT 'pending|success|failed',
  `ma_gd_sepay` varchar(100) DEFAULT NULL COMMENT 'Mã giao dịch Sepay',
  `noi_dung_chuyen_khoan` varchar(255) DEFAULT NULL COMMENT 'Content of transfer',
  `ngay_thanh_toan` datetime DEFAULT current_timestamp(),
  `ghi_chu` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_ve` (`id_ve`),
  KEY `id_tk` (`id_tk`),
  CONSTRAINT `lich_su_thanh_toan_ve_ibfk_1` FOREIGN KEY (`id_ve`) REFERENCES `ve` (`id`),
  CONSTRAINT `lich_su_thanh_toan_ve_ibfk_2` FOREIGN KEY (`id_tk`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Payment history for tickets - Lịch sử thanh toán vé';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_thanh_toan_ve`
--

LOCK TABLES `lich_su_thanh_toan_ve` WRITE;
/*!40000 ALTER TABLE `lich_su_thanh_toan_ve` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_thanh_toan_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_thay_doi_bangluong`
--

DROP TABLE IF EXISTS `lich_su_thay_doi_bangluong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_thay_doi_bangluong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_bang_luong` int(11) NOT NULL,
  `id_user_thay_doi` int(11) DEFAULT NULL,
  `cot_thay_doi` varchar(50) NOT NULL COMMENT 'C?t n?o thay ??i',
  `gia_tri_cu` text DEFAULT NULL,
  `gia_tri_moi` text DEFAULT NULL,
  `ly_do` text DEFAULT NULL,
  `ngay_thay_doi` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_user_thay_doi` (`id_user_thay_doi`),
  KEY `idx_thang_nv` (`id_bang_luong`,`ngay_thay_doi`),
  CONSTRAINT `lich_su_thay_doi_bangluong_ibfk_1` FOREIGN KEY (`id_bang_luong`) REFERENCES `bang_luong` (`id`) ON DELETE CASCADE,
  CONSTRAINT `lich_su_thay_doi_bangluong_ibfk_2` FOREIGN KEY (`id_user_thay_doi`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_thay_doi_bangluong`
--

LOCK TABLES `lich_su_thay_doi_bangluong` WRITE;
/*!40000 ALTER TABLE `lich_su_thay_doi_bangluong` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_thay_doi_bangluong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_xem_phim`
--

DROP TABLE IF EXISTS `lich_su_xem_phim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lich_su_xem_phim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_phim` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay_xem` datetime NOT NULL,
  `danh_gia` tinyint(1) DEFAULT NULL,
  `binh_luan` text DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_phim` (`id_phim`),
  KEY `id_rap` (`id_rap`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_xem_phim`
--

LOCK TABLES `lich_su_xem_phim` WRITE;
/*!40000 ALTER TABLE `lich_su_xem_phim` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_xem_phim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lichchieu`
--

DROP TABLE IF EXISTS `lichchieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lichchieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_ke_hoach` varchar(50) DEFAULT NULL,
  `id_phim` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay_chieu` date NOT NULL DEFAULT current_timestamp(),
  `trang_thai_duyet` enum('Chờ duyệt','Đã duyệt','Từ chối') NOT NULL DEFAULT 'Chờ duyệt',
  `ghi_chu` text DEFAULT NULL,
  `nguoi_tao` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_gui` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_phim` (`id_phim`),
  KEY `lichchieu_ibfk_2` (`id_rap`),
  KEY `idx_ma_ke_hoach` (`ma_ke_hoach`),
  CONSTRAINT `lichchieu_ibfk_1` FOREIGN KEY (`id_phim`) REFERENCES `phim` (`id`),
  CONSTRAINT `lichchieu_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2382 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lichchieu`
--

LOCK TABLES `lichchieu` WRITE;
/*!40000 ALTER TABLE `lichchieu` DISABLE KEYS */;
INSERT INTO `lichchieu` VALUES (2332,'PLAN-1-5-2026-04-07',5,1,'2026-04-07','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2333,'PLAN-1-5-2026-04-08',5,1,'2026-04-08','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2334,'PLAN-1-5-2026-04-09',5,1,'2026-04-09','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2335,'PLAN-1-5-2026-04-10',5,1,'2026-04-10','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2336,'PLAN-1-5-2026-04-11',5,1,'2026-04-11','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2337,'PLAN-1-5-2026-04-12',5,1,'2026-04-12','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2338,'PLAN-1-5-2026-04-13',5,1,'2026-04-13','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2339,'PLAN-2-5-2026-04-07',5,2,'2026-04-07','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2340,'PLAN-2-5-2026-04-08',5,2,'2026-04-08','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2341,'PLAN-2-5-2026-04-09',5,2,'2026-04-09','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2342,'PLAN-2-5-2026-04-10',5,2,'2026-04-10','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2343,'PLAN-2-5-2026-04-11',5,2,'2026-04-11','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2344,'PLAN-2-5-2026-04-12',5,2,'2026-04-12','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2345,'PLAN-2-5-2026-04-13',5,2,'2026-04-13','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2346,'PLAN-3-5-2026-04-07',5,3,'2026-04-07','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2347,'PLAN-3-5-2026-04-08',5,3,'2026-04-08','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2348,'PLAN-3-5-2026-04-09',5,3,'2026-04-09','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2349,'PLAN-3-5-2026-04-10',5,3,'2026-04-10','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2350,'PLAN-3-5-2026-04-11',5,3,'2026-04-11','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2351,'PLAN-3-5-2026-04-12',5,3,'2026-04-12','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2352,'PLAN-3-5-2026-04-13',5,3,'2026-04-13','Đã duyệt',NULL,NULL,'2026-04-07 20:22:36',NULL),(2374,NULL,39,1,'2026-04-07','Đã duyệt',NULL,NULL,'2026-04-07 21:02:11',NULL),(2376,NULL,39,1,'2026-04-08','Đã duyệt',NULL,NULL,'2026-04-07 21:03:48',NULL),(2377,NULL,36,2,'2026-04-07','Đã duyệt',NULL,10,'2026-04-07 22:27:43',NULL),(2378,NULL,7,1,'2026-04-30','Chờ duyệt',NULL,10,'2026-04-07 23:55:34',NULL),(2379,NULL,7,1,'2026-04-30','Chờ duyệt',NULL,10,'2026-04-07 23:56:26',NULL),(2380,NULL,39,1,'2026-04-08','Đã duyệt',NULL,10,'2026-04-08 00:24:56',NULL),(2381,NULL,40,1,'2026-05-05','Đã duyệt',NULL,10,'2026-05-04 20:35:40',NULL);
/*!40000 ALTER TABLE `lichchieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_khau_tru`
--

DROP TABLE IF EXISTS `loai_khau_tru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loai_khau_tru` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_khau_tru` varchar(100) NOT NULL COMMENT 'V? d?: ?i mu?n, V? s?m, Thi?u h?...',
  `mo_ta` text DEFAULT NULL,
  `so_tien_phat_tren_lan` decimal(12,2) DEFAULT 0.00,
  `so_tien_phat_tren_gio` decimal(12,2) DEFAULT 0.00,
  `trang_thai` enum('active','inactive') DEFAULT 'active',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_khau_tru`
--

LOCK TABLES `loai_khau_tru` WRITE;
/*!40000 ALTER TABLE `loai_khau_tru` DISABLE KEYS */;
INSERT INTO `loai_khau_tru` VALUES (1,'?i mu?n','Ph?t ?i mu?n',50000.00,0.00,'active','2025-11-30 17:54:43'),(2,'V? s?m','Ph?t v? s?m',50000.00,0.00,'active','2025-11-30 17:54:43'),(3,'Thi?u h?','Ph?t thi?u h?',100000.00,0.00,'active','2025-11-30 17:54:43'),(4,'Kh?ng ch?p h?nh quy ??nh','Ph?t kh?ng ch?p h?nh quy ??nh',200000.00,0.00,'active','2025-11-30 17:54:43');
/*!40000 ALTER TABLE `loai_khau_tru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_luong`
--

DROP TABLE IF EXISTS `loai_luong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loai_luong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_loai` varchar(100) NOT NULL COMMENT 'V? d?: Nh?n vi?n b?n v?, Nh?n vi?n qu?y, Qu?n l?...',
  `mota` text DEFAULT NULL,
  `luong_co_ban` decimal(12,2) NOT NULL DEFAULT 30000.00 COMMENT 'L??ng c? b?n/gi?',
  `he_so_luong` decimal(4,2) DEFAULT 1.00 COMMENT 'H? s? nh?n l??ng',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ten_loai` (`ten_loai`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_luong`
--

LOCK TABLES `loai_luong` WRITE;
/*!40000 ALTER TABLE `loai_luong` DISABLE KEYS */;
INSERT INTO `loai_luong` VALUES (1,'Nh?n vi?n b?n v?','L??ng nh?n vi?n b?n v?',30000.00,1.00,'2025-11-30 17:54:43',NULL),(2,'Nh?n vi?n qu?y','L??ng nh?n vi?n qu?y ?n/b?n h?ng',30000.00,1.00,'2025-11-30 17:54:43',NULL),(3,'Qu?n l? ph?ng','L??ng qu?n l? ph?ng chi?u',35000.00,1.20,'2025-11-30 17:54:43',NULL),(4,'Tr??ng ca','L??ng tr??ng ca',35000.00,1.20,'2025-11-30 17:54:43',NULL),(5,'Qu?n l? r?p','L??ng qu?n l? r?p',40000.00,1.50,'2025-11-30 17:54:43',NULL);
/*!40000 ALTER TABLE `loai_luong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loai_phu_cap`
--

DROP TABLE IF EXISTS `loai_phu_cap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loai_phu_cap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_phu_cap` varchar(100) NOT NULL COMMENT 'V? d?: ?n tr?a, Ph? c?p ??m, Ph? c?p nguy hi?m...',
  `mo_ta` text DEFAULT NULL,
  `so_tien_mac_dinh` decimal(12,2) DEFAULT 0.00 COMMENT 'S? ti?n m?c ??nh',
  `kieu` enum('co_dinh','theo_gio','theo_tien') DEFAULT 'co_dinh' COMMENT 'Lo?i ph? c?p',
  `chi_tieu` varchar(255) DEFAULT NULL COMMENT 'Ti?u ch? ?p d?ng (v? d?: 22:00-06:00 cho ??m)',
  `trang_thai` enum('active','inactive') DEFAULT 'active',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loai_phu_cap`
--

LOCK TABLES `loai_phu_cap` WRITE;
/*!40000 ALTER TABLE `loai_phu_cap` DISABLE KEYS */;
INSERT INTO `loai_phu_cap` VALUES (1,'?n tr?a','Ph? c?p ?n tr?a h?ng ng?y',100000.00,'co_dinh','H?ng ng?y','active','2025-11-30 17:54:43'),(2,'Ph? c?p ??m','Ph? c?p l?m vi?c ca ??m (22:00-06:00)',150000.00,'theo_gio','22:00-06:00','active','2025-11-30 17:54:43'),(3,'Ph? c?p nguy hi?m','Ph? c?p c?ng vi?c nguy hi?m',200000.00,'co_dinh','C?ng vi?c nguy hi?m','active','2025-11-30 17:54:43'),(4,'Ph? c?p ?i?n tho?i','H? tr? chi ph? ?i?n tho?i',50000.00,'co_dinh','H?ng th?ng','active','2025-11-30 17:54:43'),(5,'Ph? c?p x?ng xe','H? tr? chi ph? ?i l?i',300000.00,'co_dinh','H?ng th?ng','active','2025-11-30 17:54:43');
/*!40000 ALTER TABLE `loai_phu_cap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loaiphim`
--

DROP TABLE IF EXISTS `loaiphim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loaiphim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loaiphim`
--

LOCK TABLES `loaiphim` WRITE;
/*!40000 ALTER TABLE `loaiphim` DISABLE KEYS */;
INSERT INTO `loaiphim` VALUES (1,'Kinh Dị'),(2,'Ngôn Tình'),(3,'Hài'),(5,'Ca nhạc'),(8,'Cổ Trang'),(9,'Hoạt Hình'),(16,'Lịch sử'),(17,'Khoa học viễn tưởng');
/*!40000 ALTER TABLE `loaiphim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ngay_nghi_phep`
--

DROP TABLE IF EXISTS `ngay_nghi_phep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ngay_nghi_phep` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `loai` enum('phep_nam','phep_khong_luong','nghi_tat_nhat','nghi_phuc_vu_cong_cong') DEFAULT 'phep_nam',
  `so_ngay` decimal(5,2) DEFAULT NULL,
  `trang_thai` enum('cho_duyet','duyet','tu_choi') DEFAULT 'cho_duyet',
  `ly_do` text DEFAULT NULL,
  `nguoi_duyet` int(11) DEFAULT NULL,
  `ngay_duyet` datetime DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nv` (`id_nv`),
  KEY `id_rap` (`id_rap`),
  KEY `nguoi_duyet` (`nguoi_duyet`),
  CONSTRAINT `ngay_nghi_phep_ibfk_1` FOREIGN KEY (`id_nv`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ngay_nghi_phep_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ngay_nghi_phep_ibfk_3` FOREIGN KEY (`nguoi_duyet`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ngay_nghi_phep`
--

LOCK TABLES `ngay_nghi_phep` WRITE;
/*!40000 ALTER TABLE `ngay_nghi_phep` DISABLE KEYS */;
/*!40000 ALTER TABLE `ngay_nghi_phep` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien_rap`
--

DROP TABLE IF EXISTS `nhan_vien_rap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nhan_vien_rap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tai_khoan` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `chuc_vu` varchar(100) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `luong_co_ban` decimal(10,2) DEFAULT 0.00,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_tai_khoan` (`id_tai_khoan`),
  KEY `id_rap` (`id_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien_rap`
--

LOCK TABLES `nhan_vien_rap` WRITE;
/*!40000 ALTER TABLE `nhan_vien_rap` DISABLE KEYS */;
INSERT INTO `nhan_vien_rap` VALUES (1,14,1,'Nhân viên bán vé','2025-01-01',8000000.00,1,'2025-08-15 14:53:15'),(2,10,1,'Quản lý rạp','2025-01-01',15000000.00,1,'2025-08-15 14:53:15');
/*!40000 ALTER TABLE `nhan_vien_rap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phim`
--

DROP TABLE IF EXISTS `phim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) NOT NULL,
  `daodien` varchar(255) NOT NULL,
  `dienvien` varchar(255) NOT NULL,
  `img` varchar(255) NOT NULL,
  `mo_ta` text NOT NULL,
  `date_phat_hanh` date NOT NULL,
  `thoi_luong_phim` int(11) NOT NULL,
  `id_loai` int(11) NOT NULL,
  `quoc_gia` varchar(255) NOT NULL,
  `gia_han_tuoi` int(11) NOT NULL,
  `link_trailer` varchar(5000) NOT NULL,
  `trang_thai_duyet` enum('cho_duyet','da_duyet','tu_choi') DEFAULT 'cho_duyet',
  PRIMARY KEY (`id`),
  KEY `id_loai` (`id_loai`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phim`
--

LOCK TABLES `phim` WRITE;
/*!40000 ALTER TABLE `phim` DISABLE KEYS */;
INSERT INTO `phim` VALUES (5,'THÁM TỬ KIÊN: KỲ ÁN KHÔNG ĐẦU','Victor Vũ','Quốc Huy Đoàn Minh Anh Đinh Ngọc Diệp Quốc Anh Võ Điền Gia Huy','1775582090498-187259800.webp','Câu chuyện lấy bối cảnh tại một ngôi làng hẻo lánh, nơi Hai Mẫn sinh sống. Trong suốt 5 năm, làng liên tục xảy ra 8 vụ án mạng với đặc điểm chung kinh dị: nạn nhân đều bị mất đầu. Những lời đồn đại về ma da (vong linh dưới nước) bắt đầu lan truyền mạnh mẽ khi thầy mo của làng phát hiện lươn bò ra từ bụng một tử thi trong buổi khám nghiệm. Để ngăn chặn sự quấy phá, dân làng thường thắp loại hương đặc biệt do thầy mo cung cấp và phong ấn các nạn nhân tại bãi đất hoang. Một dấu hiệu đặc trưng là người dân thường bị chảy máu cam mỗi khi ma da được cho là đang hoành hành.','2025-04-27',131,16,'Việt Nam',18,'https://www.youtube.com/watch?v=QiXNbEKF3U0','da_duyet'),(7,'ĐẤT RỪNG PHƯƠNG NAM','Nguyễn Quang Dũng',' Trấn Thành, Nguyễn Trinh Hoan, Nguyen Tri Vien','1775566019672-227484533.jpg','Đất rừng phương Nam là một bộ phim điện ảnh Việt Nam thuộc thể loại sử thi – tâm lý – chính kịch ra mắt vào năm 2023, được dựa trên cuốn tiểu thuyết cùng tên của nhà văn Đoàn Giỏi và bộ phim truyền hình Đất phương Nam vào năm 1997','2024-05-17',123,16,'Việt Nam',13,'https://www.youtube.com/watch?v=hktzirCnJmQ','da_duyet'),(36,'ĐỊA ĐẠO','Bùi Thạc Chuyên','Thái Hòa; Quang Tuấn; Diễm Hằng Lamoon; Anh Tú Wilson; Hồ Thu Anh','1775565767782-959227174.webp','Nhân dịp kỷ niệm 50 năm đất nước hoà bình này còn phim nào thoả được nỗi niềm thưởng thức thước phim thời chiến đầy hào hùng như Địa Đạo: Mặt Trời Trong Bóng Tối. Nay còn có thêm định dạng 4DX cho khán giả trải nghiệm chui hầm dưới lòng Củ Chi đất thép.\r\n','2025-03-30',130,16,'Việt ',18,'https://www.youtube.com/watch?v=zMLaRfAilvA','da_duyet'),(37,'LẬT MẶT 6: TẤM VÉ ĐỊNH MỆNH','Lý Hải','Quốc Cường, Trung Dũng, Huy Khánh, Thanh Thức, Diệp Bảo Ngọc, Trần Kim Hải, Huỳnh Thi, Tú Tri, Quỳnh Như, Tạ Lâm','1775565332551-262199404.jpg','Phim kể về tấm vé số có mệnh giá 10 ngàn đồng và sở hữu những con số \"định mệnh\" gồm 10, 16, 18, 20, 27, 28 - đây là tập hợp những con số ngày sinh của hội bạn thân gồm 6 người: Phương, Khanh, Phát, An, Toàn và Lộc. Câu chuyện bắt đầu khi Phương mua một tấm vé số có dãy số là tập hợp ngày sinh của cả 6 người. Và nếu như tấm vé này may mắn trúng giải, họ sẽ chia đều tiền thưởng cho cả 6 người. Và quả nhiên, tấm vé định mệnh này đã đem về cho nhóm một giải thưởng tới hơn 136 tỷ đồng. Tuy nhiên, người giữ tấm vé số là An lại gặp tai nạn tang thương và tấm vé số nằm ở ốp lưng điện thoại đã theo anh xuống mồ.','2025-05-23',150,2,'Việt ',18,'https://www.youtube.com/watch?v=L-XhraxUsAs','da_duyet'),(39,'HẸN EM NGÀY NHẬT THỰC','Lê Thiện Viễn','Đoàn Thiên Ân, Khương Lê, NSND Lê Khanh, Huỳnh Phương, Nguyên Thảo, NSND Kim Xuân, Thanh Sơn, Hứa Vĩ Văn, Lâm Vỹ Dạ, Hứa Minh Đạt.','1775566231702-915281564.jpg','Năm 1995, khi đang đứng trước một quyết định quan trọng của cuộc đời, Ân bất ngờ bị kéo trở lại quá khứ bởi những bức thư tình chưa từng trao tay. Hành trình tìm gặp Thiên - mối tình đầu từng khắc sâu trong tim - đưa cô về lại thôn xóm Trà Mây năm xưa, nơi những ký ức ngọt ngào xen lẫn tổn thương vẫn chưa hề nguôi ngoai. Trong khoảnh khắc định mệnh khi hai người bất ngờ chạm mặt, những bí mật bị che giấu suốt nhiều năm dần hé lộ, buộc Ân phải đối diện với sự thật và lựa chọn con đường cho riêng mình. “Hẹn Em Ngày Nhật Thực” là câu chuyện tình yêu đầy cảm xúc về những điều chưa nói, về tình yêu vĩnh cửu và câu hỏi day dứt: nếu còn cơ hội, ta có dám tin vào trái tim mình một lần nữa?','2026-03-30',118,2,'Việt Nam',16,'https://www.youtube.com/watch?v=8fRszUyt_YQ','da_duyet'),(40,'QUỶ NHẬP TRÀNG 2','Pom Nguyễn','Khả Như, Doãn Quốc Đam, Ngọc Hương...','1775582328141-147536047.jpeg','\"Quỷ Nhập Tràng 2\" là phần tiếp theo của bộ phim kinh dị Việt Nam \"Quỷ Nhập Tràng\" (2025), ra mắt vào năm 2026. Bộ phim này không chỉ là phần tiếp theo mà còn là phần thứ tư trong dự án điện ảnh quy mô mang tên \"Vũ trụ linh dị ngũ hành\" do đạo diễn Nhất Trung khởi xướng. Nội dung phim tập trung vào quá khứ của nhân vật Minh Như, từ đó hé lộ những bi kịch gia đình và các giao ước đẫm máu dẫn đến sự trỗi dậy của thế lực quỷ dữ.','2026-04-21',126,1,'Việt Nam',18,'https://www.youtube.com/watch?v=VCI9XTxlQxk','da_duyet');
/*!40000 ALTER TABLE `phim` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phim_rap`
--

DROP TABLE IF EXISTS `phim_rap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phim_rap` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phim` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_phim_rap` (`id_phim`,`id_rap`),
  KEY `id_phim` (`id_phim`),
  KEY `id_rap` (`id_rap`),
  CONSTRAINT `pr_phim_fk` FOREIGN KEY (`id_phim`) REFERENCES `phim` (`id`),
  CONSTRAINT `pr_rap_fk` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=450 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phim_rap`
--

LOCK TABLES `phim_rap` WRITE;
/*!40000 ALTER TABLE `phim_rap` DISABLE KEYS */;
/*!40000 ALTER TABLE `phim_rap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phong_ghe`
--

DROP TABLE IF EXISTS `phong_ghe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phong_ghe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phong` int(11) NOT NULL,
  `row_label` varchar(4) NOT NULL,
  `seat_number` int(11) NOT NULL,
  `code` varchar(16) NOT NULL,
  `tier` enum('cheap','middle','expensive') NOT NULL DEFAULT 'cheap',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_room_code` (`id_phong`,`code`),
  KEY `idx_room` (`id_phong`)
) ENGINE=InnoDB AUTO_INCREMENT=12138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phong_ghe`
--

LOCK TABLES `phong_ghe` WRITE;
/*!40000 ALTER TABLE `phong_ghe` DISABLE KEYS */;
INSERT INTO `phong_ghe` VALUES (1473,16,'A',1,'A1','cheap',1),(1474,16,'A',2,'A2','cheap',1),(1475,16,'A',3,'A3','cheap',1),(1476,16,'A',4,'A4','cheap',1),(1477,16,'A',5,'A5','cheap',1),(1478,16,'A',6,'A6','cheap',1),(1479,16,'A',7,'A7','cheap',0),(1480,16,'A',8,'A8','cheap',1),(1481,16,'A',9,'A9','cheap',1),(1482,16,'A',10,'A10','cheap',1),(1483,16,'A',11,'A11','cheap',1),(1484,16,'A',12,'A12','cheap',1),(1485,16,'A',13,'A13','cheap',1),(1486,16,'A',14,'A14','cheap',1),(1487,16,'A',15,'A15','cheap',1),(1488,16,'A',16,'A16','cheap',1),(1489,16,'A',17,'A17','cheap',1),(1490,16,'A',18,'A18','cheap',0),(1491,16,'A',19,'A19','cheap',1),(1492,16,'A',20,'A20','cheap',1),(1493,16,'A',21,'A21','cheap',1),(1494,16,'A',22,'A22','cheap',1),(1495,16,'A',23,'A23','cheap',1),(1496,16,'A',24,'A24','cheap',1),(1497,16,'B',1,'B1','cheap',1),(1498,16,'B',2,'B2','cheap',1),(1499,16,'B',3,'B3','cheap',1),(1500,16,'B',4,'B4','cheap',1),(1501,16,'B',5,'B5','cheap',1),(1502,16,'B',6,'B6','cheap',1),(1503,16,'B',7,'B7','cheap',0),(1504,16,'B',8,'B8','cheap',1),(1505,16,'B',9,'B9','cheap',1),(1506,16,'B',10,'B10','cheap',1),(1507,16,'B',11,'B11','cheap',1),(1508,16,'B',12,'B12','cheap',1),(1509,16,'B',13,'B13','cheap',1),(1510,16,'B',14,'B14','cheap',1),(1511,16,'B',15,'B15','cheap',1),(1512,16,'B',16,'B16','cheap',1),(1513,16,'B',17,'B17','cheap',1),(1514,16,'B',18,'B18','cheap',0),(1515,16,'B',19,'B19','cheap',1),(1516,16,'B',20,'B20','cheap',1),(1517,16,'B',21,'B21','cheap',1),(1518,16,'B',22,'B22','cheap',1),(1519,16,'B',23,'B23','cheap',1),(1520,16,'B',24,'B24','cheap',1),(1521,16,'C',1,'C1','cheap',1),(1522,16,'C',2,'C2','cheap',1),(1523,16,'C',3,'C3','cheap',1),(1524,16,'C',4,'C4','cheap',1),(1525,16,'C',5,'C5','cheap',1),(1526,16,'C',6,'C6','cheap',1),(1527,16,'C',7,'C7','cheap',0),(1528,16,'C',8,'C8','cheap',1),(1529,16,'C',9,'C9','cheap',1),(1530,16,'C',10,'C10','cheap',1),(1531,16,'C',11,'C11','cheap',1),(1532,16,'C',12,'C12','cheap',1),(1533,16,'C',13,'C13','cheap',1),(1534,16,'C',14,'C14','cheap',1),(1535,16,'C',15,'C15','cheap',1),(1536,16,'C',16,'C16','cheap',1),(1537,16,'C',17,'C17','cheap',1),(1538,16,'C',18,'C18','cheap',0),(1539,16,'C',19,'C19','cheap',1),(1540,16,'C',20,'C20','cheap',1),(1541,16,'C',21,'C21','cheap',1),(1542,16,'C',22,'C22','cheap',1),(1543,16,'C',23,'C23','cheap',1),(1544,16,'C',24,'C24','cheap',1),(1545,16,'D',1,'D1','cheap',1),(1546,16,'D',2,'D2','cheap',1),(1547,16,'D',3,'D3','cheap',1),(1548,16,'D',4,'D4','cheap',1),(1549,16,'D',5,'D5','cheap',1),(1550,16,'D',6,'D6','cheap',1),(1551,16,'D',7,'D7','cheap',0),(1552,16,'D',8,'D8','cheap',1),(1553,16,'D',9,'D9','cheap',1),(1554,16,'D',10,'D10','cheap',1),(1555,16,'D',11,'D11','cheap',1),(1556,16,'D',12,'D12','cheap',1),(1557,16,'D',13,'D13','cheap',1),(1558,16,'D',14,'D14','cheap',1),(1559,16,'D',15,'D15','cheap',1),(1560,16,'D',16,'D16','cheap',1),(1561,16,'D',17,'D17','cheap',1),(1562,16,'D',18,'D18','cheap',0),(1563,16,'D',19,'D19','cheap',1),(1564,16,'D',20,'D20','cheap',1),(1565,16,'D',21,'D21','cheap',1),(1566,16,'D',22,'D22','cheap',1),(1567,16,'D',23,'D23','cheap',1),(1568,16,'D',24,'D24','cheap',1),(1569,16,'E',1,'E1','cheap',1),(1570,16,'E',2,'E2','cheap',1),(1571,16,'E',3,'E3','cheap',1),(1572,16,'E',4,'E4','cheap',1),(1573,16,'E',5,'E5','cheap',1),(1574,16,'E',6,'E6','cheap',1),(1575,16,'E',7,'E7','cheap',0),(1576,16,'E',8,'E8','cheap',1),(1577,16,'E',9,'E9','cheap',1),(1578,16,'E',10,'E10','cheap',1),(1579,16,'E',11,'E11','cheap',1),(1580,16,'E',12,'E12','cheap',1),(1581,16,'E',13,'E13','cheap',1),(1582,16,'E',14,'E14','cheap',1),(1583,16,'E',15,'E15','cheap',1),(1584,16,'E',16,'E16','cheap',1),(1585,16,'E',17,'E17','cheap',1),(1586,16,'E',18,'E18','cheap',0),(1587,16,'E',19,'E19','cheap',1),(1588,16,'E',20,'E20','cheap',1),(1589,16,'E',21,'E21','cheap',1),(1590,16,'E',22,'E22','cheap',1),(1591,16,'E',23,'E23','cheap',1),(1592,16,'E',24,'E24','cheap',1),(1593,16,'F',1,'F1','cheap',1),(1594,16,'F',2,'F2','cheap',1),(1595,16,'F',3,'F3','cheap',1),(1596,16,'F',4,'F4','cheap',1),(1597,16,'F',5,'F5','cheap',1),(1598,16,'F',6,'F6','cheap',1),(1599,16,'F',7,'F7','cheap',0),(1600,16,'F',8,'F8','cheap',1),(1601,16,'F',9,'F9','cheap',1),(1602,16,'F',10,'F10','cheap',1),(1603,16,'F',11,'F11','cheap',1),(1604,16,'F',12,'F12','cheap',1),(1605,16,'F',13,'F13','cheap',1),(1606,16,'F',14,'F14','cheap',1),(1607,16,'F',15,'F15','cheap',1),(1608,16,'F',16,'F16','cheap',1),(1609,16,'F',17,'F17','cheap',1),(1610,16,'F',18,'F18','cheap',0),(1611,16,'F',19,'F19','cheap',1),(1612,16,'F',20,'F20','cheap',1),(1613,16,'F',21,'F21','cheap',1),(1614,16,'F',22,'F22','cheap',1),(1615,16,'F',23,'F23','cheap',1),(1616,16,'F',24,'F24','cheap',1),(1617,16,'G',1,'G1','cheap',1),(1618,16,'G',2,'G2','cheap',1),(1619,16,'G',3,'G3','cheap',1),(1620,16,'G',4,'G4','cheap',1),(1621,16,'G',5,'G5','cheap',1),(1622,16,'G',6,'G6','cheap',1),(1623,16,'G',7,'G7','cheap',0),(1624,16,'G',8,'G8','cheap',1),(1625,16,'G',9,'G9','cheap',1),(1626,16,'G',10,'G10','cheap',1),(1627,16,'G',11,'G11','cheap',1),(1628,16,'G',12,'G12','cheap',1),(1629,16,'G',13,'G13','cheap',1),(1630,16,'G',14,'G14','cheap',1),(1631,16,'G',15,'G15','cheap',1),(1632,16,'G',16,'G16','cheap',1),(1633,16,'G',17,'G17','cheap',1),(1634,16,'G',18,'G18','cheap',0),(1635,16,'G',19,'G19','cheap',1),(1636,16,'G',20,'G20','cheap',1),(1637,16,'G',21,'G21','cheap',1),(1638,16,'G',22,'G22','cheap',1),(1639,16,'G',23,'G23','cheap',1),(1640,16,'G',24,'G24','cheap',1),(1641,16,'H',1,'H1','cheap',1),(1642,16,'H',2,'H2','cheap',1),(1643,16,'H',3,'H3','cheap',1),(1644,16,'H',4,'H4','cheap',1),(1645,16,'H',5,'H5','cheap',1),(1646,16,'H',6,'H6','cheap',1),(1647,16,'H',7,'H7','cheap',0),(1648,16,'H',8,'H8','cheap',1),(1649,16,'H',9,'H9','cheap',1),(1650,16,'H',10,'H10','cheap',1),(1651,16,'H',11,'H11','cheap',1),(1652,16,'H',12,'H12','cheap',1),(1653,16,'H',13,'H13','cheap',1),(1654,16,'H',14,'H14','cheap',1),(1655,16,'H',15,'H15','cheap',1),(1656,16,'H',16,'H16','cheap',1),(1657,16,'H',17,'H17','cheap',1),(1658,16,'H',18,'H18','cheap',0),(1659,16,'H',19,'H19','cheap',1),(1660,16,'H',20,'H20','cheap',1),(1661,16,'H',21,'H21','cheap',1),(1662,16,'H',22,'H22','cheap',1),(1663,16,'H',23,'H23','cheap',1),(1664,16,'H',24,'H24','cheap',1),(1665,16,'I',1,'I1','middle',1),(1666,16,'I',2,'I2','middle',1),(1667,16,'I',3,'I3','middle',1),(1668,16,'I',4,'I4','middle',1),(1669,16,'I',5,'I5','middle',1),(1670,16,'I',6,'I6','middle',1),(1671,16,'I',7,'I7','middle',0),(1672,16,'I',8,'I8','middle',1),(1673,16,'I',9,'I9','middle',1),(1674,16,'I',10,'I10','middle',1),(1675,16,'I',11,'I11','middle',1),(1676,16,'I',12,'I12','middle',1),(1677,16,'I',13,'I13','middle',1),(1678,16,'I',14,'I14','middle',1),(1679,16,'I',15,'I15','middle',1),(1680,16,'I',16,'I16','middle',1),(1681,16,'I',17,'I17','middle',1),(1682,16,'I',18,'I18','middle',0),(1683,16,'I',19,'I19','middle',1),(1684,16,'I',20,'I20','middle',1),(1685,16,'I',21,'I21','middle',1),(1686,16,'I',22,'I22','middle',1),(1687,16,'I',23,'I23','middle',1),(1688,16,'I',24,'I24','middle',1),(1689,16,'J',1,'J1','middle',1),(1690,16,'J',2,'J2','middle',1),(1691,16,'J',3,'J3','middle',1),(1692,16,'J',4,'J4','middle',1),(1693,16,'J',5,'J5','middle',1),(1694,16,'J',6,'J6','middle',1),(1695,16,'J',7,'J7','middle',0),(1696,16,'J',8,'J8','middle',1),(1697,16,'J',9,'J9','middle',1),(1698,16,'J',10,'J10','middle',1),(1699,16,'J',11,'J11','middle',1),(1700,16,'J',12,'J12','middle',1),(1701,16,'J',13,'J13','middle',1),(1702,16,'J',14,'J14','middle',1),(1703,16,'J',15,'J15','middle',1),(1704,16,'J',16,'J16','middle',1),(1705,16,'J',17,'J17','middle',1),(1706,16,'J',18,'J18','middle',0),(1707,16,'J',19,'J19','middle',1),(1708,16,'J',20,'J20','middle',1),(1709,16,'J',21,'J21','middle',1),(1710,16,'J',22,'J22','middle',1),(1711,16,'J',23,'J23','middle',1),(1712,16,'J',24,'J24','middle',1),(1713,16,'K',1,'K1','middle',1),(1714,16,'K',2,'K2','middle',1),(1715,16,'K',3,'K3','middle',1),(1716,16,'K',4,'K4','middle',1),(1717,16,'K',5,'K5','middle',1),(1718,16,'K',6,'K6','middle',1),(1719,16,'K',7,'K7','middle',0),(1720,16,'K',8,'K8','middle',1),(1721,16,'K',9,'K9','middle',1),(1722,16,'K',10,'K10','middle',1),(1723,16,'K',11,'K11','middle',1),(1724,16,'K',12,'K12','middle',1),(1725,16,'K',13,'K13','middle',1),(1726,16,'K',14,'K14','middle',1),(1727,16,'K',15,'K15','middle',1),(1728,16,'K',16,'K16','middle',1),(1729,16,'K',17,'K17','middle',1),(1730,16,'K',18,'K18','middle',0),(1731,16,'K',19,'K19','middle',1),(1732,16,'K',20,'K20','middle',1),(1733,16,'K',21,'K21','middle',1),(1734,16,'K',22,'K22','middle',1),(1735,16,'K',23,'K23','middle',1),(1736,16,'K',24,'K24','middle',1),(1737,16,'L',1,'L1','middle',1),(1738,16,'L',2,'L2','middle',1),(1739,16,'L',3,'L3','middle',1),(1740,16,'L',4,'L4','middle',1),(1741,16,'L',5,'L5','middle',1),(1742,16,'L',6,'L6','middle',1),(1743,16,'L',7,'L7','middle',0),(1744,16,'L',8,'L8','middle',1),(1745,16,'L',9,'L9','middle',1),(1746,16,'L',10,'L10','middle',1),(1747,16,'L',11,'L11','middle',1),(1748,16,'L',12,'L12','middle',1),(1749,16,'L',13,'L13','middle',1),(1750,16,'L',14,'L14','middle',1),(1751,16,'L',15,'L15','middle',1),(1752,16,'L',16,'L16','middle',1),(1753,16,'L',17,'L17','middle',1),(1754,16,'L',18,'L18','middle',0),(1755,16,'L',19,'L19','middle',1),(1756,16,'L',20,'L20','middle',1),(1757,16,'L',21,'L21','middle',1),(1758,16,'L',22,'L22','middle',1),(1759,16,'L',23,'L23','middle',1),(1760,16,'L',24,'L24','middle',1),(1761,16,'M',1,'M1','middle',1),(1762,16,'M',2,'M2','middle',1),(1763,16,'M',3,'M3','middle',1),(1764,16,'M',4,'M4','middle',1),(1765,16,'M',5,'M5','middle',1),(1766,16,'M',6,'M6','middle',1),(1767,16,'M',7,'M7','middle',0),(1768,16,'M',8,'M8','expensive',1),(1769,16,'M',9,'M9','expensive',1),(1770,16,'M',10,'M10','expensive',1),(1771,16,'M',11,'M11','expensive',1),(1772,16,'M',12,'M12','expensive',1),(1773,16,'M',13,'M13','expensive',1),(1774,16,'M',14,'M14','expensive',1),(1775,16,'M',15,'M15','expensive',1),(1776,16,'M',16,'M16','expensive',1),(1777,16,'M',17,'M17','expensive',1),(1778,16,'M',18,'M18','middle',0),(1779,16,'M',19,'M19','middle',1),(1780,16,'M',20,'M20','middle',1),(1781,16,'M',21,'M21','middle',1),(1782,16,'M',22,'M22','middle',1),(1783,16,'M',23,'M23','middle',1),(1784,16,'M',24,'M24','middle',1),(1785,16,'N',1,'N1','middle',1),(1786,16,'N',2,'N2','middle',1),(1787,16,'N',3,'N3','middle',1),(1788,16,'N',4,'N4','middle',1),(1789,16,'N',5,'N5','middle',1),(1790,16,'N',6,'N6','middle',1),(1791,16,'N',7,'N7','middle',0),(1792,16,'N',8,'N8','expensive',1),(1793,16,'N',9,'N9','expensive',1),(1794,16,'N',10,'N10','expensive',1),(1795,16,'N',11,'N11','expensive',1),(1796,16,'N',12,'N12','expensive',1),(1797,16,'N',13,'N13','expensive',1),(1798,16,'N',14,'N14','expensive',1),(1799,16,'N',15,'N15','expensive',1),(1800,16,'N',16,'N16','expensive',1),(1801,16,'N',17,'N17','expensive',1),(1802,16,'N',18,'N18','middle',0),(1803,16,'N',19,'N19','middle',1),(1804,16,'N',20,'N20','middle',1),(1805,16,'N',21,'N21','middle',1),(1806,16,'N',22,'N22','middle',1),(1807,16,'N',23,'N23','middle',1),(1808,16,'N',24,'N24','middle',1),(1809,16,'O',1,'O1','middle',1),(1810,16,'O',2,'O2','middle',1),(1811,16,'O',3,'O3','middle',1),(1812,16,'O',4,'O4','middle',1),(1813,16,'O',5,'O5','middle',1),(1814,16,'O',6,'O6','middle',1),(1815,16,'O',7,'O7','middle',0),(1816,16,'O',8,'O8','expensive',1),(1817,16,'O',9,'O9','expensive',1),(1818,16,'O',10,'O10','expensive',1),(1819,16,'O',11,'O11','expensive',1),(1820,16,'O',12,'O12','expensive',1),(1821,16,'O',13,'O13','expensive',1),(1822,16,'O',14,'O14','expensive',1),(1823,16,'O',15,'O15','expensive',1),(1824,16,'O',16,'O16','expensive',1),(1825,16,'O',17,'O17','expensive',1),(1826,16,'O',18,'O18','middle',0),(1827,16,'O',19,'O19','middle',1),(1828,16,'O',20,'O20','middle',1),(1829,16,'O',21,'O21','middle',1),(1830,16,'O',22,'O22','middle',1),(1831,16,'O',23,'O23','middle',1),(1832,16,'O',24,'O24','middle',1),(1833,26,'A',1,'A1','cheap',1),(1834,26,'A',2,'A2','cheap',1),(1835,26,'A',3,'A3','cheap',1),(1836,26,'A',4,'A4','cheap',1),(1837,26,'A',5,'A5','cheap',0),(1838,26,'A',6,'A6','cheap',1),(1839,26,'A',7,'A7','cheap',1),(1840,26,'A',8,'A8','cheap',1),(1841,26,'A',9,'A9','cheap',1),(1842,26,'A',10,'A10','cheap',1),(1843,26,'A',11,'A11','cheap',1),(1844,26,'A',12,'A12','cheap',1),(1845,26,'A',13,'A13','cheap',1),(1846,26,'A',14,'A14','cheap',0),(1847,26,'A',15,'A15','cheap',1),(1848,26,'A',16,'A16','cheap',1),(1849,26,'A',17,'A17','cheap',1),(1850,26,'A',18,'A18','cheap',1),(1851,26,'B',1,'B1','cheap',1),(1852,26,'B',2,'B2','cheap',1),(1853,26,'B',3,'B3','cheap',1),(1854,26,'B',4,'B4','cheap',1),(1855,26,'B',5,'B5','cheap',0),(1856,26,'B',6,'B6','cheap',1),(1857,26,'B',7,'B7','cheap',1),(1858,26,'B',8,'B8','cheap',1),(1859,26,'B',9,'B9','cheap',1),(1860,26,'B',10,'B10','cheap',1),(1861,26,'B',11,'B11','cheap',1),(1862,26,'B',12,'B12','cheap',1),(1863,26,'B',13,'B13','cheap',1),(1864,26,'B',14,'B14','cheap',0),(1865,26,'B',15,'B15','cheap',1),(1866,26,'B',16,'B16','cheap',1),(1867,26,'B',17,'B17','cheap',1),(1868,26,'B',18,'B18','cheap',1),(1869,26,'C',1,'C1','cheap',1),(1870,26,'C',2,'C2','cheap',1),(1871,26,'C',3,'C3','cheap',1),(1872,26,'C',4,'C4','cheap',1),(1873,26,'C',5,'C5','cheap',0),(1874,26,'C',6,'C6','cheap',1),(1875,26,'C',7,'C7','cheap',1),(1876,26,'C',8,'C8','cheap',1),(1877,26,'C',9,'C9','cheap',1),(1878,26,'C',10,'C10','cheap',1),(1879,26,'C',11,'C11','cheap',1),(1880,26,'C',12,'C12','cheap',1),(1881,26,'C',13,'C13','cheap',1),(1882,26,'C',14,'C14','cheap',0),(1883,26,'C',15,'C15','cheap',1),(1884,26,'C',16,'C16','cheap',1),(1885,26,'C',17,'C17','cheap',1),(1886,26,'C',18,'C18','cheap',1),(1887,26,'D',1,'D1','cheap',1),(1888,26,'D',2,'D2','cheap',1),(1889,26,'D',3,'D3','cheap',1),(1890,26,'D',4,'D4','cheap',1),(1891,26,'D',5,'D5','cheap',0),(1892,26,'D',6,'D6','cheap',1),(1893,26,'D',7,'D7','cheap',1),(1894,26,'D',8,'D8','cheap',1),(1895,26,'D',9,'D9','cheap',1),(1896,26,'D',10,'D10','cheap',1),(1897,26,'D',11,'D11','cheap',1),(1898,26,'D',12,'D12','cheap',1),(1899,26,'D',13,'D13','cheap',1),(1900,26,'D',14,'D14','cheap',0),(1901,26,'D',15,'D15','cheap',1),(1902,26,'D',16,'D16','cheap',1),(1903,26,'D',17,'D17','cheap',1),(1904,26,'D',18,'D18','cheap',1),(1905,26,'E',1,'E1','cheap',1),(1906,26,'E',2,'E2','cheap',1),(1907,26,'E',3,'E3','cheap',1),(1908,26,'E',4,'E4','cheap',1),(1909,26,'E',5,'E5','cheap',0),(1910,26,'E',6,'E6','cheap',1),(1911,26,'E',7,'E7','cheap',1),(1912,26,'E',8,'E8','cheap',1),(1913,26,'E',9,'E9','cheap',1),(1914,26,'E',10,'E10','cheap',1),(1915,26,'E',11,'E11','cheap',1),(1916,26,'E',12,'E12','cheap',1),(1917,26,'E',13,'E13','cheap',1),(1918,26,'E',14,'E14','cheap',0),(1919,26,'E',15,'E15','cheap',1),(1920,26,'E',16,'E16','cheap',1),(1921,26,'E',17,'E17','cheap',1),(1922,26,'E',18,'E18','cheap',1),(1923,26,'F',1,'F1','cheap',1),(1924,26,'F',2,'F2','cheap',1),(1925,26,'F',3,'F3','cheap',1),(1926,26,'F',4,'F4','cheap',1),(1927,26,'F',5,'F5','cheap',0),(1928,26,'F',6,'F6','cheap',1),(1929,26,'F',7,'F7','cheap',1),(1930,26,'F',8,'F8','cheap',1),(1931,26,'F',9,'F9','cheap',1),(1932,26,'F',10,'F10','cheap',1),(1933,26,'F',11,'F11','cheap',1),(1934,26,'F',12,'F12','cheap',1),(1935,26,'F',13,'F13','cheap',1),(1936,26,'F',14,'F14','cheap',0),(1937,26,'F',15,'F15','cheap',1),(1938,26,'F',16,'F16','cheap',1),(1939,26,'F',17,'F17','cheap',1),(1940,26,'F',18,'F18','cheap',1),(1941,26,'G',1,'G1','middle',1),(1942,26,'G',2,'G2','middle',1),(1943,26,'G',3,'G3','middle',1),(1944,26,'G',4,'G4','middle',1),(1945,26,'G',5,'G5','middle',0),(1946,26,'G',6,'G6','middle',1),(1947,26,'G',7,'G7','middle',1),(1948,26,'G',8,'G8','middle',1),(1949,26,'G',9,'G9','middle',1),(1950,26,'G',10,'G10','middle',1),(1951,26,'G',11,'G11','middle',1),(1952,26,'G',12,'G12','middle',1),(1953,26,'G',13,'G13','middle',1),(1954,26,'G',14,'G14','middle',0),(1955,26,'G',15,'G15','middle',1),(1956,26,'G',16,'G16','middle',1),(1957,26,'G',17,'G17','middle',1),(1958,26,'G',18,'G18','middle',1),(1959,26,'H',1,'H1','middle',1),(1960,26,'H',2,'H2','middle',1),(1961,26,'H',3,'H3','middle',1),(1962,26,'H',4,'H4','middle',1),(1963,26,'H',5,'H5','middle',0),(1964,26,'H',6,'H6','middle',1),(1965,26,'H',7,'H7','middle',1),(1966,26,'H',8,'H8','middle',1),(1967,26,'H',9,'H9','middle',1),(1968,26,'H',10,'H10','middle',1),(1969,26,'H',11,'H11','middle',1),(1970,26,'H',12,'H12','middle',1),(1971,26,'H',13,'H13','middle',1),(1972,26,'H',14,'H14','middle',0),(1973,26,'H',15,'H15','middle',1),(1974,26,'H',16,'H16','middle',1),(1975,26,'H',17,'H17','middle',1),(1976,26,'H',18,'H18','middle',1),(1977,26,'I',1,'I1','middle',1),(1978,26,'I',2,'I2','middle',1),(1979,26,'I',3,'I3','middle',1),(1980,26,'I',4,'I4','middle',1),(1981,26,'I',5,'I5','middle',0),(1982,26,'I',6,'I6','middle',1),(1983,26,'I',7,'I7','middle',1),(1984,26,'I',8,'I8','middle',1),(1985,26,'I',9,'I9','middle',1),(1986,26,'I',10,'I10','middle',1),(1987,26,'I',11,'I11','middle',1),(1988,26,'I',12,'I12','middle',1),(1989,26,'I',13,'I13','middle',1),(1990,26,'I',14,'I14','middle',0),(1991,26,'I',15,'I15','middle',1),(1992,26,'I',16,'I16','middle',1),(1993,26,'I',17,'I17','middle',1),(1994,26,'I',18,'I18','middle',1),(1995,26,'J',1,'J1','middle',1),(1996,26,'J',2,'J2','middle',1),(1997,26,'J',3,'J3','middle',1),(1998,26,'J',4,'J4','middle',1),(1999,26,'J',5,'J5','middle',0),(2000,26,'J',6,'J6','expensive',1),(2001,26,'J',7,'J7','expensive',1),(2002,26,'J',8,'J8','expensive',1),(2003,26,'J',9,'J9','expensive',1),(2004,26,'J',10,'J10','expensive',1),(2005,26,'J',11,'J11','expensive',1),(2006,26,'J',12,'J12','expensive',1),(2007,26,'J',13,'J13','expensive',1),(2008,26,'J',14,'J14','middle',0),(2009,26,'J',15,'J15','middle',1),(2010,26,'J',16,'J16','middle',1),(2011,26,'J',17,'J17','middle',1),(2012,26,'J',18,'J18','middle',1),(2013,26,'K',1,'K1','middle',1),(2014,26,'K',2,'K2','middle',1),(2015,26,'K',3,'K3','middle',1),(2016,26,'K',4,'K4','middle',1),(2017,26,'K',5,'K5','middle',0),(2018,26,'K',6,'K6','expensive',1),(2019,26,'K',7,'K7','expensive',1),(2020,26,'K',8,'K8','expensive',1),(2021,26,'K',9,'K9','expensive',1),(2022,26,'K',10,'K10','expensive',1),(2023,26,'K',11,'K11','expensive',1),(2024,26,'K',12,'K12','expensive',1),(2025,26,'K',13,'K13','expensive',1),(2026,26,'K',14,'K14','middle',0),(2027,26,'K',15,'K15','middle',1),(2028,26,'K',16,'K16','middle',1),(2029,26,'K',17,'K17','middle',1),(2030,26,'K',18,'K18','middle',1),(2031,26,'L',1,'L1','middle',1),(2032,26,'L',2,'L2','middle',1),(2033,26,'L',3,'L3','middle',1),(2034,26,'L',4,'L4','middle',1),(2035,26,'L',5,'L5','middle',0),(2036,26,'L',6,'L6','expensive',1),(2037,26,'L',7,'L7','expensive',1),(2038,26,'L',8,'L8','expensive',1),(2039,26,'L',9,'L9','expensive',1),(2040,26,'L',10,'L10','expensive',1),(2041,26,'L',11,'L11','expensive',1),(2042,26,'L',12,'L12','expensive',1),(2043,26,'L',13,'L13','expensive',1),(2044,26,'L',14,'L14','middle',0),(2045,26,'L',15,'L15','middle',1),(2046,26,'L',16,'L16','middle',1),(2047,26,'L',17,'L17','middle',1),(2048,26,'L',18,'L18','middle',1),(5053,2,'A',1,'A1','cheap',1),(5054,2,'A',2,'A2','cheap',1),(5055,2,'A',3,'A3','cheap',1),(5056,2,'A',4,'A4','cheap',1),(5057,2,'A',5,'A5','cheap',1),(5058,2,'A',6,'A6','cheap',1),(5059,2,'A',7,'A7','cheap',1),(5060,2,'A',8,'A8','cheap',1),(5061,2,'B',1,'B1','cheap',1),(5062,2,'B',2,'B2','cheap',1),(5063,2,'B',3,'B3','cheap',1),(5064,2,'B',4,'B4','cheap',1),(5065,2,'B',5,'B5','cheap',1),(5066,2,'B',6,'B6','cheap',1),(5067,2,'B',7,'B7','cheap',1),(5068,2,'B',8,'B8','cheap',1),(5069,2,'C',1,'C1','cheap',1),(5070,2,'C',2,'C2','cheap',1),(5071,2,'C',3,'C3','cheap',1),(5072,2,'C',4,'C4','cheap',1),(5073,2,'C',5,'C5','cheap',1),(5074,2,'C',6,'C6','cheap',1),(5075,2,'C',7,'C7','cheap',1),(5076,2,'C',8,'C8','cheap',1),(5077,2,'D',1,'D1','cheap',1),(5078,2,'D',2,'D2','cheap',1),(5079,2,'D',3,'D3','cheap',1),(5080,2,'D',4,'D4','cheap',1),(5081,2,'D',5,'D5','cheap',1),(5082,2,'D',6,'D6','cheap',1),(5083,2,'D',7,'D7','cheap',1),(5084,2,'D',8,'D8','cheap',1),(5085,2,'E',1,'E1','cheap',1),(5086,2,'E',2,'E2','cheap',1),(5087,2,'E',3,'E3','cheap',1),(5088,2,'E',4,'E4','cheap',1),(5089,2,'E',5,'E5','cheap',1),(5090,2,'E',6,'E6','cheap',1),(5091,2,'E',7,'E7','cheap',1),(5092,2,'E',8,'E8','cheap',1),(5093,2,'F',1,'F1','middle',1),(5094,2,'F',2,'F2','middle',1),(5095,2,'F',3,'F3','middle',1),(5096,2,'F',4,'F4','middle',1),(5097,2,'F',5,'F5','middle',1),(5098,2,'F',6,'F6','middle',1),(5099,2,'F',7,'F7','middle',1),(5100,2,'F',8,'F8','middle',1),(5101,2,'G',1,'G1','middle',1),(5102,2,'G',2,'G2','middle',1),(5103,2,'G',3,'G3','middle',1),(5104,2,'G',4,'G4','middle',1),(5105,2,'G',5,'G5','middle',1),(5106,2,'G',6,'G6','middle',1),(5107,2,'G',7,'G7','middle',1),(5108,2,'G',8,'G8','middle',1),(5109,2,'H',1,'H1','middle',1),(5110,2,'H',2,'H2','middle',1),(5111,2,'H',3,'H3','middle',1),(5112,2,'H',4,'H4','middle',1),(5113,2,'H',5,'H5','middle',1),(5114,2,'H',6,'H6','middle',1),(5115,2,'H',7,'H7','middle',1),(5116,2,'H',8,'H8','middle',1),(8957,18,'A',1,'A1','cheap',1),(8958,18,'A',2,'A2','cheap',1),(8959,18,'A',3,'A3','cheap',1),(8960,18,'A',4,'A4','cheap',1),(8961,18,'A',5,'A5','cheap',1),(8962,18,'A',6,'A6','cheap',1),(8963,18,'A',7,'A7','cheap',1),(8964,18,'A',8,'A8','cheap',1),(8965,18,'A',9,'A9','cheap',0),(8966,18,'A',10,'A10','cheap',1),(8967,18,'A',11,'A11','cheap',1),(8968,18,'A',12,'A12','cheap',1),(8969,18,'A',13,'A13','cheap',1),(8970,18,'A',14,'A14','cheap',1),(8971,18,'A',15,'A15','cheap',1),(8972,18,'A',16,'A16','cheap',1),(8973,18,'A',17,'A17','cheap',1),(8974,18,'A',18,'A18','cheap',1),(8975,18,'B',1,'B1','cheap',1),(8976,18,'B',2,'B2','cheap',1),(8977,18,'B',3,'B3','cheap',1),(8978,18,'B',4,'B4','cheap',1),(8979,18,'B',5,'B5','cheap',1),(8980,18,'B',6,'B6','cheap',1),(8981,18,'B',7,'B7','cheap',1),(8982,18,'B',8,'B8','cheap',1),(8983,18,'B',9,'B9','cheap',0),(8984,18,'B',10,'B10','cheap',1),(8985,18,'B',11,'B11','cheap',1),(8986,18,'B',12,'B12','cheap',1),(8987,18,'B',13,'B13','cheap',1),(8988,18,'B',14,'B14','cheap',1),(8989,18,'B',15,'B15','cheap',1),(8990,18,'B',16,'B16','cheap',1),(8991,18,'B',17,'B17','cheap',1),(8992,18,'B',18,'B18','cheap',1),(8993,18,'C',1,'C1','cheap',1),(8994,18,'C',2,'C2','cheap',1),(8995,18,'C',3,'C3','cheap',1),(8996,18,'C',4,'C4','cheap',1),(8997,18,'C',5,'C5','cheap',1),(8998,18,'C',6,'C6','cheap',1),(8999,18,'C',7,'C7','cheap',1),(9000,18,'C',8,'C8','cheap',1),(9001,18,'C',9,'C9','cheap',0),(9002,18,'C',10,'C10','cheap',1),(9003,18,'C',11,'C11','cheap',1),(9004,18,'C',12,'C12','cheap',1),(9005,18,'C',13,'C13','cheap',1),(9006,18,'C',14,'C14','cheap',1),(9007,18,'C',15,'C15','cheap',1),(9008,18,'C',16,'C16','cheap',1),(9009,18,'C',17,'C17','cheap',1),(9010,18,'C',18,'C18','cheap',1),(9011,18,'D',1,'D1','cheap',1),(9012,18,'D',2,'D2','cheap',1),(9013,18,'D',3,'D3','cheap',1),(9014,18,'D',4,'D4','cheap',1),(9015,18,'D',5,'D5','cheap',1),(9016,18,'D',6,'D6','cheap',1),(9017,18,'D',7,'D7','cheap',1),(9018,18,'D',8,'D8','cheap',1),(9019,18,'D',9,'D9','cheap',0),(9020,18,'D',10,'D10','cheap',1),(9021,18,'D',11,'D11','cheap',1),(9022,18,'D',12,'D12','cheap',1),(9023,18,'D',13,'D13','cheap',1),(9024,18,'D',14,'D14','cheap',1),(9025,18,'D',15,'D15','cheap',1),(9026,18,'D',16,'D16','cheap',1),(9027,18,'D',17,'D17','cheap',1),(9028,18,'D',18,'D18','cheap',1),(9029,18,'E',1,'E1','middle',1),(9030,18,'E',2,'E2','middle',1),(9031,18,'E',3,'E3','middle',1),(9032,18,'E',4,'E4','middle',1),(9033,18,'E',5,'E5','middle',1),(9034,18,'E',6,'E6','middle',1),(9035,18,'E',7,'E7','middle',1),(9036,18,'E',8,'E8','middle',1),(9037,18,'E',9,'E9','middle',0),(9038,18,'E',10,'E10','middle',1),(9039,18,'E',11,'E11','middle',1),(9040,18,'E',12,'E12','middle',1),(9041,18,'E',13,'E13','middle',1),(9042,18,'E',14,'E14','middle',1),(9043,18,'E',15,'E15','middle',1),(9044,18,'E',16,'E16','middle',1),(9045,18,'E',17,'E17','middle',1),(9046,18,'E',18,'E18','middle',1),(9047,18,'F',1,'F1','middle',1),(9048,18,'F',2,'F2','middle',1),(9049,18,'F',3,'F3','middle',1),(9050,18,'F',4,'F4','middle',1),(9051,18,'F',5,'F5','middle',1),(9052,18,'F',6,'F6','middle',1),(9053,18,'F',7,'F7','middle',1),(9054,18,'F',8,'F8','middle',1),(9055,18,'F',9,'F9','middle',0),(9056,18,'F',10,'F10','middle',1),(9057,18,'F',11,'F11','middle',1),(9058,18,'F',12,'F12','middle',1),(9059,18,'F',13,'F13','middle',1),(9060,18,'F',14,'F14','middle',1),(9061,18,'F',15,'F15','middle',1),(9062,18,'F',16,'F16','middle',1),(9063,18,'F',17,'F17','middle',1),(9064,18,'F',18,'F18','middle',1),(9065,18,'G',1,'G1','middle',1),(9066,18,'G',2,'G2','middle',1),(9067,18,'G',3,'G3','middle',1),(9068,18,'G',4,'G4','middle',1),(9069,18,'G',5,'G5','middle',1),(9070,18,'G',6,'G6','middle',1),(9071,18,'G',7,'G7','middle',1),(9072,18,'G',8,'G8','middle',1),(9073,18,'G',9,'G9','middle',0),(9074,18,'G',10,'G10','middle',1),(9075,18,'G',11,'G11','middle',1),(9076,18,'G',12,'G12','middle',1),(9077,18,'G',13,'G13','middle',1),(9078,18,'G',14,'G14','middle',1),(9079,18,'G',15,'G15','middle',1),(9080,18,'G',16,'G16','middle',1),(9081,18,'G',17,'G17','middle',1),(9082,18,'G',18,'G18','middle',1),(9083,18,'H',1,'H1','middle',1),(9084,18,'H',2,'H2','middle',1),(9085,18,'H',3,'H3','middle',1),(9086,18,'H',4,'H4','middle',1),(9087,18,'H',5,'H5','middle',1),(9088,18,'H',6,'H6','middle',1),(9089,18,'H',7,'H7','middle',1),(9090,18,'H',8,'H8','middle',1),(9091,18,'H',9,'H9','middle',0),(9092,18,'H',10,'H10','middle',1),(9093,18,'H',11,'H11','middle',1),(9094,18,'H',12,'H12','middle',1),(9095,18,'H',13,'H13','middle',1),(9096,18,'H',14,'H14','middle',1),(9097,18,'H',15,'H15','middle',1),(9098,18,'H',16,'H16','middle',1),(9099,18,'H',17,'H17','middle',1),(9100,18,'H',18,'H18','middle',1),(9101,18,'I',1,'I1','middle',1),(9102,18,'I',2,'I2','middle',1),(9103,18,'I',3,'I3','middle',1),(9104,18,'I',4,'I4','middle',1),(9105,18,'I',5,'I5','middle',1),(9106,18,'I',6,'I6','expensive',1),(9107,18,'I',7,'I7','expensive',1),(9108,18,'I',8,'I8','expensive',1),(9109,18,'I',9,'I9','expensive',0),(9110,18,'I',10,'I10','expensive',1),(9111,18,'I',11,'I11','expensive',1),(9112,18,'I',12,'I12','expensive',1),(9113,18,'I',13,'I13','expensive',1),(9114,18,'I',14,'I14','middle',1),(9115,18,'I',15,'I15','middle',1),(9116,18,'I',16,'I16','middle',1),(9117,18,'I',17,'I17','middle',1),(9118,18,'I',18,'I18','middle',1),(9119,18,'J',1,'J1','middle',1),(9120,18,'J',2,'J2','middle',1),(9121,18,'J',3,'J3','middle',1),(9122,18,'J',4,'J4','middle',1),(9123,18,'J',5,'J5','middle',1),(9124,18,'J',6,'J6','expensive',1),(9125,18,'J',7,'J7','expensive',1),(9126,18,'J',8,'J8','expensive',1),(9127,18,'J',9,'J9','expensive',0),(9128,18,'J',10,'J10','expensive',1),(9129,18,'J',11,'J11','expensive',1),(9130,18,'J',12,'J12','expensive',1),(9131,18,'J',13,'J13','expensive',1),(9132,18,'J',14,'J14','middle',1),(9133,18,'J',15,'J15','middle',1),(9134,18,'J',16,'J16','middle',1),(9135,18,'J',17,'J17','middle',1),(9136,18,'J',18,'J18','middle',1),(9137,18,'K',1,'K1','middle',1),(9138,18,'K',2,'K2','middle',1),(9139,18,'K',3,'K3','middle',1),(9140,18,'K',4,'K4','middle',1),(9141,18,'K',5,'K5','middle',1),(9142,18,'K',6,'K6','expensive',1),(9143,18,'K',7,'K7','expensive',1),(9144,18,'K',8,'K8','expensive',1),(9145,18,'K',9,'K9','expensive',0),(9146,18,'K',10,'K10','expensive',1),(9147,18,'K',11,'K11','expensive',1),(9148,18,'K',12,'K12','expensive',1),(9149,18,'K',13,'K13','expensive',1),(9150,18,'K',14,'K14','middle',1),(9151,18,'K',15,'K15','middle',1),(9152,18,'K',16,'K16','middle',1),(9153,18,'K',17,'K17','middle',1),(9154,18,'K',18,'K18','middle',1),(9155,18,'L',1,'L1','middle',1),(9156,18,'L',2,'L2','middle',1),(9157,18,'L',3,'L3','middle',1),(9158,18,'L',4,'L4','middle',1),(9159,18,'L',5,'L5','middle',1),(9160,18,'L',6,'L6','expensive',1),(9161,18,'L',7,'L7','expensive',1),(9162,18,'L',8,'L8','expensive',1),(9163,18,'L',9,'L9','expensive',0),(9164,18,'L',10,'L10','expensive',1),(9165,18,'L',11,'L11','expensive',1),(9166,18,'L',12,'L12','expensive',1),(9167,18,'L',13,'L13','expensive',1),(9168,18,'L',14,'L14','middle',1),(9169,18,'L',15,'L15','middle',1),(9170,18,'L',16,'L16','middle',1),(9171,18,'L',17,'L17','middle',1),(9172,18,'L',18,'L18','middle',1),(9173,17,'A',1,'A1','cheap',1),(9174,17,'A',2,'A2','cheap',1),(9175,17,'A',3,'A3','cheap',1),(9176,17,'A',4,'A4','cheap',1),(9177,17,'A',5,'A5','cheap',0),(9178,17,'A',6,'A6','cheap',1),(9179,17,'A',7,'A7','cheap',1),(9180,17,'A',8,'A8','cheap',1),(9181,17,'A',9,'A9','cheap',1),(9182,17,'A',10,'A10','cheap',1),(9183,17,'A',11,'A11','cheap',1),(9184,17,'A',12,'A12','cheap',1),(9185,17,'A',13,'A13','cheap',1),(9186,17,'A',14,'A14','cheap',0),(9187,17,'A',15,'A15','cheap',1),(9188,17,'A',16,'A16','cheap',1),(9189,17,'A',17,'A17','cheap',1),(9190,17,'A',18,'A18','cheap',1),(9191,17,'B',1,'B1','cheap',1),(9192,17,'B',2,'B2','cheap',1),(9193,17,'B',3,'B3','cheap',1),(9194,17,'B',4,'B4','cheap',1),(9195,17,'B',5,'B5','cheap',0),(9196,17,'B',6,'B6','cheap',1),(9197,17,'B',7,'B7','cheap',1),(9198,17,'B',8,'B8','cheap',1),(9199,17,'B',9,'B9','cheap',1),(9200,17,'B',10,'B10','cheap',1),(9201,17,'B',11,'B11','cheap',1),(9202,17,'B',12,'B12','cheap',1),(9203,17,'B',13,'B13','cheap',1),(9204,17,'B',14,'B14','cheap',0),(9205,17,'B',15,'B15','cheap',1),(9206,17,'B',16,'B16','cheap',1),(9207,17,'B',17,'B17','cheap',1),(9208,17,'B',18,'B18','cheap',1),(9209,17,'C',1,'C1','cheap',1),(9210,17,'C',2,'C2','cheap',1),(9211,17,'C',3,'C3','cheap',1),(9212,17,'C',4,'C4','cheap',1),(9213,17,'C',5,'C5','cheap',0),(9214,17,'C',6,'C6','cheap',1),(9215,17,'C',7,'C7','cheap',1),(9216,17,'C',8,'C8','cheap',1),(9217,17,'C',9,'C9','cheap',1),(9218,17,'C',10,'C10','cheap',1),(9219,17,'C',11,'C11','cheap',1),(9220,17,'C',12,'C12','cheap',1),(9221,17,'C',13,'C13','cheap',1),(9222,17,'C',14,'C14','cheap',0),(9223,17,'C',15,'C15','cheap',1),(9224,17,'C',16,'C16','cheap',1),(9225,17,'C',17,'C17','cheap',1),(9226,17,'C',18,'C18','cheap',1),(9227,17,'D',1,'D1','cheap',1),(9228,17,'D',2,'D2','cheap',1),(9229,17,'D',3,'D3','cheap',1),(9230,17,'D',4,'D4','cheap',1),(9231,17,'D',5,'D5','cheap',0),(9232,17,'D',6,'D6','cheap',1),(9233,17,'D',7,'D7','cheap',1),(9234,17,'D',8,'D8','cheap',1),(9235,17,'D',9,'D9','cheap',1),(9236,17,'D',10,'D10','cheap',1),(9237,17,'D',11,'D11','cheap',1),(9238,17,'D',12,'D12','cheap',1),(9239,17,'D',13,'D13','cheap',1),(9240,17,'D',14,'D14','cheap',0),(9241,17,'D',15,'D15','cheap',1),(9242,17,'D',16,'D16','cheap',1),(9243,17,'D',17,'D17','cheap',1),(9244,17,'D',18,'D18','cheap',1),(9245,17,'E',1,'E1','cheap',1),(9246,17,'E',2,'E2','cheap',1),(9247,17,'E',3,'E3','cheap',1),(9248,17,'E',4,'E4','cheap',1),(9249,17,'E',5,'E5','cheap',0),(9250,17,'E',6,'E6','cheap',1),(9251,17,'E',7,'E7','cheap',1),(9252,17,'E',8,'E8','cheap',1),(9253,17,'E',9,'E9','cheap',1),(9254,17,'E',10,'E10','cheap',1),(9255,17,'E',11,'E11','cheap',1),(9256,17,'E',12,'E12','cheap',1),(9257,17,'E',13,'E13','cheap',1),(9258,17,'E',14,'E14','cheap',0),(9259,17,'E',15,'E15','cheap',1),(9260,17,'E',16,'E16','cheap',1),(9261,17,'E',17,'E17','cheap',1),(9262,17,'E',18,'E18','cheap',1),(9263,17,'F',1,'F1','middle',1),(9264,17,'F',2,'F2','middle',1),(9265,17,'F',3,'F3','middle',1),(9266,17,'F',4,'F4','middle',1),(9267,17,'F',5,'F5','middle',0),(9268,17,'F',6,'F6','middle',1),(9269,17,'F',7,'F7','middle',1),(9270,17,'F',8,'F8','middle',1),(9271,17,'F',9,'F9','middle',1),(9272,17,'F',10,'F10','middle',1),(9273,17,'F',11,'F11','middle',1),(9274,17,'F',12,'F12','middle',1),(9275,17,'F',13,'F13','middle',1),(9276,17,'F',14,'F14','middle',0),(9277,17,'F',15,'F15','middle',1),(9278,17,'F',16,'F16','middle',1),(9279,17,'F',17,'F17','middle',1),(9280,17,'F',18,'F18','middle',1),(9281,17,'G',1,'G1','middle',1),(9282,17,'G',2,'G2','middle',1),(9283,17,'G',3,'G3','middle',1),(9284,17,'G',4,'G4','middle',1),(9285,17,'G',5,'G5','middle',0),(9286,17,'G',6,'G6','middle',1),(9287,17,'G',7,'G7','middle',1),(9288,17,'G',8,'G8','middle',1),(9289,17,'G',9,'G9','middle',1),(9290,17,'G',10,'G10','middle',1),(9291,17,'G',11,'G11','middle',1),(9292,17,'G',12,'G12','middle',1),(9293,17,'G',13,'G13','middle',1),(9294,17,'G',14,'G14','middle',0),(9295,17,'G',15,'G15','middle',1),(9296,17,'G',16,'G16','middle',1),(9297,17,'G',17,'G17','middle',1),(9298,17,'G',18,'G18','middle',1),(9299,17,'H',1,'H1','middle',1),(9300,17,'H',2,'H2','middle',1),(9301,17,'H',3,'H3','middle',1),(9302,17,'H',4,'H4','middle',1),(9303,17,'H',5,'H5','middle',0),(9304,17,'H',6,'H6','middle',1),(9305,17,'H',7,'H7','middle',1),(9306,17,'H',8,'H8','middle',1),(9307,17,'H',9,'H9','middle',1),(9308,17,'H',10,'H10','middle',1),(9309,17,'H',11,'H11','middle',1),(9310,17,'H',12,'H12','middle',1),(9311,17,'H',13,'H13','middle',1),(9312,17,'H',14,'H14','middle',0),(9313,17,'H',15,'H15','middle',1),(9314,17,'H',16,'H16','middle',1),(9315,17,'H',17,'H17','middle',1),(9316,17,'H',18,'H18','middle',1),(9317,17,'I',1,'I1','middle',1),(9318,17,'I',2,'I2','middle',1),(9319,17,'I',3,'I3','middle',1),(9320,17,'I',4,'I4','middle',1),(9321,17,'I',5,'I5','middle',0),(9322,17,'I',6,'I6','middle',1),(9323,17,'I',7,'I7','middle',1),(9324,17,'I',8,'I8','middle',1),(9325,17,'I',9,'I9','middle',1),(9326,17,'I',10,'I10','middle',1),(9327,17,'I',11,'I11','middle',1),(9328,17,'I',12,'I12','middle',1),(9329,17,'I',13,'I13','middle',1),(9330,17,'I',14,'I14','middle',0),(9331,17,'I',15,'I15','middle',1),(9332,17,'I',16,'I16','middle',1),(9333,17,'I',17,'I17','middle',1),(9334,17,'I',18,'I18','middle',1),(9335,17,'J',1,'J1','middle',1),(9336,17,'J',2,'J2','middle',1),(9337,17,'J',3,'J3','middle',1),(9338,17,'J',4,'J4','middle',1),(9339,17,'J',5,'J5','middle',0),(9340,17,'J',6,'J6','expensive',1),(9341,17,'J',7,'J7','expensive',1),(9342,17,'J',8,'J8','expensive',1),(9343,17,'J',9,'J9','expensive',1),(9344,17,'J',10,'J10','expensive',1),(9345,17,'J',11,'J11','expensive',1),(9346,17,'J',12,'J12','expensive',1),(9347,17,'J',13,'J13','expensive',1),(9348,17,'J',14,'J14','middle',0),(9349,17,'J',15,'J15','middle',1),(9350,17,'J',16,'J16','middle',1),(9351,17,'J',17,'J17','middle',1),(9352,17,'J',18,'J18','middle',1),(9353,17,'K',1,'K1','middle',1),(9354,17,'K',2,'K2','middle',1),(9355,17,'K',3,'K3','middle',1),(9356,17,'K',4,'K4','middle',1),(9357,17,'K',5,'K5','middle',0),(9358,17,'K',6,'K6','expensive',1),(9359,17,'K',7,'K7','expensive',1),(9360,17,'K',8,'K8','expensive',1),(9361,17,'K',9,'K9','expensive',1),(9362,17,'K',10,'K10','expensive',1),(9363,17,'K',11,'K11','expensive',1),(9364,17,'K',12,'K12','expensive',1),(9365,17,'K',13,'K13','expensive',1),(9366,17,'K',14,'K14','middle',0),(9367,17,'K',15,'K15','middle',1),(9368,17,'K',16,'K16','middle',1),(9369,17,'K',17,'K17','middle',1),(9370,17,'K',18,'K18','middle',1),(9371,17,'L',1,'L1','middle',1),(9372,17,'L',2,'L2','middle',1),(9373,17,'L',3,'L3','middle',1),(9374,17,'L',4,'L4','middle',1),(9375,17,'L',5,'L5','middle',0),(9376,17,'L',6,'L6','expensive',1),(9377,17,'L',7,'L7','expensive',1),(9378,17,'L',8,'L8','expensive',1),(9379,17,'L',9,'L9','expensive',1),(9380,17,'L',10,'L10','expensive',1),(9381,17,'L',11,'L11','expensive',1),(9382,17,'L',12,'L12','expensive',1),(9383,17,'L',13,'L13','expensive',1),(9384,17,'L',14,'L14','middle',0),(9385,17,'L',15,'L15','middle',1),(9386,17,'L',16,'L16','middle',1),(9387,17,'L',17,'L17','middle',1),(9388,17,'L',18,'L18','middle',1),(9389,29,'A',1,'A1','middle',1),(9390,29,'A',2,'A2','middle',1),(9391,29,'A',3,'A3','middle',1),(9392,29,'A',4,'A4','middle',0),(9393,29,'A',5,'A5','middle',1),(9394,29,'A',6,'A6','middle',1),(9395,29,'A',7,'A7','middle',1),(9396,29,'A',8,'A8','middle',1),(9397,29,'A',9,'A9','middle',1),(9398,29,'A',10,'A10','middle',1),(9399,29,'A',11,'A11','middle',0),(9400,29,'A',12,'A12','middle',1),(9401,29,'A',13,'A13','middle',1),(9402,29,'A',14,'A14','middle',1),(9403,29,'B',1,'B1','middle',1),(9404,29,'B',2,'B2','middle',1),(9405,29,'B',3,'B3','middle',1),(9406,29,'B',4,'B4','middle',0),(9407,29,'B',5,'B5','middle',1),(9408,29,'B',6,'B6','middle',1),(9409,29,'B',7,'B7','middle',1),(9410,29,'B',8,'B8','middle',1),(9411,29,'B',9,'B9','middle',1),(9412,29,'B',10,'B10','middle',1),(9413,29,'B',11,'B11','middle',0),(9414,29,'B',12,'B12','middle',1),(9415,29,'B',13,'B13','middle',1),(9416,29,'B',14,'B14','middle',1),(9417,29,'C',1,'C1','middle',1),(9418,29,'C',2,'C2','middle',1),(9419,29,'C',3,'C3','middle',1),(9420,29,'C',4,'C4','middle',0),(9421,29,'C',5,'C5','middle',1),(9422,29,'C',6,'C6','middle',1),(9423,29,'C',7,'C7','middle',1),(9424,29,'C',8,'C8','middle',1),(9425,29,'C',9,'C9','middle',1),(9426,29,'C',10,'C10','middle',1),(9427,29,'C',11,'C11','middle',0),(9428,29,'C',12,'C12','middle',1),(9429,29,'C',13,'C13','middle',1),(9430,29,'C',14,'C14','middle',1),(9431,29,'D',1,'D1','expensive',1),(9432,29,'D',2,'D2','expensive',1),(9433,29,'D',3,'D3','expensive',1),(9434,29,'D',4,'D4','expensive',0),(9435,29,'D',5,'D5','expensive',1),(9436,29,'D',6,'D6','expensive',1),(9437,29,'D',7,'D7','expensive',1),(9438,29,'D',8,'D8','expensive',1),(9439,29,'D',9,'D9','expensive',1),(9440,29,'D',10,'D10','expensive',1),(9441,29,'D',11,'D11','expensive',0),(9442,29,'D',12,'D12','expensive',1),(9443,29,'D',13,'D13','expensive',1),(9444,29,'D',14,'D14','expensive',1),(9445,29,'E',1,'E1','expensive',1),(9446,29,'E',2,'E2','expensive',1),(9447,29,'E',3,'E3','expensive',1),(9448,29,'E',4,'E4','expensive',0),(9449,29,'E',5,'E5','expensive',1),(9450,29,'E',6,'E6','expensive',1),(9451,29,'E',7,'E7','expensive',1),(9452,29,'E',8,'E8','expensive',1),(9453,29,'E',9,'E9','expensive',1),(9454,29,'E',10,'E10','expensive',1),(9455,29,'E',11,'E11','expensive',0),(9456,29,'E',12,'E12','expensive',1),(9457,29,'E',13,'E13','expensive',1),(9458,29,'E',14,'E14','expensive',1),(9459,29,'F',1,'F1','expensive',1),(9460,29,'F',2,'F2','expensive',1),(9461,29,'F',3,'F3','expensive',1),(9462,29,'F',4,'F4','expensive',0),(9463,29,'F',5,'F5','expensive',1),(9464,29,'F',6,'F6','expensive',1),(9465,29,'F',7,'F7','expensive',1),(9466,29,'F',8,'F8','expensive',1),(9467,29,'F',9,'F9','expensive',1),(9468,29,'F',10,'F10','expensive',1),(9469,29,'F',11,'F11','expensive',0),(9470,29,'F',12,'F12','expensive',1),(9471,29,'F',13,'F13','expensive',1),(9472,29,'F',14,'F14','expensive',1),(9473,29,'G',1,'G1','expensive',1),(9474,29,'G',2,'G2','expensive',1),(9475,29,'G',3,'G3','expensive',1),(9476,29,'G',4,'G4','expensive',0),(9477,29,'G',5,'G5','expensive',1),(9478,29,'G',6,'G6','expensive',1),(9479,29,'G',7,'G7','expensive',1),(9480,29,'G',8,'G8','expensive',1),(9481,29,'G',9,'G9','expensive',1),(9482,29,'G',10,'G10','expensive',1),(9483,29,'G',11,'G11','expensive',0),(9484,29,'G',12,'G12','expensive',1),(9485,29,'G',13,'G13','expensive',1),(9486,29,'G',14,'G14','expensive',1),(9487,29,'H',1,'H1','expensive',1),(9488,29,'H',2,'H2','expensive',1),(9489,29,'H',3,'H3','expensive',1),(9490,29,'H',4,'H4','expensive',0),(9491,29,'H',5,'H5','expensive',1),(9492,29,'H',6,'H6','expensive',1),(9493,29,'H',7,'H7','expensive',1),(9494,29,'H',8,'H8','expensive',1),(9495,29,'H',9,'H9','expensive',1),(9496,29,'H',10,'H10','expensive',1),(9497,29,'H',11,'H11','expensive',0),(9498,29,'H',12,'H12','expensive',1),(9499,29,'H',13,'H13','expensive',1),(9500,29,'H',14,'H14','expensive',1),(9501,29,'I',1,'I1','expensive',1),(9502,29,'I',2,'I2','expensive',1),(9503,29,'I',3,'I3','expensive',1),(9504,29,'I',4,'I4','expensive',0),(9505,29,'I',5,'I5','expensive',1),(9506,29,'I',6,'I6','expensive',1),(9507,29,'I',7,'I7','expensive',1),(9508,29,'I',8,'I8','expensive',1),(9509,29,'I',9,'I9','expensive',1),(9510,29,'I',10,'I10','expensive',1),(9511,29,'I',11,'I11','expensive',0),(9512,29,'I',12,'I12','expensive',1),(9513,29,'I',13,'I13','expensive',1),(9514,29,'I',14,'I14','expensive',1),(9515,29,'J',1,'J1','expensive',1),(9516,29,'J',2,'J2','expensive',1),(9517,29,'J',3,'J3','expensive',1),(9518,29,'J',4,'J4','expensive',0),(9519,29,'J',5,'J5','expensive',1),(9520,29,'J',6,'J6','expensive',1),(9521,29,'J',7,'J7','expensive',1),(9522,29,'J',8,'J8','expensive',1),(9523,29,'J',9,'J9','expensive',1),(9524,29,'J',10,'J10','expensive',1),(9525,29,'J',11,'J11','expensive',0),(9526,29,'J',12,'J12','expensive',1),(9527,29,'J',13,'J13','expensive',1),(9528,29,'J',14,'J14','expensive',1),(9529,28,'A',1,'A1','middle',1),(9530,28,'A',2,'A2','middle',1),(9531,28,'A',3,'A3','middle',1),(9532,28,'A',4,'A4','middle',0),(9533,28,'A',5,'A5','middle',1),(9534,28,'A',6,'A6','middle',1),(9535,28,'A',7,'A7','middle',1),(9536,28,'A',8,'A8','middle',1),(9537,28,'A',9,'A9','middle',1),(9538,28,'A',10,'A10','middle',1),(9539,28,'A',11,'A11','middle',0),(9540,28,'A',12,'A12','middle',1),(9541,28,'A',13,'A13','middle',1),(9542,28,'A',14,'A14','middle',1),(9543,28,'B',1,'B1','middle',1),(9544,28,'B',2,'B2','middle',1),(9545,28,'B',3,'B3','middle',1),(9546,28,'B',4,'B4','middle',0),(9547,28,'B',5,'B5','middle',1),(9548,28,'B',6,'B6','middle',1),(9549,28,'B',7,'B7','middle',1),(9550,28,'B',8,'B8','middle',1),(9551,28,'B',9,'B9','middle',1),(9552,28,'B',10,'B10','middle',1),(9553,28,'B',11,'B11','middle',0),(9554,28,'B',12,'B12','middle',1),(9555,28,'B',13,'B13','middle',1),(9556,28,'B',14,'B14','middle',1),(9557,28,'C',1,'C1','middle',1),(9558,28,'C',2,'C2','middle',1),(9559,28,'C',3,'C3','middle',1),(9560,28,'C',4,'C4','middle',0),(9561,28,'C',5,'C5','middle',1),(9562,28,'C',6,'C6','middle',1),(9563,28,'C',7,'C7','middle',1),(9564,28,'C',8,'C8','middle',1),(9565,28,'C',9,'C9','middle',1),(9566,28,'C',10,'C10','middle',1),(9567,28,'C',11,'C11','middle',0),(9568,28,'C',12,'C12','middle',1),(9569,28,'C',13,'C13','middle',1),(9570,28,'C',14,'C14','middle',1),(9571,28,'D',1,'D1','expensive',1),(9572,28,'D',2,'D2','expensive',1),(9573,28,'D',3,'D3','expensive',1),(9574,28,'D',4,'D4','expensive',0),(9575,28,'D',5,'D5','expensive',1),(9576,28,'D',6,'D6','expensive',1),(9577,28,'D',7,'D7','expensive',1),(9578,28,'D',8,'D8','expensive',1),(9579,28,'D',9,'D9','expensive',1),(9580,28,'D',10,'D10','expensive',1),(9581,28,'D',11,'D11','expensive',0),(9582,28,'D',12,'D12','expensive',1),(9583,28,'D',13,'D13','expensive',1),(9584,28,'D',14,'D14','expensive',1),(9585,28,'E',1,'E1','expensive',1),(9586,28,'E',2,'E2','expensive',1),(9587,28,'E',3,'E3','expensive',1),(9588,28,'E',4,'E4','expensive',0),(9589,28,'E',5,'E5','expensive',1),(9590,28,'E',6,'E6','expensive',1),(9591,28,'E',7,'E7','expensive',1),(9592,28,'E',8,'E8','expensive',1),(9593,28,'E',9,'E9','expensive',1),(9594,28,'E',10,'E10','expensive',1),(9595,28,'E',11,'E11','expensive',0),(9596,28,'E',12,'E12','expensive',1),(9597,28,'E',13,'E13','expensive',1),(9598,28,'E',14,'E14','expensive',1),(9599,28,'F',1,'F1','expensive',1),(9600,28,'F',2,'F2','expensive',1),(9601,28,'F',3,'F3','expensive',1),(9602,28,'F',4,'F4','expensive',0),(9603,28,'F',5,'F5','expensive',1),(9604,28,'F',6,'F6','expensive',1),(9605,28,'F',7,'F7','expensive',1),(9606,28,'F',8,'F8','expensive',1),(9607,28,'F',9,'F9','expensive',1),(9608,28,'F',10,'F10','expensive',1),(9609,28,'F',11,'F11','expensive',0),(9610,28,'F',12,'F12','expensive',1),(9611,28,'F',13,'F13','expensive',1),(9612,28,'F',14,'F14','expensive',1),(9613,28,'G',1,'G1','expensive',1),(9614,28,'G',2,'G2','expensive',1),(9615,28,'G',3,'G3','expensive',1),(9616,28,'G',4,'G4','expensive',0),(9617,28,'G',5,'G5','expensive',1),(9618,28,'G',6,'G6','expensive',1),(9619,28,'G',7,'G7','expensive',1),(9620,28,'G',8,'G8','expensive',1),(9621,28,'G',9,'G9','expensive',1),(9622,28,'G',10,'G10','expensive',1),(9623,28,'G',11,'G11','expensive',0),(9624,28,'G',12,'G12','expensive',1),(9625,28,'G',13,'G13','expensive',1),(9626,28,'G',14,'G14','expensive',1),(9627,28,'H',1,'H1','expensive',1),(9628,28,'H',2,'H2','expensive',1),(9629,28,'H',3,'H3','expensive',1),(9630,28,'H',4,'H4','expensive',0),(9631,28,'H',5,'H5','expensive',1),(9632,28,'H',6,'H6','expensive',1),(9633,28,'H',7,'H7','expensive',1),(9634,28,'H',8,'H8','expensive',1),(9635,28,'H',9,'H9','expensive',1),(9636,28,'H',10,'H10','expensive',1),(9637,28,'H',11,'H11','expensive',0),(9638,28,'H',12,'H12','expensive',1),(9639,28,'H',13,'H13','expensive',1),(9640,28,'H',14,'H14','expensive',1),(9641,28,'I',1,'I1','expensive',1),(9642,28,'I',2,'I2','expensive',1),(9643,28,'I',3,'I3','expensive',1),(9644,28,'I',4,'I4','expensive',0),(9645,28,'I',5,'I5','expensive',1),(9646,28,'I',6,'I6','expensive',1),(9647,28,'I',7,'I7','expensive',1),(9648,28,'I',8,'I8','expensive',1),(9649,28,'I',9,'I9','expensive',1),(9650,28,'I',10,'I10','expensive',1),(9651,28,'I',11,'I11','expensive',0),(9652,28,'I',12,'I12','expensive',1),(9653,28,'I',13,'I13','expensive',1),(9654,28,'I',14,'I14','expensive',1),(9655,28,'J',1,'J1','expensive',1),(9656,28,'J',2,'J2','expensive',1),(9657,28,'J',3,'J3','expensive',1),(9658,28,'J',4,'J4','expensive',0),(9659,28,'J',5,'J5','expensive',1),(9660,28,'J',6,'J6','expensive',1),(9661,28,'J',7,'J7','expensive',1),(9662,28,'J',8,'J8','expensive',1),(9663,28,'J',9,'J9','expensive',1),(9664,28,'J',10,'J10','expensive',1),(9665,28,'J',11,'J11','expensive',0),(9666,28,'J',12,'J12','expensive',1),(9667,28,'J',13,'J13','expensive',1),(9668,28,'J',14,'J14','expensive',1),(9861,1,'A',1,'A1','cheap',1),(9862,1,'A',2,'A2','cheap',1),(9863,1,'A',3,'A3','cheap',1),(9864,1,'A',4,'A4','cheap',1),(9865,1,'A',5,'A5','cheap',1),(9866,1,'A',6,'A6','cheap',1),(9867,1,'A',7,'A7','cheap',1),(9868,1,'A',8,'A8','cheap',1),(9869,1,'A',9,'A9','cheap',1),(9870,1,'A',10,'A10','cheap',1),(9871,1,'A',11,'A11','cheap',1),(9872,1,'A',12,'A12','cheap',1),(9873,1,'A',13,'A13','cheap',1),(9874,1,'A',14,'A14','cheap',1),(9875,1,'A',15,'A15','cheap',1),(9876,1,'A',16,'A16','cheap',1),(9877,1,'B',1,'B1','cheap',1),(9878,1,'B',2,'B2','cheap',1),(9879,1,'B',3,'B3','cheap',1),(9880,1,'B',4,'B4','cheap',1),(9881,1,'B',5,'B5','cheap',1),(9882,1,'B',6,'B6','cheap',1),(9883,1,'B',7,'B7','cheap',1),(9884,1,'B',8,'B8','cheap',1),(9885,1,'B',9,'B9','cheap',1),(9886,1,'B',10,'B10','cheap',1),(9887,1,'B',11,'B11','cheap',1),(9888,1,'B',12,'B12','cheap',1),(9889,1,'B',13,'B13','cheap',1),(9890,1,'B',14,'B14','cheap',1),(9891,1,'B',15,'B15','cheap',1),(9892,1,'B',16,'B16','cheap',1),(9893,1,'C',1,'C1','cheap',1),(9894,1,'C',2,'C2','cheap',1),(9895,1,'C',3,'C3','cheap',1),(9896,1,'C',4,'C4','cheap',1),(9897,1,'C',5,'C5','cheap',1),(9898,1,'C',6,'C6','cheap',1),(9899,1,'C',7,'C7','cheap',1),(9900,1,'C',8,'C8','cheap',1),(9901,1,'C',9,'C9','cheap',1),(9902,1,'C',10,'C10','cheap',1),(9903,1,'C',11,'C11','cheap',1),(9904,1,'C',12,'C12','cheap',1),(9905,1,'C',13,'C13','cheap',1),(9906,1,'C',14,'C14','cheap',1),(9907,1,'C',15,'C15','cheap',1),(9908,1,'C',16,'C16','cheap',1),(9909,1,'D',1,'D1','cheap',1),(9910,1,'D',2,'D2','cheap',1),(9911,1,'D',3,'D3','cheap',1),(9912,1,'D',4,'D4','cheap',1),(9913,1,'D',5,'D5','cheap',1),(9914,1,'D',6,'D6','cheap',1),(9915,1,'D',7,'D7','cheap',1),(9916,1,'D',8,'D8','cheap',1),(9917,1,'D',9,'D9','cheap',1),(9918,1,'D',10,'D10','cheap',1),(9919,1,'D',11,'D11','cheap',1),(9920,1,'D',12,'D12','cheap',1),(9921,1,'D',13,'D13','cheap',1),(9922,1,'D',14,'D14','cheap',1),(9923,1,'D',15,'D15','cheap',1),(9924,1,'D',16,'D16','cheap',1),(9925,1,'E',1,'E1','cheap',1),(9926,1,'E',2,'E2','cheap',1),(9927,1,'E',3,'E3','cheap',1),(9928,1,'E',4,'E4','cheap',1),(9929,1,'E',5,'E5','cheap',1),(9930,1,'E',6,'E6','cheap',1),(9931,1,'E',7,'E7','cheap',1),(9932,1,'E',8,'E8','cheap',1),(9933,1,'E',9,'E9','cheap',1),(9934,1,'E',10,'E10','cheap',1),(9935,1,'E',11,'E11','cheap',1),(9936,1,'E',12,'E12','cheap',1),(9937,1,'E',13,'E13','cheap',1),(9938,1,'E',14,'E14','cheap',1),(9939,1,'E',15,'E15','cheap',1),(9940,1,'E',16,'E16','cheap',1),(9941,1,'F',1,'F1','middle',1),(9942,1,'F',2,'F2','middle',1),(9943,1,'F',3,'F3','middle',1),(9944,1,'F',4,'F4','middle',1),(9945,1,'F',5,'F5','middle',1),(9946,1,'F',6,'F6','middle',1),(9947,1,'F',7,'F7','middle',1),(9948,1,'F',8,'F8','middle',1),(9949,1,'F',9,'F9','middle',1),(9950,1,'F',10,'F10','middle',1),(9951,1,'F',11,'F11','middle',1),(9952,1,'F',12,'F12','middle',1),(9953,1,'F',13,'F13','middle',1),(9954,1,'F',14,'F14','middle',1),(9955,1,'F',15,'F15','middle',1),(9956,1,'F',16,'F16','middle',1),(9957,1,'G',1,'G1','middle',1),(9958,1,'G',2,'G2','middle',1),(9959,1,'G',3,'G3','middle',1),(9960,1,'G',4,'G4','middle',1),(9961,1,'G',5,'G5','middle',1),(9962,1,'G',6,'G6','middle',1),(9963,1,'G',7,'G7','middle',1),(9964,1,'G',8,'G8','middle',1),(9965,1,'G',9,'G9','middle',1),(9966,1,'G',10,'G10','middle',1),(9967,1,'G',11,'G11','middle',1),(9968,1,'G',12,'G12','middle',1),(9969,1,'G',13,'G13','middle',1),(9970,1,'G',14,'G14','middle',1),(9971,1,'G',15,'G15','middle',1),(9972,1,'G',16,'G16','middle',1),(9973,1,'H',1,'H1','middle',1),(9974,1,'H',2,'H2','middle',1),(9975,1,'H',3,'H3','middle',1),(9976,1,'H',4,'H4','middle',1),(9977,1,'H',5,'H5','middle',1),(9978,1,'H',6,'H6','middle',1),(9979,1,'H',7,'H7','middle',1),(9980,1,'H',8,'H8','middle',1),(9981,1,'H',9,'H9','middle',1),(9982,1,'H',10,'H10','middle',1),(9983,1,'H',11,'H11','middle',1),(9984,1,'H',12,'H12','middle',1),(9985,1,'H',13,'H13','middle',1),(9986,1,'H',14,'H14','middle',1),(9987,1,'H',15,'H15','middle',1),(9988,1,'H',16,'H16','middle',1),(9989,1,'I',1,'I1','middle',1),(9990,1,'I',2,'I2','middle',1),(9991,1,'I',3,'I3','middle',1),(9992,1,'I',4,'I4','middle',1),(9993,1,'I',5,'I5','middle',1),(9994,1,'I',6,'I6','middle',1),(9995,1,'I',7,'I7','middle',1),(9996,1,'I',8,'I8','middle',1),(9997,1,'I',9,'I9','middle',1),(9998,1,'I',10,'I10','middle',1),(9999,1,'I',11,'I11','middle',1),(10000,1,'I',12,'I12','middle',1),(10001,1,'I',13,'I13','middle',1),(10002,1,'I',14,'I14','middle',1),(10003,1,'I',15,'I15','middle',1),(10004,1,'I',16,'I16','middle',1),(10005,1,'J',1,'J1','cheap',1),(10006,1,'J',2,'J2','cheap',1),(10007,1,'J',3,'J3','cheap',1),(10008,1,'J',4,'J4','cheap',1),(10009,1,'J',5,'J5','expensive',1),(10010,1,'J',6,'J6','expensive',1),(10011,1,'J',7,'J7','expensive',1),(10012,1,'J',8,'J8','expensive',1),(10013,1,'J',9,'J9','expensive',1),(10014,1,'J',10,'J10','expensive',1),(10015,1,'J',11,'J11','expensive',1),(10016,1,'J',12,'J12','expensive',1),(10017,1,'J',13,'J13','cheap',1),(10018,1,'J',14,'J14','cheap',1),(10019,1,'J',15,'J15','cheap',1),(10020,1,'J',16,'J16','cheap',1),(10021,1,'K',1,'K1','cheap',1),(10022,1,'K',2,'K2','cheap',1),(10023,1,'K',3,'K3','cheap',1),(10024,1,'K',4,'K4','cheap',1),(10025,1,'K',5,'K5','expensive',1),(10026,1,'K',6,'K6','expensive',1),(10027,1,'K',7,'K7','expensive',1),(10028,1,'K',8,'K8','expensive',1),(10029,1,'K',9,'K9','expensive',1),(10030,1,'K',10,'K10','expensive',1),(10031,1,'K',11,'K11','expensive',1),(10032,1,'K',12,'K12','expensive',1),(10033,1,'K',13,'K13','cheap',1),(10034,1,'K',14,'K14','cheap',1),(10035,1,'K',15,'K15','cheap',1),(10036,1,'K',16,'K16','cheap',1),(10037,1,'L',1,'L1','cheap',1),(10038,1,'L',2,'L2','cheap',1),(10039,1,'L',3,'L3','cheap',1),(10040,1,'L',4,'L4','cheap',1),(10041,1,'L',5,'L5','expensive',1),(10042,1,'L',6,'L6','expensive',1),(10043,1,'L',7,'L7','expensive',1),(10044,1,'L',8,'L8','expensive',1),(10045,1,'L',9,'L9','expensive',1),(10046,1,'L',10,'L10','expensive',1),(10047,1,'L',11,'L11','expensive',1),(10048,1,'L',12,'L12','expensive',1),(10049,1,'L',13,'L13','cheap',1),(10050,1,'L',14,'L14','cheap',1),(10051,1,'L',15,'L15','cheap',1),(10052,1,'L',16,'L16','cheap',1),(10053,27,'A',1,'A1','cheap',1),(10054,27,'A',2,'A2','cheap',1),(10055,27,'A',3,'A3','cheap',1),(10056,27,'A',4,'A4','cheap',1),(10057,27,'A',5,'A5','cheap',1),(10058,27,'A',6,'A6','cheap',1),(10059,27,'A',7,'A7','cheap',1),(10060,27,'A',8,'A8','cheap',1),(10061,27,'A',9,'A9','cheap',1),(10062,27,'A',10,'A10','cheap',1),(10063,27,'A',11,'A11','cheap',1),(10064,27,'A',12,'A12','cheap',1),(10065,27,'A',13,'A13','cheap',1),(10066,27,'A',14,'A14','cheap',1),(10067,27,'A',15,'A15','cheap',1),(10068,27,'A',16,'A16','cheap',1),(10069,27,'A',17,'A17','cheap',1),(10070,27,'B',1,'B1','cheap',1),(10071,27,'B',2,'B2','cheap',1),(10072,27,'B',3,'B3','cheap',1),(10073,27,'B',4,'B4','cheap',1),(10074,27,'B',5,'B5','cheap',1),(10075,27,'B',6,'B6','cheap',1),(10076,27,'B',7,'B7','cheap',1),(10077,27,'B',8,'B8','cheap',1),(10078,27,'B',9,'B9','cheap',1),(10079,27,'B',10,'B10','cheap',1),(10080,27,'B',11,'B11','cheap',1),(10081,27,'B',12,'B12','cheap',1),(10082,27,'B',13,'B13','cheap',1),(10083,27,'B',14,'B14','cheap',1),(10084,27,'B',15,'B15','cheap',1),(10085,27,'B',16,'B16','cheap',1),(10086,27,'B',17,'B17','cheap',1),(10087,27,'C',1,'C1','cheap',1),(10088,27,'C',2,'C2','cheap',1),(10089,27,'C',3,'C3','cheap',1),(10090,27,'C',4,'C4','cheap',1),(10091,27,'C',5,'C5','cheap',1),(10092,27,'C',6,'C6','cheap',1),(10093,27,'C',7,'C7','cheap',1),(10094,27,'C',8,'C8','cheap',1),(10095,27,'C',9,'C9','cheap',1),(10096,27,'C',10,'C10','cheap',1),(10097,27,'C',11,'C11','cheap',1),(10098,27,'C',12,'C12','cheap',1),(10099,27,'C',13,'C13','cheap',1),(10100,27,'C',14,'C14','cheap',1),(10101,27,'C',15,'C15','cheap',1),(10102,27,'C',16,'C16','cheap',1),(10103,27,'C',17,'C17','cheap',1),(10104,27,'D',1,'D1','cheap',1),(10105,27,'D',2,'D2','cheap',1),(10106,27,'D',3,'D3','cheap',1),(10107,27,'D',4,'D4','cheap',1),(10108,27,'D',5,'D5','cheap',1),(10109,27,'D',6,'D6','cheap',1),(10110,27,'D',7,'D7','cheap',1),(10111,27,'D',8,'D8','cheap',1),(10112,27,'D',9,'D9','cheap',1),(10113,27,'D',10,'D10','cheap',1),(10114,27,'D',11,'D11','cheap',1),(10115,27,'D',12,'D12','cheap',1),(10116,27,'D',13,'D13','cheap',1),(10117,27,'D',14,'D14','cheap',1),(10118,27,'D',15,'D15','cheap',1),(10119,27,'D',16,'D16','cheap',1),(10120,27,'D',17,'D17','cheap',1),(10121,27,'E',1,'E1','middle',1),(10122,27,'E',2,'E2','middle',1),(10123,27,'E',3,'E3','middle',1),(10124,27,'E',4,'E4','middle',1),(10125,27,'E',5,'E5','middle',1),(10126,27,'E',6,'E6','middle',1),(10127,27,'E',7,'E7','middle',1),(10128,27,'E',8,'E8','middle',1),(10129,27,'E',9,'E9','middle',1),(10130,27,'E',10,'E10','middle',1),(10131,27,'E',11,'E11','middle',1),(10132,27,'E',12,'E12','middle',1),(10133,27,'E',13,'E13','middle',1),(10134,27,'E',14,'E14','middle',1),(10135,27,'E',15,'E15','middle',1),(10136,27,'E',16,'E16','middle',1),(10137,27,'E',17,'E17','middle',1),(10138,27,'F',1,'F1','middle',1),(10139,27,'F',2,'F2','middle',1),(10140,27,'F',3,'F3','middle',1),(10141,27,'F',4,'F4','middle',1),(10142,27,'F',5,'F5','middle',1),(10143,27,'F',6,'F6','middle',1),(10144,27,'F',7,'F7','middle',1),(10145,27,'F',8,'F8','middle',1),(10146,27,'F',9,'F9','middle',1),(10147,27,'F',10,'F10','middle',1),(10148,27,'F',11,'F11','middle',1),(10149,27,'F',12,'F12','middle',1),(10150,27,'F',13,'F13','middle',1),(10151,27,'F',14,'F14','middle',1),(10152,27,'F',15,'F15','middle',1),(10153,27,'F',16,'F16','middle',1),(10154,27,'F',17,'F17','middle',1),(10155,27,'G',1,'G1','middle',1),(10156,27,'G',2,'G2','middle',1),(10157,27,'G',3,'G3','middle',1),(10158,27,'G',4,'G4','middle',1),(10159,27,'G',5,'G5','middle',1),(10160,27,'G',6,'G6','middle',1),(10161,27,'G',7,'G7','middle',1),(10162,27,'G',8,'G8','middle',1),(10163,27,'G',9,'G9','middle',1),(10164,27,'G',10,'G10','middle',1),(10165,27,'G',11,'G11','middle',1),(10166,27,'G',12,'G12','middle',1),(10167,27,'G',13,'G13','middle',1),(10168,27,'G',14,'G14','middle',1),(10169,27,'G',15,'G15','middle',1),(10170,27,'G',16,'G16','middle',1),(10171,27,'G',17,'G17','middle',1),(10172,27,'H',1,'H1','middle',1),(10173,27,'H',2,'H2','middle',1),(10174,27,'H',3,'H3','middle',1),(10175,27,'H',4,'H4','middle',1),(10176,27,'H',5,'H5','middle',1),(10177,27,'H',6,'H6','middle',1),(10178,27,'H',7,'H7','middle',1),(10179,27,'H',8,'H8','middle',1),(10180,27,'H',9,'H9','middle',1),(10181,27,'H',10,'H10','middle',1),(10182,27,'H',11,'H11','middle',1),(10183,27,'H',12,'H12','middle',1),(10184,27,'H',13,'H13','middle',1),(10185,27,'H',14,'H14','middle',1),(10186,27,'H',15,'H15','middle',1),(10187,27,'H',16,'H16','middle',1),(10188,27,'H',17,'H17','middle',1),(10189,27,'I',1,'I1','middle',1),(10190,27,'I',2,'I2','middle',1),(10191,27,'I',3,'I3','middle',1),(10192,27,'I',4,'I4','middle',1),(10193,27,'I',5,'I5','middle',1),(10194,27,'I',6,'I6','expensive',1),(10195,27,'I',7,'I7','expensive',1),(10196,27,'I',8,'I8','expensive',1),(10197,27,'I',9,'I9','expensive',1),(10198,27,'I',10,'I10','expensive',1),(10199,27,'I',11,'I11','expensive',1),(10200,27,'I',12,'I12','expensive',1),(10201,27,'I',13,'I13','middle',1),(10202,27,'I',14,'I14','middle',1),(10203,27,'I',15,'I15','middle',1),(10204,27,'I',16,'I16','middle',1),(10205,27,'I',17,'I17','middle',1),(10206,27,'J',1,'J1','middle',1),(10207,27,'J',2,'J2','middle',1),(10208,27,'J',3,'J3','middle',1),(10209,27,'J',4,'J4','middle',1),(10210,27,'J',5,'J5','middle',1),(10211,27,'J',6,'J6','expensive',1),(10212,27,'J',7,'J7','expensive',1),(10213,27,'J',8,'J8','expensive',1),(10214,27,'J',9,'J9','expensive',1),(10215,27,'J',10,'J10','expensive',1),(10216,27,'J',11,'J11','expensive',1),(10217,27,'J',12,'J12','expensive',1),(10218,27,'J',13,'J13','middle',1),(10219,27,'J',14,'J14','middle',1),(10220,27,'J',15,'J15','middle',1),(10221,27,'J',16,'J16','middle',1),(10222,27,'J',17,'J17','middle',1),(10223,27,'K',1,'K1','middle',1),(10224,27,'K',2,'K2','middle',1),(10225,27,'K',3,'K3','middle',1),(10226,27,'K',4,'K4','middle',1),(10227,27,'K',5,'K5','middle',1),(10228,27,'K',6,'K6','expensive',1),(10229,27,'K',7,'K7','expensive',1),(10230,27,'K',8,'K8','expensive',1),(10231,27,'K',9,'K9','expensive',1),(10232,27,'K',10,'K10','expensive',1),(10233,27,'K',11,'K11','expensive',1),(10234,27,'K',12,'K12','expensive',1),(10235,27,'K',13,'K13','middle',1),(10236,27,'K',14,'K14','middle',1),(10237,27,'K',15,'K15','middle',1),(10238,27,'K',16,'K16','middle',1),(10239,27,'K',17,'K17','middle',1),(10240,27,'L',1,'L1','middle',1),(10241,27,'L',2,'L2','middle',1),(10242,27,'L',3,'L3','middle',1),(10243,27,'L',4,'L4','middle',1),(10244,27,'L',5,'L5','middle',1),(10245,27,'L',6,'L6','expensive',1),(10246,27,'L',7,'L7','expensive',1),(10247,27,'L',8,'L8','expensive',1),(10248,27,'L',9,'L9','expensive',1),(10249,27,'L',10,'L10','expensive',1),(10250,27,'L',11,'L11','expensive',1),(10251,27,'L',12,'L12','expensive',1),(10252,27,'L',13,'L13','middle',1),(10253,27,'L',14,'L14','middle',1),(10254,27,'L',15,'L15','middle',1),(10255,27,'L',16,'L16','middle',1),(10256,27,'L',17,'L17','middle',1),(10257,30,'A',1,'A1','middle',1),(10258,30,'A',2,'A2','middle',1),(10259,30,'A',3,'A3','middle',1),(10260,30,'A',4,'A4','middle',0),(10261,30,'A',5,'A5','middle',1),(10262,30,'A',6,'A6','middle',1),(10263,30,'A',7,'A7','middle',1),(10264,30,'A',8,'A8','middle',1),(10265,30,'A',9,'A9','middle',1),(10266,30,'A',10,'A10','middle',1),(10267,30,'A',11,'A11','middle',0),(10268,30,'A',12,'A12','middle',1),(10269,30,'A',13,'A13','middle',1),(10270,30,'A',14,'A14','middle',1),(10271,30,'B',1,'B1','middle',1),(10272,30,'B',2,'B2','middle',1),(10273,30,'B',3,'B3','middle',1),(10274,30,'B',4,'B4','middle',0),(10275,30,'B',5,'B5','middle',1),(10276,30,'B',6,'B6','middle',1),(10277,30,'B',7,'B7','middle',1),(10278,30,'B',8,'B8','middle',1),(10279,30,'B',9,'B9','middle',1),(10280,30,'B',10,'B10','middle',1),(10281,30,'B',11,'B11','middle',0),(10282,30,'B',12,'B12','middle',1),(10283,30,'B',13,'B13','middle',1),(10284,30,'B',14,'B14','middle',1),(10285,30,'C',1,'C1','middle',1),(10286,30,'C',2,'C2','middle',1),(10287,30,'C',3,'C3','middle',1),(10288,30,'C',4,'C4','middle',0),(10289,30,'C',5,'C5','middle',1),(10290,30,'C',6,'C6','middle',1),(10291,30,'C',7,'C7','middle',1),(10292,30,'C',8,'C8','middle',1),(10293,30,'C',9,'C9','middle',1),(10294,30,'C',10,'C10','middle',1),(10295,30,'C',11,'C11','middle',0),(10296,30,'C',12,'C12','middle',1),(10297,30,'C',13,'C13','middle',1),(10298,30,'C',14,'C14','middle',1),(10299,30,'D',1,'D1','expensive',1),(10300,30,'D',2,'D2','expensive',1),(10301,30,'D',3,'D3','expensive',1),(10302,30,'D',4,'D4','expensive',0),(10303,30,'D',5,'D5','expensive',1),(10304,30,'D',6,'D6','expensive',1),(10305,30,'D',7,'D7','expensive',1),(10306,30,'D',8,'D8','expensive',1),(10307,30,'D',9,'D9','expensive',1),(10308,30,'D',10,'D10','expensive',1),(10309,30,'D',11,'D11','expensive',0),(10310,30,'D',12,'D12','expensive',1),(10311,30,'D',13,'D13','expensive',1),(10312,30,'D',14,'D14','expensive',1),(10313,30,'E',1,'E1','expensive',1),(10314,30,'E',2,'E2','expensive',1),(10315,30,'E',3,'E3','expensive',1),(10316,30,'E',4,'E4','expensive',0),(10317,30,'E',5,'E5','expensive',1),(10318,30,'E',6,'E6','expensive',1),(10319,30,'E',7,'E7','expensive',1),(10320,30,'E',8,'E8','expensive',1),(10321,30,'E',9,'E9','expensive',1),(10322,30,'E',10,'E10','expensive',1),(10323,30,'E',11,'E11','expensive',0),(10324,30,'E',12,'E12','expensive',1),(10325,30,'E',13,'E13','expensive',1),(10326,30,'E',14,'E14','expensive',1),(10327,30,'F',1,'F1','expensive',1),(10328,30,'F',2,'F2','expensive',1),(10329,30,'F',3,'F3','expensive',1),(10330,30,'F',4,'F4','expensive',0),(10331,30,'F',5,'F5','expensive',1),(10332,30,'F',6,'F6','expensive',1),(10333,30,'F',7,'F7','expensive',1),(10334,30,'F',8,'F8','expensive',1),(10335,30,'F',9,'F9','expensive',1),(10336,30,'F',10,'F10','expensive',1),(10337,30,'F',11,'F11','expensive',0),(10338,30,'F',12,'F12','expensive',1),(10339,30,'F',13,'F13','expensive',1),(10340,30,'F',14,'F14','expensive',1),(10341,30,'G',1,'G1','expensive',1),(10342,30,'G',2,'G2','expensive',1),(10343,30,'G',3,'G3','expensive',1),(10344,30,'G',4,'G4','expensive',0),(10345,30,'G',5,'G5','expensive',1),(10346,30,'G',6,'G6','expensive',1),(10347,30,'G',7,'G7','expensive',1),(10348,30,'G',8,'G8','expensive',1),(10349,30,'G',9,'G9','expensive',1),(10350,30,'G',10,'G10','expensive',1),(10351,30,'G',11,'G11','expensive',0),(10352,30,'G',12,'G12','expensive',1),(10353,30,'G',13,'G13','expensive',1),(10354,30,'G',14,'G14','expensive',1),(10355,30,'H',1,'H1','expensive',1),(10356,30,'H',2,'H2','expensive',1),(10357,30,'H',3,'H3','expensive',1),(10358,30,'H',4,'H4','expensive',0),(10359,30,'H',5,'H5','expensive',1),(10360,30,'H',6,'H6','expensive',1),(10361,30,'H',7,'H7','expensive',1),(10362,30,'H',8,'H8','expensive',1),(10363,30,'H',9,'H9','expensive',1),(10364,30,'H',10,'H10','expensive',1),(10365,30,'H',11,'H11','expensive',0),(10366,30,'H',12,'H12','expensive',1),(10367,30,'H',13,'H13','expensive',1),(10368,30,'H',14,'H14','expensive',1),(10369,30,'I',1,'I1','expensive',1),(10370,30,'I',2,'I2','expensive',1),(10371,30,'I',3,'I3','expensive',1),(10372,30,'I',4,'I4','expensive',0),(10373,30,'I',5,'I5','expensive',1),(10374,30,'I',6,'I6','expensive',1),(10375,30,'I',7,'I7','expensive',1),(10376,30,'I',8,'I8','expensive',1),(10377,30,'I',9,'I9','expensive',1),(10378,30,'I',10,'I10','expensive',1),(10379,30,'I',11,'I11','expensive',0),(10380,30,'I',12,'I12','expensive',1),(10381,30,'I',13,'I13','expensive',1),(10382,30,'I',14,'I14','expensive',1),(10383,30,'J',1,'J1','expensive',1),(10384,30,'J',2,'J2','expensive',1),(10385,30,'J',3,'J3','expensive',1),(10386,30,'J',4,'J4','expensive',0),(10387,30,'J',5,'J5','expensive',1),(10388,30,'J',6,'J6','expensive',1),(10389,30,'J',7,'J7','expensive',1),(10390,30,'J',8,'J8','expensive',1),(10391,30,'J',9,'J9','expensive',1),(10392,30,'J',10,'J10','expensive',1),(10393,30,'J',11,'J11','expensive',0),(10394,30,'J',12,'J12','expensive',1),(10395,30,'J',13,'J13','expensive',1),(10396,30,'J',14,'J14','expensive',1),(10397,31,'A',1,'A1','cheap',1),(10398,31,'A',2,'A2','cheap',1),(10399,31,'A',3,'A3','cheap',1),(10400,31,'A',4,'A4','cheap',1),(10401,31,'A',5,'A5','cheap',1),(10402,31,'A',6,'A6','cheap',1),(10403,31,'A',7,'A7','cheap',0),(10404,31,'A',8,'A8','cheap',1),(10405,31,'A',9,'A9','cheap',1),(10406,31,'A',10,'A10','cheap',1),(10407,31,'A',11,'A11','cheap',1),(10408,31,'A',12,'A12','cheap',1),(10409,31,'A',13,'A13','cheap',1),(10410,31,'A',14,'A14','cheap',1),(10411,31,'A',15,'A15','cheap',1),(10412,31,'A',16,'A16','cheap',1),(10413,31,'A',17,'A17','cheap',1),(10414,31,'A',18,'A18','cheap',0),(10415,31,'A',19,'A19','cheap',1),(10416,31,'A',20,'A20','cheap',1),(10417,31,'A',21,'A21','cheap',1),(10418,31,'A',22,'A22','cheap',1),(10419,31,'A',23,'A23','cheap',1),(10420,31,'A',24,'A24','cheap',1),(10421,31,'B',1,'B1','cheap',1),(10422,31,'B',2,'B2','cheap',1),(10423,31,'B',3,'B3','cheap',1),(10424,31,'B',4,'B4','cheap',1),(10425,31,'B',5,'B5','cheap',1),(10426,31,'B',6,'B6','cheap',1),(10427,31,'B',7,'B7','cheap',0),(10428,31,'B',8,'B8','cheap',1),(10429,31,'B',9,'B9','cheap',1),(10430,31,'B',10,'B10','cheap',1),(10431,31,'B',11,'B11','cheap',1),(10432,31,'B',12,'B12','cheap',1),(10433,31,'B',13,'B13','cheap',1),(10434,31,'B',14,'B14','cheap',1),(10435,31,'B',15,'B15','cheap',1),(10436,31,'B',16,'B16','cheap',1),(10437,31,'B',17,'B17','cheap',1),(10438,31,'B',18,'B18','cheap',0),(10439,31,'B',19,'B19','cheap',1),(10440,31,'B',20,'B20','cheap',1),(10441,31,'B',21,'B21','cheap',1),(10442,31,'B',22,'B22','cheap',1),(10443,31,'B',23,'B23','cheap',1),(10444,31,'B',24,'B24','cheap',1),(10445,31,'C',1,'C1','cheap',1),(10446,31,'C',2,'C2','cheap',1),(10447,31,'C',3,'C3','cheap',1),(10448,31,'C',4,'C4','cheap',1),(10449,31,'C',5,'C5','cheap',1),(10450,31,'C',6,'C6','cheap',1),(10451,31,'C',7,'C7','cheap',0),(10452,31,'C',8,'C8','cheap',1),(10453,31,'C',9,'C9','cheap',1),(10454,31,'C',10,'C10','cheap',1),(10455,31,'C',11,'C11','cheap',1),(10456,31,'C',12,'C12','cheap',1),(10457,31,'C',13,'C13','cheap',1),(10458,31,'C',14,'C14','cheap',1),(10459,31,'C',15,'C15','cheap',1),(10460,31,'C',16,'C16','cheap',1),(10461,31,'C',17,'C17','cheap',1),(10462,31,'C',18,'C18','cheap',0),(10463,31,'C',19,'C19','cheap',1),(10464,31,'C',20,'C20','cheap',1),(10465,31,'C',21,'C21','cheap',1),(10466,31,'C',22,'C22','cheap',1),(10467,31,'C',23,'C23','cheap',1),(10468,31,'C',24,'C24','cheap',1),(10469,31,'D',1,'D1','cheap',1),(10470,31,'D',2,'D2','cheap',1),(10471,31,'D',3,'D3','cheap',1),(10472,31,'D',4,'D4','cheap',1),(10473,31,'D',5,'D5','cheap',1),(10474,31,'D',6,'D6','cheap',1),(10475,31,'D',7,'D7','cheap',0),(10476,31,'D',8,'D8','cheap',1),(10477,31,'D',9,'D9','cheap',1),(10478,31,'D',10,'D10','cheap',1),(10479,31,'D',11,'D11','cheap',1),(10480,31,'D',12,'D12','cheap',1),(10481,31,'D',13,'D13','cheap',1),(10482,31,'D',14,'D14','cheap',1),(10483,31,'D',15,'D15','cheap',1),(10484,31,'D',16,'D16','cheap',1),(10485,31,'D',17,'D17','cheap',1),(10486,31,'D',18,'D18','cheap',0),(10487,31,'D',19,'D19','cheap',1),(10488,31,'D',20,'D20','cheap',1),(10489,31,'D',21,'D21','cheap',1),(10490,31,'D',22,'D22','cheap',1),(10491,31,'D',23,'D23','cheap',1),(10492,31,'D',24,'D24','cheap',1),(10493,31,'E',1,'E1','cheap',1),(10494,31,'E',2,'E2','cheap',1),(10495,31,'E',3,'E3','cheap',1),(10496,31,'E',4,'E4','cheap',1),(10497,31,'E',5,'E5','cheap',1),(10498,31,'E',6,'E6','cheap',1),(10499,31,'E',7,'E7','cheap',0),(10500,31,'E',8,'E8','cheap',1),(10501,31,'E',9,'E9','cheap',1),(10502,31,'E',10,'E10','cheap',1),(10503,31,'E',11,'E11','cheap',1),(10504,31,'E',12,'E12','cheap',1),(10505,31,'E',13,'E13','cheap',1),(10506,31,'E',14,'E14','cheap',1),(10507,31,'E',15,'E15','cheap',1),(10508,31,'E',16,'E16','cheap',1),(10509,31,'E',17,'E17','cheap',1),(10510,31,'E',18,'E18','cheap',0),(10511,31,'E',19,'E19','cheap',1),(10512,31,'E',20,'E20','cheap',1),(10513,31,'E',21,'E21','cheap',1),(10514,31,'E',22,'E22','cheap',1),(10515,31,'E',23,'E23','cheap',1),(10516,31,'E',24,'E24','cheap',1),(10517,31,'F',1,'F1','cheap',1),(10518,31,'F',2,'F2','cheap',1),(10519,31,'F',3,'F3','cheap',1),(10520,31,'F',4,'F4','cheap',1),(10521,31,'F',5,'F5','cheap',1),(10522,31,'F',6,'F6','cheap',1),(10523,31,'F',7,'F7','cheap',0),(10524,31,'F',8,'F8','cheap',1),(10525,31,'F',9,'F9','cheap',1),(10526,31,'F',10,'F10','cheap',1),(10527,31,'F',11,'F11','cheap',1),(10528,31,'F',12,'F12','cheap',1),(10529,31,'F',13,'F13','cheap',1),(10530,31,'F',14,'F14','cheap',1),(10531,31,'F',15,'F15','cheap',1),(10532,31,'F',16,'F16','cheap',1),(10533,31,'F',17,'F17','cheap',1),(10534,31,'F',18,'F18','cheap',0),(10535,31,'F',19,'F19','cheap',1),(10536,31,'F',20,'F20','cheap',1),(10537,31,'F',21,'F21','cheap',1),(10538,31,'F',22,'F22','cheap',1),(10539,31,'F',23,'F23','cheap',1),(10540,31,'F',24,'F24','cheap',1),(10541,31,'G',1,'G1','cheap',1),(10542,31,'G',2,'G2','cheap',1),(10543,31,'G',3,'G3','cheap',1),(10544,31,'G',4,'G4','cheap',1),(10545,31,'G',5,'G5','cheap',1),(10546,31,'G',6,'G6','cheap',1),(10547,31,'G',7,'G7','cheap',0),(10548,31,'G',8,'G8','cheap',1),(10549,31,'G',9,'G9','cheap',1),(10550,31,'G',10,'G10','cheap',1),(10551,31,'G',11,'G11','cheap',1),(10552,31,'G',12,'G12','cheap',1),(10553,31,'G',13,'G13','cheap',1),(10554,31,'G',14,'G14','cheap',1),(10555,31,'G',15,'G15','cheap',1),(10556,31,'G',16,'G16','cheap',1),(10557,31,'G',17,'G17','cheap',1),(10558,31,'G',18,'G18','cheap',0),(10559,31,'G',19,'G19','cheap',1),(10560,31,'G',20,'G20','cheap',1),(10561,31,'G',21,'G21','cheap',1),(10562,31,'G',22,'G22','cheap',1),(10563,31,'G',23,'G23','cheap',1),(10564,31,'G',24,'G24','cheap',1),(10565,31,'H',1,'H1','cheap',1),(10566,31,'H',2,'H2','cheap',1),(10567,31,'H',3,'H3','cheap',1),(10568,31,'H',4,'H4','cheap',1),(10569,31,'H',5,'H5','cheap',1),(10570,31,'H',6,'H6','cheap',1),(10571,31,'H',7,'H7','cheap',0),(10572,31,'H',8,'H8','cheap',1),(10573,31,'H',9,'H9','cheap',1),(10574,31,'H',10,'H10','cheap',1),(10575,31,'H',11,'H11','cheap',1),(10576,31,'H',12,'H12','cheap',1),(10577,31,'H',13,'H13','cheap',1),(10578,31,'H',14,'H14','cheap',1),(10579,31,'H',15,'H15','cheap',1),(10580,31,'H',16,'H16','cheap',1),(10581,31,'H',17,'H17','cheap',1),(10582,31,'H',18,'H18','cheap',0),(10583,31,'H',19,'H19','cheap',1),(10584,31,'H',20,'H20','cheap',1),(10585,31,'H',21,'H21','cheap',1),(10586,31,'H',22,'H22','cheap',1),(10587,31,'H',23,'H23','cheap',1),(10588,31,'H',24,'H24','cheap',1),(10589,31,'I',1,'I1','middle',1),(10590,31,'I',2,'I2','middle',1),(10591,31,'I',3,'I3','middle',1),(10592,31,'I',4,'I4','middle',1),(10593,31,'I',5,'I5','middle',1),(10594,31,'I',6,'I6','middle',1),(10595,31,'I',7,'I7','middle',0),(10596,31,'I',8,'I8','middle',1),(10597,31,'I',9,'I9','middle',1),(10598,31,'I',10,'I10','middle',1),(10599,31,'I',11,'I11','middle',1),(10600,31,'I',12,'I12','middle',1),(10601,31,'I',13,'I13','middle',1),(10602,31,'I',14,'I14','middle',1),(10603,31,'I',15,'I15','middle',1),(10604,31,'I',16,'I16','middle',1),(10605,31,'I',17,'I17','middle',1),(10606,31,'I',18,'I18','middle',0),(10607,31,'I',19,'I19','middle',1),(10608,31,'I',20,'I20','middle',1),(10609,31,'I',21,'I21','middle',1),(10610,31,'I',22,'I22','middle',1),(10611,31,'I',23,'I23','middle',1),(10612,31,'I',24,'I24','middle',1),(10613,31,'J',1,'J1','middle',1),(10614,31,'J',2,'J2','middle',1),(10615,31,'J',3,'J3','middle',1),(10616,31,'J',4,'J4','middle',1),(10617,31,'J',5,'J5','middle',1),(10618,31,'J',6,'J6','middle',1),(10619,31,'J',7,'J7','middle',0),(10620,31,'J',8,'J8','middle',1),(10621,31,'J',9,'J9','middle',1),(10622,31,'J',10,'J10','middle',1),(10623,31,'J',11,'J11','middle',1),(10624,31,'J',12,'J12','middle',1),(10625,31,'J',13,'J13','middle',1),(10626,31,'J',14,'J14','middle',1),(10627,31,'J',15,'J15','middle',1),(10628,31,'J',16,'J16','middle',1),(10629,31,'J',17,'J17','middle',1),(10630,31,'J',18,'J18','middle',0),(10631,31,'J',19,'J19','middle',1),(10632,31,'J',20,'J20','middle',1),(10633,31,'J',21,'J21','middle',1),(10634,31,'J',22,'J22','middle',1),(10635,31,'J',23,'J23','middle',1),(10636,31,'J',24,'J24','middle',1),(10637,31,'K',1,'K1','middle',1),(10638,31,'K',2,'K2','middle',1),(10639,31,'K',3,'K3','middle',1),(10640,31,'K',4,'K4','middle',1),(10641,31,'K',5,'K5','middle',1),(10642,31,'K',6,'K6','middle',1),(10643,31,'K',7,'K7','middle',0),(10644,31,'K',8,'K8','middle',1),(10645,31,'K',9,'K9','middle',1),(10646,31,'K',10,'K10','middle',1),(10647,31,'K',11,'K11','middle',1),(10648,31,'K',12,'K12','middle',1),(10649,31,'K',13,'K13','middle',1),(10650,31,'K',14,'K14','middle',1),(10651,31,'K',15,'K15','middle',1),(10652,31,'K',16,'K16','middle',1),(10653,31,'K',17,'K17','middle',1),(10654,31,'K',18,'K18','middle',0),(10655,31,'K',19,'K19','middle',1),(10656,31,'K',20,'K20','middle',1),(10657,31,'K',21,'K21','middle',1),(10658,31,'K',22,'K22','middle',1),(10659,31,'K',23,'K23','middle',1),(10660,31,'K',24,'K24','middle',1),(10661,31,'L',1,'L1','middle',1),(10662,31,'L',2,'L2','middle',1),(10663,31,'L',3,'L3','middle',1),(10664,31,'L',4,'L4','middle',1),(10665,31,'L',5,'L5','middle',1),(10666,31,'L',6,'L6','middle',1),(10667,31,'L',7,'L7','middle',0),(10668,31,'L',8,'L8','middle',1),(10669,31,'L',9,'L9','middle',1),(10670,31,'L',10,'L10','middle',1),(10671,31,'L',11,'L11','middle',1),(10672,31,'L',12,'L12','middle',1),(10673,31,'L',13,'L13','middle',1),(10674,31,'L',14,'L14','middle',1),(10675,31,'L',15,'L15','middle',1),(10676,31,'L',16,'L16','middle',1),(10677,31,'L',17,'L17','middle',1),(10678,31,'L',18,'L18','middle',0),(10679,31,'L',19,'L19','middle',1),(10680,31,'L',20,'L20','middle',1),(10681,31,'L',21,'L21','middle',1),(10682,31,'L',22,'L22','middle',1),(10683,31,'L',23,'L23','middle',1),(10684,31,'L',24,'L24','middle',1),(10685,31,'M',1,'M1','middle',1),(10686,31,'M',2,'M2','middle',1),(10687,31,'M',3,'M3','middle',1),(10688,31,'M',4,'M4','middle',1),(10689,31,'M',5,'M5','middle',1),(10690,31,'M',6,'M6','middle',1),(10691,31,'M',7,'M7','middle',0),(10692,31,'M',8,'M8','expensive',1),(10693,31,'M',9,'M9','expensive',1),(10694,31,'M',10,'M10','expensive',1),(10695,31,'M',11,'M11','expensive',1),(10696,31,'M',12,'M12','expensive',1),(10697,31,'M',13,'M13','expensive',1),(10698,31,'M',14,'M14','expensive',1),(10699,31,'M',15,'M15','expensive',1),(10700,31,'M',16,'M16','expensive',1),(10701,31,'M',17,'M17','expensive',1),(10702,31,'M',18,'M18','middle',0),(10703,31,'M',19,'M19','middle',1),(10704,31,'M',20,'M20','middle',1),(10705,31,'M',21,'M21','middle',1),(10706,31,'M',22,'M22','middle',1),(10707,31,'M',23,'M23','middle',1),(10708,31,'M',24,'M24','middle',1),(10709,31,'N',1,'N1','middle',1),(10710,31,'N',2,'N2','middle',1),(10711,31,'N',3,'N3','middle',1),(10712,31,'N',4,'N4','middle',1),(10713,31,'N',5,'N5','middle',1),(10714,31,'N',6,'N6','middle',1),(10715,31,'N',7,'N7','middle',0),(10716,31,'N',8,'N8','expensive',1),(10717,31,'N',9,'N9','expensive',1),(10718,31,'N',10,'N10','expensive',1),(10719,31,'N',11,'N11','expensive',1),(10720,31,'N',12,'N12','expensive',1),(10721,31,'N',13,'N13','expensive',1),(10722,31,'N',14,'N14','expensive',1),(10723,31,'N',15,'N15','expensive',1),(10724,31,'N',16,'N16','expensive',1),(10725,31,'N',17,'N17','expensive',1),(10726,31,'N',18,'N18','middle',0),(10727,31,'N',19,'N19','middle',1),(10728,31,'N',20,'N20','middle',1),(10729,31,'N',21,'N21','middle',1),(10730,31,'N',22,'N22','middle',1),(10731,31,'N',23,'N23','middle',1),(10732,31,'N',24,'N24','middle',1),(10733,31,'O',1,'O1','middle',1),(10734,31,'O',2,'O2','middle',1),(10735,31,'O',3,'O3','middle',1),(10736,31,'O',4,'O4','middle',1),(10737,31,'O',5,'O5','middle',1),(10738,31,'O',6,'O6','middle',1),(10739,31,'O',7,'O7','middle',0),(10740,31,'O',8,'O8','expensive',1),(10741,31,'O',9,'O9','expensive',1),(10742,31,'O',10,'O10','expensive',1),(10743,31,'O',11,'O11','expensive',1),(10744,31,'O',12,'O12','expensive',1),(10745,31,'O',13,'O13','expensive',1),(10746,31,'O',14,'O14','expensive',1),(10747,31,'O',15,'O15','expensive',1),(10748,31,'O',16,'O16','expensive',1),(10749,31,'O',17,'O17','expensive',1),(10750,31,'O',18,'O18','middle',0),(10751,31,'O',19,'O19','middle',1),(10752,31,'O',20,'O20','middle',1),(10753,31,'O',21,'O21','middle',1),(10754,31,'O',22,'O22','middle',1),(10755,31,'O',23,'O23','middle',1),(10756,31,'O',24,'O24','middle',1),(10757,32,'A',1,'A1','cheap',1),(10758,32,'A',2,'A2','cheap',1),(10759,32,'A',3,'A3','cheap',1),(10760,32,'A',4,'A4','cheap',1),(10761,32,'A',5,'A5','cheap',0),(10762,32,'A',6,'A6','cheap',1),(10763,32,'A',7,'A7','cheap',1),(10764,32,'A',8,'A8','cheap',1),(10765,32,'A',9,'A9','cheap',1),(10766,32,'A',10,'A10','cheap',1),(10767,32,'A',11,'A11','cheap',1),(10768,32,'A',12,'A12','cheap',1),(10769,32,'A',13,'A13','cheap',1),(10770,32,'A',14,'A14','cheap',0),(10771,32,'A',15,'A15','cheap',1),(10772,32,'A',16,'A16','cheap',1),(10773,32,'A',17,'A17','cheap',1),(10774,32,'A',18,'A18','cheap',1),(10775,32,'B',1,'B1','cheap',1),(10776,32,'B',2,'B2','cheap',1),(10777,32,'B',3,'B3','cheap',1),(10778,32,'B',4,'B4','cheap',1),(10779,32,'B',5,'B5','cheap',0),(10780,32,'B',6,'B6','cheap',1),(10781,32,'B',7,'B7','cheap',1),(10782,32,'B',8,'B8','cheap',1),(10783,32,'B',9,'B9','cheap',1),(10784,32,'B',10,'B10','cheap',1),(10785,32,'B',11,'B11','cheap',1),(10786,32,'B',12,'B12','cheap',1),(10787,32,'B',13,'B13','cheap',1),(10788,32,'B',14,'B14','cheap',0),(10789,32,'B',15,'B15','cheap',1),(10790,32,'B',16,'B16','cheap',1),(10791,32,'B',17,'B17','cheap',1),(10792,32,'B',18,'B18','cheap',1),(10793,32,'C',1,'C1','cheap',1),(10794,32,'C',2,'C2','cheap',1),(10795,32,'C',3,'C3','cheap',1),(10796,32,'C',4,'C4','cheap',1),(10797,32,'C',5,'C5','cheap',0),(10798,32,'C',6,'C6','cheap',1),(10799,32,'C',7,'C7','cheap',1),(10800,32,'C',8,'C8','cheap',1),(10801,32,'C',9,'C9','cheap',1),(10802,32,'C',10,'C10','cheap',1),(10803,32,'C',11,'C11','cheap',1),(10804,32,'C',12,'C12','cheap',1),(10805,32,'C',13,'C13','cheap',1),(10806,32,'C',14,'C14','cheap',0),(10807,32,'C',15,'C15','cheap',1),(10808,32,'C',16,'C16','cheap',1),(10809,32,'C',17,'C17','cheap',1),(10810,32,'C',18,'C18','cheap',1),(10811,32,'D',1,'D1','cheap',1),(10812,32,'D',2,'D2','cheap',1),(10813,32,'D',3,'D3','cheap',1),(10814,32,'D',4,'D4','cheap',1),(10815,32,'D',5,'D5','cheap',0),(10816,32,'D',6,'D6','cheap',1),(10817,32,'D',7,'D7','cheap',1),(10818,32,'D',8,'D8','cheap',1),(10819,32,'D',9,'D9','cheap',1),(10820,32,'D',10,'D10','cheap',1),(10821,32,'D',11,'D11','cheap',1),(10822,32,'D',12,'D12','cheap',1),(10823,32,'D',13,'D13','cheap',1),(10824,32,'D',14,'D14','cheap',0),(10825,32,'D',15,'D15','cheap',1),(10826,32,'D',16,'D16','cheap',1),(10827,32,'D',17,'D17','cheap',1),(10828,32,'D',18,'D18','cheap',1),(10829,32,'E',1,'E1','cheap',1),(10830,32,'E',2,'E2','cheap',1),(10831,32,'E',3,'E3','cheap',1),(10832,32,'E',4,'E4','cheap',1),(10833,32,'E',5,'E5','cheap',0),(10834,32,'E',6,'E6','cheap',1),(10835,32,'E',7,'E7','cheap',1),(10836,32,'E',8,'E8','cheap',1),(10837,32,'E',9,'E9','cheap',1),(10838,32,'E',10,'E10','cheap',1),(10839,32,'E',11,'E11','cheap',1),(10840,32,'E',12,'E12','cheap',1),(10841,32,'E',13,'E13','cheap',1),(10842,32,'E',14,'E14','cheap',0),(10843,32,'E',15,'E15','cheap',1),(10844,32,'E',16,'E16','cheap',1),(10845,32,'E',17,'E17','cheap',1),(10846,32,'E',18,'E18','cheap',1),(10847,32,'F',1,'F1','cheap',1),(10848,32,'F',2,'F2','cheap',1),(10849,32,'F',3,'F3','cheap',1),(10850,32,'F',4,'F4','cheap',1),(10851,32,'F',5,'F5','cheap',0),(10852,32,'F',6,'F6','cheap',1),(10853,32,'F',7,'F7','cheap',1),(10854,32,'F',8,'F8','cheap',1),(10855,32,'F',9,'F9','cheap',1),(10856,32,'F',10,'F10','cheap',1),(10857,32,'F',11,'F11','cheap',1),(10858,32,'F',12,'F12','cheap',1),(10859,32,'F',13,'F13','cheap',1),(10860,32,'F',14,'F14','cheap',0),(10861,32,'F',15,'F15','cheap',1),(10862,32,'F',16,'F16','cheap',1),(10863,32,'F',17,'F17','cheap',1),(10864,32,'F',18,'F18','cheap',1),(10865,32,'G',1,'G1','middle',1),(10866,32,'G',2,'G2','middle',1),(10867,32,'G',3,'G3','middle',1),(10868,32,'G',4,'G4','middle',1),(10869,32,'G',5,'G5','middle',0),(10870,32,'G',6,'G6','middle',1),(10871,32,'G',7,'G7','middle',1),(10872,32,'G',8,'G8','middle',1),(10873,32,'G',9,'G9','middle',1),(10874,32,'G',10,'G10','middle',1),(10875,32,'G',11,'G11','middle',1),(10876,32,'G',12,'G12','middle',1),(10877,32,'G',13,'G13','middle',1),(10878,32,'G',14,'G14','middle',0),(10879,32,'G',15,'G15','middle',1),(10880,32,'G',16,'G16','middle',1),(10881,32,'G',17,'G17','middle',1),(10882,32,'G',18,'G18','middle',1),(10883,32,'H',1,'H1','middle',1),(10884,32,'H',2,'H2','middle',1),(10885,32,'H',3,'H3','middle',1),(10886,32,'H',4,'H4','middle',1),(10887,32,'H',5,'H5','middle',0),(10888,32,'H',6,'H6','middle',1),(10889,32,'H',7,'H7','middle',1),(10890,32,'H',8,'H8','middle',1),(10891,32,'H',9,'H9','middle',1),(10892,32,'H',10,'H10','middle',1),(10893,32,'H',11,'H11','middle',1),(10894,32,'H',12,'H12','middle',1),(10895,32,'H',13,'H13','middle',1),(10896,32,'H',14,'H14','middle',0),(10897,32,'H',15,'H15','middle',1),(10898,32,'H',16,'H16','middle',1),(10899,32,'H',17,'H17','middle',1),(10900,32,'H',18,'H18','middle',1),(10901,32,'I',1,'I1','middle',1),(10902,32,'I',2,'I2','middle',1),(10903,32,'I',3,'I3','middle',1),(10904,32,'I',4,'I4','middle',1),(10905,32,'I',5,'I5','middle',0),(10906,32,'I',6,'I6','middle',1),(10907,32,'I',7,'I7','middle',1),(10908,32,'I',8,'I8','middle',1),(10909,32,'I',9,'I9','middle',1),(10910,32,'I',10,'I10','middle',1),(10911,32,'I',11,'I11','middle',1),(10912,32,'I',12,'I12','middle',1),(10913,32,'I',13,'I13','middle',1),(10914,32,'I',14,'I14','middle',0),(10915,32,'I',15,'I15','middle',1),(10916,32,'I',16,'I16','middle',1),(10917,32,'I',17,'I17','middle',1),(10918,32,'I',18,'I18','middle',1),(10919,32,'J',1,'J1','middle',1),(10920,32,'J',2,'J2','middle',1),(10921,32,'J',3,'J3','middle',1),(10922,32,'J',4,'J4','middle',1),(10923,32,'J',5,'J5','middle',0),(10924,32,'J',6,'J6','expensive',1),(10925,32,'J',7,'J7','expensive',1),(10926,32,'J',8,'J8','expensive',1),(10927,32,'J',9,'J9','expensive',1),(10928,32,'J',10,'J10','expensive',1),(10929,32,'J',11,'J11','expensive',1),(10930,32,'J',12,'J12','expensive',1),(10931,32,'J',13,'J13','expensive',1),(10932,32,'J',14,'J14','middle',0),(10933,32,'J',15,'J15','middle',1),(10934,32,'J',16,'J16','middle',1),(10935,32,'J',17,'J17','middle',1),(10936,32,'J',18,'J18','middle',1),(10937,32,'K',1,'K1','middle',1),(10938,32,'K',2,'K2','middle',1),(10939,32,'K',3,'K3','middle',1),(10940,32,'K',4,'K4','middle',1),(10941,32,'K',5,'K5','middle',0),(10942,32,'K',6,'K6','expensive',1),(10943,32,'K',7,'K7','expensive',1),(10944,32,'K',8,'K8','expensive',1),(10945,32,'K',9,'K9','expensive',1),(10946,32,'K',10,'K10','expensive',1),(10947,32,'K',11,'K11','expensive',1),(10948,32,'K',12,'K12','expensive',1),(10949,32,'K',13,'K13','expensive',1),(10950,32,'K',14,'K14','middle',0),(10951,32,'K',15,'K15','middle',1),(10952,32,'K',16,'K16','middle',1),(10953,32,'K',17,'K17','middle',1),(10954,32,'K',18,'K18','middle',1),(10955,32,'L',1,'L1','middle',1),(10956,32,'L',2,'L2','middle',1),(10957,32,'L',3,'L3','middle',1),(10958,32,'L',4,'L4','middle',1),(10959,32,'L',5,'L5','middle',0),(10960,32,'L',6,'L6','expensive',1),(10961,32,'L',7,'L7','expensive',1),(10962,32,'L',8,'L8','expensive',1),(10963,32,'L',9,'L9','expensive',1),(10964,32,'L',10,'L10','expensive',1),(10965,32,'L',11,'L11','expensive',1),(10966,32,'L',12,'L12','expensive',1),(10967,32,'L',13,'L13','expensive',1),(10968,32,'L',14,'L14','middle',0),(10969,32,'L',15,'L15','middle',1),(10970,32,'L',16,'L16','middle',1),(10971,32,'L',17,'L17','middle',1),(10972,32,'L',18,'L18','middle',1),(11968,19,'A',1,'A1','cheap',1),(11969,19,'A',2,'A2','cheap',1),(11970,19,'A',3,'A3','cheap',1),(11971,19,'A',4,'A4','cheap',1),(11972,19,'A',5,'A5','cheap',1),(11973,19,'A',6,'A6','cheap',1),(11974,19,'A',7,'A7','cheap',1),(11975,19,'A',8,'A8','cheap',1),(11976,19,'A',9,'A9','cheap',1),(11977,19,'A',10,'A10','cheap',1),(11978,19,'B',1,'B1','cheap',1),(11979,19,'B',2,'B2','cheap',1),(11980,19,'B',3,'B3','cheap',1),(11981,19,'B',4,'B4','cheap',1),(11982,19,'B',5,'B5','cheap',1),(11983,19,'B',6,'B6','cheap',1),(11984,19,'B',7,'B7','cheap',1),(11985,19,'B',8,'B8','cheap',1),(11986,19,'B',9,'B9','cheap',1),(11987,19,'B',10,'B10','cheap',1),(11988,19,'C',1,'C1','cheap',1),(11989,19,'C',2,'C2','cheap',1),(11990,19,'C',3,'C3','cheap',1),(11991,19,'C',4,'C4','cheap',1),(11992,19,'C',5,'C5','cheap',1),(11993,19,'C',6,'C6','cheap',1),(11994,19,'C',7,'C7','cheap',1),(11995,19,'C',8,'C8','cheap',1),(11996,19,'C',9,'C9','cheap',1),(11997,19,'C',10,'C10','cheap',1),(11998,19,'D',1,'D1','expensive',1),(11999,19,'D',2,'D2','expensive',1),(12000,19,'D',3,'D3','expensive',1),(12001,19,'D',4,'D4','expensive',1),(12002,19,'D',5,'D5','expensive',1),(12003,19,'D',6,'D6','expensive',1),(12004,19,'D',7,'D7','expensive',1),(12005,19,'D',8,'D8','expensive',1),(12006,19,'D',9,'D9','expensive',1),(12007,19,'D',10,'D10','expensive',1),(12008,19,'E',1,'E1','expensive',1),(12009,19,'E',2,'E2','expensive',1),(12010,19,'E',3,'E3','expensive',1),(12011,19,'E',4,'E4','expensive',1),(12012,19,'E',5,'E5','expensive',1),(12013,19,'E',6,'E6','expensive',1),(12014,19,'E',7,'E7','expensive',1),(12015,19,'E',8,'E8','expensive',1),(12016,19,'E',9,'E9','expensive',1),(12017,19,'E',10,'E10','expensive',1),(12018,19,'F',1,'F1','cheap',1),(12019,19,'F',2,'F2','cheap',1),(12020,19,'F',3,'F3','cheap',1),(12021,19,'F',4,'F4','cheap',1),(12022,19,'F',5,'F5','cheap',1),(12023,19,'F',6,'F6','cheap',1),(12024,19,'F',7,'F7','cheap',1),(12025,19,'F',8,'F8','cheap',1),(12026,19,'F',9,'F9','cheap',1),(12027,19,'F',10,'F10','cheap',1),(12028,19,'G',1,'G1','cheap',1),(12029,19,'G',2,'G2','cheap',1),(12030,19,'G',3,'G3','cheap',1),(12031,19,'G',4,'G4','cheap',1),(12032,19,'G',5,'G5','cheap',1),(12033,19,'G',6,'G6','cheap',1),(12034,19,'G',7,'G7','cheap',1),(12035,19,'G',8,'G8','cheap',1),(12036,19,'G',9,'G9','cheap',1),(12037,19,'G',10,'G10','cheap',1),(12038,19,'H',1,'H1','cheap',1),(12039,19,'H',2,'H2','cheap',1),(12040,19,'H',3,'H3','cheap',1),(12041,19,'H',4,'H4','cheap',1),(12042,19,'H',5,'H5','cheap',1),(12043,19,'H',6,'H6','cheap',1),(12044,19,'H',7,'H7','cheap',1),(12045,19,'H',8,'H8','cheap',1),(12046,19,'H',9,'H9','cheap',1),(12047,19,'H',10,'H10','cheap',1),(12048,19,'I',1,'I1','cheap',1),(12049,19,'I',2,'I2','cheap',1),(12050,19,'I',3,'I3','cheap',1),(12051,19,'I',4,'I4','cheap',1),(12052,19,'I',5,'I5','cheap',1),(12053,19,'I',6,'I6','cheap',1),(12054,19,'I',7,'I7','cheap',1),(12055,19,'I',8,'I8','cheap',1),(12056,19,'I',9,'I9','cheap',1),(12057,19,'I',10,'I10','cheap',1),(12058,20,'A',1,'A1','cheap',1),(12059,20,'A',2,'A2','cheap',1),(12060,20,'A',3,'A3','cheap',1),(12061,20,'A',4,'A4','cheap',1),(12062,20,'A',5,'A5','cheap',1),(12063,20,'A',6,'A6','cheap',1),(12064,20,'A',7,'A7','cheap',1),(12065,20,'A',8,'A8','cheap',1),(12066,20,'A',9,'A9','cheap',1),(12067,20,'A',10,'A10','cheap',1),(12068,20,'B',1,'B1','cheap',1),(12069,20,'B',2,'B2','cheap',1),(12070,20,'B',3,'B3','cheap',1),(12071,20,'B',4,'B4','cheap',1),(12072,20,'B',5,'B5','cheap',1),(12073,20,'B',6,'B6','cheap',1),(12074,20,'B',7,'B7','cheap',1),(12075,20,'B',8,'B8','cheap',1),(12076,20,'B',9,'B9','cheap',1),(12077,20,'B',10,'B10','cheap',1),(12078,20,'C',1,'C1','cheap',1),(12079,20,'C',2,'C2','cheap',1),(12080,20,'C',3,'C3','cheap',1),(12081,20,'C',4,'C4','cheap',1),(12082,20,'C',5,'C5','cheap',1),(12083,20,'C',6,'C6','cheap',1),(12084,20,'C',7,'C7','cheap',1),(12085,20,'C',8,'C8','cheap',1),(12086,20,'C',9,'C9','cheap',1),(12087,20,'C',10,'C10','cheap',1),(12088,20,'D',1,'D1','expensive',1),(12089,20,'D',2,'D2','expensive',1),(12090,20,'D',3,'D3','expensive',1),(12091,20,'D',4,'D4','expensive',1),(12092,20,'D',5,'D5','expensive',1),(12093,20,'D',6,'D6','expensive',1),(12094,20,'D',7,'D7','expensive',1),(12095,20,'D',8,'D8','expensive',1),(12096,20,'D',9,'D9','expensive',1),(12097,20,'D',10,'D10','expensive',1),(12098,20,'E',1,'E1','expensive',1),(12099,20,'E',2,'E2','expensive',1),(12100,20,'E',3,'E3','expensive',1),(12101,20,'E',4,'E4','expensive',1),(12102,20,'E',5,'E5','expensive',1),(12103,20,'E',6,'E6','expensive',1),(12104,20,'E',7,'E7','expensive',1),(12105,20,'E',8,'E8','expensive',1),(12106,20,'E',9,'E9','expensive',1),(12107,20,'E',10,'E10','expensive',1),(12108,20,'F',1,'F1','cheap',1),(12109,20,'F',2,'F2','cheap',1),(12110,20,'F',3,'F3','cheap',1),(12111,20,'F',4,'F4','cheap',1),(12112,20,'F',5,'F5','cheap',1),(12113,20,'F',6,'F6','cheap',1),(12114,20,'F',7,'F7','cheap',1),(12115,20,'F',8,'F8','cheap',1),(12116,20,'F',9,'F9','cheap',1),(12117,20,'F',10,'F10','cheap',1),(12118,20,'G',1,'G1','cheap',1),(12119,20,'G',2,'G2','cheap',1),(12120,20,'G',3,'G3','cheap',1),(12121,20,'G',4,'G4','cheap',1),(12122,20,'G',5,'G5','cheap',1),(12123,20,'G',6,'G6','cheap',1),(12124,20,'G',7,'G7','cheap',1),(12125,20,'G',8,'G8','cheap',1),(12126,20,'G',9,'G9','cheap',1),(12127,20,'G',10,'G10','cheap',1),(12128,20,'H',1,'H1','cheap',1),(12129,20,'H',2,'H2','cheap',1),(12130,20,'H',3,'H3','cheap',1),(12131,20,'H',4,'H4','cheap',1),(12132,20,'H',5,'H5','cheap',1),(12133,20,'H',6,'H6','cheap',1),(12134,20,'H',7,'H7','cheap',1),(12135,20,'H',8,'H8','cheap',1),(12136,20,'H',9,'H9','cheap',1),(12137,20,'H',10,'H10','cheap',1);
/*!40000 ALTER TABLE `phong_ghe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phongchieu`
--

DROP TABLE IF EXISTS `phongchieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phongchieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_rap` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `so_ghe` int(11) DEFAULT 0,
  `loai_phong` enum('2D','3D','4DX','IMAX') DEFAULT '2D',
  `dien_tich` decimal(10,2) DEFAULT 0.00,
  `gia_thuong` decimal(10,2) DEFAULT 50000.00 COMMENT 'Giá vé ghế thường',
  `gia_trung` decimal(10,2) DEFAULT 70000.00 COMMENT 'Giá vé ghế trung',
  `gia_vip` decimal(10,2) DEFAULT 100000.00 COMMENT 'Giá vé ghế VIP',
  PRIMARY KEY (`id`),
  KEY `id_rap` (`id_rap`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phongchieu`
--

LOCK TABLES `phongchieu` WRITE;
/*!40000 ALTER TABLE `phongchieu` DISABLE KEYS */;
INSERT INTO `phongchieu` VALUES (1,1,'P101',192,'2D',100.00,60000.00,80000.00,200000.00),(2,1,'P102',64,'2D',0.00,50000.00,70000.00,100000.00),(16,2,'P101',100,'2D',100.00,50000.00,70000.00,100000.00),(17,2,'P102',192,'2D',0.00,50000.00,70000.00,100000.00),(18,2,'P103',204,'3D',0.00,50000.00,70000.00,100000.00),(19,3,'P201',90,'2D',0.00,50000.00,70000.00,100000.00),(20,3,'P202',80,'3D',0.00,50000.00,70000.00,100000.00),(27,1,'P103',204,'2D',0.00,50000.00,70000.00,100000.00),(28,1,'P104(VIP)',120,'2D',150.00,60000.00,70000.00,100000.00),(29,2,'Phòng VIP',120,'2D',150.00,50000.00,70000.00,100000.00),(30,1,'P105(VIP)',120,'2D',200.00,50000.00,70000.00,100000.00);
/*!40000 ALTER TABLE `phongchieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quy_tac_tich_diem`
--

DROP TABLE IF EXISTS `quy_tac_tich_diem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quy_tac_tich_diem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_quy_tac` varchar(255) NOT NULL,
  `loai` enum('dat_ve','combo','thuong','su_kien','sinh_nhat') NOT NULL,
  `ti_le_quy_doi` decimal(5,2) NOT NULL COMMENT 'VD: 0.01 = 1 điểm/100đ, 0.02 = 1 điểm/50đ',
  `diem_co_dinh` int(11) DEFAULT NULL COMMENT 'Điểm cố định (không tính theo tiền)',
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `trang_thai` tinyint(4) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_type_status` (`loai`,`trang_thai`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quy_tac_tich_diem`
--

LOCK TABLES `quy_tac_tich_diem` WRITE;
/*!40000 ALTER TABLE `quy_tac_tich_diem` DISABLE KEYS */;
INSERT INTO `quy_tac_tich_diem` VALUES (1,'Tích điểm đặt vé cơ bản','dat_ve',0.00,NULL,'2024-01-01',NULL,1,'2025-10-26 08:56:47'),(2,'Tích điểm mua combo','combo',0.00,NULL,'2024-01-01',NULL,1,'2025-10-26 08:56:47'),(3,'Thưởng đăng ký mới','thuong',0.00,50,'2024-01-01',NULL,1,'2025-10-26 08:56:47'),(4,'Thưởng sinh nhật','sinh_nhat',0.00,100,'2024-01-01',NULL,1,'2025-10-26 08:56:47');
/*!40000 ALTER TABLE `quy_tac_tich_diem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rap_chieu`
--

DROP TABLE IF EXISTS `rap_chieu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rap_chieu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_rap` varchar(255) NOT NULL,
  `dia_chi` text NOT NULL,
  `so_dien_thoai` varchar(15) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `mo_ta` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `id_cum` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rap_chieu`
--

LOCK TABLES `rap_chieu` WRITE;
/*!40000 ALTER TABLE `rap_chieu` DISABLE KEYS */;
INSERT INTO `rap_chieu` VALUES (1,'Galaxy Studio Quận 1','123 Nguyễn Huệ, Quận 1, TP.HCM','028 1234 567','quan1@galaxy.com',1,'2025-08-15 14:43:33','Rạp chiếu phim cao cấp tại trung tâm Quận 1',NULL,0),(2,'Galaxy Studio Quận 7','456 Nguyễn Thị Thập, Quận 7, TP.HCM','028 8765 4321','quan7@galaxy.com',1,'2025-08-15 14:43:33','Rạp chiếu phim hiện đại tại Quận 7',NULL,NULL),(3,'Galaxy Studio Quận 2','789 Mai Chí Thọ, Quận 2, TP.HCM','028 9876 5432','quan2@galaxy.com',1,'2025-08-15 14:43:33','Rạp chiếu phim sang trọng tại Thủ Đức',NULL,NULL);
/*!40000 ALTER TABLE `rap_chieu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taikhoan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `dia_chi` varchar(255) NOT NULL,
  `vai_tro` int(1) NOT NULL,
  `id_rap` int(11) DEFAULT NULL,
  `img` varchar(255) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `luong_co_ban` decimal(12,2) DEFAULT 30000.00 COMMENT 'Đơn giá/giờ (VND)',
  `phu_cap_co_dinh` decimal(12,2) DEFAULT 0.00 COMMENT 'Phụ cấp cố định mỗi tháng',
  `he_so_luong` decimal(4,2) DEFAULT 1.00 COMMENT 'Hệ số nhân lương',
  `diem_tich_luy` int(11) DEFAULT 0 COMMENT 'Số điểm hiện có',
  `id_diem` int(11) DEFAULT 0 COMMENT 'Điểm hiện có',
  `tong_diem_tich_luy` int(11) DEFAULT 0 COMMENT 'Tổng điểm đã tích lũy (không trừ)',
  `hang_thanh_vien` enum('dong','bac','vang','kim_cuong') DEFAULT 'dong' COMMENT 'Hạng thành viên',
  `ngay_cap_nhat_diem` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `face_template` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`face_template`)),
  `face_registered_at` datetime DEFAULT NULL,
  `id_loai_luong` int(11) DEFAULT NULL,
  `bhxh_dong` decimal(12,2) DEFAULT 0.00 COMMENT 'BHXH ng??i lao ??ng ??ng',
  `ngay_bat_dau_lam` date DEFAULT NULL COMMENT 'Ng?y b?t ??u l?m vi?c',
  `trang_thai_lam_viec` enum('dang_lam','nghi_phep','nghi_viec') DEFAULT 'dang_lam',
  `id_cum` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taikhoan`
--

LOCK TABLES `taikhoan` WRITE;
/*!40000 ALTER TABLE `taikhoan` DISABLE KEYS */;
INSERT INTO `taikhoan` VALUES (10,'Quản lý Quận 1','quanly_rap1','$2b$10$Uf/ncv5AktHJz6RhYQ4EnOrOb041FrCpNEtXB84N6jbe669xurrLO','ptk@gmail.com','0384104942','Phu Yen',3,1,'','2025-08-15 14:48:18',30000.00,0.00,1.00,0,0,0,'dong','2026-04-07 23:02:04',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(17,'Phan Thiên Khải','phanthienkhai','$2b$10$P.wl7dQwghFVLEf1UBdRY.BnZ0kidNu.VakIg5YShT12q6mZAdpZy','phanthienkhai111@gmail.com','0384104942','Gò Vấp',0,NULL,'','2025-08-15 14:48:18',30000.00,0.00,1.00,2160,0,3160,'bac','2026-04-07 18:58:18',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(19,'Quản lý cụm rạp','quanly_cum','$2b$10$tzozIwl987HlmAsrnH.roeK4FNc4ERxr4CmzQaOmmGaKuCk2icSz2','quanly@galaxy.com','0987654321','TP.HCM',4,NULL,'','2025-08-17 10:00:00',30000.00,0.00,1.00,0,0,0,'dong','2026-04-07 18:58:18',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(30,'Cao Lan Anh','CaoLanAnh_Rap1','$2b$10$/XSt4akS5Op5feGu/IL7QeamGKdhlBrWcm83/othoTmU5uvOcY/mG','caolananhn@gmail.com','0999999999','Gò Vấp',1,1,'','2025-09-04 06:42:22',30000.00,500000.00,1.00,0,0,0,'dong','2026-04-07 18:58:18','[65,68,70,70,67,63,66,70,74,73,70,65,66,72,65,40,71,66,66,71,54,31,63,65,64,69,61,38,63,62,60,61,43,28,38,55]','2025-12-04 13:37:37',NULL,0.00,NULL,'dang_lam',NULL),(31,'Quản lý Quận 7','quanly_rap2','$2b$10$/5DYdtrO7D3yF4vvb66IlucBOO7gjjVdoA5BV/jaSNEW.sW.qdaXe','khoi@gmail.com','0999999999','Quận 7',3,2,'','2025-09-04 08:30:05',30000.00,0.00,1.00,0,0,0,'dong','2026-04-07 23:01:48',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(33,'ADMIN HỆ THỐNG','admin_hethong','$2b$10$ID8zH6YHSLTG39dyRhdzU.efyQLarMC7nN85HlLmPr6oUpkPeGKoK','khoi@gmail.com','0999999999','Gò Vấp',2,NULL,'','2025-09-18 05:57:32',30000.00,0.00,1.00,0,0,0,'dong','2026-04-07 18:58:18',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(34,'Phan Thiên Khải','Phanthienkhai_rap1','$2b$10$5Nv1KsVEj0paO9cOQ0ewauiv1xsojkQPvD7bsGFV6fkCL9QQLQd1S','phanthienkhai2901@gmail.com','0999999999','Gò Vấp',1,1,'','2025-09-18 08:11:05',30000.00,500000.00,1.00,0,0,0,'dong','2026-04-07 18:58:18','[27,26,28,28,29,67,26,21,24,25,28,65,25,20,27,15,35,70,22,30,45,35,52,69,21,30,47,45,55,59,16,11,27,21,15,33]','2025-12-02 00:06:45',NULL,0.00,NULL,'dang_lam',NULL),(35,'Phúc Hưng','Phuchung_rap2','$2b$10$odskBfNaJEdXo8bKl9wRwutYsBQzs7LxWd.p6DRsHx8npB/i9Sei.','phanthienkhai111@gmail.com','0999999999','Gò Vấp',1,2,'','2025-09-22 05:30:54',30000.00,500000.00,1.00,0,0,0,'dong','2026-04-07 18:58:19','[64,67,70,69,67,62,65,70,73,72,69,64,66,71,54,22,66,65,64,70,51,34,56,62,63,67,57,36,57,58,58,49,26,25,27,42]','2025-12-04 13:52:58',NULL,0.00,NULL,'dang_lam',NULL),(37,'Lê Công Minh','lecongminh_rap1','$2b$10$4Ud2SwPHUC3Rb2CP7ofH6u6KktkF0Bc3sSrXsNq6w14beH5zGo8MW','khoi@gmail.com','0999999999','Gò Vấp',1,1,'','2025-10-01 05:42:13',30000.00,500000.00,1.00,0,0,0,'dong','2026-04-07 18:58:19',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(48,'Nguyễn Hoàng Mỹ','hoangmy','$2b$10$LnRSei2UzoCk0TkwVJveq.SI8U6DKcGbjOIT4EZIhKGVn9JJBXePK','nguyenhoangmy7772004@gmail.com','0976025124','12 Nguyễn Văn Bảo',0,NULL,'','2026-04-07 14:56:24',30000.00,0.00,1.00,2226,2226,2226,'bac','2026-05-04 20:36:54',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(49,'Quản lý Quận 2','quanly_rap3','123456','quanlyrap@gmail.com','01234567','Quận 2',3,3,'','2026-04-07 16:03:13',30000.00,0.00,1.00,0,0,0,'dong','2026-04-07 23:03:13',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL),(50,'Nguyễn Hoàng Mỹ','nhanvien_rap1','$2a$10$Zbo9xgu5tcP6gk6YL6b.aucUJSQSs.W8rtjllIVJhIWpydT6INcqq','hoangmy@gmail.com','012345678','Hồ Chi Minh',1,1,'','2026-04-08 00:42:33',30000.00,0.00,1.00,0,0,0,'dong','2026-05-04 20:40:30',NULL,NULL,NULL,0.00,NULL,'dang_lam',NULL);
/*!40000 ALTER TABLE `taikhoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thanh_toan`
--

DROP TABLE IF EXISTS `thanh_toan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thanh_toan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_hoa_don` int(11) NOT NULL,
  `phuong_thuc` enum('momo','vnpay','zalopay','bank_transfer','qr_code','cash') NOT NULL,
  `ma_giao_dich` varchar(255) DEFAULT NULL,
  `so_tien` decimal(10,2) NOT NULL,
  `trang_thai` enum('pending','success','failed','cancelled') DEFAULT 'pending',
  `thong_tin_thanh_toan` text DEFAULT NULL,
  `ngay_thanh_toan` datetime DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_hoa_don` (`id_hoa_don`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thanh_toan`
--

LOCK TABLES `thanh_toan` WRITE;
/*!40000 ALTER TABLE `thanh_toan` DISABLE KEYS */;
/*!40000 ALTER TABLE `thanh_toan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thiet_bi_phong`
--

DROP TABLE IF EXISTS `thiet_bi_phong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thiet_bi_phong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phong` int(11) NOT NULL,
  `ten_thiet_bi` varchar(100) NOT NULL,
  `so_luong` int(11) DEFAULT 1,
  `tinh_trang` enum('tot','can_bao_tri','hong') DEFAULT 'tot',
  `ghi_chu` varchar(255) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_phong` (`id_phong`),
  CONSTRAINT `tbp_ibfk_1` FOREIGN KEY (`id_phong`) REFERENCES `phongchieu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thiet_bi_phong`
--

LOCK TABLES `thiet_bi_phong` WRITE;
/*!40000 ALTER TABLE `thiet_bi_phong` DISABLE KEYS */;
INSERT INTO `thiet_bi_phong` VALUES (1,16,'Máy chiếu',1,'tot','','2025-09-22 08:29:46'),(2,1,'Ghế',120,'tot','Ghế ngồi xem phim','2025-11-26 03:43:09'),(3,1,'Máy chiếu',1,'can_bao_tri','Cần sửa chữa','2025-11-26 04:42:08'),(4,2,'Ghế',200,'tot','Tốt lắm','2025-11-26 06:02:57');
/*!40000 ALTER TABLE `thiet_bi_phong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thong_tin_website`
--

DROP TABLE IF EXISTS `thong_tin_website`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thong_tin_website` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ten_website` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `video_banner` varchar(255) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thong_tin_website`
--

LOCK TABLES `thong_tin_website` WRITE;
/*!40000 ALTER TABLE `thong_tin_website` DISABLE KEYS */;
INSERT INTO `thong_tin_website` VALUES (1,'Galaxy Cinema','Galaxy_Studio_2003_(Wordmark)_(Grey).webp','OFFICIAL TRAILER.mp4','123 Nguyễn Huệ, Quận 1, TP.HCM','028 1234 5678','info@galaxy.com','Hệ thống rạp chiếu phim Galaxy - Trải nghiệm điện ảnh tuyệt vời','https://facebook.com/galaxycinema','https://instagram.com/galaxycinema','https://youtube.com/galaxycinema','2025-12-01 12:47:31');
/*!40000 ALTER TABLE `thong_tin_website` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thuong_khen_thuong`
--

DROP TABLE IF EXISTS `thuong_khen_thuong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `thuong_khen_thuong` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_nv` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `thang` varchar(7) NOT NULL COMMENT 'Th?ng ?p d?ng',
  `loai_thuong` varchar(100) NOT NULL COMMENT 'V? d?: Th??ng qu?, Th??ng n?m, Khen th??ng...',
  `so_tien` decimal(12,2) NOT NULL,
  `ly_do` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','duyet','da_thanh_toan') DEFAULT 'cho_duyet',
  `ngay_duyet` datetime DEFAULT NULL,
  `id_user_duyet` int(11) DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_nv` (`id_nv`),
  KEY `id_rap` (`id_rap`),
  KEY `id_user_duyet` (`id_user_duyet`),
  CONSTRAINT `thuong_khen_thuong_ibfk_1` FOREIGN KEY (`id_nv`) REFERENCES `taikhoan` (`id`) ON DELETE CASCADE,
  CONSTRAINT `thuong_khen_thuong_ibfk_2` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE CASCADE,
  CONSTRAINT `thuong_khen_thuong_ibfk_3` FOREIGN KEY (`id_user_duyet`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thuong_khen_thuong`
--

LOCK TABLES `thuong_khen_thuong` WRITE;
/*!40000 ALTER TABLE `thuong_khen_thuong` DISABLE KEYS */;
/*!40000 ALTER TABLE `thuong_khen_thuong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tintuc`
--

DROP TABLE IF EXISTS `tintuc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tintuc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tieu_de` varchar(255) NOT NULL,
  `tom_tat` text DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `ngay_dang` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tintuc`
--

LOCK TABLES `tintuc` WRITE;
/*!40000 ALTER TABLE `tintuc` DISABLE KEYS */;
/*!40000 ALTER TABLE `tintuc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tong_hop_luong_thang`
--

DROP TABLE IF EXISTS `tong_hop_luong_thang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tong_hop_luong_thang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_rap` int(11) NOT NULL,
  `thang` varchar(7) NOT NULL COMMENT 'YYYY-MM',
  `so_nv` int(11) DEFAULT NULL COMMENT 'S? nh?n vi?n',
  `tong_gio_cong` decimal(15,2) DEFAULT NULL,
  `tong_luong_co_ban` decimal(15,2) DEFAULT NULL,
  `tong_phu_cap` decimal(15,2) DEFAULT NULL,
  `tong_khau_tru` decimal(15,2) DEFAULT NULL,
  `tong_thuong` decimal(15,2) DEFAULT NULL,
  `tong_thuc_lanh` decimal(15,2) DEFAULT NULL,
  `trang_thai` enum('dang_tinh','dang_duyet','da_duyet','da_thanh_toan') DEFAULT 'dang_tinh',
  `ngay_tao` datetime DEFAULT current_timestamp(),
  `ngay_cap_nhat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `thang_rap` (`thang`,`id_rap`),
  KEY `id_rap` (`id_rap`),
  CONSTRAINT `tong_hop_luong_thang_ibfk_1` FOREIGN KEY (`id_rap`) REFERENCES `rap_chieu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tong_hop_luong_thang`
--

LOCK TABLES `tong_hop_luong_thang` WRITE;
/*!40000 ALTER TABLE `tong_hop_luong_thang` DISABLE KEYS */;
/*!40000 ALTER TABLE `tong_hop_luong_thang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tra_loi_binhluan`
--

DROP TABLE IF EXISTS `tra_loi_binhluan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tra_loi_binhluan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_binhluan` int(11) NOT NULL COMMENT 'ID bình luận gốc',
  `id_tk` int(11) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `ngay_tao` datetime DEFAULT current_timestamp() COMMENT 'Ngày tạo trả lời',
  PRIMARY KEY (`id`),
  KEY `id_binhluan` (`id_binhluan`),
  CONSTRAINT `tra_loi_binhluan_ibfk_1` FOREIGN KEY (`id_binhluan`) REFERENCES `binhluan` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Trả lời bình luận phim';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tra_loi_binhluan`
--

LOCK TABLES `tra_loi_binhluan` WRITE;
/*!40000 ALTER TABLE `tra_loi_binhluan` DISABLE KEYS */;
INSERT INTO `tra_loi_binhluan` VALUES (1,30,10,'Cảm ơn','2025-11-26 12:39:25'),(2,31,10,'GALAXY XIN CẢM ƠN','2025-11-26 12:42:43'),(3,32,10,'Cảm ơn rất nhiều','2025-11-26 12:46:13'),(5,32,10,'OK','2025-11-26 13:02:22'),(6,32,10,'OK','2025-11-26 13:02:25');
/*!40000 ALTER TABLE `tra_loi_binhluan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ve`
--

DROP TABLE IF EXISTS `ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phim` int(11) NOT NULL,
  `id_rap` int(11) DEFAULT NULL,
  `id_thoi_gian_chieu` int(11) NOT NULL,
  `id_ngay_chieu` int(11) NOT NULL,
  `id_tk` int(11) NOT NULL,
  `ghe` varchar(255) NOT NULL,
  `combo` text NOT NULL,
  `price` varchar(10) NOT NULL,
  `id_hd` int(11) NOT NULL,
  `trang_thai` tinyint(4) NOT NULL DEFAULT 0,
  `ngay_dat` datetime NOT NULL,
  `ma_ve` varchar(32) DEFAULT NULL,
  `check_in_luc` datetime DEFAULT NULL,
  `check_in_boi` int(11) DEFAULT NULL,
  `tao_boi` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_ve` (`ma_ve`),
  KEY `id_tk` (`id_tk`),
  KEY `ve_ibfk_2` (`id_thoi_gian_chieu`),
  KEY `id_ngay_chieu` (`id_ngay_chieu`),
  KEY `check_in_boi` (`check_in_boi`),
  KEY `tao_boi` (`tao_boi`),
  CONSTRAINT `ve_checkin_boi_fk` FOREIGN KEY (`check_in_boi`) REFERENCES `taikhoan` (`id`),
  CONSTRAINT `ve_tao_boi_fk` FOREIGN KEY (`tao_boi`) REFERENCES `taikhoan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=468 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ve`
--

LOCK TABLES `ve` WRITE;
/*!40000 ALTER TABLE `ve` DISABLE KEYS */;
INSERT INTO `ve` VALUES (445,24,1,4458,1668,17,'L6,L5','','1000000',0,1,'2025-12-03 12:31:26','VE17647398861491',NULL,NULL,NULL),(446,6,1,4396,1637,17,'L9,L8','','300000',0,1,'2025-12-03 16:29:26','VE17647541661547',NULL,NULL,NULL),(447,6,1,4396,1637,44,'K8,K9','','360000',0,2,'2025-12-03 16:37:43','VE17647546633098',NULL,NULL,NULL),(452,5,1,5782,2332,42,'I8,H8','Combo Standard x2','200000',80,2,'2026-04-07 14:17:01',NULL,NULL,NULL,NULL),(453,5,2,5810,2339,42,'L11,L12','Cocacola x1','130000',81,1,'2026-04-07 14:19:25',NULL,NULL,NULL,NULL),(454,5,1,5788,2333,42,'K8,K7','Combo VIP x1','310000',82,2,'2026-04-07 14:26:08',NULL,NULL,NULL,NULL),(455,39,1,5950,2374,42,'G4,G3','Combo VIP x1','260000',83,1,'2026-04-07 14:31:51',NULL,NULL,NULL,NULL),(456,39,1,5950,2374,48,'G5,G6','Combo VIP x1','260000',84,1,'2026-04-07 14:59:39',NULL,NULL,NULL,NULL),(457,39,1,5950,2374,48,'F2,F3','Combo Family x1','230000',85,1,'2026-04-07 15:05:22',NULL,NULL,NULL,NULL),(458,39,1,5950,2374,48,'E7,E6','Combo Premium x1','195000',86,1,'2026-04-07 15:12:31',NULL,NULL,NULL,NULL),(459,5,2,5809,2339,48,'N12,N13','Cocacola x1','180000',87,1,'2026-04-07 15:14:39',NULL,NULL,NULL,NULL),(460,5,1,5781,2332,48,'J8,J9','Combo Premium x1','245000',88,1,'2026-04-07 15:15:58',NULL,NULL,NULL,NULL),(461,36,2,5952,2377,48,'I10,I9','Cocacola x1','180000',89,1,'2026-04-07 15:28:46',NULL,NULL,NULL,NULL),(462,39,1,5955,2380,48,'E3,E4','Combo dành riêng U22 x1','139000',90,2,'2026-04-07 17:27:45',NULL,NULL,NULL,NULL),(463,39,1,5955,2380,33,'G4','Combo Độc thân x1','111600',91,1,'2026-04-07 18:14:04',NULL,NULL,NULL,NULL),(464,39,1,5955,2380,48,'G6','Combo Cặp đôi x1','148750',92,1,'2026-04-07 18:17:35',NULL,NULL,NULL,NULL),(465,39,1,5955,2380,48,'H7,H6','Combo Ký ức tuổi thơ x1','240000',93,1,'2026-04-07 18:19:41',NULL,NULL,NULL,NULL),(466,39,1,5955,2380,48,'F5,F6','Combo Độc thân x1','179000',94,1,'2026-04-07 18:28:01',NULL,NULL,NULL,NULL),(467,40,1,5957,2381,48,'F3,F4','Combo Cặp đôi x1','230000',95,1,'2026-05-04 13:36:54',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voucher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_voucher` varchar(20) NOT NULL,
  `ten_voucher` varchar(255) NOT NULL,
  `gia_tri` decimal(10,2) NOT NULL,
  `loai_giam` enum('phan_tram','tien_mat') NOT NULL DEFAULT 'tien_mat',
  `dieu_kien_su_dung` text DEFAULT NULL,
  `ngay_het_han` date NOT NULL,
  `so_luong` int(11) DEFAULT -1,
  `da_su_dung` int(11) DEFAULT 0,
  `trang_thai` tinyint(1) DEFAULT 1,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_voucher` (`ma_voucher`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
INSERT INTO `voucher` VALUES (1,'WELCOME2025','Voucher chào mừng năm mới',50000.00,'tien_mat','Áp dụng cho đơn hàng từ 200000đ','2025-12-31',1000,0,1,'2025-08-15 14:49:15'),(2,'STUDENT15','Voucher học sinh sinh viên',15.00,'phan_tram','Áp dụng cho HSSV với thẻ hợp lệ','2025-12-31',500,0,1,'2025-08-15 14:49:15'),(3,'FAMILY100','Voucher gia đình',100000.00,'tien_mat','Áp dụng cho đơn hàng từ 500000đ','2025-12-31',200,0,1,'2025-08-15 14:49:15'),(4,'VIP20','Voucher VIP',20.00,'phan_tram','Áp dụng cho tất cả đơn hàng','2025-12-31',100,0,1,'2025-08-15 14:49:15'),(5,'STUDENT50','Giảm giá học sinh',50000.00,'tien_mat',NULL,'2026-12-31',100,0,1,'2026-04-07 17:23:17');
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `yeu_cau_ve`
--

DROP TABLE IF EXISTS `yeu_cau_ve`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `yeu_cau_ve` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_ve` int(11) NOT NULL,
  `id_rap` int(11) NOT NULL,
  `loai` enum('doi','hoan') NOT NULL,
  `ly_do` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','da_duyet','tu_choi') NOT NULL DEFAULT 'cho_duyet',
  `trang_thai_moi` int(11) DEFAULT NULL,
  `ngay_tao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `yeu_cau_ve`
--

LOCK TABLES `yeu_cau_ve` WRITE;
/*!40000 ALTER TABLE `yeu_cau_ve` DISABLE KEYS */;
INSERT INTO `yeu_cau_ve` VALUES (1,1,1,'doi','','tu_choi',NULL,'2025-09-18 14:36:12'),(2,1,1,'doi','','tu_choi',NULL,'2025-09-18 14:37:23'),(3,414,1,'hoan','','cho_duyet',NULL,'2025-11-26 17:38:04'),(4,414,1,'hoan','','cho_duyet',NULL,'2025-11-26 17:41:05'),(5,414,1,'hoan','','cho_duyet',NULL,'2025-11-26 17:43:15'),(6,414,1,'hoan','','cho_duyet',NULL,'2025-11-26 17:43:31');
/*!40000 ALTER TABLE `yeu_cau_ve` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cinepass'
--

--
-- Dumping routines for database 'cinepass'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 22:01:29
