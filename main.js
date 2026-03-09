(() => {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const searchInput = document.getElementById('sectionSearch');
  const links = Array.from(document.querySelectorAll('.toc-link'));
  const sections = Array.from(document.querySelectorAll('.content-section'));
  const progressBar = document.getElementById('readingProgress');
  const backToTop = document.getElementById('backToTop');

  const openMenu = () => {
    sidebar.classList.add('open');
    overlay.hidden = false;
    body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    sidebar.classList.remove('open');
    overlay.hidden = true;
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  };

  const setActiveLink = (id) => {
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  };

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  const updateScrollSpy = () => {
    const current = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 150 && rect.bottom >= 150;
    }) || sections[0];

    if (current) setActiveLink(current.id);
  };

  const filterSections = (keyword) => {
    const q = keyword.trim().toLowerCase();

    sections.forEach((section) => {
      const title = (section.dataset.title || '').toLowerCase();
      const text = section.textContent.toLowerCase();
      const match = !q || title.includes(q) || text.includes(q);
      section.style.display = match ? '' : 'none';
    });

    links.forEach((link) => {
      const target = document.querySelector(link.getAttribute('href'));
      const visible = target && target.style.display !== 'none';
      link.style.display = visible ? '' : 'none';
    });
  };

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1100) closeMenu();
    });
  });

  menuToggle?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  searchInput?.addEventListener('input', (e) => filterSections(e.target.value));
  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput?.focus();
      searchInput?.select();
    }
  });

  window.addEventListener('scroll', () => {
    updateProgress();
    updateScrollSpy();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) closeMenu();
  });

  updateProgress();
  updateScrollSpy();
})();
