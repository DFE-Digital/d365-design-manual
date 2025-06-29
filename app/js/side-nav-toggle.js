document.addEventListener('DOMContentLoaded', () => {
  const breakpoint = '(max-width: 40.0625em)';
  const mql = window.matchMedia(breakpoint);

  function resetNav(toggle) {
    const menu = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!menu) return;

    if (mql.matches) {
      // mobile
      toggle.children('h3').hide()
      toggle.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    } else {
      // desktop
      toggle.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = false;
    }
  }

  document
    .querySelectorAll('.dfe-js-vertical-nav-toggle')
    .forEach(toggle => {
      // initial setup
      resetNav(toggle);
      // watch for viewport changes
      mql.addEventListener('change', () => resetNav(toggle));

      // click only toggles menu (no need to touch hidden on the button)
      const menu = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!menu) return;
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        menu.hidden = isOpen;
      });
    });
});
