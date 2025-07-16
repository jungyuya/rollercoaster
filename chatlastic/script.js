document.addEventListener('DOMContentLoaded', () => {

    // --- API Gateway 엔드포인트 설정 (새로운 주소로 업데이트) ---
    const API_ENDPOINT = 'https://u94xlhgjq5.execute-api.ap-northeast-2.amazonaws.com/prod/chat';

    // --- DOM 요소 선택 ---
    const introSection = document.getElementById('intro');
    const chatSection = document.getElementById('chat');
    const dateInput = document.getElementById('date');
    const nameInput = document.getElementById('text');
    const startButton = document.getElementById('startButton');
    const homeButton = document.getElementById('homeButton');

    const chatBox = document.querySelector('.chat-box');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.getElementById('sendButton');
    const loader = document.getElementById('loader');

    // 커스텀 메시지 박스 관련 DOM 요소 (chatlastic/index.html에 이 요소를 추가해야 합니다)
    const customMessageBox = document.getElementById('customMessageBox');
    const messageBoxText = document.getElementById('messageBoxText');
    const messageBoxConfirmBtn = document.getElementById('messageBoxConfirmBtn');
    const messageBoxCancelBtn = document.getElementById('messageBoxCancelBtn');

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

    /** 커스텀 메시지 박스를 표시하는 함수 */
    function showMessageBox(message, type = 'alert', onConfirm = null) {
        messageBoxText.textContent = message;
        messageBoxCancelBtn.classList.add('hidden'); // 기본적으로 취소 버튼 숨김

        if (type === 'confirm') {
            messageBoxCancelBtn.classList.remove('hidden');
            messageBoxConfirmBtn.onclick = () => {
                customMessageBox.classList.add('hidden');
                if (onConfirm) onConfirm(true);
            };
            messageBoxCancelBtn.onclick = () => {
                customMessageBox.classList.add('hidden');
                if (onConfirm) onConfirm(false);
            };
        } else { // 'alert' 타입
            messageBoxConfirmBtn.onclick = () => {
                customMessageBox.classList.add('hidden');
                if (onConfirm) onConfirm(); // 확인 버튼 클릭 시 콜백 실행
            };
        }
        customMessageBox.classList.remove('hidden');
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
        const name = nameInput.value.trim(); // 공백 제거
        const date = dateInput.value.trim(); // 공백 제거

        if (date === '') {
            showMessageBox('생년월일을 입력해주세요.', 'alert', () => dateInput.focus());
            return;
        }

        // 이름도 필수로 받고 싶다면 아래 주석 해제
        // if (name === '') {
        //     showMessageBox('이름(닉네임)을 입력해주세요.', 'alert', () => nameInput.focus());
        //     return;
        // }

        myDateTime = date + (name || ''); // 이름이 비어있으면 빈 문자열로 처리

        // CSS와 일관성을 위해 display: 'flex'로 변경
        introSection.style.display = 'none';
        chatSection.style.display = 'flex';
        chatInput.focus(); // 채팅 입력창에 포커스
    }

    /** 채팅 화면에서 홈으로 돌아가는 함수 */
    function goHome() {
        showMessageBox("대화 내용이 모두 사라집니다. 정말로 홈으로 돌아가시겠습니까?", 'confirm', (confirmed) => {
            if (confirmed) {
                introSection.style.display = 'flex'; // 인트로 화면은 flex로 설정 (CSS 레이아웃에 맞춤)
                chatSection.style.display = 'none';
                initializeChat(); // 채팅방 상태 초기화
                nameInput.focus(); // 홈으로 돌아왔을 때 이름 입력창에 포커스
            }
        });
    }

    /** 메시지 전송 함수 */
    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        appendMessage(messageText, 'user'); // 사용자 메시지 추가 (링크 없음)
        userMessages.push(messageText);
        chatInput.value = ''; // 입력창 비우기
        loader.style.display = 'block'; // 로더 표시
        sendButton.disabled = true; // 전송 버튼 비활성화
        chatInput.disabled = true; // 입력창 비활성화 (로딩 중)

        try {
            const response = await fetch(API_ENDPOINT, { // API_ENDPOINT 변수 사용
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId, // userId 추가
                    myDateTime: myDateTime,
                    userMessages: userMessages,
                    assistantMessages: assistantMessages,
                })
            });

            if (!response.ok) {
                // HTTP 오류 시 특정 상태 코드에 대한 처리 추가 가능 (예: 400, 500)
                throw new Error(`서버 응답 오류: ${response.status}`);
            }

            const data = await response.json();
            assistantMessages.push(data.assistant);
            appendMessage(data.assistant, 'assistant', true); // 챗봇 메시지 추가 (링크 포함)

        } catch (error) {
            console.error("메시지 전송 중 오류 발생:", error);
            // 오류 메시지는 링크 없이
            appendMessage("죄송합니다. 메시지를 보내는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", 'assistant', false);
            // 사용자에게 오류 메시지 표시
            showMessageBox("메시지 전송 중 오류가 발생했습니다. 콘솔을 확인해주세요.", 'alert');
        } finally {
            loader.style.display = 'none'; // 로더 숨김
            sendButton.disabled = false; // 전송 버튼 활성화
            chatInput.disabled = false; // 입력창 활성화
            chatInput.focus(); // 입력창에 다시 포커스
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
            tossLink.textContent = '🥕 당근 주기';
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
    homeButton.addEventListener('click', goHome);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', handleKeyPress);

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
