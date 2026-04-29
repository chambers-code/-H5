const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 认证中间件 - 验证 token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // 将用户信息附加到请求对象
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '令牌无效或已过期'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '认证失败'
    });
  }
};

// 超级管理员权限中间件
const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: '需要超级管理员权限'
    });
  }
  next();
};

// 生成 JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      cities: user.cities
    },
    JWT_SECRET,
    { expiresIn: '7d' } // 7天过期
  );
};

module.exports = {
  authMiddleware,
  superAdminMiddleware,
  generateToken,
  JWT_SECRET
};
