// お知らせデータ
const newsData = [
  {
    id: 1,
    date: '2026.01.26',
    title: 'Webサイトをリニューアルしました',
    detail: 'より見やすく、使いやすいサイトに生まれ変わりました。お客様の課題解決に向けた情報をわかりやすくお届けします。',
    isNew: true,
    icon: 'lightning',
    link: '',
    gradient: 'from-primary/90 to-secondary/90'
  }
];

// アイコンのSVGパス
const iconPaths = {
  lightning: 'M13 10V3L4 14h7v7l9-11h-7z',
  dollar: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
};

// windowオブジェクトに明示的に登録（重要！）
window.newsData = newsData;
window.iconPaths = iconPaths;

console.log('📦 news-data.js loaded');
console.log('  - newsData registered to window:', window.newsData);
console.log('  - iconPaths registered to window:', window.iconPaths);