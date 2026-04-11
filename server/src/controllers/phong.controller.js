const { query, queryOne, execute, insert } = require('../config/db');

// phong_ghe DB columns: id, id_phong, row_label, seat_number, code, tier, active
// tier: 'cheap' | 'middle' | 'expensive'

const TIER_PRICE = { cheap: 55000, middle: 75000, expensive: 100000 };

const getByRap = async (req, res) => {
  try {
    let { id_rap } = req.params;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    const data = await query(
      `SELECT p.*, COUNT(pg.id) AS so_ghe
       FROM phongchieu p
       LEFT JOIN phong_ghe pg ON pg.id_phong = p.id AND pg.active = 1
       WHERE p.id_rap = ?
       GROUP BY p.id
       ORDER BY p.name`,
      [id_rap]
    );
    return res.json({ success: true, data });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const phong = await queryOne(
      'SELECT p.*, r.ten_rap FROM phongchieu p LEFT JOIN rap_chieu r ON r.id = p.id_rap WHERE p.id = ?', [id]
    );
    if (!phong) return res.status(404).json({ success: false, message: 'Không tìm thấy phòng' });
    // Return seats with normalized field names
    const ghes = await query(
      `SELECT id, id_phong, row_label AS hang, seat_number AS so_ghe, code AS ten_ghe,
              tier AS loai_ghe, active AS trang_thai,
              CASE tier WHEN 'cheap' THEN 55000 WHEN 'middle' THEN 75000 ELSE 100000 END AS gia_ghe
       FROM phong_ghe WHERE id_phong = ? ORDER BY row_label ASC, seat_number ASC`,
      [id]
    );
    return res.json({ success: true, data: { ...phong, ghes } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const create = async (req, res) => {
  try {
    let { id_rap, name, loai_phong } = req.body;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    
    if (!id_rap || !name) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    const id = await insert(
      'INSERT INTO phongchieu (id_rap, name, so_ghe, loai_phong) VALUES (?,?,0,?)',
      [id_rap, name, loai_phong || '2D']
    );
    return res.status(201).json({ success: true, message: 'Thêm phòng thành công', data: { id } });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, loai_phong } = req.body;

    if (req.user?.vai_tro === 3) {
      const p = await queryOne('SELECT id_rap FROM phongchieu WHERE id = ?', [id]);
      if (p && p.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }

    await execute('UPDATE phongchieu SET name=?, loai_phong=? WHERE id=?', [name, loai_phong || '2D', id]);
    return res.json({ success: true, message: 'Cập nhật phòng thành công' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user?.vai_tro === 3) {
      const p = await queryOne('SELECT id_rap FROM phongchieu WHERE id = ?', [id]);
      if (p && p.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }
    await execute('DELETE FROM phong_ghe WHERE id_phong=?', [id]);
    await execute('DELETE FROM phongchieu WHERE id=?', [id]);
    return res.json({ success: true, message: 'Xóa phòng thành công' });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

// GET /api/phong/:id/ghe — sơ đồ ghế
const getSeatMap = async (req, res) => {
  try {
    const { id } = req.params;
    const ghes = await query(
      `SELECT id, id_phong, row_label AS hang, seat_number AS so_ghe, code AS ten_ghe,
              tier AS loai_ghe, active AS trang_thai,
              CASE tier WHEN 'cheap' THEN 55000 WHEN 'middle' THEN 75000 ELSE 100000 END AS gia_ghe
       FROM phong_ghe WHERE id_phong = ? ORDER BY row_label ASC, seat_number ASC`,
      [id]
    );
    return res.json({ success: true, data: ghes });
  } catch (err) { return res.status(500).json({ success: false, message: 'Lỗi server' }); }
};

// POST /api/phong/:id/generate-seats — tạo sơ đồ ghế
const generateSeatMap = async (req, res) => {
  try {
    const { id } = req.params;
    const { so_hang, so_ghe_moi_hang, hang_vip } = req.body;
    const rows = Math.min(parseInt(so_hang) || 8, 26);
    const cols = Math.min(parseInt(so_ghe_moi_hang) || 10, 30);
    const vipRows = (hang_vip || '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

    // Security check
    if (req.user?.vai_tro === 3) {
      const p = await queryOne('SELECT id_rap FROM phongchieu WHERE id = ?', [id]);
      if (p && p.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }

    // Delete old seats
    await execute('DELETE FROM phong_ghe WHERE id_phong = ?', [id]);

    const hangLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, rows);
    let insertCount = 0;

    for (const hang of hangLabels) {
      const tier = vipRows.includes(hang) ? 'expensive' : 'cheap';
      for (let col = 1; col <= cols; col++) {
        const code = `${hang}${col}`;
        await execute(
          'INSERT INTO phong_ghe (id_phong, row_label, seat_number, code, tier, active) VALUES (?,?,?,?,?,1)',
          [id, hang, col, code, tier]
        );
        insertCount++;
      }
    }

    await execute('UPDATE phongchieu SET so_ghe = ? WHERE id = ?', [insertCount, id]);
    return res.json({ success: true, message: `Đã tạo ${insertCount} ghế thành công`, data: { so_ghe: insertCount } });
  } catch (err) {
    console.error('[PHONG] generateSeatMap error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi tạo sơ đồ ghế' });
  }
};

module.exports = { getByRap, getOne, create, update, remove, getSeatMap, generateSeatMap };
