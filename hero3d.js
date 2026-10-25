import * as THREE from 'three';

// 3D animated Chandigarh blocks — pastel city grid, matches light theme
try {
  const canvas = document.getElementById('hero3d');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe4eaff);
  scene.fog = new THREE.Fog(0xe4eaff, 26, 60);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 200);
  camera.position.set(13, 11, 15);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9c2ef, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(8, 16, 6);
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0xdfe6ff, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const grid = new THREE.GridHelper(40, 20, 0x4f46e5, 0xaeb9e8);
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  grid.position.y = 0.02;
  scene.add(grid);

  // City blocks with pulsing heights
  const palette = [0x4f46e5, 0x0ea5e9, 0x10b981, 0x7c6cff, 0x34d399];
  const towers = [];
  const geo = new THREE.BoxGeometry(1.4, 1, 1.4);
  for (let x = -4; x <= 4; x++) {
    for (let z = -4; z <= 4; z++) {
      if (Math.abs(x) < 1 && Math.abs(z) < 1) continue; // central park
      const h = 1 + Math.random() * 4.5;
      const mat = new THREE.MeshStandardMaterial({
        color: palette[(x + z + 20) % palette.length],
        roughness: 0.55, metalness: 0.25, flatShading: true
      });
      const b = new THREE.Mesh(geo, mat);
      b.position.set(x * 3, h / 2, z * 3);
      b.scale.y = h;
      b.userData = { h, ph: Math.random() * Math.PI * 2 };
      scene.add(b);
      towers.push(b);
    }
  }

  // Central Sukhna glow
  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 40),
    new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2, metalness: 0.4 })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.y = 0.03;
  scene.add(lake);

  // Floating particles
  const n = 220, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 44;
    pos[i * 3 + 1] = Math.random() * 14;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x4f46e5, size: 0.14, transparent: true, opacity: 0.65 }));
  scene.add(stars);

  // Mouse parallax
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
  const rig = new THREE.Group();
  scene.add(rig);
  // move world into rig for gentle orbit
  towers.forEach(t => rig.attach(t));
  rig.attach(lake);

  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    towers.forEach(b => {
      b.scale.y = b.userData.h * (1 + 0.12 * Math.sin(t * 1.4 + b.userData.ph));
      b.position.y = b.scale.y / 2;
    });
    stars.rotation.y = t * 0.03;
    rig.rotation.y = Math.sin(t * 0.12) * 0.25 + mx * 0.25;
    camera.position.y = 11 + my * -1.2;
    camera.lookAt(0, 1.5, 0);
    renderer.render(scene, camera);
  })();
} catch (err) {
  document.getElementById('hero3d')?.parentElement.classList.add('hero3d-fallback');
}
