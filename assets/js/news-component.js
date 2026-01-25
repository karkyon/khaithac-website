/**
 * お知らせコンポーネント - 完全版（パラメータ解説付き）
 * 
 * 【このファイルで調整できること】
 * - カードのサイズ（高さ・幅）
 * - フォントサイズ
 * - パディング（余白）
 * - カード間の間隔
 * - アイコンサイズ
 * - 詳細ボタンの表示/非表示（linkの有無で自動判定）
 */

class NewsComponent {
  constructor(containerId, style = '3dflip') {
    console.log('🔧 NewsComponent constructor called');
    console.log('  - containerId:', containerId);
    console.log('  - style:', style);
    
    this.container = document.getElementById(containerId);
    console.log('  - container element:', this.container);
    
    this.style = style;
    this.newsData = window.newsData || [];
    this.iconPaths = window.iconPaths || {};
    
    console.log('  - window.newsData:', window.newsData);
    console.log('  - this.newsData:', this.newsData);
    console.log('  - this.newsData.length:', this.newsData.length);
    console.log('  - window.iconPaths:', window.iconPaths);
    console.log('  - this.iconPaths:', this.iconPaths);
    
    if (this.container) {
      console.log('✅ Container found, calling render()...');
      this.render();
    } else {
      console.error('❌ Container not found!');
    }
  }

  // スタイルを切り替え
  switchStyle(newStyle) {
    console.log('🔄 Switching style from', this.style, 'to', newStyle);
    this.style = newStyle;
    this.render();
  }

  // レンダリング
  render() {
    console.log('🎨 Rendering with style:', this.style);
    console.log('  - newsData.length:', this.newsData.length);
    
    if (this.style === '3dflip') {
      this.render3DFlip();
    } else if (this.style === 'radar') {
      this.renderRadar();
    }
    
    console.log('✅ Render complete');
  }

  // ===================================================================
  // 📦 3Dフリップカードのレンダリング
  // ===================================================================
  render3DFlip() {
    console.log('📦 render3DFlip called');
    console.log('  - Creating', this.newsData.length, 'cards');
    
    const html = `
      <div class="news-3dflip flex flex-col space-y-2">
        <!-- ↑ space-y-2: カード間の縦方向の間隔 -->
        <!-- space-y-1: 4px間隔（最小） -->
        <!-- space-y-2: 8px間隔（小） ← 現在の設定 -->
        <!-- space-y-3: 12px間隔（中） -->
        <!-- space-y-4: 16px間隔（大） -->
        <!-- space-y-6: 24px間隔（最大） -->
        
        ${this.newsData.map((news, index) => this.create3DFlipCard(news, index)).join('')}
      </div>
    `;
    
    console.log('  - Generated HTML length:', html.length);
    this.container.innerHTML = html;
    console.log('  - HTML inserted into container');
  }

  // ===================================================================
  // 🎴 個別カードの作成
  // ===================================================================
  create3DFlipCard(news, index) {
    const delay = index * 0.5;  // アニメーション遅延（0.5秒ずつずらす）
    
    return `
      <div class="card-3d w-full h-16 perspective-1000" style="animation-delay: ${delay}s;">
        <!-- ↑ カード全体のサイズ設定 -->
        <!-- 幅パーセント指定 -->
        <!-- w-full: 幅100% -->
        <!-- w-11/12: 幅 91.67% -->
        <!-- w-10/12: 幅 83.33% -->
        <!-- w-9/12: 幅 75% -->
        <!-- w-8/12: 幅 66.67% -->
        <!-- w-7/12: 幅 58.33% -->
        <!-- w-6/12: 幅 50% -->
        <!-- w-5/12: 幅 41.67% -->
        <!-- w-4/12: 幅 33.33% -->
        <!-- w-3/12: 幅 25% -->
        <!-- w-2/12: 幅 16.67% -->
        <!-- w-1/12: 幅 8.33% -->

        <!-- 固定幅（ピクセル） -->
        <!-- w-96: 384px -->
        <!-- w-80: 320px -->
        <!-- w-64: 256px -->
        <!-- w-48: 192px -->

        <!-- 高さ固定 -->
        <!-- h-12: 高さ48px（最小） -->
        <!-- h-16: 高さ64px（小） ← 現在の設定 -->
        <!-- h-20: 高さ80px（中） -->
        <!-- h-24: 高さ96px（大） -->
        <!-- h-32: 高さ128px（最大） -->
        
        <div class="card-inner relative w-full h-full transform-style-3d cursor-pointer">
          
          <!-- =============================================== -->
          <!-- カード表面（通常時に見える面） -->
          <!-- =============================================== -->
          <div class="card-front absolute w-full h-full backface-hidden bg-gradient-to-br ${news.gradient} backdrop-blur-md rounded-lg shadow-lg p-2 flex items-center justify-between border border-white/20">
            <!-- ↑ カード表面のスタイル -->
            <!-- rounded-sm: 角丸小 -->
            <!-- rounded-md: 角丸中 -->
            <!-- rounded-lg: 角丸大 ← 現在の設定 -->
            <!-- rounded-xl: 角丸特大 -->
            <!-- shadow-sm: 影小 -->
            <!-- shadow-md: 影中 -->
            <!-- shadow-lg: 影大 ← 現在の設定 -->
            <!-- shadow-xl: 影特大 -->
            <!-- p-1: パディング4px -->
            <!-- p-2: パディング8px ← 現在の設定 -->
            <!-- p-3: パディング12px -->
            <!-- p-4: パディング16px -->
            
            <div class="flex-1">
              <!-- =============================================== -->
              <!-- 日付とNEWバッジのエリア -->
              <!-- =============================================== -->
              <div class="flex items-center mb-1">
                <!-- mb-1: 下マージン4px ← 現在の設定 -->
                <!-- mb-2: 下マージン8px -->
                
                ${news.isNew ? '<span class="px-1.5 py-0.5 bg-white text-primary border border-white/30 text-xs font-bold rounded mr-1.5">NEW</span>' : ''}
                <!-- ↑ NEWバッジのサイズ -->
                <!-- px-1: 横パディング4px -->
                <!-- px-1.5: 横パディング6px ← 現在の設定 -->
                <!-- px-2: 横パディング8px -->
                <!-- py-0.5: 縦パディング2px ← 現在の設定 -->
                <!-- py-1: 縦パディング4px -->
                <!-- text-xs: フォント12px ← 現在の設定 -->
                <!-- text-sm: フォント14px -->
                
                <span class="text-white/80 text-xs">${news.date}</span>
                <!-- ↑ 日付のフォントサイズ -->
                <!-- text-xs: 12px ← 現在の設定 -->
                <!-- text-sm: 14px -->
                <!-- text-base: 16px -->
              </div>
              
              <!-- =============================================== -->
              <!-- タイトル -->
              <!-- =============================================== -->
              <h3 class="text-white font-bold text-sm">${news.title}</h3>
              <!-- ↑ タイトルのフォントサイズ -->
              <!-- text-xs: 12px -->
              <!-- text-sm: 14px ← 現在の設定 -->
              <!-- text-base: 16px -->
              <!-- text-lg: 18px -->
              <!-- text-xl: 20px -->
            </div>
            
            <!-- =============================================== -->
            <!-- アイコン -->
            <!-- =============================================== -->
            <div class="text-white/60 ml-2">
              <!-- ml-2: 左マージン8px ← 現在の設定 -->
              <!-- ml-3: 左マージン12px -->
              
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <!-- ↑ アイコンのサイズ -->
                <!-- w-4 h-4: 16px -->
                <!-- w-5 h-5: 20px ← 現在の設定 -->
                <!-- w-6 h-6: 24px -->
                <!-- w-8 h-8: 32px -->
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${this.iconPaths[news.icon] || this.iconPaths.lightning}"/>
              </svg>
            </div>
          </div>
          
          <!-- =============================================== -->
          <!-- カード裏面（ホバー時に見える面） -->
          <!-- =============================================== -->
          <div class="card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-2 border border-accent rotate-y-180">
            <!-- p-2: パディング8px ← 現在の設定 -->
            
            <!-- =============================================== -->
            <!-- 詳細テキスト -->
            <!-- =============================================== -->
            <p class="text-gray-800 text-xs ${news.link && news.link !== '#' ? 'mb-2' : 'mb-0'} line-clamp-3">
              <!-- ↑ 詳細テキストのスタイル -->
              <!-- text-xs: 12px ← 現在の設定 -->
              <!-- text-sm: 14px -->
              <!-- mb-2: 下マージン8px（ボタンありの場合） -->
              <!-- mb-0: 下マージンなし（ボタンなしの場合） -->
              <!-- line-clamp-3: 3行まで表示 ← 現在の設定 -->
              <!-- line-clamp-2: 2行まで表示 -->
              <!-- line-clamp-4: 4行まで表示 -->
              <!-- テキスト色（ダークグレー）: -->
              <!-- text-gray-700: やや薄いダークグレー -->
              <!-- text-gray-800: ダークグレー ← 現在の設定 -->
              <!-- text-gray-900: 濃いダークグレー -->
              <!-- text-black: 真っ黒 -->
              ${news.detail}
            </p>
            
            <!-- =============================================== -->
            <!-- 詳細ボタン（linkが存在する場合のみ表示） -->
            <!-- =============================================== -->
            ${news.link && news.link !== '#' ? `
              <a href="${news.link}" class="w-full py-1 text-xs bg-accent text-black font-bold rounded hover:bg-accent/80 transition-colors flex items-center justify-center">
                <!-- ↑ ボタンのスタイル -->
                <!-- py-1: 縦パディング4px ← 現在の設定 -->
                <!-- py-2: 縦パディング8px -->
                <!-- text-xs: フォント12px ← 現在の設定 -->
                <!-- text-sm: フォント14px -->
                
                詳細を見る
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <!-- ↑ ボタン内アイコンのサイズ -->
                  <!-- w-3 h-3: 12px ← 現在の設定 -->
                  <!-- w-4 h-4: 16px -->
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>
            ` : ''}
            <!-- ↑ news.link が空文字列または '#' の場合はボタンを非表示 -->
          </div>
        </div>
      </div>
    `;
  }

  // ===================================================================
  // 📡 案3: パルスレーダー
  // ===================================================================
  renderRadar() {
    console.log('📡 renderRadar called');
    console.log('  - Creating', this.newsData.length, 'radar cards');
    
    const html = `
      <div class="news-radar relative w-full" style="min-height: 450px;">
        <!-- パルスリング -->
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75"></div>
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75" style="animation-delay: 1s;"></div>
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75" style="animation-delay: 2s;"></div>
        
        ${this.newsData.map((news, index) => this.createRadarCard(news, index)).join('')}
      </div>
    `;
    
    console.log('  - Generated HTML length:', html.length);
    this.container.innerHTML = html;
    console.log('  - HTML inserted into container');
  }

  createRadarCard(news, index) {
    const positions = [
      'top-0 left-0 right-0',
      'top-36 left-0 right-0',
      'top-72 left-0 right-0'
    ];
    const delay = 0.3 + (index * 0.3);
    const borderColors = ['border-primary/50', 'border-secondary/50', 'border-accent/50'];
    const glowGradients = [
      'from-primary via-accent to-secondary',
      'from-secondary via-primary to-accent',
      'from-accent via-secondary to-primary'
    ];

    return `
      <div class="news-card absolute ${positions[index]} opacity-0 animate-fade-in" style="animation-delay: ${delay}s;">
        <div class="morph-card group cursor-pointer bg-slate-900/95 backdrop-blur-md border ${borderColors[index]} rounded-xl p-4 hover:scale-105 hover:border-accent transition-all duration-300 shadow-2xl relative overflow-hidden">
          <!-- 粒子エフェクト -->
          <div class="particles absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
          </div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              ${news.isNew ? '<span class="px-2 py-1 bg-accent text-black text-xs font-bold rounded">NEW</span>' : ''}
              <span class="text-primary text-sm">${news.date}</span>
            </div>
            <h3 class="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors">
              ${news.title}
            </h3>
            <div class="detail-content max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-500">
              <p class="text-gray-300 text-sm mb-3 pt-2 border-t border-primary/30">
                ${news.detail}
              </p>
              ${news.link && news.link !== '#' ? `
                <div class="flex items-center text-accent text-sm">
                  <a href="${news.link}">詳細を見る</a>
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </div>
              ` : ''}
            </div>
          </div>
          
          <!-- グロー効果 -->
          <div class="glow-effect absolute -inset-1 bg-gradient-to-r ${glowGradients[index]} blur-lg -z-10"></div>
        </div>
      </div>
    `;
  }
}

// ===================================================================
// 🚀 初期化関数
// ===================================================================
function initNewsComponent(containerId, style = '3dflip') {
  console.log('🚀 initNewsComponent called');
  console.log('  - containerId:', containerId);
  console.log('  - style:', style);
  console.log('  - document.readyState:', document.readyState);
  console.log('  - window.newsData:', window.newsData);
  console.log('  - window.iconPaths:', window.iconPaths);
  
  if (document.readyState === 'loading') {
    console.log('⏳ Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('✅ DOMContentLoaded fired, creating component...');
      window.newsComponent = new NewsComponent(containerId, style);
      console.log('✅ Component created:', window.newsComponent);
    });
  } else {
    console.log('✅ Document already loaded, creating component immediately...');
    window.newsComponent = new NewsComponent(containerId, style);
    console.log('✅ Component created:', window.newsComponent);
  }
}

// グローバルに公開
window.NewsComponent = NewsComponent;
window.initNewsComponent = initNewsComponent;

console.log('📦 news-component.js loaded successfully');
console.log('  - NewsComponent class available:', typeof NewsComponent);
console.log('  - initNewsComponent function available:', typeof initNewsComponent);