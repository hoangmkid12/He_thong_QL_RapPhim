const { query, queryOne } = require('../config/db');

const getSummary = async (req, res) => {
  try {
    let { id_rap, from, to } = req.query;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    const params = [];
    let rapWhere = '';
    let dateWhere = '';
    if (id_rap) { rapWhere = ' AND lc.id_rap = ?'; params.push(id_rap); }
    if (from) { dateWhere += ' AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat)) >= ?'; params.push(from); }
    if (to) { dateWhere += ' AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat)) <= ?'; params.push(to); }

    const [revenue, tickets, movies, customers] = await Promise.all([
      queryOne(
        `SELECT COALESCE(SUM(COALESCE(hd.thanh_tien,v.price)),0) AS total
         FROM ve v LEFT JOIN hoa_don hd ON hd.id=v.id_hd
         LEFT JOIN khung_gio_chieu kg ON kg.id=v.id_thoi_gian_chieu
         LEFT JOIN lichchieu lc ON lc.id=kg.id_lich_chieu
         WHERE v.trang_thai IN (1,2,4)${rapWhere}${dateWhere}`,
        [...params]
      ),
      queryOne(
        `SELECT COUNT(v.id) AS total FROM ve v
         LEFT JOIN khung_gio_chieu kg ON kg.id=v.id_thoi_gian_chieu
         LEFT JOIN lichchieu lc ON lc.id=kg.id_lich_chieu
         LEFT JOIN hoa_don hd ON hd.id=v.id_hd
         WHERE v.trang_thai IN (1,2,4)${rapWhere}${dateWhere}`,
        [...params]
      ),
      queryOne(
        `SELECT COUNT(DISTINCT lc.id_phim) AS total FROM lichchieu lc
         WHERE 1=1${id_rap ? ' AND lc.id_rap=?' : ''}${from ? ' AND DATE(lc.ngay_chieu)>=?' : ''}${to ? ' AND DATE(lc.ngay_chieu)<=?' : ''}`,
        [...(id_rap ? [id_rap] : []), ...(from ? [from] : []), ...(to ? [to] : [])]
      ),
      queryOne('SELECT COUNT(*) AS total FROM taikhoan WHERE vai_tro = 0'),
    ]);

    return res.json({
      success: true,
      data: {
        total_revenue: parseInt(revenue?.total || 0),
        total_tickets: parseInt(tickets?.total || 0),
        total_movies: parseInt(movies?.total || 0),
        total_customers: parseInt(customers?.total || 0),
      },
    });
  } catch (err) {
    console.error('[TK] getSummary error:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getRevenueByDate = async (req, res) => {
  try {
    let { from, to, id_rap } = req.query;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    if (!from || !to) return res.status(400).json({ success: false, message: 'Cần truyền from và to' });
    const params = [from, to];
    let rapWhere = '';
    if (id_rap) { rapWhere = ' AND lc.id_rap=?'; params.push(id_rap); }
    const data = await query(
      `SELECT DATE(COALESCE(hd.ngay_tt,v.ngay_dat)) AS ngay,
              COUNT(v.id) AS so_ve,
              COALESCE(SUM(COALESCE(hd.thanh_tien,v.price)),0) AS revenue
       FROM ve v LEFT JOIN hoa_don hd ON hd.id=v.id_hd
       LEFT JOIN khung_gio_chieu kg ON kg.id=v.id_thoi_gian_chieu
       LEFT JOIN lichchieu lc ON lc.id=kg.id_lich_chieu
       WHERE v.trang_thai IN (1,2,4)
         AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat)) BETWEEN ? AND ?${rapWhere}
       GROUP BY DATE(COALESCE(hd.ngay_tt,v.ngay_dat))
       ORDER BY ngay ASC`,
      params
    );
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getRevenueByRap = async (req, res) => {
  try {
    let { from, to, id_rap } = req.query;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    const params = [];
    let dateWhere = '';
    if (from) { dateWhere += ' AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat))>=?'; params.push(from); }
    if (to) { dateWhere += ' AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat))<=?'; params.push(to); }
    let rapFilter = '';
    if (id_rap) { rapFilter = ' AND r.id = ?'; params.push(id_rap); }
    const data = await query(
      `SELECT r.id, r.ten_rap,
              COUNT(CASE WHEN v.trang_thai IN (1,2,4) THEN v.id END) AS so_ve,
              COALESCE(SUM(CASE WHEN v.trang_thai IN (1,2,4) THEN COALESCE(hd.thanh_tien,v.price) END),0) AS doanh_thu
        FROM rap_chieu r
        LEFT JOIN lichchieu lc ON lc.id_rap=r.id
        LEFT JOIN khung_gio_chieu kg ON kg.id_lich_chieu=lc.id
        LEFT JOIN ve v ON v.id_thoi_gian_chieu=kg.id
        LEFT JOIN hoa_don hd ON hd.id=v.id_hd
        WHERE r.trang_thai = 1 ${dateWhere}${rapFilter}
        GROUP BY r.id,r.ten_rap ORDER BY doanh_thu DESC`,
      params
    );
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getTopMovies = async (req, res) => {
  try {
    let { from, to, id_rap, limit = 10 } = req.query;
    if (req.user?.vai_tro === 3) id_rap = req.user.id_rap;
    const params = [];
    const where = ['v.trang_thai IN (1,2,4)'];
    if (from && to) { where.push('DATE(v.ngay_dat) BETWEEN ? AND ?'); params.push(from, to); }
    if (id_rap) { where.push('lc.id_rap=?'); params.push(id_rap); }
    const data = await query(
      `SELECT p.id, p.tieu_de, p.img, COUNT(v.id) AS so_ve,
              COALESCE(SUM(COALESCE(hd.thanh_tien,v.price)),0) AS doanh_thu
       FROM phim p
       LEFT JOIN lichchieu lc ON lc.id_phim=p.id
       LEFT JOIN khung_gio_chieu kg ON kg.id_lich_chieu=lc.id
       LEFT JOIN ve v ON v.id_thoi_gian_chieu=kg.id
       LEFT JOIN hoa_don hd ON hd.id=v.id_hd
       WHERE ${where.join(' AND ')}
       GROUP BY p.id,p.tieu_de,p.img
       ORDER BY so_ve DESC LIMIT ${parseInt(limit)}`,
      params
    );
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getRevenueByPhimRap = async (req, res) => {
  try {
    const { id_rap, from, to } = req.query;
    const params = [id_rap];
    let dateWhere = '';
    if (from && to) { dateWhere = ' AND DATE(COALESCE(hd.ngay_tt,v.ngay_dat)) BETWEEN ? AND ?'; params.push(from, to); }
    const data = await query(
      `SELECT p.id AS id_phim, p.tieu_de,
              COUNT(CASE WHEN v.trang_thai IN (1,2,4) THEN v.id END) AS so_ve,
              COALESCE(SUM(CASE WHEN v.trang_thai IN (1,2,4) THEN COALESCE(hd.thanh_tien,v.price) END),0) AS doanh_thu
       FROM phim p
       INNER JOIN lichchieu lc ON lc.id_phim=p.id AND lc.id_rap=?
       LEFT JOIN khung_gio_chieu kg ON kg.id_lich_chieu=lc.id
       LEFT JOIN ve v ON v.id_thoi_gian_chieu=kg.id
       LEFT JOIN hoa_don hd ON hd.id=v.id_hd
       WHERE 1=1${dateWhere}
       GROUP BY p.id,p.tieu_de ORDER BY doanh_thu DESC`,
      params
    );
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getSummary, getRevenueByDate, getRevenueByRap, getTopMovies, getRevenueByPhimRap };
