const { query, queryOne, execute, insert } = require('../config/db');

const getAll = async (req, res) => {
  try {
    const { id_phim, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT bl.*, tk.name AS ten_nguoi_dung, p.tieu_de AS ten_phim
               FROM binhluan bl
               LEFT JOIN taikhoan tk ON tk.id=bl.id_tk
               LEFT JOIN phim p ON p.id=bl.id_phim
               WHERE 1=1`;
    const params = [];
    if (id_phim) { sql += ' AND bl.id_phim=?'; params.push(id_phim); }
    sql += ` ORDER BY bl.id DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const create = async (req, res) => {
  try {
    const { id_phim, noi_dung, so_sao } = req.body;
    const id_tk = req.user.id;
    if (!id_phim || !noi_dung) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    if (noi_dung.length > 1000) return res.status(400).json({ success: false, message: 'Nội dung quá dài (tối đa 1000 ký tự)' });
    const id = await insert(
      'INSERT INTO binhluan (id_phim, id_tk, noi_dung, so_sao, ngay_bl) VALUES (?,?,?,?,NOW())',
      [id_phim, id_tk, noi_dung, so_sao || 5]
    );
    return res.status(201).json({ success: true, message: 'Đã thêm bình luận', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const bl = await queryOne('SELECT id_tk FROM binhluan WHERE id=?', [id]);
    if (!bl) return res.status(404).json({ success: false, message: 'Không tìm thấy bình luận' });
    if (bl.id_tk !== req.user.id && req.user.vai_tro < 2) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa bình luận này' });
    }
    await execute('DELETE FROM binhluan WHERE id=?', [id]);
    return res.json({ success: true, message: 'Xóa bình luận thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { noi_dung } = req.body;
    if (!noi_dung || noi_dung.length > 1000) return res.status(400).json({ success: false, message: 'Nội dung không hợp lệ' });
    await execute(
      'INSERT INTO tra_loi_binhluan (id_binhluan, id_tk, noi_dung, ngay_tl) VALUES (?,?,?,NOW())',
      [id, req.user.id, noi_dung]
    );
    return res.json({ success: true, message: 'Đã trả lời bình luận' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, create, remove, addReply };
