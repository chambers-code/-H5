# 管理后台权限系统实现总结

## 已完成的功能

### 1. 登录认证系统
- ✅ 创建登录页面 (`admin/src/views/Login.vue`)
  - 用户名/密码登录表单
  - 登录成功后保存 token 和用户信息到 localStorage
  - 自动跳转到首页

### 2. 账号管理功能
- ✅ 创建账号管理页面 (`admin/src/views/AdminUsers.vue`)
  - 用户列表展示（用户名、角色、管理城市、创建时间）
  - 新增账号（用户名、密码、角色、管理城市）
  - 编辑账号（可修改角色和管理城市，密码可选）
  - 删除账号（超级管理员不可删除）
  - 仅超级管理员可访问

### 3. 路由守卫
- ✅ 更新路由配置 (`admin/src/router/index.js`)
  - 添加登录页面路由
  - 添加账号管理页面路由（需要超级管理员权限）
  - 实现路由守卫：
    - 未登录用户自动跳转到登录页
    - 已登录用户访问登录页自动跳转到首页
    - 非超级管理员访问账号管理页面自动跳转到首页

### 4. 权限控制系统
- ✅ 创建权限工具函数 (`admin/src/utils/permission.js`)
  - `getCurrentUser()` - 获取当前登录用户
  - `isSuperAdmin()` - 检查是否为超级管理员
  - `getAllowedCities()` - 获取用户可管理的城市列表
  - `canManageCity(cityName)` - 检查是否可以管理指定城市
  - `filterCitiesByPermission(cities)` - 过滤城市列表

- ✅ 更新所有管理页面，添加城市权限过滤：
  - `admin/src/views/Cities.vue` - 城市管理
  - `admin/src/views/Policies.vue` - 政策介绍
  - `admin/src/views/ApplicationFlows.vue` - 申请流程
  - `admin/src/views/ProductIntros.vue` - 产品介绍
  - `admin/src/views/HotProducts.vue` - 热门产品
  - `admin/src/views/ProductVideos.vue` - 产品视频
  - `admin/src/views/CompanyIntros.vue` - 公司介绍
  - `admin/src/views/SiteLocations.vue` - 站点位置

### 5. 用户界面更新
- ✅ 更新主布局 (`admin/src/App.vue`)
  - 添加账号管理菜单项（仅超级管理员可见）
  - 添加用户信息下拉菜单
  - 显示当前用户名和角色
  - 添加退出登录功能

### 6. HTTP 请求拦截
- ✅ 更新请求拦截器 (`admin/src/utils/request.js`)
  - 自动在请求头添加 Authorization token
  - 处理 401 未授权响应，自动跳转到登录页
  - 清除过期的 token 和用户信息

## 权限规则

### 角色类型
1. **超级管理员 (super_admin)**
   - 可以管理所有城市的数据
   - 可以访问账号管理页面
   - 可以创建/编辑/删除其他管理员账号
   - 可以添加新城市

2. **普通管理员 (admin)**
   - 只能管理分配给自己的城市数据
   - 不能访问账号管理页面
   - 不能添加新城市
   - 只能编辑/删除自己管理的城市数据

## 已更新的文件列表

### 新增文件
1. `admin/src/views/Login.vue` - 登录页面
2. `admin/src/views/AdminUsers.vue` - 账号管理页面
3. `admin/src/utils/permission.js` - 权限工具函数

### 修改文件
1. `admin/src/router/index.js` - 路由配置和守卫
2. `admin/src/utils/request.js` - HTTP 拦截器
3. `admin/src/App.vue` - 主布局（菜单和用户信息）
4. `admin/src/views/Cities.vue` - 城市管理权限控制
5. `admin/src/views/Policies.vue` - 政策管理权限控制
6. `admin/src/views/ApplicationFlows.vue` - 申请流程权限控制
7. `admin/src/views/ProductIntros.vue` - 产品介绍权限控制
8. `admin/src/views/HotProducts.vue` - 热门产品权限控制
9. `admin/src/views/ProductVideos.vue` - 产品视频权限控制
10. `admin/src/views/CompanyIntros.vue` - 公司介绍权限控制
11. `admin/src/views/SiteLocations.vue` - 站点位置权限控制

## 后端需要实现的 API

### 认证相关
- `POST /api/admin/login` - 管理员登录
  - 请求体: `{ username, password }`
  - 响应: `{ token, user: { id, username, role, cities } }`

### 账号管理相关
- `GET /api/admin/users` - 获取管理员列表（需要超级管理员权限）
- `POST /api/admin/users` - 创建管理员（需要超级管理员权限）
- `PUT /api/admin/users/:id` - 更新管理员（需要超级管理员权限）
- `DELETE /api/admin/users/:id` - 删除管理员（需要超级管理员权限）

### 其他 API 更新
- 所有现有 API 需要添加 token 验证
- 根据用户角色和管理城市过滤数据

## 数据库表结构建议

### admin_users 表
```sql
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- 加密存储
  role ENUM('super_admin', 'admin') DEFAULT 'admin',
  cities JSON,  -- 存储城市名称数组，如 ["北京", "上海"]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 初始化数据
```sql
-- 创建默认超级管理员账号（密码需要加密）
INSERT INTO admin_users (username, password, role, cities) 
VALUES ('admin', '$2b$10$...', 'super_admin', NULL);
```

## 测试建议

### 功能测试
1. **登录测试**
   - 正确的用户名密码可以登录
   - 错误的用户名密码无法登录
   - 登录后 token 正确保存

2. **权限测试**
   - 超级管理员可以看到所有城市
   - 普通管理员只能看到分配的城市
   - 超级管理员可以访问账号管理
   - 普通管理员无法访问账号管理

3. **路由守卫测试**
   - 未登录访问管理页面自动跳转登录
   - 已登录访问登录页自动跳转首页
   - Token 过期后自动跳转登录页

4. **账号管理测试**
   - 创建新管理员账号
   - 编辑管理员信息
   - 删除管理员账号
   - 超级管理员不可删除

## 下一步工作

1. ✅ 实现前端权限系统（已完成）
2. ⏳ 实现后端 API（登录、账号管理、权限验证）
3. ⏳ 添加操作日志记录
4. ⏳ 添加密码修改功能
5. ⏳ 添加更细粒度的权限控制（如只读权限）
6. ⏳ 添加密码强度验证
7. ⏳ 添加登录失败次数限制
