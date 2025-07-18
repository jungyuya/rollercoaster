// 1. 뉴스 데이터 정의
const koreanNewsItems = [
    { id: 1, title: "[가짜뉴스] 네이버, AI 비서 '클로바X' 공개", link: '#' },
    { id: 2, title: '[가짜뉴스] 카카오, 게임 사업부 분사 결정', link: '#' },
    { id: 3, title: "[가짜뉴스] 쿠팡, '로켓배송' 전국 확대 발표", link: '#' },
    { id: 4, title: "[가짜뉴스] 라인, 일본 시장 점유율 1위 달성", link: '#' },
    { id: 5, title: "[가짜뉴스] 넥슨, 신작 MMORPG '아스가르드2' 출시", link: '#' },
];

const globalNewsItems = [
    { id: 1, title: '[Fake News] Apple announces new Vision Pro 2', link: '#' },
    { id: 2, title: '[Fake News] Google unveils next-gen AI model "Gemini 2.0"', link: '#' },
    { id: 3, title: '[Fake News] Microsoft to acquire Adobe for $300B', link: '#' },
    { id: 4, title: '[Fake News] Amazon launches drone delivery service in 10 cities', link: '#' },
    { id: 5, title: '[Fake News] Tesla unveils new electric pickup truck "Cybertruck Mini"', link: '#' },
];

// 2. 뉴스 목록을 동적으로 생성하고 DOM에 추가하는 함수
/**
 * 주어진 데이터를 바탕으로 뉴스 목록 HTML 요소를 생성하고, 지정된 컨테이너에 추가합니다.
 * @param {string} containerId - 뉴스 목록이 삽입될 HTML 요소의 ID.
 * @param {string} titleText - 뉴스 목록의 제목 (예: "국내 IT 뉴스").
 * @param {Array<Object>} items - 렌더링할 뉴스 아이템 배열. 각 아이템은 {id, title, link} 속성을 가집니다.
 * @param {string} themeClass - 뉴스 목록에 적용할 테마 클래스 (예: "korean-naver-theme").
 */
function renderNewsList(containerId, titleText, items, themeClass) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error: Container with ID "${containerId}" not found.`);
        return;
    }

    const newsListDiv = document.createElement('div');
    newsListDiv.className = `news-list ${themeClass}`;

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    newsListDiv.appendChild(h3);

    const ul = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = item.title;
        li.appendChild(a);
        ul.appendChild(li);
    });

    newsListDiv.appendChild(ul);
    container.appendChild(newsListDiv);
}

// 3. Gemini API 관련 함수
/**
 * 1. 사용자가 입력창에 입력한 텍스트를 서버로 보내서 요약을 요청하는 함수
 */
async function requestSummary() {
    const inputText = document.getElementById('newsInput').value.trim();
    if (!inputText) {
        alert('요약할 내용을 입력해주세요!');
        return;
    }

    try {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: inputText })
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('summaryResult').innerText = data.summary || '요약 결과가 없습니다.';
    } catch (error) {
        console.error(error);
        document.getElementById('summaryResult').innerText = '요약 요청 중 오류가 발생했습니다.';
    }
}

/**
 * 2. 고정 메시지를 서버로 보내서 '오늘의 IT 뉴스 요약'을 요청하는 함수
 */
async function requestTodayNewsSummary() {
    try {
        const response = await fetch('/api/summarize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: '오늘의 IT 뉴스를 요약해줘' })
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('summaryResult').innerText = data.summary || '요약 결과가 없습니다.';
    } catch (error) {
        console.error(error);
        document.getElementById('summaryResult').innerText = '요약 요청 중 오류가 발생했습니다.';
    }
}


// 4. 초기화 및 이벤트 리스너 설정
// 뉴스 목록 렌더링
renderNewsList('korean-news-list-container', '🇰🇷 국내 IT 뉴스', koreanNewsItems, 'korean-naver-theme');
renderNewsList('global-news-list-container', '🅶 글로벌 IT 뉴스', globalNewsItems, 'global-google-theme');

// 버튼 이벤트 리스너 추가
document.getElementById('requestSummaryBtn').addEventListener('click', requestSummary);
document.getElementById('requestTodayNewsBtn').addEventListener('click', requestTodayNewsSummary);