const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail";

document.addEventListener('DOMContentLoaded', () => {
    // ✉️ 연락처 폼 제출 이벤트 (기존 코드 - 변경 없음)
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name')?.value.trim();
            const email = contactForm.querySelector('#email')?.value.trim();
            const message = contactForm.querySelector('#message')?.value.trim();

            if (!name || !email || !message) {
                alert('모든 필드를 채워주세요.');
                return;
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
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
                    contactForm.reset();
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
                    submitButton.textContent = '보내기';
                }
            }
        });
    }

    // 🎓 자격증 이미지 모달 기능 수정 ✨ (클릭 방식으로 변경)
    const certItems = document.querySelectorAll('.cert-item');
    const imageCertModal = document.getElementById('imageCertModal');
    const certModalImage = document.getElementById('certModalImage');
    const certModalCloseBtn = imageCertModal?.querySelector('.close-btn');

    const certImages = {
        'linux-master': 'images/linux.jpg', // ⚠️ 실제 이미지 경로로 변경하세요!
        'network-admin': 'images/network.jpg', // ⚠️ 실제 이미지 경로로 변경하세요!
        'aws-saa': 'images/SAA.jpg' // ⚠️ 실제 이미지 경로로 변경하세요!
    };

    // 모달 닫기 로직을 함수로 캡슐화
    function closeCertModal() {
        imageCertModal.classList.remove('show');
        // 모달이 완전히 사라지는 애니메이션 시간(0.3s) 후에 스크롤바 되돌리기
        setTimeout(() => {
            document.body.style.overflow = '';
            certModalImage.src = '';
        }, 300); // .modal-overlay의 transition 시간(0.3s)과 일치시켜야 부드럽습니다.
    }

    if (certItems.length > 0 && imageCertModal) {
        certItems.forEach(item => {
            // ✨ 마우스 오버(hover) 관련 이벤트 제거
            // item.addEventListener('mouseenter', ...);
            // item.addEventListener('mouseleave', ...);

            // ✨ 클릭 이벤트만 남김 (모바일/데스크톱 모두 작동)
            item.addEventListener('click', () => {
                const certId = item.dataset.certId;
                const imageUrl = certImages[certId];

                if (imageUrl) {
                    certModalImage.src = imageUrl;
                    imageCertModal.classList.add('show');
                    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
                }
            });
        });

        // 모달 닫기 버튼 클릭 이벤트
        if (certModalCloseBtn) {
            certModalCloseBtn.addEventListener('click', closeCertModal);
        }

        // 모달 외부 클릭 시 닫기
        imageCertModal.addEventListener('click', (e) => {
            if (e.target === imageCertModal) {
                closeCertModal();
            }
        });

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageCertModal.classList.contains('show')) {
                closeCertModal();
            }
        });
    }
});