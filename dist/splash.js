/**
 * Opening splash for 汽水音乐.
 *
 * The can is dist/assets/soda-can.glb: a CC0 unbranded aluminum soda can
 * (body, scored opening, pull tab). Sketchfab Yanez Designs "Soda Cans"
 * needs a login, so it is not the file in use. CC0 needs no attribution.
 * If that Sketchfab model replaces this GLB, credit Yanez Designs.
 *
 * Three.js and GLTFLoader come from the import map (jsDelivr). No build step.
 */
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1024px)');
const overlay = document.getElementById('bottle-splash');
const main = document.querySelector('main');
const nav = document.querySelector('.nav');
const skipButton = overlay?.querySelector('.bottle-splash-skip');
const debugTime = new URLSearchParams(window.location.search).has('splashdebug');

const TIMING = {
  tabPress: 0.46,
  tabLift: 0.68,
  tabDur: 1.02,
  fizz: 1.02,
  handoff: 2.75,
};

const CAN_SCALE = 14;

const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smoother = (value) => {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const easeOut = (value) => {
  const t = clamp01(value);
  return 1 - (1 - t) ** 3;
};
const lerp = (a, b, t) => a + (b - a) * t;

let phase = 'boot';
let raf = 0;
let renderer = null;
let removeListeners = () => {};
let disposeScene = () => {};

root.classList.add('splash-booted');

function shouldPlay() {
  return desktop.matches && !reducedMotion.matches && !!overlay;
}

function finish() {
  if (phase === 'done') return;
  phase = 'done';
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  removeListeners();
  disposeScene();
  root.classList.remove('splash-pending', 'splash-active');
  root.classList.add('page-settled', 'splash-reveal');
  if (main) main.inert = false;
  if (nav) nav.inert = false;
  overlay?.remove();
  window.dispatchEvent(new CustomEvent('qishui:splash-settled'));
}

function beginExit(quick) {
  if (phase === 'leave' || phase === 'done') return;
  phase = 'leave';
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
  const fallback = window.setTimeout(finish, quick ? 480 : 1100);
  overlay.addEventListener('transitionend', (event) => {
    if (event.target !== overlay || event.propertyName !== 'opacity') return;
    window.clearTimeout(fallback);
    finish();
  });
}

function requestSkip() {
  if (phase === 'play' || phase === 'boot') {
    if (renderer) beginExit(true);
    else finish();
  }
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

function lockPage() {
  root.classList.add('splash-pending', 'splash-active');
  if (main) main.inert = true;
  if (nav) nav.inert = true;
  skipButton?.focus({ preventScroll: true });
}

function loadModel(GLTFLoader) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load('assets/soda-can.glb', resolve, undefined, reject);
  });
}

if (!shouldPlay()) {
  finish();
} else {
  lockPage();
  bindInput();
  Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
  ]).then(async ([THREE, loaderMod]) => {
    if (phase !== 'boot') return;
    try {
      const gltf = await loadModel(loaderMod.GLTFLoader);
      if (phase !== 'boot') return;
      startScene(THREE, gltf);
    } catch (error) {
      finish();
    }
  }).catch(() => {
    finish();
  });
}

function startScene(THREE, gltf) {
  if (phase !== 'boot' || !overlay) return;
  const canvas = overlay.querySelector('canvas');
  if (!canvas) {
    finish();
    return;
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (error) {
    finish();
    return;
  }
  if (!renderer.getContext()) {
    finish();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x050706, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050706);
  scene.environment = buildEnvironment(THREE, renderer);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 40);
  scene.add(new THREE.AmbientLight(0xf4f7ef, 0.32));
  scene.add(new THREE.HemisphereLight(0xf3f7ff, 0x1a140c, 0.7));

  const key = new THREE.DirectionalLight(0xfff4ea, 2.8);
  key.position.set(2.4, 4.8, 3.2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd7ffe8, 2.1);
  rim.position.set(-3.2, 2.6, -2.2);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd5e4ff, 0.7);
  fill.position.set(-0.6, 1.4, 4);
  scene.add(fill);

  const can = rigCan(THREE, gltf);
  scene.add(can.rig);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.7),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(THREE), transparent: true, depthWrite: false })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.001;
  scene.add(floor);

  const fizz = buildFizz(THREE, can.model, can.mouth);

  function resize() {
    const width = overlay.clientWidth || window.innerWidth;
    const height = overlay.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  }
  resize();
  const onResize = () => resize();
  window.addEventListener('resize', onResize);

  disposeScene = () => {
    window.removeEventListener('resize', onResize);
    scene.environment?.dispose?.();
    const seen = new Set();
    scene.traverse((object) => {
      if (object.geometry && !seen.has(object.geometry)) {
        seen.add(object.geometry);
        object.geometry.dispose();
      }
      const materials = object.material ? [].concat(object.material) : [];
      materials.forEach((material) => {
        if (seen.has(material)) return;
        seen.add(material);
        Object.values(material).forEach((value) => {
          if (value && value.isTexture && !seen.has(value)) {
            seen.add(value);
            value.dispose();
          }
        });
        material.dispose();
      });
    });
    renderer.dispose();
    renderer = null;
  };

  phase = 'play';
  let elapsed = 0;
  let previous = performance.now();
  let running = true;

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      return;
    }
    if (phase === 'done') return;
    running = true;
    previous = performance.now();
    raf = requestAnimationFrame(frame);
  };
  document.addEventListener('visibilitychange', onVisibility);
  const previousDispose = disposeScene;
  disposeScene = () => {
    document.removeEventListener('visibilitychange', onVisibility);
    previousDispose();
  };

  function frame(now) {
    if (!running || phase === 'done' || !renderer) return;
    try {
      const delta = Math.min(0.1, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (phase === 'play' || phase === 'leave') elapsed += delta;
      if (debugTime) root.dataset.splashTime = elapsed.toFixed(2);

      const intro = smoother(elapsed / 0.8);
      const pose = cameraPose(elapsed, intro);
      camera.position.set(pose.x, pose.y, pose.z);
      camera.lookAt(0, pose.lookY, 0);

      can.rig.rotation.y = lerp(-1.25, -0.78, smoother(clamp01(elapsed / 3.2)));
      can.rig.rotation.z = Math.sin(elapsed * 0.6) * 0.012;
      can.rig.position.y = (1 - intro) * -0.1;

      const open = openPose(elapsed);
      can.tabPivot.rotation.z = open.tab;
      can.openingPivot.rotation.z = open.panel;

      fizz.update(elapsed);
      if (phase === 'play' && elapsed >= TIMING.handoff) beginExit(false);
      renderer.render(scene, camera);
    } catch (error) {
      finish();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function cameraPose(time, intro) {
    const outro = time > TIMING.handoff ? smoother((time - TIMING.handoff) / 0.8) : 0;
    return {
      x: lerp(1.45, 0.92, intro) * (1 - outro * 0.2),
      y: lerp(1.15, 1.62, intro) - outro * 0.12,
      z: lerp(4.35, 3.45, intro) + outro * 0.5,
      lookY: lerp(0.7, 0.98, intro) - outro * 0.06,
    };
  }

  function openPose(time) {
    if (time < TIMING.tabPress) return { tab: 0, panel: 0 };
    if (time < TIMING.tabLift) {
      const press = smoother((time - TIMING.tabPress) / (TIMING.tabLift - TIMING.tabPress));
      return { tab: -0.14 * press, panel: 0 };
    }
    const lift = easeOut((time - TIMING.tabLift) / TIMING.tabDur);
    const panel = easeOut(clamp01((lift - 0.18) / 0.82));
    return {
      tab: -0.14 * (1 - lift) + lift * 1.22,
      panel: -panel * 1.35,
    };
  }

  raf = requestAnimationFrame(frame);
}

function rigCan(THREE, gltf) {
  const model = gltf.scene;
  const tab = model.getObjectByName('soda-can_tab');
  const opening = model.getObjectByName('soda-can_opening');
  if (!tab || !opening) throw new Error('Soda can is missing its pull tab');

  model.traverse((object) => {
    if (!object.isMesh || !object.material) return;
    const materials = [].concat(object.material);
    materials.forEach((material) => {
      material.envMapIntensity = 1.25;
      if (material.metalness == null) material.metalness = 1;
    });
  });

  const tabBox = new THREE.Box3().setFromObject(tab);
  const openBox = new THREE.Box3().setFromObject(opening);
  const tabPivot = attachPivot(THREE, tab, new THREE.Vector3(0.0012, tabBox.min.y, 0));
  const openingPivot = attachPivot(THREE, opening, new THREE.Vector3(openBox.min.x, openBox.max.y, 0));

  const mouthWidth = openBox.max.x - openBox.min.x;
  const mouthDepth = openBox.max.z - openBox.min.z;
  const mouth = new THREE.Vector3(
    (openBox.min.x + openBox.max.x) / 2,
    openBox.max.y + 0.0015,
    (openBox.min.z + openBox.max.z) / 2
  );
  const hole = new THREE.Mesh(
    new THREE.CircleGeometry(1, 28),
    new THREE.MeshStandardMaterial({ color: 0x070809, roughness: 0.72, metalness: 0.15 })
  );
  hole.rotation.x = -Math.PI / 2;
  hole.scale.set(mouthWidth * 0.46, mouthDepth * 0.46, 1);
  hole.position.set(mouth.x, openBox.min.y - 0.0002, mouth.z);
  openingPivot.parent.add(hole);

  const rig = new THREE.Group();
  rig.scale.setScalar(CAN_SCALE);
  rig.add(model);
  return { rig, model, tabPivot, openingPivot, mouth };
}

function attachPivot(THREE, object, point) {
  const pivot = new THREE.Group();
  object.parent.add(pivot);
  pivot.position.copy(point);
  pivot.attach(object);
  return pivot;
}

function buildEnvironment(THREE, renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x101418);
  const geo = new THREE.PlaneGeometry(8, 8);
  const panels = [
    { color: 0xf7f8f4, pos: [0, 5.2, 0], rot: [-Math.PI / 2, 0, 0] },
    { color: 0xffffff, pos: [4.6, 2.6, 2.4], rot: [0, -1.35, 0] },
    { color: 0xd8ffe4, pos: [-4.4, 2.2, -0.4], rot: [0, 1.2, 0] },
    { color: 0x1a2228, pos: [0, 1.2, -5], rot: [0, 0, 0] },
    { color: 0x0c1012, pos: [0, -2.4, 0.2], rot: [Math.PI / 2, 0, 0] },
  ];
  panels.forEach((panel) => {
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: panel.color, side: THREE.DoubleSide }));
    mesh.position.set(panel.pos[0], panel.pos[1], panel.pos[2]);
    mesh.rotation.set(panel.rot[0], panel.rot[1], panel.rot[2]);
    envScene.add(mesh);
  });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const map = pmrem.fromScene(envScene, 0).texture;
  pmrem.dispose();
  geo.dispose();
  envScene.traverse((object) => object.material?.dispose?.());
  return map;
}

function buildFizz(THREE, parent, origin) {
  const spriteTexture = makeMistTexture(THREE);
  const neck = new THREE.Group();
  neck.position.copy(origin);
  parent.add(neck);

  const puffs = Array.from({ length: 18 }, () => {
    const material = new THREE.SpriteMaterial({
      map: spriteTexture,
      color: 0xf4fff6,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    neck.add(sprite);
    return {
      sprite,
      material,
      seed: Math.random() * 10,
      speed: 0.35 + Math.random() * 0.4,
      drift: 0.004 + Math.random() * 0.012,
      scale: 0.01 + Math.random() * 0.012,
    };
  });

  const count = 42;
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: 0xf7fff8,
    map: spriteTexture,
    size: 0.007,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const points = new THREE.Points(geometry, pointsMat);
  neck.add(points);
  const specks = Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.45 + Math.random() * 0.65,
    offset: Math.random(),
    spread: 0.0015 + Math.random() * 0.004,
  }));

  function amount(time) {
    if (time < TIMING.fizz) return 0;
    const local = time - TIMING.fizz;
    const rise = smoother(local / 0.25);
    const hold = local < 1.05 ? 1 : Math.max(0, 1 - (local - 1.05) / 0.7);
    return Math.min(1, rise * hold);
  }

  return {
    update(time) {
      const level = amount(time);
      puffs.forEach((puff) => {
        const cycle = (time * puff.speed + puff.seed) % 1;
        const rise = cycle ** 0.8 * 0.055;
        puff.sprite.position.set(
          Math.sin(time * 1.4 + puff.seed) * puff.drift * (0.4 + rise * 18),
          rise,
          Math.cos(time * 1.1 + puff.seed) * puff.drift * (0.4 + rise * 18)
        );
        const fade = Math.sin(Math.min(1, cycle) * Math.PI);
        puff.sprite.scale.setScalar(puff.scale * (0.45 + rise * 28));
        puff.material.opacity = level * fade * 0.5;
      });
      specks.forEach((speck, index) => {
        const cycle = (time * speck.speed + speck.offset) % 1;
        const rise = cycle * 0.048;
        const radius = speck.spread * (1 + rise * 40);
        positions[index * 3] = Math.cos(speck.angle + time * 2) * radius;
        positions[index * 3 + 1] = rise;
        positions[index * 3 + 2] = Math.sin(speck.angle + time * 1.4) * radius;
      });
      geometry.attributes.position.needsUpdate = true;
      pointsMat.opacity = level * 0.9;
    },
  };
}

function makeShadowTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0,0,0,0.5)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeMistTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(0.3, 'rgba(230,255,236,0.5)');
  gradient.addColorStop(1, 'rgba(230,255,236,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
