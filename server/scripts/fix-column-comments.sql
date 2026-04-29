-- 修复 cities 表字段注释
ALTER TABLE cities
  MODIFY COLUMN name VARCHAR(50) NOT NULL COMMENT '城市名称',
  MODIFY COLUMN code VARCHAR(20) NOT NULL COMMENT '城市编码',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 policies 表字段注释
ALTER TABLE policies
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '标题',
  MODIFY COLUMN content TEXT COMMENT '内容',
  MODIFY COLUMN images TEXT COMMENT '图片列表，JSON格式',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 application_flows 表字段注释
ALTER TABLE application_flows
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN step_number INT NOT NULL COMMENT '步骤序号',
  MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '步骤标题',
  MODIFY COLUMN content TEXT COMMENT '步骤内容',
  MODIFY COLUMN images TEXT COMMENT '图片列表，JSON格式',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 product_intros 表字段注释
ALTER TABLE product_intros
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '标题',
  MODIFY COLUMN content TEXT COMMENT '内容',
  MODIFY COLUMN images TEXT COMMENT '图片列表，JSON格式',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 hot_products 表字段注释
ALTER TABLE hot_products
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN name VARCHAR(200) NOT NULL COMMENT '产品名称',
  MODIFY COLUMN description TEXT COMMENT '产品描述',
  MODIFY COLUMN cover_image VARCHAR(500) COMMENT '封面图片',
  MODIFY COLUMN images TEXT COMMENT '详情图片列表，JSON格式',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 product_videos 表字段注释
ALTER TABLE product_videos
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '视频标题',
  MODIFY COLUMN video_url VARCHAR(500) NOT NULL COMMENT '视频地址',
  MODIFY COLUMN cover_image VARCHAR(500) COMMENT '封面图片',
  MODIFY COLUMN description TEXT COMMENT '视频描述',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 company_intros 表字段注释
ALTER TABLE company_intros
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN title VARCHAR(200) NOT NULL COMMENT '标题',
  MODIFY COLUMN content TEXT COMMENT '内容',
  MODIFY COLUMN images TEXT COMMENT '图片列表，JSON格式',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 site_locations 表字段注释
ALTER TABLE site_locations
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID',
  MODIFY COLUMN name VARCHAR(200) NOT NULL COMMENT '站点名称',
  MODIFY COLUMN address VARCHAR(500) NOT NULL COMMENT '详细地址',
  MODIFY COLUMN latitude DECIMAL(10, 7) COMMENT '纬度',
  MODIFY COLUMN longitude DECIMAL(10, 7) COMMENT '经度',
  MODIFY COLUMN phone VARCHAR(50) COMMENT '联系电话',
  MODIFY COLUMN business_hours VARCHAR(200) COMMENT '营业时间',
  MODIFY COLUMN images TEXT COMMENT '站点图片，JSON格式',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用';

-- 修复 admin_users 表字段注释
ALTER TABLE admin_users
  MODIFY COLUMN username VARCHAR(50) NOT NULL COMMENT '用户名',
  MODIFY COLUMN password VARCHAR(255) NOT NULL COMMENT '密码',
  MODIFY COLUMN role ENUM('super_admin','admin') DEFAULT 'admin' COMMENT '角色 super_admin超级管理员 admin普通管理员',
  MODIFY COLUMN cities JSON COMMENT '城市权限列表，JSON格式';

-- 修复 admin_city_permissions 表字段注释
ALTER TABLE admin_city_permissions
  MODIFY COLUMN admin_id INT NOT NULL COMMENT '管理员ID',
  MODIFY COLUMN city_id INT NOT NULL COMMENT '城市ID';
