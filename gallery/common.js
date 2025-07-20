document.addEventListener('DOMContentLoaded', () => {
    // 🌐 햄버거 메뉴 열고 닫기 + 접근성 개선 기능
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');

            hamburger.setAttribute('aria-expanded', isActive);
            navMenu.setAttribute('aria-hidden', !isActive);
        });

        // 🍔 모바일 메뉴에서 링크 클릭 시 메뉴 닫기
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                }
            });
        });
    }

    // 🌙 다크 모드 켜고 끄기 기능 (체크박스 방식)
    // HTML에 있는 <input type="checkbox" id="dark-mode-toggle"> 요소를 참조합니다.
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (darkModeToggle) { // 다크 모드 토글 체크박스가 웹페이지에 있다면 작동
        // 웹페이지 로드 시, 이전에 저장된 테마를 기억해서 적용
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            // 저장된 테마가 'dark'이면 체크박스를 체크 상태로 설정
            darkModeToggle.checked = (savedTheme === 'dark');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // 저장된 테마가 없는데 사용자 시스템 설정이 다크 모드라면, 웹페이지도 다크 모드로 시작
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // 다크 모드라고 저장
            darkModeToggle.checked = true; // 체크박스도 체크 상태로 설정
        }

        // 사용자가 체크박스를 변경했을 때 (테마 변경)
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                // 체크박스가 체크되면 다크 모드 적용
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                // 체크박스가 해제되면 라이트 모드 적용 (data-theme 속성 제거)
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});