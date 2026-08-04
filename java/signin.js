document.addEventListener('DOMContentLoaded', () => {
  const authWrapper = document.getElementById('authWrapper');
  const authForm = document.getElementById('authForm');
  const progressBar = document.getElementById('progressBar');
  const dots = document.querySelectorAll('.step-dot');

  if (!authWrapper || !authForm || !progressBar) {
    return;
  }

  // Input references
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const passwordError = document.getElementById('passwordError');
  const usernameInput = document.getElementById('username');
  let usernameError = document.getElementById('usernameError');
  const backButton = document.getElementById('backButton');
  const profilePictureInput = document.getElementById('profilePicture');
  const imagePreview = document.getElementById('imagePreview');
  let currentStep = 1;

  if (!usernameError && usernameInput) {
    usernameError = document.createElement('span');
    usernameError.id = 'usernameError';
    usernameError.className = 'error-message';
    usernameError.textContent = 'Username is required';
    usernameInput.insertAdjacentElement('afterend', usernameError);
  }

  // Real-time error clearing when user edits their inputs
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      passwordError?.classList.remove('visible');
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      passwordError?.classList.remove('visible');
    });
  }

  if (profilePictureInput && imagePreview) {
    profilePictureInput.addEventListener('change', () => {
      const file = profilePictureInput.files?.[0];
      imagePreview.innerHTML = '';

      if (!file) {
        imagePreview.textContent = 'No image selected';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result;
        img.alt = 'Profile preview';
        imagePreview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }

  function showStep(step) {
    currentStep = step;

    if (step === 1) {
      authWrapper.className = 'auth-container';
      updateProgress(1);
      setTimeout(() => emailInput?.focus(), 200);
    } else if (step === 2) {
      authWrapper.className = 'auth-container show-step-2';
      updateProgress(2);
      setTimeout(() => passwordInput?.focus(), 200);
    } else if (step === 3) {
      authWrapper.className = 'auth-container show-step-3';
      updateProgress(3);
      setTimeout(() => document.getElementById('username')?.focus(), 200);
    }
  }

  // Handle wizard step navigation loops
  document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const targetStep = e.currentTarget.getAttribute('data-next');

      // Validate Step 1 (Email)
      if (targetStep === '2') {
        if (!emailInput?.checkValidity()) return emailInput.reportValidity();
        showStep(2);
      }
      // Validate Step 2 (Password Match Check)
      else if (targetStep === '3') {
        // 1. Structural/HTML length checks
        if (!passwordInput?.checkValidity()) return passwordInput.reportValidity();
        if (!confirmPasswordInput?.checkValidity()) return confirmPasswordInput.reportValidity();

        // 2. Exact match logical verification
        if (passwordInput.value !== confirmPasswordInput.value) {
          passwordError?.classList.add('visible');
          confirmPasswordInput.focus();
          return;
        }

        showStep(3);
      }
    });
  });

  // Calculate progress percentage values
  function updateProgress(step) {
    const percentage = ((step - 1) / (3 - 1)) * 100;
    progressBar.style.width = `${percentage}%`;

    dots.forEach((dot, index) => {
      if (index < step) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Final step submission event listener
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput?.value || '';
    const email = emailInput?.value || '';
    const avatarImg = imagePreview?.querySelector('img');

    if (username.trim() !== '') {
      usernameError?.classList.remove('visible');

      localStorage.setItem('gamerUsername', username);
      localStorage.setItem('gamerEmail', email);
      localStorage.setItem('gamerPassword', passwordInput?.value || '');
      localStorage.setItem('gamerAvatar', avatarImg?.src || '');

      window.location.href = '../index.html';
    } else {
      usernameError?.classList.add('visible');
      usernameInput?.focus();
    }
  });

  backButton?.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep === 2) {
      showStep(1);
    } else if (currentStep === 3) {
      showStep(2);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '../index.html';
    }
  });

  showStep(1);
});