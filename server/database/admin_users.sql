-- 管理员账号表
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '账号',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  remark VARCHAR(200) COMMENT '备注',
  is_super TINYINT DEFAULT 0 COMMENT '是否超级管理员 1是 0否',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账号表';

-- 管理员城市权限表
CREATE TABLE IF NOT EXISTS admin_city_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL COMMENT '管理员ID',
  city_id INT NOT NULL COMMENT '城市ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_admin_city (admin_id, city_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员城市权限表';

-- 插入超级管理员账号（密码：kangliyuan）
INSERT INTO admin_users (username, password, remark, is_super) VALUES
('admin', 'kangliyuan', '超级管理员', 1);
