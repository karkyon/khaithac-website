/**
 * カイタックジャパン Webサイト設定ファイル
 * Google Maps API等の設定を管理
 */

const SITE_CONFIG = {
  // Google Maps API設定
  googleMaps: {
    // APIキーをここに設定してください
    // Google Cloud Consoleから取得: https://console.cloud.google.com/
    apiKey: 'AIzaSyC1LrD7xMN_sLZ5iELaLpPzXPeQeEoH6pY',
    
    // 会社の位置情報
    location: {
      lat: 34.8203,  // 大阪府枚方市春日西町の緯度
      lng: 135.6469  // 大阪府枚方市春日西町の経度
    },
    
    // 地図の初期設定
    mapOptions: {
      zoom: 16,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: false,
      fullscreenControl: true
    }
  },

  // 会社情報
  company: {
    name: '合同会社カイタックジャパン',
    address: '〒573-0136 大阪府枚方市春日西町2丁目28番26号',
    tel: '072-300-2410',
    email: 'info@khaithac-jp.com'
  },

  // EmailJS設定（オプション）
  emailJS: {
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'YOUR_PUBLIC_KEY'
  }
};

// 設定ファイルをグローバルスコープに公開
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}