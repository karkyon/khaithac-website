#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OGP・メタタグ追加スクリプト（case4, case5, case6専用）
works/case4.html, works/case5.html, works/case6.html の3ファイルにOGP・メタタグを追加
"""

import os
import re
from pathlib import Path
from datetime import datetime

# 3つのファイルのメタデータ定義
PAGE_METADATA = {
    'works/case4.html': {
        'title': 'TALON カンバン方式工程管理システム | 開発事例 | カイタックジャパン',
        'description': 'TALON×jKanbanによるカンバン方式工程管理システム開発事例。わずか1ヶ月で構築、生産性20%向上を実現しました。',
        'og_type': 'article',
        'og_image': 'https://www.khaithac-jp.com/assets/images/ogp/ogp-main.png'
    },
    'works/case5.html': {
        'title': 'ハイブリッドクラウド製造管理システム | 開発事例 | カイタックジャパン',
        'description': '金属加工製造業向けハイブリッドクラウド統合基幹システム開発事例。オンプレ×クラウドで稼働率99.9%、コスト30%削減を実現しました。',
        'og_type': 'article',
        'og_image': 'https://www.khaithac-jp.com/assets/images/ogp/ogp-main.png'
    },
    'works/case6.html': {
        'title': 'Access 全国6拠点製造管理システム | 開発事例 | カイタックジャパン',
        'description': 'Access+SQL Server 全国6拠点統合製造管理システム開発事例。全国6事業所の製造管理を統合、業務効率化を実現しました。',
        'og_type': 'article',
        'og_image': 'https://www.khaithac-jp.com/assets/images/ogp/ogp-main.png'
    },
}

def generate_ogp_meta_tags(file_path, metadata):
    """OGPタグとメタタグを生成"""
    url_path = str(file_path).replace('\\', '/')
    url = f"https://www.khaithac-jp.com/{url_path}"
    
    tags = f'''
    <!-- SEO Meta Tags -->
    <title>{metadata['title']}</title>
    <meta name="description" content="{metadata['description']}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="{metadata['og_type']}">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{metadata['title']}">
    <meta property="og:description" content="{metadata['description']}">
    <meta property="og:image" content="{metadata['og_image']}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:site_name" content="カイタックジャパン">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{url}">
    <meta name="twitter:title" content="{metadata['title']}">
    <meta name="twitter:description" content="{metadata['description']}">
    <meta name="twitter:image" content="{metadata['og_image']}">
'''
    return tags

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

def check_tags_exist(content):
    """既にOGPタグが存在するかチェック"""
    return 'og:title' in content or 'twitter:card' in content

def add_ogp_meta_tags(file_path, metadata):
    """HTMLファイルにOGPタグとメタタグを追加"""
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
    
    if check_tags_exist(content):
        print(f"  ⏭️  OGPタグは既に存在 - スキップ")
        return 'skipped'
    
    try:
        backup_file(file_path)
    except Exception as e:
        print(f"  ⚠️  バックアップ作成失敗: {e}")
    
    # 既存のtitle, descriptionを削除
    content = re.sub(r'<title>.*?</title>', '', content, flags=re.DOTALL)
    content = re.sub(r'<meta\s+name="description"\s+content="[^"]*">', '', content)
    
    # OGPタグとメタタグを生成
    tags = generate_ogp_meta_tags(file_path, metadata)
    
    # viewport メタタグの後に挿入
    pattern = r'(<meta\s+name="viewport"[^>]*>)'
    
    if not re.search(pattern, content):
        print(f"  ⚠️  viewport メタタグが見つかりません")
        alt_pattern = r'(<meta\s+charset="UTF-8">)'
        if re.search(alt_pattern, content):
            new_content = re.sub(alt_pattern, r'\1' + tags, content, count=1)
            print(f"  ℹ️  charset の後に挿入しました")
        else:
            print(f"  ❌ 挿入位置が見つかりません")
            return 'error'
    else:
        new_content = re.sub(pattern, r'\1' + tags, content, count=1)
    
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  ✅ OGPタグとメタタグを追加しました")
        return 'success'
    except Exception as e:
        print(f"  ❌ ファイル保存エラー: {e}")
        return 'error'

def main():
    """メイン処理"""
    print("="*60)
    print("🚀 OGP・メタタグ追加（case4, case5, case6専用）")
    print("="*60)
    
    current_dir = Path.cwd()
    print(f"\n📁 実行ディレクトリ: {current_dir}")
    
    # index.htmlの存在確認（プロジェクトルートかチェック）
    if not Path('index.html').exists():
        print("\n❌ エラー: index.htmlが見つかりません")
        print("   このスクリプトはプロジェクトルート（index.htmlがある場所）で実行してください")
        return
    
    print("\n✅ プロジェクトルートを確認しました")
    
    # OGP画像の存在確認
    ogp_image_path = Path('assets/images/ogp/ogp-main.png')
    if ogp_image_path.exists():
        print(f"✅ OGP画像を確認しました: {ogp_image_path}")
    else:
        print(f"⚠️  OGP画像が見つかりません: {ogp_image_path}")
    
    # 処理カウンター
    results = {
        'success': 0,
        'skipped': 0,
        'error': 0,
        'not_found': 0
    }
    
    # 各ファイルを処理
    for file_name, metadata in PAGE_METADATA.items():
        file_path = Path(file_name)
        result = add_ogp_meta_tags(file_path, metadata)
        results[result] = results.get(result, 0) + 1
    
    # サマリー表示
    print(f"\n{'='*60}")
    print("📊 処理結果サマリー")
    print(f"{'='*60}")
    print(f"✅ 追加成功:     {results['success']:2d} ファイル")
    print(f"⏭️  スキップ:     {results['skipped']:2d} ファイル (既存)")
    print(f"❌ エラー:       {results['error']:2d} ファイル")
    print(f"📂 未検出:       {results['not_found']:2d} ファイル")
    print(f"{'─'*60}")
    print(f"📁 合計:         {len(PAGE_METADATA):2d} ファイル")
    print(f"{'='*60}")
    
    if results['success'] > 0:
        print("\n✅ 完了! case4, case5, case6 にOGP・メタタグを追加しました!")
        print("\n📋 次のステップ:")
        print("   1. ブラウザで各ページを開いて表示確認")
        print("   2. GitHubにpush")
        print("      git add works/case4.html works/case5.html works/case6.html")
        print('      git commit -m "feat: Add OGP tags to case4, case5, case6"')
        print("      git push origin main")
        print("\n💡 バックアップは ./backup/ フォルダに保存されています")
    
    if results['skipped'] == len(PAGE_METADATA):
        print("\n✅ 全てのファイルにOGPタグが既に存在します")
        print("   問題ありません!")

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  処理を中断しました")
    except Exception as e:
        print(f"\n❌ エラー: {e}")
        import traceback
        traceback.print_exc()
