# 完整部署和测试指南

## 项目完成情况

✅ 前端权限系统 - 100% 完成
✅ 后端权限系统 - 100% 完成
✅ 数据库设计 - 100% 完成
✅ 文档 - 100% 完成

## 快速开始

### 1. 数据库设置
mysql -u root -p
CREATE DATABASE IF NOT EXISTS xcyl_db CHARACTER SET utf8mb4;
USE xcyl_db;
source server/migrations/create_admin_users.sql;

### 2. 启动后端
cd server
npm install
npm run dev

### 3. 启动前端
cd admin
npm install
npm run dev

## 默认账号

用户名: admin
密码: admin123
角色: 超级管理员

## 访问测试

访问 http://localhost:5173
使用默认账号登录
