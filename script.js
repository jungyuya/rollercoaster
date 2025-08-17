document.addEventListener('DOMContentLoaded', function () {
    const strings = [
        "안녕하세요, 이준규입니다.😊",
        "클라우드 환경에서 IaC와 CI/CD를 활용하여,",
        "인프라를 자동화하고 효율적으로 운영하는 데 관심이 많습니다.",
        "국내·해외 IT 뉴스요약 'IT츄르' 제작",
        "심리상담 챗봇 '챗라스틱' 제작",
        "IaC(CDK) 기반 기술 블로그 제작 및 운영",
        "EKS 기반 '펫커넥트' 제작",
        "IaC 및 CI/CD를 통한 인프라 자동화 구성 및 관리",
        "프로젝트의 자세한 내용은 아래에서 확인해보세요!!😎",
        '깃허브 → <a href="https://github.com/jungyuya" target="_blank" rel="noopener noreferrer">https://github.com/jungyuya</a>'
    ];

    const options = {
        strings: strings,
        contentType: 'html',   // 중요: HTML 렌더링 허용 (링크 삽입용)
        typeSpeed: 80,
        backSpeed: 25,
        backDelay: 2000,
        startDelay: 200,
        loop: true,
        showCursor: true,
        cursorChar: '|',
        smartBackspace: true,
        fadeOut: false,

        preStringTyped: function(arrayPos) {
            // 첫 1~2 문장: 천천히 보여주기
            if (arrayPos <= 1) {
                this.typeSpeed = 100 + Math.floor(Math.random() * 40); // 느리게
                this.backSpeed = 30 + Math.floor(Math.random() * 15);
                this.backDelay = 2500 + Math.floor(Math.random() * 1000);
            } else if (arrayPos === strings.length - 1) {
                // 마지막(깃허브) 문자열: 타이핑은 평소보다 조금 빠르게, 삭제 전 대기 3초
                this.typeSpeed = 40 + Math.floor(Math.random() * 12);
                this.backSpeed = 6 + Math.floor(Math.random() * 6);
                this.backDelay = 3000; // 여기서 3초 대기
            } else {
                // 프로젝트 라인: 빠르게 리듬감 있게
                this.typeSpeed = 28 + Math.floor(Math.random() * 12);
                this.backSpeed = 1 + Math.floor(Math.random() * 8);
                this.backDelay = 650 + Math.floor(Math.random() * 450);
            }
        }
    };

    const typed = new Typed('#typing-effect', options);
});



const API_ENDPOINT = "https://0oliq70yca.execute-api.ap-northeast-2.amazonaws.com/prod/ContactEmail";

// ⚠️ 사용할 배경 이미지 경로들을 배열에 추가 (실제 로컬경로)
const HERO_BACKGROUND_IMAGES = [
    'images/background.jpg',
    'images/background1.jpg',
    'images/background2.png',
    'images/background3.webp',
    'images/background4.jpg',
    'images/background5.jpg',
    'images/background4.webp',
    'images/background7.jpg'
];

document.addEventListener('DOMContentLoaded', () => {
    /* ====================================
     * ✉️ 연락처 폼 제출 기능
     * ==================================== */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name')?.value.trim();
            const email = contactForm.querySelector('#email')?.value.trim();
            const message = contactForm.querySelector('#message')?.value.trim();

            if (!name || !email || !message) {
                alert('모든 필드를 채워주세요!');
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

    /* ====================================
     * 🎓 자격증 이미지 모달 기능
     * ==================================== */
    const certItems = document.querySelectorAll('.cert-item');
    const imageCertModal = document.getElementById('imageCertModal');
    const certModalImage = document.getElementById('certModalImage');
    const certModalCloseBtn = imageCertModal?.querySelector('.close-btn');

    const certImages = {
        'linux-master': 'images/linux.jpg',
        'network-admin': 'images/network.jpg',
        'aws-saa': 'images/SAA.jpg'
    };

    // 모달 닫기 로직을 함수로 캡슐화
    function closeCertModal() {
        imageCertModal.classList.remove('show');
        // 모달이 완전히 사라지는 애니메이션 시간(0.3s) 후에 스크롤바 되돌리기
        // 이 타이밍은 .modal-overlay의 transition 시간과 일치해야 합니다.
        setTimeout(() => {
            document.body.style.overflow = '';
            certModalImage.src = '';
        }, 300);
    }

    if (certItems.length > 0 && imageCertModal) {
        certItems.forEach(item => {
            // 클릭 이벤트만 남김 (모바일/데스크톱 모두 작동)
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

    /* ====================================
     * 🌟 히어로 섹션 배경 이미지 랜덤 변경 기능
     * ==================================== */
    const heroSection = document.getElementById('home');

    function setRandomHeroBackground() {
        if (heroSection && HERO_BACKGROUND_IMAGES.length > 0) {
            const randomIndex = Math.floor(Math.random() * HERO_BACKGROUND_IMAGES.length);
            const selectedImage = HERO_BACKGROUND_IMAGES[randomIndex];
            heroSection.style.backgroundImage = `url("${selectedImage}")`;
        }
    }

    // 페이지 로드 시 배경 이미지 설정
    setRandomHeroBackground();

    //배경 변환 시간 설정
    setInterval(setRandomHeroBackground, 4000);
});