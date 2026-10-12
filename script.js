/**
 * script.js — Anirban Kumar Sarkar Portfolio
 * Vanilla JavaScript, no dependencies.
 */

/* ============================================
   0. PAGE LOADER
   ============================================ */
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const MIN_DISPLAY = 1200; // ms — matches the bar animation duration
  const startTime = performance.now();

  const hideLoader = () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY - elapsed);

    setTimeout(() => {
      loader.classList.add('page-loader--hidden');
      loader.addEventListener('transitionend', () => {
        loader.remove();
        window.dispatchEvent(new CustomEvent('page-ready'));
      }, { once: true });
    }, remaining);
  };

  // Reduced motion: skip animation entirely
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.remove();
    window.dispatchEvent(new CustomEvent('page-ready'));
  } else {
    window.addEventListener('load', hideLoader);
    // Safety fallback — never block the page longer than 4s
    setTimeout(hideLoader, 4000);
  }
})();

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
     1b. NAVBAR CV DROPDOWN
     ============================================ */
  const navCvDropdown = document.getElementById('nav-cv-dropdown');
  const navCvToggle = document.getElementById('nav-cv-toggle');
  const navCvMenu = document.getElementById('nav-cv-menu');
  const navCvItems = navCvMenu ? navCvMenu.querySelectorAll('.nav-cv-item') : [];

  if (navCvToggle && navCvMenu) {
    const openCvMenu = () => {
      navCvMenu.classList.add('nav-cv-menu--open');
      navCvToggle.setAttribute('aria-expanded', 'true');
    };

    const closeCvMenu = () => {
      navCvMenu.classList.remove('nav-cv-menu--open');
      navCvToggle.setAttribute('aria-expanded', 'false');
    };

    const isCvOpen = () => navCvToggle.getAttribute('aria-expanded') === 'true';

    navCvToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isCvOpen() ? closeCvMenu() : openCvMenu();
    });

    navCvItems.forEach(item => {
      item.addEventListener('click', () => {
        closeCvMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (isCvOpen() && !navCvDropdown.contains(e.target)) {
        closeCvMenu();
      }
    });

    navCvToggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCvMenu();
        if (navCvItems.length > 0) navCvItems[0].focus();
      }
    });

    navCvMenu.addEventListener('keydown', (e) => {
      const items = [...navCvItems];
      const idx = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % items.length;
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + items.length) % items.length;
        items[prev].focus();
      } else if (e.key === 'Escape') {
        closeCvMenu();
        navCvToggle.focus();
      }
    });
  }

  /* ============================================
     4. MOBILE MENU
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu
    ? mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__sublink')
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
      'Figma', 'Framer', 'Webflow', 'HTML', 'CSS', 'JavaScript',
      'Tailwind CSS', 'Bootstrap', 'Sass', 'Photoshop', 'Illustrator', 'InDesign'
    ],
    software: [
      'After Effects', 'Blender'
    ],
    ai: [
      'Lovable', 'Cursor', 'Antigravity', 'Claude Code', 'Codex',
      'ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Notion AI',
      'Spline AI', 'Three.js', 'Stitch', 'Midjourney', 'Kling',
      'Leonardo', 'Firefly', 'Figma Weave', 'Nano Banana', 'Relume'
    ]
  };

  const renderChips = (key, containerId) => {
    const el = document.getElementById(containerId);
    if (!el || !toolsData[key]) return;
    el.innerHTML = toolsData[key]
      .map((name, i) => `<span class="chip chip--${key}" style="transition-delay: ${(i * 28) + 120}ms">${name}</span>`)
      .join('');
  };

  renderChips('expertise', 'chips-expertise');
  renderChips('software', 'chips-software');
  renderChips('ai', 'chips-ai');

  /* ============================================
     6. PROJECTS DATA (from CV)
     ============================================ */
  const projects = [
    // ---- Product Design ----
    {
      id: 'triveda-product',
      category: 'product-design',
      title: 'Triveda',
      description: 'Wellness brand identity and visual system.',
      tools: ['Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Visual Storytelling'],
      thumbnail: 'assets/projects/triveda-brand.jpg',
      link: '#'
    },
    {
      id: 'mittika-product',
      category: 'product-design',
      title: 'Mittika',
      description: 'Traditional Indian fabric reimagined as modern outfits.',
      tools: ['Photoshop', 'Illustrator', 'Art Direction', 'Moodboarding', 'Branding'],
      thumbnail: 'assets/projects/mittika-brand.jpg',
      link: '#'
    },
    {
      id: 'wave-product',
      category: 'product-design',
      title: 'Wave',
      description: 'Brand identity for a live concert management company.',
      tools: ['Illustrator', 'Photoshop', 'InDesign', 'Visual Identity', 'After Effects'],
      thumbnail: 'assets/projects/eventmgmt-brand.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-product',
      category: 'product-design',
      title: 'EcoVolt',
      description: 'Brand identity project for a sustainable energy company.',
      tools: ['Figma', 'Illustrator', 'Photoshop', 'Brand Identity', 'Concept Development'],
      thumbnail: 'assets/projects/ecovolt-brand.jpg',
      link: '#'
    },
    {
      id: 'forgeos-product',
      category: 'product-design',
      title: 'ForgeOS',
      description: 'Brand identity for a SaaS automation company building an agile MES.',
      tools: ['Figma', 'Illustrator', 'Brand Strategy', 'Visual Systems', 'Notion'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },

    // ---- UI/UX Design ----
    {
      id: 'nuvera-ux',
      category: 'ui-ux-design',
      title: 'Nuvera',
      description: 'Supplement and testing ecosystem app: UX flows and interface design.',
      tools: ['Figma', 'UX Research', 'Gemini', 'Stitch', 'Claude'],
      thumbnail: 'assets/projects/nuvera.jpg',
      link: '#'
    },
    {
      id: 'aerobharat-ux',
      category: 'ui-ux-design',
      title: 'AeroBharat',
      description: 'Drone company landing page with a scroll-animated 3D interactive drone model, built in Framer.',
      tools: ['Framer', 'Blender', 'Three.js', 'Spline AI'],
      thumbnail: 'assets/projects/aerobharat-ux.jpg',
      link: '#'
    },
    {
      id: 'forgeos-ux',
      category: 'ui-ux-design',
      title: 'ForgeOS',
      description: 'App and Dashboard for a SaaS MES automation company: UI design and front-end build.',
      tools: ['Figma', 'UI Design', 'Design Systems', 'Bootstrap'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },
    {
      id: 'mittika-ux',
      category: 'ui-ux-design',
      title: 'Mittika',
      description: 'Mobile app and website for an Indian fabric-wear brand, website built in Webflow.',
      tools: ['Figma', 'Webflow', 'Mobile App', 'Wireframing'],
      thumbnail: 'assets/projects/mittika-brand.jpg',
      link: '#'
    },
    {
      id: 'bookmyshow-ux',
      category: 'ui-ux-design',
      title: 'BookMyShow',
      description: 'UX research and redesign concept for the ticketing app.',
      tools: ['Figma', 'UX Research', 'User Flows', 'Redesign'],
      thumbnail: 'assets/projects/eventmgmt-ux.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-ux',
      category: 'ui-ux-design',
      title: 'EcoVolt',
      description: 'Solar energy company app and landing page, landing page built in Framer.',
      tools: ['Framer', 'Figma', 'Mobile App', 'UI/UX'],
      thumbnail: 'assets/projects/ecovolt-brand.jpg',
      link: '#'
    },

    // ---- Web Development ----
    // (Same projects as Product Design)
    {
      id: 'triveda-web',
      category: 'web-development',
      title: 'Triveda',
      description: 'Wellness brand digital presence & landing page with clean, semantic markup.',
      tools: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Sass'],
      thumbnail: 'assets/projects/triveda-web.jpg',
      link: '#'
    },
    {
      id: 'mittika-web',
      category: 'web-development',
      title: 'Mittika',
      description: 'Indian fabric-wear brand website built in Webflow with modern, responsive styling.',
      tools: ['Webflow', 'HTML', 'CSS', 'Responsive Design'],
      thumbnail: 'assets/projects/mittika-web.jpg',
      link: '#'
    },
    {
      id: 'wave-web',
      category: 'web-development',
      title: 'Wave',
      description: 'Live concert management company digital platform & event landing experience.',
      tools: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Sass'],
      thumbnail: 'assets/projects/eventmgmt-web.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-web',
      category: 'web-development',
      title: 'EcoVolt',
      description: 'Solar energy company landing page built in Framer with interactive components.',
      tools: ['Framer', 'HTML', 'CSS', 'JavaScript', 'Responsive Web'],
      thumbnail: 'assets/projects/ecovolt-web.jpg',
      link: '#'
    },
    {
      id: 'forgeos-web',
      category: 'web-development',
      title: 'ForgeOS',
      description: 'App and Dashboard for a SaaS MES automation company: front-end build.',
      tools: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'Tailwind CSS'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
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

  const buildCardHTML = (p, idx = 0) => {
    const toolTags = p.tools
      .map(t => `<span class="project-card__tool-tag">${t}</span>`)
      .join('');

    return `
      <div class="project-card project-card--visible" data-category="${p.category}" style="transition-delay: ${idx * 65}ms">
        <div class="project-card__inner">
          <div class="project-card__front">
            <img src="${p.thumbnail}" alt="${p.title} — project thumbnail" loading="lazy" decoding="async">
            <span class="project-card__front-title">${p.title}</span>
          </div>
          <div class="project-card__back">
            <span class="project-card__category">${categoryLabels[p.category]}</span>
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__desc">${p.description}</p>
            <div class="project-card__tools">${toolTags}</div>
            <a href="${p.link}" class="project-card__link">View case study <span class="arrow">→</span></a>
          </div>
        </div>
      </div>`;
  };

  const renderProjects = (category) => {
    if (!projectsGrid) return;

    const filtered = projects.filter(p => p.category === category);
    const html = filtered.map((p, idx) => buildCardHTML(p, idx)).join('');

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) {
      projectsGrid.innerHTML = html;
      projectsGrid.querySelectorAll('.project-card').forEach(c => c.classList.add('project-card--revealed'));
      return;
    }

    // Fade-out existing cards, then swap
    const currentCards = projectsGrid.querySelectorAll('.project-card');
    if (currentCards.length > 0) {
      currentCards.forEach(card => {
        card.classList.remove('project-card--visible', 'project-card--revealed');
        card.classList.add('project-card--hidden');
      });

      setTimeout(() => {
        projectsGrid.innerHTML = html;
        // Force reflow then add visible and revealed class with stagger
        const newCards = projectsGrid.querySelectorAll('.project-card');
        newCards.forEach((card, idx) => {
          card.style.transitionDelay = `${idx * 65}ms`;
          void card.offsetWidth; // reflow
          card.classList.add('project-card--visible', 'project-card--revealed');
        });
        if (isDeckMode) {
          stackDeck();
        } else {
          expandDeck();
        }
      }, 240);
    } else {
      projectsGrid.innerHTML = html;
      const newCards = projectsGrid.querySelectorAll('.project-card');
      newCards.forEach((card, idx) => {
        card.style.transitionDelay = `${idx * 65}ms`;
        card.classList.add('project-card--visible', 'project-card--revealed');
      });
      setTimeout(() => {
        if (isDeckMode) {
          stackDeck();
        } else {
          expandDeck();
        }
      }, 60);
    }
  };

  /* ============================================
     7b. STACKED DECK INTERACTION & VIEW TOGGLE
     ============================================ */
  const btnViewDeck = document.getElementById('btn-view-deck');
  const btnViewGrid = document.getElementById('btn-view-grid');
  const projectsStage = document.getElementById('projects-stage');
  let isDeckMode = !prefersReducedMotion; // default to stacked deck until hovered

  const updateDeckStackCoordinates = () => {
    if (!projectsGrid || prefersReducedMotion) return;
    const cards = projectsGrid.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    // Center of grid container
    const gridW = projectsGrid.clientWidth;
    const gridH = projectsGrid.clientHeight;
    const centerX = gridW / 2;
    const centerY = gridH / 2;

    const rotations = [-4.5, 3.8, -2.6, 4.2, -3.2, 2.5, -4.0, 3.0, -1.8];

    cards.forEach((card, index) => {
      // Find the card's center relative to projectsGrid
      const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
      const cardCenterY = card.offsetTop + card.offsetHeight / 2;

      const dx = centerX - cardCenterX;
      const dy = centerY - cardCenterY;
      const rot = rotations[index % rotations.length];
      const zIndex = cards.length - index;

      card.style.setProperty('--stack-x', `${dx.toFixed(1)}px`);
      card.style.setProperty('--stack-y', `${dy.toFixed(1)}px`);
      card.style.setProperty('--stack-rot', `${rot}deg`);
      card.style.setProperty('--stack-z', `${zIndex + 2}`);
      card.style.setProperty('--deal-delay', `${index * 50}ms`);
    });
  };

  const expandDeck = () => {
    if (!projectsGrid) return;
    isDeckMode = false;
    projectsGrid.classList.remove('is-stacked');
    if (projectsStage) projectsStage.classList.remove('is-stacked');
    if (btnViewGrid && btnViewDeck) {
      btnViewGrid.classList.add('view-toggle__btn--active');
      btnViewGrid.setAttribute('aria-pressed', 'true');
      btnViewDeck.classList.remove('view-toggle__btn--active');
      btnViewDeck.setAttribute('aria-pressed', 'false');
    }
  };

  const stackDeck = () => {
    if (!projectsGrid || prefersReducedMotion) return;
    isDeckMode = true;
    updateDeckStackCoordinates();
    projectsGrid.classList.add('is-stacked');
    if (projectsStage) projectsStage.classList.add('is-stacked');
    if (btnViewGrid && btnViewDeck) {
      btnViewDeck.classList.add('view-toggle__btn--active');
      btnViewDeck.setAttribute('aria-pressed', 'true');
      btnViewGrid.classList.remove('view-toggle__btn--active');
      btnViewGrid.setAttribute('aria-pressed', 'false');
    }
  };

  // Hover directly over the stacked deck cards or hint badge to deal cards into grid
  if (projectsGrid) {
    projectsGrid.addEventListener('mouseover', (e) => {
      if (projectsGrid.classList.contains('is-stacked')) {
        const card = e.target.closest('.project-card');
        if (card) {
          expandDeck();
        }
      }
    });

    const deckHint = document.getElementById('projects-deck-hint');
    if (deckHint) {
      deckHint.addEventListener('mouseenter', () => {
        if (projectsGrid.classList.contains('is-stacked')) {
          expandDeck();
        }
      });
      deckHint.addEventListener('click', () => {
        if (projectsGrid.classList.contains('is-stacked')) {
          expandDeck();
        }
      });
    }

    // Touch-to-flip support & tap to expand deck
    projectsGrid.addEventListener('click', (e) => {
      if (projectsGrid.classList.contains('is-stacked')) {
        expandDeck();
        return;
      }

      const card = e.target.closest('.project-card');
      if (!card) return;

      // If clicking a link inside a flipped card, let it navigate
      if (e.target.closest('.project-card__link')) return;

      // Un-flip any other flipped card
      const currentlyFlipped = projectsGrid.querySelector('.project-card--flipped');
      if (currentlyFlipped && currentlyFlipped !== card) {
        currentlyFlipped.classList.remove('project-card--flipped');
      }

      // Toggle this card
      card.classList.toggle('project-card--flipped');
    });

    // Un-flip on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.project-card')) {
        const flipped = projectsGrid.querySelector('.project-card--flipped');
        if (flipped) flipped.classList.remove('project-card--flipped');
      }
    });
  }

  if (btnViewDeck) {
    btnViewDeck.addEventListener('click', () => {
      stackDeck();
    });
  }

  if (btnViewGrid) {
    btnViewGrid.addEventListener('click', () => {
      expandDeck();
    });
  }

  // Recalculate coordinates on window resize if in deck mode
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (projectsGrid && projectsGrid.classList.contains('is-stacked')) {
        updateDeckStackCoordinates();
      }
    }, 120);
  }, { passive: true });

  // Ensure coordinates are calculated accurately once loader finishes / page is fully loaded
  window.addEventListener('page-ready', () => {
    if (projectsGrid && projectsGrid.classList.contains('is-stacked')) {
      updateDeckStackCoordinates();
    }
  });
  window.addEventListener('load', () => {
    if (projectsGrid && projectsGrid.classList.contains('is-stacked')) {
      updateDeckStackCoordinates();
    }
  });

  const filterDropdown = document.getElementById('filter-dropdown');
  const filterToggle = document.getElementById('filter-toggle');
  const filterMenu = document.getElementById('filter-menu');
  const filterLabel = document.getElementById('filter-label');
  const filterItems = filterMenu
    ? filterMenu.querySelectorAll('.filter-dropdown__item')
    : [];

  // Helper to apply category to filter dropdown and re-render projects
  let applyCategory = (category) => {
    renderProjects(category);
  };

  if (filterToggle && filterMenu && filterItems.length > 0) {
    // Initial render — first item is active by default
    const initialCategory = filterItems[0].getAttribute('data-category');
    renderProjects(initialCategory);

    const openDropdown = () => {
      if (filterDropdown) filterDropdown.classList.add('filter-dropdown--open');
      filterMenu.classList.add('filter-dropdown__menu--open');
      filterToggle.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = () => {
      if (filterDropdown) filterDropdown.classList.remove('filter-dropdown--open');
      filterMenu.classList.remove('filter-dropdown__menu--open');
      filterToggle.setAttribute('aria-expanded', 'false');
    };

    const isOpen = () => filterToggle.getAttribute('aria-expanded') === 'true';

    // Apply category selection and synchronize UI
    applyCategory = (category) => {
      const targetItem = [...filterItems].find(i => i.getAttribute('data-category') === category);
      if (!targetItem) return;

      filterItems.forEach(i => {
        i.classList.remove('filter-dropdown__item--active');
        i.setAttribute('aria-selected', 'false');
      });
      targetItem.classList.add('filter-dropdown__item--active');
      targetItem.setAttribute('aria-selected', 'true');
      filterLabel.textContent = targetItem.textContent;
      renderProjects(category);
    };

    // Toggle on click
    filterToggle.addEventListener('click', () => {
      isOpen() ? closeDropdown() : openDropdown();
    });

    filterItems.forEach(item => {
      item.addEventListener('click', () => {
        applyCategory(item.getAttribute('data-category'));
        closeDropdown();
        filterToggle.focus();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen() && !filterDropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    // Keyboard navigation
    filterToggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDropdown();
        filterItems[0].focus();
      }
    });

    filterMenu.addEventListener('keydown', (e) => {
      const items = [...filterItems];
      const idx = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % items.length;
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + items.length) % items.length;
        items[prev].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (idx >= 0) {
          applyCategory(items[idx].getAttribute('data-category'));
          closeDropdown();
          filterToggle.focus();
        }
      } else if (e.key === 'Escape') {
        closeDropdown();
        filterToggle.focus();
      }
    });

    // Make items focusable
    filterItems.forEach(item => item.setAttribute('tabindex', '-1'));
  }

  /* ============================================
     7b. HERO "VIEW CASE STUDIES" DROPDOWN
     ============================================ */
  const heroDropdown = document.getElementById('hero-dropdown');
  const heroToggle = document.getElementById('hero-dropdown-toggle');
  const heroMenu = document.getElementById('hero-dropdown-menu');
  const heroItems = heroMenu
    ? heroMenu.querySelectorAll('.hero-dropdown__item')
    : [];

  if (heroToggle && heroMenu && heroItems.length > 0) {
    const openHeroDropdown = () => {
      heroMenu.classList.add('hero-dropdown__menu--open');
      heroToggle.setAttribute('aria-expanded', 'true');
    };

    const closeHeroDropdown = () => {
      heroMenu.classList.remove('hero-dropdown__menu--open');
      heroToggle.setAttribute('aria-expanded', 'false');
    };

    const isHeroOpen = () => heroToggle.getAttribute('aria-expanded') === 'true';

    heroToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isHeroOpen() ? closeHeroDropdown() : openHeroDropdown();
    });

    heroItems.forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.getAttribute('data-category');
        if (cat) {
          applyCategory(cat);
          const workSection = document.getElementById('work');
          if (workSection) {
            workSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        closeHeroDropdown();
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isHeroOpen() && !heroDropdown.contains(e.target)) {
        closeHeroDropdown();
      }
    });

    // Keyboard navigation
    heroToggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openHeroDropdown();
        heroItems[0].focus();
      }
    });

    heroMenu.addEventListener('keydown', (e) => {
      const items = [...heroItems];
      const idx = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (idx + 1) % items.length;
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (idx - 1 + items.length) % items.length;
        items[prev].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (idx >= 0) {
          const cat = items[idx].getAttribute('data-category');
          if (cat) {
            applyCategory(cat);
            const workSection = document.getElementById('work');
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
          closeHeroDropdown();
          heroToggle.focus();
        }
      } else if (e.key === 'Escape') {
        closeHeroDropdown();
        heroToggle.focus();
      }
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
        // Formspree not configured — show success for local testing only
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
     9. SCROLL-TRIGGERED ANIMATION SYSTEM
     ============================================ */

  // Stagger contact info items & socials
  document.querySelectorAll('.contact__details .contact__item').forEach((item, i) => {
    item.style.transitionDelay = `${(i * 75) + 120}ms`;
  });
  document.querySelectorAll('.contact__socials .social-link').forEach((link, i) => {
    link.style.transitionDelay = `${(i * 60) + 240}ms`;
  });

  // Hero entrance animation choreography
  const triggerHeroEntrance = () => {
    const heroReveals = document.querySelectorAll('#home [data-reveal]');
    heroReveals.forEach(el => {
      el.classList.add('is-revealed');
    });
  };

  if (prefersReducedMotion || !document.getElementById('page-loader')) {
    triggerHeroEntrance();
  } else {
    window.addEventListener('page-ready', triggerHeroEntrance, { once: true });
    // Safety fallback
    setTimeout(triggerHeroEntrance, 1600);
  }

  // Scroll reading progress bar
  const progressBar = document.getElementById('scroll-progress-bar');
  const updateScrollProgress = () => {
    if (!progressBar) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const progress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
    progressBar.style.transform = `scaleX(${progress})`;
  };

  // Hero interactive elements & Back-to-Top button
  const portraitWrapper = document.querySelector('.hero__portrait-wrapper');
  const scrollHint = document.getElementById('hero-scroll-hint');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  if (scrollHint) {
    const scrollHintLink = scrollHint.querySelector('a');
    if (scrollHintLink) {
      scrollHintLink.addEventListener('click', (e) => {
        e.preventDefault();
        const toolsSection = document.getElementById('tools');
        if (toolsSection) {
          toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Optimized rAF-throttled scroll listener
  let isTicking = false;
  const onScroll = () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;

        // 1. Reading progress
        updateScrollProgress();

        // 2. Parallax on hero portrait (only while hero in view)
        if (!prefersReducedMotion && portraitWrapper && scrolled < window.innerHeight) {
          portraitWrapper.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
        }

        // 3. Scroll hint fade
        if (scrollHint) {
          scrollHint.classList.toggle('hero__scroll-hint--hidden', scrolled > 60);
        }

        // 4. Back-to-top button visibility
        if (scrollTopBtn) {
          scrollTopBtn.classList.toggle('scroll-top-btn--visible', scrolled > 400);
        }

        isTicking = false;
      });
      isTicking = true;
    }
  };

  updateScrollProgress();
  window.addEventListener('scroll', onScroll, { passive: true });

  // IntersectionObserver for elements appearing on scroll
  const revealElements = document.querySelectorAll(
    '[data-reveal]:not(#home [data-reveal]), .reveal:not(#home), #projects-grid'
  );

  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal], .reveal').forEach(el => {
      el.classList.add('is-revealed', 'reveal--visible');
    });
    if (projectsGrid) {
      projectsGrid.querySelectorAll('.project-card').forEach(c => {
        c.classList.add('project-card--revealed');
      });
    }
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'reveal--visible');

            // If projects grid scrolled into view, cascade cards
            if (entry.target.id === 'projects-grid') {
              entry.target.querySelectorAll('.project-card').forEach((card, idx) => {
                card.style.transitionDelay = `${idx * 65}ms`;
                card.classList.add('project-card--revealed');
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    document.querySelectorAll('[data-reveal], .reveal').forEach(el => {
      el.classList.add('is-revealed', 'reveal--visible');
    });
    if (projectsGrid) {
      projectsGrid.querySelectorAll('.project-card').forEach(c => {
        c.classList.add('project-card--revealed');
      });
    }
  }

}); // end DOMContentLoaded
