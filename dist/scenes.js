(() => {
  'use strict';

  function initScenes() {
    const gallery = document.querySelector('#scene-gallery');
    if (!gallery) return;
    const cards = Array.from(gallery.querySelectorAll('.scene-card[data-artwork]'));
    const buttons = Array.from(document.querySelectorAll('button[data-scene]'));
    const steps = Array.from(document.querySelectorAll('[data-scene-step]'));
    const scenes = Array.from(new Set(cards.map(card => card.dataset.scene || card.dataset.artwork)));
    if (!scenes.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const status = document.querySelector('[data-scene-status]');
    const count = scenes.length;
    const pixelsPerScene = 200;
    const dragThreshold = 8;
    const wheelStopDelay = 140;
    const wrap = value => ((value % count) + count) % count;
    const sceneOf = element => element.dataset.scene || element.dataset.artwork;
    const disabled = element => element.disabled || element.getAttribute('aria-disabled') === 'true';
    const initial = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
    let position = Math.max(0, scenes.indexOf(initial?.dataset.scene || scenes[0]));
    let selectedIndex = -1;
    let animation = null;
    let animationFrame = 0;
    let inputFrame = 0;
    let pendingWheel = 0;
    let wheelStopTimer = 0;
    let pointer = null;
    let suppressClick = false;
    let suppressClickTimer = 0;

    if (status) {
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.setAttribute('aria-atomic', 'true');
    }

    function render() {
      gallery.style.setProperty('--carousel-position', position.toFixed(5));
      const index = wrap(Math.round(position));
      gallery.style.setProperty('--active-scene', String(index));
      if (index === selectedIndex) return;
      selectedIndex = index;
      const scene = scenes[index];
      buttons.forEach(button => button.setAttribute('aria-pressed', String(sceneOf(button) === scene)));
      cards.forEach(card => {
        const selected = sceneOf(card) === scene;
        card.dataset.active = String(selected);
        card.classList.toggle('is-selected', selected);
        card.tabIndex = selected ? 0 : -1;
        card.setAttribute('aria-pressed', String(selected));
      });
      const description = cards.find(card => sceneOf(card) === scene && card.dataset.description)?.dataset.description
        || buttons.find(button => sceneOf(button) === scene && button.dataset.description)?.dataset.description;
      if (status && description) status.textContent = description;
    }

    function cancelAnimation() {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      animation = null;
    }

    function clearWheelTimer() {
      if (wheelStopTimer) clearTimeout(wheelStopTimer);
      wheelStopTimer = 0;
    }

    function flushInput() {
      if (inputFrame) cancelAnimationFrame(inputFrame);
      inputFrame = 0;
      if (pointer?.dragging) {
        const distance = pointer.axis === 'y' ? pointer.lastY - pointer.originY : pointer.lastX - pointer.originX;
        position = pointer.originPosition - distance / pixelsPerScene;
      } else if (pendingWheel) {
        position += pendingWheel;
      }
      pendingWheel = 0;
      render();
    }

    function queueInput() {
      if (!inputFrame) inputFrame = requestAnimationFrame(flushInput);
    }

    function releasePointer() {
      if (!pointer) return;
      const id = pointer.id;
      pointer = null;
      try {
        if (gallery.hasPointerCapture?.(id)) gallery.releasePointerCapture(id);
      } catch {
        // A browser can release capture before its cancellation event arrives.
      }
    }

    function suppressDraggedClick() {
      suppressClick = true;
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
      suppressClickTimer = window.setTimeout(() => {
        suppressClick = false;
        suppressClickTimer = 0;
      }, 400);
    }

    function snapTo(target) {
      flushInput();
      clearWheelTimer();
      cancelAnimation();
      releasePointer();
      gallery.classList.add('is-scrubbing');
      const distance = target - position;
      if (reduced.matches || document.hidden || Math.abs(distance) < 0.0001) {
        position = target;
        render();
        gallery.classList.remove('is-scrubbing');
        return;
      }
      animation = {
        from: position,
        to: target,
        start: performance.now(),
        duration: Math.min(520, 260 + Math.abs(distance) * 70)
      };

      function animate(now) {
        animationFrame = 0;
        if (!animation || document.hidden) return;
        const progress = Math.min(1, Math.max(0, (now - animation.start) / animation.duration));
        const eased = 1 - (1 - progress) ** 3;
        position = animation.from + (animation.to - animation.from) * eased;
        render();
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
        else {
          position = animation.to;
          animation = null;
          render();
          gallery.classList.remove('is-scrubbing');
        }
      }

      animationFrame = requestAnimationFrame(animate);
    }

    function goToScene(scene) {
      const index = scenes.indexOf(scene);
      if (index < 0) return;
      flushInput();
      // Equivalent turns keep the requested card on the shortest circular path.
      const target = index + Math.round((position - index) / count) * count;
      snapTo(target);
    }

    function stepScene(direction, focusCard = false) {
      flushInput();
      const origin = animation ? animation.to : Math.round(position);
      let target = origin;
      let card;
      for (let attempt = 0; attempt < count; attempt += 1) {
        target += direction;
        card = cards.find(candidate => sceneOf(candidate) === scenes[wrap(target)] && !disabled(candidate));
        if (card) break;
      }
      if (!card) return;
      snapTo(target);
      if (focusCard) card.focus({ preventScroll: true });
    }

    gallery.addEventListener('wheel', event => {
      if (event.ctrlKey || document.hidden) return;
      const multiplierX = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerWidth : 1;
      const multiplierY = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const x = event.deltaX * multiplierX;
      const y = event.deltaY * multiplierY;
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      const delta = Math.abs(x) >= Math.abs(y) ? x : y;
      if (Math.abs(delta) <= 0.5) return;
      event.preventDefault();
      if (pointer?.dragging) return;
      cancelAnimation();
      gallery.classList.add('is-scrubbing');
      pendingWheel += delta / pixelsPerScene;
      queueInput();
      clearWheelTimer();
      wheelStopTimer = window.setTimeout(() => {
        wheelStopTimer = 0;
        flushInput();
        snapTo(Math.round(position));
      }, wheelStopDelay);
    }, { passive: false });

    gallery.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.isPrimary === false || event.ctrlKey || document.hidden) return;
      if (pointer) return;
      pointer = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: event.clientX,
        originY: event.clientY,
        originPosition: position,
        lastX: event.clientX,
        lastY: event.clientY,
        axis: null,
        dragging: false
      };
    });
    gallery.addEventListener('dragstart', event => event.preventDefault());

    gallery.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const x = event.clientX - pointer.startX;
      const y = event.clientY - pointer.startY;
      if (!pointer.dragging) {
        if (Math.max(Math.abs(x), Math.abs(y)) < dragThreshold) return;
        flushInput();
        cancelAnimation();
        clearWheelTimer();
        pointer.originPosition = position;
        pointer.axis = Math.abs(x) >= Math.abs(y) ? 'x' : 'y';
        pointer.dragging = true;
        gallery.classList.add('is-scrubbing');
        try {
          gallery.setPointerCapture(event.pointerId);
        } catch {
          // Dragging remains usable while the pointer stays over the gallery.
        }
      }
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      event.preventDefault();
      queueInput();
    }, { passive: false });

    function finishPointer(event) {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dragged = pointer.dragging;
      if (dragged) {
        if (event.type === 'pointerup') {
          if (typeof event.clientX === 'number') pointer.lastX = event.clientX;
          if (typeof event.clientY === 'number') pointer.lastY = event.clientY;
        }
        flushInput();
        suppressDraggedClick();
      }
      releasePointer();
      if (dragged) snapTo(Math.round(position));
    }

    gallery.addEventListener('pointerup', finishPointer);
    gallery.addEventListener('pointercancel', finishPointer);
    gallery.addEventListener('lostpointercapture', finishPointer);
    gallery.addEventListener('pointerleave', () => {
      if (pointer && !pointer.dragging) releasePointer();
    });
    window.addEventListener('pointerup', finishPointer);
    window.addEventListener('pointercancel', finishPointer);
    gallery.addEventListener('click', event => {
      if (!suppressClick || event.detail === 0) return;
      suppressClick = false;
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
      suppressClickTimer = 0;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, { capture: true });

    buttons.forEach(button => button.addEventListener('click', () => {
      if (!disabled(button)) goToScene(sceneOf(button));
    }));
    steps.forEach(button => button.addEventListener('click', () => {
      if (disabled(button)) return;
      const value = button.dataset.sceneStep;
      const direction = value === 'prev' || value === 'previous' ? -1 : value === 'next' ? 1 : Math.sign(Number(value));
      if (direction) stepScene(direction);
    }));

    gallery.addEventListener('keydown', event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        stepScene(event.key === 'ArrowRight' ? 1 : -1, true);
        return;
      }
      const available = cards.filter(card => !disabled(card));
      const card = event.key === 'Home' ? available[0] : available[available.length - 1];
      if (card) {
        goToScene(sceneOf(card));
        card.focus({ preventScroll: true });
      }
    });

    function settleImmediately() {
      const target = animation ? animation.to : Math.round(position);
      const wasDragging = pointer?.dragging;
      cancelAnimation();
      clearWheelTimer();
      if (inputFrame) cancelAnimationFrame(inputFrame);
      inputFrame = 0;
      pendingWheel = 0;
      releasePointer();
      if (wasDragging) suppressDraggedClick();
      position = target;
      render();
      gallery.classList.remove('is-scrubbing');
    }

    reduced.addEventListener('change', settleImmediately);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) settleImmediately();
    });
    window.addEventListener('blur', settleImmediately);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initScenes, { once: true });
  else initScenes();
})();
