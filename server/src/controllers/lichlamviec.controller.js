const { query, queryOne, execute, insert } = require('../config/db');

/**
 * GET /api/lich-lam-viec
 * Cho quản lý rạp xem toàn bộ lịch của rạp mình
 */
const getAll = async (req, res) => {
  try {
    const { id_rap, from, to } = req.query;
    // Nếu là Cinema Manager, chỉ xem được rạp của mình
    const targetRap = req.user?.vai_tro === 3 ? req.user.id_rap : id_rap;

    let sql = `SELECT l.*, t.name AS ten_nhan_vien, r.ten_rap
               FROM lich_lam_viec l
               JOIN taikhoan t ON t.id = l.id_nhan_vien
               JOIN rap_chieu r ON r.id = l.id_rap
               WHERE 1=1`;
    const params = [];

    if (targetRap) {
      sql += ' AND l.id_rap = ?';
      params.push(targetRap);
    }
    if (from) {
      sql += ' AND l.ngay >= ?';
      params.push(from);
    }
    if (to) {
      sql += ' AND l.ngay <= ?';
      params.push(to);
    }

    sql += ' ORDER BY l.ngay DESC, l.gio_bat_dau ASC';
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[LLV] getAll error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * GET /api/lich-lam-viec/my
 * Cho nhân viên xem lịch của chính mình
 */
const getMy = async (req, res) => {
  try {
    const { from, to } = req.query;
    let sql = `SELECT l.*, r.ten_rap, r.dia_chi
               FROM lich_lam_viec l
               JOIN rap_chieu r ON r.id = l.id_rap
               WHERE l.id_nhan_vien = ?`;
    const params = [req.user.id];

    if (from) { sql += ' AND l.ngay >= ?'; params.push(from); }
    if (to)   { sql += ' AND l.ngay <= ?'; params.push(to);   }

    sql += ' ORDER BY l.ngay DESC, l.gio_bat_dau ASC';
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/lich-lam-viec
 */
const create = async (req, res) => {
  try {
    let { id_nhan_vien, id_rap, ngay, gio_bat_dau, gio_ket_thuc, ca_lam, ghi_chu } = req.body;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    
    if (!id_nhan_vien || !id_rap || !ngay || !gio_bat_dau || !gio_ket_thuc) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    const id = await insert(
      `INSERT INTO lich_lam_viec (id_nhan_vien, id_rap, ngay, gio_bat_dau, gio_ket_thuc, ca_lam, ghi_chu)
       VALUES (?,?,?,?,?,?,?)`,
      [id_nhan_vien, id_rap, ngay, gio_bat_dau, gio_ket_thuc, ca_lam || null, ghi_chu || null]
    );
    return res.status(201).json({ success: true, message: 'Phân ca thành công', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * PUT /api/lich-lam-viec/:id
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_nhan_vien, ngay, gio_bat_dau, gio_ket_thuc, ca_lam, ghi_chu, trang_thai } = req.body;
    
    if (req.user?.vai_tro === 3) {
      const llv = await queryOne('SELECT id_rap FROM lich_lam_viec WHERE id = ?', [id]);
      if (llv && llv.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }

    await execute(
      `UPDATE lich_lam_viec SET id_nhan_vien=?, ngay=?, gio_bat_dau=?, gio_ket_thuc=?, ca_lam=?, ghi_chu=?, trang_thai=?
       WHERE id = ?`,
      [id_nhan_vien, ngay, gio_bat_dau, gio_ket_thuc, ca_lam, ghi_chu, trang_thai || 'lich', id]
    );
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * DELETE /api/lich-lam-viec/:id
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user?.vai_tro === 3) {
      const llv = await queryOne('SELECT id_rap FROM lich_lam_viec WHERE id = ?', [id]);
      if (llv && llv.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }
    await execute('DELETE FROM lich_lam_viec WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa ca làm việc thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getMy, create, update, remove };
