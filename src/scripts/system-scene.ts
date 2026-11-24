/**
 * Escena «del desorden a un panel»: una sola línea de tiempo ligada al scroll en la que los mismos
 * elementos se transforman. Seis fuentes sueltas (mensajes, hojas, formularios…) se ordenan, se
 * conectan en un flujo de tres nodos por donde viajan los datos y, al final, esas mismas tarjetas
 * se convierten en los widgets de un panel. Es la misma idea de continuidad que la transformación
 * de Auri en el hero: nada aparece ni desaparece sin pasar a ser otra cosa.
 *
 * Sin movimiento reducido ni JavaScript, el CSS deja el resultado final ya armado (sin pin).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector<HTMLElement>('[data-scene]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (section && !reduced) init(section);

type Box = { x: number; y: number; w: number; h: number };

function init(section: HTMLElement) {
	const pin = section.querySelector<HTMLElement>('[data-scene-pin]')!;
	const stage = section.querySelector<HTMLElement>('[data-stage]')!;
	const svg = stage.querySelector<SVGSVGElement>('[data-svg]')!;
	const els = [...stage.querySelectorAll<HTMLElement>('[data-el]')];
	const nodes = [...stage.querySelectorAll<HTMLElement>('[data-node]')];
	const auri = stage.querySelector<HTMLElement>('[data-auri]')!;
	const caption = section.querySelector<HTMLElement>('[data-caption]')!;
	const captions: string[] = JSON.parse(document.getElementById('scene-captions')?.textContent ?? '[]');
	const srcFaces = els.map((e) => e.querySelector<HTMLElement>('.face--src')!);
	const wFaces = els.map((e) => e.querySelector<HTMLElement>('.face--w')!);
	const counters = [...stage.querySelectorAll<HTMLElement>('[data-count]')];
	const chartLine = stage.querySelector<SVGPathElement>('[data-chart-line]');
	const bars = [...stage.querySelectorAll<HTMLElement>('[data-bar]')];
	const ticks = [...stage.querySelectorAll<HTMLElement>('[data-task] .tk')];

	let tl: gsap.core.Timeline | null = null;
	let st: ScrollTrigger | null = null;
	let lastW = 0;
	let capIdx = -1;

	const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
	const CHAOS: [number, number, number][] = [[0.08, 0.1, -12], [0.64, 0.04, 9], [0.3, 0.52, -7], [0.8, 0.38, 13], [0.1, 0.82, 8], [0.56, 0.84, -10]];

	function layout(W: number, H: number) {
		const mobile = W < 760;
		const srcW = mobile ? Math.floor((W - 12) / 2) : 176;
		const srcH = mobile ? 48 : 60;
		const chaos = CHAOS.map(([nx, ny, r]) => ({ x: nx * (W - srcW), y: ny * (H - srcH), r }));

		const list: Box[] = [];
		if (mobile) {
			els.forEach((_, i) => list.push({ x: (i % 2) * (srcW + 12), y: 8 + Math.floor(i / 2) * (srcH + 8), w: srcW, h: srcH }));
		} else {
			const total = 6 * srcH + 5 * 10;
			const y0 = (H - total) / 2;
			els.forEach((_, i) => list.push({ x: 0, y: y0 + i * (srcH + 10), w: srcW, h: srcH }));
		}

		const nw = mobile ? 104 : 176, nh = mobile ? 70 : 64;
		const cx = mobile ? [W * 0.2, W * 0.5, W * 0.8] : [W * 0.42, W * 0.62, W * 0.82];
		const ny = mobile ? 208 : H / 2 - nh / 2;
		const nbox: Box[] = cx.map((c) => ({ x: c - nw / 2, y: ny, w: nw, h: nh }));

		const dash: Box[] = [];
		const gap = mobile ? 10 : 14;
		const dw = mobile ? W : Math.min(W, 980);
		const ox = (W - dw) / 2;
		const kw = (dw - 2 * gap) / 3;
		const kh = mobile ? 76 : 100;
		const chartH = mobile ? 150 : 200;
		const lowH = mobile ? 150 : 112;
		const dashH = kh + gap + chartH + gap + lowH;
		const y0 = Math.max(8, (H - dashH) / 2);
		for (let i = 0; i < 3; i++) dash.push({ x: ox + i * (kw + gap), y: y0, w: kw, h: kh });
		if (mobile) {
			dash.push({ x: ox, y: y0 + kh + gap, w: dw, h: chartH });
			dash.push({ x: ox, y: y0 + kh + gap + chartH + gap, w: (dw - gap) / 2, h: lowH });
			dash.push({ x: ox + (dw - gap) / 2 + gap, y: y0 + kh + gap + chartH + gap, w: (dw - gap) / 2, h: lowH });
		} else {
			const cw = ((dw - gap) * 2) / 3;
			dash.push({ x: ox, y: y0 + kh + gap, w: cw, h: chartH });
			dash.push({ x: ox + cw + gap, y: y0 + kh + gap, w: dw - cw - gap, h: chartH });
			dash.push({ x: ox, y: y0 + kh + gap + chartH + gap, w: dw, h: lowH });
		}
		return { mobile, srcW, srcH, chaos, list, nbox, dash };
	}

	function teardown() {
		st?.kill(true);
		tl?.kill();
		st = null;
		tl = null;
		gsap.set([...els, ...nodes, auri, ...srcFaces, ...wFaces, ...counters], { clearProps: 'all' });
		// Las barras llevan su ancho en una variable en línea (--w): solo se limpia la transformación.
		gsap.set([...bars, ...ticks], { clearProps: 'transform' });
		chartLine && gsap.set(chartLine, { clearProps: 'strokeDasharray,strokeDashoffset' });
		svg.innerHTML = '';
		stage.classList.remove('is-live');
	}

	function build() {
		teardown();
		stage.classList.add('is-live');
		const W = stage.clientWidth, H = stage.clientHeight;
		lastW = window.innerWidth;
		const L = layout(W, H);
		const NS = 'http://www.w3.org/2000/svg';
		svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

		// Estado inicial: fuentes sueltas, nodos y Auri ocultos, widgets sin cara.
		els.forEach((el, i) => gsap.set(el, { x: L.chaos[i].x, y: L.chaos[i].y, width: L.srcW, height: L.srcH, rotation: L.chaos[i].r, transformOrigin: '50% 50%' }));
		gsap.set(wFaces, { autoAlpha: 0 });
		nodes.forEach((n, i) => gsap.set(n, { x: L.nbox[i].x, y: L.nbox[i].y, width: L.nbox[i].w, height: L.nbox[i].h, autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' }));
		const aEnd = { x: L.dash[5].x + L.dash[5].w - (L.mobile ? 40 : 60), y: L.dash[5].y + (L.dash[5].h - 44) / 2 };
		// Auri recorre los tres nodos saltando de uno a otro (rebota al caer y se estira en el aire).
		const stops = L.nbox.map((b) => ({ x: b.x + b.w / 2 - 22, y: b.y - 40 }));
		const hop = L.mobile ? 26 : 38;
		gsap.set(auri, { x: stops[0].x, y: stops[0].y, scaleX: 0, scaleY: 0, rotation: 0, transformOrigin: '50% 100%' });

		// Conexiones: de cada fuente al primer nodo, y entre nodos.
		const n1 = { x: L.nbox[0].x, y: L.nbox[0].y + L.nbox[0].h / 2 };
		const mk = (d: string, w = 2) => {
			const p = document.createElementNS(NS, 'path');
			p.setAttribute('d', d);
			p.setAttribute('fill', 'none');
			p.setAttribute('stroke', 'var(--accent)');
			p.setAttribute('stroke-opacity', '0.6');
			p.setAttribute('stroke-width', String(w));
			p.setAttribute('stroke-linecap', 'round');
			svg.appendChild(p);
			const len = p.getTotalLength();
			p.style.strokeDasharray = `${len}`;
			p.style.strokeDashoffset = `${len}`;
			return { p, len };
		};
		const conns = L.list.map((b) => {
			const sx = b.x + b.w, sy = b.y + b.h / 2;
			const dx = Math.max(40, (n1.x - sx) * 0.5);
			return mk(`M${sx},${sy} C${sx + dx},${sy} ${n1.x - dx},${n1.y} ${n1.x},${n1.y}`);
		});
		const chain = [0, 1].map((i) => {
			const a = L.nbox[i], b = L.nbox[i + 1];
			return mk(`M${a.x + a.w},${a.y + a.h / 2} L${b.x},${b.y + b.h / 2}`, 2.5);
		});
		const packets = els.map(() => {
			const c = document.createElementNS(NS, 'circle');
			c.setAttribute('r', '5');
			c.setAttribute('fill', '#f6ebc4');
			c.setAttribute('opacity', '0');
			svg.appendChild(c);
			return c;
		});
		const allPaths = [...conns, ...chain].map((c) => c.p);

		// Estados finales de los widgets antes de que existan.
		const chartLen = chartLine?.getTotalLength() ?? 0;
		if (chartLine) gsap.set(chartLine, { strokeDasharray: chartLen, strokeDashoffset: chartLen });
		gsap.set(bars, { scaleX: 0 });
		gsap.set(ticks, { scale: 0 });
		const finals = counters.map((c) => Number(c.dataset.count));
		counters.forEach((c) => (c.textContent = '0'));

		const prog = { v: 0 };
		const num = { v: 0 };
		const pointOn = (i: number, u: number) => {
			if (u < 0.5) {
				const c = conns[i];
				return c.p.getPointAtLength(c.len * (u / 0.5));
			}
			const t = (u - 0.5) / 0.5;
			const total = chain[0].len + chain[1].len;
			const d = total * t;
			return d <= chain[0].len ? chain[0].p.getPointAtLength(d) : chain[1].p.getPointAtLength(d - chain[0].len);
		};
		const flow = () => {
			const locals = packets.map((_, i) => clamp((prog.v - i * 0.07) / 0.55));
			packets.forEach((c, i) => {
				const u = locals[i];
				if (u <= 0 || u >= 1) return c.setAttribute('opacity', '0');
				const pt = pointOn(i, u);
				c.setAttribute('cx', String(pt.x));
				c.setAttribute('cy', String(pt.y));
				c.setAttribute('opacity', '1');
			});
			const reached = (th: number) => locals.some((u) => u >= th);
			[reached(0.5), reached(0.75), reached(0.99)].forEach((on, i) => nodes[i].classList.toggle('is-on', on));
			moveAuri(clamp(prog.v / 1.45));
		};

		/* Auri: dos saltos (nodo 1 → 2 → 3). Aterriza justo sobre cada nodo; al caer se aplasta y en el aire se estira. */
		const smooth = (t: number) => t * t * (3 - 2 * t);
		const moveAuri = (u: number) => {
			const k = u < 0.5 ? 0 : 1;
			const t = u < 0.5 ? u * 2 : (u - 0.5) * 2;
			const h = Math.sin(Math.PI * t); // 0 en los nodos, 1 en lo más alto del salto
			const x = stops[k].x + (stops[k + 1].x - stops[k].x) * smooth(t);
			const squash = 1 - 0.2 * (1 - smooth(clamp(h / 0.3)));
			gsap.set(auri, {
				x,
				y: stops[0].y - hop * h,
				scaleY: squash + 0.1 * h,
				scaleX: Math.min(1.25, 2 - (squash + 0.1 * h)),
				rotation: (t - 0.5) * 14,
			});
		};

		tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
		// 1) Las fuentes se ordenan en una columna.
		tl.to(els, { x: (i) => L.list[i].x, y: (i) => L.list[i].y, rotation: 0, duration: 1.6, stagger: 0.1 }, 0.4);
		// 2) Aparece el flujo: tres nodos y las conexiones que se dibujan hacia ellos; Auri se enciende.
		tl.to(nodes, { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.15 }, 2.3);
		tl.to(allPaths, { strokeDashoffset: 0, duration: 1.1, stagger: 0.07 }, 2.5);
		tl.to(auri, { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'back.out(2.6)' }, 2.8);
		// 3) Los datos recorren el flujo y los nodos cambian de estado.
		tl.to(prog, { v: 1.45, duration: 3, ease: 'none', onUpdate: flow }, 4.2);
		// 4) Las mismas tarjetas se convierten en los widgets de un panel.
		tl.to(allPaths, { autoAlpha: 0, duration: 0.6 }, 7.0);
		tl.to(nodes, { autoAlpha: 0, scale: 0.6, duration: 0.7, stagger: 0.08 }, 7.0);
		tl.to(els, { x: (i) => L.dash[i].x, y: (i) => L.dash[i].y, width: (i) => L.dash[i].w, height: (i) => L.dash[i].h, duration: 1.6, stagger: 0.08 }, 7.2);
		tl.to(srcFaces, { autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 7.7);
		tl.to(wFaces, { autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 8.1);
		tl.to(auri, { x: aEnd.x, y: aEnd.y, scaleX: 0.9, scaleY: 0.9, rotation: 0, duration: 1.5, ease: 'power3.inOut' }, 7.4);
		// 5) El panel cobra vida: gráfico, contadores, embudo y tareas.
		if (chartLine) tl.to(chartLine, { strokeDashoffset: 0, duration: 1.3 }, 9.0);
		tl.to(bars, { scaleX: 1, duration: 0.8, stagger: 0.1 }, 9.1);
		tl.to(num, { v: 1, duration: 1.3, ease: 'power2.out', onUpdate: () => counters.forEach((c, i) => (c.textContent = String(Math.round(finals[i] * num.v)))) }, 9.0);
		tl.to(ticks, { scale: 1, duration: 0.4, stagger: 0.12, ease: 'power3.out' }, 9.4);
		tl.to({}, { duration: 0.5 }, 10.4);

		const setCaption = (i: number) => {
			if (i === capIdx || !captions[i]) return;
			capIdx = i;
			gsap.to(caption, { opacity: 0, y: 6, duration: 0.15, onComplete: () => {
				caption.textContent = captions[i];
				gsap.to(caption, { opacity: 1, y: 0, duration: 0.3 });
			} });
		};
		capIdx = -1;
		st = ScrollTrigger.create({
			trigger: pin,
			start: 'top top',
			end: L.mobile ? '+=240%' : '+=320%',
			pin: true,
			scrub: 0.6,
			anticipatePin: 1,
			// Quien crea espacio de pin se mide primero: los disparadores de más abajo (pasos del proceso) cuentan con él.
			refreshPriority: 3,
			animation: tl,
			onUpdate: (self) => setCaption(self.progress < 0.18 ? 0 : self.progress < 0.4 ? 1 : self.progress < 0.7 ? 2 : 3),
		});
		caption.textContent = captions[0] ?? '';
		capIdx = 0;
	}

	build();
	let timer = 0;
	window.addEventListener('resize', () => {
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			if (Math.abs(window.innerWidth - lastW) < 40) return;
			build();
			ScrollTrigger.refresh();
		}, 250);
	});
}
