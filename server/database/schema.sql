-- 创建数据库
CREATE DATABASE IF NOT EXISTS xcyl_h5 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE xcyl_h5;

-- 城市表
CREATE TABLE IF NOT EXISTS cities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '城市名称',
  code VARCHAR(20) NOT NULL UNIQUE COMMENT '城市编码',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='城市表';

-- 政策介绍表
CREATE TABLE IF NOT EXISTS policies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  images TEXT COMMENT '图片列表，JSON格式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策介绍表';

-- 申请流程表
CREATE TABLE IF NOT EXISTS application_flows (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  step_number INT NOT NULL COMMENT '步骤序号',
  title VARCHAR(200) NOT NULL COMMENT '步骤标题',
  content TEXT COMMENT '步骤内容',
  images TEXT COMMENT '图片列表，JSON格式',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='申请流程表';

-- 产品介绍表
CREATE TABLE IF NOT EXISTS product_intros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  images TEXT COMMENT '图片列表，JSON格式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品介绍表';

-- 热门产品表
CREATE TABLE IF NOT EXISTS hot_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  name VARCHAR(200) NOT NULL COMMENT '产品名称',
  description TEXT COMMENT '产品描述',
  cover_image VARCHAR(500) COMMENT '封面图片',
  images TEXT COMMENT '详情图片列表，JSON格式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='热门产品表';

-- 产品视频表
CREATE TABLE IF NOT EXISTS product_videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  title VARCHAR(200) NOT NULL COMMENT '视频标题',
  video_url VARCHAR(500) NOT NULL COMMENT '视频地址',
  cover_image VARCHAR(500) COMMENT '封面图片',
  description TEXT COMMENT '视频描述',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品视频表';

-- 公司介绍表
CREATE TABLE IF NOT EXISTS company_intros (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  images TEXT COMMENT '图片列表，JSON格式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公司介绍表';

-- 站点位置表
CREATE TABLE IF NOT EXISTS site_locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city_id INT NOT NULL COMMENT '城市ID',
  name VARCHAR(200) NOT NULL COMMENT '站点名称',
  address VARCHAR(500) NOT NULL COMMENT '详细地址',
  latitude DECIMAL(10, 7) COMMENT '纬度',
  longitude DECIMAL(10, 7) COMMENT '经度',
  phone VARCHAR(50) COMMENT '联系电话',
  business_hours VARCHAR(200) COMMENT '营业时间',
  images TEXT COMMENT '站点图片，JSON格式',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站点位置表';

-- 插入初始城市数据
INSERT INTO cities (name, code, sort_order) VALUES
('北京', 'beijing', 1),
('上海', 'shanghai', 2),
('广州', 'guangzhou', 3),
('深圳', 'shenzhen', 4);

-- 插入示例数据（北京）
INSERT INTO policies (city_id, title, content, sort_order) VALUES
(1, '康力元政策介绍', '这里是康力元在北京地区的相关政策介绍内容...', 1);

INSERT INTO application_flows (city_id, step_number, title, content) VALUES
(1, 1, '提交申请', '填写申请表单，提交相关资料'),
(1, 2, '资料审核', '工作人员审核申请资料'),
(1, 3, '审批通过', '审批通过后通知申请人'),
(1, 4, '完成办理', '到指定地点完成办理');

INSERT INTO product_intros (city_id, title, content, sort_order) VALUES
(1, '康力元产品介绍', '康力元致力于提供优质的产品和服务...', 1);

INSERT INTO hot_products (city_id, name, description, sort_order) VALUES
(1, '热门产品A', '这是一款热门产品，深受用户喜爱...', 1),
(1, '热门产品B', '这是另一款热门产品...', 2);

INSERT INTO product_videos (city_id, title, video_url, description, sort_order) VALUES
(1, '产品介绍视频', 'https://example.com/video1.mp4', '详细介绍我们的产品特点', 1);

INSERT INTO company_intros (city_id, title, content, sort_order) VALUES
(1, '关于康力元', '康力元公司成立于...，致力于...', 1);

INSERT INTO site_locations (city_id, name, address, latitude, longitude, phone, business_hours, sort_order) VALUES
(1, '北京总部', '北京市朝阳区xxx路xxx号', 39.904989, 116.405285, '010-12345678', '周一至周五 9:00-18:00', 1);
