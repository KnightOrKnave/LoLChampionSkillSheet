import { champions, roles, types } from './data/champions.js';

document.addEventListener('DOMContentLoaded', () => {
    const formPage = document.getElementById('form-page');
    const resultPage = document.getElementById('result-page');
    const championsContainer = document.getElementById('champions-container');
    const championForm = document.getElementById('champion-form');
    const backButton = document.getElementById('back-button');

    // チャンピオン入力フォームの生成
    function createChampionForm() {
        champions.forEach(champion => {
            const div = document.createElement('div');
            div.className = 'champion-item';
            
            div.innerHTML = `
                <span class="champion-name">${champion.name}</span>
                <select class="skill-select" name="${champion.name}">
                    <option value="0">使用不可</option>
                    <option value="1">練習中</option>
                    <option value="2">使用可能</option>
                    <option value="3">得意</option>
                    <option value="4">最得意</option>
                </select>
            `;
            
            championsContainer.appendChild(div);
        });
    }

    // 結果の表示
    function showResults(formData) {
        const masteredChampions = document.getElementById('mastered-champions');
        const roleChampions = document.getElementById('role-champions');
        const typeChampions = document.getElementById('type-champions');

        // 使用可能なチャンピオンのフィルタリング（レベル2以上）
        const usableChampions = champions.filter(champ => 
            parseInt(formData.get(champ.name)) >= 2
        );

        // 使用可能なチャンピオンの表示
        masteredChampions.innerHTML = usableChampions
            .map(champ => `<li>${champ.name} (レベル${formData.get(champ.name)})</li>`)
            .join('');

        // ロール別の表示
        roleChampions.innerHTML = Object.entries(roles)
            .map(([roleKey, roleName]) => {
                const championsInRole = usableChampions
                    .filter(champ => champ.roles.includes(roleKey))
                    .map(champ => `<li>${champ.name} (レベル${formData.get(champ.name)})</li>`)
                    .join('');
                
                return championsInRole ? `
                    <div class="role-group">
                        <h4>${roleName}</h4>
                        <ul class="champion-list">${championsInRole}</ul>
                    </div>
                ` : '';
            })
            .join('');

        // タイプ別の表示
        typeChampions.innerHTML = Object.entries(types)
            .map(([typeKey, typeName]) => {
                const championsOfType = usableChampions
                    .filter(champ => champ.types.includes(typeKey))
                    .map(champ => `<li>${champ.name} (レベル${formData.get(champ.name)})</li>`)
                    .join('');
                
                return championsOfType ? `
                    <div class="type-group">
                        <h4>${typeName}</h4>
                        <ul class="champion-list">${championsOfType}</ul>
                    </div>
                ` : '';
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
