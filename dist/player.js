(() => {
  'use strict';
  const dialog = document.querySelector('#song-dialog');
  const frame = document.querySelector('[data-player-frame]');
  const status = document.querySelector('[data-player-status]');
  if (!dialog || !frame) return;
  let trigger;
  let loadTimer;
  function closePlayer() {
    if (dialog.open) dialog.close();
  }
  document.querySelectorAll('[data-play-song]').forEach(button => {
    button.addEventListener('click', () => {
      trigger = button;
      if (dialog.open) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/wp43OdtAAkM?autoplay=1&playsinline=1&rel=0';
      iframe.title = 'Kate Bush - Running Up That Hill - Official Music Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      status.textContent = '正在打开官方播放器…';
      iframe.addEventListener('load', () => {
        clearTimeout(loadTimer);
        status.textContent = '可在播放器中暂停、调节音量或全屏。';
      }, { once: true });
      iframe.addEventListener('error', () => {
        clearTimeout(loadTimer);
        status.textContent = '播放器暂时不可用，可在官方频道打开。';
      }, { once: true });
      frame.replaceChildren(iframe);
      dialog.showModal();
      button.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('player-open');
      loadTimer = window.setTimeout(() => {
        status.textContent = '播放器加载较慢，可在官方频道打开。';
      }, 12000);
    });
  });
  dialog.querySelector('[data-close-player]').addEventListener('click', closePlayer);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePlayer();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(loadTimer);
    frame.replaceChildren();
    document.documentElement.classList.remove('player-open');
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.focus({ preventScroll: true });
  });
})();
