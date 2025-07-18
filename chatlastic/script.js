document.addEventListener('DOMContentLoaded', () => {

    // --- API Gateway 엔드포인트 설정 (새로운 주소로 업데이트) ---
    const API_ENDPOINT = 'https://u94xlhgjq5.execute-api.ap-northeast-2.amazonaws.com/prod/chat';

    // --- DOM 요소 선택 ---
    const introSection = document.getElementById('intro');
    const chatSection = document.getElementById('chat');

    const dateInput = document.getElementById('date'); // Keep the same ID

    // flatpickr 적용
    flatpickr("#date", {
        dateFormat: "Y-m-d",               // 실제 값 (서버 전송용)
        altInput: true,                    // 사용자가 보는 입력창
        altFormat: "Y년 m월 d일",          // 보기 좋게
        minDate: "1950-01-01",
        maxDate: "today",
        disableMobile: true
    });


    // 날짜 선택 범위 제한 추가
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const maxDate = `${yyyy}-${mm}-${dd}`;

    dateInput.min = '1950-01-01';
    dateInput.max = maxDate;

    dateInput.min = '1950-01-01';
    dateInput.max = maxDate;
    const nameInput = document.getElementById('text');
    const startButton = document.getElementById('startButton');
    const homeButton = document.getElementById('homeButton');
    const introHomeButton = document.getElementById('introHomeButton'); // 인트로 홈 버튼 요소 추가 <--- 이 줄이 추가/수정됨
    const backButton = document.getElementById('backButton');

    const chatBox = document.querySelector('.chat-box');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.getElementById('sendButton');
    const loader = document.getElementById('loader');

    // --- 상태 변수 ---
    let userMessages = [];
    let assistantMessages = [];
    let myDateTime = '';
    let currentUserId = ''; // 사용자 ID 추가

    // 초기 챗봇 메시지
    const initialAssistantMessageText = "마음을 편히 열고 고민을 털어놓아주세요. 챗라스틱이 당신을 위로하고, 함께 고민을 나누며 해결해 나갈 거예요.";

    // --- 함수 정의 ---

    /** 사용자 ID를 초기화하거나 가져오는 함수 */
    function initializeUserId() {
        let userId = sessionStorage.getItem('chatlasticUserId');
        if (!userId) {
            userId = crypto.randomUUID(); // 새로운 UUID 생성
            sessionStorage.setItem('chatlasticUserId', userId); // 세션 스토리지에 저장
        }
        currentUserId = userId; // 전역 변수에 할당
        console.log('Current User ID:', currentUserId); // 디버깅용
    }


    /** 채팅방 초기 상태를 설정하는 함수 */
    function initializeChat() {
        chatBox.innerHTML = ''; // 채팅 박스 비우기
        appendMessage(initialAssistantMessageText, 'assistant', false); // 초기 메시지는 링크 없이 추가
        userMessages = []; // 사용자 메시지 배열 초기화
        assistantMessages = []; // 어시스턴트 메시지 배열 초기화
        nameInput.value = ''; // 이름 입력 필드 비우기
        dateInput.value = ''; // 생년월일 입력 필드 비우기
        chatInput.value = ''; // 채팅 입력 필드 비우기
        initializeUserId(); // 사용자 ID 초기화/가져오기
    }

    /** 인트로 화면에서 채팅 화면으로 전환하는 함수 */
    function startChat() {
        const name = nameInput.value.trim(); // 이름 값 가져오기
        const date = dateInput.value.trim(); // 날짜 값 가져오기

        // --- 날짜 형식 유효성 검사 추가 ---
        const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식
        if (!datePattern.test(date)) {
            showMessageBox('생년월일을 YYYY-MM-DD 형식으로 입력해주세요. (예: 2000-01-01)', 'alert', () => dateInput.focus());
            return;
        }
        // --- 날짜 형식 유효성 검사 끝 ---

        if (date === '') {
            showMessageBox('생년월일을 입력해주세요.', 'alert', () => dateInput.focus());
            return;
        }

        // 이름도 필수로 받고 싶다면 아래 주석 해제
        // if (name === '') {
        //     showMessageBox('이름(닉네임)을 입력해주세요.', 'alert', () => nameInput.focus());
        //     return;
        // }

        myDateTime = date + (name || ''); // 이름이 비어있으면 빈 문자열로 처리

        // CSS와 일관성을 위해 display: 'flex'로 변경
        introSection.style.display = 'none';
        chatSection.style.display = 'flex';
        chatInput.focus(); // 채팅 입력창에 포커스
    }


    /** 메시지 전송 함수 */
    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user');
        userMessages.push(messageText);
        chatInput.value = '';
        loader.style.display = 'block';
        sendButton.disabled = true;
        chatInput.disabled = true;

        try {
            // 이름을 가져와서 서버로 함께 전송
            const userNameToSend = nameInput.value.trim(); // 이름 입력 필드의 현재 값을 가져옴

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    userName: userNameToSend, // <--- 이 부분 추가: 클라이언트에서 입력된 이름 전송
                    myDateTime: myDateTime, // 이미 startChat에서 설정된 값
                    userMessages: userMessages,
                    assistantMessages: assistantMessages,
                })
            });

            if (!response.ok) {
                throw new Error(`서버 응답 오류: ${response.status}`);
            }

            const data = await response.json();
            assistantMessages.push(data.assistant);
            appendMessage(data.assistant, 'assistant', true);

        } catch (error) {
            console.error("메시지 전송 중 오류 발생:", error);
            appendMessage("죄송합니다. 메시지를 보내는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", 'assistant', false);
            showMessageBox("메시지 전송 중 오류가 발생했습니다. 콘솔을 확인해주세요.", 'alert');
        } finally {
            loader.style.display = 'none';
            sendButton.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    /**
     * 채팅창에 메시지를 추가하는 헬퍼 함수
     * @param {string} text - 표시할 메시지 텍스트
     * @param {'user' | 'assistant'} sender - 메시지 발신자 ('user' 또는 'assistant')
     * @param {boolean} [addLink=false] - 어시스턴트 메시지일 경우 "당근 주기" 링크를 추가할지 여부
     */
    function appendMessage(text, sender, addLink = false) { // addLink 기본값 false로 설정
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('chat-message', sender === 'user' ? 'user-message' : 'assistant-message');

        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = text;

        // 챗봇 메시지이고, 링크를 추가하도록 요청된 경우에만 링크 추가
        if (sender === 'assistant' && addLink) {
            const tossLink = document.createElement('a');
            tossLink.href = 'https://toss.me/chatlastic';
            //tossLink.textContent = '🥕 당근 주기';
            tossLink.target = '_blank'; // 새 탭에서 열기
            tossLink.style.marginLeft = '10px';
            tossLink.style.textDecoration = 'none';
            tossLink.style.color = '#007bff'; // 링크 색상 명확화
            tossLink.style.fontWeight = '500'; // 링크 텍스트 굵기 추가

            messageParagraph.appendChild(tossLink); // 기존 줄에 이어서 링크 추가
        }

        messageWrapper.appendChild(messageParagraph);
        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight; // 항상 스크롤 하단으로
    }

    /** Enter 키로 메시지 전송 처리 */
    function handleKeyPress(event) {
        if (event.key === 'Enter' && !sendButton.disabled) {
            event.preventDefault(); // Enter 키 기본 동작(줄바꿈) 방지
            sendMessage();
        }
    }

    // --- 이벤트 리스너 연결 ---
    startButton.addEventListener('click', startChat);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', handleKeyPress);
    backButton.addEventListener('click', () => {
        introSection.style.display = 'flex';
        chatSection.style.display = 'none';
        initializeChat();
        nameInput.focus();
    });

    // 이름 및 생년월일 입력창에서 Enter 키 입력 시 시작 버튼 클릭 효과
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Enter 키 기본 동작 방지
            startButton.click();
        }
    });
    dateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Enter 키 기본 동작 방지
            startButton.click();
        }
    });

    // 페이지 로드 시 채팅방 초기화
    initializeChat();
});