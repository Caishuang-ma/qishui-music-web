'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert/strict');
let clock = 0;
let identifier = 0;
const jobs = new Map();
const requestFrame = fn => {
  const id = ++identifier;
  jobs.set(id, { at: clock + 16, fn, frame: true });
  return id;
};
const timeout = (fn, ms) => {
  const id = ++identifier;
  jobs.set(id, { at: clock + ms, fn });
  return id;
};
function advance(ms) {
  const end = clock + ms;
  let attempts = 0;
  while (true) {
    const next = [...jobs].filter(([, job]) => job.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
    if (!next) break;
    assert(++attempts < 10000, 'No perpetual rendering loop');
    jobs.delete(next[0]);
    clock = next[1].at;
    next[1].fn(next[1].frame ? clock : undefined);
  }
  clock = end;
}

class Element {
  constructor(dataset = {}, attrs = {}) {
    this.dataset = dataset;
    this.attrs = attrs;
    this.listeners = new Map();
    this.disabled = false;
    this.values = {};
    this.style = { setProperty: (name, value) => { this.values[name] = value; } };
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      toggle: (name, force) => force ? this.classes.add(name) : this.classes.delete(name)
    };
  }
  addEventListener(type, fn, options = {}) {
    const list = this.listeners.get(type) || [];
    list.push({ fn, options });
    this.listeners.set(type, list);
  }
  setAttribute(name, value) { this.attrs[name] = value; }
  getAttribute(name) { return this.attrs[name] ?? null; }
  focus() { document.activeElement = this; }
}

const names = ['commute', 'night', 'movement', 'focus', 'relax', 'travel', 'seaside', 'driving'];
const cards = names.map((scene, index) => new Element({ artwork: scene, scene, description: `Scene: ${scene}` }, { 'aria-pressed': String(index === 0) }));
const pills = names.map((scene, index) => new Element({ scene, description: `Scene: ${scene}` }, { 'aria-pressed': String(index === 0) }));
const previous = new Element({ sceneStep: '-1' });
const next = new Element({ sceneStep: '1' });
const status = new Element();
const gallery = new Element();
let captured = null;
gallery.querySelectorAll = selector => selector === '.scene-card[data-artwork]' ? cards : [];
gallery.setPointerCapture = id => { captured = id; };
gallery.hasPointerCapture = id => captured === id;
gallery.releasePointerCapture = id => { if (captured === id) captured = null; };
const reduced = new Element();
reduced.matches = false;
const window = new Element();
Object.assign(window, { innerWidth: 1440, innerHeight: 900, setTimeout: timeout, matchMedia: () => reduced });
const document = new Element();
Object.assign(document, {
  readyState: 'complete', hidden: false,
  querySelector: selector => selector === '#scene-gallery' ? gallery : selector === '[data-scene-status]' ? status : null,
  querySelectorAll: selector => selector === 'button[data-scene]' ? [...pills, ...cards] : selector === '[data-scene-step]' ? [previous, next] : []
});
function fire(element, type, data = {}) {
  const event = {
    type, target: element, detail: 1, button: 0, pointerId: 1, isPrimary: true,
    clientX: 100, clientY: 100, deltaX: 0, deltaY: 0, deltaMode: 0,
    ctrlKey: false, altKey: false, metaKey: false, defaultPrevented: false, stopped: false,
    preventDefault() { this.defaultPrevented = true; },
    stopImmediatePropagation() { this.stopped = true; }, ...data
  };
  for (const item of element.listeners.get(type) || []) {
    item.fn(event);
    if (event.stopped) break;
  }
  return event;
}
function click(element) {
  const capturedClick = fire(gallery, 'click', { target: element });
  if (!capturedClick.stopped) fire(element, 'click');
  return capturedClick;
}
const position = () => Number(gallery.values['--carousel-position']);
const active = () => Number(gallery.values['--active-scene']);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../dist/scenes.js'), 'utf8'), {
  window, document, performance: { now: () => clock }, requestAnimationFrame: requestFrame,
  cancelAnimationFrame: id => jobs.delete(id), clearTimeout: id => jobs.delete(id), Number, Math, Set
});

assert.equal(active(), 0);
assert.equal(fire(gallery, 'dragstart').defaultPrevented, true, 'Native image drag cannot take over');
assert.equal(fire(gallery, 'wheel', { deltaX: 0.3, deltaY: 0.4 }).defaultPrevented, false, 'Subpixel jitter is ignored');
assert.equal(fire(gallery, 'wheel', { deltaX: 100, ctrlKey: true }).defaultPrevented, false);
assert.equal(fire(gallery, 'wheel', { deltaY: 100, ctrlKey: true }).defaultPrevented, false, 'Vertical pinch remains a browser gesture');
assert.equal(position(), 0);
assert.equal(fire(gallery, 'wheel', { deltaX: 20, deltaY: 100 }).defaultPrevented, true);
advance(16);
assert.equal(position(), 0.5, 'Vertical trackpad movement follows directly without adding the horizontal component');
fire(gallery, 'wheel', { deltaX: -10, deltaY: 40 });
advance(16);
assert.equal(position(), 0.7, 'Mixed axes use only the dominant component even when signs oppose');
advance(700);
assert.equal(position(), 1, 'Vertical input snaps after its inertia ends');
click(pills[0]); advance(700);
assert.equal(position(), 0);
assert.equal(fire(gallery, 'wheel', { deltaX: 100, deltaY: 2 }).defaultPrevented, true);
advance(16);
assert.equal(position(), 0.5, 'Trackpad follows directly before snapping');
fire(gallery, 'wheel', { deltaX: 40 });
advance(16);
assert.equal(position(), 0.7);
advance(700);
assert.equal(position(), 1);
assert.equal(pills[1].attrs['aria-pressed'], 'true');
assert.equal(cards[1].attrs['aria-pressed'], 'true');
assert.equal(status.textContent, 'Scene: night');
click(pills[0]); advance(700);
click(pills[7]); advance(700);
assert.equal(position(), -1, 'Card 7 is only one step away from card 0');
click(pills[0]); advance(700);
assert.equal(position(), 0, 'Card 0 is only one step away from card 7');
click(next); click(next); click(next); advance(700);
assert.equal(position(), 3, 'Rapid next clicks accumulate destinations');
fire(gallery, 'keydown', { key: 'ArrowRight' }); advance(700);
assert.equal(active(), 4);
assert.equal(document.activeElement, cards[4]);
fire(gallery, 'keydown', { key: 'Home' }); advance(700);
assert.equal(active(), 0);
fire(gallery, 'pointerdown', { target: cards[0] });
fire(gallery, 'pointermove', { clientX: 104 });
assert.equal(captured, null, 'Click-sized movement does not capture the pointer');
fire(gallery, 'pointerup', { clientX: 104 });
click(cards[2]); advance(700);
assert.equal(active(), 2);
const dragOrigin = position();
fire(gallery, 'pointerdown', { target: cards[2] });
fire(gallery, 'pointermove', { clientX: -20 }); advance(16);
assert.equal(position(), dragOrigin + 0.6, 'Drag follows displacement');
assert.equal(captured, 1);
fire(gallery, 'pointermove', { clientX: -20, clientY: 500 }); advance(16);
assert.equal(position(), dragOrigin + 0.6, 'A horizontal drag keeps its axis despite larger vertical displacement');
fire(gallery, 'pointerup', { clientX: -20, clientY: 500 });
assert.equal(click(cards[7]).stopped, true, 'Drag release cannot select a card');
advance(700);
assert.equal(position(), dragOrigin + 1);
const verticalDragOrigin = position();
fire(gallery, 'pointerdown', { pointerId: 2, pointerType: 'touch' });
fire(gallery, 'pointermove', { pointerId: 2, pointerType: 'touch', clientX: 103, clientY: 96 });
assert.equal(captured, null, 'A short one-finger movement retains click behavior');
fire(gallery, 'pointermove', { pointerId: 2, pointerType: 'touch', clientX: 103, clientY: 92 }); advance(16);
assert.equal(position(), verticalDragOrigin + 0.04, 'Eight vertical pixels lock the one-finger drag axis');
assert.equal(captured, 2);
fire(gallery, 'pointermove', { pointerId: 2, pointerType: 'touch', clientX: 500, clientY: -20 }); advance(16);
assert.equal(position(), verticalDragOrigin + 0.6, 'Vertical drag keeps its axis despite larger horizontal displacement');
fire(gallery, 'pointerdown', { pointerId: 3, pointerType: 'touch', isPrimary: false });
fire(gallery, 'pointermove', { pointerId: 3, pointerType: 'touch', isPrimary: false, clientY: -1000 }); advance(16);
assert.equal(position(), verticalDragOrigin + 0.6, 'A second finger cannot change the active drag');
fire(gallery, 'pointerup', { pointerId: 3, pointerType: 'touch', isPrimary: false, clientY: -1000 });
assert.equal(captured, 2, 'A second finger cannot end the primary drag');
fire(gallery, 'pointerup', { pointerId: 2, pointerType: 'touch', clientX: 500, clientY: -20 });
assert.equal(click(cards[0]).stopped, true, 'Vertical dragging also suppresses release clicks');
advance(700);
assert.equal(position(), verticalDragOrigin + 1);
const beforeReduced = position();
click(next); advance(32);
reduced.matches = true; fire(reduced, 'change');
assert.equal(position(), beforeReduced + 1, 'Reduced motion completes the requested scene immediately');
assert.equal(jobs.size, 0);
click(previous);
assert.equal(position(), beforeReduced, 'Reduced motion changes scenes without animation');
reduced.matches = false; fire(reduced, 'change');
const beforeLineWheel = position();
fire(gallery, 'wheel', { deltaX: 8, deltaMode: 1 }); advance(16);
assert.equal(position(), beforeLineWheel + 0.64, 'Line deltas normalize to pixels');
fire(gallery, 'wheel', { deltaY: -2, deltaMode: 1 }); advance(16);
assert.equal(position(), beforeLineWheel + 0.48, 'Vertical line deltas normalize to pixels too');
document.hidden = true; fire(document, 'visibilitychange');
assert.equal(position(), beforeLineWheel);
assert.equal(jobs.size, 0, 'Backgrounding cancels all input and animation jobs');
document.hidden = false;
const beforeCaptureLoss = position();
fire(gallery, 'pointerdown'); fire(gallery, 'pointermove', { clientX: 80 }); advance(16);
fire(gallery, 'lostpointercapture', { clientX: 0 }); advance(700);
assert.equal(position(), beforeCaptureLoss, 'Capture loss preserves the last genuine pointer coordinate');
assert.equal(jobs.size, 0);
console.log('PASS: two-axis wheel follow/snap, dominant-axis input, pinch passthrough, locked one-finger drag, shortest path, queued controls, keyboard/ARIA, drag/click, reduced motion, line deltas, background cleanup and capture loss.');
