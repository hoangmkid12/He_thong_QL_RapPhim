const { query, queryOne, execute, insert, transaction } = require('../config/db');
const nodemailer = require('nodemailer');

// ─── GET lịch chiếu ──────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    let { id_rap, id_phim, ngay_chieu, from, to, limit = 50 } = req.query;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    
    let sql = `SELECT lc.*, p.tieu_de, p.thoi_luong_phim, r.ten_rap
               FROM lichchieu lc
               LEFT JOIN phim p ON p.id = lc.id_phim
               LEFT JOIN rap_chieu r ON r.id = lc.id_rap
               WHERE 1=1`;
    const params = [];
    if (id_rap)      { sql += ' AND lc.id_rap = ?';      params.push(id_rap); }
    if (id_phim)     { sql += ' AND lc.id_phim = ?';     params.push(id_phim); }
    if (ngay_chieu)  { sql += ' AND DATE(lc.ngay_chieu) = ?';  params.push(ngay_chieu); }
    if (from)        { sql += ' AND DATE(lc.ngay_chieu) >= ?'; params.push(from); }
    if (to)          { sql += ' AND DATE(lc.ngay_chieu) <= ?'; params.push(to); }
    sql += ` ORDER BY lc.ngay_chieu ASC, lc.id DESC LIMIT ${parseInt(limit)}`;

    const data = await query(sql, params);

    // Attach khung_gio for each schedule
    for (const lc of data) {
      lc.khung_gio = await query(
        `SELECT kgc.id, kgc.thoi_gian_chieu, kgc.gia_ve, phongchieu.name AS ten_phong,
                (SELECT COUNT(*) FROM phong_ghe pg WHERE pg.id_phong = kgc.id_phong AND pg.active = 1) -
                (SELECT COUNT(*) FROM ve WHERE ve.id_thoi_gian_chieu = kgc.id AND ve.trang_thai IN (0,1,2)) AS so_ghe_trong
         FROM khung_gio_chieu kgc
         LEFT JOIN phongchieu ON phongchieu.id = kgc.id_phong
         WHERE kgc.id_lich_chieu = ?
         ORDER BY kgc.thoi_gian_chieu ASC`,
        [lc.id]
      );
    }

    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    console.error('[LC] getAll error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};


// ─── GET khung giờ chiếu của một buổi chiếu + thông tin phim+phòng ──
const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const lc = await queryOne(
      `SELECT lc.id, lc.id_phim, lc.id_rap, lc.ghi_chu,
              DATE_FORMAT(lc.ngay_chieu, '%Y-%m-%d') AS ngay_chieu,
              p.tieu_de, p.img, p.thoi_luong_phim,
              r.ten_rap, r.dia_chi
       FROM lichchieu lc
       LEFT JOIN phim p ON p.id = lc.id_phim
       LEFT JOIN rap_chieu r ON r.id = lc.id_rap
       WHERE lc.id = ?`,
      [id]
    );
    if (!lc) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch chiếu' });

    const khunggio = await query(
      `SELECT kgc.*, phongchieu.name AS ten_phong
       FROM khung_gio_chieu kgc
       LEFT JOIN phongchieu ON phongchieu.id = kgc.id_phong
       WHERE kgc.id_lich_chieu = ?
       ORDER BY kgc.thoi_gian_chieu ASC`,
      [id]
    );
    return res.json({ success: true, data: { ...lc, khung_gio: khunggio } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET seat+booking info for a specific showtime ───────────────
const getSeatInfo = async (req, res) => {
  try {
    const { id_gio, id_lc, id_phim } = req.query;
    if (!id_gio || !id_lc || !id_phim) {
      return res.status(400).json({ success: false, message: 'Thiếu tham số' });
    }

    // Get showtime meta
    const meta = await queryOne(
      `SELECT kgc.id AS id_gio, TIME_FORMAT(kgc.thoi_gian_chieu, '%H:%i') AS thoi_gian_chieu, kgc.id_phong,
              DATE_FORMAT(lc.ngay_chieu, '%d/%m/%Y') AS ngay_chieu, lc.id AS id_lc, lc.id_rap,
              p.tieu_de, p.img, p.thoi_luong_phim, p.id AS id_phim,
              phong.name AS ten_phong,
              r.ten_rap, r.dia_chi
       FROM khung_gio_chieu kgc
       LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       LEFT JOIN phim p ON p.id = lc.id_phim
       LEFT JOIN phongchieu phong ON phong.id = kgc.id_phong
       LEFT JOIN rap_chieu r ON r.id = lc.id_rap
       WHERE kgc.id = ? AND lc.id = ? AND lc.id_phim = ?`,
      [id_gio, id_lc, id_phim]
    );
    if (!meta) return res.status(404).json({ success: false, message: 'Không tìm thấy suất chiếu' });

    // Get seat map
    const seats = await query(
      `SELECT id, id_phong, row_label AS hang, seat_number AS so_ghe, code AS ten_ghe,
              CASE tier WHEN 'expensive' THEN 'vip' ELSE 'thuong' END AS loai_ghe,
              active AS trang_thai
       FROM phong_ghe WHERE id_phong = ? ORDER BY row_label ASC, seat_number ASC`,
      [meta.id_phong]
    );

    // Get booked seats
    const booked = await query(
      `SELECT ve.ghe FROM ve
       JOIN khung_gio_chieu ON ve.id_thoi_gian_chieu = khung_gio_chieu.id
       JOIN lichchieu ON lichchieu.id = khung_gio_chieu.id_lich_chieu
       WHERE ve.trang_thai IN (0,1,2)
         AND ve.id_thoi_gian_chieu = ?
         AND lichchieu.id = ?
         AND lichchieu.id_phim = ?`,
      [id_gio, id_lc, id_phim]
    );

    const bookedSeats = booked.flatMap(b => b.ghe ? b.ghe.split(',').map(s => s.trim()) : []);
    return res.json({ success: true, data: { meta, seats, bookedSeats } });
  } catch (err) {
    console.error('[LC] getSeatInfo error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── POST create schedule ────────────────────────────────────────
const create = async (req, res) => {
  try {
    let { id_phim, id_rap, ngay_chieu, ghi_chu, id_phong, thoi_gian_chieu, gia_ve } = req.body;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    
    if (!id_phim || !id_rap || !ngay_chieu) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const id = await transaction(async (conn) => {
      // Auto-approve if user is Admin (2) or Cluster Manager (4)
      const trang_thai = (req.user?.vai_tro === 2 || req.user?.vai_tro === 4) ? 'Đã duyệt' : 'Chờ duyệt';
      
      // 1. Insert search schedule
      const [lcResult] = await conn.execute(
        'INSERT INTO lichchieu (id_phim, id_rap, ngay_chieu, ghi_chu, trang_thai_duyet, nguoi_tao) VALUES (?,?,?,?,?,?)',
        [id_phim, id_rap, ngay_chieu, ghi_chu || null, trang_thai, req.user?.id || null]
      );
      const lcId = lcResult.insertId;

      // 2. If time and room are provided, insert initial showtime
      if (id_phong && thoi_gian_chieu) {
        await conn.execute(
          'INSERT INTO khung_gio_chieu (id_lich_chieu, id_phong, thoi_gian_chieu, gia_ve) VALUES (?,?,?,?)',
          [lcId, id_phong, thoi_gian_chieu, gia_ve || 55000]
        );
      }

      return lcId;
    });

    return res.status(201).json({ success: true, message: 'Thêm lịch chiếu thành công', data: { id } });
  } catch (err) {
    console.error('[LC] create error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── PUT update schedule ─────────────────────────────────────────
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngay_chieu, ghi_chu } = req.body;
    await execute('UPDATE lichchieu SET ngay_chieu=?, ghi_chu=? WHERE id=?', [ngay_chieu, ghi_chu, id]);
    return res.json({ success: true, message: 'Cập nhật lịch chiếu thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── DELETE schedule ─────────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user?.vai_tro === 3) {
      const lc = await queryOne('SELECT id_rap FROM lichchieu WHERE id = ?', [id]);
      if (lc && lc.id_rap !== req.user.id_rap) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa lịch chiếu của rạp khác' });
      }
    }
    await execute('DELETE FROM lichchieu WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa lịch chiếu thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── POST create showtime (khung giờ) ───────────────────────────
const createKhungGio = async (req, res) => {
  try {
    const { id_lich_chieu, id_lc, id_phong, thoi_gian_chieu, gia_ve } = req.body;
    const lichId = id_lich_chieu || id_lc;
    if (!lichId || !id_phong || !thoi_gian_chieu) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    if (req.user?.vai_tro === 3) {
      const lc = await queryOne('SELECT id_rap FROM lichchieu WHERE id = ?', [lichId]);
      if (lc && lc.id_rap !== req.user.id_rap) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền thêm khung giờ cho rạp khác' });
      }
    }
    const id = await insert(
      'INSERT INTO khung_gio_chieu (id_lich_chieu, id_phong, thoi_gian_chieu, gia_ve) VALUES (?,?,?,?)',
      [lichId, id_phong, thoi_gian_chieu, gia_ve || 55000]
    );
    return res.status(201).json({ success: true, message: 'Thêm khung giờ thành công', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── DELETE showtime ─────────────────────────────────────────────
const deleteKhungGio = async (req, res) => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM khung_gio_chieu WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa khung giờ chiếu thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Đã duyệt' | 'Từ chối'
    if (!['Đã duyệt', 'Từ chối'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    // Only Cluster Manager (4) or Admin (2)
    if (req.user.vai_tro !== 4 && req.user.vai_tro !== 2) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền duyệt lịch chiếu' });
    }
    await execute('UPDATE lichchieu SET trang_thai_duyet = ? WHERE id = ?', [status, id]);
    return res.json({ success: true, message: `Lịch chiếu đã được ${status.toLowerCase()}` });
  } catch (err) {
    console.error('[LC] updateStatus error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getDetail, getSeatInfo, create, update, remove, createKhungGio, deleteKhungGio, updateStatus };
