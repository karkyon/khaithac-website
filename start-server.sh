#!/bin/bash

# カイタックジャパン Webサイト ローカルサーバー起動スクリプト
# 配置先: ~/khaithac-website/start-server.sh

echo "============================================"
echo "  カイタックジャパン Webサイト開発サーバー"
echo "============================================"
echo ""

# プロジェクトディレクトリに移動
cd ~/khaithac-website

# Pythonバージョン確認
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Pythonがインストールされていません"
    exit 1
fi

echo "✓ Python検出: $PYTHON_CMD"
echo ""

# ポート番号設定（デフォルト: 8000）
PORT=${1:-8000}

echo "🚀 サーバー起動中..."
echo "📁 ドキュメントルート: ~/khaithac-website"
echo "🌐 アクセスURL: http://localhost:$PORT"
echo ""
echo "停止するには Ctrl+C を押してください"
echo "============================================"
echo ""

# HTTPサーバー起動
$PYTHON_CMD -m http.server $PORT

