#!/bin/bash

echo "🚀 启动数学游戏服务器..."

# 启动 Vite 开发服务器
echo "📱 启动本地服务器..."
npm run dev -- --host 0.0.0.0 --port 3001 &

# 等待服务器启动
sleep 5

# 启动 localtunnel 公网隧道
echo "🌐 创建公网隧道..."
npx localtunnel --port 3001 &

echo "✅ 服务器启动完成！"
echo "📍 本地访问: http://localhost:3001"
echo "📍 局域网访问: http://172.22.173.161:3001"
echo "📍 公网访问: 查看上方 localtunnel 输出的网址"
echo ""
echo "按 Ctrl+C 停止服务器"

# 等待用户中断
wait 