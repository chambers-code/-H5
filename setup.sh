#!/bin/bash

echo "======================================"
echo "康力元H5平台 - 本地部署脚本"
echo "======================================"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未安装Node.js，请先安装Node.js (>= 16)"
    exit 1
fi

echo "✅ Node.js版本: $(node -v)"

# 检查MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ 错误: 未安装MySQL，请先安装MySQL (>= 5.7)"
    exit 1
fi

echo "✅ MySQL已安装"
echo ""

# 安装依赖
echo "📦 安装项目依赖..."
echo ""

echo "安装根目录依赖..."
npm install

echo "安装后端依赖..."
cd server && npm install && cd ..

echo "安装前台依赖..."
cd client && npm install && cd ..

echo "安装后台依赖..."
cd admin && npm install && cd ..

echo ""
echo "✅ 依赖安装完成"
echo ""

# 配置数据库
echo "📊 配置数据库..."
echo ""

read -p "请输入MySQL用户名 (默认: root): " db_user
db_user=${db_user:-root}

read -sp "请输入MySQL密码: " db_password
echo ""

read -p "请输入数据库名 (默认: xcyl_h5): " db_name
db_name=${db_name:-xcyl_h5}

# 创建.env文件
cat > server/.env << EOF
PORT=3000
DB_HOST=localhost
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_NAME=$db_name
DB_PORT=3306
EOF

echo "✅ 数据库配置已保存到 server/.env"
echo ""

# 导入数据库
echo "📥 导入数据库结构..."
mysql -u "$db_user" -p"$db_password" < server/database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ 数据库导入成功"
else
    echo "❌ 数据库导入失败，请检查MySQL配置"
    exit 1
fi

echo ""
echo "======================================"
echo "✅ 部署完成！"
echo "======================================"
echo ""
echo "启动命令："
echo "  npm run dev          # 同时启动所有服务"
echo "  npm run server       # 仅启动后端"
echo "  npm run client       # 仅启动前台H5"
echo "  npm run admin        # 仅启动后台管理"
echo ""
echo "访问地址："
echo "  前台H5:     http://localhost:5173"
echo "  后台管理:   http://localhost:5174"
echo "  API服务:    http://localhost:3000"
echo ""
echo "======================================"
