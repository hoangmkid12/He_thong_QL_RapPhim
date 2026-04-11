// Role constants - mirror PHP quyen.php
const ROLES = {
  GUEST: -1,
  CUSTOMER: 0,
  STAFF: 1,
  SYSTEM_ADMIN: 2,
  CINEMA_MANAGER: 3,
  CLUSTER_MANAGER: 4,
};

// Permission map - mirror PHP permission_map()
const PERMISSION_MAP = {
  // Movies & Genre - Admin + Cluster Manager
  QLphim:      [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  themphim:    [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  suaphim:     [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  xoaphim:     [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  QLloaiphim:  [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],

  // Cinema management
  QLrap:  [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  themrp: [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  suarp:  [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  xoarp:  [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],

  // Room & Schedule - Cinema Manager + Admin
  phong:           [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  themphong:       [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  suaphong:        [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  xoaphong:        [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  QLsuatchieu:     [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  themlichchieu:   [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  sualichchieu:    [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],

  // Tickets - Staff, Cinema Manager, Admin
  ve:             [ROLES.STAFF, ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],
  scanve:         [ROLES.STAFF, ROLES.CINEMA_MANAGER],
  capnhat_tt_ve:  [ROLES.STAFF, ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],

  // Staff features
  nv_lichlamviec:  [ROLES.STAFF],
  nv_chamcong:     [ROLES.STAFF],
  xinnghi:         [ROLES.STAFF],
  nv_datve:        [ROLES.STAFF],

  // Cinema manager features
  chamcong:        [ROLES.CINEMA_MANAGER],
  bangluong:       [ROLES.CINEMA_MANAGER],
  ql_lichlamviec:  [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],
  ql_duyetnghi:    [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],
  QLcombo:         [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],
  QLkm:            [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],
  QLfeed:          [ROLES.CINEMA_MANAGER, ROLES.SYSTEM_ADMIN],

  // User management
  QTkh:       [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  QTvien:     [ROLES.SYSTEM_ADMIN, ROLES.CINEMA_MANAGER, ROLES.CLUSTER_MANAGER],
  themuser:   [ROLES.SYSTEM_ADMIN, ROLES.CINEMA_MANAGER, ROLES.CLUSTER_MANAGER],
  suatk:      [ROLES.SYSTEM_ADMIN, ROLES.CINEMA_MANAGER, ROLES.CLUSTER_MANAGER],
  xoatk:      [ROLES.SYSTEM_ADMIN, ROLES.CINEMA_MANAGER, ROLES.CLUSTER_MANAGER],

  // Statistics
  DTdh:       [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  DTthang:    [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],
  TKrap:      [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER, ROLES.CINEMA_MANAGER],
  hieusuat_rap: [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],

  // Cluster manager
  duyet_kehoach: [ROLES.CLUSTER_MANAGER, ROLES.SYSTEM_ADMIN],
  phanphim:      [ROLES.CLUSTER_MANAGER],
  
  // System only
  cauhinh: [ROLES.SYSTEM_ADMIN],
  
  // News
  quan_ly_tin_tuc: [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER],

  // Dashboard
  home: [ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER, ROLES.CINEMA_MANAGER, ROLES.STAFF],
};

/**
 * Middleware factory: allow only specific roles
 * Usage: requireRole(ROLES.SYSTEM_ADMIN, ROLES.CLUSTER_MANAGER)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }
  if (!roles.includes(req.user.vai_tro)) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện chức năng này' });
  }
  next();
};

/**
 * Middleware factory: check permission by action name
 */
const requirePermission = (action) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }
  const allowed = PERMISSION_MAP[action];
  if (!allowed || !allowed.includes(req.user.vai_tro)) {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện chức năng này' });
  }
  next();
};

/**
 * Middleware: admin only (vai_tro > 0)
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Chưa đăng nhập' });
  }
  if (req.user.vai_tro <= 0) {
    return res.status(403).json({ success: false, message: 'Chỉ admin mới có quyền truy cập' });
  }
  next();
};

module.exports = { requireRole, requirePermission, requireAdmin, ROLES };
