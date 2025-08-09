const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('lol_champion_descriptors_with_damage.csv')
  .pipe(csv(['name', 'attributes']))
  .on('data', (data) => {
    const values = Object.values(data)[1].split(',');
    const name = values[0];
    const attributes = values.slice(1, -1);
    const damage = values[values.length - 1];
    
    // 役割の特定
    const types = attributes.filter(attr => 
      ['タンク', 'ファイター', 'アサシン', 'メイジ', 'マークスマン', 'サポート'].includes(attr)
    );
    
    // ロールの推定
    const roles = [];
    if (attributes.includes('マークスマン')) roles.push('ADC');
    if (attributes.includes('サポート')) roles.push('SUPPORT');
    if (attributes.includes('メイジ')) roles.push('MID');
    if (attributes.includes('ファイター') || attributes.includes('タンク')) roles.push('TOP');
    if (attributes.includes('ジャングラー')) roles.push('JUNGLE');
    
    // 基本属性以外の特徴を抽出
    const otherAttributes = attributes.filter(attr => 
      !types.includes(attr) && !['物理', '魔法', '混合'].includes(attr)
    );
    
    results.push({
      name,
      roles: roles.length > 0 ? roles : ['MID'], // デフォルトはMID
      types,
      attributes: otherAttributes,
      damage
    });
  })
  .on('end', () => {
    const output = `export const champions = ${JSON.stringify(results, null, 2)};

// ロール定義
export const roles = {
    TOP: "トップ",
    JUNGLE: "ジャングル",
    MID: "ミッド",
    ADC: "ADC",
    SUPPORT: "サポート"
};

// タイプ定義（チャンピオンの主要な役割）
export const types = {
    タンク: "タンク",
    ファイター: "ファイター",
    アサシン: "アサシン",
    メイジ: "メイジ",
    マークスマン: "マークスマン",
    サポート: "サポート"
};

// 属性定義（チャンピオンの特徴）
export const attributes = {
    近接: "近接",
    遠隔: "遠隔",
    持続火力: "持続火力",
    バースト: "バースト",
    機動力: "機動力",
    自己回復: "自己回復",
    行動妨害: "行動妨害",
    イニシエーター: "イニシエーター",
    ステルス: "ステルス",
    範囲: "範囲",
    召喚: "召喚",
    ハイパーキャリー: "ハイパーキャリー",
    通常攻撃: "通常攻撃",
    長射程: "長射程",
    耐久: "耐久",
    デュエリスト: "デュエリスト",
    ダイブ: "ダイブ",
    変身: "変身",
    バトルキャスター: "バトルキャスター",
    継続ダメージ: "継続ダメージ",
    味方保護: "味方保護"
};

// ダメージタイプ定義
export const damageTypes = {
    物理: "物理",
    魔法: "魔法",
    混合: "混合"
};`;
    
    fs.writeFileSync('src/js/data/championData.js', output);
    console.log('Champion data has been generated!');
  });
