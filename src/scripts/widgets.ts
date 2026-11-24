/**
 * Widgets autónomos de «Servicios»: cada uno repite su secuencia sola, sin depender del scroll, y se
 * pausa cuando sale de pantalla. Con movimiento reducido quedan en su estado final, quietos.
 *   build · una pantalla de NEXUS se arma y un cursor pulsa el balance
 *   flow  · flujo de automatización: tres entradas → clasificación → registro y aviso
 *   ai    · un documento se lee, se extraen datos y Auri lo confirma
 *   data  · el panel se llena: contadores, línea de ingresos, anillo y embudo
 * Todos usan datos simulados. Cada línea de tiempo se crea la primera vez que el widget se ve, porque
 * medir un SVG oculto da longitud cero.
 */
import gsap from 'gsap';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const q = <T extends Element>(root: ParentNode, sel: string) => [...root.querySelectorAll<T>(sel)];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function drive(host: HTMLElement, make: () => gsap.core.Timeline) {
	let tl: gsap.core.Timeline | null = null;
	new IntersectionObserver(([e]) => {
		if (e.isIntersecting) {
			if (!tl) {
				tl = make();
				if (reduced) tl.progress(1).pause();
			}
			if (!reduced) tl.play();
		} else tl?.pause();
	}, { threshold: 0.25 }).observe(host);
}

const counter = (nums: HTMLElement[], finals: number[], o: { v: number }) => () =>
	nums.forEach((n, i) => (n.textContent = String(Math.round(finals[i] * o.v))));

function build(host: HTMLElement) {
	const win = host.querySelector<HTMLElement>('[data-b-win]')!;
	const blocks = q<HTMLElement>(host, '[data-b]');
	const side = blocks.filter((b) => b.closest('.wb-side'));
	const cards = blocks.filter((b) => !b.closest('.wb-side'));
	const nums = q<HTMLElement>(host, '[data-b-num]');
	const badge = host.querySelector<HTMLElement>('[data-b-badge]')!;
	const gold = host.querySelector<HTMLElement>('[data-b-gold]')!;
	const bars = q<HTMLElement>(host, '[data-b-bar]');
	const cursor = host.querySelector<SVGElement>('[data-b-cursor]')!;
	const finals = nums.map((n) => Number(n.dataset.bNum));
	const o = { v: 0 };
	const pos = () => {
		const w = win.getBoundingClientRect(), g = gold.getBoundingClientRect();
		return { gx: g.left - w.left + g.width * 0.55, gy: g.top - w.top + g.height * 0.55, sx: w.width * 0.9, sy: w.height * 0.95 };
	};
	const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, defaults: { ease: 'power3.out' } });
	tl.set(win, { autoAlpha: 0, y: 18, scale: 0.97 })
		.set(side, { autoAlpha: 0, x: -14 })
		.set(cards, { autoAlpha: 0, y: 16, scale: 0.94 })
		.set(bars, { scaleY: 0 })
		.set(badge, { autoAlpha: 0, scale: 0.6 })
		.set(cursor, { autoAlpha: 0 })
		.set(o, { v: 0 })
		.call(() => nums.forEach((n) => (n.textContent = '0')))
		.to(win, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
		.to(side, { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.07 }, 0.35)
		.to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.5)' }, 0.55)
		.to(o, { v: 1, duration: 1.2, ease: 'power2.out', onUpdate: counter(nums, finals, o) }, 1.0)
		.to(bars, { scaleY: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.8)' }, 1.3)
		.fromTo(badge, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.4)' }, 2.1)
		// Un cursor llega desde abajo y pulsa la tarjeta dorada, que responde con un pequeño rebote.
		.fromTo(cursor, { x: () => pos().sx, y: () => pos().sy, autoAlpha: 0 }, { x: () => pos().gx, y: () => pos().gy, autoAlpha: 1, duration: 1.0, ease: 'power2.inOut' }, 2.4)
		.to(cursor, { scale: 0.82, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.45)
		.to(gold, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' }, 3.5)
		.to(bars, { scaleY: 0.5, duration: 0.2, yoyo: true, repeat: 1, stagger: 0.05 }, 3.5)
		.to(cursor, { autoAlpha: 0, x: '+=30', y: '+=26', duration: 0.5, ease: 'power2.in' }, 4.0)
		.to({}, { duration: 1.4 })
		.to(win, { autoAlpha: 0, y: -10, duration: 0.6, ease: 'power2.in' });
	return tl;
}

function flow(host: HTMLElement) {
	const svg = host.querySelector<SVGSVGElement>('[data-flow]')!;
	const edges = q<SVGPathElement>(svg, '[data-e]');
	const lens = edges.map((e) => e.getTotalLength());
	const packets = q<SVGCircleElement>(svg, '[data-p]');
	const nodes = q<SVGGElement>(svg, '[data-n]');
	const mid = nodes[0];
	const outs = nodes.slice(1);
	// Cada paquete sale de una entrada, pasa por la clasificación y termina en una de las dos salidas.
	const routes = [[0, 3], [1, 4], [2, 3], [1, 4]];
	const prog = { v: 0 };
	const update = () => {
		let midOn = false;
		const outOn = [false, false];
		packets.forEach((c, i) => {
			const u = clamp((prog.v - i * 0.2) / 0.62);
			if (u <= 0 || u >= 1) return c.setAttribute('opacity', '0');
			const [a, b] = routes[i];
			const first = u < 0.5;
			const e = first ? a : b;
			const t = first ? u / 0.5 : (u - 0.5) / 0.5;
			const k = t * t * (3 - 2 * t); // ease suave en cada tramo
			const p = edges[e].getPointAtLength(lens[e] * k);
			c.setAttribute('cx', String(p.x));
			c.setAttribute('cy', String(p.y));
			c.setAttribute('opacity', '1');
			c.setAttribute('r', String(4 + 2 * Math.sin(Math.PI * t)));
			if (u > 0.42 && u < 0.62) midOn = true;
			if (u > 0.9) outOn[b === 3 ? 0 : 1] = true;
		});
		mid.classList.toggle('is-on', midOn);
		outs.forEach((n, i) => { if (outOn[i]) n.classList.add('is-on'); });
	};
	return gsap.timeline({ repeat: -1, repeatDelay: 0.7 })
		.call(() => nodes.forEach((n) => n.classList.remove('is-on')))
		.to(prog, { v: 1.9, duration: 4.4, ease: 'none', onUpdate: update })
		.to({}, { duration: 0.8 });
}

function ai(host: HTMLElement) {
	const lines = q<HTMLElement>(host, '[data-l]');
	const scan = host.querySelector<HTMLElement>('[data-scan]')!;
	const chips = q<HTMLElement>(host, '[data-chip]');
	const doc = host.querySelector<HTMLElement>('.wa-doc')!;
	const auri = host.querySelector<HTMLElement>('[data-auri]')!;
	const bubble = host.querySelector<HTMLElement>('[data-bubble]')!;
	const o = { v: 0 };
	return gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
		.set(chips, { autoAlpha: 0, x: 18, scale: 0.95 })
		.call(() => lines.forEach((l) => l.classList.remove('is-read')))
		.set(scan, { autoAlpha: 0 })
		.set(bubble, { autoAlpha: 0, scale: 0.7, y: 6, transformOrigin: '100% 100%' })
		.set(auri, { y: 0 })
		.set(o, { v: 0 })
		.to(scan, { autoAlpha: 1, duration: 0.2 })
		.to(o, {
			v: 1,
			duration: 2.4,
			ease: 'power1.inOut',
			onUpdate: () => {
				scan.style.transform = `translateY(${o.v * (doc.clientHeight - 2)}px)`;
				lines.forEach((l, i) => l.classList.toggle('is-read', o.v > (i + 0.6) / lines.length));
			},
		}, 0.1)
		.to(chips, { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.34, ease: 'back.out(1.6)' }, 0.9)
		.to(scan, { autoAlpha: 0, duration: 0.3 }, 2.5)
		// Auri asiente con un saltito y confirma.
		.to(auri, { y: -9, duration: 0.22, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 2.7)
		.to(bubble, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.2)' }, 2.75)
		.to({}, { duration: 1.5 })
		.to([...chips, bubble], { autoAlpha: 0, duration: 0.4 });
}

function data(host: HTMLElement) {
	const nums = q<HTMLElement>(host, '[data-d-num]');
	const line = host.querySelector<SVGPathElement>('[data-d-line]')!;
	const area = host.querySelector<SVGPathElement>('[data-d-area]')!;
	const ring = host.querySelector<SVGCircleElement>('[data-d-ring]')!;
	const bars = q<HTMLElement>(host, '[data-d-bar]');
	const blocks = q<HTMLElement>(host, '[data-d-k]');
	const finals = nums.map((n) => Number(n.dataset.dNum));
	const len = line.getTotalLength();
	const [target, full] = ring.getAttribute('stroke-dasharray')!.split(' ').map(Number);
	const o = { v: 0 };
	return gsap.timeline({ repeat: -1, repeatDelay: 0.5 })
		.set(line, { strokeDasharray: len, strokeDashoffset: len })
		.set(area, { autoAlpha: 0 })
		.set(ring, { attr: { 'stroke-dasharray': `0 ${full}` } })
		.set(bars, { scaleX: 0 })
		.set(blocks, { autoAlpha: 0, y: 14, scale: 0.96 })
		.set(o, { v: 0 })
		.call(() => nums.forEach((n) => (n.textContent = '0')))
		.to(blocks, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.09, ease: 'back.out(1.4)' }, 0.1)
		.to(o, { v: 1, duration: 1.8, ease: 'power2.out', onUpdate: counter(nums, finals, o) }, 0.5)
		.to(line, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0.6)
		.to(area, { autoAlpha: 1, duration: 0.8 }, 1.4)
		.to(ring, { attr: { 'stroke-dasharray': `${target} ${full}` }, duration: 1.6, ease: 'power3.inOut' }, 0.7)
		.to(bars, { scaleX: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.9)
		.to({}, { duration: 2.2 })
		.to(blocks, { autoAlpha: 0, y: -8, duration: 0.45, stagger: 0.04, ease: 'power2.in' });
}


/* ---------- «Cómo trabajamos»: ilustraciones de cada paso ---------- */
function p1(host: HTMLElement) {
	const bubs = q<HTMLElement>(host, '[data-m]');
	const lines = bubs.map((b) => q<HTMLElement>(b, 's'));
	const typing = host.querySelector<HTMLElement>('[data-typing]')!;
	const dots = q<HTMLElement>(typing, 'i');
	const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
	tl.set(bubs, { autoAlpha: 0, scale: 0.7, y: 8 })
		.set(lines.flat(), { scaleX: 0, transformOrigin: 'left' })
		.set(typing, { autoAlpha: 0 });
	bubs.forEach((b, i) => {
		const t = 0.2 + i * 1.15;
		const origin = b.classList.contains('bub--r') ? '100% 100%' : '0% 100%';
		tl.set(b, { transformOrigin: origin }, t)
			.to(b, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }, t)
			.to(lines[i], { scaleX: 1, duration: 0.55, stagger: 0.12, ease: 'power3.out' }, t + 0.25);
	});
	tl.to(typing, { autoAlpha: 1, duration: 0.25 }, 2.2)
		.to(dots, { y: -4, duration: 0.3, yoyo: true, repeat: 5, stagger: 0.12, ease: 'sine.inOut' }, 2.2)
		.to({}, { duration: 1.2 })
		.to([...bubs, typing], { autoAlpha: 0, y: -8, duration: 0.45, stagger: 0.05, ease: 'power2.in' });
	return tl;
}

function p2(host: HTMLElement) {
	const rects = q<SVGRectElement>(host, '[data-d]');
	const sel = host.querySelector<SVGRectElement>('[data-sel]')!;
	const tags = q<SVGGElement>(host, '[data-tag]');
	const spots = [{ x: 74, y: 38, w: 72, h: 48 }, { x: 154, y: 38, w: 78, h: 48 }, { x: 74, y: 94, w: 158, h: 48 }];
	const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
	tl.set(rects, { strokeDasharray: 1, strokeDashoffset: 1 })
		.set(sel, { autoAlpha: 0 })
		.set(tags, { scale: 0, transformOrigin: '50% 50%' })
		.to(rects, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'power2.inOut' }, 0.1)
		.to(sel, { autoAlpha: 1, duration: 0.3 }, 1.3);
	spots.forEach((sp, i) => {
		const t = 1.5 + i * 0.75;
		tl.to(sel, { attr: { x: sp.x, y: sp.y, width: sp.w, height: sp.h }, duration: 0.55, ease: 'power3.inOut' }, t)
			.to(tags[i], { scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, t + 0.35);
	});
	tl.to({}, { duration: 1.3 })
		.to([...rects, sel, ...tags], { autoAlpha: 0, duration: 0.45, ease: 'power2.in' })
		.set([...rects, sel, ...tags], { autoAlpha: 1 });
	return tl;
}

function p3(host: HTMLElement) {
	const fill = host.querySelector<HTMLElement>('[data-fill]')!;
	const pct = host.querySelector<HTMLElement>('[data-pct]')!;
	const blks = q<HTMLElement>(host, '[data-blk]');
	const ticks = q<HTMLElement>(host, '[data-tk]');
	const o = { v: 0 };
	return gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
		.set(fill, { scaleX: 0 })
		.set(blks, { autoAlpha: 0, y: 14, scale: 0.7 })
		.call(() => { pct.textContent = '0'; ticks.forEach((t) => t.classList.remove('is-done')); })
		.set(o, { v: 0 })
		.to(blks, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.28, ease: 'back.out(2)' }, 0.2)
		.to(fill, { scaleX: 1, duration: 2.0, ease: 'power1.inOut' }, 0.2)
		.to(o, { v: 100, duration: 2.0, ease: 'power1.inOut', onUpdate: () => (pct.textContent = String(Math.round(o.v))) }, 0.2)
		.call(() => ticks[0].classList.add('is-done'), [], 0.8)
		.call(() => ticks[1].classList.add('is-done'), [], 1.5)
		.call(() => ticks[2].classList.add('is-done'), [], 2.2)
		.to({}, { duration: 1.4 })
		.to(blks, { autoAlpha: 0, y: -8, duration: 0.4, stagger: 0.04, ease: 'power2.in' });
}

function p4(host: HTMLElement) {
	const bars = q<HTMLElement>(host, '[data-bar]');
	const auri = host.querySelector<HTMLElement>('[data-auri]')!;
	const bub = host.querySelector<HTMLElement>('[data-b4]')!;
	return gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
		.set(bars, { scaleY: 0 })
		.set(bub, { autoAlpha: 0, scale: 0.7, transformOrigin: '100% 100%' })
		.set(auri, { y: 0 })
		.to(bars, { scaleY: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.6)' }, 0.2)
		.to(auri, { y: -9, duration: 0.24, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.3)
		.to(bub, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, 1.35)
		.to({}, { duration: 1.8 })
		.to([...bars, bub], { autoAlpha: 0, duration: 0.4, stagger: 0.03 })
		.set([...bars, bub], { autoAlpha: 1 });
}

const RUN: Record<string, (h: HTMLElement) => gsap.core.Timeline> = { build, flow, ai, data, p1, p2, p3, p4 };
document.querySelectorAll<HTMLElement>('[data-w]').forEach((h) => {
	const run = RUN[h.dataset.w ?? ''];
	if (run) drive(h, () => run(h));
});
