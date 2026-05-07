const { query, queryOne, execute, insert } = require('../config/db');

/**
 * Lấy danh sách phân phối phim cho các rạp
 * Cluster Manager (vai_tro=4) quản lý tất cả rạp
 */
const getDistribution = async (req, res) => {
  try {
    const { id_phim, id_rap } = req.query;
    let sql = `SELECT pr.*, p.tieu_de, p.img, p.thoi_luong_phim, r.ten_rap
               FROM phim_rap pr
               JOIN phim p ON p.id = pr.id_phim
               JOIN rap_chieu r ON r.id = pr.id_rap
               WHERE 1=1`;
    const params = [];
    if (id_phim) { sql += ' AND pr.id_phim = ?'; params.push(id_phim); }
    if (id_rap) { sql += ' AND pr.id_rap = ?'; params.push(id_rap); }
    sql += ' ORDER BY pr.ngay_tao DESC';
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[PHIM_RAP] getDistribution error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Lấy danh sách phim chưa được phân phối cho 1 rạp cụ thể
 */
const getAvailableMovies = async (req, res) => {
  try {
    const { id_rap } = req.params;
    const data = await query(
      `SELECT p.id, p.tieu_de, p.img, p.thoi_luong_phim, lp.name AS ten_loai, p.trang_thai_duyet
       FROM phim p
       LEFT JOIN loaiphim lp ON lp.id = p.id_loai
       WHERE p.trang_thai_duyet = 'da_duyet'
         AND p.id NOT IN (SELECT id_phim FROM phim_rap WHERE id_rap = ?)
       ORDER BY p.date_phat_hanh DESC`,
      [id_rap]
    );
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[PHIM_RAP] getAvailableMovies error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Phân phối phim cho rạp (thêm 1 hoặc nhiều phim cho 1 rạp)
 */
const distribute = async (req, res) => {
  try {
    const { id_rap, phim_ids } = req.body;
    if (!id_rap || !phim_ids?.length) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin rạp hoặc phim' });
    }
    // Kiểm tra rạp tồn tại
    const rap = await queryOne('SELECT id FROM rap_chieu WHERE id = ?', [id_rap]);
    if (!rap) return res.status(404).json({ success: false, message: 'Rạp không tồn tại' });

    let added = 0;
    for (const id_phim of phim_ids) {
      const exists = await queryOne('SELECT id FROM phim_rap WHERE id_phim = ? AND id_rap = ?', [id_phim, id_rap]);
      if (!exists) {
        await insert('INSERT INTO phim_rap (id_phim, id_rap) VALUES (?, ?)', [id_phim, id_rap]);
        added++;
      }
    }
    return res.status(201).json({ success: true, message: `Đã phân phối ${added} phim cho rạp`, data: { added } });
  } catch (err) {
    console.error('[PHIM_RAP] distribute error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Gỡ phim khỏi rạp
 */
const removeDistribution = async (req, res) => {
  try {
    const { id } = req.params;
    await execute('DELETE FROM phim_rap WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Đã gỡ phim khỏi rạp' });
  } catch (err) {
    console.error('[PHIM_RAP] removeDistribution error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * Lấy danh sách rạp + số phim đã phân phối
 */
const getRapSummary = async (req, res) => {
  try {
    const data = await query(
      `SELECT r.id, r.ten_rap, r.dia_chi,
              COUNT(pr.id) AS so_phim
       FROM rap_chieu r
       LEFT JOIN phim_rap pr ON pr.id_rap = r.id
       GROUP BY r.id
       ORDER BY r.id`
    );
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[PHIM_RAP] getRapSummary error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getDistribution, getAvailableMovies, distribute, removeDistribution, getRapSummary };
