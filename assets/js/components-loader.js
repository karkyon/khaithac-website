/**
 * コンポーネントローダー
 * ヘッダーとフッターを動的に読み込む
 * 
 * 使い方:
 * 1. HTMLの<body>の最初に <div id="header-placeholder"></div> を追加
 * 2. HTMLの<body>の最後に <div id="footer-placeholder"></div> を追加
 * 3. <head>内でこのスクリプトを読み込む
 *    - ルートページ: <script src="/assets/js/components-loader.js"></script>
 *    - サブページ: <script src="../assets/js/components-loader.js"></script>
 */

(function() {
  'use strict';

  /**
   * スクリプトの配置場所を基準にベースパスを取得
   */
  function getBasePath() {
    // 現在のスクリプトのsrcを取得
    const scripts = document.getElementsByTagName('script');
    let scriptSrc = '';
    
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('components-loader.js')) {
        scriptSrc = src;
        break;
      }
    }
    
    if (!scriptSrc) {
      console.error('components-loader.js not found');
      return '';
    }
    
    // スクリプトのパスからベースパスを計算
    const url = new URL(scriptSrc);
    const pathname = url.pathname;
    
    // /assets/js/components-loader.js から / を取得
    // または ../assets/js/components-loader.js から ../ を取得
    if (pathname.startsWith('/assets/js/')) {
      return '/';
    } else if (scriptSrc.includes('../assets/js/')) {
      return '../';
    } else {
      // フォールバック: 現在のページのパスから計算
      const currentPath = window.location.pathname;
      const depth = (currentPath.match(/\//g) || []).length - 1;
      return depth > 0 ? '../'.repeat(depth) : '/';
    }
  }

  /**
   * コンポーネントを読み込む
   */
  async function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder "${placeholderId}" not found`);
      return;
    }

    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      placeholder.innerHTML = html;
      
      console.log(`✓ Component loaded: ${componentPath}`);
      
      // コンポーネント読み込み後のイベントを発火
      const event = new CustomEvent('componentLoaded', { 
        detail: { 
          placeholderId, 
          componentPath 
        } 
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error(`Error loading component ${componentPath}:`, error);
      placeholder.innerHTML = `<!-- Component load error: ${componentPath} -->`;
    }
  }

  /**
   * 現在のページのパスを取得
   */
  function getCurrentPath() {
    return window.location.pathname;
  }

  /**
   * コンポーネントのパスを取得
   */
  function getComponentPath(componentName) {
    const basePath = getBasePath();
    return `${basePath}components/${componentName}.html`;
  }

  /**
   * アクティブなナビゲーションリンクをハイライト
   */
  function highlightActiveNav() {
    const path = getCurrentPath();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const page = link.getAttribute('data-page');
      if (!page) return;
      
      let isActive = false;
      
      switch(page) {
        case 'home':
          // HOMEは完全一致のみ（ルート、index.html、/index.htmlのみ）
          isActive = path === '/' || path === '/index.html' || path === '' || 
                    path.match(/^\/index\.html$/);
          break;
        case 'services':
          // servicesディレクトリ内のすべてのページ（index.htmlを含む）
          isActive = path.includes('/services/');
          break;
        case 'company':
          isActive = path.includes('company.html');
          break;
        case 'works':
          // worksディレクトリ内のすべてのページ（index.htmlを含む）
          isActive = path.includes('/works/');
          break;
        case 'contact':
          isActive = path.includes('contact.html');
          break;
      }
      
      if (isActive) {
        link.classList.remove('text-gray-700');
        link.classList.add('text-[#00A0E9]', 'font-semibold');
      }
    });
  }

  /**
   * モバイルメニューのトグル機能を初期化
   */
  function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }

  /**
   * 初期化
   */
  async function init() {
    console.log('🔄 Loading components...');
    console.log('Base path:', getBasePath());
    
    // ヘッダーとフッターを並行して読み込む
    await Promise.all([
      loadComponent('header-placeholder', getComponentPath('header')),
      loadComponent('footer-placeholder', getComponentPath('footer'))
    ]);
    
    // コンポーネント読み込み後の処理
    highlightActiveNav();
    initMobileMenu();
    
    console.log('✓ All components loaded successfully');
  }

  // DOMContentLoaded時に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMが既に読み込まれている場合は即座に実行
    init();
  }

})();