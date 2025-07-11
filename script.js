// 햄버거 메뉴 토글 (모바일) - 기존 코드 유지
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// 🌟🌟🌟 중요: 여기에 API Gateway 엔드포인트를 넣어주세요! 🌟🌟🌟
// 형식: https://[API_ID].execute-api.[리전].amazonaws.com/[스테이지이름]/[리소스경로]
const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail"; // 이 부분을 여러분의 실제 URL로 교체하세요!

// 연락처 폼 제출 이벤트 - 수정된 API 호출 로직 포함
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 폼 기본 제출 동작 방지

    // 폼 필드 값 가져오기 및 공백 제거
    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    // 필수 필드 유효성 검사
    if (!name || !email || !message) {
        alert('모든 필드를 채워주세요.');
        return;
    }

    // 제출 버튼 UI 업데이트 (중복 제출 방지)
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true; // 버튼 비활성화
        submitButton.textContent = '전송 중...'; // 텍스트 변경
    }

    try {
        // API Gateway 엔드포인트로 POST 요청 전송
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // JSON 형식으로 데이터 전송 명시
            },
            body: JSON.stringify({ name, email, message }) // 폼 데이터를 JSON 문자열로 변환하여 전송
        });

        const data = await response.json(); // API 응답을 JSON으로 파싱

        // 응답 상태 코드 확인 (200번대면 성공)
        if (response.ok) {
            alert(`${name}님, 메시지가 성공적으로 전송되었습니다!`);
            form.reset(); // 폼 필드 초기화
        } else {
            // 서버에서 반환된 에러 메시지가 있다면 출력, 아니면 일반 오류 메시지
            alert(`메시지 전송 실패: ${data.message || '알 수 없는 서버 오류'}`);
            console.error('API 응답 오류:', data); // 개발자 콘솔에 상세 오류 기록
        }
    } catch (error) {
        // 네트워크 오류 등 fetch 요청 자체에서 발생한 오류 처리
        alert('메시지 전송 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.error('API 호출 중 치명적인 오류 발생:', error);
    } finally {
        // 제출 버튼 상태 원복 (성공/실패 여부와 관계없이)
        if (submitButton) {
            submitButton.disabled = false; // 버튼 활성화
            submitButton.textContent = '메시지 보내기'; // 원래 텍스트로 복원
        }
    }
});

// Darkmode 토글 기능 - 기존 코드 유지
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('dark-mode-btn');

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');

            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
            } else {
                document.body.setAttribute('data-theme', 'dark');
            }
        });
    }
});