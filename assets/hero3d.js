/* Hero background — a rotating point-cloud sphere, three.js.
   Skipped entirely on reduced-motion, narrow viewports, or when WebGL
   is unavailable; the hero reads fine with the canvas simply hidden. */
(async () => {
  const wait = (sel) => new Promise((r) => {
    const t = setInterval(() => { const e = document.querySelector(sel); if (e) { clearInterval(t); r(e); } }, 120);
    setTimeout(() => { clearInterval(t); r(null); }, 15000);
  });
  const cv = await wait('#hero3d');
  if (!cv) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = cv.getContext('webgl2') || cv.getContext('webgl');
  if (!gl || reduce || innerWidth < 760) { cv.style.display = 'none'; return; }

  const THREE = await import('three');
  const renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  cam.position.set(0, 0, 9);

  const N = 120, pts = [];
  for (let i = 0; i < N; i++) {
    const a = Math.acos(1 - 2 * (i + 0.5) / N), b = Math.PI * (1 + Math.sqrt(5)) * i, r = 3.3;
    pts.push(new THREE.Vector3(r * Math.sin(a) * Math.cos(b), r * Math.sin(a) * Math.sin(b) * 0.72, r * Math.cos(a)));
  }
  const seg = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (pts[i].distanceTo(pts[j]) < 1.25) seg.push(pts[i], pts[j]);

  const group = new THREE.Group();
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(seg),
    new THREE.LineBasicMaterial({ color: 0x201e1d, transparent: true, opacity: 0.17 })
  );
  group.add(lines);
  group.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({ color: 0x201e1d, size: 0.055, transparent: true, opacity: 0.5 })));
  const hot = pts.filter((_, i) => i % 13 === 0);
  group.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(hot), new THREE.PointsMaterial({ color: 0xec3013, size: 0.12 })));
  scene.add(group);

  let mx = 0, my = 0, tx = 0, ty = 0, live = true;
  addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth - 0.5) * 0.5; ty = (e.clientY / innerHeight - 0.5) * 0.35; }, { passive: true });
  const fit = () => { const r = cv.getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); };
  new ResizeObserver(fit).observe(cv);
  new IntersectionObserver((es) => { live = es[0].isIntersecting; }).observe(cv);
  fit();

  const tick = () => {
    requestAnimationFrame(tick);
    if (!live) return;
    mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
    group.rotation.y += 0.0016; group.rotation.x = my; group.position.x = mx * 1.6;
    renderer.render(scene, cam);
  };
  tick();
})();
