/**
 * カイタックジャパン Webサイト - 共通JavaScript
 * 配置先: ~/khaithac-website/assets/js/common.js
 */

(function() {
    'use strict';

    // =================================
    // モバイルメニュートグル
    // =================================
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // アリア属性の更新（アクセシビリティ対応）
            const isExpanded = mobileMenu.classList.contains('hidden') ? 'false' : 'true';
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

    // =================================
    // スムーススクロール
    // =================================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // ハッシュのみの場合はスキップ
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // ナビゲーションの高さを取得
                const nav = document.querySelector('nav');
                const navHeight = nav ? nav.offsetHeight : 0;
                
                // スクロール位置を計算
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // =================================
    // スクロール時のナビゲーション背景変更
    // =================================
    const nav = document.querySelector('nav');
    
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-lg');
            } else {
                nav.classList.remove('shadow-lg');
            }
        });
    }

    // =================================
    // フェードインアニメーション（スクロール時）
    // =================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // .animate-on-scroll クラスを持つ要素を監視
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // =================================
    // 外部リンクに target="_blank" とアイコン追加
    // =================================
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        // 自サイトのリンクは除外
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // アイコン追加（オプション）
            // link.innerHTML += ' <svg class="inline w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/></svg>';
        }
    });

    // =================================
    // ページトップへ戻るボタン
    // =================================
    const createScrollToTopButton = function() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
        `;
        button.className = 'fixed bottom-8 right-8 bg-[#00A0E9] text-white p-3 rounded-full shadow-lg hover:bg-[#0088CC] transition-all duration-300 opacity-0 invisible z-40';
        button.id = 'scroll-to-top';
        button.setAttribute('aria-label', 'ページトップへ戻る');
        
        document.body.appendChild(button);
        
        // スクロールイベント
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                button.classList.remove('opacity-0', 'invisible');
            } else {
                button.classList.add('opacity-0', 'invisible');
            }
        });
        
        // クリックイベント
        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // ページトップボタンを作成
    createScrollToTopButton();

    // =================================
    // フォームバリデーション補助
    // =================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('必須項目を入力してください。');
            }
        });
    });

    // =================================
    // コンソールメッセージ
    // =================================
    console.log('%c🚀 Khaithac Japan Website', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cDeveloped with ❤️ using Tailwind CSS', 'color: #666; font-size: 12px;');

})();