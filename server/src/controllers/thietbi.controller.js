const { query, queryOne, execute, insert } = require('../config/db');

// Lấy danh sách thiết bị (QL rạp chỉ xem phòng thuộc rạp mình)
const getAll = async (req, res) => {
  try {
    const { id_rap, id_phong, tinh_trang } = req.query;
    let sql = `SELECT tb.*, pc.name AS ten_phong, pc.loai_phong, rc.ten_rap, rc.id AS id_rap
               FROM thiet_bi_phong tb
               JOIN phongchieu pc ON pc.id = tb.id_phong
               JOIN rap_chieu rc ON rc.id = pc.id_rap
               WHERE 1=1`;
    const params = [];

    if (req.user.vai_tro === 3) {
      sql += ' AND pc.id_rap = ?'; params.push(req.user.id_rap);
    } else if (id_rap) {
      sql += ' AND pc.id_rap = ?'; params.push(id_rap);
    }
    if (id_phong) { sql += ' AND tb.id_phong = ?'; params.push(id_phong); }
    if (tinh_trang) { sql += ' AND tb.tinh_trang = ?'; params.push(tinh_trang); }
    sql += ' ORDER BY rc.id, pc.id, tb.id';

    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[THIETBI] getAll error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy phòng chiếu (để dropdown)
const getPhongByRap = async (req, res) => {
  try {
    const { id_rap } = req.params;
    const rapId = req.user.vai_tro === 3 ? req.user.id_rap : id_rap;
    const data = await query('SELECT id, name, loai_phong FROM phongchieu WHERE id_rap = ?', [rapId]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Thêm thiết bị
const create = async (req, res) => {
  try {
    const { id_phong, ten_thiet_bi, so_luong, tinh_trang, ghi_chu } = req.body;
    if (!id_phong || !ten_thiet_bi) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });

    // Kiểm tra phòng thuộc rạp mình (nếu QL rạp)
    if (req.user.vai_tro === 3) {
      const phong = await queryOne('SELECT id FROM phongchieu WHERE id = ? AND id_rap = ?', [id_phong, req.user.id_rap]);
      if (!phong) return res.status(403).json({ success: false, message: 'Phòng không thuộc rạp của bạn' });
    }

    const id = await insert(
      'INSERT INTO thiet_bi_phong (id_phong, ten_thiet_bi, so_luong, tinh_trang, ghi_chu) VALUES (?,?,?,?,?)',
      [id_phong, ten_thiet_bi, so_luong || 1, tinh_trang || 'tot', ghi_chu || null]
    );
    return res.status(201).json({ success: true, message: 'Thêm thiết bị thành công', data: { id } });
  } catch (err) {
    console.error('[THIETBI] create error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật thiết bị
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_thiet_bi, so_luong, tinh_trang, ghi_chu } = req.body;
    await execute(
      'UPDATE thiet_bi_phong SET ten_thiet_bi=?, so_luong=?, tinh_trang=?, ghi_chu=? WHERE id=?',
      [ten_thiet_bi, so_luong, tinh_trang, ghi_chu || null, id]
    );
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa thiết bị
const remove = async (req, res) => {
  try {
    await execute('DELETE FROM thiet_bi_phong WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getPhongByRap, create, update, remove };
