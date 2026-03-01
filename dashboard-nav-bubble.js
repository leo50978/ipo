(function () {
  const syncButtons = () => {
    const buttons = Array.from(document.querySelectorAll('.tab-btn'));
    if (!buttons.length) return;

    buttons.forEach((button) => {
      const isActive = button.classList.contains('active');
      button.style.boxShadow = isActive ? 'inset 0 0 0 1px rgba(198, 167, 94, 0.18)' : 'none';
      button.style.transform = isActive ? 'translateX(2px)' : 'translateX(0)';
    });
  };

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('.tab-btn')) return;
    window.setTimeout(syncButtons, 0);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncButtons, { once: true });
  } else {
    syncButtons();
  }
})();
