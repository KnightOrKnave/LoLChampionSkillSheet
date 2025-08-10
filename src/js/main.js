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
                        <span class="skill-label bad">苦手・使えない</span>
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
    const damageTypeChampions = document.getElementById(
      'damage-type-champions'
    );
    const attackRangeChampions = document.getElementById(
      'attack-range-champions'
    );
    const statsContainer = document.getElementById('stats-container');

    // スコアに基づいてチャンピオンをフィルタリング（「使ったことない」(0)以外を表示）
    const usableChampions = champions.filter(
      (champ) => parseInt(formData.get(champ.name)) !== 0
    );

    // スキルレベルを取得する関数
    const getSkillLevel = (score) => {
      if (score === 100) return '絶対の自信あり';
      if (score === 75) return '得意';
      if (score === 50) return '使える';
      if (score === 25) return 'スキルはわかる';
      if (score === -100) return '苦手・使えない';
      return '使ったことない';
    };

    // チャンピオンリストを生成する関数
    const createChampionList = (champ) => {
      const score = parseInt(formData.get(champ.name));
      const skillLevel = getSkillLevel(score);
      return `<li>${champ.nameJa} (${skillLevel})</li>`;
    };

    // テーブル表示用の関数
    function updateChampionsTable(
      champions,
      sortBy = 'score-desc',
      filterText = ''
    ) {
      const tableBody = document.getElementById('champions-table-body');
      const filteredChampions = champions.filter(
        (champ) =>
          filterText === '' ||
          champ.nameJa.toLowerCase().includes(filterText.toLowerCase())
      );

      // ソート処理
      const sortedChampions = [...filteredChampions].sort((a, b) => {
        const scoreA = parseInt(formData.get(a.name));
        const scoreB = parseInt(formData.get(b.name));

        switch (sortBy) {
          case 'score-desc':
            return scoreB - scoreA;
          case 'score-asc':
            return scoreA - scoreB;
          case 'name-asc':
            return a.nameJa.localeCompare(b.nameJa);
          case 'name-desc':
            return b.nameJa.localeCompare(a.nameJa);
          default:
            return 0;
        }
      });

      // テーブル内容の更新
      tableBody.innerHTML = sortedChampions
        .map((champ) => {
          const score = parseInt(formData.get(champ.name));
          const skillLevel = getSkillLevel(score);
          const skillColorClass =
            score >= 75
              ? 'advanced'
              : score >= 50
              ? 'intermediate'
              : score >= 25
              ? 'beginner'
              : score === -100
              ? 'bad'
              : 'novice';

          return `
          <tr>
            <td>${champ.nameJa}</td>
            <td>${score}</td>
            <td><span class="skill-badge ${skillColorClass}">${skillLevel}</span></td>
            <td><div class="badge-list">${champ.roles
              .map((role) => `<span class="badge">${roles[role]}</span>`)
              .join('')}</div></td>
            <td><div class="badge-list">${champ.types
              .map((type) => `<span class="badge">${types[type]}</span>`)
              .join('')}</div></td>
            <td><span class="badge">${damageTypes[champ.damage]}</span></td>
            <td><span class="badge">${
              champ.attributes.includes('遠隔') ? '遠隔' : '近接'
            }</span></td>
          </tr>
        `;
        })
        .join('');
    }

    // イベントリスナーの設定
    const sortSelect = document.getElementById('sort-select');
    const filterInput = document.getElementById('champion-filter');

    sortSelect.addEventListener('change', () => {
      updateChampionsTable(
        usableChampions,
        sortSelect.value,
        filterInput.value
      );
    });

    filterInput.addEventListener('input', () => {
      updateChampionsTable(
        usableChampions,
        sortSelect.value,
        filterInput.value
      );
    });

    // 初期テーブル表示
    updateChampionsTable(usableChampions);

    // チャンピオンリストをスコアでソートする関数
    const sortChampionsByScore = (champions) => {
      return [...champions].sort((a, b) => {
        const scoreA = parseInt(formData.get(a.name));
        const scoreB = parseInt(formData.get(b.name));
        return scoreB - scoreA; // 降順ソート
      });
    };

    // チャンピオングループを生成する関数
    const createChampionGroup = (title, champions) => {
      const sortedChampions = sortChampionsByScore(champions)
        .map(createChampionList)
        .join('');

      return sortedChampions
        ? `
          <div class="group">
              <h4>${title}</h4>
              <ul class="champion-list">${sortedChampions}</ul>
          </div>
        `
        : '';
    };

    // ロール別の表示
    roleChampions.innerHTML = Object.entries(roles)
      .map(([roleKey, roleName]) => {
        const championsInRole = usableChampions.filter((champ) =>
          champ.roles.includes(roleKey)
        );
        return createChampionGroup(roleName, championsInRole);
      })
      .join('');

    // タイプ別の表示
    typeChampions.innerHTML = Object.entries(types)
      .map(([typeKey, typeName]) => {
        const championsOfType = usableChampions.filter((champ) =>
          champ.types.includes(typeKey)
        );
        return createChampionGroup(typeName, championsOfType);
      })
      .join('');

    // ダメージタイプ別の表示
    damageTypeChampions.innerHTML = Object.entries(damageTypes)
      .map(([damageType, displayName]) => {
        const championsOfDamageType = usableChampions.filter(
          (champ) => champ.damage === damageType
        );
        return createChampionGroup(displayName, championsOfDamageType);
      })
      .join('');

    // 攻撃範囲別の表示
    const rangeTypes = { 近接: '近接', 遠隔: '遠隔' };
    attackRangeChampions.innerHTML = Object.entries(rangeTypes)
      .map(([rangeType, displayName]) => {
        const championsOfRange = usableChampions.filter((champ) =>
          champ.attributes.includes(rangeType)
        );
        return createChampionGroup(displayName, championsOfRange);
      })
      .join('');

    // ページの切り替えとスクロール位置のリセット
    formPage.classList.remove('active');
    resultPage.classList.add('active');
    // ページトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'instant', // すぐにトップに移動
    });
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
    // ページトップにスクロール
    window.scrollTo({
      top: 0,
      behavior: 'instant', // すぐにトップに移動
    });
  });

  // スクロールボタンの処理
  const scrollBottomButton = document.getElementById('scroll-bottom');

  // スクロール位置に応じてボタンの状態を更新
  function updateScrollButton() {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = scrollPosition >= documentHeight - 50; // 50pxのマージンを設定

    scrollBottomButton.textContent = isAtBottom ? '最初に移動' : '最後に移動';
  }

  // スクロールボタンのクリック処理
  scrollBottomButton.addEventListener('click', () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const isAtBottom = scrollPosition >= documentHeight - 50;

    window.scrollTo({
      top: isAtBottom ? 0 : documentHeight,
      behavior: 'smooth',
    });
  });

  // スクロールイベントの監視
  window.addEventListener('scroll', updateScrollButton);
  // 画面サイズ変更時にも更新
  window.addEventListener('resize', updateScrollButton);
  // 初期状態の設定
  updateScrollButton();

  // 初期化
  createChampionForm();
});
