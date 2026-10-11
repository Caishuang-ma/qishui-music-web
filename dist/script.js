(() => {
  'use strict';

  function initPage() {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 601px)');
    const nav = document.querySelector('.nav');
    const chapters = Array.from(document.querySelectorAll('.chapter[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
    const revealElements = Array.from(document.querySelectorAll('.reveal, .reveal-scale, .reveal-body'));
    const atmosphereElements = Array.from(document.querySelectorAll('.hero-atmosphere, .marquee-window'));
    const parallaxElements = Array.from(document.querySelectorAll('.parallax-layer')).slice(0, 3);
    const pointerControls = [];
    const canObserve = 'IntersectionObserver' in window;
    let scrollFrame = 0;
    let revealObserver;
    let activeChapter = '';

    const pointerMotionAllowed = () => !reducedMotion.matches && finePointer.matches && !document.hidden;
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

    function revealAll() {
      revealElements.forEach(element => element.classList.add('in-view'));
      revealObserver?.disconnect();
    }

    if (canObserve && !reducedMotion.matches) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.18 });
      revealElements.forEach(element => revealObserver.observe(element));
    } else {
      revealAll();
    }

    if (canObserve) {
      const atmosphereObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
      }, { threshold: 0.05 });
      atmosphereElements.forEach(element => atmosphereObserver.observe(element));
    }

    function updateNavigation() {
      nav?.classList.toggle('scrolled', window.scrollY > 40);
      const readingLine = Math.min(window.innerHeight * 0.4, 320);
      let current = chapters[0];
      chapters.forEach(chapter => {
        if (chapter.getBoundingClientRect().top <= readingLine) current = chapter;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        current = chapters[chapters.length - 1];
      }
      if (!current || current.id === activeChapter) return;
      activeChapter = current.id;
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeChapter}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function updatePage() {
      scrollFrame = 0;
      if (document.hidden) return;
      updateNavigation();
      const enabled = pointerMotionAllowed();
      parallaxElements.forEach(element => {
        if (!enabled) {
          element.style.setProperty('--py', '0px');
          return;
        }
        const rect = element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const distance = (rect.top + rect.bottom) / 2 - window.innerHeight / 2;
        element.style.setProperty('--py', `${clamp(distance * 0.06, -32, 32).toFixed(2)}px`);
      });
      if (!canObserve) {
        atmosphereElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          element.classList.toggle('in-view', rect.bottom > 0 && rect.top < window.innerHeight);
        });
      }
    }

    function queuePageUpdate() {
      if (!scrollFrame && !document.hidden) scrollFrame = requestAnimationFrame(updatePage);
    }

    window.addEventListener('scroll', queuePageUpdate, { passive: true });
    window.addEventListener('resize', queuePageUpdate, { passive: true });
    window.addEventListener('pageshow', queuePageUpdate);

    document.querySelectorAll('[data-spotlight], [data-magnet]').forEach(element => {
      const magnetInner = element.querySelector('.magnet-inner') || element;
      let frame = 0;
      let coordinates = null;

      function reset() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        coordinates = null;
        element.style.setProperty('--mx', '50%');
        element.style.setProperty('--my', '50%');
        magnetInner.style.setProperty('--dx', '0px');
        magnetInner.style.setProperty('--dy', '0px');
      }

      function paintPointer() {
        frame = 0;
        if (!coordinates || !pointerMotionAllowed() || element.matches(':disabled, [aria-disabled="true"]')) {
          reset();
          return;
        }
        const rect = element.getBoundingClientRect();
        const x = clamp(coordinates.x - rect.left, 0, rect.width);
        const y = clamp(coordinates.y - rect.top, 0, rect.height);
        if (element.hasAttribute('data-spotlight')) {
          element.style.setProperty('--mx', `${x.toFixed(2)}px`);
          element.style.setProperty('--my', `${y.toFixed(2)}px`);
        }
        if (element.hasAttribute('data-magnet')) {
          magnetInner.style.setProperty('--dx', `${clamp((x - rect.width / 2) * 0.08, -6, 6).toFixed(2)}px`);
          magnetInner.style.setProperty('--dy', `${clamp((y - rect.height / 2) * 0.08, -6, 6).toFixed(2)}px`);
        }
      }

      element.addEventListener('pointermove', event => {
        if (!pointerMotionAllowed() || event.pointerType === 'touch') return;
        coordinates = { x: event.clientX, y: event.clientY };
        if (!frame) frame = requestAnimationFrame(paintPointer);
      }, { passive: true });
      element.addEventListener('pointerleave', reset, { passive: true });
      element.addEventListener('pointercancel', reset, { passive: true });
      element.addEventListener('blur', reset);
      pointerControls.push({ reset });
    });

    const sceneButtons = Array.from(document.querySelectorAll('button[data-scene]'));
    const sceneCards = Array.from(document.querySelectorAll('figure.scene-card[data-artwork]'));
    const sceneStatus = document.querySelector('[data-scene-status]');
    const sceneProgress = document.querySelector('.scene-progress');
    const sceneProgressFill = document.querySelector('.scene-progress-fill');
    if (sceneStatus) {
      sceneStatus.setAttribute('role', 'status');
      sceneStatus.setAttribute('aria-live', 'polite');
      sceneStatus.setAttribute('aria-atomic', 'true');
    }

    function selectScene(button) {
      if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
      const scene = button.dataset.scene;
      const index = sceneButtons.indexOf(button);
      sceneButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
      sceneCards.forEach(card => {
        const selected = card.dataset.artwork === scene;
        card.dataset.active = String(selected);
        card.classList.toggle('is-selected', selected);
      });
      if (sceneStatus && button.dataset.description) sceneStatus.textContent = button.dataset.description;
      sceneProgress?.style.setProperty('--scene', String(index));
      sceneProgressFill?.style.setProperty('--scene', String(index));
      queuePageUpdate();
    }

    sceneButtons.forEach(button => button.addEventListener('click', () => selectScene(button)));
    selectScene(sceneButtons.find(button => button.getAttribute('aria-pressed') === 'true') || sceneButtons[0]);

    const surprise = document.querySelector('[data-surprise]');
    const surpriseStatus = document.querySelector('[data-surprise-status]');
    let surpriseFrame = 0;
    let feedbackTimer = 0;
    if (surpriseStatus) {
      surpriseStatus.setAttribute('role', 'status');
      surpriseStatus.setAttribute('aria-live', 'polite');
      surpriseStatus.setAttribute('aria-atomic', 'true');
    }

    function resetSurpriseAnimation() {
      if (surpriseFrame) cancelAnimationFrame(surpriseFrame);
      if (feedbackTimer) clearTimeout(feedbackTimer);
      surpriseFrame = 0;
      feedbackTimer = 0;
      surprise?.classList.remove('is-pulsing');
    }

    surprise?.addEventListener('click', () => {
      if (surprise.disabled || surprise.getAttribute('aria-disabled') === 'true') return;
      resetSurpriseAnimation();
      if (surpriseStatus) surpriseStatus.textContent = '好，按你的节奏来。';
      if (reducedMotion.matches || document.hidden) return;
      surpriseFrame = requestAnimationFrame(() => {
        surpriseFrame = 0;
        surprise.classList.add('is-pulsing');
        feedbackTimer = window.setTimeout(() => {
          surprise.classList.remove('is-pulsing');
          feedbackTimer = 0;
        }, 750);
      });
    });

    function resetPointerMotion() {
      pointerControls.forEach(control => control.reset());
      parallaxElements.forEach(element => element.style.setProperty('--py', '0px'));
    }

    function updateMotionPreference() {
      resetPointerMotion();
      if (reducedMotion.matches) {
        revealAll();
        resetSurpriseAnimation();
      }
      queuePageUpdate();
    }

    reducedMotion.addEventListener('change', updateMotionPreference);
    finePointer.addEventListener('change', updateMotionPreference);

    function updateVisibility() {
      root.classList.toggle('page-hidden', document.hidden);
      if (document.hidden) {
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
        resetPointerMotion();
        resetSurpriseAnimation();
      } else {
        queuePageUpdate();
      }
    }

    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();
    root.classList.add('motion-ready');
    queuePageUpdate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage, { once: true });
  } else {
    initPage();
  }
})();
