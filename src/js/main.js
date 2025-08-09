import {
  champions,
  roles,
  types,
  attributes,
  damageTypes,
} from './data/championData.js';

document.addEventListener('DOMContentLoaded', () => {
  const formPage = document.getElementById('form-page');
  const resultPage = document.getElementById('result-page');
  const championsContainer = document.getElementById('champions-container');
  const championForm = document.getElementById('champion-form');
  const backButton = document.getElementById('back-button');

  // チャンピオン入力フォームの生成
  function createChampionForm() {
    champions.forEach((champion) => {
      const div = document.createElement('div');
      div.className = 'champion-item';

      div.innerHTML = `
                <span class="champion-name">${champion.nameJa}</span>
                <div class="skill-radio-group">
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="-100">
                        <span class="skill-label bad">使えない</span>
                    </label>
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="0" checked>
                        <span class="skill-label novice">使ったことない</span>
                    </label>
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="25">
                        <span class="skill-label beginner">スキルはわかる</span>
                    </label>
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="50">
                        <span class="skill-label intermediate">使える</span>
                    </label>
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="75">
                        <span class="skill-label advanced">得意</span>
                    </label>
                    <label class="skill-radio">
                        <input type="radio" name="${champion.name}" value="100">
                        <span class="skill-label master">絶対の自信あり</span>
                    </label>
                </div>
            `;

      championsContainer.appendChild(div);
    });
  }

  // タイプごとの統計を計算
  function calculateTypeStats(champions, formData) {
    const stats = {
      types: {},
      roles: {},
      damage: { 物理: 0, 魔法: 0, 混合: 0 },
      range: { 近接: 0, 遠隔: 0 },
      attributes: {},
    };

    champions.forEach((champ) => {
      // タイプの集計
      champ.types.forEach((type) => {
        stats.types[type] = (stats.types[type] || 0) + 1;
      });

      // ロールの集計
      champ.roles.forEach((role) => {
        stats.roles[role] = (stats.roles[role] || 0) + 1;
      });

      // ダメージタイプの集計
      stats.damage[champ.damage]++;

      // レンジタイプの集計
      if (champ.attributes.includes('近接')) stats.range.近接++;
      if (champ.attributes.includes('遠隔')) stats.range.遠隔++;

      // その他の属性の集計
      champ.attributes.forEach((attr) => {
        if (attr !== '近接' && attr !== '遠隔') {
          stats.attributes[attr] = (stats.attributes[attr] || 0) + 1;
        }
      });
    });

    return stats;
  }

  // 結果の表示
  function showResults(formData) {
    const masteredChampions = document.getElementById('mastered-champions');
    const roleChampions = document.getElementById('role-champions');
    const typeChampions = document.getElementById('type-champions');
    const statsContainer = document.getElementById('stats-container'); // 使用可能なチャンピオンのフィルタリング（スコア25以上）
    const usableChampions = champions.filter(
      (champ) => parseInt(formData.get(champ.name)) >= 25
    );

    // 使用可能なチャンピオンの表示
    masteredChampions.innerHTML = usableChampions
      .map((champ) => {
        const score = parseInt(formData.get(champ.name));
        let skillLevel = '';
        if (score === 100) skillLevel = '絶対の自信あり';
        else if (score === 75) skillLevel = '得意';
        else if (score === 50) skillLevel = '使える';
        else if (score === 25) skillLevel = 'スキルはわかる';
        return `<li>${champ.name} (${skillLevel})</li>`;
      })
      .join('');

    // ロール別の表示
    roleChampions.innerHTML = Object.entries(roles)
      .map(([roleKey, roleName]) => {
        const championsInRole = usableChampions
          .filter((champ) => champ.roles.includes(roleKey))
          .map((champ) => {
            const score = parseInt(formData.get(champ.name));
            let skillLevel = '';
            if (score === 100) skillLevel = '絶対の自信あり';
            else if (score === 75) skillLevel = '得意';
            else if (score === 50) skillLevel = '使える';
            else if (score === 25) skillLevel = 'スキルはわかる';
            return `<li>${champ.name} (${skillLevel})</li>`;
          })
          .join('');

        return championsInRole
          ? `
                    <div class="role-group">
                        <h4>${roleName}</h4>
                        <ul class="champion-list">${championsInRole}</ul>
                    </div>
                `
          : '';
      })
      .join('');

    // タイプ別の表示
    typeChampions.innerHTML = Object.entries(types)
      .map(([typeKey, typeName]) => {
        const championsOfType = usableChampions
          .filter((champ) => champ.types.includes(typeKey))
          .map((champ) => {
            const score = parseInt(formData.get(champ.name));
            let skillLevel = '';
            if (score === 100) skillLevel = '絶対の自信あり';
            else if (score === 75) skillLevel = '得意';
            else if (score === 50) skillLevel = '使える';
            else if (score === 25) skillLevel = 'スキルはわかる';
            return `<li>${champ.name} (${skillLevel})</li>`;
          })
          .join('');

        return championsOfType
          ? `
                    <div class="type-group">
                        <h4>${typeName}</h4>
                        <ul class="champion-list">${championsOfType}</ul>
                    </div>
                `
          : '';
      })
      .join('');

    // ページの切り替え
    formPage.classList.remove('active');
    resultPage.classList.add('active');
  }

  // フォームの送信処理
  championForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(championForm);
    showResults(formData);
  });

  // 戻るボタンの処理
  backButton.addEventListener('click', () => {
    resultPage.classList.remove('active');
    formPage.classList.add('active');
  });

  // 初期化
  createChampionForm();
});
