// チャンピオンデータ
export const champions = [
  {
    name: 'アーリ',
    roles: ['MID'],
    types: ['AP', 'アサシン', 'メイジ'],
  },
  {
    name: 'アカリ',
    roles: ['TOP', 'MID'],
    types: ['AP', 'アサシン'],
  },
  {
    name: 'アジール',
    roles: ['MID'],
    types: ['AP', 'メイジ'],
  },
  {
    name: 'アッシュ',
    roles: ['ADC'],
    types: ['AD', 'マークスマン'],
  },
  {
    name: 'アニビア',
    roles: ['MID'],
    types: ['AP', 'メイジ'],
  },
  // ... 他のチャンピオンも追加可能
].sort((a, b) => a.name.localeCompare(b.name, 'ja')); // 五十音順にソート

// ロール定義
export const roles = {
  TOP: 'トップ',
  JUNGLE: 'ジャングル',
  MID: 'ミッド',
  ADC: 'ADC',
  SUPPORT: 'サポート',
};

// タイプ定義
export const types = {
  AD: 'AD',
  AP: 'AP',
  TANK: 'タンク',
  SUPPORT: 'サポート',
  アサシン: 'アサシン',
  メイジ: 'メイジ',
  ファイター: 'ファイター',
  マークスマン: 'マークスマン',
};
