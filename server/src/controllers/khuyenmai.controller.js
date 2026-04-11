const { query, queryOne, execute, insert } = require('../config/db');

// Helper: map DB columns → API columns
const mapKm = (km) => km ? ({
  ...km,
  ten: km.ten_khuyen_mai || km.ten,
  ma_km: km.ma_khuyen_mai || km.ma_km,
}) : null;

const getAll = async (req, res) => {
  try {
    const { id_rap } = req.query;
    let sql = `SELECT km.*, km.ten_khuyen_mai AS ten, km.ma_khuyen_mai AS ma_km, r.ten_rap
               FROM khuyen_mai km LEFT JOIN rap_chieu r ON r.id = km.id_rap 
               WHERE (km.trang_thai IS NULL OR km.trang_thai != -1)`;
    const params = [];
    if (id_rap) { sql += ' AND km.id_rap = ?'; params.push(id_rap); }
    sql += ' ORDER BY km.id DESC';
    const data = await query(sql, params);
    return res.json({ success: true, data, count: data.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getActive = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const data = await query(
      `SELECT km.*, km.ten_khuyen_mai AS ten, km.ma_khuyen_mai AS ma_km, r.ten_rap
       FROM khuyen_mai km LEFT JOIN rap_chieu r ON r.id = km.id_rap
       WHERE km.trang_thai = 1 AND km.ngay_bat_dau <= ? AND km.ngay_ket_thuc >= ?
       ORDER BY km.ngay_bat_dau DESC`,
      [today, today]
    );
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getOne = async (req, res) => {
  try {
    const km = await queryOne(
      'SELECT *, ten_khuyen_mai AS ten, ma_khuyen_mai AS ma_km FROM khuyen_mai WHERE id = ?',
      [req.params.id]
    );
    if (!km) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
    return res.json({ success: true, data: km });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const create = async (req, res) => {
  try {
    // Accept: ten hoặc ten_khuyen_mai
    const { ten, ten_khuyen_mai, ma_km, ma_khuyen_mai, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, id_rap } = req.body;
    const tenVal = ten || ten_khuyen_mai;
    const maVal = ma_km || ma_khuyen_mai || null;
    const img = req.file ? req.file.filename : null;
    if (!tenVal || !phan_tram_giam || !ngay_bat_dau || !ngay_ket_thuc) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }
    const id = await insert(
      `INSERT INTO khuyen_mai (ten_khuyen_mai, ma_khuyen_mai, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, id_rap, img, trang_thai, loai_giam)
       VALUES (?,?,?,?,?,?,?,?,1,'phan_tram')`,
      [tenVal, maVal, mo_ta || '', phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, id_rap || null, img]
    );
    return res.status(201).json({ success: true, message: 'Thêm khuyến mãi thành công', data: { id } });
  } catch (err) {
    console.error('[KM] create error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, ten_khuyen_mai, ma_km, ma_khuyen_mai, mo_ta, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, id_rap } = req.body;
    const existing = await queryOne('SELECT img FROM khuyen_mai WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
    const tenVal = ten || ten_khuyen_mai;
    const maVal = ma_km || ma_khuyen_mai || null;
    const img = req.file ? req.file.filename : existing.img;
    await execute(
      'UPDATE khuyen_mai SET ten_khuyen_mai=?,ma_khuyen_mai=?,mo_ta=?,phan_tram_giam=?,ngay_bat_dau=?,ngay_ket_thuc=?,id_rap=?,img=? WHERE id=?',
      [tenVal, maVal, mo_ta || '', phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, id_rap || null, img, id]
    );
    return res.json({ success: true, message: 'Cập nhật khuyến mãi thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[KM] Attempting to remove/hide KM ID:', id);
    // Check if used in hoa_don
    const used = await queryOne('SELECT id FROM hoa_don WHERE id_khuyen_mai = ? LIMIT 1', [id]);
    if (used) {
      console.log('[KM] KM ID:', id, 'is used in hoadon, soft deleting...');
      // Soft delete if referenced for data integrity
      await execute('UPDATE khuyen_mai SET trang_thai = -1 WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Đã ẩn khuyến mãi (có lịch sử giao dịch)' });
    }
    console.log('[KM] KM ID:', id, 'is NOT used, hard deleting...');
    // Hard delete if never used
    await execute('DELETE FROM khuyen_mai WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã xóa khuyến mãi thành công' });
  } catch (err) {
    console.error('[KM] delete error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa' });
  }
};

const toggle = async (req, res) => {
  try {
    const km = await queryOne('SELECT trang_thai FROM khuyen_mai WHERE id = ?', [req.params.id]);
    if (!km) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const newStatus = km.trang_thai === 1 ? 0 : 1;
    await execute('UPDATE khuyen_mai SET trang_thai = ? WHERE id = ?', [newStatus, req.params.id]);
    return res.json({ success: true, data: { trang_thai: newStatus } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getActive, getOne, create, update, remove, toggle };
