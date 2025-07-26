import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate(req, res, next) {
  // Lấy token từ cookie
  const token = req.cookies?.token; // req.cookies cần dùng middleware cookie-parser
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}


export function authorize(roles = []) {
  // Đảm bảo roles là mảng (nếu truyền vào 1 role dạng string)
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    // Chưa xác thực thì trả về lỗi luôn
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Nếu không truyền role nào, mặc định cho phép tất cả (tùy bạn, có thể chỉnh lại)
    if (roles.length === 0) {
      return next();
    }

    // Có thể hỗ trợ nhiều role cho 1 user (ví dụ req.user.roles là mảng)
    // Nếu bạn chỉ có 1 role, giữ nguyên req.user.role là string
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.role];

    // Kiểm tra user có ít nhất 1 role phù hợp không
    const hasRole = roles.some(role => userRoles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Được phép
    next();
  };
}
