// 🌐 햄버거 메뉴 토글 (모바일) - 기존 코드 유지
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// 🌟🌟🌟 중요: 여기에 API Gateway 엔드포인트를 넣어주세요! 🌟🌟🌟
// 형식: https://[API_ID].execute-api.[리전].amazonaws.com/[스테이지이름]/[리소스경로]
const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail";

// ✉️ 연락처 폼 제출 이벤트
const form = document.getElementById('contact-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
        alert('모든 필드를 채워주세요.');
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';
    }

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${name}님, 메시지가 성공적으로 전송되었습니다!`);
            form.reset();
        } else {
            alert(`메시지 전송 실패: ${data.message || '알 수 없는 서버 오류'}`);
            console.error('API 응답 오류:', data);
        }
    } catch (error) {
        alert('메시지 전송 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        console.error('API 호출 중 치명적인 오류 발생:', error);
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = '메시지 보내기';
        }
    }
});

// 🌙 다크모드 슬라이드 스위치 방식 (우측 하단 고정)
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dark-mode-toggle');

    if (toggle) {
        // 초기 설정
        if (localStorage.getItem('theme') === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            toggle.checked = true;
        }

        // 사용자 토글 이벤트
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
