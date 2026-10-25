/**
 * Zeynep Berra Ürün — Celestial Portfolio Interactive Scripts
 * Features:
 * 1. Lightweight 60fps HTML5 Canvas Starfield with Twinkling & Subtle Parallax
 * 2. Glassmorphic Card Radial Hover Spotlight Tracking
 * 3. One-Click Email Copy to Clipboard with Accessible Status Feedback
 * 4. Client-Side Contact Form Validation & Submission Handler
 * 5. Mobile Navigation Toggle & Scroll-Spy Active Link Highlighting
 */

(function () {
  'use strict';

  /* ========================================================================
     1. LIGHTWEIGHT CELESTIAL STARFIELD CANVAS (60FPS)
     ======================================================================== */
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    let animationFrameId = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Subtle mouse parallax coordinates
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    function createStars() {
      // Scale star count cleanly by viewport area without overloading mobile GPUs
      const area = width * height;
      const count = Math.min(Math.max(Math.floor(area / 7500), 75), 210);
      stars = [];

      for (let i = 0; i < count; i++) {
        const isCrimsonEmber = Math.random() < 0.06; // 6% subtle deep crimson distant stars
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.35 + 0.35,
          baseAlpha: Math.random() * 0.55 + 0.2,
          twinkleSpeed: Math.random() * 0.018 + 0.004,
          twinklePhase: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.85 + 0.15,
          driftY: (Math.random() * 0.08 + 0.02) * (prefersReducedMotion ? 0 : 1),
          color: isCrimsonEmber ? '220, 60, 60' : '226, 232, 240'
        });
      }
    }

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
    }

    function renderStars() {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation for subtle parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        star.y -= star.driftY;

        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }

        const parallaxX = (star.x + currentMouseX * star.depth * 14 + width) % width;
        const parallaxY = (star.y + currentMouseY * star.depth * 14 + height) % height;

        const alphaVariation = prefersReducedMotion
          ? 0
          : Math.sin(star.twinklePhase) * 0.24;
        const alpha = Math.max(0.08, Math.min(0.95, star.baseAlpha + alphaVariation));

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      if (!prefersReducedMotion && !document.hidden) {
        animationFrameId = requestAnimationFrame(renderStars);
      }
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });

    window.addEventListener(
      'mousemove',
      function (e) {
        targetMouseX = (e.clientX / width - 0.5) * 2;
        targetMouseY = (e.clientY / height - 0.5) * 2;
      },
      { passive: true }
    );

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      } else if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderStars);
      }
    });

    resizeCanvas();
    renderStars();
  }

  /* ========================================================================
     2. GLASSMORPHIC CARD RADIAL CURSOR SPOTLIGHT
     ======================================================================== */
  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(function (card) {
    card.addEventListener(
      'mousemove',
      function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      },
      { passive: true }
    );
  });

  /* ========================================================================
     3. ONE-CLICK EMAIL COPY BUTTON
     ======================================================================== */
  const copyBtn = document.getElementById('copy-email-btn');
  const copyLabel = document.getElementById('copy-btn-label');
  const copyIcon = document.getElementById('copy-icon');
  const checkIcon = document.getElementById('check-icon');
  const copyFeedback = document.getElementById('copy-feedback');
  const emailAddress = 'zeynepberraurun@gmail.com';
  let copyTimeoutId = null;

  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('textarea');
          tempInput.value = emailAddress;
          tempInput.style.position = 'fixed';
          tempInput.style.opacity = '0';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        if (copyLabel) copyLabel.textContent = 'Copied!';
        if (copyIcon) copyIcon.classList.add('hidden');
        if (checkIcon) checkIcon.classList.remove('hidden');
        if (copyFeedback) {
          copyFeedback.textContent = '✓ Copied zeynepberraurun@gmail.com to clipboard.';
        }

        if (copyTimeoutId) clearTimeout(copyTimeoutId);
        copyTimeoutId = setTimeout(function () {
          if (copyLabel) copyLabel.textContent = 'Copy Email';
          if (copyIcon) copyIcon.classList.remove('hidden');
          if (checkIcon) checkIcon.classList.add('hidden');
          if (copyFeedback) copyFeedback.textContent = '';
        }, 3200);
      } catch (err) {
        if (copyFeedback) {
          copyFeedback.textContent = 'Please copy manually: zeynepberraurun@gmail.com';
        }
      }
    });
  }

  /* ========================================================================
     4. CONTACT FORM VALIDATION & INTERACTIVE HANDLER
     ======================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const messageInput = document.getElementById('sender-message');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formStatus = document.getElementById('form-status');

  function setFieldError(inputEl, errorEl, message) {
    if (!inputEl || !errorEl) return;
    if (message) {
      inputEl.classList.add('input-invalid');
      inputEl.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      inputEl.classList.remove('input-invalid');
      inputEl.setAttribute('aria-invalid', 'false');
      errorEl.textContent = '';
    }
  }

  function validateEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    // Live clear errors on input
    [
      [nameInput, nameError],
      [emailInput, emailError],
      [messageInput, messageError]
    ].forEach(function ([input, error]) {
      if (input) {
        input.addEventListener('input', function () {
          setFieldError(input, error, '');
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }
        });
      }
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (nameVal.length < 2) {
        setFieldError(nameInput, nameError, 'Please enter your name (at least 2 characters).');
        isValid = false;
      } else {
        setFieldError(nameInput, nameError, '');
      }

      if (!emailVal || !validateEmailFormat(emailVal)) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
      } else {
        setFieldError(emailInput, emailError, '');
      }

      if (messageVal.length < 10) {
        setFieldError(
          messageInput,
          messageError,
          'Please enter a message of at least 10 characters.'
        );
        isValid = false;
      } else {
        setFieldError(messageInput, messageError, '');
      }

      if (!isValid) return;

      // Construct mailto link for instant direct transmission & show confirmation
      const subject = encodeURIComponent(`Portfolio Inquiry from ${nameVal}`);
      const body = encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`
      );
      const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.className = 'form-status status-success';
        formStatus.innerHTML = `✓ Message validated &amp; ready! Opening your mail client to reach <strong>${emailAddress}</strong>...`;
      }

      window.location.href = mailtoUrl;
      contactForm.reset();
    });
  }

  /* ========================================================================
     5. MOBILE MENU TOGGLE & SCROLL-SPY NAVIGATION
     ======================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active section in navbar on scroll
  const sections = document.querySelectorAll('main section[id]');
  function updateActiveNavLink() {
    const scrollY = window.scrollY + 140;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // Dynamic Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();
