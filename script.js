function handleAuth() {
  const userProfile = document.getElementById('user-profile');
  const loginSection = document.getElementById('login-section');
  const userAvatar = document.getElementById('user-avatar');
  const loginButton = document.getElementById('login-button');

  // Get user info from Repl Auth headers
  const userName = document.querySelector('meta[name="user-name"]')?.content;
  const userRole = document.querySelector('meta[name="user-roles"]')?.content;
  const userEmail = document.querySelector('input[type="email"]')?.value;

  if (userName) {
    userProfile.classList.remove('hidden');
    loginSection.classList.add('hidden');
    loginButton.style.display = 'none';

    // Get Gmail profile picture using email hash
    const emailHash = userEmail ? md5(userEmail.trim().toLowerCase()) : '';
    userAvatar.src = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;

    // Show admin features if user has admin role
    if (userRole === 'admin') {
      showAdminFeatures();
    }
  } else {
    userProfile.classList.add('hidden');
    loginSection.classList.remove('hidden');
  }
}

function showAdminFeatures() {
  const adminLinks = document.querySelectorAll('.admin-only');
  adminLinks.forEach(link => link.classList.remove('hidden'));
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'Admin123') {
    window.location.href = 'admin.html';
  } else {
    alert('Invalid username or password. Please try again.');
  }
  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  // Login button handler
  const loginButton = document.getElementById('login-button');
  const userProfile = document.getElementById('user-profile');
  const loginOverlay = document.getElementById('login-overlay');
  const signupOverlay = document.getElementById('signup-overlay');
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');

  // Check login status on page load
  fetch('/__replauthuser')
    .then(response => response.json())
    .then(userData => {
      if (userData && userData.name) {
        loginButton.style.display = 'none';
        userProfile.style.display = 'block';
        document.getElementById('user-avatar').src = `https://www.gravatar.com/avatar/${Math.floor(Math.random() * 1000)}?d=identicon`;

        // Check if user is admin
        if (userData.roles && userData.roles.includes('admin')) {
          window.location.href = 'admin.html';
        }
      }
    })
    .catch(err => console.error('Error checking auth status:', err));

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      loginOverlay.style.display = 'flex';
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginOverlay.style.display = 'none';
      signupOverlay.style.display = 'flex';
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      signupOverlay.style.display = 'none';
      loginOverlay.style.display = 'flex';
    });
  }

  // Close overlays when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === loginOverlay) {
      loginOverlay.style.display = 'none';
    }
    if (e.target === signupOverlay) {
      signupOverlay.style.display = 'none';
    }
  });
  // Admission section toggle
  const admission = document.getElementById('admission');
  const minimizedAdmission = document.getElementById('minimizedAdmission');
  const closeButton = document.getElementById('closeAdmission');

  if (closeButton && admission && minimizedAdmission) {
    closeButton.addEventListener('click', () => {
      admission.classList.add('hidden');
      minimizedAdmission.classList.remove('hidden');
    });

    minimizedAdmission.addEventListener('click', () => {
      admission.classList.remove('hidden');
      minimizedAdmission.classList.add('hidden');
    });
  }
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        nav.classList.remove('active');
      }
    });
  }

  // Update active nav link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  function setActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.removeAttribute('id');
      if (link.getAttribute('href').slice(1) === current) {
        link.setAttribute('id', 'active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);

  // Show/Hide "Go to Top" button on scroll
  const goTopBtn = document.getElementById("goTopBtn");
  if (goTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 0) {
        goTopBtn.style.display = "block";
      } else {
        goTopBtn.style.display = "none";
      }
    });

    // Smooth scroll to top on button click
    goTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll to top and refresh on logo click
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "instant" });
      location.reload();
    });
  }

  // For comment to email
  if (typeof emailjs !== 'undefined') {
    emailjs.init("0r0v6pileX0-Xawo4");
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        emailjs.sendForm("service_yskoku7", "template_xcdxohy", this)
          .then(function () {
            alert("Message sent! We'll contact you soon.");
            form.reset();
          }, function (error) {
            alert("Failed to send message: " + JSON.stringify(error));
          });
      });
    }
  }
});
