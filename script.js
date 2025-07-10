// 햄버거 메뉴 토글 (모바일)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// 연락처 폼 제출 이벤트
const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.querySelector('#name')?.value.trim();
  const email = form.querySelector('#email')?.value.trim();
  const msg = form.querySelector('#message')?.value.trim();
  if (!name || !email || !msg) {
    alert('모든 필드를 채워주세요.');
    return;
  }
  alert(`${name}님, 메시지를 성공적으로 보냈습니다!`);
  form.reset();
});

//Darkmode
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.getElementById('dark-mode-btn');

  if (themeToggleButton) {
    // 초기 설정: 항상 라이트 모드로 시작 (HTML에 data-theme 속성이 없으므로 기본 라이트 모드)
    // localStorage에서 마지막 테마 설정을 가져오지만, 여기서는 초기 라이트 모드를 강제합니다.
    // 따라서 이 부분에서는 저장된 테마를 불러오지 않습니다.

    themeToggleButton.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');

      if (currentTheme === 'dark') {
        // 현재 다크 모드라면 라이트 모드로 전환
        document.body.removeAttribute('data-theme');
        // localStorage.setItem('theme', 'light'); // 필요하다면 마지막 선택 기억
      } else {
        // 현재 라이트 모드라면 다크 모드로 전환
        document.body.setAttribute('data-theme', 'dark');
        // localStorage.setItem('theme', 'dark'); // 필요하다면 마지막 선택 기억
      }
    });
  }
});