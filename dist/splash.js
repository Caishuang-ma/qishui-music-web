/**
 * Hand-drawn soda-can opening.
 * The picture is the inline SVG in the hero. This script clones it into the
 * splash stage, where CSS draws the outline, hatch, tab, and crack.
 * No WebGL and no third-party model.
 */
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const overlay = document.getElementById('bottle-splash');
  const main = document.querySelector('main');
  const nav = document.querySelector('.nav');
  const skipButton = overlay?.querySelector('.bottle-splash-skip');
  const stage = overlay?.querySelector('.doodle-splash-stage');
  const source = document.querySelector('.hero-mark .doodle-can');
  const HANDOFF_MS = 2800;

  let phase = 'boot';
  let handoffTimer = 0;
  let removeListeners = () => {};

  root.classList.add('splash-booted');

  function mountStillCan() {
    const slot = document.querySelector('[data-can-slot]');
    if (!source || !slot || slot.querySelector('.doodle-can')) return;
    slot.appendChild(source.cloneNode(true));
  }

  function mountSplashCan() {
    if (!source || !stage || stage.querySelector('.doodle-can')) return;
    const can = source.cloneNode(true);
    can.querySelectorAll('.can-line, .can-crack, .can-fizz path').forEach((shape) => {
      shape.setAttribute('pathLength', '1');
    });
    stage.appendChild(can);
  }

  function shouldPlay() {
    return desktop.matches && !reducedMotion.matches && !!overlay && !!source;
  }

  function finish() {
    if (phase === 'done') return;
    phase = 'done';
    window.clearTimeout(handoffTimer);
    removeListeners();
    root.classList.remove('splash-pending', 'splash-active');
    root.classList.add('page-settled', 'splash-reveal');
    if (main) main.inert = false;
    if (nav) nav.inert = false;
    overlay?.remove();
  }

  function beginExit(quick) {
    if (phase === 'leave' || phase === 'done') return;
    phase = 'leave';
    window.clearTimeout(handoffTimer);
    root.classList.remove('splash-pending', 'splash-active');
    root.classList.add('page-settled', 'splash-reveal');
    if (main) main.inert = false;
    if (nav) nav.inert = false;
    if (!overlay) {
      finish();
      return;
    }
    overlay.classList.toggle('is-quick', !!quick);
    overlay.classList.add('is-leaving');
    overlay.setAttribute('aria-hidden', 'true');
    if (skipButton && document.activeElement === skipButton) {
      const title = document.getElementById('hero-title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
      }
    }
    const fallback = window.setTimeout(finish, quick ? 420 : 980);
    overlay.addEventListener('transitionend', (event) => {
      if (event.target !== overlay || event.propertyName !== 'opacity') return;
      window.clearTimeout(fallback);
      finish();
    });
  }

  function requestSkip() {
    if (phase === 'play' || phase === 'boot') beginExit(true);
  }

  function bindInput() {
    const cleanups = [];
    const listen = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      cleanups.push(() => target.removeEventListener(type, handler, options));
    };
    listen(window, 'keydown', (event) => {
      if (phase === 'done' || phase === 'leave') return;
      const key = event.key;
      if (key === 'Escape' || key === ' ' || key === 'Spacebar' || key === 'ArrowDown' || key === 'PageDown' || key === 'Enter') {
        event.preventDefault();
        requestSkip();
      }
    });
    listen(window, 'wheel', (event) => {
      if (phase === 'done' || phase === 'leave') return;
      event.preventDefault();
      requestSkip();
    }, { passive: false });
    listen(window, 'scroll', () => {
      if (phase === 'done' || phase === 'leave') return;
      if (window.scrollY > 4) requestSkip();
    }, { passive: true });
    listen(overlay, 'pointerdown', (event) => {
      if (event.button !== 0) return;
      requestSkip();
    });
    listen(reducedMotion, 'change', () => {
      if (reducedMotion.matches) finish();
    });
    listen(desktop, 'change', () => {
      if (!desktop.matches) finish();
    });
    removeListeners = () => {
      cleanups.splice(0).forEach((off) => off());
    };
  }

  mountStillCan();

  if (!shouldPlay()) {
    finish();
    return;
  }

  phase = 'play';
  mountSplashCan();
  root.classList.add('splash-pending', 'splash-active');
  if (main) main.inert = true;
  if (nav) nav.inert = true;
  bindInput();
  skipButton?.focus({ preventScroll: true });
  handoffTimer = window.setTimeout(() => beginExit(false), HANDOFF_MS);
})();
