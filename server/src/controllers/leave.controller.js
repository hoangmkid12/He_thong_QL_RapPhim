const { query, execute, insert, queryOne } = require('../config/db');

/**
 * Lấy danh sách đơn nghỉ phép
 * Staff: Chỉ xem đơn của mình
 * Manager (Role 3): Xem đơn của nhân viên cùng rạp
 * Admin (Role 2): Xem tất cả
 */
const getAll = async (req, res) => {
  try {
    const { vai_tro, id: id_tk, id_rap: user_id_rap } = req.user || {};
    let sql = `SELECT d.*, tk.name AS ten_nhan_vien, r.ten_rap
               FROM don_nghi_phep d
               LEFT JOIN taikhoan tk ON tk.id = d.id_nhan_vien
               LEFT JOIN rap_chieu r ON r.id = d.id_rap
               WHERE 1=1`;
    const params = [];

    if (vai_tro === 1) {
      // Nhân viên chỉ xem đơn của mình
      sql += ' AND d.id_nhan_vien = ?';
      params.push(id_tk);
    } else if (vai_tro === 3) {
      // Quản lý rạp chỉ xem đơn của nhân viên cùng rạp
      sql += ' AND d.id_rap = ?';
      params.push(user_id_rap);
    } else if (vai_tro !== 2) {
      // Các vai trò khác không có quyền
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }

    sql += ' ORDER BY d.id DESC';
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Leave] getAll error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Nhân viên nộp đơn nghỉ phép
 */
const create = async (req, res) => {
  try {
    const { tu_ngay, den_ngay, ly_do } = req.body;
    const { id: id_nhan_vien, id_rap } = req.user;

    if (!tu_ngay || !den_ngay || !ly_do) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const id = await insert(
      'INSERT INTO don_nghi_phep (id_nhan_vien, id_rap, tu_ngay, den_ngay, ly_do, trang_thai) VALUES (?, ?, ?, ?, ?, ?)',
      [id_nhan_vien, id_rap || 1, tu_ngay, den_ngay, ly_do, 'Chờ duyệt']
    );

    return res.status(201).json({ success: true, message: 'Nộp đơn nghỉ phép thành công', data: { id } });
  } catch (err) {
    console.error('[Leave] create error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Quản lý duyệt/từ chối đơn
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body; // 'Đã duyệt' | 'Từ chối'
    const { vai_tro, id_rap: user_id_rap } = req.user;

    if (vai_tro !== 3 && vai_tro !== 2) {
      return res.status(403).json({ success: false, message: 'Chỉ quản lý mới có quyền duyệt đơn' });
    }

    const don = await queryOne('SELECT id_rap FROM don_nghi_phep WHERE id = ?', [id]);
    if (!don) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn' });

    // Kiểm tra quyền (Quản lý chỉ được duyệt đơn của rạp mình)
    if (vai_tro === 3 && don.id_rap !== user_id_rap) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền duyệt đơn của rạp khác' });
    }

    await execute('UPDATE don_nghi_phep SET trang_thai = ? WHERE id = ?', [trang_thai, id]);
    return res.json({ success: true, message: `Đã cập nhật trạng thái đơn: ${trang_thai}` });
  } catch (err) {
    console.error('[Leave] updateStatus error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, create, updateStatus };
