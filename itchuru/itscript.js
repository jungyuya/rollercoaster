// 스테이지가 '$default'이므로, URL에 별도의 스테이지 경로를 추가하지 않습니다.
const API_BASE_URL = 'https://l8z65r6gfd.execute-api.ap-northeast-2.amazonaws.com';

// 뉴스 목록을 동적으로 생성하고 DOM에 추가하는 함수
function renderNewsList(containerId, titleText, items, themeClass) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Error: Container with ID "${containerId}" not found.`);
        return;
    }
    container.innerHTML = ''; // 기존 내용 지우기

    const newsListDiv = document.createElement('div');
    newsListDiv.className = `news-list ${themeClass}`;

    const h3 = document.createElement('h3');
    // 국내/글로벌 뉴스 헤더에 아이콘 추가 (CSS로도 가능하지만 HTML에서 직접 제어)
    if (containerId === 'korean-news-list-container') {
        h3.innerHTML = '🇰🇷 국내 IT 뉴스';
    } else if (containerId === 'global-news-list-container') {
        h3.innerHTML = '<span class="google-h3-icon">G</span> 글로벌 IT 뉴스';
    } else {
        h3.textContent = titleText; // 기타 경우
    }
    newsListDiv.appendChild(h3);

    const ul = document.createElement('ul');

    if (!Array.isArray(items) || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '뉴스를 불러오는 데 실패했습니다.';
        ul.appendChild(li);
    } else {
        items.forEach(item => {
            const li = document.createElement('li');

            // 1. 뉴스 출처 아이콘 (<span>) 추가
            const sourceIcon = document.createElement('span');
            sourceIcon.classList.add('news-source-icon');
            if (containerId === 'korean-news-list-container') {
                sourceIcon.textContent = 'N'; // 네이버 아이콘 텍스트
                sourceIcon.classList.add('naver-icon');
            } else {
                sourceIcon.textContent = 'G'; // 구글 아이콘 텍스트
                sourceIcon.classList.add('google-icon');
            }
            li.appendChild(sourceIcon);

            // 2. 뉴스 링크 (<a>) 추가
            const a = document.createElement('a');
            a.href = item.link;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = item.title;
            li.appendChild(a);

            // 3. '새 탭으로 열기' 아이콘 (<i>) 추가
            const openNewTabIcon = document.createElement('i');
            openNewTabIcon.classList.add('fas', 'fa-external-link-alt', 'open-new-tab-icon');
            openNewTabIcon.setAttribute('title', '새 탭에서 열기');
            openNewTabIcon.addEventListener('click', (e) => {
                e.preventDefault(); // 기본 링크 동작 방지
                window.open(item.link, '_blank'); // 새 탭으로 열기
            });
            li.appendChild(openNewTabIcon);

            ul.appendChild(li);
        });
    }

    newsListDiv.appendChild(ul);
    container.appendChild(newsListDiv);
}

// 네이버 뉴스를 요약하여 표시
async function requestNaverNewsSummary() {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = '국내 IT 뉴스를 요약하는 중... 🤖';

    try {
        const response = await fetch(`${API_BASE_URL}/api/summarize-naver`); // API_BASE_URL 사용
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        const data = await response.json();
        summaryResultDiv.innerText = data.summary || '요약 결과가 없습니다.';
    } catch (error) {
        console.error('국내 뉴스 요약 요청 오류:', error);
        summaryResultDiv.innerText = '국내 뉴스 요약 중 오류가 발생했습니다. 😿';
    }
}

// 구글 뉴스를 요약하여 표시
async function requestGoogleNewsSummary() {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = '글로벌 IT 뉴스를 요약하는 중... 🤖';

    try {
        const response = await fetch(`${API_BASE_URL}/api/summarize-google`); // API_BASE_URL 사용
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        const data = await response.json();
        summaryResultDiv.innerText = data.summary || '요약 결과가 없습니다.';
    } catch (error) {
        console.error('글로벌 뉴스 요약 요청 오류:', error);
        summaryResultDiv.innerText = '글로벌 뉴스 요약 중 오류가 발생했습니다. 😿';
    }
}

// 사용자 입력을 받아 Gemini와 대화하는 챗봇 기능
async function chatWithGemini(message) {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = '츄르는 지금 생각하는 중... 😺';

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, { // API_BASE_URL 사용
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        summaryResultDiv.innerText = data.response || '응답이 없습니다.';
    } catch (error) {
        console.error('챗봇 요청 오류:', error);
        summaryResultDiv.innerText = '챗봇 요청 중 오류가 발생했습니다. 😿';
    }
}

// 페이지 로드 시 모든 뉴스 목록을 가져와 렌더링
async function fetchAndRenderAllNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/news`); // API_BASE_URL 사용
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        const data = await response.json();

        renderNewsList('korean-news-list-container', '국내 IT 뉴스', data.korean_news, 'korean-naver-theme');
        renderNewsList('global-news-list-container', '글로벌 IT 뉴스', data.global_news, 'global-google-theme');

    } catch (error) {
        console.error('뉴스 로딩 실패:', error);
        renderNewsList('korean-news-list-container', '국내 IT 뉴스', [], 'korean-naver-theme');
        renderNewsList('global-news-list-container', '글로벌 IT 뉴스', [], 'global-google-theme');
    }
}

// DOM 로드 완료 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 뉴스 목록 불러오기
    fetchAndRenderAllNews();

    // "국내 IT 요약" 버튼 클릭 이벤트
    const requestSummaryBtn = document.getElementById('requestSummaryBtn');
    if (requestSummaryBtn) {
        requestSummaryBtn.addEventListener('click', requestNaverNewsSummary);
    }
    
    // "해외 IT 한입" 버튼 클릭 이벤트
    const requestTodayNewsBtn = document.getElementById('requestTodayNewsBtn');
    if (requestTodayNewsBtn) {
        requestTodayNewsBtn.addEventListener('click', requestGoogleNewsSummary);
    }

    // newsInput 텍스트 영역에 Enter 키 입력 시 챗봇 기능 호출
    const newsInput = document.getElementById('newsInput');
    if (newsInput) {
        newsInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
                const message = newsInput.value.trim();
                if (message) {
                    chatWithGemini(message);
                    newsInput.value = ''; // 입력창 초기화
                }
            }
        });
    }

    // "질문하기(이모티콘 비행기 대체)" 버튼 클릭 시 챗봇 기능 호출
    const sendChatMessageBtn = document.getElementById('sendChatMessageBtn');
    if (sendChatMessageBtn) {
        sendChatMessageBtn.addEventListener('click', () => {
            const message = newsInput.value.trim();
            if (message) {
                chatWithGemini(message);
                newsInput.value = ''; // 입력창 초기화
            }
        });
    }
});