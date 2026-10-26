import * as THREE from 'three';
// Luxury dusk city — glass towers, villas, lit avenues, lake, traffic
try {
const canvas = document.getElementById('hero3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1030);
scene.fog = new THREE.Fog(0x0b1030, 34, 78);
const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 220);
camera.position.set(14, 11, 17);
scene.add(new THREE.HemisphereLight(0xbfc8ff, 0x1d2440, 0.85));
const sun = new THREE.DirectionalLight(0xffd9a8, 1.6);
sun.position.set(-12, 20, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -30; sun.shadow.camera.right = 30;
sun.shadow.camera.top = 30; sun.shadow.camera.bottom = -30;
scene.add(sun);
const fill = new THREE.DirectionalLight(0x6ea8ff, 0.5);
fill.position.set(14, 10, -12);
scene.add(fill);
// ground: sector blocks
const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80),
new THREE.MeshStandardMaterial({ color: 0x101a36, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const blockMat = new THREE.MeshStandardMaterial({ color: 0x182449, roughness: 1 });
for (let gx = -4; gx <= 4; gx++) for (let gz = -4; gz <= 4; gz++) {
if (Math.abs(gx) < 1 && Math.abs(gz) < 1) continue;
const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 2.6), blockMat);
b.position.set(gx * 3, 0.04, gz * 3); b.receiveShadow = true; scene.add(b);
}
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
const R = rng(7);
// facade texture: glass + warm lit windows + balcony slabs
function facade(base, glass, cols, rows, lit, seed) {
const r2 = rng(seed);
const c = document.createElement('canvas'); c.width = 256; c.height = 512;
const e = document.createElement('canvas'); e.width = 256; e.height = 512;
const m = c.getContext('2d'), g = e.getContext('2d');
const grd = m.createLinearGradient(0, 0, 0, 512);
grd.addColorStop(0, base); grd.addColorStop(1, '#20263c');
m.fillStyle = grd; m.fillRect(0, 0, 256, 512);
g.fillStyle = '#000'; g.fillRect(0, 0, 256, 512);
const ww = 256 / cols, wh = 512 / rows;
for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
const x = i * ww + 5, y = j * wh + 7, w = ww - 10, h = wh - 13;
const on = r2() < lit;
const warm = ['#ffd58f', '#ffc46b', '#fff1c4'][Math.floor(r2() * 3)];
m.fillStyle = on ? warm : glass; m.fillRect(x, y, w, h);
m.fillStyle = 'rgba(255,255,255,.4)'; m.fillRect(x, y, w, 3);
m.fillStyle = 'rgba(0,0,0,.35)'; m.fillRect(x, y + h - 4, w, 4);
if (on) { g.fillStyle = warm; g.fillRect(x, y, w, h); }
}
const map = new THREE.CanvasTexture(c); map.colorSpace = THREE.SRGBColorSpace;
map.anisotropy = 4;
return { map, glow: new THREE.CanvasTexture(e) };
}
const F = [facade('#e9e2d2', '#27435f', 5, 12, 0.42, 11), facade('#dbe3f2', '#223c58', 6, 14, 0.36, 22), facade('#e6d5bd', '#33455e', 4, 10, 0.45, 33)];
const G = facade('#8fb6d9', '#16283e', 7, 16, 0.3, 44);
const tall = facade('#cfd8ec', '#1f3a5c', 6, 18, 0.34, 55);
function towerMat(f, glassy) {
return new THREE.MeshStandardMaterial({ map: f.map, emissiveMap: f.glow, emissive: 0xffc873, emissiveIntensity: 1.1, roughness: glassy ? 0.25 : 0.7, metalness: glassy ? 0.65 : 0.12 });
}
const roofMat = new THREE.MeshStandardMaterial({ color: 0x9aa2b5, roughness: 0.9 });
const parapetMat = new THREE.MeshStandardMaterial({ color: 0x6f7690, roughness: 0.9 });
const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
const beacons = [];
function addTower(x, z, glassy) {
const h = glassy ? 7 + R() * 3.5 : 3.5 + R() * 4;
const f = glassy ? G : h >= 7 ? tall : F[Math.floor(R() * 3)];
const side = towerMat(f, glassy);
const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, h, 1.7), [side, side, roofMat, roofMat, side, side]);
b.position.set(x, h / 2, z); b.castShadow = true; b.receiveShadow = true; scene.add(b);
const par = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.22, 1.85), parapetMat);
par.position.set(x, h + 0.11, z); scene.add(par);
if (R() < 0.5) {
const ac = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), parapetMat);
ac.position.set(x + 0.4, h + 0.35, z - 0.3); ac.castShadow = true; scene.add(ac);
}
if (h >= 7) {
const bc = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), beaconMat);
bc.position.set(x, h + 0.35, z); scene.add(bc); beacons.push(bc);
}
// ground-floor retail glow strip
const strip = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.28, 1.75),
new THREE.MeshStandardMaterial({ color: 0x111622, emissive: 0xffc46b, emissiveIntensity: 1.4 }));
strip.position.set(x, 0.35, z); scene.add(strip);
}
// luxury villa: 2 floors + glass front + warm interior + boundary wall
const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fc4e8, roughness: 0.12, metalness: 0.7, emissive: 0xffd9a0, emissiveIntensity: 0.55 });
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf0e7d3, roughness: 0.85 });
const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a3a32, roughness: 0.85 });
const gateLight = new THREE.MeshBasicMaterial({ color: 0xffd98a });
function addVilla(x, z) {
const g = new THREE.Group();
const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.1, 1.8), wallMat);
b1.position.y = 0.55; b1.castShadow = true; b1.receiveShadow = true; g.add(b1);
const gl = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.8, 0.06), glassMat);
gl.position.set(0, 0.6, 0.92); g.add(gl);
const b2 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.9, 1.4), wallMat);
b2.position.set(-0.2, 1.55, -0.15); b2.castShadow = true; g.add(b2);
const slab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.14, 2.0), parapetMat);
slab.position.y = 2.06; slab.castShadow = true; g.add(slab);
const door = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.8, 0.06), woodMat);
door.position.set(0.5, 0.4, 0.92); g.add(door);
[-0.9, 0.9].forEach(px => {
const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.9), parapetMat);
p.position.set(px * 1.25, 0.35, 0); g.add(p);
const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), gateLight);
lamp.position.set(px * 1.25, 0.78, 0); g.add(lamp);
});
g.position.set(x, 0, z);
g.rotation.y = (R() < 0.5 ? 0 : Math.PI / 2) + (R() - 0.5) * 0.12;
scene.add(g);
}
for (let gx = -4; gx <= 4; gx++) for (let gz = -4; gz <= 4; gz++) {
const x = gx * 3, z = gz * 3;
if (Math.abs(gx) < 1 && Math.abs(gz) < 1) continue;
if (gz === 2 || gx === -2) continue;
if (R() < 0.1) continue;
const r = R();
if (r < 0.36) addVilla(x, z);
else if (r < 0.48) addTower(x, z, true);
else addTower(x, z, false);
}
// lake + glowing promenade ring
const lake = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48),
new THREE.MeshStandardMaterial({ color: 0x0e4a5e, emissive: 0x1fb6d4, emissiveIntensity: 0.55, roughness: 0.1, metalness: 0.75 }));
lake.rotation.x = -Math.PI / 2; lake.position.y = 0.06; scene.add(lake);
const ring = new THREE.Mesh(new THREE.RingGeometry(2.7, 3.0, 48),
new THREE.MeshBasicMaterial({ color: 0xffd98a, side: THREE.DoubleSide }));
ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; scene.add(ring);
// roads: asphalt + edge lines + dashes + sidewalks
const roadMat = new THREE.MeshStandardMaterial({ color: 0x232936, roughness: 0.95 });
const dashMat = new THREE.MeshBasicMaterial({ color: 0xf5f0dc });
const edgeMat = new THREE.MeshBasicMaterial({ color: 0xffc46b });
const walkMat = new THREE.MeshStandardMaterial({ color: 0x3a4260, roughness: 1 });
function road(w, l, x, z, alongX) {
const r = new THREE.Mesh(new THREE.PlaneGeometry(w, l), roadMat);
r.rotation.x = -Math.PI / 2; r.position.set(x, 0.09, z); r.receiveShadow = true; scene.add(r);
const sw = new THREE.Mesh(new THREE.PlaneGeometry(alongX ? w : w + 1.2, alongX ? l + 1.2 : l), walkMat);
sw.rotation.x = -Math.PI / 2; sw.position.set(x, 0.06, z); sw.receiveShadow = true; scene.add(sw);
}
road(64, 2.6, 0, 6, true); road(2.6, 64, -6, 0, false);
for (let i = -10; i <= 10; i++) {
if (Math.abs(i * 3) < 3.2) continue;
const d = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.14), dashMat);
d.rotation.x = -Math.PI / 2; d.position.set(i * 3, 0.11, 6); scene.add(d);
const d2 = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.9), dashMat);
d2.rotation.x = -Math.PI / 2; d2.position.set(-6, 0.11, i * 3); scene.add(d2);
}
[[64, 0.1, 0, 7.35], [64, 0.1, 0, 4.65], [0.1, 64, -4.65, 0], [0.1, 64, -7.35, 0]].forEach(a => {
const e = new THREE.Mesh(new THREE.PlaneGeometry(a[0], a[1]), edgeMat);
e.rotation.x = -Math.PI / 2; e.position.set(a[2], 0.11, a[3]); scene.add(e);
});
// streetlights with warm pools
const poleMat = new THREE.MeshStandardMaterial({ color: 0x2a2f45, roughness: 0.6, metalness: 0.6 });
const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe2a1 });
const poolMat = new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.16 });
for (let i = -9; i <= 9; i += 2) {
if (Math.abs(i * 3) < 3.5) continue;
[[i * 3, 7.9], [i * 3, 4.1], [-4.1, i * 3], [-7.9, i * 3]].forEach(p => {
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 8), poleMat);
pole.position.set(p[0], 1.2, p[1]); pole.castShadow = true; scene.add(pole);
const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), lampMat);
lamp.position.set(p[0], 2.45, p[1]); scene.add(lamp);
const pool = new THREE.Mesh(new THREE.CircleGeometry(1.1, 20), poolMat);
pool.rotation.x = -Math.PI / 2; pool.position.set(p[0], 0.12, p[1]); scene.add(pool);
});
}
// trees: layered canopy, varied greens
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4128, roughness: 1 });
const greens = [0x2f9e5f, 0x37b06a, 0x277e4e, 0x4cc07a];
function addTree(x, z) {
const t = new THREE.Group();
const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.7, 8), trunkMat);
trunk.position.y = 0.35; trunk.castShadow = true; t.add(trunk);
const col = greens[Math.floor(R() * greens.length)];
const lm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, flatShading: true });
[[0, 1.15, 0, 0.62], [0.3, 1.5, 0.15, 0.45], [-0.28, 1.5, -0.12, 0.42]].forEach(p => {
const s = new THREE.Mesh(new THREE.SphereGeometry(p[3], 9, 8), lm);
s.position.set(p[0], p[1], p[2]); s.castShadow = true; t.add(s);
});
t.position.set(x, 0, z);
const s = 0.85 + R() * 0.5; t.scale.set(s, s, s);
scene.add(t);
}
for (let i = -10; i <= 10; i++) {
if (Math.abs(i * 3) < 3.5) continue;
addTree(i * 3 + 1.9, 7.9); addTree(i * 3 - 1.9, 4.1);
addTree(-4.1, i * 3 + 1.9); addTree(-7.9, i * 3 - 1.9);
}
for (let i = 0; i < 10; i++) {
const a = (i / 10) * Math.PI * 2;
addTree(Math.cos(a) * 4.4, Math.sin(a) * 4.4);
}
// cars: glossy body + cabin + wheels + lights
const carCols = [0xc0392b, 0x2e6bdf, 0xe8b62a, 0xe8e8ec, 0x151a26, 0x0e7c5b];
const cars = [], wheels = [];
const tyreMat = new THREE.MeshStandardMaterial({ color: 0x0c0e14, roughness: 0.9 });
const hubMat = new THREE.MeshStandardMaterial({ color: 0xb9c1d4, roughness: 0.3, metalness: 0.8 });
function addCar(road2, lane, dir, speed) {
const g = new THREE.Group();
const paint = new THREE.MeshStandardMaterial({ color: carCols[Math.floor(R() * carCols.length)], roughness: 0.25, metalness: 0.7 });
const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.72), paint);
body.position.y = 0.32; body.castShadow = true; g.add(body);
const cab = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.34, 0.62),
new THREE.MeshStandardMaterial({ color: 0x101c2a, roughness: 0.15, metalness: 0.5 }));
cab.position.set(-0.05, 0.66, 0); cab.castShadow = true; g.add(cab);
const wg = new THREE.CylinderGeometry(0.17, 0.17, 0.12, 12);
[[-0.5, 0.36], [0.5, 0.36], [-0.5, -0.36], [0.5, -0.36]].forEach(p => {
const w = new THREE.Mesh(wg, tyreMat);
w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.17, p[1]); g.add(w); wheels.push(w);
const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.13, 8), hubMat);
hub.rotation.x = Math.PI / 2; hub.position.set(p[0], 0.17, p[1]); g.add(hub);
});
const hl = new THREE.MeshBasicMaterial({ color: 0xfff3c0 });
const tl = new THREE.MeshBasicMaterial({ color: 0xff2d2d });
[-0.2, 0.2].forEach(o => {
const h = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), hl);
h.position.set(0.76, 0.34, o); g.add(h);
const t2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), tl);
t2.position.set(-0.76, 0.34, o); g.add(t2);
});
if (road2 === 'z') g.rotation.y = Math.PI / 2;
if (dir < 0) g.rotation.y += Math.PI;
scene.add(g);
cars.push({ g, road: road2, lane, dir, speed, p: (R() - 0.5) * 48 });
}
addCar('x', 5.4, 1, 5); addCar('x', 6.6, -1, 6.5); addCar('x', 5.4, 1, 4);
addCar('z', -5.4, 1, 4.5); addCar('z', -6.6, -1, 5.5); addCar('z', -5.4, 1, 7);
// clouds
const cloudMat = new THREE.MeshStandardMaterial({ color: 0xd8c9b8, roughness: 1, transparent: true, opacity: 0.8 });
const clouds = [];
function addCloud(y, s, sp) {
const g = new THREE.Group();
[[0, 0, 0, 1.6], [1.5, -0.2, 0.3, 1.1], [-1.5, -0.2, -0.2, 1.2], [0.5, 0.6, -0.4, 1.0]].forEach(p => {
const b = new THREE.Mesh(new THREE.SphereGeometry(p[3], 12, 10), cloudMat);
b.position.set(p[0], p[1], p[2]); b.scale.y = 0.55; g.add(b);
});
g.position.set((R() - 0.5) * 46, y, (R() - 0.5) * 30 - 6);
g.scale.set(s, s, s); scene.add(g); clouds.push({ g, speed: sp });
}
addCloud(10, 1.5, 0.5); addCloud(11, 1.6, 0.35); addCloud(9.5, 1.2, 0.65); addCloud(10.5, 1.5, 0.45);
let mx = 0, my = 0;
window.addEventListener('pointermove', e => {
mx = (e.clientX / window.innerWidth - 0.5) * 2;
my = (e.clientY / window.innerHeight - 0.5) * 2;
});
function size() {
const w = canvas.parentElement.clientWidth, h = canvas.parentElement.clientHeight;
renderer.setSize(w, h, false);
camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', size); size();
const clock = new THREE.Clock();
(function loop() {
requestAnimationFrame(loop);
const dt = Math.min(clock.getDelta(), 0.05);
const t = clock.elapsedTime;
cars.forEach(c => {
c.p += c.dir * c.speed * dt;
if (c.p > 26) c.p = -26; if (c.p < -26) c.p = 26;
if (c.road === 'x') c.g.position.set(c.p, 0.05, c.lane);
else c.g.position.set(c.lane, 0.05, c.p);
});
wheels.forEach(w => { w.rotation.y += dt * 9; });
clouds.forEach(c => { c.g.position.x += c.speed * dt; if (c.g.position.x > 30) c.g.position.x = -30; });
beacons.forEach((b, i) => { b.visible = Math.sin(t * 3 + i) > 0; });
lake.position.y = 0.06 + Math.sin(t * 1.5) * 0.008;
camera.position.x = 14 + Math.sin(t * 0.08) * 1.2 + mx * 3;
camera.position.y = 11 - my * 1.5;
camera.position.z = 17 + Math.cos(t * 0.06) * 1.0;
camera.lookAt(0, 1.4, 0);
renderer.render(scene, camera);
})();
} catch (err) {
document.getElementById('hero3d')?.parentElement.classList.add('hero3d-fallback');
}
