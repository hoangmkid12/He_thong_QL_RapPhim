const { query, queryOne, execute, insert } = require('../config/db');

// DB dùng bảng combo_do_an với cột ten_combo, hinh_anh
// Controller map về tên chuẩn API: ten, img

const getAll = async (req, res) => {
  try {
    const { id_rap } = req.query;
    let sql = `SELECT id, ten_combo AS ten, mo_ta, gia, hinh_anh AS img, id_rap, trang_thai, ngay_tao
               FROM combo_do_an WHERE 1=1`;
    const params = [];
    if (id_rap) { sql += ' AND (id_rap = ? OR id_rap IS NULL)'; params.push(id_rap); }
    sql += ' ORDER BY id DESC';
    const combos = await query(sql, params);
    return res.json({ success: true, data: combos, count: combos.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getOne = async (req, res) => {
  try {
    const combo = await queryOne(
      'SELECT id, ten_combo AS ten, mo_ta, gia, hinh_anh AS img, id_rap, trang_thai FROM combo_do_an WHERE id = ?',
      [req.params.id]
    );
    if (!combo) return res.status(404).json({ success: false, message: 'Không tìm thấy combo' });
    return res.json({ success: true, data: combo });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const create = async (req, res) => {
  try {
    let { ten, mo_ta, gia, id_rap } = req.body;
    const img = req.file ? req.file.filename : null;
    
    // Normalize fields
    if (id_rap === 'null' || id_rap === 'undefined' || id_rap === '') id_rap = null;
    if (!mo_ta) mo_ta = '';

    if (!ten || !gia) return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    const id = await insert(
      'INSERT INTO combo_do_an (ten_combo, mo_ta, gia, hinh_anh, id_rap, trang_thai) VALUES (?,?,?,?,?,1)',
      [ten, mo_ta, gia, img, id_rap]
    );
    return res.status(201).json({ success: true, message: 'Thêm combo thành công', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let { ten, mo_ta, gia, id_rap } = req.body;
    
    // Normalize fields
    if (id_rap === 'null' || id_rap === 'undefined' || id_rap === '') id_rap = null;
    if (!mo_ta) mo_ta = '';

    const existing = await queryOne('SELECT hinh_anh FROM combo_do_an WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy combo' });
    const img = req.file ? req.file.filename : existing.hinh_anh;
    await execute(
      'UPDATE combo_do_an SET ten_combo=?, mo_ta=?, gia=?, hinh_anh=?, id_rap=? WHERE id=?',
      [ten, mo_ta, gia, img, id_rap, id]
    );
    return res.json({ success: true, message: 'Cập nhật combo thành công' });
  } catch (err) {
    console.error('[Combo] Update error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const remove = async (req, res) => {
  try {
    await execute('DELETE FROM combo_do_an WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Xóa combo thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const toggle = async (req, res) => {
  try {
    const combo = await queryOne('SELECT trang_thai FROM combo_do_an WHERE id = ?', [req.params.id]);
    if (!combo) return res.status(404).json({ success: false, message: 'Không tìm thấy combo' });
    const newStatus = combo.trang_thai === 1 ? 0 : 1;
    await execute('UPDATE combo_do_an SET trang_thai = ? WHERE id = ?', [newStatus, req.params.id]);
    return res.json({ success: true, message: newStatus === 1 ? 'Đã bật combo' : 'Đã ẩn combo', data: { trang_thai: newStatus } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getOne, create, update, remove, toggle };
