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
    h3.textContent = titleText;
    newsListDiv.appendChild(h3);

    const ul = document.createElement('ul');

    if (!Array.isArray(items) || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = '뉴스를 불러오는 데 실패했습니다.';
        ul.appendChild(li);
    } else {
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
    }

    newsListDiv.appendChild(ul);
    container.appendChild(newsListDiv);
}

// 네이버 뉴스를 요약하여 표시하는 함수
async function requestNaverNewsSummary() {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = '국내 IT 뉴스를 요약하는 중... 🤖';

    try {
        const response = await fetch('http://127.0.0.1:5000/api/summarize-naver');
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

// 구글 뉴스를 요약하여 표시하는 함수
async function requestGoogleNewsSummary() {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = '글로벌 IT 뉴스를 요약하는 중... 🤖';

    try {
        const response = await fetch('http://127.0.0.1:5000/api/summarize-google');
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

// 사용자 입력을 받아 Gemini와 대화하는 함수 (챗봇 기능)
async function chatWithGemini(message) {
    const summaryResultDiv = document.getElementById('summaryResult');
    summaryResultDiv.innerText = 'Gemini와 대화 중... 🤖'; // 로딩 메시지

    try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
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

// 페이지 로드 시 백엔드에서 모든 뉴스 목록을 가져와 렌더링하는 함수
async function fetchAndRenderAllNews() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/news');
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        const data = await response.json();

        renderNewsList('korean-news-list-container', '🇰🇷 국내 IT 뉴스', data.korean_news, 'korean-naver-theme');
        renderNewsList('global-news-list-container', '🅶 글로벌 IT 뉴스', data.global_news, 'global-google-theme');

    } catch (error) {
        console.error('뉴스 로딩 실패:', error);
        renderNewsList('korean-news-list-container', '🇰🇷 국내 IT 뉴스', [], 'korean-naver-theme');
        renderNewsList('global-news-list-container', '🅶 글로벌 IT 뉴스', [], 'global-google-theme');
    }
}

// --- DOMContentLoaded 이벤트 리스너 ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 로드 시 뉴스 목록 불러오기
    fetchAndRenderAllNews();

    // 2. 버튼 클릭 이벤트 리스너 설정
    const requestSummaryBtn = document.getElementById('requestSummaryBtn'); // "국내 IT 요약" 버튼
    if (requestSummaryBtn) {
        requestSummaryBtn.addEventListener('click', requestNaverNewsSummary);
    }
    
    const requestTodayNewsBtn = document.getElementById('requestTodayNewsBtn'); // "해외 IT 한입" 버튼
    if (requestTodayNewsBtn) {
        requestTodayNewsBtn.addEventListener('click', requestGoogleNewsSummary);
    }

    // 3. newsInput 텍스트 영역에 엔터 키 입력 시 챗봇 기능 호출
    const newsInput = document.getElementById('newsInput');
    if (newsInput) {
        newsInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) { // Shift+Enter는 줄바꿈, Enter는 전송
                event.preventDefault(); // 기본 Enter 동작(줄바꿈) 방지
                const message = newsInput.value.trim();
                if (message) {
                    chatWithGemini(message);
                    newsInput.value = ''; // 입력창 초기화
                }
            }
        });
    }

    // 4. "질문하기 (챗봇)" 버튼 클릭 시 챗봇 기능 호출
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