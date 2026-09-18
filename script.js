/**
 * script.js — Anirban Kumar Sarkar Portfolio
 * Vanilla JavaScript, no dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     REDUCED MOTION CHECK
     ============================================ */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ============================================
     1. NAVBAR — scroll behaviour
     ============================================ */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 80);
  };

  handleNavScroll();                        // run on load
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ============================================
     2. SCROLL SPY (IntersectionObserver)
     ============================================ */
  const navLinks = document.querySelectorAll('#nav-list .nav-link');
  const sectionIds = ['home', 'tools', 'work', 'contact'];
  const spySections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if (spySections.length > 0 && navLinks.length > 0) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              // "Hire Me" also links to #contact — mark it active too
              if (href === `#${id}`) {
                link.classList.add('nav-link--active');
              } else {
                link.classList.remove('nav-link--active');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0
      }
    );
    spySections.forEach(section => spyObserver.observe(section));
  }

  /* ============================================
     3. SMOOTH SCROLL — handled by CSS
        (scroll-behavior: smooth + scroll-margin-top)
        We only need JS to close the mobile menu
        when a link is clicked.
     ============================================ */

  /* ============================================
     4. MOBILE MENU
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll('.mobile-menu__link')
    : [];

  const openMenu = () => {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.add('hamburger--active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('mobile-menu--open');
    document.body.classList.add('menu-open');

    // Focus first link after transition
    if (mobileLinks.length > 0) {
      setTimeout(() => mobileLinks[0].focus(), 320);
    }
  };

  const closeMenu = () => {
    if (!hamburger || !mobileMenu) return;
    if (hamburger.getAttribute('aria-expanded') !== 'true') return;

    hamburger.classList.remove('hamburger--active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.classList.remove('menu-open');
    hamburger.focus();
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });
  }

  // Close on link click
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close on backdrop click
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMenu();
    });
  }

  // Focus trap inside mobile menu
  if (mobileMenu && mobileLinks.length > 0) {
    const firstLink = mobileLinks[0];
    const lastLink = mobileLinks[mobileLinks.length - 1];

    mobileMenu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstLink) {
          e.preventDefault();
          lastLink.focus();
        }
      } else {
        if (document.activeElement === lastLink) {
          e.preventDefault();
          firstLink.focus();
        }
      }
    });
  }

  /* ============================================
     5. TOOL CHIPS — render from data
     ============================================ */
  const toolsData = {
    expertise: [
      'Photoshop', 'Illustrator', 'Figma', 'Framer',
      'Webflow', 'HTML', 'CSS', 'JS'
    ],
    software: [
      'After Effects', 'Blender', 'SaaS', 'Bootstrap'
    ],
    ai: [
      'Claude Code', 'Cursor', 'Codex', 'Lovable',
      'Antigravity', 'Google AI Studio', 'Stitch',
      'Whimsical', 'Miro', 'Spline', 'Kling',
      'Midjourney', 'Leonardo', 'Notion', 'NotebookLM', 'Hotjar'
    ]
  };

  const renderChips = (key, containerId) => {
    const el = document.getElementById(containerId);
    if (!el || !toolsData[key]) return;
    el.innerHTML = toolsData[key]
      .map(name => `<span class="chip chip--${key}">${name}</span>`)
      .join('');
  };

  renderChips('expertise', 'chips-expertise');
  renderChips('software', 'chips-software');
  renderChips('ai', 'chips-ai');

  /* ============================================
     6. PROJECTS DATA
     ============================================ */
  const projects = [
    // ---- Product Design ----
    {
      id: 'triveda-brand',
      category: 'product-design',
      title: 'Triveda',
      description: 'End-to-end product design for an Ayurvedic wellness brand — market survey, competitive analysis, logo, typography, colour palette, full branding, and campaign design.',
      tools: ['Photoshop', 'Illustrator', 'Leonardo', 'Nano Banana Pro', 'Firefly', 'Gemini', 'Notion'],
      thumbnail: 'assets/projects/triveda-brand.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-brand',
      category: 'product-design',
      title: 'EcoVolt',
      description: 'Full product design for a sustainable energy company — from market research and competitive analysis through logo, typography, colour system, branding, and campaign rollout.',
      tools: ['Photoshop', 'Illustrator', 'Leonardo', 'Nano Banana Pro', 'Firefly', 'Gemini', 'Notion'],
      thumbnail: 'assets/projects/ecovolt-brand.jpg',
      link: '#'
    },
    {
      id: 'mittika-brand',
      category: 'product-design',
      title: 'Mittika',
      description: 'Complete product design for an artisanal brand — market survey, competitive analysis, logo, packaging, typography, colour palette, full branding, and marketing campaigns.',
      tools: ['Photoshop', 'Illustrator', 'Leonardo', 'Nano Banana Pro', 'Firefly', 'Gemini', 'Notion'],
      thumbnail: 'assets/projects/mittika-brand.jpg',
      link: '#'
    },
    {
      id: 'hospitality-brand',
      category: 'product-design',
      title: 'Hospitality Chain',
      description: 'Premium hospitality product design — market survey, competitive analysis, logo suite, signage, typography, colour palette, full branding, and campaign strategy.',
      tools: ['Photoshop', 'Illustrator', 'Leonardo', 'Nano Banana Pro', 'Firefly', 'Gemini', 'Notion'],
      thumbnail: 'assets/projects/hospitality-brand.jpg',
      link: '#'
    },
    {
      id: 'eventmgmt-brand',
      category: 'product-design',
      title: 'Event Management Chain',
      description: 'End-to-end product design for an event management company — market research, competitive analysis, logo, typography, colour palette, full branding, and campaign collateral.',
      tools: ['Photoshop', 'Illustrator', 'Leonardo', 'Nano Banana Pro', 'Firefly', 'Gemini', 'Notion'],
      thumbnail: 'assets/projects/eventmgmt-brand.jpg',
      link: '#'
    },

    // ---- UI/UX Design ----
    {
      id: 'nuvera-ux',
      category: 'ui-ux-design',
      title: 'Nuvera',
      description: 'Wellness app — research in Gemini, idea exploration in Stitch and Claude, and final interface design crafted in Figma.',
      tools: ['Gemini', 'Stitch', 'Claude', 'Figma', 'Notion'],
      thumbnail: 'assets/projects/nuvera.jpg',
      link: '#'
    },
    {
      id: 'eventmgmt-ux',
      category: 'ui-ux-design',
      title: 'Event Management Chain',
      description: 'Event management platform — user research in Gemini, ideation in Stitch and Claude, booking flows and vendor dashboards designed in Figma.',
      tools: ['Gemini', 'Stitch', 'Claude', 'Figma', 'Notion'],
      thumbnail: 'assets/projects/eventmgmt-ux.jpg',
      link: '#'
    },
    {
      id: 'saas-landing-ux',
      category: 'ui-ux-design',
      title: 'SaaS Landing Page',
      description: 'High-converting SaaS landing page — research in Gemini, concept exploration in Stitch and Claude, final design and prototyping in Figma.',
      tools: ['Gemini', 'Stitch', 'Claude', 'Figma', 'Notion'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },
    {
      id: 'aerobharat-ux',
      category: 'ui-ux-design',
      title: 'AeroBharat',
      description: 'Immersive drone rental experience — research in Gemini, ideation in Stitch and Claude, built in Framer with custom Blender 3D modelling.',
      tools: ['Gemini', 'Stitch', 'Claude', 'Framer', 'Blender', 'Notion'],
      thumbnail: 'assets/projects/aerobharat-ux.jpg',
      link: '#'
    },
    {
      id: 'mittika-ux',
      category: 'ui-ux-design',
      title: 'Mittika',
      description: 'E-commerce UI/UX for the artisanal brand — research in Gemini, idea exploration in Stitch and Claude, product pages and checkout flow designed in Figma.',
      tools: ['Gemini', 'Stitch', 'Claude', 'Figma', 'Notion'],
      thumbnail: 'assets/projects/mittika-ux.jpg',
      link: '#'
    },

    // ---- Web Development ----
    {
      id: 'triveda-web',
      category: 'web-development',
      title: 'Triveda',
      description: 'Landing page for the Ayurvedic wellness brand — built from scratch with clean, semantic markup.',
      tools: ['HTML', 'CSS', 'JS', 'SaaS', 'Bootstrap'],
      thumbnail: 'assets/projects/triveda-web.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-web',
      category: 'web-development',
      title: 'EcoVolt',
      description: 'Responsive landing page for the sustainable energy brand — performance-optimised with smooth animations.',
      tools: ['HTML', 'CSS', 'JS', 'SaaS', 'Bootstrap'],
      thumbnail: 'assets/projects/ecovolt-web.jpg',
      link: '#'
    },
    {
      id: 'mittika-web',
      category: 'web-development',
      title: 'Mittika',
      description: 'Artisanal brand landing page — hand-crafted frontend showcasing products with an earthy, warm aesthetic.',
      tools: ['HTML', 'CSS', 'JS', 'SaaS', 'Bootstrap'],
      thumbnail: 'assets/projects/mittika-web.jpg',
      link: '#'
    },
    {
      id: 'hospitality-web',
      category: 'web-development',
      title: 'Hospitality Chain',
      description: 'Premium hospitality landing page — elegant layout with booking integration and immersive imagery.',
      tools: ['HTML', 'CSS', 'JS', 'SaaS', 'Bootstrap'],
      thumbnail: 'assets/projects/hospitality-web.jpg',
      link: '#'
    },
    {
      id: 'eventmgmt-web',
      category: 'web-development',
      title: 'Event Management Chain',
      description: 'Event management landing page — dynamic sections, testimonials carousel, and contact form integration.',
      tools: ['HTML', 'CSS', 'JS', 'SaaS', 'Bootstrap'],
      thumbnail: 'assets/projects/eventmgmt-web.jpg',
      link: '#'
    }
  ];

  const categoryLabels = {
    'product-design': 'Product Design',
    'ui-ux-design': 'UI/UX Design',
    'web-development': 'Web Development'
  };

  /* ============================================
     7. PROJECT RENDERING + TAB FILTERING
     ============================================ */
  const projectsGrid = document.getElementById('projects-grid');
  const tabs = document.querySelectorAll('.tab[role="tab"]');

  const buildCardHTML = (p) => {
    const toolTags = p.tools
      .map(t => `<span class="project-card__tool-tag">${t}</span>`)
      .join('');

    return `
      <a href="${p.link}" class="project-card project-card--visible" data-category="${p.category}">
        <div class="project-card__thumb">
          <img src="${p.thumbnail}" alt="${p.title} — project thumbnail" loading="lazy" decoding="async">
        </div>
        <div class="project-card__body">
          <span class="project-card__category">${categoryLabels[p.category]}</span>
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description}</p>
          <div class="project-card__tools">${toolTags}</div>
          <span class="project-card__link">View case study <span class="arrow">→</span></span>
        </div>
      </a>`;
  };

  const renderProjects = (category) => {
    if (!projectsGrid) return;

    const filtered = projects.filter(p => p.category === category);
    const html = filtered.map(buildCardHTML).join('');

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      projectsGrid.innerHTML = html;
      return;
    }

    // Fade-out existing cards, then swap
    const currentCards = projectsGrid.querySelectorAll('.project-card');
    if (currentCards.length > 0) {
      currentCards.forEach(card => {
        card.classList.remove('project-card--visible');
        card.classList.add('project-card--hidden');
      });

      setTimeout(() => {
        projectsGrid.innerHTML = html;
        // Force reflow then add visible class
        const newCards = projectsGrid.querySelectorAll('.project-card');
        newCards.forEach(card => {
          card.classList.remove('project-card--visible');
          void card.offsetWidth; // reflow
          card.classList.add('project-card--visible');
        });
      }, 260);
    } else {
      projectsGrid.innerHTML = html;
    }
  };

  // Tab interaction
  if (tabs.length > 0) {
    let activeIdx = 0;

    // Initial render — first tab is active by default
    const initialCategory = tabs[0].getAttribute('data-category');
    renderProjects(initialCategory);

    const activateTab = (index) => {
      tabs.forEach((t, i) => {
        const isActive = i === index;
        t.classList.toggle('tab--active', isActive);
        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        t.setAttribute('tabindex', isActive ? '0' : '-1');
      });
      activeIdx = index;
      tabs[index].focus();
      renderProjects(tabs[index].getAttribute('data-category'));
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateTab(i));

      // Keyboard navigation (WAI-ARIA tabs pattern)
      tab.addEventListener('keydown', (e) => {
        let next = activeIdx;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          next = (activeIdx + 1) % tabs.length;
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          next = (activeIdx - 1 + tabs.length) % tabs.length;
          e.preventDefault();
        } else if (e.key === 'Home') {
          next = 0;
          e.preventDefault();
        } else if (e.key === 'End') {
          next = tabs.length - 1;
          e.preventDefault();
        }
        if (next !== activeIdx) activateTab(next);
      });
    });
  }

  /* ============================================
     8. CONTACT FORM — client-side validation
     ============================================ */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    const showError = (input, msg) => {
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? document.getElementById(errId) : null;
      input.setAttribute('aria-invalid', 'true');
      if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
      }
    };

    const clearError = (input) => {
      const errId = input.getAttribute('aria-describedby');
      const errEl = errId ? document.getElementById(errId) : null;
      input.removeAttribute('aria-invalid');
      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }
    };

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const nameEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const msgEl = document.getElementById('message');

      // Name
      if (nameEl && !nameEl.value.trim()) {
        showError(nameEl, 'Please enter your name.');
        valid = false;
      } else if (nameEl) {
        clearError(nameEl);
      }

      // Email
      if (emailEl && !emailEl.value.trim()) {
        showError(emailEl, 'Please enter your email.');
        valid = false;
      } else if (emailEl && !emailRegex.test(emailEl.value.trim())) {
        showError(emailEl, 'Please enter a valid email address.');
        valid = false;
      } else if (emailEl) {
        clearError(emailEl);
      }

      // Message
      if (msgEl && !msgEl.value.trim()) {
        showError(msgEl, 'Please enter a message.');
        valid = false;
      } else if (msgEl) {
        clearError(msgEl);
      }

      if (!valid) return;

      // Submit via fetch if Formspree is configured
      const action = contactForm.getAttribute('action');
      if (action && !action.includes('YOUR_FORM_ID')) {
        fetch(action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' }
        })
          .then(res => {
            if (res.ok) {
              contactForm.style.display = 'none';
              if (formSuccess) {
                formSuccess.removeAttribute('hidden');
                formSuccess.style.display = 'block';
              }
            } else {
              alert('Something went wrong. Please try again.');
            }
          })
          .catch(() => alert('Network error. Please try again.'));
      } else {
        // TODO: Replace YOUR_FORM_ID in index.html with a real Formspree endpoint
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.removeAttribute('hidden');
          formSuccess.style.display = 'block';
        }
      }
    });

    // Clear inline errors as the user types
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') clearError(input);
      });
    });

    // Float label for selects on change
    contactForm.querySelectorAll('.form-select').forEach(select => {
      select.addEventListener('change', () => {
        select.classList.toggle('has-value', select.value !== '');
      });
    });
  }

  /* ============================================
     9. SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    // Immediately show everything — no animation
    reveals.forEach(el => el.classList.add('reveal--visible'));
  } else if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target); // once only
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback
    reveals.forEach(el => el.classList.add('reveal--visible'));
  }

}); // end DOMContentLoaded
