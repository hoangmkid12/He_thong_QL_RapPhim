const { query, queryOne, execute, insert } = require('../config/db');
const { updateRankIfChanged } = require('../utils/userRank.helper');

const getMyHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Update rank first to ensure fresh data
    const uPoints = await queryOne('SELECT tong_diem_tich_luy FROM taikhoan WHERE id = ?', [userId]);
    if (uPoints) {
      await updateRankIfChanged(require('../config/db'), userId, uPoints.tong_diem_tich_luy);
    }

    const data = await query(
      `SELECT * FROM lich_su_diem WHERE id_tk = ? ORDER BY id DESC`,
      [userId]
    );
    const user = await queryOne(
      'SELECT id, id_diem, diem_tich_luy, tong_diem_tich_luy, hang_thanh_vien FROM taikhoan WHERE id = ?',
      [userId]
    );
    return res.json({ success: true, data, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getUserPoints = async (req, res) => {
  try {
    const { id } = req.params;
    // Update rank if it hasn't been updated yet
    const uPoints = await queryOne('SELECT tong_diem_tich_luy FROM taikhoan WHERE id = ?', [id]);
    if (uPoints) {
      await updateRankIfChanged(require('../config/db'), id, uPoints.tong_diem_tich_luy);
    }

    const user = await queryOne(
      'SELECT id, name, id_diem, diem_tich_luy, hang_thanh_vien FROM taikhoan WHERE id = ?',
      [id]
    );
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getMyHistory, getUserPoints };
