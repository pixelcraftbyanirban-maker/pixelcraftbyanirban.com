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

  const MAX_POST_LOAD_DELAY = 450; // ms — never block FCP/LCP > 500ms once assets ready
  const startTime = performance.now();

  const hideLoader = () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MAX_POST_LOAD_DELAY - elapsed);

    setTimeout(() => {
      loader.classList.add('page-loader--hidden');
      loader.addEventListener('transitionend', () => {
        loader.remove();
        window.dispatchEvent(new CustomEvent('page-ready'));
      }, { once: true });
      // Fallback removal if transitionend doesn't fire
      setTimeout(() => {
        if (loader.parentNode) {
          loader.remove();
          window.dispatchEvent(new CustomEvent('page-ready'));
        }
      }, 350);
    }, remaining);
  };

  // Reduced motion: skip animation entirely
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    loader.remove();
    window.dispatchEvent(new CustomEvent('page-ready'));
  } else {
    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader);
      // Safety fallback — never block the page longer than 1500ms
      setTimeout(hideLoader, 1500);
    }
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
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
  };

  handleNavScroll();                        // run on load
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ============================================
     2. SCROLL SPY (IntersectionObserver)
     ============================================ */
  const navLinks = document.querySelectorAll('#nav-list .nav-link');
  const sectionIds = ['home', 'work', 'process', 'playground', 'contact'];
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
     1c. THEME SWITCHER (Dark & Pearlescent Light Mode)
     ============================================ */
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const mobileThemeBtn = document.getElementById('mobile-theme-btn');
  const metaThemeColor = document.getElementById('meta-theme-color');

  const getStoredTheme = () => {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      return null;
    }
  };

  const getCurrentTheme = () => {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  };

  const updateThemeUI = (theme) => {
    const isLight = theme === 'light';
    const nextThemeLabel = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';

    // 1. Desktop Switch Button (Pill toggle with sliding thumb)
    if (themeToggle) {
      themeToggle.setAttribute('aria-checked', isLight ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', nextThemeLabel);
      themeToggle.setAttribute('title', nextThemeLabel);
    }

    // 2. Mobile Navbar Action Button
    if (themeToggleMobile) {
      themeToggleMobile.setAttribute('aria-label', nextThemeLabel);
      themeToggleMobile.setAttribute('title', nextThemeLabel);
    }

    // 3. Mobile Menu Button
    if (mobileThemeBtn) {
      mobileThemeBtn.setAttribute('aria-label', nextThemeLabel);
      const textNode = mobileThemeBtn.querySelector('.mobile-theme-switch__text');
      if (textNode) {
        textNode.textContent = nextThemeLabel;
      }
    }

    // 4. Meta theme-color for mobile browser chrome
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isLight ? '#fef9d7' : '#07080C');
    }
  };

  const setTheme = (theme, save = true) => {
    const normalized = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', normalized);

    if (save) {
      try {
        localStorage.setItem('portfolio-theme', normalized);
      } catch (e) {}
    }

    updateThemeUI(normalized);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: normalized } }));
  };

  const toggleTheme = () => {
    // Add temporary transition class for smooth visual cross-fade
    document.documentElement.classList.add('theme-transitioning');
    const newTheme = getCurrentTheme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme, true);

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 380);
  };

  // Sync initial state from DOM attribute or storage (defaults to light mode with pastel gradient)
  const activeTheme = document.documentElement.getAttribute('data-theme') || (getStoredTheme() === 'dark' ? 'dark' : 'light');
  setTheme(activeTheme, false);

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  if (mobileThemeBtn) {
    mobileThemeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  }

  // Respond to OS system theme changes if user hasn't set an explicit preference
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'light' : 'dark', false);
      }
    });
  } catch (e) {}

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

  // Close mobile menu when resized to desktop viewport
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992 && hamburger && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

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
    product: [
      'Figma', 'UX Research', 'User Flows', 'Wireframing',
      'Design Systems', 'Interactive Prototyping', 'Usability Testing', 'Information Architecture'
    ],
    brand: [
      'Visual Identity', 'Typography Systems', 'Editorial Layout', 'Packaging Design',
      'Brand Strategy', 'Logo Systems', 'Advertising Creatives', 'Art Direction'
    ],
    dev: [
      'HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Responsive Design',
      'DOM Manipulation', 'Bootstrap', 'Sass', 'Browser DevTools'
    ],
    ai: [
      'After Effects', 'Blender', 'Three.js', 'Spline 3D', 'Cursor',
      'Claude Code', 'Antigravity', 'Midjourney', 'Firefly', 'ChatGPT'
    ]
  };

  const renderChips = (key, containerId) => {
    const el = document.getElementById(containerId);
    if (!el || !toolsData[key]) return;
    if (el.children.length === 0) {
      el.innerHTML = toolsData[key]
        .map((name, i) => `<span class="chip chip--${key}" style="transition-delay: ${(i * 28) + 120}ms">${name}</span>`)
        .join('');
    } else {
      Array.from(el.children).forEach((child, i) => {
        child.style.transitionDelay = `${(i * 28) + 120}ms`;
      });
    }
  };

  renderChips('product', 'chips-product');
  renderChips('brand', 'chips-brand');
  renderChips('dev', 'chips-dev');
  renderChips('ai', 'chips-ai');

  /* ============================================
     5b. PROBLEM SOLVING PROCESS CAROUSEL
         (Sidewise movement after loading)
     ============================================ */
  const processWrapper = document.getElementById('process-carousel-wrapper');
  const processTrack = document.getElementById('process-carousel-track');
  const processToggleBtn = document.getElementById('process-toggle-btn');
  const processPrevBtn = document.getElementById('process-prev-btn');
  const processNextBtn = document.getElementById('process-next-btn');
  const processStatusBadge = document.getElementById('process-movement-status');
  const processStatusText = document.getElementById('process-status-text');

  if (processWrapper && processTrack) {
    const originalCards = Array.from(processTrack.children);
    const cardCount = originalCards.length;

    // Clone cards for seamless infinite horizontal scrolling
    originalCards.forEach(card => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button, a').forEach(el => el.setAttribute('tabindex', '-1'));
      processTrack.appendChild(clone);
    });

    let isMoving = false;
    let isUserPaused = false;
    let isHovered = false;
    let isInteracting = false;
    let interactionTimeout = null;
    const scrollSpeed = 0.75; // pixels per animation frame
    let animFrameId = null;

    // Calculate the distance before wrap-around
    const getResetDistance = () => {
      if (processTrack.children.length > cardCount) {
        const seventhCard = processTrack.children[cardCount];
        return seventhCard.offsetLeft - originalCards[0].offsetLeft;
      }
      return processTrack.scrollWidth / 2;
    };

    const getCardStepWidth = () => {
      if (originalCards.length > 1) {
        return originalCards[1].offsetLeft - originalCards[0].offsetLeft;
      }
      return 251;
    };

    const updateStatusUI = () => {
      if (!processStatusBadge || !processStatusText) return;
      if (isUserPaused) {
        processStatusBadge.classList.add('is-paused');
        processStatusText.textContent = 'Paused';
        if (processToggleBtn) {
          const pauseIcon = processToggleBtn.querySelector('.icon-pause');
          const playIcon = processToggleBtn.querySelector('.icon-play');
          if (pauseIcon) pauseIcon.style.display = 'none';
          if (playIcon) playIcon.style.display = 'block';
          processToggleBtn.setAttribute('aria-label', 'Resume automatic movement');
        }
      } else if (isHovered || isInteracting) {
        processStatusBadge.classList.add('is-paused');
        processStatusText.textContent = isInteracting ? 'Scrolling' : 'Hovered';
        if (processToggleBtn) {
          const pauseIcon = processToggleBtn.querySelector('.icon-pause');
          const playIcon = processToggleBtn.querySelector('.icon-play');
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (playIcon) playIcon.style.display = 'none';
          processToggleBtn.setAttribute('aria-label', 'Pause automatic movement');
        }
      } else {
        processStatusBadge.classList.remove('is-paused');
        processStatusText.textContent = 'Moving sidewise';
        if (processToggleBtn) {
          const pauseIcon = processToggleBtn.querySelector('.icon-pause');
          const playIcon = processToggleBtn.querySelector('.icon-play');
          if (pauseIcon) pauseIcon.style.display = 'block';
          if (playIcon) playIcon.style.display = 'none';
          processToggleBtn.setAttribute('aria-label', 'Pause automatic movement');
        }
      }
    };

    const stepMovement = () => {
      if (isMoving && !isUserPaused && !isHovered && !isInteracting) {
        processWrapper.scrollLeft += scrollSpeed;
        const resetDistance = getResetDistance();
        if (processWrapper.scrollLeft >= resetDistance) {
          processWrapper.scrollLeft -= resetDistance;
        }
      }
      animFrameId = requestAnimationFrame(stepMovement);
    };

    const startSidewiseMovement = () => {
      if (prefersReducedMotion) {
        if (processStatusBadge) processStatusBadge.style.display = 'none';
        return;
      }
      processTrack.classList.add('process-cards--loaded');
      document.querySelector('.process-section')?.classList.add('is-revealed');
      isMoving = true;
      updateStatusUI();
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(stepMovement);
      }
    };

    // Trigger sidewise movement after page loading
    if (prefersReducedMotion || !document.getElementById('page-loader')) {
      setTimeout(startSidewiseMovement, 400);
    } else {
      window.addEventListener('page-ready', () => {
        setTimeout(startSidewiseMovement, 200);
      }, { once: true });
      // Fallback
      setTimeout(startSidewiseMovement, 1800);
    }

    // Hover & focus handling (pause on hover/focus so user can read)
    processWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
      updateStatusUI();
    });

    processWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      updateStatusUI();
    });

    processWrapper.addEventListener('focusin', () => {
      isHovered = true;
      updateStatusUI();
    });

    processWrapper.addEventListener('focusout', () => {
      isHovered = false;
      updateStatusUI();
    });

    // Pause / Play toggle button
    if (processToggleBtn) {
      processToggleBtn.addEventListener('click', () => {
        isUserPaused = !isUserPaused;
        updateStatusUI();
      });
    }

    // Manual navigation buttons (Previous & Next step)
    const handleManualScroll = (direction) => {
      isInteracting = true;
      updateStatusUI();
      clearTimeout(interactionTimeout);

      const step = getCardStepWidth();
      processWrapper.scrollBy({
        left: direction * step,
        behavior: 'smooth'
      });

      interactionTimeout = setTimeout(() => {
        isInteracting = false;
        const resetDistance = getResetDistance();
        if (processWrapper.scrollLeft >= resetDistance) {
          processWrapper.scrollLeft -= resetDistance;
        } else if (processWrapper.scrollLeft < 0) {
          processWrapper.scrollLeft += resetDistance;
        }
        updateStatusUI();
      }, 1000);
    };

    if (processPrevBtn) {
      processPrevBtn.addEventListener('click', () => handleManualScroll(-1));
    }

    if (processNextBtn) {
      processNextBtn.addEventListener('click', () => handleManualScroll(1));
    }

    // Pointer Drag Support (Mouse & Touch)
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    processWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      isInteracting = true;
      startX = e.pageX - processWrapper.offsetLeft;
      scrollStart = processWrapper.scrollLeft;
      updateStatusUI();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - processWrapper.offsetLeft;
      const walk = (x - startX) * 1.3;
      processWrapper.scrollLeft = scrollStart - walk;
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isInteracting = false;
        const resetDistance = getResetDistance();
        if (processWrapper.scrollLeft >= resetDistance) {
          processWrapper.scrollLeft -= resetDistance;
        } else if (processWrapper.scrollLeft < 0) {
          processWrapper.scrollLeft += resetDistance;
        }
        updateStatusUI();
      }, 600);
    };

    window.addEventListener('mouseup', endDrag);

    // Touch events
    processWrapper.addEventListener('touchstart', () => {
      isInteracting = true;
      updateStatusUI();
    }, { passive: true });

    processWrapper.addEventListener('touchend', () => {
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        isInteracting = false;
        const resetDistance = getResetDistance();
        if (processWrapper.scrollLeft >= resetDistance) {
          processWrapper.scrollLeft -= resetDistance;
        } else if (processWrapper.scrollLeft < 0) {
          processWrapper.scrollLeft += resetDistance;
        }
        updateStatusUI();
      }, 800);
    }, { passive: true });
  }

  /* ============================================
     6. PROJECTS DATA (Strictly per user specified list)
     ============================================ */
  const projects = [
    // ============================================
    // SECTION 1: BRANDING (5 Projects)
    // a. Triveda
    // b. Mittika
    // c. Wave
    // d. ForgeOS
    // e. Ecovolt
    // ============================================
    {
      id: 'triveda-brand',
      featured: true,
      category: 'brand-identity',
      title: 'Triveda',
      discipline: 'Brand Strategy & Visual Identity',
      client: 'Triveda Wellness',
      role: 'Lead Brand Identity Designer',
      tagline: 'Holistic Ayurvedic wellness brand: visual strategy, sacred geometry wordmark, typography system, and packaging suites.',
      description: 'Comprehensive brand identity: visual strategy, logo system, typography, packaging, and brand guidelines.',
      challenge: 'Standing out in a saturated health and wellness market crowded with generic green leaf motifs and uninspired medical branding.',
      solution: 'Built an elevated visual identity anchored in sacred geometry, timeless serif typography, warm botanical greens, and copper foil accents.',
      deliverables: [
        'Complete brand strategy & positioning document',
        'Primary, secondary, and sub-mark logo lockups',
        'Bespoke typography hierarchy & color swatches',
        '80-page brand guidelines & packaging system'
      ],
      tools: ['Illustrator', 'InDesign', 'Photoshop', 'Brand Strategy', 'Logo Design'],
      thumbnail: 'assets/projects/triveda-brand.jpg',
      link: '#'
    },
    {
      id: 'mittika-brand',
      featured: true,
      category: 'brand-identity',
      title: 'Mittika',
      discipline: 'Visual Identity & Cultural Branding',
      client: 'Mittika Handlooms',
      role: 'Brand Identity Designer',
      tagline: 'Artisanal Indian fabric brand: earthen palette, loom-inspired symbol, packaging, and artisan-story stationery system.',
      description: 'Full branding for an Indian artisanal fabric wear brand: logo design, terracotta palette, and physical packaging suite.',
      challenge: 'Balancing centuries-old Indian handloom weaving heritage with clean contemporary international retail standards.',
      solution: 'Designed an elegant geometric logo inspired by warp-and-weft loom shuttles, paired with terracotta, indigo, and unbleached cotton color tokens.',
      deliverables: [
        'Shuttle-inspired primary logo & artisan seal',
        'Terracotta, indigo, and ivory color system',
        'Seed-paper clothing tags & recycled bags',
        'Comprehensive brand guidelines manual'
      ],
      tools: ['Illustrator', 'Figma', 'InDesign', 'Visual Identity', 'Typography'],
      thumbnail: 'assets/projects/mittika-brand.jpg',
      link: '#'
    },
    {
      id: 'wave-brand',
      category: 'brand-identity',
      title: 'Wave',
      discipline: 'Event Branding & Kinetic Identity',
      client: 'Wave Live Entertainment',
      role: 'Brand Designer & Art Director',
      tagline: 'Live music & cultural festival brand: dynamic audio-reactive wordmark, neon palette, festival stage credentials, and signage.',
      description: 'Brand identity system for a 3-day music and arts festival: typography, visual motifs, and large-format environmental signage.',
      challenge: 'Creating a unified visual system that scales effortlessly from tiny digital wristband QR codes to 40-foot main stage LED displays.',
      solution: 'Devised a kinetic, wave-modulated typography system that expands and contracts based on acoustic frequency inputs.',
      deliverables: [
        'Kinetic responsive logo system & wordmark',
        'Stage signage, wristbands, and festival passes',
        'Animated motion graphics for stage backdrops',
        'Digital promotional & artist announcement kits'
      ],
      tools: ['Illustrator', 'After Effects', 'Photoshop', 'Environmental Branding', 'Motion Design'],
      thumbnail: 'assets/projects/eventmgmt-brand.jpg',
      link: '#'
    },
    {
      id: 'forgeos-brand',
      category: 'brand-identity',
      title: 'ForgeOS',
      discipline: 'Industrial Tech Brand Identity',
      client: 'ForgeOS Automation Labs',
      role: 'Brand Designer',
      tagline: 'Industrial IoT & MES automation brand: technical logotype, component iconography, and engineering collateral system.',
      description: 'Enterprise brand identity for a manufacturing execution software startup: logo, icon system, and design language.',
      challenge: 'Communicating rugged reliability and sub-millisecond precision to conservative enterprise manufacturing leaders.',
      solution: 'Created an anvil-inspired geometric hex-monogram, engineered high-legibility monospace and sans-serif pairings, and built an industrial UI token palette.',
      deliverables: [
        'Hex-monogram primary logo & software icon',
        'Monospace technical typography system',
        'Hardware badge & server rack decal standards',
        'Sales enablement deck & technical whitepapers'
      ],
      tools: ['Illustrator', 'Figma', 'Brand Guidelines', 'Technical Branding', 'Typography'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-brand',
      category: 'brand-identity',
      title: 'EcoVolt',
      discipline: 'CleanTech Brand & Visual Systems',
      client: 'EcoVolt Clean Energy',
      role: 'Brand Identity Designer',
      tagline: 'Smart solar & clean energy brand: geometric sunburst logomark, corporate typography, vehicle fleet wraps, and signage.',
      description: 'Clean energy technology branding: logo system, brand architecture, corporate stationery, and digital presence.',
      challenge: 'Positioning a solar technology provider as an approachable consumer lifestyle brand rather than an industrial utility contractor.',
      solution: 'Formulated a bright, optimism-focused identity pairing deep obsidian navy with electric solar amber and refined neo-grotesque typography.',
      deliverables: [
        'Geometric sunburst logo & responsive variants',
        'Corporate stationery, business cards & letterheads',
        'Vehicle fleet wrap livery & field technician uniforms',
        'Digital brand guidelines & social templates'
      ],
      tools: ['Illustrator', 'InDesign', 'Photoshop', 'Brand Architecture', 'Fleet Livery'],
      thumbnail: 'assets/projects/ecovolt-brand.jpg',
      link: '#'
    },

    // ============================================
    // SECTION 2: UX RESEARCH & UI DESIGN (6 Projects)
    // a. Mittika -> App & Landing Page
    // b. Nuvera -> App & Landing Page
    // c. Ecovolt -> App & Landing Page
    // d. Triveda -> App & Landing Page
    // e. Aerobharat -> 3D + Planner
    // f. ForgeOS -> Landing page Webflow
    // ============================================
    {
      id: 'mittika-ux',
      category: 'product-design',
      title: 'Mittika',
      discipline: 'UX Research & UI Design (App & Landing Page)',
      client: 'Mittika Handlooms',
      role: 'Product & UI Designer',
      tagline: 'Artisanal e-commerce mobile app and responsive landing page: craft origin discovery, weaver stories, and sizing recommendations.',
      description: 'End-to-end UX research and interface design for Mittika mobile app and responsive brand landing page.',
      challenge: 'High cart abandonment on mobile due to uncertain fabric drape visualization and standard size chart confusion.',
      solution: 'Conducted user interviews, designed an "Artisan Origin" responsive landing page, interactive fabric drape video zoom, and a personalized 3-question sizing flow.',
      deliverables: [
        'User research synthesis & persona journey maps',
        'Mobile e-commerce iOS/Android app UI (40+ screens)',
        'High-converting responsive landing page in Figma',
        'Figma design system with reusable components'
      ],
      tools: ['Figma', 'UX Research', 'User Flows', 'Mobile UI', 'Prototyping'],
      thumbnail: 'assets/projects/mittika-ux.jpg',
      link: '#'
    },
    {
      id: 'nuvera-ux',
      featured: true,
      category: 'product-design',
      title: 'Nuvera',
      discipline: 'UX Research & UI Design (App & Landing Page)',
      client: 'Nuvera Health Science',
      role: 'Lead Product & UI Designer',
      tagline: 'Digital health biomarker tracking app and clinical landing page: personalized supplement regimens and test-kit onboarding.',
      description: 'Clinical UX research, patient mental modeling, and interface design for Nuvera mobile app and high-converting marketing landing page.',
      challenge: 'Users felt overwhelmed by complex lab test biomarker values and frequently discontinued personalized supplement routines after 30 days.',
      solution: 'Mapped user mental models through 14 interviews, designed a simplified "Biological Vitality Score", streamlined test-kit onboarding, and built an automated adherence reminder flow.',
      deliverables: [
        '14 user interviews & clinical mental model mapping',
        'Personalized biomarker tracking app prototype',
        'Scientific clinical validation landing page',
        'Figma design system with 40+ WCAG AA components'
      ],
      tools: ['Figma', 'UX Research', 'User Flows', 'Design Systems', 'Interactive Prototyping'],
      thumbnail: 'assets/projects/nuvera.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-ux',
      category: 'product-design',
      title: 'EcoVolt',
      discipline: 'UX Research & UI Design (App & Landing Page)',
      client: 'EcoVolt Energy Systems',
      role: 'Lead UI/UX Designer',
      tagline: 'Residential solar telemetry app and conversion landing page: live generation flows, battery forecasting, and grid feed analytics.',
      description: 'UX research, telemetry information architecture, and UI design for EcoVolt solar monitoring mobile app and homeowner landing page.',
      challenge: 'Homeowners found electrical engineering units (kWh, peak voltage, inverter phase) confusing and could not tell if their solar panels were operating optimally.',
      solution: 'Synthesized telemetry into intuitive financial savings metrics, designed an interactive sun-to-home power graphic, and created a high-converting landing page.',
      deliverables: [
        'User surveys & telemetry mental model research',
        'Residential solar telemetry mobile app UI',
        'High-conversion solar homeowner landing page',
        'Interactive energy savings simulator prototype'
      ],
      tools: ['Figma', 'Data Visualization', 'Information Architecture', 'Prototyping', 'User Testing'],
      thumbnail: 'assets/projects/ecovolt-web.jpg',
      link: '#'
    },
    {
      id: 'triveda-ux',
      category: 'product-design',
      title: 'Triveda',
      discipline: 'UX Research & UI Design (App & Landing Page)',
      client: 'Triveda Wellness',
      role: 'UX Researcher & UI Designer',
      tagline: 'Ayurvedic wellness mobile app and storytelling landing page: interactive Dosha quiz, botanical apothecary, and subscription flow.',
      description: 'UX research, lifestyle assessment quiz design, and UI screens for Triveda wellness mobile app and editorial landing page.',
      challenge: 'New customers were unfamiliar with Ayurvedic principles and felt lost when trying to select the right herbal formulation for their body type.',
      solution: 'Conducted contextual inquiry interviews, designed a guided 60-second Dosha lifestyle questionnaire, and paired it with a serene editorial storytelling landing page.',
      deliverables: [
        'Contextual user interviews & Dosha diagnostic flow',
        'Mobile wellness mobile app prototype (iOS/Android)',
        'Editorial botanical storytelling landing page',
        'Component design tokens & microinteraction specs'
      ],
      tools: ['Figma', 'UX Research', 'Wireframing', 'UI Design', 'Design Systems'],
      thumbnail: 'assets/projects/triveda-web.jpg',
      link: '#'
    },
    {
      id: 'aerobharat-ux',
      featured: true,
      category: 'product-design',
      title: 'AeroBharat',
      discipline: 'Product Design & 3D Mission Planner',
      client: 'AeroBharat Robotics',
      role: 'Product & Interaction Designer',
      tagline: 'Industrial drone mission planner and flight path app with interactive 3D waypoint spatial orchestration.',
      description: 'Drone mission control web application and tablet flight planner with interactive 3D spatial survey route simulation.',
      challenge: 'Drone operators faced steep cognitive load when mapping 3D waypoint survey routes over irregular agricultural terrain.',
      solution: 'Conceived a spatial waypoint configuration interface with altitude slider controls, real-time battery consumption simulations, and emergency geofence boundaries.',
      deliverables: [
        'Industrial drone mission planner web app UI',
        'Interactive 3D spatial flight path simulator',
        'Rugged tablet flight controller interface',
        'Figma interaction component library & design system'
      ],
      tools: ['Figma', 'Interaction Design', '3D Spatial UX', 'User Flows', 'Prototyping'],
      thumbnail: 'assets/projects/aerobharat-ux.jpg',
      link: '#'
    },
    {
      id: 'forgeos-ux',
      category: 'product-design',
      title: 'ForgeOS',
      discipline: 'UI/UX Design & Webflow Landing Page',
      client: 'ForgeOS MES Automation',
      role: 'Senior UI Designer & Webflow Developer',
      tagline: 'Enterprise manufacturing SaaS landing page: interactive telemetry preview, Webflow component architecture, and conversion funnel.',
      description: 'UI design, design system tokens, and Webflow landing page for an industrial manufacturing execution software platform.',
      challenge: 'Explaining real-time sub-millisecond CNC telemetry and MES software capabilities to plant managers in an engaging, interactive format.',
      solution: 'Designed a sleek, high-contrast dark theme landing page with live interactive plant line widget previews, custom Webflow interactions, and ROI calculator.',
      deliverables: [
        'Enterprise SaaS landing page architecture',
        'Interactive plant telemetry widget previews',
        'Webflow component system & responsive CMS structure',
        'Handoff design specs & conversion optimization'
      ],
      tools: ['Figma', 'Webflow', 'UI Design', 'Information Architecture', 'Interaction Design'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },

    // ============================================
    // SECTION 3: FRONTEND & DESIGN ENGINEERING (5 Projects)
    // "all same from branding"
    // a. Triveda
    // b. Mittika
    // c. Wave
    // d. ForgeOS
    // e. Ecovolt
    // ============================================
    {
      id: 'triveda-web',
      featured: true,
      category: 'web-dev',
      title: 'Triveda',
      discipline: 'Responsive Web & E-Commerce',
      client: 'Triveda Wellness',
      role: 'Frontend Developer & Designer',
      tagline: 'High-performance botanical e-commerce site with interactive ingredient apothecary and responsive cart.',
      description: 'Interactive botanical e-commerce frontend built with semantic HTML5, modern CSS layouts, and vanilla JS.',
      challenge: 'Creating a fast-loading, serene e-commerce storefront with complex ingredient filtering without bloated framework overhead.',
      solution: 'Developed semantic, zero-dependency HTML5/CSS3 components with a custom vanilla JavaScript filter engine, lazy-loaded media, and WCAG AA compliance.',
      deliverables: [
        'Fully responsive storefront & product catalog',
        'Interactive herbal apothecary ingredient filter',
        'Accessible drawer cart with state management',
        '100/100 Lighthouse performance optimization'
      ],
      tools: ['HTML5', 'CSS3 Layouts', 'Vanilla JS', 'WCAG AA', 'Responsive Design'],
      thumbnail: 'assets/projects/triveda-web.jpg',
      link: '#'
    },
    {
      id: 'mittika-web',
      category: 'web-dev',
      title: 'Mittika',
      discipline: 'Frontend Development & Tailwind CSS',
      client: 'Mittika Handlooms',
      role: 'Frontend Developer',
      tagline: 'Artisanal fabric-wear web store featuring interactive textile filter, dynamic cart, and responsive lookbook.',
      description: 'Component-driven web store prototype with fluid responsive layouts, microinteractions, and optimized image loading.',
      challenge: 'Implementing high-density editorial image layouts with instant search and filter response times on mobile networks.',
      solution: 'Used Tailwind CSS utility tokens for lean CSS output, progressive JPEG loading, and asynchronous client-side filtering.',
      deliverables: [
        'Tailwind CSS design token implementation',
        'Interactive fabric swatch selector & cart',
        'Responsive editorial lookbook grid',
        'Cross-browser tested mobile navigation'
      ],
      tools: ['Tailwind CSS', 'JavaScript', 'HTML5', 'Mobile Optimization', 'Component Architecture'],
      thumbnail: 'assets/projects/mittika-web.jpg',
      link: '#'
    },
    {
      id: 'wave-web',
      category: 'web-dev',
      title: 'Wave',
      discipline: 'Interactive Web & Event Prototype',
      client: 'Wave Live Entertainment',
      role: 'Frontend Developer',
      tagline: 'Music festival microsite: dynamic lineup schedule, artist audio preview cards, and ticket checkout UI.',
      description: 'High-energy event microsite with interactive day/stage schedule switcher and ticket tier selector.',
      challenge: 'Rendering dense festival timetables with multiple overlapping stages while maintaining effortless single-thumb mobile usability.',
      solution: 'Architected a horizontally scrolling timetable with sticky time markers, instant artist preview drawers, and zero layout shift.',
      deliverables: [
        'Interactive stage & timetable filter engine',
        'Audio clip preview player with custom controls',
        'Multi-tier ticket checkout modal flow',
        'Performance-tuned CSS animations'
      ],
      tools: ['HTML5', 'CSS3 Grid/Flexbox', 'Vanilla JavaScript', 'Event UI', 'DOM Manipulation'],
      thumbnail: 'assets/projects/eventmgmt-web.jpg',
      link: '#'
    },
    {
      id: 'forgeos-web',
      featured: true,
      category: 'web-dev',
      title: 'ForgeOS',
      discipline: 'Webflow & Frontend Development',
      client: 'ForgeOS Automation Labs',
      role: 'Frontend & Design Engineer',
      tagline: 'Interactive Webflow marketing site: live telemetry simulation, dark mode UI tokens, and AI-paired custom code interactions.',
      description: 'High-performance enterprise landing page with interactive machine state simulators built with Webflow and custom JavaScript.',
      challenge: 'Embedding responsive, animated plant machine telemetry previews inside a Webflow production site with sub-second load times.',
      solution: 'Developed custom lightweight JavaScript widgets paired with Webflow CMS collections, optimized CSS variables, and clean responsive grid layouts.',
      deliverables: [
        'Production Webflow site structure & custom code embeds',
        'Interactive plant machine telemetry demo widget',
        'Responsive CSS token system & dark theme variables',
        'SEO-optimized semantic DOM structure'
      ],
      tools: ['Webflow', 'JavaScript', 'CSS3', 'Design Engineering', 'Interactive UI'],
      thumbnail: 'assets/projects/saas-landing-ux.jpg',
      link: '#'
    },
    {
      id: 'ecovolt-web',
      category: 'web-dev',
      title: 'EcoVolt',
      discipline: 'Web Development & Solar Calculator',
      client: 'EcoVolt Clean Energy',
      role: 'Frontend Developer & Designer',
      tagline: 'Interactive solar savings calculator: dynamic bill estimation, battery capacity simulation, and lead generation.',
      description: 'Solar energy web application featuring a client-side ROI calculator, interactive sliders, and animated telemetry diagrams.',
      challenge: 'Allowing homeowners to calculate complex tiered electricity tariffs and solar payback periods in real time without page refreshes.',
      solution: 'Wrote a responsive JavaScript financial calculation engine that updates projected 20-year savings graphs dynamically as users slide their monthly electricity bill.',
      deliverables: [
        'Interactive solar ROI & payback slider tool',
        'Real-time SVG energy generation chart',
        'Validated solar installation consultation form',
        'Responsive clean energy marketing pages'
      ],
      tools: ['JavaScript', 'CSS3 Variables', 'HTML5', 'Form Validation', 'SVG Data Charts'],
      thumbnail: 'assets/projects/ecovolt-web.jpg',
      link: '#'
    }
  ];

  const categoryLabels = {
    'all': 'All Featured',
    'product-design': 'Product & UI/UX Design',
    'brand-identity': 'Brand Identity & Packaging',
    'web-dev': 'Frontend & Design Engineering'
  };

  /* ============================================
     7. PROJECT RENDERING + TAB FILTERING
     ============================================ */
  const projectsGrid = document.getElementById('projects-grid');

  const buildCardHTML = (p, idx = 0) => {
    const toolTags = p.tools.slice(0, 4)
      .map(t => `<span class="project-card__tool-tag">${t}</span>`)
      .join('');

    const categoryLabel = categoryLabels[p.category] || 'Featured Project';
    const domainText = p.discipline || p.client || categoryLabel;
    const summaryText = p.tagline || p.description;

    return `
      <div class="project-card project-card--visible project-card--revealed" data-category="${p.category}" data-id="${p.id}" style="transition-delay: ${idx * 65}ms">
        <div class="project-card__inner">
          <div class="project-card__front">
            <img src="${p.thumbnail}" alt="${p.title} — ${categoryLabel}" loading="lazy" decoding="async" width="400" height="300">
            <div class="project-card__front-overlay">
              <span class="project-card__front-badge">${categoryLabel}</span>
              <span class="project-card__front-title">${p.title}</span>
            </div>
          </div>
          <div class="project-card__back">
            <div class="project-card__badge-row">
              <span class="project-card__category">${categoryLabel}</span>
              <span class="project-card__domain">${domainText}</span>
            </div>
            <h3 class="project-card__title">${p.title}</h3>
            <p class="project-card__desc">${summaryText}</p>
            <div class="project-card__tools">${toolTags}</div>
            <div class="project-card__actions">
              <a href="#case-${p.id}" class="project-card__link" data-id="${p.id}" aria-label="View case study for ${p.title}">
                <span>View Case Study</span>
                <span class="arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  };

  const renderProjects = (category = 'all') => {
    if (!projectsGrid) return;

    const filtered = (category === 'all')
      ? projects.filter(p => p.featured)
      : projects.filter(p => p.category === category);
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
     7c. CASE STUDY DETAIL MODAL
     ============================================ */
  const caseModal = document.getElementById('case-modal');
  const caseModalOverlay = document.getElementById('case-modal-overlay');
  const caseModalClose = document.getElementById('case-modal-close');
  const caseModalBody = document.getElementById('case-modal-body');
  let lastFocusedElement = null;

  const openCaseModal = (projectId) => {
    if (!caseModal || !caseModalBody) return;
    const p = projects.find(item => item.id === projectId);
    if (!p) return;

    lastFocusedElement = document.activeElement;

    const deliverablesList = (p.deliverables && p.deliverables.length > 0)
      ? p.deliverables.map(d => `<li class="case-modal__deliverable-item">${d}</li>`).join('')
      : `<li class="case-modal__deliverable-item">Strategy &amp; Visual Design System</li>`;

    const toolChips = p.tools
      .map(t => `<span class="case-modal__tool-chip">${t}</span>`)
      .join('');

    const categoryName = categoryLabels[p.category] || 'Design Practice';

    caseModalBody.innerHTML = `
      <header class="case-modal__header">
        <div class="case-modal__meta">
          <span class="case-modal__badge">${p.client || categoryName}</span>
          <span class="case-modal__discipline">${p.discipline || categoryName}</span>
        </div>
        <h2 class="case-modal__title" id="modal-project-title">${p.title}</h2>
        <p class="case-modal__tagline">${p.tagline || p.description}</p>
      </header>

      <img class="case-modal__hero-img" src="${p.thumbnail}" alt="${p.title} showcase" loading="eager">

      <div class="case-modal__grid">
        <div class="case-modal__main">
          <div class="case-modal__section">
            <h3 class="case-modal__h3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              The Challenge &amp; Context
            </h3>
            <p class="case-modal__p">${p.challenge || p.description}</p>
          </div>
          <div class="case-modal__section">
            <h3 class="case-modal__h3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              The Strategic Solution &amp; Craft
            </h3>
            <p class="case-modal__p">${p.solution || p.description}</p>
          </div>
        </div>

        <aside class="case-modal__sidebar">
          <div class="case-modal__meta-group">
            <span class="case-modal__meta-label">Role</span>
            <span class="case-modal__meta-value">${p.role || 'Multidisciplinary Designer'}</span>
          </div>
          <div class="case-modal__meta-group">
            <span class="case-modal__meta-label">Primary Discipline</span>
            <span class="case-modal__meta-value">${categoryName}</span>
          </div>
          <div class="case-modal__meta-group">
            <span class="case-modal__meta-label">Key Deliverables</span>
            <ul class="case-modal__deliverables">
              ${deliverablesList}
            </ul>
          </div>
          <div class="case-modal__meta-group">
            <span class="case-modal__meta-label">Tools &amp; Capabilities</span>
            <div class="case-modal__tools-chips">
              ${toolChips}
            </div>
          </div>
        </aside>
      </div>

      <div class="case-modal__footer">
        <a href="#contact" class="btn btn--primary" id="modal-contact-btn">Discuss a Similar Project &rarr;</a>
      </div>
    `;

    caseModal.classList.add('case-modal--open');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Wire contact CTA inside modal
    const modalContactBtn = document.getElementById('modal-contact-btn');
    if (modalContactBtn) {
      modalContactBtn.addEventListener('click', () => {
        closeCaseModal();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          setTimeout(() => {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      });
    }

    setTimeout(() => {
      if (caseModalClose) caseModalClose.focus();
    }, 100);
  };

  const closeCaseModal = () => {
    if (!caseModal) return;
    caseModal.classList.remove('case-modal--open');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  };

  if (caseModalClose) {
    caseModalClose.addEventListener('click', closeCaseModal);
  }

  if (caseModalOverlay) {
    caseModalOverlay.addEventListener('click', closeCaseModal);
  }

  document.addEventListener('keydown', (e) => {
    if (!caseModal || !caseModal.classList.contains('case-modal--open')) return;

    if (e.key === 'Escape') {
      closeCaseModal();
      return;
    }

    // Accessible focus trapping inside modal
    if (e.key === 'Tab') {
      const focusable = caseModal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ============================================
     7b. STACKED DECK INTERACTION & VIEW TOGGLE
     ============================================ */
  const btnViewDeck = document.getElementById('btn-view-deck');
  const btnViewGrid = document.getElementById('btn-view-grid');
  const projectsStage = document.getElementById('projects-stage');
  const projectsSection = document.getElementById('work') || document.querySelector('.projects');
  let isDeckMode = false; // default to expanded grid / bento view
  let stageTransitionTimer = null;
  let justStackedCooldown = false;

  const updateDeckStackCoordinates = () => {
    if (!projectsGrid) return;
    const cards = projectsGrid.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    // Center of grid container horizontally
    const gridW = projectsGrid.clientWidth;
    const centerX = gridW / 2;

    const firstCard = cards[0];
    const cardW = firstCard.offsetWidth || (gridW > 768 ? (gridW - 64) / 3 : gridW);
    const cardH = firstCard.offsetHeight || (cardW * 0.75);

    // Position deck compactly near the top of the stage just below the hint badge
    const isSmallScreen = window.innerWidth < 640;
    const deckTop = isSmallScreen ? 24 : 28;
    const centerY = deckTop + cardH / 2;
    const deckStageH = Math.ceil(deckTop + cardH + (isSmallScreen ? 14 : 18));

    const rotations = [-4.5, 3.8, -2.6, 4.2, -3.2, 2.5, -4.0, 3.0, -1.8];

    cards.forEach((card, index) => {
      // Find the card's center relative to projectsGrid
      const cW = card.offsetWidth || cardW;
      const cH = card.offsetHeight || cardH;
      const cardCenterX = card.offsetLeft + cW / 2;
      const cardCenterY = card.offsetTop + cH / 2;

      const dx = centerX - cardCenterX;
      const dy = centerY - cardCenterY;
      const rot = rotations[index % rotations.length];
      const zIndex = cards.length - index;

      card.style.setProperty('--stack-x', `${dx.toFixed(1)}px`);
      card.style.setProperty('--stack-y', `${dy.toFixed(1)}px`);
      card.style.setProperty('--stack-rot', `${rot}deg`);
      card.style.setProperty('--stack-z', `${zIndex + 2}`);
      card.style.setProperty('--deal-delay', `${index * 45}ms`);
    });

    if (projectsStage) {
      projectsStage.style.setProperty('--deck-stage-h', `${deckStageH}px`);
      if (isDeckMode) {
        projectsStage.style.height = `${deckStageH}px`;
      }
    }
  };

  const expandDeck = () => {
    if (!projectsGrid) return;
    clearTimeout(stageTransitionTimer);
    isDeckMode = false;

    if (projectsSection) {
      projectsSection.classList.remove('is-deck-mode');
    }

    if (projectsStage) {
      if (prefersReducedMotion) {
        projectsStage.style.height = 'auto';
        projectsStage.classList.remove('is-stacked');
      } else {
        const currentH = projectsStage.offsetHeight;
        // Temporarily remove is-stacked from stage so we can measure full natural grid height
        projectsStage.classList.remove('is-stacked');
        const targetH = projectsGrid.scrollHeight;

        projectsStage.style.height = `${currentH}px`;
        void projectsStage.offsetHeight; // force reflow
        projectsStage.style.height = `${targetH}px`;

        stageTransitionTimer = setTimeout(() => {
          if (!isDeckMode && projectsStage) {
            projectsStage.style.height = 'auto';
          }
        }, 460);
      }
    }

    projectsGrid.classList.remove('is-stacked');

    if (btnViewGrid && btnViewDeck) {
      btnViewGrid.classList.add('view-toggle__btn--active');
      btnViewGrid.setAttribute('aria-pressed', 'true');
      btnViewDeck.classList.remove('view-toggle__btn--active');
      btnViewDeck.setAttribute('aria-pressed', 'false');
    }
  };

  const stackDeck = () => {
    if (!projectsGrid) return;
    clearTimeout(stageTransitionTimer);
    isDeckMode = true;
    justStackedCooldown = true;
    setTimeout(() => { justStackedCooldown = false; }, 800);

    if (projectsSection) {
      projectsSection.classList.add('is-deck-mode');
    }

    const cards = projectsGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.style.transitionDelay = '0ms';
    });

    if (projectsStage) {
      const currentH = projectsStage.offsetHeight;
      projectsStage.style.height = `${currentH}px`;
      void projectsStage.offsetHeight;
    }

    updateDeckStackCoordinates();

    projectsGrid.classList.add('is-stacked');
    if (projectsStage) {
      projectsStage.classList.add('is-stacked');
    }

    if (btnViewGrid && btnViewDeck) {
      btnViewDeck.classList.add('view-toggle__btn--active');
      btnViewDeck.setAttribute('aria-pressed', 'true');
      btnViewGrid.classList.remove('view-toggle__btn--active');
      btnViewGrid.setAttribute('aria-pressed', 'false');
    }
  };

  // View toggle button click handlers
  if (btnViewDeck) {
    btnViewDeck.addEventListener('click', (e) => {
      e.preventDefault();
      stackDeck();
    });
  }

  if (btnViewGrid) {
    btnViewGrid.addEventListener('click', (e) => {
      e.preventDefault();
      expandDeck();
    });
  }

  // Floating hint badge interactions
  const deckHint = document.getElementById('projects-deck-hint');
  if (deckHint) {
    deckHint.addEventListener('mouseenter', () => {
      if (projectsGrid && projectsGrid.classList.contains('is-stacked') && !justStackedCooldown) {
        expandDeck();
      }
    });
    deckHint.addEventListener('click', () => {
      if (projectsGrid && projectsGrid.classList.contains('is-stacked')) {
        expandDeck();
      }
    });
  }

  // Touch-to-flip support & tap to expand deck
  if (projectsGrid) {
    projectsGrid.addEventListener('click', (e) => {
      if (projectsGrid.classList.contains('is-stacked')) {
        expandDeck();
        return;
      }

      const card = e.target.closest('.project-card');
      if (!card) return;

      // If clicking a case study link, open the comprehensive case study modal
      const caseLink = e.target.closest('.project-card__link');
      if (caseLink) {
        e.preventDefault();
        const id = caseLink.getAttribute('data-id');
        if (id) openCaseModal(id);
        return;
      }

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

  /* =========================================================
     CYPHEIR CARD UI MOTION & INTERACTION ENGINE
     (Inspired by Abron Studio's Cypheir Card UI Animation)
     ========================================================= */
  const cypheirCards = document.querySelectorAll('.dev-card.cypheir-card');
  
  // 1. Lerped 3D Perspective Tilt Physics Engine
  cypheirCards.forEach(card => {
    let bounds = null;
    let animId = null;
    let isHovered = false;

    let currentRotX = 0, currentRotY = 0;
    let targetRotX = 0, targetRotY = 0;
    let currentGlareX = 50, currentGlareY = 50;
    let targetGlareX = 50, targetGlareY = 50;

    const updatePhysics = () => {
      if (prefersReducedMotion) return;

      // Smooth linear interpolation (lerp factor 0.12 for luxury weighted feel)
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      currentGlareX += (targetGlareX - currentGlareX) * 0.15;
      currentGlareY += (targetGlareY - currentGlareY) * 0.15;

      card.style.setProperty('--tilt-x', `${currentRotX.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${currentRotY.toFixed(2)}deg`);
      card.style.setProperty('--mouse-x', `${currentGlareX.toFixed(1)}%`);
      card.style.setProperty('--mouse-y', `${currentGlareY.toFixed(1)}%`);

      // Continue animating while hovered or until settled near 0
      const isSettled = Math.abs(targetRotX - currentRotX) < 0.05 && Math.abs(targetRotY - currentRotY) < 0.05;
      if (isHovered || !isSettled) {
        animId = requestAnimationFrame(updatePhysics);
      } else {
        animId = null;
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      }
    };

    const onMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      if (!animId && !prefersReducedMotion) {
        animId = requestAnimationFrame(updatePhysics);
      }
    };

    const onMouseMove = (e) => {
      if (prefersReducedMotion) return;
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Normalize between -1 and 1
      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      // Cypheir signature subtle, high-end 3D tilt (max ±7.5deg)
      targetRotX = -yPct * 7.5;
      targetRotY = xPct * 7.5;

      targetGlareX = (mouseX / bounds.width) * 100;
      targetGlareY = (mouseY / bounds.height) * 100;

      if (!animId) {
        animId = requestAnimationFrame(updatePhysics);
      }
    };

    const onMouseLeave = () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      targetGlareX = 50;
      targetGlareY = 50;
      bounds = null;
    };

    card.addEventListener('mouseenter', onMouseEnter, { passive: true });
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });

  // 2. CARD 1: Interactive Syntax Scanner & Tabs
  const termTabs = document.querySelectorAll('#cypheir-term-1 .cypheir-tab');
  const termPanels = document.querySelectorAll('#cypheir-term-1 .cypheir-code-panel');
  const scanBtn = document.getElementById('cypheir-scan-btn');
  const scanline = document.getElementById('cypheir-scanline-1');
  const status1 = document.getElementById('cypheir-status-1');
  const auditBar1 = document.getElementById('cypheir-audit-bar-1');

  termTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPanel = tab.getAttribute('data-tab');

      termTabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      termPanels.forEach(panel => {
        const isMatch = panel.getAttribute('data-panel') === targetPanel;
        panel.classList.toggle('is-active', isMatch);
        if (isMatch) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', 'true');
        }
      });
    });
  });

  if (scanBtn && scanline) {
    let isScanning = false;
    scanBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isScanning) return;
      isScanning = true;

      scanline.classList.remove('is-scanning');
      // Trigger DOM reflow to restart CSS animation
      void scanline.offsetWidth;
      scanline.classList.add('is-scanning');

      if (status1) {
        status1.textContent = 'SCANNING AST...';
        status1.style.color = 'var(--terracotta)';
      }
      if (auditBar1) {
        auditBar1.classList.remove('is-verified');
      }

      setTimeout(() => {
        scanline.classList.remove('is-scanning');
        isScanning = false;
        if (status1) {
          status1.textContent = 'KERNEL VERIFIED';
          status1.style.color = '#FAF4EA';
        }
        if (auditBar1) {
          auditBar1.classList.add('is-verified');
        }
      }, 1250);
    });
  }

  // 3. CARD 2: Cypheir 3D Layered Component Stack
  const stackTabs = document.querySelectorAll('.cypheir-stack-tab');
  const stackPlates = document.querySelectorAll('.cypheir-plate');

  const reorderStack = (activeIdx) => {
    stackTabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === activeIdx);
    });

    stackPlates.forEach((plate, i) => {
      // Clear classes
      plate.classList.remove('cypheir-plate--0', 'cypheir-plate--1', 'cypheir-plate--2', 'is-active');

      // Relative cyclic depth
      const relIdx = (i - activeIdx + 3) % 3;
      plate.classList.add(`cypheir-plate--${relIdx}`);
      if (relIdx === 0) {
        plate.classList.add('is-active');
      }
    });
  };

  stackTabs.forEach((tab, idx) => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      reorderStack(idx);
    });
  });

  stackPlates.forEach((plate) => {
    plate.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(plate.getAttribute('data-index'), 10);
      reorderStack(idx);
    });
  });

  // 4. CARD 3: Cypheir Reactive Telemetry & State Engine
  const dealBtn = document.getElementById('ctrl-deal-btn');
  const flipBtn = document.getElementById('ctrl-flip-btn');
  const filterBtn = document.getElementById('ctrl-filter-btn');
  const filterLabelEl = document.getElementById('ctrl-filter-label');
  const miniCoin = document.getElementById('cypheir-mini-coin');

  const jsonFilter = document.getElementById('json-filter');
  const jsonDeals = document.getElementById('json-deals');
  const jsonFlipped = document.getElementById('json-flipped');
  const waveBars = document.querySelectorAll('.cypheir-waveform .wave-bar');

  const filtersList = ['ALL', 'INTERACTIVE', 'UX/UI', 'SYSTEMS'];
  let currentFilterIdx = 0;
  let dealsCount = 0;
  let isCoinFlipped = false;

  const pulseWaveform = () => {
    waveBars.forEach((bar, i) => {
      bar.style.transform = `scaleY(${1 + Math.random() * 1.6})`;
      setTimeout(() => {
        bar.style.transform = '';
      }, 300 + i * 40);
    });
  };

  const flashJsonVal = (el) => {
    if (!el) return;
    el.classList.add('is-updated');
    setTimeout(() => el.classList.remove('is-updated'), 350);
  };

  if (dealBtn) {
    dealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dealsCount += 1;
      if (jsonDeals) {
        jsonDeals.textContent = dealsCount;
        flashJsonVal(jsonDeals);
      }
      pulseWaveform();
    });
  }

  if (flipBtn && miniCoin) {
    flipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isCoinFlipped = !isCoinFlipped;
      miniCoin.classList.toggle('is-flipped', isCoinFlipped);
      if (jsonFlipped) {
        jsonFlipped.textContent = isCoinFlipped ? 'true' : 'false';
        flashJsonVal(jsonFlipped);
      }
      pulseWaveform();
    });

    miniCoin.addEventListener('click', (e) => {
      e.stopPropagation();
      flipBtn.click();
    });
  }

  if (filterBtn && filterLabelEl) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentFilterIdx = (currentFilterIdx + 1) % filtersList.length;
      const nextFilter = filtersList[currentFilterIdx];
      filterLabelEl.textContent = nextFilter;
      if (jsonFilter) {
        jsonFilter.textContent = `"${nextFilter}"`;
        flashJsonVal(jsonFilter);
      }
      pulseWaveform();
    });
  }

  // 5. CARD 4: Cypheir Sequential Verification Pipeline
  const pipelineNodes = document.querySelectorAll('.cypheir-node');
  const pipelineGlow = document.getElementById('pipeline-track-glow');
  const detailBadge = document.getElementById('pipeline-detail-badge');
  const detailText = document.getElementById('pipeline-detail-text');
  const simulateBtn = document.getElementById('pipeline-simulate-btn');

  const pipelinePhases = [
    {
      badge: 'PHASE 01 // SPECIFICATION',
      text: 'Define problem requirements, accessibility constraints & Figma interface tokens before writing code.'
    },
    {
      badge: 'PHASE 02 // AI CO-PILOT PAIRING',
      text: 'Pair with Claude Code, Cursor & Antigravity for structured architecture and component scaffolding.'
    },
    {
      badge: 'PHASE 03 // RIGOROUS CODE AUDIT',
      text: 'Human-in-the-loop inspection: verifying AST, zero hallucinations, clean DOM semantics & WCAG AA standards.'
    },
    {
      badge: 'PHASE 04 // DEVTOOLS PROFILING',
      text: 'Browser DevTools profiling: 60fps paint cycles, memory stability, zero regressions & 0 Cumulative Layout Shift.'
    },
    {
      badge: 'PHASE 05 // PRODUCTION DEPLOY',
      text: 'Deploy lean, production-verified frontend code with zero external dependencies and instant responsiveness.'
    }
  ];

  const setPipelineStep = (stepIdx) => {
    pipelineNodes.forEach((node, i) => {
      node.classList.toggle('is-active', i === stepIdx);
    });

    if (pipelineGlow) {
      const pct = (stepIdx / (pipelineNodes.length - 1)) * 80;
      pipelineGlow.style.left = `${pct}%`;
    }

    if (detailBadge && detailText && pipelinePhases[stepIdx]) {
      detailBadge.textContent = pipelinePhases[stepIdx].badge;
      detailText.textContent = pipelinePhases[stepIdx].text;
    }
  };

  pipelineNodes.forEach((node, idx) => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      setPipelineStep(idx);
    });
  });

  if (simulateBtn) {
    let isSimulating = false;
    simulateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isSimulating) return;
      isSimulating = true;
      simulateBtn.disabled = true;

      let currentStep = 0;
      const interval = setInterval(() => {
        setPipelineStep(currentStep);
        currentStep++;
        if (currentStep >= pipelinePhases.length) {
          clearInterval(interval);
          setTimeout(() => {
            isSimulating = false;
            simulateBtn.disabled = false;
          }, 400);
        }
      }, 340);
    });
  }

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
        const targetId = scrollHintLink.getAttribute('href')?.replace('#', '') || 'process';
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
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

  // Gucci-Inspired Section & Element Scroll Reveal Observer
  const majorSections = document.querySelectorAll('section:not(#home)');
  const revealElements = document.querySelectorAll(
    '[data-reveal]:not(#home [data-reveal]), .reveal:not(#home), #projects-grid'
  );

  if (prefersReducedMotion) {
    majorSections.forEach(sec => sec.classList.add('is-revealed'));
    document.querySelectorAll('[data-reveal], .reveal').forEach(el => {
      el.classList.add('is-revealed', 'reveal--visible');
    });
    if (projectsGrid) {
      projectsGrid.querySelectorAll('.project-card').forEach(c => {
        c.classList.add('project-card--revealed');
      });
    }
  } else if ('IntersectionObserver' in window) {
    // 1. Section-level observer for Gucci luxury hairline dividers & stage uncurtaining
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    );
    majorSections.forEach(sec => sectionObserver.observe(sec));

    // 2. Element-level observer for Gucci typography mask & card reveals
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed', 'reveal--visible');

            // If projects grid scrolled into view, cascade cards with luxury timing
            if (entry.target.id === 'projects-grid') {
              entry.target.querySelectorAll('.project-card').forEach((card, idx) => {
                card.style.transitionDelay = `${idx * 80}ms`;
                card.classList.add('project-card--revealed');
              });
            }

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    majorSections.forEach(sec => sec.classList.add('is-revealed'));
    document.querySelectorAll('[data-reveal], .reveal').forEach(el => {
      el.classList.add('is-revealed', 'reveal--visible');
    });
    if (projectsGrid) {
      projectsGrid.querySelectorAll('.project-card').forEach(c => {
        c.classList.add('project-card--revealed');
      });
    }
  }


  /* ============================================
     8b. VISUAL PLAYGROUND (EDITORIAL ARCHIVE) & LIGHTBOX ENGINE
     Curated archive of branding, packaging, campaigns, print & UI explorations
     Strictly categorized per Phase 3 & Phase 6
     ============================================ */

  const PLAYGROUND_CATEGORIES = [
    { key: 'all', label: 'All Work', color: '#E06A42', rgb: '224, 106, 66', icon: '✦' },
    { key: 'branding', label: 'Branding', color: '#8B5CF6', rgb: '139, 92, 246', icon: '◈' },
    { key: 'packaging', label: 'Packaging', color: '#10B981', rgb: '16, 185, 129', icon: '◰' },
    { key: 'campaigns', label: 'Campaigns', color: '#E11D48', rgb: '225, 29, 72', icon: '▲' },
    { key: 'print', label: 'Print & Editorial', color: '#059669', rgb: '5, 150, 105', icon: '▤' },
    { key: 'image-craft', label: 'Image Craft', color: '#EC4899', rgb: '236, 72, 153', icon: '◉' },
    { key: 'ui', label: 'UI Experiments', color: '#3B82F6', rgb: '59, 130, 246', icon: '▣' },
    { key: 'other', label: 'Other Explorations', color: '#6366F1', rgb: '99, 102, 241', icon: '◎' }
  ];

  const playgroundItems = [
    {
      id: 'pg-1',
      category: 'print',
      categoryLabel: 'Print & Editorial',
      title: 'Bioavailability Editorial Spread',
      discipline: 'Editorial Design · Health Publishing · Grid Systems',
      aspect: 'landscape',
      image: 'assets/projects/How to Choose High-Quality Nutritional Supplements.jpg',
      desc: 'Editorial typography, structured grid composition, and analytical visual layout for clinical health publications.',
      deliverables: ['Editorial Publication Spread', 'Modular Column Grid', 'Clinical Data Typography', 'Print Spec Sheet'],
      tags: ['Editorial Design', 'Typography', 'Grid System'],
      year: '2025'
    },
    {
      id: 'pg-2',
      category: 'campaigns',
      categoryLabel: 'Campaigns',
      title: 'Studio Creative Direction & Identity Poster',
      discipline: 'Art Direction · Poster Design · Typography',
      aspect: 'square',
      image: 'assets/projects/banner.png',
      desc: 'Typography hierarchy showcase, brand art direction, and high-contrast dual-tone layout compositions.',
      deliverables: ['Exhibition Poster', 'Typographic Hierarchy Spec', 'Dual-Tone Palette System', 'Print Proof'],
      tags: ['Poster Design', 'Art Direction', 'Typography'],
      year: '2025'
    },
    {
      id: 'pg-3',
      category: 'packaging',
      categoryLabel: 'Packaging',
      title: 'Triveda Botanical Packaging Dieline',
      discipline: 'Packaging Design · Dielines · Foil Stamping',
      aspect: 'landscape',
      image: 'assets/projects/triveda-brand.jpg',
      desc: 'Organic Ayurvedic luxury packaging study: gold foil stamping, custom botanical iconography, and tactile paper finishes.',
      deliverables: ['Product Box Packaging Dieline', 'Amber Glass Jar Label Spec', 'Gold Foil Stamping Details', 'Botanical Iconography'],
      tags: ['Packaging Design', 'Print Collateral', 'Iconography'],
      year: '2024'
    },
    {
      id: 'pg-4',
      category: 'print',
      categoryLabel: 'Print & Editorial',
      title: 'Mittika Heritage Lookbook Spread',
      discipline: 'Editorial · Publication Design · Art Direction',
      aspect: 'portrait',
      image: 'assets/projects/mittika-brand.jpg',
      desc: 'Editorial brochure exploring artisanal handloom weaving techniques, earthy terracotta palettes, and serif typographic rhythm.',
      deliverables: ['Heritage Handloom Lookbook', 'Editorial Spread Layouts', 'Terracotta Palette Study', 'Artisan Story Cards'],
      tags: ['Editorial Design', 'Lookbook', 'Color Theory'],
      year: '2024'
    },
    {
      id: 'pg-5',
      category: 'campaigns',
      categoryLabel: 'Campaigns',
      title: 'Wave Live Electronic Music Poster',
      discipline: 'Campaigns · Festival Poster · Art Direction',
      aspect: 'square',
      image: 'assets/projects/eventmgmt-brand.jpg',
      desc: 'Dynamic soundwave visual identity, kinetic typography, neon gradients, and festival outdoor advertising campaign.',
      deliverables: ['Outdoor Billboard Creatives', 'Stage Festival Poster Series', 'Kinetic Typography Assets', 'Digital Social Assets'],
      tags: ['Poster Design', 'Advertising Creatives', 'Visual Identity'],
      year: '2024'
    },
    {
      id: 'pg-6',
      category: 'branding',
      categoryLabel: 'Branding',
      title: 'EcoVolt Isometric Solar Architecture',
      discipline: 'Branding · Information Graphics · Technical Illustration',
      aspect: 'portrait',
      image: 'assets/projects/ecovolt-brand.jpg',
      desc: 'Information design and isometric technical illustration explaining microgrid energy flow and solar battery storage.',
      deliverables: ['Isometric Architectural Diagram', 'Microgrid Energy Flow Schematic', 'Brand Technical Illustration System'],
      tags: ['Visual Identity', 'Infographics', 'Isometric Art'],
      year: '2025'
    },
    {
      id: 'pg-7',
      category: 'branding',
      categoryLabel: 'Branding',
      title: 'Triveda Herbarium Print System',
      discipline: 'Branding · Stationery · Botanical Art',
      aspect: 'landscape',
      image: 'assets/projects/triveda-web.jpg',
      desc: 'Botanical ingredient reference cards with botanical line art, macro photography treatments, and paper dielines.',
      deliverables: ['Botanical Ingredient Cards', 'Herbarium Line Illustrations', 'Stationery & Collateral Suite'],
      tags: ['Brand Collateral', 'Stationery', 'Visual System'],
      year: '2024'
    },
    {
      id: 'pg-8',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'Nuvera Vitality Telemetry Dashboard',
      discipline: 'UI Experiments · HealthTech · Data Visualization',
      aspect: 'portrait',
      image: 'assets/projects/nuvera.jpg',
      desc: 'Health tech interface concept: circular biological vitality index, clinical biomarker cards, and personalized dosage schedule.',
      deliverables: ['Mobile Health Dashboard UI', 'Circular Biomarker Ring Gauge', 'Daily Dosage Schedule Component'],
      tags: ['UI Exploration', 'HealthTech', 'Data Visualization'],
      year: '2025'
    },
    {
      id: 'pg-9',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'ForgeOS Ergonomic Dark MES Console',
      discipline: 'UI Experiments · Industrial SaaS · Telemetry UI',
      aspect: 'landscape',
      image: 'assets/projects/saas-landing-ux.jpg',
      desc: 'Industrial telemetry UI concept designed for plant floor monitors with high-contrast alert hierarchies and machine telemetry.',
      deliverables: ['Industrial MES Telemetry Screen', 'High-Contrast Alert Hierarchy', 'Plant Floor Metric Cards'],
      tags: ['SaaS Concept', 'Dark Mode UI', 'Dashboard'],
      year: '2024'
    },
    {
      id: 'pg-10',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'AeroBharat 3D Spatial Mission Flight Deck',
      discipline: 'UI Experiments · 3D Spatial UX · Drone Flight Deck',
      aspect: 'landscape',
      image: 'assets/projects/aerobharat-ux.jpg',
      desc: 'Spatial drone route planning interface with altitude contour charts, real-time geofence warnings, and waypoint orchestrators.',
      deliverables: ['Spatial Drone Flight Deck UI', '3D Altitude Contour Chart', 'Geofence Perimeter Orchestrator'],
      tags: ['3D Spatial UX', 'Interaction Design', 'Drone UI'],
      year: '2025'
    },
    {
      id: 'pg-11',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'Mittika Fabric Drape & Texture Detail UX',
      discipline: 'UI Experiments · E-Commerce · Microinteractions',
      aspect: 'portrait',
      image: 'assets/projects/mittika-ux.jpg',
      desc: 'Artisanal e-commerce interaction study: high-fidelity weave zoom, artisan provenance tags, and ethical fair-trade metrics.',
      deliverables: ['Mobile E-Commerce Detail Flow', 'Fabric Drape Micro-Zoom View', 'Artisan Provenance Metatags'],
      tags: ['Mobile UX', 'E-Commerce', 'Interaction Design'],
      year: '2024'
    },
    {
      id: 'pg-12',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'Arena Interactive Seating Reservation UI',
      discipline: 'UI Experiments · Interactive Map · Booking Flow',
      aspect: 'square',
      image: 'assets/projects/eventmgmt-ux.jpg',
      desc: 'Concert venue seat selection flow with live acoustic angle simulation, tiered price toggles, and instant cart reservation.',
      deliverables: ['Interactive Seating Map UI', 'Acoustic Sightline Simulator', 'Tiered Ticket Checkout Drawer'],
      tags: ['UX Exploration', 'Interactive Map', 'Checkout Flow'],
      year: '2024'
    },
    {
      id: 'pg-13',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'EcoVolt Hybrid Inverter Solar Flow',
      discipline: 'UI Experiments · CleanTech · Energy Telemetry',
      aspect: 'portrait',
      image: 'assets/projects/ecovolt-web.jpg',
      desc: 'Live solar energy monitor interface showing real-time kilowatt generation, battery charge telemetry, and grid export rates.',
      deliverables: ['Mobile Solar Flow Interface', 'Real-Time Power Flow Visualizer', 'Battery Telemetry Gauge'],
      tags: ['Dashboard UI', 'CleanTech', 'Energy Analytics'],
      year: '2025'
    },
    {
      id: 'pg-14',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'Wave Live Stage Lineup & Dynamic Schedule',
      discipline: 'UI Experiments · Event App · Timetable UI',
      aspect: 'square',
      image: 'assets/projects/eventmgmt-web.jpg',
      desc: 'Festival schedule mobile view with conflict avoidance alerts, artist discovery clips, and dynamic timetable switcher.',
      deliverables: ['Dynamic Lineup Timetable UI', 'Stage Selector Switcher', 'Artist Schedule Conflict Alerts'],
      tags: ['Mobile UI', 'Event App', 'Design Systems'],
      year: '2024'
    },
    {
      id: 'pg-15',
      category: 'ui',
      categoryLabel: 'UI Experiments',
      title: 'Mittika Digital Lookbook & Catalog Grid',
      discipline: 'UI Experiments · Editorial Web · Responsive Layout',
      aspect: 'portrait',
      image: 'assets/projects/mittika-web.jpg',
      desc: 'Fluid responsive lookbook interface featuring editorial masonry layout, artisanal story modals, and microinteractions.',
      deliverables: ['Responsive Lookbook Web Layout', 'Artisanal Craft Narrative Modal', 'Editorial Filter Switcher'],
      tags: ['Responsive UI', 'Editorial Web', 'Microinteractions'],
      year: '2024'
    }
  ];

  const playgroundGrid = document.getElementById('playground-grid');
  const playgroundTabsContainer = document.getElementById('playground-tabs');
  let currentPlaygroundFilter = 'all';
  let activePlaygroundItems = [...playgroundItems];

  // Helper to calculate project counts per category dynamically
  const getCategoryCount = (key) => {
    if (key === 'all') return playgroundItems.length;
    return playgroundItems.filter(item => item.category === key).length;
  };

  // Build Filter Tabs dynamically ensuring counts reflect actual data
  // Only displays categories with count > 0 (strictly obeying Phase 6 requirement)
  const renderPlaygroundTabs = () => {
    if (!playgroundTabsContainer) return;

    const availableCategories = PLAYGROUND_CATEGORIES.filter(cat => getCategoryCount(cat.key) > 0);

    playgroundTabsContainer.innerHTML = availableCategories.map(cat => {
      const count = getCategoryCount(cat.key);
      const isActive = cat.key === currentPlaygroundFilter;
      return `
        <button type="button"
                class="playground-folder__tab ${isActive ? 'playground-folder__tab--active' : ''}"
                role="tab"
                id="pg-tab-${cat.key}"
                aria-controls="playground-grid"
                aria-selected="${isActive ? 'true' : 'false'}"
                data-filter="${cat.key}">
          <span class="playground-folder__tab-icon" aria-hidden="true">${cat.icon || '✦'}</span>
          <span class="playground-folder__tab-label">${cat.label}</span>
          <span class="playground-folder__tab-count">(${count})</span>
        </button>
      `;
    }).join('');

    // Attach listeners
    const tabButtons = playgroundTabsContainer.querySelectorAll('.playground-folder__tab');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterKey = btn.getAttribute('data-filter') || 'all';
        setPlaygroundFilter(filterKey);
      });

      // Keyboard arrow navigation
      btn.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(tabButtons);
        const currentIndex = tabsArray.indexOf(btn);
        let nextIndex = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabsArray.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = tabsArray.length - 1;
        }

        if (nextIndex !== null) {
          tabsArray[nextIndex].focus();
          const filterKey = tabsArray[nextIndex].getAttribute('data-filter') || 'all';
          setPlaygroundFilter(filterKey);
        }
      });
    });
  };

  const setPlaygroundFilter = (filterKey) => {
    currentPlaygroundFilter = filterKey;

    const catObj = PLAYGROUND_CATEGORIES.find(c => c.key === filterKey) || PLAYGROUND_CATEGORIES[0];
    if (folder && catObj) {
      folder.style.setProperty('--folder-accent', catObj.color);
      folder.style.setProperty('--folder-accent-rgb', catObj.rgb);
    }

    if (playgroundTabsContainer) {
      const tabButtons = playgroundTabsContainer.querySelectorAll('.playground-folder__tab');
      tabButtons.forEach(btn => {
        const isMatch = btn.getAttribute('data-filter') === filterKey;
        btn.classList.toggle('playground-folder__tab--active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });
    }

    renderPlayground(filterKey);
  };

  const buildPlaygroundCardHTML = (item, index, totalInView) => {
    // In "All Work" view, apply deliberate editorial asymmetry on cards 0, 6, and 13
    const isDominant = currentPlaygroundFilter === 'all' && (index === 0 || index === 6 || index === 13);
    const num = String(index + 1).padStart(2, '0');
    const dominantClass = isDominant ? ' playground-card--dominant' : '';
    const tagsHTML = (item.tags && item.tags.length > 0)
      ? `<div class="playground-card__tags">
          ${item.tags.slice(0, 3).map(tag => `<span class="playground-card__tag">${tag}</span>`).join('')}
        </div>`
      : '';

    return `
      <article class="playground-card playground-card--${item.aspect}${dominantClass}"
               data-category="${item.category}"
               data-id="${item.id}"
               data-index="${index}"
               tabindex="0"
               role="button"
               aria-haspopup="dialog"
               aria-label="View ${item.title} — ${item.categoryLabel}"
               style="--card-index: ${index};">
        <div class="playground-card__inner">
          <div class="playground-card__image-wrap">
            <img src="${item.image}" alt="${item.title} — ${item.categoryLabel}" loading="lazy" decoding="async" class="playground-card__img">
            <div class="playground-card__zoom-indicator" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>
          <div class="playground-card__content">
            <div class="playground-card__meta">
              <div class="playground-card__meta-left">
                <span class="playground-card__num">${num}</span>
                <span class="playground-card__meta-divider">/</span>
                <span class="playground-card__cat">${item.categoryLabel.toUpperCase()}</span>
              </div>
              ${item.year ? `<span class="playground-card__year">${item.year}</span>` : ''}
            </div>
            <h3 class="playground-card__title">${item.title}</h3>
            ${item.discipline ? `<p class="playground-card__discipline">${item.discipline}</p>` : ''}
            ${item.desc ? `<p class="playground-card__desc">${item.desc}</p>` : ''}
            ${tagsHTML}
            <div class="playground-card__view-cta" aria-hidden="true">
              <span class="playground-card__cta-label">VIEW PROJECT</span>
              <svg class="playground-card__arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </article>
    `;
  };

  const updatePeekCards = () => {
    const items = activePlaygroundItems;
    if (!items || items.length === 0) return;
    const item1 = items[0];
    const item2 = items[1] || items[0];
    const item3 = items[2] || items[0];

    const peekChip1 = document.getElementById('pg-peek-chip-1');
    const peekMetric1 = document.getElementById('pg-peek-metric-1');
    const peekVal1 = document.getElementById('pg-peek-val-1');
    const peekSys1 = document.getElementById('pg-peek-sys-1');

    if (peekChip1) peekChip1.textContent = 'ARCHIVE // 2026';
    if (peekMetric1) peekMetric1.textContent = (item1.category || 'BRAND IDENTITY').toUpperCase();
    if (peekVal1) peekVal1.textContent = item1.title ? (item1.title.length > 18 ? item1.title.slice(0, 16) + '..' : item1.title) : 'SELECTED';
    if (peekSys1) peekSys1.textContent = 'VISUAL & UI LAB';

    const peekChip2 = document.getElementById('pg-peek-chip-2');
    const peekMetric2 = document.getElementById('pg-peek-metric-2');
    const peekVal2 = document.getElementById('pg-peek-val-2');
    const peekSys2 = document.getElementById('pg-peek-sys-2');

    if (peekChip2) peekChip2.textContent = 'VISUAL & UI LAB';
    if (peekMetric2) peekMetric2.textContent = (item2.category || 'CREATIVE ARCHIVE').toUpperCase();
    if (peekVal2) peekVal2.textContent = item2.title ? (item2.title.length > 18 ? item2.title.slice(0, 16) + '..' : item2.title) : '2026';
    if (peekSys2) peekSys2.textContent = 'BRAND • MOTION • INTERFACES';

    const peekChip3 = document.getElementById('pg-peek-chip-3');
    const peekMetric3 = document.getElementById('pg-peek-metric-3');
    const peekVal3 = document.getElementById('pg-peek-val-3');
    const peekSys3 = document.getElementById('pg-peek-sys-3');

    if (peekChip3) peekChip3.textContent = 'BRAND • MOTION • INTERFACES';
    if (peekMetric3) peekMetric3.textContent = (item3.category || 'INTERACTION LAB').toUpperCase();
    if (peekVal3) peekVal3.textContent = item3.title ? (item3.title.length > 18 ? item3.title.slice(0, 16) + '..' : item3.title) : 'EXPERIMENTAL';
    if (peekSys3) peekSys3.textContent = 'ARCHIVE // 2026';
  };

  const renderPlayground = (filter = 'all') => {
    if (!playgroundGrid) return;
    currentPlaygroundFilter = filter;
    activePlaygroundItems = (filter === 'all')
      ? playgroundItems
      : playgroundItems.filter(item => item.category === filter);

    playgroundGrid.innerHTML = activePlaygroundItems
      .map((item, idx) => buildPlaygroundCardHTML(item, idx, activePlaygroundItems.length))
      .join('');

    updateFolderMetadata();
  };

  /* ============================================
     9b. ARCHIVE FOLDER SLEEVE TAP REVEAL SYSTEM
     Frosted Glass Flap & Pop-Out Spring Physics
     ============================================ */
  const folder = document.getElementById('playground-folder');
  const folderSleeve = document.getElementById('playground-folder-sleeve');
  const folderViewport = document.getElementById('playground-viewport');
  const folderCount = document.getElementById('playground-folder-count');
  const folderBtnText = document.getElementById('playground-folder-btn-text');
  const expandedCount = document.getElementById('playground-expanded-count');
  const tuckTopBtn = document.getElementById('playground-tuck-top');
  const tuckBottomBtn = document.getElementById('playground-tuck-bottom');
  let isFolderOpen = prefersReducedMotion;

  const updateFolderMetadata = () => {
    const count = activePlaygroundItems.length;
    if (folderCount) {
      folderCount.textContent = `${count} Experiments`;
    }
    if (folderBtnText) {
      folderBtnText.textContent = `Tap to Pop Out Cards`;
    }
    if (expandedCount) {
      expandedCount.textContent = `${count} EXPERIMENTS UNLOCKED & DISPLAYED`;
    }
    updatePeekCards();
  };

  const openFolder = () => {
    if (!folder) return;
    isFolderOpen = true;
    folder.classList.add('is-open');
    if (folderSleeve) {
      folderSleeve.setAttribute('aria-expanded', 'true');
    }
    if (folderViewport) {
      folderViewport.setAttribute('aria-hidden', 'false');
    }
    // Set focus on first card for keyboard accessibility
    setTimeout(() => {
      const firstCard = playgroundGrid?.querySelector('.playground-card');
      if (firstCard && (document.activeElement === folderSleeve || !document.activeElement)) {
        firstCard.focus();
      }
    }, 350);
  };

  const closeFolder = () => {
    if (!folder) return;
    isFolderOpen = false;
    folder.classList.remove('is-open');
    if (folderSleeve) {
      folderSleeve.setAttribute('aria-expanded', 'false');
    }
    if (folderViewport) {
      folderViewport.setAttribute('aria-hidden', 'true');
    }
    const playgroundSec = document.getElementById('playground');
    if (playgroundSec) {
      playgroundSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (folderSleeve) {
      folderSleeve.focus();
    }
  };

  if (folderSleeve) {
    folderSleeve.addEventListener('click', (e) => {
      if (!isFolderOpen) {
        openFolder();
      }
    });

    folderSleeve.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isFolderOpen) {
        e.preventDefault();
        openFolder();
      }
    });
  }

  if (tuckTopBtn) {
    tuckTopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeFolder();
    });
  }

  if (tuckBottomBtn) {
    tuckBottomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeFolder();
    });
  }

  // Escape key closes open folder if lightbox is not active
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFolderOpen) {
      const lightboxModal = document.getElementById('lightbox-modal');
      if (!lightboxModal || !lightboxModal.classList.contains('is-open')) {
        closeFolder();
      }
    }
  });

  if (prefersReducedMotion && folder) {
    folder.classList.add('is-open');
  }

  // IntersectionObserver on #playground to subtly peek or auto-expand folder at 35% threshold
  const playgroundSection = document.getElementById('playground');
  let playgroundPeekTriggered = false;

  if (playgroundSection && folder && !prefersReducedMotion) {
    const playgroundObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !playgroundPeekTriggered && !isFolderOpen) {
          playgroundPeekTriggered = true;
          folder.classList.add('is-peeking');
          setTimeout(() => {
            if (!isFolderOpen) {
              openFolder();
              folder.classList.remove('is-peeking');
            }
          }, 600);
        }
      });
    }, {
      threshold: 0.35
    });
    playgroundObserver.observe(playgroundSection);
  }

  // Initialize tabs and grid
  renderPlaygroundTabs();
  renderPlayground('all');

  /* ============================================
     LIGHTBOX MODAL IMPLEMENTATION (PROJECT DETAIL VIEW)
     ============================================ */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDiscipline = document.getElementById('lightbox-discipline');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxDeliverables = document.getElementById('lightbox-deliverables');

  let currentLightboxIndex = 0;
  let lastFocusedPlaygroundCard = null;

  const updateLightboxContent = (index) => {
    if (!activePlaygroundItems || activePlaygroundItems.length === 0) return;
    const item = activePlaygroundItems[index];
    if (!item) return;

    currentLightboxIndex = index;
    if (lightboxImage) {
      lightboxImage.src = item.image;
      lightboxImage.alt = `${item.title} — ${item.categoryLabel}`;
    }
    if (lightboxBadge) {
      lightboxBadge.textContent = item.categoryLabel.toUpperCase();
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(activePlaygroundItems.length).padStart(2, '0')}`;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }
    if (lightboxDiscipline) {
      lightboxDiscipline.textContent = item.discipline || '';
    }
    if (lightboxDesc) {
      lightboxDesc.textContent = item.desc;
    }
    if (lightboxDeliverables) {
      lightboxDeliverables.innerHTML = (item.deliverables && item.deliverables.length > 0)
        ? item.deliverables.map(d => `<span class="lightbox-modal__deliverable-tag">${d}</span>`).join('')
        : '';
    }
  };

  const openLightbox = (index) => {
    if (!lightboxModal) return;
    lastFocusedPlaygroundCard = document.activeElement;
    updateLightboxContent(index);

    lightboxModal.classList.add('lightbox-modal--open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    setTimeout(() => {
      if (lightboxClose) lightboxClose.focus();
    }, 100);
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('lightbox-modal--open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastFocusedPlaygroundCard && typeof lastFocusedPlaygroundCard.focus === 'function') {
      lastFocusedPlaygroundCard.focus();
    }
  };

  const navigateLightbox = (direction) => {
    if (!activePlaygroundItems || activePlaygroundItems.length === 0) return;
    let nextIndex = currentLightboxIndex + direction;
    if (nextIndex < 0) nextIndex = activePlaygroundItems.length - 1;
    if (nextIndex >= activePlaygroundItems.length) nextIndex = 0;
    updateLightboxContent(nextIndex);
  };

  // Card click & keyboard open (opens lightbox when folder is open)
  if (playgroundGrid) {
    playgroundGrid.addEventListener('click', (e) => {
      if (!isFolderOpen) {
        openFolder();
        return;
      }
      const card = e.target.closest('.playground-card');
      if (!card) return;
      const index = parseInt(card.getAttribute('data-index'), 10);
      if (!isNaN(index)) {
        openLightbox(index);
      }
    });

    playgroundGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isFolderOpen) {
          e.preventDefault();
          openFolder();
          return;
        }
        const card = e.target.closest('.playground-card');
        if (card) {
          e.preventDefault();
          const index = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            openLightbox(index);
          }
        }
      }
    });
  }

  // Lightbox controls
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
  }

  // Keyboard navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('lightbox-modal--open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
      return;
    }
    if (e.key === 'ArrowRight') {
      navigateLightbox(1);
      return;
    }

    // Accessible focus trap
    if (e.key === 'Tab') {
      const focusable = lightboxModal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

}); // end DOMContentLoaded
