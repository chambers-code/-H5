# 管理后台权限系统 - 快速启动指南

## 前端已完成功能

✅ 所有前端权限控制功能已完成，包括：
- 登录认证系统
- 账号管理页面
- 路由守卫
- 所有页面的城市权限过滤
- 用户信息显示和退出登录

## 后端需要实现的接口

### 1. 管理员登录接口

**POST** `/api/admin/login`

请求体：
```json
{
  "username": "admin",
  "password": "123456"
}
```

响应（成功）：
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "super_admin",
      "cities": null
    }
  }
}
```

响应（失败）：
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

### 2. 获取管理员列表

**GET** `/api/admin/users`

请求头：
```
Authorization: Bearer {token}
```

响应：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role": "super_admin",
      "cities": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "username": "beijing_admin",
      "role": "admin",
      "cities": ["北京", "天津"],
      "created_at": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

### 3. 创建管理员

**POST** `/api/admin/users`

请求头：
```
Authorization: Bearer {token}
```

请求体：
```json
{
  "username": "new_admin",
  "password": "123456",
  "role": "admin",
  "cities": ["上海", "杭州"]
}
```

响应：
```json
{
  "success": true,
  "data": {
    "id": 3,
    "username": "new_admin",
    "role": "admin",
    "cities": ["上海", "杭州"]
  }
}
```

### 4. 更新管理员

**PUT** `/api/admin/users/:id`

请求头：
```
Authorization: Bearer {token}
```

请求体：
```json
{
  "role": "admin",
  "cities": ["上海", "杭州", "苏州"],
  "password": "new_password"
}
```

响应：
```json
{
  "success": true,
  "data": {
    "id": 3,
    "username": "new_admin",
    "role": "admin",
    "cities": ["上海", "杭州", "苏州"]
  }
}
```

### 5. 删除管理员

**DELETE** `/api/admin/users/:id`

请求头：
```
Authorization: Bearer {token}
```

响应：
```json
{
  "success": true,
  "message": "删除成功"
}
```

## 数据库表结构

```sql
CREATE TABLE admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT '使用 bcrypt 加密',
  role ENUM('super_admin', 'admin') DEFAULT 'admin',
  cities JSON COMMENT '普通管理员可管理的城市列表，超级管理员为 NULL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员账号表';
```

## 初始化数据

```sql
-- 创建默认超级管理员（密码：admin123，需要使用 bcrypt 加密）
INSERT INTO admin_users (username, password, role, cities) 
VALUES ('admin', '$2b$10$YourBcryptHashHere', 'super_admin', NULL);

-- 创建测试普通管理员（密码：123456）
INSERT INTO admin_users (username, password, role, cities) 
VALUES ('beijing_admin', '$2b$10$YourBcryptHashHere', 'admin', '["北京", "天津"]');
```

## JWT Token 说明

Token 应包含以下信息：
```json
{
  "id": 1,
  "username": "admin",
  "role": "super_admin",
  "cities": null,
  "iat": 1234567890,
  "exp": 1234654290
}
```

建议 Token 有效期：7天

## 权限验证中间件

后端需要实现以下中间件：

### 1. 认证中间件 (authMiddleware)
- 验证 token 是否有效
- 解析 token 获取用户信息
- 将用户信息附加到 request 对象

### 2. 超级管理员权限中间件 (superAdminMiddleware)
- 检查用户角色是否为 super_admin
- 用于保护账号管理相关接口

### 3. 城市权限中间件 (cityPermissionMiddleware)
- 根据用户角色和管理城市过滤数据
- 超级管理员返回所有数据
- 普通管理员只返回其管理城市的数据

## 测试步骤

### 1. 启动后端服务
```bash
cd server
npm install
npm run dev
```

### 2. 启动前端服务
```bash
cd admin
npm install
npm run dev
```

### 3. 测试登录
- 访问 http://localhost:5173
- 使用超级管理员账号登录：admin / admin123
- 检查是否成功跳转到首页

### 4. 测试权限
- 超级管理员应该能看到"账号管理"菜单
- 超级管理员应该能看到所有城市
- 创建一个普通管理员，分配部分城市
- 使用普通管理员登录，检查是否只能看到分配的城市

### 5. 测试账号管理
- 创建新管理员
- 编辑管理员信息
- 删除管理员
- 尝试删除超级管理员（应该被禁用）

## 常见问题

### Q: Token 存储在哪里？
A: 存储在 localStorage 中，key 为 `admin_token` 和 `admin_user`

### Q: 如何处理 Token 过期？
A: 前端已实现自动处理，当收到 401 响应时会自动清除 token 并跳转到登录页

### Q: 城市数据如何过滤？
A: 前端使用 `filterCitiesByPermission()` 函数过滤，后端也需要在 API 层面进行过滤

### Q: 密码如何加密？
A: 建议使用 bcrypt 库，加密强度为 10

## 安全建议

1. **密码加密**：使用 bcrypt 加密，不要存储明文密码
2. **Token 安全**：使用 HTTPS 传输，设置合理的过期时间
3. **SQL 注入防护**：使用参数化查询
4. **XSS 防护**：对用户输入进行转义
5. **CSRF 防护**：添加 CSRF token
6. **登录限制**：添加登录失败次数限制，防止暴力破解
7. **操作日志**：记录所有管理员操作，便于审计

## 联系方式

如有问题，请查看 PERMISSION_SYSTEM.md 文档或联系开发团队。
