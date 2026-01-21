/**
 * カイタックジャパン Webサイト設定ファイル
 * Google Maps API等の設定を管理
 * 
 * 【重要】Google Maps APIキーの取得方法:
 * 1. Google Cloud Console (https://console.cloud.google.com/) にアクセス
 * 2. 新しいプロジェクトを作成または既存のプロジェクトを選択
 * 3. 「APIとサービス」→「認証情報」を選択
 * 4. 「認証情報を作成」→「APIキー」を選択
 * 5. 作成されたAPIキーを下記の apiKey に設定
 * 6. 「Maps JavaScript API」を有効化
 */

const SITE_CONFIG = {
  // Google Maps API設定
  googleMaps: {
    // ★★★ APIキーをここに設定してください ★★★
    // 本番環境では環境変数から取得することを推奨
    apiKey: 'AIzaSyC1LrD7xMN_sLZ5iELaLpPzXPeQeEoH6pY',
    
    // 会社の位置情報（大阪府枚方市春日西町2丁目28番26号）
    location: {
      lat: 34.8035791,   // 緯度
      lng: 135.6777118   // 経度
    },
    // 地図の初期設定
    mapOptions: {
      zoom: 16,                    // ズームレベル（1-20）
      mapTypeId: 'roadmap',        // 地図タイプ（roadmap, satellite, hybrid, terrain）
      disableDefaultUI: false,     // デフォルトUIを無効化
      zoomControl: true,           // ズームコントロール表示
      mapTypeControl: false,       // 地図タイプコントロール非表示
      scaleControl: true,          // スケールコントロール表示
      streetViewControl: true,     // ストリートビューコントロール表示
      rotateControl: false,        // 回転コントロール非表示
      fullscreenControl: true      // フルスクリーンコントロール表示
    }
  },

  // 会社情報
  company: {
    name: '合同会社カイタックジャパン',
    nameEn: 'Khaithac Japan LLC',
    address: '〒573-0136 大阪府枚方市春日西町2丁目28番26号',
    tel: '072-300-2410',
    email: 'info@khaithac-jp.com',
    established: '2017年1月',
    capital: '100万円',
    representative: '井本 豊',
    bank: '三菱UFJ銀行 枚方支店'
  },

  // EmailJS設定（お問い合わせフォーム送信用 - オプション）
  // EmailJSを使用する場合は https://www.emailjs.com/ でアカウント作成
  // 200 monthly requestsまで無料
  emailJS: {
    enabled: false,              // EmailJS使用の有効/無効
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey: 'tBov2aYtF3uYwLd03'
  },

  // お問い合わせフォーム設定
  contactForm: {
    // フォーム送信先メールアドレス
    recipientEmail: 'info@khaithac-jp.com',
    
    // 自動返信メール設定
    autoReply: {
      enabled: true,
      subject: 'お問い合わせありがとうございます - カイタックジャパン',
      body: `
        この度は、合同会社カイタックジャパンへお問い合わせいただき、誠にありがとうございます。

        お問い合わせ内容を確認次第、担当者より折り返しご連絡させていただきます。
        通常、翌営業日以内にご返信いたしますので、今しばらくお待ちくださいませ。

        なお、このメールは自動送信されています。
        このメールに返信されましても、対応いたしかねますので、ご了承ください。

        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        合同会社カイタックジャパン
        〒573-0136 大阪府枚方市春日西町2丁目28番26号
        TEL: 072-300-2410
        Email: info@khaithac-jp.com
        営業時間: 平日 9:00〜18:00
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `
    },
    
    // バリデーション設定
    validation: {
      name: {
        minLength: 2,
        maxLength: 50,
        required: true
      },
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true
      },
      phone: {
        pattern: /^[0-9-+()]{10,15}$/,
        required: false
      },
      message: {
        minLength: 10,
        maxLength: 2000,
        required: true
      }
    }
  },

  // サイト全般設定
  site: {
    title: 'カイタックジャパン | 中小企業の業務効率化を支援するITソリューション',
    description: '中小企業の業務効率化を支援するITソリューションカンパニー。ACCESS改修、TALON導入、スクラッチ開発など、現場の声に寄り添ったシステム開発を提供します。',
    keywords: 'カイタックジャパン,IT,DX,ACCESS,TALON,システム開発,業務効率化,中小企業',
    url: 'https://www.khaithac-jp.com',
    ogImage: '/assets/images/og-image.jpg'
  }
};

// 設定ファイルをグローバルスコープに公開
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG;
}

// Node.js環境でも使用可能にする
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}