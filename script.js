document.addEventListener('DOMContentLoaded', function() {
    // 햄버거 메뉴 토글 (모바일)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // 햄버거 메뉴와 내비게이션 메뉴 요소가 모두 존재할 때만 이벤트 리스너 추가
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // 연락처 폼 제출 이벤트
    const form = document.getElementById('contact-form');

    // 연락처 폼 요소가 존재할 때만 이벤트 리스너 추가
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // 폼 기본 제출 동작 방지

            const name = form.querySelector('#name')?.value.trim();
            const email = form.querySelector('#email')?.value.trim();
            const msg = form.querySelector('#message')?.value.trim();

            // 모든 필드가 채워졌는지 확인
            if (!name || !email || !msg) {
                alert('모든 필드를 채워주세요.');
                return; // 함수 실행 중단
            }

            // 메시지 성공 알림
            alert(`${name}님, 메시지를 성공적으로 보냈습니다!`);

            // 폼 필드 초기화
            form.reset();
        });
    }

    // 스무스 스크롤 기능
    // 페이지 내 앵커 링크 클릭 시 부드럽게 스크롤되도록 처리
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // 기본 앵커 링크 동작 방지

            const targetId = this.getAttribute('href'); // 클릭된 링크의 href 값 (예: #about)
            const targetElement = document.querySelector(targetId); // 해당 ID를 가진 요소 찾기

            // 대상 요소가 존재할 때만 스크롤
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // 부드러운 스크롤 효과
                });
            }
        });
    });

    // simpleLightbox 갤러리 기능 초기화
    // '.gallery-item' 클래스를 가진 모든 <a> 태그에 라이트박스 적용
    // 이 코드는 simpleLightbox.js 파일이 먼저 로드된 후에 실행되어야 합니다.
    // 갤러리가 없는 페이지에서 오류가 나지 않도록, 갤러리 요소가 있을 때만 초기화합니다.
    const galleryItems = document.querySelector('.gallery-grid .gallery-item');
    if (galleryItems) {
        var lightbox = new SimpleLightbox('.gallery-item', {
            // 여기에 simpleLightbox 옵션을 추가할 수 있습니다.
            // 예시:
            // navText: ['←','→'], // 탐색 화살표 변경
            // captionDelay: 0, // 캡션 표시 지연 시간 (밀리초)
            // captionsData: 'title', // 캡션을 <a> 태그의 'title' 속성에서 가져옴
            // animationSpeed: 200, // 애니메이션 속도 조절 (밀리초)
            // closeBtn: true, // 닫기 버튼 표시 여부
            // history: false, // 브라우저 히스토리 변경 방지
            // scrollZoom: false // 스크롤 시 이미지 확대/축소 비활성화
        });
    }
});