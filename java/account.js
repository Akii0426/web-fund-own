document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeBtn');
  const sideMenu = document.getElementById('sideMenu');
  const themeToggle = document.getElementById('themeToggle');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileUsername = document.getElementById('profileUsername');
  const profileEmail = document.getElementById('profileEmail');
  const signOutButton = document.getElementById('signOutButton');

  function applyTheme(isLightMode) {
    document.body.classList.toggle('light-mode', isLightMode);
    if (themeToggle) {
      themeToggle.checked = isLightMode;
    }
    localStorage.setItem('themePreference', isLightMode ? 'light' : 'dark');
  }

  const savedTheme = localStorage.getItem('themePreference');
  const prefersLightMode = savedTheme ? savedTheme === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLightMode);

  if (menuBtn) menuBtn.addEventListener('click', () => sideMenu?.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => sideMenu?.classList.remove('open'));
  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      applyTheme(themeToggle.checked);
    });
  }

  const savedUsername = localStorage.getItem('gamerUsername') || '';
  const savedEmail = localStorage.getItem('gamerEmail') || '';
  const savedAvatar = localStorage.getItem('gamerAvatar') || '';

  if (!savedUsername || !savedEmail) {
    window.location.href = 'signin.html';
    return;
  }

  profileUsername.textContent = savedUsername;
  profileEmail.textContent = savedEmail;
  profileAvatar.src = savedAvatar || '../images/placeholder.jpg';
  profileAvatar.alt = `${savedUsername}'s avatar`;

  signOutButton?.addEventListener('click', () => {
    localStorage.removeItem('gamerUsername');
    localStorage.removeItem('gamerEmail');
    localStorage.removeItem('gamerAvatar');
    window.location.href = 'access.html';
  });
});
