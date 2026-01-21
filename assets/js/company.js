/**
 * 会社案内ページ用JavaScript
 * Google Maps APIの統合と地図表示機能
 * 
 * 依存関係:
 * - config.js（設定ファイル）
 * - Google Maps JavaScript API
 */

class CompanyMap {
  constructor() {
    this.map = null;
    this.marker = null;
    this.infoWindow = null;
    this.isInitialized = false;
  }

  /**
   * Google Maps APIスクリプトを動的にロード
   */
  loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      // 既にロード済みの場合
      if (window.google && window.google.maps) {
        console.log('✓ Google Maps API already loaded');
        resolve();
        return;
      }

      // APIキーの確認
      if (!SITE_CONFIG.googleMaps.apiKey || SITE_CONFIG.googleMaps.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        console.error('❌ Google Maps APIキーが設定されていません');
        console.log('config.jsファイルでAPIキーを設定してください');
        reject(new Error('Google Maps APIキーが未設定です'));
        return;
      }

      console.log('⏳ Loading Google Maps API...');

      // スクリプトタグを作成
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${SITE_CONFIG.googleMaps.apiKey}&language=ja&region=JP`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✓ Google Maps API loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.error('❌ Google Maps APIの読み込みに失敗しました');
        reject(new Error('Google Maps APIの読み込みに失敗しました'));
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * 地図を初期化
   */
  async initMap() {
    if (this.isInitialized) {
      console.log('Map already initialized');
      return;
    }

    try {
      console.log('🗺️ Initializing map...');

      // Google Maps APIをロード
      await this.loadGoogleMapsAPI();

      // 地図コンテナを取得
      const mapContainer = document.getElementById('company-map');
      if (!mapContainer) {
        console.error('❌ 地図コンテナ(#company-map)が見つかりません');
        return;
      }

      // 地図を作成
      const { location, mapOptions } = SITE_CONFIG.googleMaps;
      
      this.map = new google.maps.Map(mapContainer, {
        center: location,
        ...mapOptions,
        styles: this.getMapStyles() // カスタムスタイルを適用
      });

      console.log('✓ Map created');

      // マーカーを追加
      this.addMarker(location);

      // 情報ウィンドウを追加
      this.addInfoWindow();

      // 地図読み込み完了時のアニメーション
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        console.log('✓ Map fully loaded');
        mapContainer.classList.add('map-loaded');
        this.isInitialized = true;
      });

      // レスポンシブ対応
      this.setupResponsive();

    } catch (error) {
      console.error('❌ 地図の初期化エラー:', error);
      this.showErrorMessage();
    }
  }

  /**
   * マーカーを追加
   */
  addMarker(position) {
    // カスタムマーカーアイコン（エメラルドグリーン）
    const markerIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="0" dy="2" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path fill="#10B981" d="M20 0C8.95 0 0 8.95 0 20c0 11.05 20 30 20 30s20-18.95 20-30C40 8.95 31.05 0 20 0z"/>
            <circle fill="white" cx="20" cy="20" r="7"/>
            <path fill="#10B981" d="M20 16c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
          </g>
        </svg>
      `),
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 50)
    };

    this.marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: SITE_CONFIG.company.name,
      animation: google.maps.Animation.DROP,
      icon: markerIcon
    });

    // マーカークリックで情報ウィンドウを表示
    this.marker.addListener('click', () => {
      this.infoWindow.open(this.map, this.marker);
    });

    // マーカーホバーエフェクト
    this.marker.addListener('mouseover', () => {
      this.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => this.marker.setAnimation(null), 700);
    });

    console.log('✓ Marker added');
  }

  /**
   * 情報ウィンドウを追加
   */
  addInfoWindow() {
    const contentString = `
      <div style="padding: 16px; max-width: 320px; font-family: 'Roboto', sans-serif;">
        <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 17px; font-weight: 600; border-bottom: 2px solid #10B981; padding-bottom: 8px;">
          ${SITE_CONFIG.company.name}
        </h3>
        <div style="margin: 10px 0;">
          <div style="display: flex; align-items: start; margin: 8px 0;">
            <span style="color: #10B981; margin-right: 8px; font-size: 16px;">📍</span>
            <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
              ${SITE_CONFIG.company.address}
            </p>
          </div>
          <div style="display: flex; align-items: center; margin: 8px 0;">
            <span style="color: #10B981; margin-right: 8px; font-size: 16px;">📞</span>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">
              <a href="tel:${SITE_CONFIG.company.tel.replace(/-/g, '')}" style="color: #10B981; text-decoration: none;">
                ${SITE_CONFIG.company.tel}
              </a>
            </p>
          </div>
          <div style="display: flex; align-items: center; margin: 8px 0;">
            <span style="color: #10B981; margin-right: 8px; font-size: 16px;">📧</span>
            <p style="margin: 0; color: #4b5563; font-size: 14px;">
              <a href="mailto:${SITE_CONFIG.company.email}" style="color: #10B981; text-decoration: none;">
                ${SITE_CONFIG.company.email}
              </a>
            </p>
          </div>
        </div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${SITE_CONFIG.googleMaps.location.lat},${SITE_CONFIG.googleMaps.location.lng}" 
           target="_blank" 
           rel="noopener noreferrer"
           style="display: inline-block; width: 100%; text-align: center; margin-top: 12px; padding: 10px 16px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
          Google Mapsで開く →
        </a>
      </div>
    `;

    this.infoWindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 350
    });

    console.log('✓ Info window created');
  }

  /**
   * カスタム地図スタイル
   * エメラルドグリーンをアクセントにしたスタイル
   */
  getMapStyles() {
    return [
      // POIラベルの管理
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }] // 不要なPOIラベルを非表示
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
      },
      
      // 水域 - コントラストを上げる
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#B3E5FC' }] // より濃い水色
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1976D2' }] // 水域ラベルを濃い青に
      },
      
      // 背景
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#F5F5F5' }] // 背景を薄いグレーに
      },
      
      // すべての道路 - デフォルトスタイル（濃く太く）
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#FFFFFF' },
          { weight: 2.5 }  // 線の太さを増加
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#BDBDBD' },  // 道路の縁を濃いグレーに
          { weight: 1.5 }  // ストローク（縁取り）を太く
        ]
      },
      
      // 高速道路 - 最も目立つように
      {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#FFD54F' },  // 濃い黄色
          { weight: 3 }  // 太く
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#F57C00' },  // オレンジの縁取り
          { weight: 2 }
        ]
      },
      
      // 幹線道路 - 見やすく
      {
        featureType: 'road.arterial',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#FFFFFF' },
          { weight: 2.8 }  // 太く
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#9E9E9E' },  // 濃いグレーの縁取り
          { weight: 1.8 }
        ]
      },
      
      // 一般道路 - はっきりと
      {
        featureType: 'road.local',
        elementType: 'geometry.fill',
        stylers: [
          { color: '#FFFFFF' },
          { weight: 2 }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#BDBDBD' },  // グレーの縁取り
          { weight: 1.2 }
        ]
      },
      
      // 道路ラベル - 濃く見やすく
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#212121' }]  // ほぼ黒に
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          { color: '#FFFFFF' },
          { weight: 4 }  // 白い縁取りを太く
        ]
      },
      
      // 建物 - コントラストを上げる
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#C8E6C9' }]  // 公園を濃い緑に
      },
      
      // 行政区域の境界線を濃く
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          { color: '#757575' },  // 濃いグレー
          { weight: 1.5 }
        ]
      },
      
      // 地名ラベルを濃く
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#424242' }]  // 濃いグレー
      }
    ];
  }

  /**
   * レスポンシブ対応
   */
  setupResponsive() {
    window.addEventListener('resize', () => {
      if (this.map) {
        // 地図の中心を再設定
        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(SITE_CONFIG.googleMaps.location);
      }
    });
  }

  /**
   * エラーメッセージを表示
   */
  showErrorMessage() {
    const mapContainer = document.getElementById('company-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #F3F4F6; border-radius: 12px; padding: 40px; text-align: center;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3 style="margin: 16px 0 8px 0; color: #1F2937; font-size: 18px; font-weight: 600;">
            地図を読み込めませんでした
          </h3>
          <p style="margin: 0; color: #6B7280; font-size: 14px; max-width: 400px;">
            Google Maps APIキーの設定を確認してください。<br>
            詳しくは config.js ファイルをご確認ください。
          </p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${SITE_CONFIG.googleMaps.location.lat},${SITE_CONFIG.googleMaps.location.lng}" 
             target="_blank"
             rel="noopener noreferrer"
             style="display: inline-block; margin-top: 20px; padding: 10px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">
            Google Mapsで開く
          </a>
        </div>
      `;
    }
  }
}

// ページ読み込み完了後に地図を初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const companyMap = new CompanyMap();
    companyMap.initMap();
  });
} else {
  const companyMap = new CompanyMap();
  companyMap.initMap();
}