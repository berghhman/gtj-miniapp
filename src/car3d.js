/* GTJ: 3D-машина в карточке подбора.
   Один WebGL-холст на всё приложение: при каждой перерисовке экрана он переезжает в новый контейнер,
   поэтому контекст не пересоздаётся. Машина «выезжает» один раз на модель, дальше её можно крутить пальцем.
   Сборка: npm run build:3d (esbuild → vendor/car3d.js). */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Box3, Vector3, Mesh, PlaneGeometry,
  MeshBasicMaterial, CanvasTexture, DirectionalLight, PMREMGenerator, ACESFilmicToneMapping, SRGBColorSpace,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const LEN = 4.6;                 // любую модель приводим к длине обычного седана, метры
const cache = new Map();         // url → Promise<Object3D>
const played = new Set();        // модели, которые уже выезжали

let renderer, scene, camera, rig, car, shadow, host, url, ro, io;
let anim = null, raf = 0, visible = true;
let drag = null, spin = 0, vel = 0;

function shadowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  r.addColorStop(0, 'rgba(0,0,0,.75)'); r.addColorStop(.55, 'rgba(0,0,0,.35)'); r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

function init() {
  renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  const cv = renderer.domElement; cv.className = 'h3d-cv';
  cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Модель автомобиля, можно повернуть пальцем');
  scene = new Scene();
  scene.environment = new PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new DirectionalLight(0xffffff, 1.4); key.position.set(-4, 6, 5); scene.add(key);
  camera = new PerspectiveCamera(26, 16 / 9, 0.1, 200);
  rig = new Group(); scene.add(rig);
  shadow = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.scale.set(LEN * 0.62, LEN * 1.18, 1); shadow.position.y = 0.005;
  scene.add(shadow);

  /* горизонтальный свайп крутит машину, вертикальный остаётся прокруткой страницы */
  cv.addEventListener('pointerdown', e => { if (anim) return; drag = { x: e.clientX, t: performance.now(), s: spin }; vel = 0; cv.setPointerCapture(e.pointerId); host && host.classList.add('touched'); });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x; const now = performance.now();
    const ns = drag.s + dx * 0.012; vel = (ns - spin) / Math.max(16, now - (drag.lt || drag.t)) * 16; drag.lt = now;
    spin = ns; loop();
  });
  const up = () => { if (!drag) return; drag = null; loop(); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

  ro = new ResizeObserver(() => size());
  io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) loop(); }, { threshold: 0.2 });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
}

function load(u) {
  if (!cache.has(u)) cache.set(u, new GLTFLoader().loadAsync(u).then(g => {
    const o = g.scene;
    const b = new Box3().setFromObject(o); const s = b.getSize(new Vector3());
    const k = LEN / Math.max(s.x, s.z); o.scale.setScalar(k);
    const b2 = new Box3().setFromObject(o); const c = b2.getCenter(new Vector3());
    o.position.set(-c.x, -b2.min.y, -c.z);
    if (s.x > s.z) o.rotation.y = Math.PI / 2; // длинной стороной вдоль оси z
    const w = new Group(); w.add(o); return w;
  }));
  return cache.get(u);
}

function size() {
  if (!host) return;
  const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
  renderer.setSize(w, h, false); camera.aspect = w / h;
  /* три четверти спереди; дистанция подобрана так, чтобы машина целиком помещалась по ширине */
  const d = 7.9 * Math.max(1, 1.55 / camera.aspect);
  camera.position.set(-d * 0.62, d * 0.26, d * 0.78); camera.lookAt(0, 0.95, 0.1);
  camera.updateProjectionMatrix(); loop();
}

const easeOut = t => 1 - Math.pow(1 - t, 3);
function frame(now) {
  raf = 0;
  if (!car || !host) return;
  let more = false;
  if (anim) {
    const t = Math.min(1, (now - anim.t0) / 1500);
    const e = easeOut(t);
    car.position.z = -16 * (1 - e);
    car.rotation.x = 0;
    if (t >= 1) {
      /* лёгкий клевок носом при остановке */
      const k = Math.min(1, (now - anim.t0 - 1500) / 700);
      car.rotation.x = 0.03 * Math.sin(k * Math.PI) * (1 - k);
      if (k >= 1) { anim = null; car.rotation.x = 0; host.classList.add('ready'); } else more = true;
    } else more = true;
  } else if (!drag && Math.abs(vel) > 0.0005) { spin += vel; vel *= 0.92; more = true; }
  rig.rotation.y = spin;
  shadow.position.z = car.position.z; shadow.rotation.z = spin;
  shadow.material.opacity = anim ? Math.max(0.15, 1 + car.position.z / 16) : 1;
  renderer.render(scene, camera);
  if ((more || drag) && visible && !document.hidden) loop();
}
function loop() { if (!raf && renderer) raf = requestAnimationFrame(frame); }

/* el — контейнер .h3d, u — адрес модели .glb; onFail — вернуть фото, если WebGL недоступен */
export async function attach(el, u, onFail) {
  try {
    if (!renderer) init();
  } catch (e) { onFail && onFail(e); return; }
  if (host !== el) {
    if (host) { ro.unobserve(host); io.unobserve(host); }
    host = el; el.appendChild(renderer.domElement); ro.observe(el); io.observe(el);
  }
  if (u !== url) {
    url = u; spin = 0; vel = 0;
    let o; try { o = await load(u); } catch (e) { onFail && onFail(e); return; }
    if (url !== u) return;
    if (car) rig.remove(car);
    car = o; rig.add(car);
  }
  size();
  if (!played.has(u)) {
    played.add(u);
    if (REDUCED) { car.position.z = 0; el.classList.add('ready'); }
    else { el.classList.remove('ready'); anim = { t0: performance.now() }; }
  } else if (!anim) el.classList.add('ready');
  el.classList.add('on');
  loop();
}
/* экран без машины: холст отцепляем, рисование останавливаем */
export function park() {
  if (raf) cancelAnimationFrame(raf); raf = 0;
  if (host) { ro.unobserve(host); io.unobserve(host); }
  host = null; anim = null;
  if (renderer && renderer.domElement.parentNode) renderer.domElement.remove();
}
export function supported() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}
