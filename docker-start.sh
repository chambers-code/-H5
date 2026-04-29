#!/bin/bash

echo "======================================"
echo "康力元H5平台 - Docker启动脚本"
echo "======================================"
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装Docker，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ 错误: 未安装docker-compose，请先安装docker-compose"
    exit 1
fi

echo "✅ Docker已安装"
echo ""

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

echo ""
echo "🚀 启动Docker容器..."
echo ""

# 启动所有服务
docker-compose up -d

echo ""
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo ""
echo "📊 检查服务状态..."
docker-compose ps

echo ""
echo "======================================"
echo "✅ Docker部署完成！"
echo "======================================"
echo ""
echo "访问地址："
echo "  前台H5:     http://localhost:5173"
echo "  后台管理:   http://localhost:5174"
echo "  API服务:    http://localhost:3000"
echo ""
echo "常用命令："
echo "  查看日志:   docker-compose logs -f"
echo "  停止服务:   docker-compose down"
echo "  重启服务:   docker-compose restart"
echo "  查看状态:   docker-compose ps"
echo ""
echo "======================================"
