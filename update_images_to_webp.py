#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML画像タグ更新スクリプト
背景画像のCSS (.hero-background) を WebP 対応に更新
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 更新対象のHTMLファイル
TARGET_FILES = [
    'services/access.html',
    'services/index.html',
    'services/lowcode.html',
    'services/scratch.html',
    'services/webapp.html',
    'works/index.html',
]

# 背景画像のマッピング（旧パス → 新パス（WebP））
BACKGROUND_IMAGE_MAP = {
    '../assets/images/hero/access_hero_bg.jpeg': '../assets/images/hero/access_hero_bg.webp',
    '../assets/images/hero/services_hero_bg.jpg': '../assets/images/hero/services_hero_bg.webp',
    '../assets/images/hero/mobileapp_hero_bg.jpg': '../assets/images/hero/mobileapp_hero_bg.webp',
    '../assets/images/hero/talon_hero_bg.jpeg': '../assets/images/hero/talon_hero_bg.webp',
}

def backup_file(file_path):
    """ファイルのバックアップを作成"""
    backup_dir = Path('./backup')
    backup_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_name = str(file_path).replace('/', '_').replace('\\', '_')
    backup_path = backup_dir / f"{safe_name}.backup_{timestamp}"
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  ✅ バックアップ: {backup_path}")
    return backup_path

def update_background_image(content, old_path, new_webp_path):
    """
    背景画像のCSSを更新
    linear-gradient と background-image を WebP 対応に変更
    """
    # パターン1: background-image: linear-gradient(...), url('old.jpg');
    pattern1 = r"background-image:\s*linear-gradient\([^)]+\),\s*url\(['\"]?" + re.escape(old_path) + r"['\"]?\);"
    
    # 新しいCSS（フォールバック付き）
    old_ext = old_path.split('.')[-1]
    replacement1 = f"""background-image: linear-gradient(rgba(26,26,26, 0.4), rgba(26,26,26, 0.2)), url('{old_path}'); /* フォールバック */
      background-image: linear-gradient(rgba(26,26,26, 0.4), rgba(26,26,26, 0.2)), image-set(
        url('{new_webp_path}') type('image/webp'),
        url('{old_path}') type('image/{old_ext}')
      );"""
    
    # 置換実行
    if re.search(pattern1, content):
        content = re.sub(pattern1, replacement1, content)
        return content, True
    
    return content, False

def update_html_file(file_path):
    """HTMLファイルの背景画像を更新"""
    print(f"\n{'='*60}")
    print(f"📄 処理中: {file_path}")
    
    if not file_path.exists():
        print(f"  ❌ ファイルが見つかりません")
        return 'not_found'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  ❌ ファイル読み込みエラー: {e}")
        return 'error'
    
    # バックアップ作成
    try:
        backup_file(file_path)
    except Exception as e:
        print(f"  ⚠️  バックアップ作成失敗: {e}")
    
    # 各背景画像を更新
    updated = False
    for old_path, new_path in BACKGROUND_IMAGE_MAP.items():
        new_content, was_updated = update_background_image(content, old_path, new_path)
        if was_updated:
            content = new_content
            updated = True
            print(f"  ✅ 更新: {old_path} → {new_path}")
    
    if not updated:
        print(f"  ⏭️  更新対象の背景画像が見つかりません")
        return 'skipped'
    
    # ファイル保存
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ WebP対応の背景画像に更新しました")
        return 'success'
    except Exception as e:
        print(f"  ❌ ファイル保存エラー: {e}")
        return 'error'

def main():
    """メイン処理"""
    print("="*60)
    print("🚀 HTML画像最適化スクリプト（背景画像WebP対応）")
    print("="*60)
    
    current_dir = Path.cwd()
    print(f"\n📁 実行ディレクトリ: {current_dir}")
    
    # index.htmlの存在確認
    if not Path('index.html').exists():
        print("\n❌ エラー: index.htmlが見つかりません")
        print("   このスクリプトはプロジェクトルート（index.htmlがある場所）で実行してください")
        return
    
    print("\n✅ プロジェクトルートを確認しました")
    
    # 処理カウンター
    results = {
        'success': 0,
        'skipped': 0,
        'error': 0,
        'not_found': 0
    }
    
    # 各ファイルを処理
    for file_name in TARGET_FILES:
        file_path = Path(file_name)
        result = update_html_file(file_path)
        results[result] = results.get(result, 0) + 1
    
    # サマリー表示
    print(f"\n{'='*60}")
    print("📊 処理結果サマリー")
    print(f"{'='*60}")
    print(f"✅ 更新成功:     {results['success']:2d} ファイル")
    print(f"⏭️  スキップ:     {results['skipped']:2d} ファイル")
    print(f"❌ エラー:       {results['error']:2d} ファイル")
    print(f"📂 未検出:       {results['not_found']:2d} ファイル")
    print(f"{'─'*60}")
    print(f"📁 合計:         {len(TARGET_FILES):2d} ファイル")
    print(f"{'='*60}")
    
    if results['success'] > 0:
        print("\n✅ 完了! 背景画像がWebP対応になりました!")
        print("\n📋 次のステップ:")
        print("   1. WebP変換手順書に従って画像を変換")
        print("   2. WebP画像をサーバーにアップロード")
        print("   3. ブラウザで表示確認")
        print("   4. GitHubにpush")
        print("\n💡 バックアップは ./backup/ フォルダに保存されています")
        print("\n⚠️  重要:")
        print("   WebP画像がない状態でも、フォールバックで元の画像が表示されます")
        print("   WebP画像をアップロードすると、対応ブラウザで自動的にWebPが使用されます")
    
    if results['skipped'] == len(TARGET_FILES):
        print("\n✅ 全てのファイルが既に最適化されているか、更新対象の画像がありません")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  処理を中断しました")
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        import traceback
        traceback.print_exc()
