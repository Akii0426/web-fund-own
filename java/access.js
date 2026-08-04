// --- 2. Theme Toggle Logic (Dark/Light Mode) --- //
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    function applyTheme(isLightMode) {
        document.body.classList.toggle("light-mode", isLightMode);
        if (themeToggle) {
            themeToggle.checked = isLightMode;
        }
        localStorage.setItem("themePreference", isLightMode ? "light" : "dark");
    }

    const savedTheme = localStorage.getItem("themePreference");
    const prefersLightMode = savedTheme ? savedTheme === "light" : window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLightMode);

    if (themeToggle) {
        themeToggle.addEventListener("change", function () {
            applyTheme(themeToggle.checked);
        });
    }

    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailValue = loginEmail?.value.trim() || '';
            const passwordValue = loginPassword?.value || '';
            const savedEmail = (localStorage.getItem('gamerEmail') || '').trim();
            const savedPassword = localStorage.getItem('gamerPassword') || '';

            if (!emailValue || !passwordValue) {
                if (loginError) {
                    loginError.textContent = 'Please enter both email and password.';
                    loginError.style.display = 'block';
                }
                return;
            }

            if (!savedEmail || emailValue.toLowerCase() !== savedEmail.toLowerCase()) {
                if (loginError) {
                    loginError.textContent = 'Email not registered. Please sign up first.';
                    loginError.style.display = 'block';
                }
                return;
            }

            if (passwordValue !== savedPassword) {
                if (loginError) {
                    loginError.textContent = 'Password incorrect. Please try again.';
                    loginError.style.display = 'block';
                }
                return;
            }

            window.location.href = 'account.html';
        });
    }
});