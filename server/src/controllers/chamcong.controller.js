const { query, queryOne, execute, insert } = require('../config/db');

// Lấy danh sách chấm công (QL rạp chỉ xem rạp mình)
const getAll = async (req, res) => {
  try {
    const { id_rap, id_nv, ngay_tu, ngay_den, page = 1, limit = 30 } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT cc.*, tk.name AS ten_nv, tk.user AS username, rc.ten_rap, DATE_FORMAT(cc.ngay, '%Y-%m-%d') AS ngay_str
               FROM cham_cong cc
               JOIN taikhoan tk ON tk.id = cc.id_nv
               JOIN rap_chieu rc ON rc.id = cc.id_rap
               WHERE 1=1`;
    const params = [];

    // QL Rạp (vai_tro=3) chỉ xem rạp mình
    if (req.user.vai_tro === 3) {
      sql += ' AND cc.id_rap = ?'; params.push(req.user.id_rap);
    } else if (id_rap) {
      sql += ' AND cc.id_rap = ?'; params.push(id_rap);
    }
    if (id_nv) { sql += ' AND cc.id_nv = ?'; params.push(id_nv); }
    if (ngay_tu) { sql += ' AND cc.ngay >= ?'; params.push(ngay_tu); }
    if (ngay_den) { sql += ' AND cc.ngay <= ?'; params.push(ngay_den); }
    sql += ` ORDER BY cc.ngay DESC, cc.id DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const data = await query(sql, params);
    const formattedData = data.map(r => ({ ...r, ngay: r.ngay_str }));
    return res.json({ success: true, data: formattedData });
  } catch (err) {
    console.error('[CHAMCONG] getAll error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách nhân viên của rạp (để chọn khi chấm công)
const getStaffByRap = async (req, res) => {
  try {
    const { id_rap } = req.params;
    const rapId = req.user.vai_tro === 3 ? req.user.id_rap : id_rap;
    const data = await query('SELECT id, name, user FROM taikhoan WHERE vai_tro = 1 AND id_rap = ?', [rapId]);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tạo bản ghi chấm công
const create = async (req, res) => {
  try {
    const { id_nv, ngay, gio_vao, gio_ra, ghi_chu } = req.body;
    const id_rap = req.user.vai_tro === 3 ? req.user.id_rap : req.body.id_rap;
    if (!id_nv || !ngay || !gio_vao) return res.status(400).json({ success: false, message: 'Thiếu thông tin' });

    // Kiểm tra đã chấm công ngày này chưa
    const exists = await queryOne('SELECT id FROM cham_cong WHERE id_nv = ? AND ngay = ?', [id_nv, ngay]);
    if (exists) return res.status(400).json({ success: false, message: 'Nhân viên đã được chấm công ngày này' });

    const id = await insert(
      'INSERT INTO cham_cong (id_nv, id_rap, ngay, gio_vao, gio_ra, ghi_chu) VALUES (?,?,?,?,?,?)',
      [id_nv, id_rap, ngay, gio_vao, gio_ra || '00:00:00', ghi_chu || null]
    );
    return res.status(201).json({ success: true, message: 'Chấm công thành công', data: { id } });
  } catch (err) {
    console.error('[CHAMCONG] create error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật giờ ra
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { gio_vao, gio_ra, ghi_chu } = req.body;
    let sql = 'UPDATE cham_cong SET gio_ra = ?';
    const params = [gio_ra || '00:00:00'];
    if (gio_vao) { sql += ', gio_vao = ?'; params.push(gio_vao); }
    if (ghi_chu !== undefined) { sql += ', ghi_chu = ?'; params.push(ghi_chu); }
    sql += ' WHERE id = ?'; params.push(id);
    await execute(sql, params);
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa
const remove = async (req, res) => {
  try {
    await execute('DELETE FROM cham_cong WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tự chấm công (Nhân viên dùng camera khuôn mặt)
const selfCheckIn = async (req, res) => {
  try {
    const { anh, loai } = req.body; // loai = 'vao' | 'ra'
    const id_nv = req.user.id;
    const id_rap = req.user.id_rap;
    const now = new Date();
    const ngay = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }); // YYYY-MM-DD
    const gio_hien_tai = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh' }); // HH:mm:ss

    if (!anh) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp ảnh chụp khuôn mặt' });

    // Lấy record hôm nay
    const record = await queryOne('SELECT * FROM cham_cong WHERE id_nv = ? AND ngay = ?', [id_nv, ngay]);

    if (loai === 'vao') {
      if (record) return res.status(400).json({ success: false, message: 'Hôm nay bạn đã chấm công vào rồi' });
      await insert(
        'INSERT INTO cham_cong (id_nv, id_rap, ngay, gio_vao, anh_vao, gio_ra) VALUES (?,?,?,?,?,?)',
        [id_nv, id_rap, ngay, gio_hien_tai, anh, '00:00:00']
      );
      return res.status(201).json({ success: true, message: 'Đã check-in thành công', data: { gio_vao: gio_hien_tai } });
    } else {
      if (!record) return res.status(400).json({ success: false, message: 'Bạn chưa check-in ngày hôm nay' });
      if (record.gio_ra !== '00:00:00') return res.status(400).json({ success: false, message: 'Bạn đã check-out rồi' });
      await execute(
        'UPDATE cham_cong SET gio_ra = ?, anh_ra = ? WHERE id = ?',
        [gio_hien_tai, anh, record.id]
      );
      return res.json({ success: true, message: 'Đã check-out thành công', data: { gio_ra: gio_hien_tai } });
    }
  } catch (err) {
    console.error('[CHAMCONG] selfCheckIn error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Nhân viên xem lịch sử chấm công của chính mình
const getSelfRecords = async (req, res) => {
  try {
    const data = await query("SELECT *, DATE_FORMAT(ngay, '%Y-%m-%d') AS ngay_str FROM cham_cong WHERE id_nv = ? ORDER BY ngay DESC LIMIT 30", [req.user.id]);
    const formattedData = data.map(r => ({ ...r, ngay: r.ngay_str }));
    return res.json({ success: true, data: formattedData });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getStaffByRap, create, update, remove, selfCheckIn, getSelfRecords };
