const fs = require('fs');
const path = require('path');

// CSVファイルを読み込む
const csvData = fs.readFileSync(path.join(__dirname, 'lol_champion_descriptors_with_damage.csv'), 'utf8');
const lines = csvData.split('\n').filter(line => line.trim());

// チャンピオンデータの生成
const champions = lines.map(line => {
    const [name, ...attributes] = line.split(',');
    const damage = attributes.pop().trim();
    
    // 基本タイプの抽出（タンク、ファイター、アサシン、メイジ、マークスマン、サポート）
    const types = attributes.filter(attr => 
        ['タンク', 'ファイター', 'アサシン', 'メイジ', 'マークスマン', 'サポート'].includes(attr.trim())
    ).map(t => t.trim());
    
    // ロールの推定
    const roles = [];
    const attrs = attributes.map(a => a.trim());
    
    if (attrs.includes('マークスマン')) roles.push('ADC');
    if (attrs.includes('サポート')) roles.push('SUPPORT');
    if (attrs.includes('メイジ') && !attrs.includes('サポート')) roles.push('MID');
    if ((attrs.includes('ファイター') || attrs.includes('タンク')) && !attrs.includes('サポート')) {
        roles.push('TOP');
        if (attrs.includes('イニシエーター') || attrs.includes('機動力')) {
            roles.push('JUNGLE');
        }
    }
    if (attrs.includes('アサシン') && !roles.includes('MID')) roles.push('MID');
    
    // その他の属性を抽出
    const otherAttributes = attributes.filter(attr => 
        !types.includes(attr.trim()) && 
        !['物理', '魔法', '混合'].includes(attr.trim())
    ).map(a => a.trim());
    
    return {
        name,
        roles: roles.length > 0 ? [...new Set(roles)] : ['MID'], // 重複を除去、デフォルトはMID
        types,
        attributes: otherAttributes,
        damage
    };
});

// 出力用の文字列を生成
const output = `// チャンピオンデータ
export const champions = ${JSON.stringify(champions, null, 2)}.sort((a, b) => a.name.localeCompare(b.name, 'ja')); // 五十音順にソート

// ロール定義
export const roles = {
    TOP: "トップ",
    JUNGLE: "ジャングル",
    MID: "ミッド",
    ADC: "ADC",
    SUPPORT: "サポート"
};

// チャンピオンタイプ定義
export const types = {
    タンク: "タンク",
    ファイター: "ファイター",
    アサシン: "アサシン",
    メイジ: "メイジ",
    マークスマン: "マークスマン",
    サポート: "サポート"
};

// 属性定義
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

// ファイルに書き出し
fs.writeFileSync(path.join(__dirname, '../src/js/data/championData.js'), output);
console.log('Champion data has been generated!');
