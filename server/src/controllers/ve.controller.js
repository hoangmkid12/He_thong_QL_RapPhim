const { query, queryOne, execute, insert, transaction } = require('../config/db');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { updateRankIfChanged } = require('../utils/userRank.helper');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

/**
 * POST /api/ve/dat-ve
 * Tạo vé + hóa đơn + cộng điểm sau thanh toán
 */
const datVe = async (req, res) => {
  try {
    const {
      id_phim, id_lc, id_gio, id_rap,
      ghe,         // array of seat names e.g. ["A1","A2"]
      combo,       // combo string
      gia_ghe,     // total price (after discount)
      diem_doi,    // points redeemed
      giam_gia_diem, // discount from points
      id_km,       // voucher id
      phuong_thuc, // payment method e.g. "Momo", "ATM"
    } = req.body;

    const id_tk = req.user.id;

    if (!id_phim || !id_lc || !id_gio || !ghe || !gia_ghe) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt vé' });
    }

    const gheStr = Array.isArray(ghe) ? ghe.join(',') : ghe;
    const ngay_tt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const result = await transaction(async (conn) => {
      // 1. Tạo hóa đơn
      const [hdResult] = await conn.execute(
        'INSERT INTO hoa_don (ngay_tt, thanh_tien, trang_thai, phuong_thuc) VALUES (?,?,?,?)',
        [ngay_tt, gia_ghe, 0, phuong_thuc || 'ATM']
      );
      const id_hd = hdResult.insertId;

      // 2. Tạo vé
      const [veResult] = await conn.execute(
        `INSERT INTO ve (price, ngay_dat, ghe, id_tk, id_thoi_gian_chieu, id_hd, id_ngay_chieu, id_phim, combo, id_rap)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
        [gia_ghe, ngay_tt, gheStr, id_tk, id_gio, id_hd, id_lc, id_phim, combo || '', id_rap || null]
      );
      const id_ve = veResult.insertId;

      // 3. Cập nhật trạng thái thanh toán
      await conn.execute('UPDATE hoa_don SET trang_thai = 1 WHERE id = ?', [id_hd]);
      await conn.execute('UPDATE ve SET trang_thai = 1 WHERE id_hd = ?', [id_hd]);

      // 4. Cộng điểm
      let diem_cong = 0;
      if (gia_ghe > 0) {
        diem_cong = Math.floor(gia_ghe / 1000);
        if (diem_cong > 0) {
          await conn.execute(
            'UPDATE taikhoan SET id_diem = COALESCE(id_diem,0)+?, diem_tich_luy = COALESCE(diem_tich_luy,0)+?, tong_diem_tich_luy = COALESCE(tong_diem_tich_luy,0)+? WHERE id=?',
            [diem_cong, diem_cong, diem_cong, id_tk]
          );
          
          // Check and update rank
          const [[{ tong_diem }]] = await conn.execute('SELECT tong_diem_tich_luy AS tong_diem FROM taikhoan WHERE id = ?', [id_tk]);
          if (tong_diem) await updateRankIfChanged(conn, id_tk, tong_diem);

          await conn.execute(
            `INSERT INTO lich_su_diem (id_tk, loai_giao_dich, so_diem, ly_do, id_ve, id_hoa_don, nguoi_thuc_hien)
             VALUES (?, 'cong', ?, ?, ?, ?, 'system')`,
            [id_tk, diem_cong, `Tích điểm từ đơn hàng #${id_hd}`, id_ve, id_hd]
          );
        }

        // 5. Trừ điểm nếu đổi
        if (diem_doi && parseInt(diem_doi) > 0) {
          const truDiem = parseInt(diem_doi);
          await conn.execute(
            'UPDATE taikhoan SET id_diem = GREATEST(0, COALESCE(id_diem,0)-?) WHERE id=?',
            [truDiem, id_tk]
          );
          await conn.execute(
            `INSERT INTO lich_su_diem (id_tk, loai_giao_dich, so_diem, ly_do, id_ve, id_hoa_don, nguoi_thuc_hien)
             VALUES (?, 'tru', ?, ?, ?, ?, 'system')`,
            [id_tk, truDiem, `Đổi điểm giảm giá đơn hàng #${id_hd}`, id_ve, id_hd]
          );
        }
      }

      // 6. Cập nhật số lượng voucher đã dùng (nếu có)
      if (id_km) {
        await conn.execute(
          'UPDATE voucher SET da_su_dung = COALESCE(da_su_dung,0) + 1 WHERE id = ?',
          [id_km]
        );
      }

      return { id_hd, id_ve, diem_cong };
    });

    // 6. Lấy thông tin vé để gửi mail + trả về
    const veInfo = await queryOne(
      `SELECT h.thanh_tien, v.id, h.ngay_tt, tk.name, tk.email,
              kgc.thoi_gian_chieu, lc.ngay_chieu, p.tieu_de,
              v.ghe, v.combo, phong.name AS tenphong, r.ten_rap, r.dia_chi AS dia_chi_rap
       FROM hoa_don h
       JOIN ve v ON v.id_hd = h.id
       JOIN taikhoan tk ON tk.id = v.id_tk
       JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
       JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       JOIN phongchieu phong ON phong.id = kgc.id_phong
       JOIN phim p ON p.id = lc.id_phim
       LEFT JOIN rap_chieu r ON r.id = v.id_rap
       WHERE h.id = ?`,
      [result.id_hd]
    );

    // 7. Gửi email xác nhận (best-effort)
    try {
      if (veInfo && veInfo.email) {
        const formattedDate = new Date(veInfo.ngay_chieu).toLocaleDateString('vi-VN');
        const formattedTime = String(veInfo.thoi_gian_chieu).slice(0, 5);
        const qrBase64 = await QRCode.toDataURL(`#VE${veInfo.id}`, { margin: 1, width: 200 });

        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"Galaxy Studio" <${process.env.SMTP_USER}>`,
          to: veInfo.email,
          subject: '✅ Xác nhận đặt vé thành công - Galaxy Studio',
          html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); color: #1f2937;">
              <!-- Header Section -->
              <div style="background-color: #e50914; padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
                  GALAXY STUDIO
                </h1>
              </div>
              
              <div style="padding: 40px;">
                <h2 style="color: #111827; margin: 0 0 16px 0; font-size: 24px; font-weight: 800;">Chào ${veInfo.name},</h2>
                <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin: 0;">Cảm ơn bạn đã tin tưởng dịch vụ của Galaxy Studio. Vé của bạn đã được xác nhận thành công. Dưới đây là thông tin chi tiết suất chiếu:</p>
                
                <!-- Ticket Details Card -->
                <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 30px; margin: 32px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; width: 140px; text-transform: uppercase; letter-spacing: 0.5px;">Phim</td>
                      <td style="padding: 12px 0; color: #111827; font-weight: 700; font-size: 18px;">${veInfo.tieu_de}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Rạp</td>
                      <td style="padding: 12px 0; color: #111827; font-weight: 600; font-size: 16px;">${veInfo.ten_rap}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Sảnh / Phòng</td>
                      <td style="padding: 12px 0; color: #111827; font-weight: 600; font-size: 16px;">${veInfo.tenphong}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Suất chiếu</td>
                      <td style="padding: 12px 0; color: #111827; font-weight: 600; font-size: 16px;">${formattedTime} | ${formattedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Vị trí ghế</td>
                      <td style="padding: 12px 0; color: #e50914; font-weight: 800; font-size: 20px;">${veInfo.ghe}</td>
                    </tr>
                    ${veInfo.combo ? `
                    <tr>
                      <td style="padding: 12px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Bắp nước</td>
                      <td style="padding: 12px 0; color: #111827; font-size: 15px;">${veInfo.combo}</td>
                    </tr>
                    ` : ''}
                    <tr style="border-top: 1px solid #e5e7eb;">
                      <td style="padding: 24px 0 0 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Tổng cộng</td>
                      <td style="padding: 24px 0 0 0; color: #111827; font-weight: 900; font-size: 24px;">${new Intl.NumberFormat('vi-VN').format(veInfo.thanh_tien)} ₫</td>
                    </tr>
                  </table>
                </div>

                <!-- QR Code Section -->
                <div style="text-align: center; padding: 40px 0; background: radial-gradient(circle at center, #ffffff 0%, #f9fafb 100%); border-radius: 16px;">
                  <p style="color: #6b7280; font-size: 13px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Mã nhận vé tại quầy (e-Ticket)</p>
                  <div style="display: inline-block; padding: 16px; background: #ffffff; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.05);">
                    <img src="cid:ticketqr" alt="QR Code" style="width: 200px; height: 200px; display: block;" />
                  </div>
                  <p style="font-weight: 900; color: #111827; font-size: 22px; margin: 20px 0 0 0; letter-spacing: 1px;">#VE${veInfo.id}</p>
                </div>

                ${result.diem_cong > 0 ? `
                  <div style="margin-top: 32px; background-color: #fef3c7; border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: 500;">
                      ✨ Tuyệt vời! Bạn vừa nhận được <strong>${result.diem_cong} điểm</strong> tích lũy Galaxy.
                    </p>
                  </div>
                ` : ''}
              </div>

              <!-- Footer Section -->
              <div style="background-color: #f3f4f6; padding: 32px 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">Vui lòng có mặt tại rạp ít nhất 15-20 phút trước khi suất chiếu bắt đầu.</p>
                <div style="border-top: 1px solid #e5e7eb; margin: 24px auto; max-width: 100px;"></div>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; 2026 Galaxy Studio. Hệ thống đặt vé trực tuyến 24/7.</p>
              </div>
            </div>`,
          attachments: [{
            filename: 'ticket-qr.png',
            content: qrBase64.split('base64,')[1],
            encoding: 'base64',
            cid: 'ticketqr'
          }]
        });
      }
    } catch (mailErr) {
      console.error('[VE] Email error (non-critical):', mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Đặt vé thành công!',
      data: { id_ve: result.id_ve, id_hd: result.id_hd, diem_cong: result.diem_cong, ve: veInfo },
    });
  } catch (err) {
    console.error('[VE] datVe error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server khi đặt vé' });
  }
};

/**
 * POST /api/ve/pos — Nhân viên đặt vé tại quầy
 */
const datVePOS = async (req, res) => {
  try {
    const { id_phim, id_lc, id_gio, ghe, combo, gia_ghe, phuong_thuc, id_khuyen_mai, tien_giam, thanh_toan_cuoi } = req.body;
    const id_nv = req.user.id;
    const id_rap = req.user.id_rap;

    if (!id_phim || !id_lc || !id_gio || !ghe || !gia_ghe) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin đặt vé' });
    }

    const gheStr = Array.isArray(ghe) ? ghe.join(',') : ghe;
    const ngay_tt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const tong_thanh_tien = gia_ghe; // Gia_ghe passed from client includes seat + combo price
    const final_pay = thanh_toan_cuoi !== undefined ? thanh_toan_cuoi : tong_thanh_tien;

    const result = await transaction(async (conn) => {
      // 1. Tạo hóa đơn
      const [hdResult] = await conn.execute(
        'INSERT INTO hoa_don (ngay_tt, thanh_tien, trang_thai, phuong_thuc, id_khuyen_mai, tien_giam, thanh_toan_cuoi) VALUES (?,?,?,?,?,?,?)',
        [ngay_tt, tong_thanh_tien, 1, phuong_thuc || 'Tiền mặt', id_khuyen_mai || null, tien_giam || 0, final_pay] // Trạng thái = 1 (đã thanh toán)
      );
      const id_hd = hdResult.insertId;

      // 2. Tạo vé
      const [veResult] = await conn.execute(
        `INSERT INTO ve (price, ngay_dat, ghe, id_tk, id_thoi_gian_chieu, id_hd, id_ngay_chieu, id_phim, combo, id_rap, trang_thai, tao_boi)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [final_pay, ngay_tt, gheStr, id_nv, id_gio, id_hd, id_lc, id_phim, combo || '', id_rap || null, 1, id_nv]
      );
      const id_ve = veResult.insertId;

      return { id_ve, id_hd };
    });

    return res.status(201).json({ success: true, message: 'Đặt vé tại quầy thành công!', data: result });
  } catch (err) {
    console.error('[VE] datVePOS error:', err.message);
    return res.status(500).json({ success: false, message: 'Lỗi server khi đặt vé' });
  }
};

/**
 * GET /api/ve/my — Danh sách vé của user hiện tại
 */
const getMyVe = async (req, res) => {
  try {
    const id_tk = req.user.id;
    const ve = await query(
      `SELECT v.id, p.tieu_de, lc.ngay_chieu, kgc.thoi_gian_chieu,
              tk.name, v.ghe, v.price, v.ngay_dat, v.combo, v.trang_thai,
              phong.name AS tenphong, r.ten_rap, r.dia_chi AS dia_chi_rap, v.id_hd
       FROM ve v
       LEFT JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
       LEFT JOIN taikhoan tk ON tk.id = v.id_tk
       LEFT JOIN phim p ON p.id = v.id_phim
       LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       LEFT JOIN phongchieu phong ON phong.id = kgc.id_phong
       LEFT JOIN rap_chieu r ON r.id = v.id_rap
       WHERE v.trang_thai IN (0,1,2,3,4) AND v.id_tk = ?
       ORDER BY v.id DESC`,
      [id_tk]
    );
    return res.json({ success: true, data: ve });
  } catch (err) {
    console.error('[VE] getMyVe error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * GET /api/ve/:id — Chi tiết vé
 */
const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const ve = await queryOne(
      `SELECT v.id, v.id_tk, p.tieu_de, lc.ngay_chieu, v.price, v.ngay_dat,
              v.ghe, v.combo, tk.name, kgc.thoi_gian_chieu, v.id_hd, v.trang_thai,
              phong.name AS tenphong, r.ten_rap, r.dia_chi AS dia_chi_rap
       FROM ve v
       LEFT JOIN taikhoan tk ON tk.id = v.id_tk
       LEFT JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
       LEFT JOIN phim p ON p.id = v.id_phim
       LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       LEFT JOIN phongchieu phong ON phong.id = kgc.id_phong
       LEFT JOIN rap_chieu r ON r.id = v.id_rap
       WHERE v.id = ?`,
      [id]
    );
    if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    return res.json({ success: true, data: ve });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * POST /api/ve/:id/huy — Hủy vé
 */
const huyVe = async (req, res) => {
  try {
    const { id } = req.params;
    const ve = await queryOne(
      `SELECT v.price, v.id_tk, v.trang_thai,
              CONCAT(lc.ngay_chieu,' ',kgc.thoi_gian_chieu) AS gio_chieu
       FROM ve v
       LEFT JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
       LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
       WHERE v.id = ?`,
      [id]
    );
    if (!ve) return res.status(404).json({ success: false, message: 'Vé không tồn tại' });
    if (ve.id_tk !== req.user.id && req.user.vai_tro < 1) {
      return res.status(403).json({ success: false, message: 'Không có quyền hủy vé này' });
    }
    if ([2, 3, 4].includes(ve.trang_thai)) {
      return res.status(400).json({ success: false, message: 'Không thể hủy vé đã sử dụng/hủy/hết hạn' });
    }

    // check 4-hour rule
    if (ve.gio_chieu) {
      const showTime = new Date(ve.gio_chieu);
      const now = new Date();
      const hoursLeft = (showTime - now) / 3600000;
      if (hoursLeft < 4) {
        return res.status(400).json({ success: false, message: 'Không thể hủy vé. Phải hủy trước giờ chiếu ít nhất 4 tiếng' });
      }
    }

    await execute('UPDATE ve SET trang_thai = 3 WHERE id = ?', [id]);

    // Hoàn điểm
    const pointsRefund = Math.floor((ve.price || 0) * 0.01);
    if (pointsRefund > 0 && ve.id_tk) {
      await execute(
        'UPDATE taikhoan SET id_diem = COALESCE(id_diem,0)+?, diem_tich_luy = COALESCE(diem_tich_luy,0)+? WHERE id=?',
        [pointsRefund, pointsRefund, ve.id_tk]
      );
      await execute(
        `INSERT INTO lich_su_diem (id_tk, loai_giao_dich, so_diem, ly_do, id_ve, nguoi_thuc_hien)
         VALUES (?, 'cong', ?, ?, ?, 'system')`,
        [ve.id_tk, pointsRefund, `Hoàn điểm do hủy vé #VE${id}`, id]
      );
    }

    return res.json({ success: true, message: `Hủy vé thành công! Đã hoàn ${pointsRefund} điểm`, data: { points_refund: pointsRefund } });
  } catch (err) {
    console.error('[VE] huyVe error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * GET /api/ve/admin — All tickets (admin)
 */
const getAllAdmin = async (req, res) => {
  try {
    const { id_rap, trang_thai, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let sql = `SELECT v.id, p.tieu_de, lc.ngay_chieu, kgc.thoi_gian_chieu,
                      tk.name AS ten_tk, tk.email, v.ghe, v.price, v.trang_thai,
                      v.ngay_dat, v.combo, phong.name AS tenphong, r.ten_rap
               FROM ve v
               LEFT JOIN khung_gio_chieu kgc ON kgc.id = v.id_thoi_gian_chieu
               LEFT JOIN taikhoan tk ON tk.id = v.id_tk
               LEFT JOIN phim p ON p.id = v.id_phim
               LEFT JOIN lichchieu lc ON lc.id = kgc.id_lich_chieu
               LEFT JOIN phongchieu phong ON phong.id = kgc.id_phong
               LEFT JOIN rap_chieu r ON r.id = v.id_rap
               WHERE 1=1`;
    const params = [];

    // Cinema managers only see their cinema's tickets
    if (req.user?.vai_tro === 3 && req.user?.id_rap) {
      sql += ' AND v.id_rap = ?'; params.push(req.user.id_rap);
    } else if (id_rap) {
      sql += ' AND v.id_rap = ?'; params.push(id_rap);
    }
    if (trang_thai !== undefined && trang_thai !== '') { sql += ' AND v.trang_thai = ?'; params.push(trang_thai); }
    if (search) { sql += ' AND (tk.name LIKE ? OR tk.email LIKE ? OR p.tieu_de LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    sql += ` ORDER BY v.id DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`;
    const ve = await query(sql, params);
    return res.json({ success: true, data: ve });
  } catch (err) {
    console.error('[VE] getAllAdmin error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

/**
 * PUT /api/ve/:id/trang-thai — Update ticket status (admin/staff)
 */
const updateTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;
    await execute('UPDATE ve SET trang_thai = ? WHERE id = ?', [trang_thai, id]);
    return res.json({ success: true, message: 'Cập nhật trạng thái vé thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { datVe, datVePOS, getMyVe, getOne, huyVe, getAllAdmin, updateTrangThai };
