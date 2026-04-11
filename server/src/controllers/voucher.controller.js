const { queryOne } = require('../config/db');

const checkVoucher = async (req, res) => {
  try {
    const { code } = req.params;
    const today = new Date().toISOString().slice(0, 10);
    
    // 1. Kiểm tra bảng VOUCHER
    const voucher = await queryOne(
      `SELECT * FROM voucher 
       WHERE ma_voucher = ? AND trang_thai = 1 
       AND ngay_het_han >= ?`,
      [code, today]
    );

    if (voucher) {
      if (voucher.so_luong !== -1 && voucher.da_su_dung >= voucher.so_luong) {
        return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng' });
      }
      return res.json({
        success: true,
        type: 'voucher',
        data: {
          id: voucher.id,
          ma_voucher: voucher.ma_voucher,
          gia_tri: parseFloat(voucher.gia_tri),
          loai_giam: voucher.loai_giam,
        }
      });
    }

    // 2. Kiểm tra bảng KHUYEN_MAI (nếu không thấy ở voucher)
    const km = await queryOne(
      `SELECT * FROM khuyen_mai 
       WHERE ma_khuyen_mai = ? AND trang_thai = 1 
       AND ngay_bat_dau <= ? AND ngay_ket_thuc >= ?`,
      [code, today, today]
    );

    if (km) {
      return res.json({
        success: true,
        type: 'khuyen_mai',
        data: {
          id: km.id,
          ma_voucher: km.ma_khuyen_mai,
          gia_tri: parseFloat(km.loai_giam === 'phan_tram' ? km.phan_tram_giam : km.gia_tri_giam),
          loai_giam: km.loai_giam,
        }
      });
    }

    return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc đã hết hạn' });
  } catch (err) {
    console.error('[Voucher] check error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { checkVoucher };
