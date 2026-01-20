/**
 * 会社案内ページ用JavaScript
 * Google Maps APIの統合と地図表示機能
 */

class CompanyMap {
  constructor() {
    this.map = null;
    this.marker = null;
    this.infoWindow = null;
  }

  /**
   * Google Maps APIスクリプトを動的にロード
   */
  loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      // 既にロード済みの場合
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // スクリプトタグを作成
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${SITE_CONFIG.googleMaps.apiKey}&language=ja`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps APIの読み込みに失敗しました'));
      
      document.head.appendChild(script);
    });
  }

  /**
   * 地図を初期化
   */
  async initMap() {
    try {
      // Google Maps APIをロード
      await this.loadGoogleMapsAPI();

      // 地図コンテナを取得
      const mapContainer = document.getElementById('company-map');
      if (!mapContainer) {
        console.error('地図コンテナが見つかりません');
        return;
      }

      // 地図を作成
      const { location, mapOptions } = SITE_CONFIG.googleMaps;
      
      this.map = new google.maps.Map(mapContainer, {
        center: location,
        ...mapOptions,
        styles: this.getMapStyles() // カスタムスタイルを適用
      });

      // マーカーを追加
      this.addMarker(location);

      // 情報ウィンドウを追加
      this.addInfoWindow();

      // ズームコントロールをカスタマイズ
      this.customizeControls();

    } catch (error) {
      console.error('地図の初期化エラー:', error);
      this.showErrorMessage();
    }
  }

  /**
   * マーカーを追加
   */
  addMarker(position) {
    this.marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: SITE_CONFIG.company.name,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
            <path fill="#10B981" d="M20 0C8.95 0 0 8.95 0 20c0 11.05 20 30 20 30s20-18.95 20-30C40 8.95 31.05 0 20 0z"/>
            <circle fill="white" cx="20" cy="20" r="8"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 50),
        anchor: new google.maps.Point(20, 50)
      }
    });

    // マーカークリックで情報ウィンドウを表示
    this.marker.addListener('click', () => {
      this.infoWindow.open(this.map, this.marker);
    });
  }

  /**
   * 情報ウィンドウを追加
   */
  addInfoWindow() {
    const contentString = `
      <div style="padding: 15px; max-width: 300px; font-family: 'Roboto', sans-serif;">
        <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
          ${SITE_CONFIG.company.name}
        </h3>
        <p style="margin: 8px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
          📍 ${SITE_CONFIG.company.address}
        </p>
        <p style="margin: 8px 0; color: #4b5563; font-size: 14px;">
          📞 ${SITE_CONFIG.company.tel}
        </p>
        <p style="margin: 8px 0; color: #4b5563; font-size: 14px;">
          📧 ${SITE_CONFIG.company.email}
        </p>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${SITE_CONFIG.googleMaps.location.lat},${SITE_CONFIG.googleMaps.location.lng}" 
           target="_blank" 
           style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 500;">
          Google Mapsで開く
        </a>
      </div>
    `;

    this.infoWindow = new google.maps.InfoWindow({
      content: contentString
    });
  }

  /**
   * カスタム地図スタイル
   */
  getMapStyles() {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      }
    ];
  }

  /**
   * コントロールをカスタマイズ
   */
  customizeControls() {
    // カスタムコントロールボタンを追加することも可能
    // 例：現在地ボタン、リセットボタンなど
  }

  /**
   * エラーメッセージを表示
   */
  showErrorMessage() {
    const mapContainer = document.getElementById('company-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
          <div>
            <p style="color: #ef4444; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
              地図の読み込みに失敗しました
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              設定ファイル（config.js）のAPIキーを確認してください
            </p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${SITE_CONFIG.googleMaps.location.lat},${SITE_CONFIG.googleMaps.location.lng}" 
               target="_blank"
               style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
              Google Mapsで開く
            </a>
          </div>
        </div>
      `;
    }
  }
}

// ページ読み込み時に地図を初期化
document.addEventListener('DOMContentLoaded', () => {
  const companyMap = new CompanyMap();
  companyMap.initMap();
});

// スムーズスクロール機能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href !== '') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});