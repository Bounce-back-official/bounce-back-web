(() => {
  const onReady = () => {
    document.documentElement.classList.add('bb-ready');
    document.querySelectorAll('[data-bb-year]').forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onReady, { once: true });
  else onReady();
})();
