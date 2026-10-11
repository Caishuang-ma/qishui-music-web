(() => {
  'use strict';

  function initPage() {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const nav = document.querySelector('.nav');
    const chapters = Array.from(document.querySelectorAll('.chapter[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
    const revealElements = Array.from(document.querySelectorAll('.reveal, .reveal-scale, .reveal-body'));
    const siteAtmosphere = document.querySelector('.site-atmosphere');
    const atmosphereElements = Array.from(document.querySelectorAll('.site-atmosphere, .hero-atmosphere, .marquee-window'));
    const parallaxElements = Array.from(document.querySelectorAll('.parallax-layer')).slice(0, 3);
    const sceneGallery = document.querySelector('#scene-gallery.scene-gallery');
    const features = document.querySelector('#features');
    const modeStage = document.querySelector('[data-mode-stage]');
    const pointerControls = [];
    const canObserve = 'IntersectionObserver' in window;
    let scrollFrame = 0;
    let revealObserver;
    let activeChapter = '';
    let featuresVisible = false;

    const pointerMotionAllowed = () => !reducedMotion.matches && finePointer.matches && !document.hidden;
    const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

    function updateModeVisibility() {
      const playing = featuresVisible && !document.hidden && !reducedMotion.matches;
      features?.classList.toggle('in-view', playing);
      modeStage?.classList.toggle('in-view', playing);
    }

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
      if (features) {
        const modeObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            featuresVisible = entry.isIntersecting;
            updateModeVisibility();
          });
        }, { threshold: 0.05 });
        modeObserver.observe(features);
      }
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
      if (siteAtmosphere) {
        const distance = Math.max(1, root.scrollHeight - window.innerHeight);
        const progress = clamp(window.scrollY / distance, 0, 1);
        const moving = !reducedMotion.matches;
        siteAtmosphere.style.setProperty('--field-y', moving ? `${(progress * 80 - 40).toFixed(2)}px` : '0px');
        siteAtmosphere.style.setProperty('--field-turn', moving ? `${(progress * 12).toFixed(2)}deg` : '0deg');
      }
      if (sceneGallery) {
        const rect = sceneGallery.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < window.innerHeight;
        const distance = (rect.top + rect.bottom) / 2 - window.innerHeight / 2;
        sceneGallery.style.setProperty('--gallery-tilt', enabled && visible ? `${clamp(distance * 0.015, -6, 6).toFixed(2)}deg` : '0deg');
      }
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
        if (features) {
          const rect = features.getBoundingClientRect();
          featuresVisible = rect.bottom > 0 && rect.top < window.innerHeight;
          updateModeVisibility();
        }
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

    document.querySelectorAll('.scene-stage, .mode-stage').forEach(stage => {
      let stageFrame = 0;
      let coordinates = null;

      function reset() {
        if (stageFrame) cancelAnimationFrame(stageFrame);
        stageFrame = 0;
        coordinates = null;
        stage.style.setProperty('--pointer-x', '0');
        stage.style.setProperty('--pointer-y', '0');
      }

      function updateStagePointer() {
        stageFrame = 0;
        if (!coordinates || !pointerMotionAllowed()) {
          reset();
          return;
        }
        const rect = stage.getBoundingClientRect();
        const x = rect.width ? (coordinates.x - rect.left) / rect.width * 2 - 1 : 0;
        const y = rect.height ? (coordinates.y - rect.top) / rect.height * 2 - 1 : 0;
        stage.style.setProperty('--pointer-x', clamp(x, -1, 1).toFixed(3));
        stage.style.setProperty('--pointer-y', clamp(y, -1, 1).toFixed(3));
      }

      stage.addEventListener('pointermove', event => {
        if (!pointerMotionAllowed() || event.pointerType === 'touch') return;
        coordinates = { x: event.clientX, y: event.clientY };
        if (!stageFrame) stageFrame = requestAnimationFrame(updateStagePointer);
      }, { passive: true });
      stage.addEventListener('pointerleave', reset, { passive: true });
      stage.addEventListener('pointercancel', reset, { passive: true });
      stage.addEventListener('blur', reset);
      pointerControls.push({ reset });
    });

    if (siteAtmosphere) {
      let ambientFrame = 0;
      let coordinates = null;

      function reset() {
        if (ambientFrame) cancelAnimationFrame(ambientFrame);
        ambientFrame = 0;
        coordinates = null;
        siteAtmosphere.style.setProperty('--ambient-x', '0px');
        siteAtmosphere.style.setProperty('--ambient-y', '0px');
      }

      function updateAmbientPointer() {
        ambientFrame = 0;
        if (!coordinates || !pointerMotionAllowed()) {
          reset();
          return;
        }
        const x = window.innerWidth ? coordinates.x / window.innerWidth * 2 - 1 : 0;
        const y = window.innerHeight ? coordinates.y / window.innerHeight * 2 - 1 : 0;
        siteAtmosphere.style.setProperty('--ambient-x', `${(clamp(x, -1, 1) * 20).toFixed(2)}px`);
        siteAtmosphere.style.setProperty('--ambient-y', `${(clamp(y, -1, 1) * 14).toFixed(2)}px`);
      }

      window.addEventListener('pointermove', event => {
        if (!pointerMotionAllowed() || event.pointerType === 'touch') return;
        coordinates = { x: event.clientX, y: event.clientY };
        if (!ambientFrame) ambientFrame = requestAnimationFrame(updateAmbientPointer);
      }, { passive: true });
      window.addEventListener('pointerout', event => {
        if (event.relatedTarget === null) reset();
      }, { passive: true });
      window.addEventListener('blur', reset);
      pointerControls.push({ reset });
    }

    const sceneButtons = Array.from(document.querySelectorAll('button[data-scene]'));
    const sceneCards = Array.from(document.querySelectorAll('button.scene-card[data-artwork][data-scene]'));
    const sceneOrder = Array.from(new Set((sceneCards.length ? sceneCards : sceneButtons).map(button => button.dataset.scene)));
    const sceneStatus = document.querySelector('[data-scene-status]');
    const sceneProgress = document.querySelector('.scene-progress');
    const sceneProgressFill = document.querySelector('.scene-progress-fill');
    let selectedScene = '';
    if (sceneGallery && !sceneGallery.hasAttribute('role')) sceneGallery.setAttribute('role', 'group');
    if (sceneStatus) {
      sceneStatus.setAttribute('role', 'status');
      sceneStatus.setAttribute('aria-live', 'polite');
      sceneStatus.setAttribute('aria-atomic', 'true');
    }

    function selectScene(button) {
      if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
      const scene = button.dataset.scene;
      const index = sceneOrder.indexOf(scene);
      if (index < 0) return;
      selectedScene = scene;
      sceneButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate.dataset.scene === scene)));
      sceneCards.forEach(card => {
        const selected = card.dataset.scene === scene;
        card.dataset.active = String(selected);
        card.classList.toggle('is-selected', selected);
        card.tabIndex = selected ? 0 : -1;
      });
      const description = button.dataset.description || sceneButtons.find(candidate => candidate.dataset.scene === scene && candidate.dataset.description)?.dataset.description;
      if (sceneStatus && description) sceneStatus.textContent = description;
      sceneGallery?.style.setProperty('--active-scene', String(index));
      sceneProgress?.style.setProperty('--scene', String(index));
      sceneProgressFill?.style.setProperty('--scene', String(index));
      queuePageUpdate();
    }

    sceneButtons.forEach(button => button.addEventListener('click', () => selectScene(button)));
    selectScene(sceneButtons.find(button => button.getAttribute('aria-pressed') === 'true') || sceneButtons[0]);

    sceneGallery?.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const available = sceneCards.filter(card => !card.disabled && card.getAttribute('aria-disabled') !== 'true');
      if (!available.length) return;
      event.preventDefault();
      const focusedCard = event.target instanceof Element ? event.target.closest('button.scene-card[data-scene]') : null;
      let index = focusedCard ? available.indexOf(focusedCard) : available.findIndex(card => card.dataset.scene === selectedScene);
      if (index < 0) index = 0;
      if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = available.length - 1;
      else index = (index + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length;
      selectScene(available[index]);
      available[index].focus({ preventScroll: true });
    });

    const modeButtons = Array.from(document.querySelectorAll('button[data-mode]'));
    const modeTitle = document.querySelector('[data-mode-title]');
    const modeCopy = document.querySelector('[data-mode-copy]');
    const modeNote = document.querySelector('[data-mode-note]');
    const modeFeedback = document.querySelector('.mode-feedback');
    let modeFeedbackFrame = 0;
    let modeFeedbackTimer = 0;
    if (modeFeedback) {
      modeFeedback.setAttribute('role', 'status');
      modeFeedback.setAttribute('aria-live', 'polite');
      modeFeedback.setAttribute('aria-atomic', 'true');
    }

    function resetModeFeedbackAnimation() {
      if (modeFeedbackFrame) cancelAnimationFrame(modeFeedbackFrame);
      if (modeFeedbackTimer) clearTimeout(modeFeedbackTimer);
      modeFeedbackFrame = 0;
      modeFeedbackTimer = 0;
      modeFeedback?.classList.remove('is-changing');
    }

    function selectMode(button, announce = true) {
      if (!button || button.disabled || button.getAttribute('aria-disabled') === 'true') return;
      const mode = button.dataset.mode;
      if (modeStage) modeStage.dataset.mode = mode;
      modeButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate.dataset.mode === mode)));
      if (modeTitle && button.dataset.title !== undefined) modeTitle.textContent = button.dataset.title;
      if (modeCopy && button.dataset.copy !== undefined) modeCopy.textContent = button.dataset.copy;
      if (modeNote && button.dataset.note !== undefined) modeNote.textContent = button.dataset.note;
      resetModeFeedbackAnimation();
      if (modeFeedback && announce) {
        if (!reducedMotion.matches && !document.hidden) {
          modeFeedbackFrame = requestAnimationFrame(() => {
            modeFeedbackFrame = 0;
            modeFeedback.classList.add('is-changing');
            modeFeedbackTimer = window.setTimeout(() => {
              modeFeedback.classList.remove('is-changing');
              modeFeedbackTimer = 0;
            }, 450);
          });
        }
      }
      queuePageUpdate();
    }

    modeButtons.forEach(button => button.addEventListener('click', () => selectMode(button)));
    selectMode(modeButtons.find(button => button.getAttribute('aria-pressed') === 'true') || modeButtons.find(button => button.dataset.mode === 'default') || modeButtons[0], false);

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
      sceneGallery?.style.setProperty('--gallery-tilt', '0deg');
      siteAtmosphere?.style.setProperty('--field-y', '0px');
      siteAtmosphere?.style.setProperty('--field-turn', '0deg');
    }

    function updateMotionPreference() {
      resetPointerMotion();
      updateModeVisibility();
      if (reducedMotion.matches) {
        revealAll();
        resetSurpriseAnimation();
        resetModeFeedbackAnimation();
      }
      queuePageUpdate();
    }

    reducedMotion.addEventListener('change', updateMotionPreference);
    finePointer.addEventListener('change', updateMotionPreference);
    window.addEventListener('blur', resetPointerMotion);
    window.addEventListener('focus', queuePageUpdate);

    function updateVisibility() {
      root.classList.toggle('page-hidden', document.hidden);
      updateModeVisibility();
      if (document.hidden) {
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
        resetPointerMotion();
        resetSurpriseAnimation();
        resetModeFeedbackAnimation();
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
