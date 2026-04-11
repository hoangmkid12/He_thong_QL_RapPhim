const { query, queryOne, execute, insert } = require('../config/db');
const bcrypt = require('bcryptjs');

const getAll = async (req, res) => {
  try {
    let { vai_tro, id_rap, search, page = 1, limit = 20 } = req.query;
    if (req.user?.vai_tro === 3) {
      id_rap = req.user.id_rap;
      // Managers can only see Staff (1) or Customers (0)
      if (vai_tro === undefined || vai_tro === '') {
        // No specific role filter, but we restrict to 0, 1 for managers
      }
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = 'SELECT id,user,name,email,phone,dia_chi,vai_tro,id_rap,img,id_diem,diem_tich_luy,hang_thanh_vien FROM taikhoan WHERE 1=1';
    const params = [];
    if (req.user?.vai_tro === 3) {
      sql += ' AND vai_tro IN (0, 1)';
    }
    if (vai_tro !== undefined && vai_tro !== '') { sql += ' AND vai_tro = ?'; params.push(vai_tro); }
    if (id_rap) { sql += ' AND id_rap = ?'; params.push(id_rap); }
    if (search) { sql += ' AND (name LIKE ? OR email LIKE ? OR user LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    sql += ` ORDER BY id DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const uPoints = await queryOne('SELECT tong_diem_tich_luy FROM taikhoan WHERE id = ?', [id]);
    if (uPoints) await updateRankIfChanged(require('../config/db'), id, uPoints.tong_diem_tich_luy);

    const user = await queryOne(
      'SELECT id,user,name,email,phone,dia_chi,vai_tro,id_rap,img,id_diem,diem_tich_luy,hang_thanh_vien FROM taikhoan WHERE id = ?',
      [id]
    );
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const create = async (req, res) => {
  try {
    let { name, email, user: username, pass, phone, dia_chi, vai_tro, id_rap } = req.body;
    if (req.user?.vai_tro === 3) {
      id_rap = req.user.id_rap;
      if (vai_tro > 1) vai_tro = 1; // Force staff or customer
    }
    if (!name || !email || !username || !pass) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }
    const exist = await queryOne('SELECT id FROM taikhoan WHERE email = ? OR user = ?', [email, username]);
    if (exist) return res.status(400).json({ success: false, message: 'Email hoặc tên đăng nhập đã tồn tại' });
    const hashed = await bcrypt.hash(pass, 10);
    const img = req.file ? req.file.filename : '';
    const id = await insert(
      'INSERT INTO taikhoan (name,email,user,pass,phone,dia_chi,vai_tro,id_rap,img) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, email, username, hashed, phone || '', dia_chi || '', vai_tro ?? 0, id_rap || null, img]
    );
    return res.status(201).json({ success: true, message: 'Tạo tài khoản thành công', data: { id } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email, user: username, phone, dia_chi, vai_tro, id_rap } = req.body;

    if (req.user?.vai_tro === 3) {
      const u = await queryOne('SELECT id_rap FROM taikhoan WHERE id = ?', [id]);
      if (u && u.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
      id_rap = req.user.id_rap;
      if (vai_tro > 1) vai_tro = 1; // Force staff or customer
    }

    const img = req.file ? req.file.filename : undefined;
    let sql = 'UPDATE taikhoan SET name=?,email=?,user=?,phone=?,dia_chi=?,vai_tro=?,id_rap=?';
    const params = [name, email, username, phone, dia_chi, vai_tro, id_rap || null];
    if (img) { sql += ',img=?'; params.push(img); }
    sql += ' WHERE id=?'; params.push(id);
    await execute(sql, params);
    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, email, user: username, phone, dia_chi } = req.body;
    const img = req.file ? req.file.filename : undefined;
    let sql = 'UPDATE taikhoan SET name=?,email=?,user=?,phone=?,dia_chi=?';
    const params = [name, email, username, phone, dia_chi];
    if (img) { sql += ',img=?'; params.push(img); }
    sql += ' WHERE id=?'; params.push(id);
    await execute(sql, params);
    const updated = await queryOne('SELECT id,user,name,email,phone,dia_chi,vai_tro,id_rap,img,id_diem,diem_tich_luy,hang_thanh_vien FROM taikhoan WHERE id=?', [id]);
    return res.json({ success: true, message: 'Cập nhật hồ sơ thành công', data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user?.vai_tro === 3) {
      const u = await queryOne('SELECT id_rap FROM taikhoan WHERE id = ?', [id]);
      if (u && u.id_rap !== req.user.id_rap) return res.status(403).json({ success: false, message: 'Từ chối truy cập' });
    }
    await execute('DELETE FROM taikhoan WHERE id = ?', [id]);
    return res.json({ success: true, message: 'Xóa tài khoản thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, getOne, create, update, updateProfile, remove };
