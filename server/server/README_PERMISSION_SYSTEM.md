# 管理后台权限系统 - 完整实现

## 项目概述

本项目为康力元 H5 管理后台实现了完整的权限管理系统。

## 核心功能

### 1. 用户认证
- 登录/登出
- JWT Token 认证
- 密码 bcrypt 加密

### 2. 角色权限
- 超级管理员: 管理所有城市数据
- 普通管理员: 只能管理分配的城市数据

### 3. 数据权限
- 基于城市的数据过滤
- 所有管理页面都已实现权限控制

## 快速开始

### 1. 数据库初始化
mysql -u root -p
CREATE DATABASE xcyl_db CHARACTER SET utf8mb4;
USE xcyl_db;
source server/migrations/create_admin_users.sql;

### 2. 启动服务
cd server && npm install && npm run dev
cd admin && npm install && npm run dev

### 3. 登录测试
访问: http://localhost:5173
用户名: admin
密码: admin123

## 相关文档

- PERMISSION_SYSTEM.md
- QUICK_START.md
- BACKEND_IMPLEMENTATION.md
- DEPLOYMENT_GUIDE.md
