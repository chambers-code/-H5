-- 创建新的 admin_users 表
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码（bcrypt加密）',
  role ENUM('super_admin', 'admin') DEFAULT 'admin' COMMENT '角色：super_admin=超级管理员, admin=普通管理员',
  cities JSON COMMENT '普通管理员可管理的城市列表，超级管理员为 NULL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账号表';

-- 插入默认超级管理员账号
-- 用户名: admin
-- 密码: admin123
INSERT INTO admin_users (username, password, role, cities)
VALUES ('admin', '$2b$10$FfuIyzWgq6F7RZ5/qx.owe565SbRUX9yoY0MLerqbyQrmRHLhJlf6', 'super_admin', NULL)
ON DUPLICATE KEY UPDATE username=username;
