// script.js (또는 contact.js) 파일의 내용 시작

// 🌟🌟🌟 중요: 여기에 API Gateway 엔드포인트를 넣어주세요! 🌟🌟🌟
const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail";

// ✉️ 연락처 폼 제출 이벤트 (이 기능은 문의 페이지에서만 필요해요)
document.addEventListener('DOMContentLoaded', () => { // 웹페이지 내용이 다 로드되면 시작
    const form = document.getElementById('contact-form'); // 문의 폼 찾기

    if (form) { // 문의 폼이 웹페이지에 있다면 작동
        form.addEventListener('submit', async (e) => { // 폼 제출 버튼 클릭 시
            e.preventDefault(); // 기본 제출 동작(페이지 새로고침) 막기

            const name = form.querySelector('#name')?.value.trim();     // 이름 입력 값 가져오기
            const email = form.querySelector('#email')?.value.trim();   // 이메일 입력 값 가져오기
            const message = form.querySelector('#message')?.value.trim(); // 메시지 입력 값 가져오기

            if (!name || !email || !message) { // 이름, 이메일, 메시지 중 하나라도 비어있다면
                alert('모든 필드를 채워주세요.'); // 경고 메시지 보여주고
                return; // 함수 종료
            }

            const submitButton = form.querySelector('button[type="submit"]'); // 제출 버튼 찾기
            if (submitButton) { // 버튼이 있다면
                submitButton.disabled = true; // 버튼을 비활성화 (여러 번 누르는 것 방지)
                submitButton.textContent = '전송 중...'; // 버튼 텍스트 변경
            }

            try {
                // API Gateway로 데이터 보내기
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST', // POST 방식으로 보냄
                    headers: { 'Content-Type': 'application/json' }, // 데이터가 JSON 형식임을 알림
                    body: JSON.stringify({ name, email, message }) // 이름, 이메일, 메시지를 JSON 형태로 변환하여 보냄
                });

                const data = await response.json(); // 서버에서 받은 응답을 JSON 형태로 변환

                if (response.ok) { // 응답이 성공적(200번대)이라면
                    alert(`${name}님, 메시지가 성공적으로 전송되었습니다!`); // 성공 메시지 보여주기
                    form.reset(); // 폼 필드 모두 지우기
                } else { // 응답이 실패(200번대 아님)라면
                    alert(`메시지 전송 실패: ${data.message || '알 수 없는 서버 오류'}`); // 실패 메시지 보여주기
                    console.error('API 응답 오류:', data); // 개발자 도구에 상세 오류 기록
                }
            } catch (error) { // 네트워크 문제 등으로 API 호출 자체가 실패하면
                alert('메시지 전송 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                console.error('API 호출 중 치명적인 오류 발생:', error);
            } finally { // 성공하든 실패하든 마지막에 실행
                if (submitButton) {
                    submitButton.disabled = false; // 버튼 다시 활성화
                    submitButton.textContent = '보내기'; // 버튼 텍스트 원래대로
                }
            }
        });
    }
});

