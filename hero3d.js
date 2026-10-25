import * as THREE from 'three';

// Realistic Chandigarh blocks — textured facades, roofs, trees, roads, cars, clouds
try {
  const canvas = document.getElementById('hero3d');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe4eaff);
  scene.fog = new THREE.Fog(0xe4eaff, 30, 68);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
  camera.position.set(14, 12, 16);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9c2ef, 1.05));
  const sun = new THREE.DirectionalLight(0xfff2dd, 1.7);
  sun.position.set(10, 18, 8);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({ color: 0xcfe3c2, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ---- helpers ----
  function rng(seed) {
    return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  }
  function facade(base, glass, cols, rows, litRatio, seed) {
    const R = rng(seed);
    const mc = document.createElement('canvas'); mc.width = 128; mc.height = 256;
    const ec = document.createElement('canvas'); ec.width = 128; ec.height = 256;
    const m = mc.getContext('2d'), e = ec.getContext('2d');
    m.fillStyle = base; m.fillRect(0, 0, 128, 256);
    e.fillStyle = '#000'; e.fillRect(0, 0, 128, 256);
    const mx = 12, my = 12;
    const ww = (128 - mx * 2) / cols, wh = (256 - my * 2) / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = mx + i * ww + 2, y = my + j * wh + 3, w = ww - 4, h = wh - 6;
        const lit = R() < litRatio;
        m.fillStyle = lit ? '#ffdf9e' : glass;
        m.fillRect(x, y, w, h);
        m.fillStyle = 'rgba(255,255,255,.35)';
        m.fillRect(x, y, w, 2);
        if (lit) { e.fillStyle = '#ffca7a'; e.fillRect(x, y, w, h); }
      }
    }
    const map = new THREE.CanvasTexture(mc);
    map.colorSpace = THREE.SRGBColorSpace;
    const glow = new THREE.CanvasTexture(ec);
    return { map, glow };
  }

  const T1 = facade('#efe6d4', '#33506e', 5, 9, 0.3, 11);
  const T2 = facade('#dfe5f2', '#2b4560', 6, 10, 0.25, 22);
  const T3 = facade('#e8d9c8', '#3a3f55', 4, 7, 0.35, 33);
  const T4 = facade('#e5e9f5', '#2b4560', 6, 13, 0.25, 55);
  const T5 = facade('#f0e8d8', '#33506e', 5, 6, 0.3, 66);
  const TG = facade('#9fc3e0', '#1f3a5f', 7, 12, 0.2, 44);
  const facades = [T1, T2, T3];

  function towerMat(f, glassy) {
    return new THREE.MeshStandardMaterial({
      map: f.map, emissiveMap: f.glow, emissive: 0xffc873, emissiveIntensity: 0.5,
      roughness: glassy ? 0.3 : 0.8, metalness: glassy ? 0.5 : 0.05
    });
  }
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8b93a8, roughness: 0.95 });
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x2b2f3a, roughness: 0.7 });

  const rig = new THREE.Group();
  scene.add(rig);
  const R = rng(7);

  function addTower(x, z, glassy) {
    const h = glassy ? 6 + R() * 3 : 3 + R() * 4;
    const f = glassy ? TG : h >= 6 ? T4 : h >= 4 ? facades[Math.floor(R() * 3)] : T5;
    const side = towerMat(f, glassy);
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, h, 1.7), [side, side, roofMat, roofMat, side, side]);
    b.position.set(x, h / 2, z);
    rig.add(b);
    const slab = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.18, 1.9), roofMat);
    slab.position.set(x, h + 0.09, z);
    rig.add(slab);
    if (R() < 0.35) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 10), tankMat);
      tank.position.set(x + 0.4, h + 0.48, z - 0.3);
      rig.add(tank);
    }
  }

  const plaster = [0xf3e9d2, 0xe8dcc8, 0xdfe8f0];
  const roofCols = [0xa85b3f, 0x6b7280, 0x8a5a44];
  const winMat = new THREE.MeshStandardMaterial({ color: 0x2b4560, emissive: 0xffca7a, emissiveIntensity: 0.4 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a3a32, roughness: 0.9 });

  function addHouse(x, z) {
    const g = new THREE.Group();
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.3, 1.9),
      new THREE.MeshStandardMaterial({ color: plaster[Math.floor(R() * 3)], roughness: 0.9 })
    );
    base.position.y = 0.65;
    g.add(base);
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(1.95, 1.0, 4),
      new THREE.MeshStandardMaterial({ color: roofCols[Math.floor(R() * 3)], roughness: 0.85, flatShading: true })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 1.8;
    g.add(roof);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 0.06), doorMat);
    door.position.set(-0.4, 0.4, 0.96);
    g.add(door);
    [-0.4, 0.8].forEach(wx => {
      const w = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.06), winMat);
      w.position.set(wx, 0.75, 0.96);
      g.add(w);
    });
    g.position.set(x, 0, z);
    g.rotation.y = (R() < 0.5 ? 0 : Math.PI / 2) + (R() - 0.5) * 0.15;
    rig.add(g);
  }

  // ---- city layout ----
  for (let gx = -4; gx <= 4; gx++) {
    for (let gz = -4; gz <= 4; gz++) {
      const x = gx * 3, z = gz * 3;
      if (Math.abs(gx) < 1 && Math.abs(gz) < 1) continue; // central lake
      if (gz === 2 || gx === -2) continue; // avenues
      if (R() < 0.12) continue; // gaps/parks
      const r = R();
      if (r < 0.34) addHouse(x, z);
      else if (r < 0.46) addTower(x, z, true);
      else addTower(x, z, false);
    }
  }

  // ---- central lake ----
  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 40),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.15, metalness: 0.5 })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.y = 0.03;
  rig.add(lake);

  // ---- avenues + dashes ----
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x3c4356, roughness: 1 });
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const roadX = new THREE.Mesh(new THREE.PlaneGeometry(60, 2.4), roadMat);
  roadX.rotation.x = -Math.PI / 2; roadX.position.set(0, 0.02, 6);
  scene.add(roadX);
  const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 60), roadMat);
  roadZ.rotation.x = -Math.PI / 2; roadZ.position.set(-6, 0.02, 0);
  scene.add(roadZ);
  for (let i = -9; i <= 9; i++) {
    if (Math.abs(i * 3) < 3) continue;
    const d1 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.14), dashMat);
    d1.rotation.x = -Math.PI / 2; d1.position.set(i * 3, 0.04, 6);
    scene.add(d1);
    const d2 = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.9), dashMat);
    d2.rotation.x = -Math.PI / 2; d2.position.set(-6, 0.04, i * 3);
    scene.add(d2);
  }

  // ---- trees ----
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f9e5f, roughness: 1, flatShading: true });
  function addTree(x, z) {
    const t = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.6, 7), trunkMat);
    trunk.position.y = 0.3;
    t.add(trunk);
    const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 7), leafMat);
    c1.position.y = 1.1;
    t.add(c1);
    const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.85, 7), leafMat);
    c2.position.y = 1.75;
    t.add(c2);
    t.position.set(x, 0, z);
    const s = 0.8 + R() * 0.5;
    t.scale.set(s, s, s);
    scene.add(t);
  }
  for (let i = -9; i <= 9; i++) {
    if (Math.abs(i * 3) < 3.5) continue;
    addTree(i * 3 + 1.8, 7.6); addTree(i * 3 - 1.8, 4.4);
    addTree(-4.4, i * 3 + 1.8); addTree(-7.6, i * 3 - 1.8);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    addTree(Math.cos(a) * 4.2, Math.sin(a) * 4.2);
  }

  // ---- cars ----
  const carCols = [0xd64545, 0x3a6fd8, 0xf2b134, 0xe8e8ec, 0x222831];
  const cars = [];
  function addCar(road, lane, dir, speed) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.42, 0.7),
      new THREE.MeshStandardMaterial({ color: carCols[Math.floor(R() * carCols.length)], roughness: 0.35, metalness: 0.6 })
    );
    body.position.y = 0.32;
    g.add(body);
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.36, 0.62),
      new THREE.MeshStandardMaterial({ color: 0x18242f, roughness: 0.2, metalness: 0.4 })
    );
    cab.position.set(-0.05, 0.68, 0);
    g.add(cab);
    const hl = new THREE.MeshBasicMaterial({ color: 0xfff6c9 });
    [-0.2, 0.2].forEach(o => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), hl);
      h.position.set(0.72, 0.32, o);
      g.add(h);
    });
    if (road === 'z') g.rotation.y = Math.PI / 2;
    if (dir < 0) g.rotation.y += Math.PI;
    scene.add(g);
    cars.push({ g, road, lane, dir, speed, p: (R() - 0.5) * 44 });
  }
  addCar('x', 5.4, 1, 5); addCar('x', 6.6, -1, 6); addCar('x', 5.4, 1, 4);
  addCar('z', -5.4, 1, 4.5); addCar('z', -6.6, -1, 5.5); addCar('z', -5.4, 1, 6.5);

  // ---- clouds ----
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.92 });
  const clouds = [];
  function addCloud(y, s, speed) {
    const g = new THREE.Group();
    [[0, 0, 0, 1.6], [1.5, -0.2, 0.3, 1.1], [-1.5, -0.2, -0.2, 1.2], [0.5, 0.6, -0.4, 1.0]].forEach(p => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 10), cloudMat);
      b.position.set(p[0], p[1], p[2]);
      b.scale.y = 0.55;
      g.add(b);
    });
    g.position.set((R() - 0.5) * 44, y, (R() - 0.5) * 30 - 6);
    g.scale.set(s, s, s);
    scene.add(g);
    clouds.push({ g, speed });
  }
  addCloud(9.5, 1.4, 0.5); addCloud(10.5, 1.8, 0.35); addCloud(9, 1.1, 0.65); addCloud(10, 1.5, 0.45);

  // ---- mouse parallax + loop ----
  let mx = 0, my = 0;
  window.addEventListener('pointermove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function size() {
    const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', size);
  size();

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    cars.forEach(c => {
      c.p += c.dir * c.speed * dt;
      if (c.p > 24) c.p = -24;
      if (c.p < -24) c.p = 24;
      if (c.road === 'x') c.g.position.set(c.p, 0, c.lane);
      else c.g.position.set(c.lane, 0, c.p);
    });
    clouds.forEach(c => {
      c.g.position.x += c.speed * dt;
      if (c.g.position.x > 28) c.g.position.x = -28;
    });
    lake.position.y = 0.03 + Math.sin(t * 1.5) * 0.008;
    rig.rotation.y = Math.sin(t * 0.1) * 0.22 + mx * 0.22;
    camera.position.y = 12 + my * -1.2;
    camera.lookAt(0, 1.5, 0);
    renderer.render(scene, camera);
  })();
} catch (err) {
  document.getElementById('hero3d')?.parentElement.classList.add('hero3d-fallback');
}
