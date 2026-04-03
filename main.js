(() => {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
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

  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1100) closeMenu();
    });
  });

  menuToggle?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', closeMenu);
  backToTop?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
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
