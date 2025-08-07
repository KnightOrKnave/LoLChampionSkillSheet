const champions = [
    {
        name: "アーリ",
        roles: ["MID"],
        types: ["AP", "アサシン", "メイジ"]
    },
    {
        name: "アカリ",
        roles: ["TOP", "MID"],
        types: ["AP", "アサシン"]
    },
    // 他のチャンピオンも同様に追加...
];

// チャンピオンを五十音順にソート
champions.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

const roles = {
    TOP: "トップ",
    JUNGLE: "ジャングル",
    MID: "ミッド",
    ADC: "ADC",
    SUPPORT: "サポート"
};

const types = {
    AD: "AD",
    AP: "AP",
    TANK: "タンク",
    SUPPORT: "サポート",
    アサシン: "アサシン",
    メイジ: "メイジ",
    ファイター: "ファイター",
    マークスマン: "マークスマン"
};
