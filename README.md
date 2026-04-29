# 康力元H5展示平台

一个包含政策介绍、产品展示、公司介绍的多城市H5应用，支持后台内容管理。

## 项目结构

```
H5/
├── server/          # 后端服务（Node.js + Express + MySQL）
├── client/          # 前台H5页面（Vue 3 + Vant）
├── admin/           # 后台管理系统（Vue 3 + Element Plus）
└── package.json     # 根目录配置
```

## 功能特性

### 前台H5
- 多城市切换
- 政策介绍与申请流程
- 产品介绍、热门产品、产品视频
- 公司介绍与站点位置
- 响应式设计，适配移动端

### 后台管理
- 城市管理
- 政策内容管理
- 申请流程管理
- 产品信息管理
- 热门产品管理
- 产品视频管理
- 公司介绍管理
- 站点位置管理
- 图片上传功能

## 技术栈

- **前端**: Vue 3 + Vant 4 (H5) / Element Plus (后台)
- **后端**: Node.js + Express
- **数据库**: MySQL
- **构建工具**: Vite

## 快速开始

### 方式一：使用Docker部署（推荐）

#### 环境要求

- Docker >= 20.10
- docker-compose >= 1.29

#### 一键启动

```bash
# 使用Docker启动所有服务
./docker-start.sh
```

或手动启动：

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

Docker会自动：
- 启动MySQL数据库并导入初始数据
- 启动后端API服务
- 启动前台H5页面
- 启动后台管理系统

### 方式二：本地部署

#### 环境要求

- Node.js >= 16
- MySQL >= 5.7
- npm 或 yarn

#### 1. 安装依赖

```bash
# 安装所有项目依赖
npm run install-all
```

#### 2. 配置数据库

1. 创建MySQL数据库：

```bash
mysql -u root -p
```

2. 导入数据库结构：

```bash
mysql -u root -p < server/database/schema.sql
```

3. 配置数据库连接，编辑 `server/.env` 文件：

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=xcyl_h5
DB_PORT=3306
```

#### 3. 启动项目

##### 同时启动所有服务

```bash
npm run dev
```

这将同时启动：
- 后端服务：http://localhost:3000
- 前台H5：http://localhost:5173
- 后台管理：http://localhost:5174

##### 分别启动

```bash
# 启动后端服务
npm run server

# 启动前台H5（新终端）
npm run client

# 启动后台管理（新终端）
npm run admin
```

#### 4. 访问应用

- **前台H5**: http://localhost:5173
- **后台管理**: http://localhost:5174
- **API服务**: http://localhost:3000

## 目录说明

### 后端 (server/)

```
server/
├── config/          # 配置文件
│   └── db.js       # 数据库连接配置
├── routes/          # API路由
│   ├── cities.js
│   ├── policies.js
│   ├── applicationFlows.js
│   ├── productIntros.js
│   ├── hotProducts.js
│   ├── productVideos.js
│   ├── companyIntros.js
│   ├── siteLocations.js
│   └── upload.js
├── database/        # 数据库脚本
│   └── schema.sql
├── uploads/         # 上传文件目录
├── .env            # 环境变量配置
└── index.js        # 入口文件
```

### 前台H5 (client/)

```
client/
├── src/
│   ├── api/         # API接口
│   ├── router/      # 路由配置
│   ├── stores/      # 状态管理
│   ├── views/       # 页面组件
│   ├── utils/       # 工具函数
│   ├── styles/      # 样式文件
│   ├── App.vue      # 根组件
│   └── main.js      # 入口文件
└── index.html
```

### 后台管理 (admin/)

```
admin/
├── src/
│   ├── api/         # API接口
│   ├── router/      # 路由配置
│   ├── views/       # 页面组件
│   ├── utils/       # 工具函数
│   ├── App.vue      # 根组件
│   └── main.js      # 入口文件
└── index.html
```

## API接口

### 城市管理
- `GET /api/cities` - 获取城市列表
- `POST /api/cities` - 创建城市
- `PUT /api/cities/:id` - 更新城市
- `DELETE /api/cities/:id` - 删除城市

### 政策管理
- `GET /api/policies?city_id=1` - 获取政策列表
- `POST /api/policies` - 创建政策
- `PUT /api/policies/:id` - 更新政策
- `DELETE /api/policies/:id` - 删除政策

### 申请流程
- `GET /api/application-flows?city_id=1` - 获取申请流程
- `POST /api/application-flows` - 创建流程步骤
- `PUT /api/application-flows/:id` - 更新流程步骤
- `DELETE /api/application-flows/:id` - 删除流程步骤

### 产品管理
- `GET /api/product-intros?city_id=1` - 获取产品介绍
- `GET /api/hot-products?city_id=1` - 获取热门产品
- `GET /api/product-videos?city_id=1` - 获取产品视频

### 公司管理
- `GET /api/company-intros?city_id=1` - 获取公司介绍
- `GET /api/site-locations?city_id=1` - 获取站点位置

### 文件上传
- `POST /api/upload/single` - 单文件上传
- `POST /api/upload/multiple` - 多文件上传

## 数据库表结构

- `cities` - 城市表
- `policies` - 政策介绍表
- `application_flows` - 申请流程表
- `product_intros` - 产品介绍表
- `hot_products` - 热门产品表
- `product_videos` - 产品视频表
- `company_intros` - 公司介绍表
- `site_locations` - 站点位置表

## 开发说明

### 添加新城市

1. 在后台管理系统中进入"城市管理"
2. 点击"添加城市"，填写城市信息
3. 为该城市添加对应的内容（政策、产品、公司信息等）

### 内容管理

1. 登录后台管理系统
2. 选择对应的管理模块
3. 选择城市
4. 添加或编辑内容
5. 支持图片上传和富文本编辑

### 图片上传

- 支持的格式：jpg, jpeg, png, gif
- 单个文件大小限制：10MB
- 上传后的文件存储在 `server/uploads/` 目录

## 生产部署

### 构建前端

```bash
# 构建前台H5
cd client
npm run build

# 构建后台管理
cd ../admin
npm run build
```

### 部署后端

```bash
cd server
npm start
```

### 使用PM2部署（推荐）

```bash
# 安装PM2
npm install -g pm2

# 启动后端服务
cd server
pm2 start index.js --name xcyl-server

# 查看状态
pm2 status

# 查看日志
pm2 logs xcyl-server
```

## 常见问题

### 1. 数据库连接失败

检查 `server/.env` 文件中的数据库配置是否正确。

### 2. 图片上传失败

确保 `server/uploads/` 目录存在且有写入权限。

### 3. 端口被占用

修改对应的端口配置：
- 后端：`server/.env` 中的 `PORT`
- 前台：`client/vite.config.js` 中的 `server.port`
- 后台：`admin/vite.config.js` 中的 `server.port`

## 许可证

MIT
