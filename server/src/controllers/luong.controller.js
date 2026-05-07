const { query, execute } = require('../config/db');

// Lấy danh sách bảng lương
const getAll = async (req, res) => {
  try {
    const { id_rap, thang } = req.query;
    let sql = `SELECT bl.*, tk.name AS ten_nv, tk.user AS username, rc.ten_rap
               FROM bang_luong bl
               JOIN taikhoan tk ON tk.id = bl.id_nv
               JOIN rap_chieu rc ON rc.id = bl.id_rap
               WHERE 1=1`;
    const params = [];

    if (req.user.vai_tro === 3) {
      sql += ' AND bl.id_rap = ?'; params.push(req.user.id_rap);
    } else if (id_rap) {
      sql += ' AND bl.id_rap = ?'; params.push(id_rap);
    }

    if (thang) {
      sql += ' AND bl.thang = ?'; params.push(thang);
    }

    sql += ' ORDER BY bl.thang DESC, bl.id DESC';

    const data = await query(sql, params);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[LUONG] getAll error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Tổng hợp lương từ chấm công
const calculateSalary = async (req, res) => {
  try {
    const { thang } = req.body; // YYYY-MM
    if (!thang) return res.status(400).json({ success: false, message: 'Vui lòng chọn tháng' });

    let tkSql = 'SELECT id, id_rap, luong_co_ban, name FROM taikhoan WHERE vai_tro IN (1,2,3)';
    const tkParams = [];

    if (req.user.vai_tro === 3) {
      tkSql += ' AND id_rap = ?';
      tkParams.push(req.user.id_rap);
    }

    const employees = await query(tkSql, tkParams);

    let count = 0;
    for (const emp of employees) {
      // Tính tổng số giờ làm trong tháng
      const [{ tong_giay }] = await query(
        `SELECT SUM(TIMESTAMPDIFF(SECOND, STR_TO_DATE(CONCAT(ngay, ' ', gio_vao), '%Y-%m-%d %H:%i:%s'), STR_TO_DATE(CONCAT(ngay, ' ', gio_ra), '%Y-%m-%d %H:%i:%s'))) AS tong_giay
         FROM cham_cong
         WHERE id_nv = ? AND DATE_FORMAT(ngay, '%Y-%m') = ? AND gio_ra != '00:00:00'`,
        [emp.id, thang]
      );

      const so_gio = tong_giay ? (tong_giay / 3600).toFixed(2) : 0;
      const luong_theo_gio = emp.luong_co_ban || 25000;
      const tong_luong = so_gio * luong_theo_gio;

      // Kiem tra xem da co bang luong chua
      const existing = await query('SELECT id FROM bang_luong WHERE id_nv = ? AND thang = ?', [emp.id, thang]);
      if (existing.length > 0) {
        // Update
        await execute(
          'UPDATE bang_luong SET so_gio = ?, luong_theo_gio = ?, tong_luong = ? WHERE id = ?',
          [so_gio, luong_theo_gio, tong_luong, existing[0].id]
        );
      } else {
        // Insert
        await execute(
          'INSERT INTO bang_luong (id_nv, id_rap, thang, so_gio, luong_theo_gio, tong_luong, trang_thai_thanh_toan) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [emp.id, emp.id_rap, thang, so_gio, luong_theo_gio, tong_luong, 'chua_thanh_toan']
        );
      }
      count++;
    }

    return res.json({ success: true, message: `Đã tổng hợp lương cho ${count} nhân viên` });
  } catch (err) {
    console.error('[LUONG] calculateSalary error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật lương (thưởng, phạt, trạng thái)
const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { thuong, khau_tru, ghi_chu, trang_thai_thanh_toan } = req.body;

    const [bl] = await query('SELECT * FROM bang_luong WHERE id = ?', [id]);
    if (!bl) return res.status(404).json({ success: false, message: 'Không tìm thấy bảng lương' });

    const tong_luong = (parseFloat(bl.so_gio) * parseFloat(bl.luong_theo_gio)) + parseFloat(thuong || 0) - parseFloat(khau_tru || 0);

    await execute(
      'UPDATE bang_luong SET thuong = ?, khau_tru = ?, tong_luong = ?, ghi_chu = ?, trang_thai_thanh_toan = ? WHERE id = ?',
      [thuong || 0, khau_tru || 0, tong_luong, ghi_chu || '', trang_thai_thanh_toan || 'chua_thanh_toan', id]
    );

    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    console.error('[LUONG] updateSalary error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getAll, calculateSalary, updateSalary };
