// ✅ 페이지 로드 시 다크모드 유지
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  // 다크모드 버튼이 있는 페이지에서만 작동
  const themeToggleButton = document.getElementById('dark-mode-btn');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }
});
