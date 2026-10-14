/**
 * Opening splash for 汽水音乐.
 *
 * The bottle is a procedural green glass stand-in. Sketchfab
 * "Soda Bottle Green" by smart61 (CC BY 4.0) needs a login to download:
 * https://sketchfab.com/3d-models/soda-bottle-green-e32733d7941748a49483d6a26be82953
 * Drop that GLB at assets/soda-bottle-green.glb and keep the smart61 credit.
 * Do not replace this with a branded contour bottle.
 *
 * Three.js is loaded from the import map (jsDelivr). No build step.
 */
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1024px)');
const overlay = document.getElementById('bottle-splash');
const main = document.querySelector('main');
const nav = document.querySelector('.nav');
const skipButton = overlay?.querySelector('.bottle-splash-skip');

const TIMING = {
  capPress: 0.42,
  capLift: 0.58,
  capLiftDur: 1.05,
  fizz: 0.92,
  handoff: 2.7,
};

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

if (!shouldPlay()) {
  finish();
} else {
  lockPage();
  bindInput();
  import('three')
    .then((THREE) => {
      if (phase !== 'boot') return;
      try {
        startScene(THREE);
      } catch (error) {
        finish();
      }
    })
    .catch(() => {
      finish();
    });
}

function startScene(THREE) {
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
  renderer.toneMappingExposure = 1.12;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050706);
  scene.environment = buildEnvironment(THREE, renderer);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  scene.add(new THREE.AmbientLight(0xf4f7ef, 0.28));
  scene.add(new THREE.HemisphereLight(0xefffe8, 0x07110c, 0.72));

  const key = new THREE.DirectionalLight(0xfff6ea, 2.6);
  key.position.set(3.1, 4.6, 3.4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0xb8ff62, 2.4);
  rim.position.set(-3.4, 2.2, -2.6);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd5e4ff, 0.55);
  fill.position.set(-0.4, 1.1, 4.2);
  scene.add(fill);
  const glow = new THREE.PointLight(0x3ef08a, 1.6, 5.2, 2);
  glow.position.set(0.15, 1.05, 0.85);
  scene.add(glow);

  const bottle = buildBottle(THREE, renderer);
  scene.add(bottle.group);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.7),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(THREE), transparent: true, depthWrite: false })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  scene.add(floor);

  const fizz = buildFizz(THREE, bottle.group);

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
    fizz.dispose();
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
        if (material.map && !seen.has(material.map)) {
          seen.add(material.map);
          material.map.dispose();
        }
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

      const intro = smoother(elapsed / 0.85);
      const pose = cameraPose(elapsed, intro);
      camera.position.set(pose.x, pose.y, pose.z);
      camera.lookAt(0, pose.lookY, 0);

      bottle.group.rotation.y = lerp(-0.48, 0.18, smoother(clamp01(elapsed / 3.3)));
      bottle.group.rotation.z = Math.sin(elapsed * 0.65) * 0.012;
      bottle.group.position.y = (1 - intro) * -0.16;

      const cap = capPose(elapsed);
      bottle.cap.position.y = bottle.capBase + cap.y;
      bottle.cap.position.x = cap.x;
      bottle.cap.position.z = cap.z;
      bottle.cap.rotation.z = cap.tilt;
      bottle.cap.rotation.y = cap.spin;

      fizz.update(elapsed, delta);
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
      x: lerp(1.55, 0.82, intro) * (1 - outro * 0.2),
      y: lerp(1.2, 1.42, intro) - outro * 0.12,
      z: lerp(7.5, 6.55, intro) + outro * 0.55,
      lookY: lerp(1.12, 1.28, intro) - outro * 0.05,
    };
  }

  function capPose(time) {
    if (time < TIMING.capPress) return { y: 0, x: 0, z: 0, tilt: 0, spin: 0 };
    if (time < TIMING.capLift) {
      const press = smoother((time - TIMING.capPress) / (TIMING.capLift - TIMING.capPress));
      return { y: -0.014 * press, x: 0, z: 0, tilt: 0, spin: 0 };
    }
    const lift = easeOut((time - TIMING.capLift) / TIMING.capLiftDur);
    return {
      y: -0.014 * (1 - lift) + lift * 0.46,
      x: lift * 0.2,
      z: lift * -0.05,
      tilt: lift * 0.72,
      spin: lift * 1.15,
    };
  }

  raf = requestAnimationFrame(frame);
}

function buildEnvironment(THREE, renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x08140f);
  const geo = new THREE.PlaneGeometry(8, 8);
  const panels = [
    { color: 0xf5fff2, pos: [0, 5.2, 0], rot: [-Math.PI / 2, 0, 0] },
    { color: 0xffffff, pos: [4.6, 2.4, 2.2], rot: [0, -1.35, 0] },
    { color: 0xd4ff6a, pos: [-4.5, 2.1, -0.6], rot: [0, 1.25, 0] },
    { color: 0x10281c, pos: [0, 1.4, -5], rot: [0, 0, 0] },
    { color: 0x07110c, pos: [0, -2.4, 0.4], rot: [Math.PI / 2, 0, 0] },
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

function buildBottle(THREE, renderer) {
  const group = new THREE.Group();
  const profile = [
    [0.001, 0],
    [0.16, 0.02],
    [0.34, 0.06],
    [0.46, 0.12],
    [0.515, 0.22],
    [0.538, 0.4],
    [0.54, 1.18],
    [0.52, 1.36],
    [0.4, 1.5],
    [0.26, 1.62],
    [0.175, 1.74],
    [0.152, 1.92],
    [0.16, 2.04],
    [0.198, 2.1],
    [0.172, 2.15],
  ].map(([radius, y]) => new THREE.Vector2(radius, y));

  const glass = new THREE.Mesh(
    new THREE.LatheGeometry(profile, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0xf3fff6,
      metalness: 0,
      roughness: 0.045,
      transmission: 1,
      thickness: 0.72,
      ior: 1.48,
      attenuationColor: new THREE.Color(0x12a84e),
      attenuationDistance: 0.26,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.2,
      transparent: true,
    })
  );
  group.add(glass);

  const liquidProfile = [
    [0.001, 0.05],
    [0.28, 0.08],
    [0.4, 0.16],
    [0.445, 0.36],
    [0.45, 1.12],
    [0.4, 1.2],
    [0.28, 1.24],
    [0.001, 1.25],
  ].map(([radius, y]) => new THREE.Vector2(radius, y));
  const liquid = new THREE.Mesh(
    new THREE.LatheGeometry(liquidProfile, 48),
    new THREE.MeshStandardMaterial({
      color: 0x1fce6c,
      roughness: 0.22,
      metalness: 0.02,
      emissive: 0x064626,
      emissiveIntensity: 0.45,
    })
  );
  group.add(liquid);

  const surface = new THREE.Mesh(
    new THREE.CircleGeometry(0.4, 40),
    new THREE.MeshStandardMaterial({
      color: 0x8dffb4,
      roughness: 0.12,
      metalness: 0.05,
      emissive: 0x147845,
      emissiveIntensity: 0.55,
    })
  );
  surface.rotation.x = -Math.PI / 2;
  surface.position.y = 1.245;
  group.add(surface);

  const labelTexture = makeLabelTexture(THREE);
  const label = new THREE.Mesh(
    new THREE.CylinderGeometry(0.552, 0.552, 0.52, 64, 1, true),
    new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.68,
      metalness: 0.02,
      side: THREE.FrontSide,
    })
  );
  label.position.y = 0.78;
  group.add(label);
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      paintLabel(labelTexture.image.getContext('2d'), labelTexture.image.width, labelTexture.image.height);
      labelTexture.needsUpdate = true;
    });
  }
  labelTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.105, 0.02, 10, 32),
    new THREE.MeshStandardMaterial({ color: 0x062415, roughness: 0.55, metalness: 0.08 })
  );
  mouth.rotation.x = Math.PI / 2;
  mouth.position.y = 2.12;
  group.add(mouth);

  const metal = new THREE.MeshStandardMaterial({
    color: 0xd5dbe1,
    metalness: 1,
    roughness: 0.24,
    envMapIntensity: 1.25,
  });
  const cap = new THREE.Group();
  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.214, 0.078, 21, 1, false), metal);
  skirt.position.y = 0.04;
  cap.add(skirt);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.188, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.48), metal);
  dome.position.y = 0.072;
  cap.add(dome);
  const seal = new THREE.Mesh(
    new THREE.CircleGeometry(0.09, 28),
    new THREE.MeshStandardMaterial({ color: 0xc4ff3b, roughness: 0.38, metalness: 0.08, emissive: 0x6ea318, emissiveIntensity: 0.18 })
  );
  seal.rotation.x = -Math.PI / 2;
  seal.position.y = 0.248;
  cap.add(seal);
  const capBase = 2.128;
  cap.position.y = capBase;
  group.add(cap);

  const bubbleGeo = new THREE.SphereGeometry(0.016, 10, 10);
  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xf4fff6,
    emissive: 0xd8ffe4,
    emissiveIntensity: 0.35,
    roughness: 0.15,
    transparent: true,
    opacity: 0.75,
  });
  const bubbles = Array.from({ length: 12 }, () => {
    const mesh = new THREE.Mesh(bubbleGeo, bubbleMat);
    group.add(mesh);
    return {
      mesh,
      angle: Math.random() * Math.PI * 2,
      radius: 0.08 + Math.random() * 0.28,
      speed: 0.08 + Math.random() * 0.16,
      offset: Math.random(),
    };
  });
  group.userData.tickBubbles = (time) => {
    bubbles.forEach((bubble) => {
      const cycle = (time * bubble.speed + bubble.offset) % 1;
      const y = 0.28 + cycle * 0.9;
      const radius = Math.min(bubble.radius, 0.36);
      bubble.mesh.position.set(Math.cos(bubble.angle + time * 0.35) * radius, y, Math.sin(bubble.angle + time * 0.35) * radius);
      const fade = Math.sin(cycle * Math.PI);
      bubble.mesh.scale.setScalar(0.45 + fade * 0.9);
    });
  };

  return { group, cap, capBase };
}

function makeLabelTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  paintLabel(canvas.getContext('2d'), canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  return texture;
}

function paintLabel(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#f4f7ee';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#00d76f';
  ctx.fillRect(0, 0, width, 16);
  ctx.fillRect(0, height - 16, width, 16);
  ctx.fillStyle = '#061109';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 96px "Noto Sans SC", "PingFang SC", sans-serif';
  ctx.fillText('汽水', width / 2, height * 0.44);
  ctx.font = '600 34px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#1a5c34';
  ctx.fillText('QISHUI', width / 2, height * 0.72);
}

function buildFizz(THREE, bottle) {
  const spriteTexture = makeMistTexture(THREE);
  const neck = new THREE.Group();
  neck.position.set(0, 2.18, 0);
  bottle.add(neck);

  const puffs = Array.from({ length: 22 }, () => {
    const material = new THREE.SpriteMaterial({
      map: spriteTexture,
      color: 0xf3fff4,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const sprite = new THREE.Sprite(material);
    neck.add(sprite);
    return {
      sprite,
      material,
      seed: Math.random() * 10,
      speed: 0.28 + Math.random() * 0.38,
      drift: 0.05 + Math.random() * 0.16,
      scale: 0.16 + Math.random() * 0.28,
    };
  });

  const bubbleTexture = spriteTexture;
  const pointsMat = new THREE.PointsMaterial({
    color: 0xf7fff8,
    map: bubbleTexture,
    size: 0.055,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const count = 56;
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const points = new THREE.Points(geometry, pointsMat);
  neck.add(points);
  const specks = Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: 0.45 + Math.random() * 0.7,
    offset: Math.random(),
    spread: 0.012 + Math.random() * 0.05,
  }));

  function amount(time) {
    if (time < TIMING.fizz) return 0;
    const local = time - TIMING.fizz;
    const rise = smoother(local / 0.28);
    const hold = local < 1.15 ? 1 : Math.max(0, 1 - (local - 1.15) / 0.85);
    const burst = local < 0.22 ? 0.35 : 0;
    return Math.min(1, rise * hold + burst);
  }

  return {
    update(time) {
      const level = amount(time);
      bottle.userData.tickBubbles?.(time);
      puffs.forEach((puff) => {
        const cycle = (time * puff.speed + puff.seed) % 1;
        const rise = cycle ** 0.85 * 0.95;
        puff.sprite.position.set(
          Math.sin(time * 1.15 + puff.seed) * puff.drift * (0.25 + rise),
          rise,
          Math.cos(time * 0.95 + puff.seed * 1.3) * puff.drift * (0.25 + rise)
        );
        const fade = Math.sin(Math.min(1, cycle) * Math.PI);
        puff.sprite.scale.setScalar(puff.scale * (0.35 + rise * 1.8));
        puff.material.opacity = level * fade * 0.42;
      });
      specks.forEach((speck, index) => {
        const cycle = (time * speck.speed + speck.offset) % 1;
        const rise = cycle * 0.72;
        const radius = speck.spread * (1 + rise * 3.2);
        positions[index * 3] = Math.cos(speck.angle + time) * radius;
        positions[index * 3 + 1] = rise;
        positions[index * 3 + 2] = Math.sin(speck.angle + time * 0.8) * radius;
      });
      geometry.attributes.position.needsUpdate = true;
      pointsMat.opacity = level * 0.85;
    },
    dispose() {},
  };
}

function makeShadowTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(0,0,0,0.48)');
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
  gradient.addColorStop(0.28, 'rgba(226,255,214,0.55)');
  gradient.addColorStop(0.62, 'rgba(186,255,196,0.16)');
  gradient.addColorStop(1, 'rgba(186,255,196,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
