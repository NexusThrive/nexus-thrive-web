/**
 * Pantalla de carga: el logo se arma con puntos en el centro (entrada), se deshace punto a punto
 * (salida) y dos paneles se abren hacia arriba y abajo. Solo en la portada y solo con movimiento permitido (el <head> decide con la clase
 * `preloading`). Al terminar avisa con el evento `nx:ready`.
 */
import gsap from 'gsap';
import { LOCKUP_BOX, MARK_BOX, N_PATH, THRIVE_LETTERS } from '../components/react/logo-paths';

const root = document.documentElement;
const el = document.querySelector<HTMLElement>('[data-preloader]');

const reveal = () => {
	root.classList.remove('preloading');
	if (el) el.hidden = true;
	window.dispatchEvent(new Event('nx:ready'));
};

/* Salida: una View Transition entre la pantalla de carga y la página (el navegador mezcla las dos
   instantáneas con las animaciones de global.css). Sin soporte, se abre el telón como respaldo. */
const finish = (animated: boolean) => {
	// Vista o saltada, no vuelve a salir.
	try { localStorage.setItem('nx-intro-seen', '1'); } catch {}
	if (!el || !animated) { reveal(); return; }
	const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
	if (doc.startViewTransition) {
		let done = false;
		const once = () => { if (!done) { done = true; reveal(); } };
		doc.startViewTransition(once);
		// Respaldo: si el navegador demora o descarta la transición, la página se libera igualmente.
		window.setTimeout(once, 1200);
		return;
	}
	root.classList.remove('preloading');
	window.dispatchEvent(new Event('nx:ready'));
	el.classList.add('is-done');
	const stage = el.querySelector<HTMLElement>('.pl-stage');
	if (stage) gsap.to(stage, { z: 380, scale: 1.12, opacity: 0, filter: 'blur(10px)', duration: 0.7, ease: 'power3.in' });
	window.setTimeout(() => { el.hidden = true; }, 850);
};

if (!el || !root.classList.contains('preloading')) {
	if (el) el.hidden = true;
} else if (document.visibilityState === 'visible') {
	play(el);
} else {
	// Pestaña en segundo plano o precargada por el navegador: espera a que alguien la esté mirando.
	const onVisible = () => {
		if (document.visibilityState !== 'visible') return;
		document.removeEventListener('visibilitychange', onVisible);
		play(el);
	};
	document.addEventListener('visibilitychange', onVisible);
}

function play(el: HTMLElement) {
	const cvs = el.querySelector<HTMLCanvasElement>('[data-pl-dots]')!;
	// Entrada: el logo llega desde lejos y ligeramente inclinado, y se enfoca (perspectiva + desenfoque).
	gsap.fromTo(el.querySelector('.pl-stage'), { z: -420, rotationX: 16, scale: 0.95, filter: 'blur(14px)', opacity: 0, transformPerspective: 1100 }, { z: 0, rotationX: 0, scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.3, ease: 'power3.out', clearProps: 'filter' });
	const ctx = cvs.getContext('2d')!;

	/* El lockup completo (N + THRIVE) se arma con puntos redondos y con espacio entre ellos.
	   La N usa celdas grandes; la palabra, celdas más finas para que las letras se lean. */
	const W = Math.round(Math.min(340, window.innerWidth * 0.66));
	const k = W / LOCKUP_BOX.w;
	const H = Math.round(LOCKUP_BOX.h * k);
	const dpr = Math.min(2, window.devicePixelRatio || 1);
	cvs.width = Math.round(W * dpr);
	cvs.height = Math.round(H * dpr);
	cvs.style.width = W + 'px';
	cvs.style.height = H + 'px';
	ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

	const Q = 4; // supermuestreo del lienzo auxiliar
	const off = document.createElement('canvas');
	off.width = W * Q;
	off.height = H * Q;
	const o = off.getContext('2d', { willReadFrequently: true })!;
	o.setTransform(k * Q, 0, 0, k * Q, -LOCKUP_BOX.x * k * Q, -LOCKUP_BOX.y * k * Q);
	o.fill(new Path2D(N_PATH));
	for (const l of THRIVE_LETTERS) {
		o.save();
		o.translate(l.x, l.y);
		const g = new Path2D(l.d);
		o.fill(g);
		o.lineWidth = 6; // engrosa un poco las letras para que los puntos (iguales a los de la N) las dibujen
		o.lineJoin = 'round';
		o.stroke(g);
		o.restore();
	}
	const data = o.getImageData(0, 0, off.width, off.height).data;
	const markBottom = (MARK_BOX.y + MARK_BOX.h - LOCKUP_BOX.y) * k; // donde acaba la N, en px
	const cellN = W / 44;
	const cellT = cellN; // misma malla y mismo tamaño de punto que la N
	const cell = cellN;

	type Dot = { x: number; y: number; t: number; r: number };
	const dots: Dot[] = [];
	const sample = (y0: number, y1: number, c: number, rScale: number) => {
		const cols = Math.floor(W / c), rows = Math.floor((y1 - y0) / c);
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < cols; i++) {
				let sum = 0, n = 0;
				const px0 = Math.floor(i * c * Q), px1 = Math.floor((i + 1) * c * Q);
				const py0 = Math.floor((y0 + j * c) * Q), py1 = Math.floor((y0 + (j + 1) * c) * Q);
				for (let yy = py0; yy < py1; yy += 2) for (let xx = px0; xx < px1; xx += 2) { sum += data[(yy * off.width + xx) * 4 + 3]; n++; }
				const cov = n ? sum / (n * 255) : 0;
				if (cov < 0.35) continue;
				const x = i * c + c / 2, y = y0 + j * c + c / 2;
				// los puntos aparecen en diagonal, de arriba a la izquierda a abajo a la derecha
				dots.push({ x, y, t: (x / W) * 0.45 + (y / H) * 0.45 + Math.random() * 0.1, r: c * rScale * (0.6 + 0.4 * cov) });
			}
		}
	};
	sample(0, markBottom + cellN * 0.5, cellN, 0.3);
	sample(markBottom + cellN * 0.5, H, cellT, 0.3);

	const ink = getComputedStyle(el).color || '#1c1c20';
	const gold = getComputedStyle(root).getPropertyValue('--nx-gold-500').trim() || '#d4af37';
	const out3 = (u: number) => 1 - Math.pow(1 - u, 3);

	// Logo real en SVG, encima del lienzo: aparece cuando los puntos terminan de armarse.
	const svgHost = el.querySelector<HTMLElement>('[data-pl-svg]')!;
	svgHost.style.width = W + 'px';
	svgHost.style.height = H + 'px';
	const N_R = MARK_BOX.x + MARK_BOX.w; // borde derecho de la N
	const N_B = MARK_BOX.y + MARK_BOX.h; // base de la N
	const SW = 64; // trazo extra: Montserrat llega a 800 y la N del logo es mucho más densa
	const CAP = MARK_BOX.h - SW; // con el trazo, «EXUS» mide lo mismo de alto que la N
	const FS = CAP / 0.7; // la altura de mayúscula de Montserrat es ~0,7 em
	const GAP = 70;
	const TXT = `x="${N_R + GAP + SW / 2}" y="${N_B - SW / 2}" font-family="Montserrat, system-ui, sans-serif" font-weight="800" font-size="${FS}" letter-spacing="${FS * 0.045}" stroke="currentColor" stroke-width="${SW}" stroke-linejoin="round" paint-order="stroke"`;
	svgHost.innerHTML =
		`<svg viewBox="${LOCKUP_BOX.x} ${LOCKUP_BOX.y} ${LOCKUP_BOX.w} ${LOCKUP_BOX.h}" width="100%" height="100%" fill="currentColor" overflow="visible" aria-hidden="true">` +
		// «EXUS» solo se ve a la derecha del borde de la N: sale de ella como si se despegara.
		`<defs><clipPath id="plC"><rect x="${N_R}" y="150" width="4200" height="1000"/></clipPath></defs>` +
		'<g clip-path="url(#plC)"><g data-pl-ex></g></g>' +
		`<path d="${N_PATH}"/>` +
		THRIVE_LETTERS.map((l) => `<g data-pl-th><path transform="translate(${l.x} ${l.y})" d="${l.d}"/></g>`).join('') +
		`<text data-pl-exus ${TXT} opacity="0">EXUS</text>` +
		'</svg>';
	const svg = svgHost.querySelector<SVGSVGElement>('svg')!;
	const exus = svg.querySelector<SVGTextElement>('[data-pl-exus]')!;
	const exHost = svg.querySelector<SVGGElement>('[data-pl-ex]')!;
	const thLetters = [...svg.querySelectorAll<SVGGElement>('[data-pl-th]')];

	// p: armado (0→1). m: fusión (0→1): los puntos crecen hasta rellenar los huecos mientras el SVG toma su lugar.
	const render = (p: number, m: number) => {
		ctx.clearRect(0, 0, W, H);
		const head = p * 1.2;
		// dos pasadas: los que ya llegaron (tinta) y los que están apareciendo (oro, creciendo)
		for (const pass of [0, 1]) {
			ctx.fillStyle = pass === 0 ? ink : gold;
			ctx.beginPath();
			for (const d of dots) {
				const u = Math.min(1, Math.max(0, (head - d.t) / 0.14));
				if (u <= 0 || (pass === 0) !== (u >= 1)) continue;
				const rr = d.r * out3(u) * (pass === 1 ? 1.25 : 1) * (1 + 0.9 * m);
				ctx.moveTo(d.x + rr, d.y);
				ctx.arc(d.x, d.y, rr, 0, Math.PI * 2);
			}
			ctx.fill();
		}
	};

	const BUILD = 1500; // los puntos arman el logo
	const MORPH = 600; // los puntos se funden en el SVG
	const HOLD = 250; // el logo sólido se queda un momento
	const start = performance.now();
	let ended = false;
	let closing = false;
	let expanding = false;
	const ease = (t: number) => 1 - Math.pow(1 - t, 3);
	const io = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

	/* NEXUS: «EXUS» se despega de la N y se desliza, el logo se ensancha y THRIVE queda centrado debajo.
	   Al terminar, NEXUS completo se queda un momento y la carga se disuelve con una View Transition. */
	const expand = () => {
		// Se mide dónde cae cada letra y se reparte en elementos propios para animarlas una a una.
		const chars = [...'EXUS'];
		const xs = chars.map((_, i) => exus.getStartPositionOfChar(i).x);
		const textW = exus.getBBox().width + SW;
		exus.remove();
		const letters = chars.map((c, i) => {
			const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			t.setAttribute('x', String(xs[i]));
			t.setAttribute('y', String(N_B - SW / 2));
			for (const [k, v] of [['font-family', 'Montserrat, system-ui, sans-serif'], ['font-weight', '800'], ['font-size', String(FS)], ['stroke', 'currentColor'], ['stroke-width', String(SW)], ['stroke-linejoin', 'round'], ['paint-order', 'stroke']]) t.setAttribute(k, v);
			t.style.transformBox = 'fill-box';
			t.style.transformOrigin = '0% 100%';
			t.textContent = c;
			exHost.appendChild(t);
			return t;
		});
		const x0 = LOCKUP_BOX.x, w0 = LOCKUP_BOX.w, h = LOCKUP_BOX.h;
		const w1 = N_R + GAP + textW - x0;
		const px1 = Math.min(window.innerWidth * 0.86, 760);
		const sc0 = W / w0, sc1 = px1 / w1;
		const dx = (w1 - w0) / 2;
		const st = { t: 0 };
		const apply = () => {
			const w = w0 + (w1 - w0) * st.t;
			const sc = sc0 + (sc1 - sc0) * st.t;
			svg.setAttribute('viewBox', `${x0} ${LOCKUP_BOX.y} ${w} ${h}`);
			svgHost.style.width = w * sc + 'px';
			svgHost.style.height = h * sc + 'px';
		};
		gsap.set(thLetters, { transformBox: 'fill-box', transformOrigin: '50% 100%' });
		const tl = gsap.timeline({
			onComplete: () => {
				gsap.delayedCall(0.5, () => { if (!ended) { ended = true; closing = true; finish(true); } });
			},
		});
		// El espacio se abre despacio (el logo se ensancha) y «EXUS» sale por el borde de la N como una sola
		// pieza que se despliega: las letras salen apretadas, una tras otra, y se separan al asentarse.
		tl.to(st, { t: 1, duration: 1.4, ease: 'power3.inOut', onUpdate: apply }, 0)
			.fromTo(
				letters,
				{ x: (i) => -(xs[i] - N_R) - 430 + (xs[i] - xs[0]) * 0.35, scaleY: 0.94, opacity: 0, filter: 'blur(26px)' },
				{ x: 0, scaleY: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'expo.out', stagger: 0.09, clearProps: 'filter' },
				0.2,
			)
			// THRIVE: una ola recorre las letras de derecha a izquierda. Cada una se desplaza al nuevo centro y
			// sube y baja un poco al pasar la ola (la de la derecha va primero, así nunca se cruzan).
			.to(thLetters, { x: dx, duration: 1.1, ease: 'power3.inOut', stagger: { each: 0.08, from: 'end' } }, 0.3)
			.to(thLetters, { y: -22, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: { each: 0.08, from: 'end' } }, 0.3);
	};

	const tick = (now: number) => {
		if (ended) return;
		const e = now - start;
		const p = ease(Math.min(1, e / BUILD));
		const m = io(Math.min(1, Math.max(0, (e - BUILD) / MORPH)));
		render(p, m);
		svgHost.style.opacity = String(m);
		cvs.style.opacity = String(1 - m);
		if (e > BUILD + MORPH + HOLD && !expanding) {
			expanding = true;
			(document.fonts?.load('800 100px Montserrat') ?? Promise.resolve()).finally(() => { if (!ended) expand(); });
			return;
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);

	/* Rejilla de puntos de fondo (como «Dot Grid»): se enciende rápido desde el centro, sin reaccionar
	   al cursor. Se detiene cuando la carga se oculta. */
	const gcv = el.querySelector<HTMLCanvasElement>('[data-pl-grid]');
	if (gcv) {
		const gx = gcv.getContext('2d')!;
		const GAP_PX = 30;
		let gw = 0, gh = 0;
		const fit = () => {
			gw = window.innerWidth;
			gh = window.innerHeight;
			gcv.width = Math.round(gw * dpr);
			gcv.height = Math.round(gh * dpr);
			gx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		fit();
		const onResize = () => { if (el.hidden) window.removeEventListener('resize', onResize); else { fit(); drawGrid(performance.now()); } };
		window.addEventListener('resize', onResize);
		const g0 = performance.now();
		const drawGrid = (now: number) => {
			if (el.hidden) return;
			const t = (now - g0) / 1000;
			gx.clearRect(0, 0, gw, gh);
			const cols = Math.ceil(gw / GAP_PX) + 1, rows = Math.ceil(gh / GAP_PX) + 1;
			const ox = (gw - (cols - 1) * GAP_PX) / 2, oy = (gh - (rows - 1) * GAP_PX) / 2;
			const cx = gw / 2, cy = gh / 2, maxD = Math.hypot(cx, cy);
			gx.fillStyle = 'rgba(255,255,255,0.32)';
			gx.beginPath();
			for (let j = 0; j < rows; j++) {
				for (let i = 0; i < cols; i++) {
					const x = ox + i * GAP_PX, y = oy + j * GAP_PX;
					// aparición rápida: una onda desde el centro (≈0,8 s en total)
					const rv = Math.min(1, Math.max(0, (t * 2.2 - (Math.hypot(x - cx, y - cy) / maxD) * 1.3) / 0.4));
					if (rv <= 0) continue;
					const r = 1.8 * rv;
					gx.moveTo(x + r, y);
					gx.arc(x, y, r, 0, Math.PI * 2);
				}
			}
			gx.fill();
			if (t < 1.4) requestAnimationFrame(drawGrid); // ya encendida, la rejilla no cambia
		};
		requestAnimationFrame(drawGrid);
	}

	// Control: un clic, un toque o cualquier tecla lo salta; no hace esperar a nadie.
	const skip = () => { if (!ended) { ended = true; if (!closing) { closing = true; finish(true); } } };
	el.addEventListener('pointerdown', skip, { once: true });
	window.addEventListener('keydown', skip, { once: true });

	// Red de seguridad: nunca deja la página bloqueada.
	window.setTimeout(() => { if (!ended) { ended = true; finish(true); } }, 9000);
}
