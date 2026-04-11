const { query, queryOne, execute, insert } = require('../config/db');

// ─── GET all movies ──────────────────────────────────────────────
const getAllPhim = async (req, res) => {
  try {
    const { search = '', id_loai = 0, trang_thai, dang_chieu, sap_chieu, hot, limit = 100, page = 1 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = `SELECT p.id, p.tieu_de, p.daodien, p.dienvien, p.img, p.mo_ta,
                      p.date_phat_hanh, p.thoi_luong_phim, p.quoc_gia,
                      p.gia_han_tuoi, p.link_trailer, p.trang_thai_duyet, p.id_loai,
                      l.name AS ten_loai
               FROM phim p
               LEFT JOIN loaiphim l ON l.id = p.id_loai
               WHERE 1=1`;
    const params = [];

    if (search) { sql += ' AND p.tieu_de LIKE ?'; params.push(`%${search}%`); }
    if (parseInt(id_loai) > 0) { sql += ' AND p.id_loai = ?'; params.push(id_loai); }

    // Support cả 2 format: ?dang_chieu=1 (cũ) và ?trang_thai=dang_chieu (mới)
    const isDangChieu = dang_chieu === '1' || trang_thai === 'dang_chieu';
    const isSapChieu  = sap_chieu === '1'  || trang_thai === 'sap_chieu';
    const isDaduyet   = trang_thai === 'da_duyet';
    const isChoduyet  = trang_thai === 'cho_duyet';

    if (isDangChieu)  { sql += " AND p.trang_thai_duyet = 'da_duyet' AND DATE(p.date_phat_hanh) <= CURDATE()"; }
    else if (isSapChieu)   { sql += " AND p.trang_thai_duyet = 'da_duyet' AND DATE(p.date_phat_hanh) > CURDATE()"; }
    else if (isDaduyet)    { sql += " AND p.trang_thai_duyet = 'da_duyet'"; }
    else if (isChoduyet)   { sql += " AND p.trang_thai_duyet = 'cho_duyet'"; }
    // hot=1: hiện tất cả phim đã duyệt (không có cột is_hot trong DB)
    if (hot === '1') { sql += " AND p.trang_thai_duyet = 'da_duyet'"; }

    sql += ` ORDER BY p.date_phat_hanh DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const phim = await query(sql, params);
    return res.json({ success: true, data: phim, count: phim.length });
  } catch (err) {
    console.error('[PHIM] getAllPhim error:', err.message, err.sqlMessage, err.code);
    return res.status(500).json({ success: false, message: 'Lỗi server', debug: err.message });
  }
};



// ─── GET one movie ───────────────────────────────────────────────
const getOnePhim = async (req, res) => {
  try {
    const { id } = req.params;
    const phim = await queryOne(
      `SELECT p.*, l.name AS ten_loai
       FROM phim p
       LEFT JOIN loaiphim l ON l.id = p.id_loai
       WHERE p.id = ?`,
      [id]
    );
    if (!phim) return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });
    return res.json({ success: true, data: phim });
  } catch (err) {
    console.error('[PHIM] getOnePhim error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── POST create movie ───────────────────────────────────────────
const createPhim = async (req, res) => {
  try {
    const { tieu_de, daodien, dienvien, mo_ta, thoi_luong_phim, quoc_gia, gia_han_tuoi, date_phat_hanh, id_loai, link_trailer } = req.body;
    const img = req.file ? req.file.filename : '';

    if (!tieu_de || !id_loai) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tiêu đề và loại phim' });
    }

    // Auto-approve if user is Admin (2) or Cluster Manager (4)
    const trang_thai = (req.user?.vai_tro === 2 || req.user?.vai_tro === 4) ? 'da_duyet' : 'cho_duyet';

    const id = await insert(
      `INSERT INTO phim (tieu_de, daodien, dienvien, img, mo_ta, thoi_luong_phim, quoc_gia, gia_han_tuoi, date_phat_hanh, id_loai, link_trailer, trang_thai_duyet)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [tieu_de, daodien, dienvien, img, mo_ta, thoi_luong_phim, quoc_gia, gia_han_tuoi, date_phat_hanh, id_loai, link_trailer, trang_thai]
    );
    return res.status(201).json({ success: true, message: 'Thêm phim thành công', data: { id } });
  } catch (err) {
    console.error('[PHIM] createPhim error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── PUT update movie ────────────────────────────────────────────
const updatePhim = async (req, res) => {
  try {
    const { id } = req.params;
    const { tieu_de, daodien, dienvien, mo_ta, thoi_luong_phim, quoc_gia, gia_han_tuoi, date_phat_hanh, id_loai, link_trailer } = req.body;

    const existing = await queryOne('SELECT id, img FROM phim WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });

    const img = req.file ? req.file.filename : existing.img;

    await execute(
      `UPDATE phim SET tieu_de=?, daodien=?, dienvien=?, img=?, mo_ta=?, thoi_luong_phim=?,
       quoc_gia=?, gia_han_tuoi=?, date_phat_hanh=?, id_loai=?, link_trailer=?
       WHERE id=?`,
      [tieu_de, daodien, dienvien, img, mo_ta, thoi_luong_phim, quoc_gia, gia_han_tuoi, date_phat_hanh, id_loai, link_trailer, id]
    );
    return res.json({ success: true, message: 'Cập nhật phim thành công' });
  } catch (err) {
    console.error('[PHIM] updatePhim error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── DELETE movie ────────────────────────────────────────────────
const deletePhim = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await queryOne('SELECT id FROM phim WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Không tìm thấy phim' });
    await execute('DELETE FROM phim WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa phim thành công' });
  } catch (err) {
    console.error('[PHIM] deletePhim error:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ success: false, message: 'Không thể xóa phim này vì đã phát sinh dữ liệu (lịch chiếu, vé, bình luận...). Hãy thay đổi trạng thái phim thay vì xóa.' });
    }
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET active cinemas showing this movie ───────────────────────
const getRapsShowingPhim = async (req, res) => {
  try {
    const { id } = req.params;
    const raps = await query(
      `SELECT DISTINCT r.id, r.ten_rap, r.dia_chi, r.logo AS img, r.so_dien_thoai AS dien_thoai
       FROM rap_chieu r
       INNER JOIN lichchieu lc ON lc.id_rap = r.id AND lc.id_phim = ?
       WHERE lc.trang_thai_duyet = 'Đã duyệt'
       ORDER BY r.ten_rap`,
      [id]
    );
    return res.json({ success: true, data: raps });
  } catch (err) {
    console.error('[PHIM] getRapsShowingPhim error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET showdates for a movie at a specific cinema ──────────────
const getDatesForPhimAtRap = async (req, res) => {
  try {
    const { id, id_rap } = req.params;
    const dates = await query(
      `SELECT DISTINCT DATE_FORMAT(lc.ngay_chieu, '%Y-%m-%d') AS ngay_chieu
       FROM lichchieu lc
       WHERE lc.id_phim = ? AND lc.id_rap = ? AND lc.ngay_chieu >= CURDATE()
       AND lc.trang_thai_duyet = 'Đã duyệt'
       ORDER BY ngay_chieu ASC`,
      [id, id_rap]
    );
    return res.json({ success: true, data: dates.map(d => d.ngay_chieu) });
  } catch (err) {
    console.error('[PHIM] getDatesForPhimAtRap error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET showtimes for a specific date ───────────────────────────
const getShowtimesForDate = async (req, res) => {
  try {
    const { id, id_rap } = req.params;
    const { ngay_chieu } = req.query;
    console.log('[DEBUG] getShowtimesForDate:', { id, id_rap, ngay_chieu });
    if (!ngay_chieu) return res.status(400).json({ success: false, message: 'Thiếu ngày chiếu' });

    // Clean up date string if it's in ISO format
    const cleanDate = ngay_chieu.includes('T') ? ngay_chieu.split('T')[0] : ngay_chieu;

    const times = await query(
      `SELECT lc.id AS id_lc, kgc.id AS id_gio, kgc.thoi_gian_chieu,
              p.name AS ten_phong, p.id AS id_phong,
              DATE_FORMAT(lc.ngay_chieu, '%Y-%m-%d') AS ngay_chieu
       FROM lichchieu lc
       INNER JOIN khung_gio_chieu kgc ON kgc.id_lich_chieu = lc.id
       INNER JOIN phongchieu p ON p.id = kgc.id_phong
       WHERE lc.id_phim = ? AND lc.id_rap = ? AND DATE_FORMAT(lc.ngay_chieu, '%Y-%m-%d') = ?
       AND lc.trang_thai_duyet = 'Đã duyệt'
       ORDER BY kgc.thoi_gian_chieu ASC`,
      [id, id_rap, cleanDate]
    );
    return res.json({ success: true, data: times });
  } catch (err) {
    console.error('[PHIM] getShowtimesForDate error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// ─── GET all movie genres ─────────────────────────────────────────
const getAllLoaiPhim = async (req, res) => {
  try {
    const loai = await query('SELECT * FROM loaiphim ORDER BY name ASC');
    return res.json({ success: true, data: loai });
  } catch (err) {
    console.error('[PHIM] getAllLoaiPhim error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const createLoaiPhim = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Vui lòng nhập tên loại phim' });
    const id = await insert('INSERT INTO loaiphim (name) VALUES (?)', [name]);
    return res.status(201).json({ success: true, message: 'Thêm loại phim thành công', data: { id, name } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateLoaiPhim = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await execute('UPDATE loaiphim SET name = ? WHERE id = ?', [name, id]);
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const deleteLoaiPhim = async (req, res) => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM loaiphim WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['da_duyet', 'cho_duyet', 'tu_choi'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
    }
    if (req.user.vai_tro !== 2 && req.user.vai_tro !== 4) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền duyệt phim' });
    }
    await execute('UPDATE phim SET trang_thai_duyet = ? WHERE id = ?', [status, id]);
    return res.json({ success: true, message: 'Cập nhật trạng thái phim thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllPhim, getOnePhim, createPhim, updatePhim, deletePhim, updateStatus,
  getRapsShowingPhim, getDatesForPhimAtRap, getShowtimesForDate,
  getAllLoaiPhim, createLoaiPhim, updateLoaiPhim, deleteLoaiPhim,
};
