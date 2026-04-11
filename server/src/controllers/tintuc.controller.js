const { query, queryOne, execute, insert } = require('../config/db');

// DB dùng tên bảng `tintuc` (không có dấu gạch dưới)

const getAll = async (req, res) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = `SELECT tt.id, tt.tieu_de, tt.mo_ta, tt.img, tt.ngay_dang, tt.luot_xem, tk.name AS ten_tac_gia
               FROM tintuc tt LEFT JOIN taikhoan tk ON tk.id = tt.id_tk WHERE tt.trang_thai = 1`;
    const params = [];
    if (search) { sql += ' AND tt.tieu_de LIKE ?'; params.push(`%${search}%`); }

    const countResult = await queryOne(
      `SELECT COUNT(*) AS total FROM tintuc WHERE trang_thai = 1${search ? ' AND tieu_de LIKE ?' : ''}`,
      search ? [`%${search}%`] : []
    );

    sql += ` ORDER BY tt.ngay_dang DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const rows = await query(sql, params);

    return res.json({ success: true, data: rows, total: countResult?.total || 0 });
  } catch (err) {
    console.error('[TINTUC] getAll error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const tt = await queryOne(
      `SELECT tt.*, tk.name AS ten_tac_gia FROM tintuc tt LEFT JOIN taikhoan tk ON tk.id = tt.id_tk WHERE tt.id = ?`,
      [id]
    );
    if (!tt) return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức' });
    await execute('UPDATE tintuc SET luot_xem = COALESCE(luot_xem,0)+1 WHERE id=?', [id]).catch(() => {});
    return res.json({ success: true, data: tt });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const getAllAdmin = async (req, res) => {
  try {
    const rows = await query(
      `SELECT tt.id, tt.tieu_de, tt.ngay_dang, tt.trang_thai, tt.luot_xem, tk.name AS ten_tac_gia
       FROM tintuc tt LEFT JOIN taikhoan tk ON tk.id = tt.id_tk ORDER BY tt.id DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const create = async (req, res) => {
  try {
    const { tieu_de, mo_ta, noi_dung } = req.body;
    const img = req.file ? req.file.filename : '';
    const id_tk = req.user.id;
    if (!tieu_de) return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề' });
    const id = await insert(
      'INSERT INTO tintuc (tieu_de, mo_ta, noi_dung, img, id_tk, ngay_dang, trang_thai, luot_xem) VALUES (?,?,?,?,?,NOW(),1,0)',
      [tieu_de, mo_ta || '', noi_dung || '', img, id_tk]
    );
    return res.status(201).json({ success: true, message: 'Đăng tin tức thành công', data: { id } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { tieu_de, mo_ta, noi_dung, trang_thai } = req.body;
    const existing = await queryOne('SELECT img FROM tintuc WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    const img = req.file ? req.file.filename : existing.img;
    await execute('UPDATE tintuc SET tieu_de=?,mo_ta=?,noi_dung=?,img=?,trang_thai=? WHERE id=?',
      [tieu_de, mo_ta, noi_dung || '', img, trang_thai ?? 1, id]);
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const remove = async (req, res) => {
  try {
    await execute('DELETE FROM tintuc WHERE id=?', [req.params.id]);
    return res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

module.exports = { getAll, getOne, getAllAdmin, create, update, remove };
