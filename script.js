/**
 * Portfolio Application Engine
 * Architecture: Modular IIFE Component Engine
 * Author: Adarsha Naskar
 */
(() => {
  'use strict';

  // ----------------------------------------------------
  // CONSTANTS & IMMUTABLE DATA CONFIGURATION
  // ----------------------------------------------------
  const SECTIONS = Object.freeze(['home', 'work', 'about', 'contact']);

  const SECTION_LABELS = Object.freeze({
    home: 'HOME',
    work: 'WORK',
    about: 'ABOUT',
    contact: 'CONTACT'
  });

  const SECTION_THUMBNAILS = Object.freeze({
    home: '../public/panorama.png',
    work: '../public/Turn_plate_dark_brown_2K_202607222014.jpeg',
    about: '../public/Adn.jpeg',
    contact: '../public/panorama.png'
  });

  const BACKGROUND_TEXTS = Object.freeze({
    home: 'PORTFOLIO',
    work: 'WORK',
    about: 'ABOUT',
    contact: 'CONNECT'
  });

  const PORTFOLIO_ITEMS = Object.freeze([
    {
      id: 1,
      title: 'New York Pizza Factory',
      category: 'HTML • CSS • JAVASCRIPT',
      image: '../public/Turn_plate_dark_brown_2K_202607222014.jpeg',
      description: 'A responsive restaurant website built using HTML, CSS, and JavaScript featuring an interactive menu, modern UI, smooth animations, and a mobile-friendly experience.',
      githubLink: 'https://github.com/AdarshaNaskar/nypf',
      liveLink: 'https://nypf.netlify.app/'
    },
    {
      id: 2,
      title: 'Parking Management System',
      category: 'PYTHON • MYSQL',
      image: '../public/parking_management_system.jpeg',
      description: 'A parking management application developed with Python and MySQL for managing vehicle entry, exit, parking records, and database operations.',
      githubLink: 'https://github.com/AdarshaNaskar/pythonconnectivitys'
    },
    {
      id: 3,
      title: 'Memory Card Game',
      category: 'HTML • CSS • JAVASCRIPT',
      image: '../public/animated_brain.jpeg',
      description: 'A browser-based memory matching game with card flip animations, timer, score tracking, and responsive gameplay.',
      githubLink: 'https://github.com/AdarshaNaskar/Memory-Card-Game',
      liveLink: 'https://adarshanaskar.github.io/Memory-Card-Game/'
    }
  ]);

  const EMAILJS_CONFIG = Object.freeze({
    SERVICE_ID: "service_unmp0wf",
    TEMPLATE_ID: "template_bmpjaes",
    PUBLIC_KEY: "VzaRDw4SUXZabeG-W"
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ----------------------------------------------------
  // DOM ELEMENT CACHE
  // ----------------------------------------------------
  const DOM = {};

  function cacheDOMElements() {
    DOM.bgText = document.getElementById('bg-text');
    DOM.headerAuthor = document.getElementById('header-author');
    DOM.workGallery = document.getElementById('work-gallery');
    DOM.navThumbnail = document.getElementById('nav-thumbnail');
    DOM.navLabel = document.getElementById('nav-label');
    DOM.navPrev = document.getElementById('nav-prev');
    DOM.navNext = document.getElementById('nav-next');
    DOM.navReset = document.getElementById('nav-reset');

    // Lightbox Elements
    DOM.lightbox = document.getElementById('lightbox');
    DOM.lightboxImg = document.getElementById('lightbox-img');
    DOM.lightboxClose = document.getElementById('lightbox-close');

    // Contact Form Elements
    DOM.contactForm = document.getElementById('contact-form');
    DOM.contactSuccess = document.getElementById('contact-success');
    DOM.contactError = document.getElementById('contact-error');
    DOM.errorMessageText = document.getElementById('error-message-text');
    DOM.errorRetryBtn = document.getElementById('error-retry-btn');
    DOM.validationError = document.getElementById('form-validation-error');
    DOM.submitBtn = document.getElementById('form-submit-btn');
    DOM.submitBtnText = document.getElementById('submit-btn-text');

    DOM.formName = document.getElementById('form-name');
    DOM.formEmail = document.getElementById('form-email');
    DOM.formSubject = document.getElementById('form-subject');
    DOM.formMessage = document.getElementById('form-message');
  }

  // ----------------------------------------------------
  // STATE ENGINE
  // ----------------------------------------------------
  let activeSectionIndex = 0;
  let isSubmitting = false;

  function updateActiveSection(sectionName) {
    const targetIndex = SECTIONS.indexOf(sectionName);
    if (targetIndex === -1) return;

    activeSectionIndex = targetIndex;
    const currentSection = SECTIONS[activeSectionIndex];

    // 1. Background Typography Animation State
    if (DOM.bgText) {
      DOM.bgText.textContent = BACKGROUND_TEXTS[currentSection];
      DOM.bgText.style.color = currentSection === 'home' ? '#000000' : 'rgba(0, 0, 0, 0.08)';
    }

    // 2. Section Visibility Transitions
    SECTIONS.forEach((sec) => {
      const sectionEl = document.getElementById(`${sec}-section`);
      if (sectionEl) {
        if (sec === currentSection) {
          sectionEl.classList.add('active');
        } else {
          sectionEl.classList.remove('active');
        }
      }
    });

    // 3. Navigation Pill Updates
    if (DOM.navThumbnail) {
      DOM.navThumbnail.style.backgroundImage = `url('${SECTION_THUMBNAILS[currentSection]}')`;
    }
    if (DOM.navLabel) {
      DOM.navLabel.textContent = SECTION_LABELS[currentSection];
    }

    // 4. Action Button States
    if (DOM.navPrev) {
      if (activeSectionIndex === 0) {
        DOM.navPrev.setAttribute('disabled', 'true');
      } else {
        DOM.navPrev.removeAttribute('disabled');
      }
    }

    if (DOM.navNext) {
      if (activeSectionIndex === SECTIONS.length - 1) {
        DOM.navNext.setAttribute('disabled', 'true');
      } else {
        DOM.navNext.removeAttribute('disabled');
      }
    }
  }

  // ----------------------------------------------------
  // WORK GALLERY ENGINE
  // ----------------------------------------------------
  function renderWorkGallery() {
    if (!DOM.workGallery) return;

    const fragment = document.createDocumentFragment();

    PORTFOLIO_ITEMS.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'work-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Project: ${item.title}`);

      card.innerHTML = `
        <div class="work-card-image" style="background-image: url('${item.image}');" role="img" aria-label="${item.title} image preview"></div>
        <div class="work-card-info">
          <span class="work-card-category">${item.category}</span>
          <h3 class="work-card-title">${item.title}</h3>
          <p class="work-card-description">${item.description}</p>
          <div style="display: flex; gap: 12px; margin-top: 12px;">
            ${item.githubLink ? `<a href="${item.githubLink}" target="_blank" rel="noopener noreferrer" class="work-card-link" style="margin-top: 0;" aria-label="View ${item.title} repository on GitHub">GitHub</a>` : ''}
            ${item.liveLink ? `<a href="${item.liveLink}" target="_blank" rel="noopener noreferrer" class="work-card-link" style="margin-top: 0;" aria-label="View ${item.title} live demonstration">Live Demo</a>` : ''}
          </div>
        </div>
      `;

      // Event listener for opening lightbox
      card.addEventListener('click', () => openLightbox(item.image));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.tagName !== 'A') {
            e.preventDefault();
            openLightbox(item.image);
          }
        }
      });

      // Prevent link clicks from triggering lightbox modal
      const links = card.querySelectorAll('.work-card-link');
      links.forEach((link) => {
        link.addEventListener('click', (e) => e.stopPropagation());
      });

      fragment.appendChild(card);
    });

    DOM.workGallery.innerHTML = '';
    DOM.workGallery.appendChild(fragment);
  }

  // ----------------------------------------------------
  // LIGHTBOX CONTROLLER
  // ----------------------------------------------------
  function openLightbox(imgSrc) {
    if (!DOM.lightbox || !DOM.lightboxImg) return;
    DOM.lightboxImg.src = imgSrc;
    DOM.lightbox.classList.remove('hidden');
    if (DOM.lightboxClose) DOM.lightboxClose.focus();
  }

  function closeLightbox() {
    if (!DOM.lightbox || !DOM.lightboxImg) return;
    DOM.lightbox.classList.add('hidden');
    DOM.lightboxImg.src = '';
  }

  function initLightboxEvents() {
    if (DOM.lightboxClose) {
      DOM.lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

    if (DOM.lightbox) {
      DOM.lightbox.addEventListener('click', closeLightbox);
    }

    if (DOM.lightboxImg) {
      DOM.lightboxImg.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  // ----------------------------------------------------
  // CONTACT FORM & EMAILJS INTEGRATION
  // ----------------------------------------------------
  function initEmailJS() {
    if (
      typeof emailjs !== 'undefined' &&
      EMAILJS_CONFIG.PUBLIC_KEY &&
      EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY'
    ) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }

  function showValidationError(message) {
    if (DOM.validationError) {
      DOM.validationError.textContent = message;
      DOM.validationError.classList.remove('hidden');
    }
  }

  function clearValidationError() {
    if (DOM.validationError) {
      DOM.validationError.textContent = '';
      DOM.validationError.classList.add('hidden');
    }
  }

  function initContactForm() {
    if (!DOM.contactForm) return;

    if (DOM.errorRetryBtn) {
      DOM.errorRetryBtn.addEventListener('click', () => {
        if (DOM.contactError) DOM.contactError.classList.add('hidden');
        DOM.contactForm.classList.remove('hidden');
      });
    }

    DOM.contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (isSubmitting) return;
      clearValidationError();

      const nameVal = DOM.formName ? DOM.formName.value.trim() : '';
      const emailVal = DOM.formEmail ? DOM.formEmail.value.trim() : '';
      const subjectVal = DOM.formSubject ? DOM.formSubject.value.trim() : '';
      const msgVal = DOM.formMessage ? DOM.formMessage.value.trim() : '';

      // Validation Guards
      if (!nameVal || nameVal.length < 2) {
        showValidationError('Please enter a valid name (at least 2 characters).');
        if (DOM.formName) DOM.formName.focus();
        return;
      }

      if (!emailVal || !EMAIL_REGEX.test(emailVal)) {
        showValidationError('Please enter a valid email address.');
        if (DOM.formEmail) DOM.formEmail.focus();
        return;
      }

      if (!subjectVal || subjectVal.length < 2) {
        showValidationError('Please enter a subject (at least 2 characters).');
        if (DOM.formSubject) DOM.formSubject.focus();
        return;
      }

      if (!msgVal || msgVal.length < 5) {
        showValidationError('Please enter a message (at least 5 characters).');
        if (DOM.formMessage) DOM.formMessage.focus();
        return;
      }

      // Set Loading & Anti-Duplicate State
      isSubmitting = true;
      if (DOM.submitBtn) {
        DOM.submitBtn.disabled = true;
        DOM.submitBtn.style.opacity = '0.7';
        DOM.submitBtn.style.cursor = 'not-allowed';
      }
      if (DOM.submitBtnText) DOM.submitBtnText.textContent = 'Sending...';

      try {
        const isConfigMissing =
          EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID' ||
          EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
          EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY';

        if (isConfigMissing) {
          throw new Error('EmailJS credentials missing. Please set your credentials in script.js.');
        }

        const templateParams = {
          name: nameVal,
          from_name: nameVal,
          email: emailVal,
          from_email: emailVal,
          reply_to: emailVal,
          subject: subjectVal,
          title: subjectVal,
          message: msgVal,
          to_name: 'Adarsha Naskar'
        };

        if (typeof emailjs !== 'undefined') {
          await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
          );
        } else {
          throw new Error('EmailJS SDK is unavailable.');
        }

        // Success State UI
        DOM.contactForm.classList.add('hidden');
        if (DOM.contactSuccess) DOM.contactSuccess.classList.remove('hidden');
        DOM.contactForm.reset();

        setTimeout(() => {
          if (DOM.contactSuccess) DOM.contactSuccess.classList.add('hidden');
          DOM.contactForm.classList.remove('hidden');
        }, 5000);

      } catch (err) {
        DOM.contactForm.classList.add('hidden');
        if (DOM.contactError) DOM.contactError.classList.remove('hidden');
        if (DOM.errorMessageText) {
          DOM.errorMessageText.textContent =
            err?.text || err?.message || 'Failed to send message. Please verify network connectivity.';
        }
      } finally {
        isSubmitting = false;
        if (DOM.submitBtn) {
          DOM.submitBtn.disabled = false;
          DOM.submitBtn.style.opacity = '1';
          DOM.submitBtn.style.cursor = 'pointer';
        }
        if (DOM.submitBtnText) DOM.submitBtnText.textContent = 'Send Message';
      }
    });
  }

  // ----------------------------------------------------
  // EVENT LISTENERS & NAVIGATION BINDINGS
  // ----------------------------------------------------
  function initNavigationEvents() {
    if (DOM.navPrev) {
      DOM.navPrev.addEventListener('click', () => {
        if (activeSectionIndex > 0) {
          updateActiveSection(SECTIONS[activeSectionIndex - 1]);
        }
      });
    }

    if (DOM.navNext) {
      DOM.navNext.addEventListener('click', () => {
        if (activeSectionIndex < SECTIONS.length - 1) {
          updateActiveSection(SECTIONS[activeSectionIndex + 1]);
        }
      });
    }

    if (DOM.navReset) {
      DOM.navReset.addEventListener('click', () => updateActiveSection('home'));
    }

    if (DOM.headerAuthor) {
      DOM.headerAuthor.addEventListener('click', () => updateActiveSection('home'));
      DOM.headerAuthor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateActiveSection('home');
        }
      });
    }

    // Global Keyboard Navigation (Escape to close lightbox, Arrow keys to switch sections)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.lightbox && !DOM.lightbox.classList.contains('hidden')) {
          closeLightbox();
        }
      } else if (e.key === 'ArrowRight') {
        if (activeSectionIndex < SECTIONS.length - 1 && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          updateActiveSection(SECTIONS[activeSectionIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeSectionIndex > 0 && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          updateActiveSection(SECTIONS[activeSectionIndex - 1]);
        }
      }
    });
  }

  // ----------------------------------------------------
  // APPLICATION INITIALIZATION
  // ----------------------------------------------------
  function init() {
    cacheDOMElements();
    initEmailJS();
    renderWorkGallery();
    initLightboxEvents();
    initContactForm();
    initNavigationEvents();
    updateActiveSection('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
