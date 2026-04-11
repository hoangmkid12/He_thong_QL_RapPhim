const { query, queryOne, execute, insert } = require('../config/db');

// ─── GET all cinemas ─────────────────────────────────────────────
const getAll = async (req, res) => {
  try {
    const raps = await query('SELECT *, logo AS img, so_dien_thoai AS dien_thoai FROM rap_chieu WHERE trang_thai = 1 ORDER BY ten_rap ASC');
    return res.json({ success: true, data: raps, count: raps.length });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET one cinema ──────────────────────────────────────────────
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const rap = await queryOne('SELECT *, logo AS img, so_dien_thoai AS dien_thoai FROM rap_chieu WHERE id = ?', [id]);
    if (!rap) return res.status(404).json({ success: false, message: 'Không tìm thấy rạp' });
    return res.json({ success: true, data: rap });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET active cinemas (have upcoming showtimes) ────────────────
const getActiveRaps = async (req, res) => {
  try {
    const raps = await query(
      `SELECT DISTINCT r.*, r.logo AS img, r.so_dien_thoai AS dien_thoai
       FROM rap_chieu r
       INNER JOIN lichchieu lc ON lc.id_rap = r.id AND lc.ngay_chieu >= CURDATE()
       WHERE r.trang_thai = 1
       ORDER BY r.ten_rap ASC`
    );
    return res.json({ success: true, data: raps });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET movies currently showing at a cinema ────────────────────
const getPhimDangChieuTheoRap = async (req, res) => {
  try {
    const { id } = req.params;
    const phim = await query(
      `SELECT DISTINCT p.id, p.tieu_de, p.img, p.thoi_luong_phim, p.gia_han_tuoi,
              l.name AS ten_loai, MIN(lc.ngay_chieu) AS ngay_chieu_som_nhat
       FROM phim p
       INNER JOIN loaiphim l ON l.id = p.id_loai
       INNER JOIN lichchieu lc ON lc.id_phim = p.id AND lc.id_rap = ?
       WHERE lc.ngay_chieu >= CURDATE()
       GROUP BY p.id
       ORDER BY ngay_chieu_som_nhat ASC`,
      [id]
    );
    return res.json({ success: true, data: phim });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── POST create cinema ──────────────────────────────────────────
const create = async (req, res) => {
  try {
    const { ten_rap, dia_chi, dien_thoai, email, mo_ta, id_cum } = req.body;
    const img = req.file ? req.file.filename : '';
    if (!ten_rap) return res.status(400).json({ success: false, message: 'Vui lòng nhập tên rạp' });
    const id = await insert(
      'INSERT INTO rap_chieu (ten_rap, dia_chi, so_dien_thoai, email, mo_ta, logo, id_cum) VALUES (?,?,?,?,?,?,?)', 
      [ten_rap, dia_chi, dien_thoai, email || null, mo_ta || '', img, id_cum || null]
    );
    return res.status(201).json({ success: true, message: 'Thêm rạp thành công', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── PUT update cinema ───────────────────────────────────────────
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_rap, dia_chi, dien_thoai, email, mo_ta, id_cum } = req.body;
    const existing = await queryOne('SELECT id, logo AS img FROM rap_chieu WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy rạp' });
    const img = req.file ? req.file.filename : existing.img;
    await execute(
      'UPDATE rap_chieu SET ten_rap=?, dia_chi=?, so_dien_thoai=?, email=?, mo_ta=?, logo=?, id_cum=? WHERE id=?', 
      [ten_rap, dia_chi, dien_thoai, email || null, mo_ta || '', img, id_cum || null, id]
    );
    return res.json({ success: true, message: 'Cập nhật rạp thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── DELETE cinema ───────────────────────────────────────────────
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await execute('UPDATE rap_chieu SET trang_thai = 0 WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa rạp thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET rooms by cinema ─────────────────────────────────────────
const getPhongByRap = async (req, res) => {
  try {
    const { id } = req.params;
    const phong = await query(
      'SELECT * FROM phongchieu WHERE id_rap = ? ORDER BY name ASC',
      [id]
    );
    return res.json({ success: true, data: phong });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getOne, getActiveRaps, getPhimDangChieuTheoRap, create, update, remove, getPhongByRap };
