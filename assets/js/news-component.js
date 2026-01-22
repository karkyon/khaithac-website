/**
 * お知らせコンポーネント
 * スタイル: '3dflip' または 'radar'
 */

class NewsComponent {
  constructor(containerId, style = '3dflip') {
    this.container = document.getElementById(containerId);
    this.style = style;
    this.newsData = window.newsData || [];
    this.iconPaths = window.iconPaths || {};
    
    if (this.container) {
      this.render();
    }
  }

  // スタイルを切り替え
  switchStyle(newStyle) {
    this.style = newStyle;
    this.render();
  }

  // レンダリング
  render() {
    if (this.style === '3dflip') {
      this.render3DFlip();
    } else if (this.style === 'radar') {
      this.renderRadar();
    }
  }

  // 案2: 3Dカードフリップ
  render3DFlip() {
    const html = `
      <div class="news-3dflip flex flex-col space-y-4">
        ${this.newsData.map((news, index) => this.create3DFlipCard(news, index)).join('')}
      </div>
    `;
    this.container.innerHTML = html;
  }

  create3DFlipCard(news, index) {
    const delay = index * 0.5;
    return `
      <div class="card-3d w-full h-32 perspective-1000" style="animation-delay: ${delay}s;">
        <div class="card-inner relative w-full h-full transform-style-3d cursor-pointer">
          <!-- カード表面 -->
          <div class="card-front absolute w-full h-full backface-hidden bg-gradient-to-br ${news.gradient} backdrop-blur-md rounded-xl shadow-2xl p-4 flex items-center justify-between border border-white/20">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                ${news.isNew ? '<span class="px-2 py-1 bg-accent text-black text-xs font-bold rounded mr-2">NEW</span>' : ''}
                <span class="text-white/80 text-sm">${news.date}</span>
              </div>
              <h3 class="text-white font-bold text-lg">${news.title}</h3>
            </div>
            <div class="text-white/60">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${this.iconPaths[news.icon] || this.iconPaths.lightning}"/>
              </svg>
            </div>
          </div>
          
          <!-- カード裏面 -->
          <div class="card-back absolute w-full h-full backface-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 border border-accent rotate-y-180">
            <p class="text-gray-300 text-sm mb-3">
              ${news.detail}
            </p>
            <a href="${news.link}" class="w-full py-2 bg-accent text-black font-bold rounded-lg hover:bg-accent/80 transition-colors flex items-center justify-center">
              詳細を見る
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // 案3: パルスレーダー
  renderRadar() {
    const html = `
      <div class="news-radar relative w-full" style="min-height: 450px;">
        <!-- パルスリング -->
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75"></div>
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75" style="animation-delay: 1s;"></div>
        <div class="pulse-ring absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-primary opacity-75" style="animation-delay: 2s;"></div>
        
        ${this.newsData.map((news, index) => this.createRadarCard(news, index)).join('')}
      </div>
    `;
    this.container.innerHTML = html;
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
              <div class="flex items-center text-accent text-sm">
                <a href="${news.link}">詳細を見る</a>
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- グロー効果 -->
          <div class="glow-effect absolute -inset-1 bg-gradient-to-r ${glowGradients[index]} blur-lg -z-10"></div>
        </div>
      </div>
    `;
  }
}

// 初期化関数
function initNewsComponent(containerId, style = '3dflip') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.newsComponent = new NewsComponent(containerId, style);
    });
  } else {
    window.newsComponent = new NewsComponent(containerId, style);
  }
}

// グローバルに公開
window.NewsComponent = NewsComponent;
window.initNewsComponent = initNewsComponent;