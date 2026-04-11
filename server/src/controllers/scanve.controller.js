const { query, queryOne, execute, insert } = require('../config/db');

// ─── Scan ve ─────────────────────────────────────────────────────
const scanVe = async (req, res) => {
  try {
    const { id_ve } = req.body;
    if (!id_ve) return res.status(400).json({ success: false, message: 'Thiếu mã vé' });

    const ve = await queryOne(
      `SELECT v.id, v.trang_thai, v.ghe, p.tieu_de,
              lc.ngay_chieu, kgc.thoi_gian_chieu, phong.name AS tenphong,
              r.ten_rap, tk.name AS ten_kh
       FROM ve v
       LEFT JOIN phim p ON p.id = v.id_phim
       LEFT JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
       LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       LEFT JOIN phongchieu phong ON phong.id = kgc.id_phong
       LEFT JOIN rap_chieu r ON r.id = v.id_rap
       LEFT JOIN taikhoan tk ON tk.id = v.id_tk
       WHERE v.id = ?`,
      [id_ve]
    );
    if (!ve) return res.status(404).json({ success: false, message: 'Vé không tồn tại' });

    if (ve.trang_thai === 2) {
      return res.status(400).json({ success: false, message: 'Vé đã được sử dụng rồi!', data: ve });
    }
    if (ve.trang_thai === 3) {
      return res.status(400).json({ success: false, message: 'Vé đã bị hủy!', data: ve });
    }
    if (ve.trang_thai !== 1) {
      return res.status(400).json({ success: false, message: 'Vé không hợp lệ (chưa thanh toán hoặc hết hạn)', data: ve });
    }

    // Check if same cinema
    if (req.user.id_rap) {
      const veRap = await queryOne('SELECT id_rap FROM ve WHERE id=?', [id_ve]);
      if (veRap.id_rap && veRap.id_rap !== req.user.id_rap) {
        return res.status(403).json({ success: false, message: 'Vé không thuộc rạp của bạn!' });
      }
    }

    // Mark as used
    await execute('UPDATE ve SET trang_thai = 2 WHERE id = ?', [id_ve]);

    // Log checkin
    await execute(
      'INSERT INTO lich_su_checkin (id_ve, id_nhan_vien, thoi_gian) VALUES (?,?,NOW()) ON DUPLICATE KEY UPDATE thoi_gian=NOW()',
      [id_ve, req.user.id]
    ).catch(() => {}); // table may not exist

    return res.json({ success: true, message: '✅ Check-in thành công!', data: { ...ve, trang_thai: 2 } });
  } catch (err) {
    console.error('[SCAN] scanVe error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getScanHistory = async (req, res) => {
  try {
    const id_rap = req.user.id_rap;
    const { date } = req.query;
    let sql = `SELECT v.id, tk.name AS ten_kh, p.tieu_de, v.ghe, v.trang_thai, v.ngay_dat, r.ten_rap
               FROM ve v
               LEFT JOIN taikhoan tk ON tk.id=v.id_tk
               LEFT JOIN phim p ON p.id=v.id_phim
               LEFT JOIN rap_chieu r ON r.id=v.id_rap
               WHERE v.trang_thai = 2`;
    const params = [];
    if (id_rap) { sql += ' AND v.id_rap=?'; params.push(id_rap); }
    if (date) { sql += ' AND DATE(v.ngay_dat)=?'; params.push(date); }
    sql += ' ORDER BY v.id DESC LIMIT 100';
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { scanVe, getScanHistory };
