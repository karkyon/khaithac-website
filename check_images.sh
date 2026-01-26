#!/bin/bash
# 画像一覧確認スクリプト
# プロジェクト内の全画像ファイルを確認し、WebP変換の優先度を表示

echo "=========================================="
echo "🖼️  画像ファイル一覧"
echo "=========================================="

# カレントディレクトリの確認
echo ""
echo "📁 実行ディレクトリ: $(pwd)"

# index.htmlの存在確認
if [ ! -f "index.html" ]; then
    echo ""
    echo "❌ エラー: index.htmlが見つかりません"
    echo "   プロジェクトルート（index.htmlがある場所）で実行してください"
    exit 1
fi

echo ""
echo "✅ プロジェクトルートを確認しました"

# 画像ディレクトリの存在確認
if [ ! -d "assets/images" ]; then
    echo ""
    echo "❌ エラー: assets/images ディレクトリが見つかりません"
    exit 1
fi

echo ""
echo "=========================================="
echo "📊 画像ファイルの分析"
echo "=========================================="

# ヒーロー背景画像（優先度: 高）
echo ""
echo "🔥 優先度: 高 - ヒーロー背景画像"
echo "----------------------------------------"
if [ -d "assets/images/hero" ]; then
    hero_count=0
    hero_size=0
    for file in assets/images/hero/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            size_bytes=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
            hero_size=$((hero_size + size_bytes))
            echo "  📸 $file ($size)"
            ((hero_count++))
            
            # WebP版の存在確認
            webp_file="${file%.*}.webp"
            if [ -f "$webp_file" ]; then
                webp_size=$(ls -lh "$webp_file" | awk '{print $5}')
                echo "     ✅ WebP版あり: $webp_file ($webp_size)"
            else
                echo "     ⚠️  WebP版なし - 変換が必要"
            fi
        fi
    done
    if [ $hero_count -eq 0 ]; then
        echo "  📂 画像ファイルが見つかりません"
    else
        hero_size_mb=$(echo "scale=2; $hero_size / 1048576" | bc)
        echo ""
        echo "  合計: $hero_count ファイル (約 ${hero_size_mb} MB)"
    fi
else
    echo "  📂 ディレクトリが存在しません"
fi

# OGP画像（優先度: 中）
echo ""
echo "🎨 優先度: 中 - OGP画像"
echo "----------------------------------------"
if [ -d "assets/images/ogp" ]; then
    ogp_count=0
    for file in assets/images/ogp/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            echo "  📸 $file ($size)"
            ((ogp_count++))
            
            webp_file="${file%.*}.webp"
            if [ -f "$webp_file" ]; then
                webp_size=$(ls -lh "$webp_file" | awk '{print $5}')
                echo "     ✅ WebP版あり: $webp_file ($webp_size)"
            else
                echo "     ⚠️  WebP版なし - 変換が必要"
            fi
        fi
    done
    if [ $ogp_count -eq 0 ]; then
        echo "  📂 画像ファイルが見つかりません"
    fi
else
    echo "  📂 ディレクトリが存在しません"
fi

# ロゴ画像（優先度: 中）
echo ""
echo "🏢 優先度: 中 - ロゴ画像"
echo "----------------------------------------"
if [ -d "assets/images/logo" ]; then
    logo_count=0
    for file in assets/images/logo/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            echo "  📸 $file ($size)"
            ((logo_count++))
            
            webp_file="${file%.*}.webp"
            if [ -f "$webp_file" ]; then
                webp_size=$(ls -lh "$webp_file" | awk '{print $5}')
                echo "     ✅ WebP版あり: $webp_file ($webp_size)"
            else
                echo "     ⚠️  WebP版なし - 変換が必要"
            fi
        fi
    done
    if [ $logo_count -eq 0 ]; then
        echo "  📂 画像ファイルが見つかりません"
    fi
else
    echo "  📂 ディレクトリが存在しません"
fi

# ファビコン（優先度: 低）
echo ""
echo "🔖 優先度: 低 - ファビコン"
echo "----------------------------------------"
if [ -d "assets/images/favicon" ]; then
    favicon_count=0
    for file in assets/images/favicon/*.{png,PNG} 2>/dev/null; do
        if [ -f "$file" ]; then
            size=$(ls -lh "$file" | awk '{print $5}')
            echo "  📸 $file ($size)"
            ((favicon_count++))
        fi
    done
    if [ $favicon_count -eq 0 ]; then
        echo "  📂 画像ファイルが見つかりません"
    fi
    echo "  ℹ️  ファビコンはWebP変換不要（PNG推奨）"
else
    echo "  📂 ディレクトリが存在しません"
fi

# その他の画像
echo ""
echo "📁 その他の画像"
echo "----------------------------------------"
other_count=0
for dir in assets/images/*/; do
    dirname=$(basename "$dir")
    if [[ "$dirname" != "hero" && "$dirname" != "ogp" && "$dirname" != "logo" && "$dirname" != "favicon" ]]; then
        echo "  📂 $dir"
        for file in "$dir"*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
            if [ -f "$file" ]; then
                size=$(ls -lh "$file" | awk '{print $5}')
                echo "     📸 $(basename "$file") ($size)"
                ((other_count++))
            fi
        done
    fi
done
if [ $other_count -eq 0 ]; then
    echo "  📂 その他の画像はありません"
fi

# サマリー
echo ""
echo "=========================================="
echo "📊 変換推奨サマリー"
echo "=========================================="
echo ""
echo "🔥 最優先（すぐに変換）:"
echo "   └─ assets/images/hero/ のすべての画像"
echo ""
echo "🎨 推奨（できれば変換）:"
echo "   └─ assets/images/ogp/ のOGP画像"
echo "   └─ assets/images/logo/ のロゴ画像"
echo ""
echo "ℹ️  スキップ可能:"
echo "   └─ assets/images/favicon/ のファビコン"
echo ""

echo "=========================================="
echo "✅ 確認完了"
echo "=========================================="
echo ""
echo "次のステップ:"
echo "1. WebP変換手順書を参照"
echo "2. 優先度の高い画像から変換"
echo "3. HTML更新スクリプトを実行"
echo ""
