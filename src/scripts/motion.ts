/**
 * Movimiento de la landing: scroll suave (Lenis) sincronizado con GSAP ScrollTrigger.
 * Con `prefers-reduced-motion` no se inicia nada: la página queda estática y completa.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 68;

gsap.registerPlugin(ScrollTrigger);

/* ---------- Scroll suave + anclas ---------- */
let lenis: Lenis | null = null;
if (!reduced) {
	lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((t) => lenis!.raf(t * 1000));
	gsap.ticker.lagSmoothing(0);
	if (root.classList.contains('preloading')) lenis.stop();
	window.addEventListener('nx:ready', () => lenis?.start());
	// Respaldo: si la clase `preloading` se quita sin que llegue el evento, el scroll y los enlaces siguen funcionando.
	new MutationObserver(() => { if (!root.classList.contains('preloading')) lenis?.start(); }).observe(root, { attributes: true, attributeFilter: ['class'] });
}

document.addEventListener('click', (e) => {
	const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
	if (!a || a.target === '_blank') return;
	const url = new URL(a.href, location.href);
	if (url.pathname !== location.pathname || !url.hash) return;
	const target = document.getElementById(decodeURIComponent(url.hash.slice(1).split('?')[0]));
	if (!target) return;
	e.preventDefault();
	history.pushState(null, '', url.hash);
	if (lenis) lenis.scrollTo(target, { offset: target.classList.contains('full') ? 0 : -navH(), duration: 1.3 });
	else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
});

if (!reduced) {
	const q = <T extends Element>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];

	/* ---------- Barra de progreso de lectura ---------- */
	gsap.to('[data-scroll-progress]', {
		scaleX: 1,
		ease: 'none',
		scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
	});

	/* ---------- Encabezados: cada título entra con desenfoque ---------- */
	q<HTMLElement>('[data-head]').forEach((head) => {
		gsap.from(head.children, {
			y: 50,
			opacity: 0,
			filter: 'blur(12px)',
			duration: 1.1,
			stagger: 0.12,
			ease: 'power3.out',
			clearProps: 'filter,transform',
			scrollTrigger: { trigger: head, start: 'top 88%', once: true },
		});
	});

	/* ---------- Problema: las seis tarjetas llegan desordenadas y quedan en su sitio cuando la sección llena la ventana ---------- */
	const problem = document.querySelector<HTMLElement>('[data-problem]');
	const pains = q<HTMLElement>('[data-pain]');
	const cols = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 600 ? 2 : 1);
	pains.forEach((pain, i) => {
		const card = pain.querySelector('.pain-card');
		const c = cols();
		const col = i % c;
		// Cada tarjeta viene de un lado distinto (según su columna), girada y más abajo; el scroll la va asentando.
		const dir = c === 1 ? (i % 2 ? 1 : -1) : col - (c - 1) / 2;
		gsap.fromTo(
			card,
			{ x: dir * (c === 1 ? 70 : 150), y: 110 + (i % 2) * 40, rotation: dir * 7 + (i % 2 ? 3 : -3), scale: 0.88, autoAlpha: 0 },
			{
				x: 0,
				y: 0,
				rotation: 0,
				scale: 1,
				autoAlpha: 1,
				ease: 'power3.out',
				clearProps: 'transform',
				scrollTrigger: c === 3
					? { trigger: problem, start: `top ${66 - i * 4}%`, end: `top ${Math.max(0, 14 - i * 3)}%`, scrub: 0.7 }
					: { trigger: pain, start: 'top 96%', end: 'top 58%', scrub: 0.7 },
			},
		);
	});

	/* ---------- Solución: el flujo se enciende paso a paso ---------- */
	const flow = document.querySelector<HTMLElement>('[data-flow]');
	if (flow) {
		const steps = q<HTMLElement>('.flow-step', flow);
		const line = flow.querySelector<HTMLElement>('[data-flow-line]')!;
		gsap.set(line, { scaleX: 0 });
		ScrollTrigger.create({
			trigger: flow,
			start: 'top 80%',
			end: 'top 35%',
			scrub: true,
			onUpdate: (self) => {
				gsap.set(line, { scaleX: self.progress });
				steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / (steps.length - 1) - 0.001));
			},
		});
	}

	/* ---------- Panel de ejemplo: contadores, gráfico y embudo ---------- */
	const panel = document.querySelector<HTMLElement>('.panel');
	if (panel) {
		q<HTMLElement>('[data-count]', panel).forEach((n) => {
			const to = Number(n.dataset.count);
			const o = { v: 0 };
			n.textContent = '0';
			ScrollTrigger.create({
				trigger: panel,
				start: 'top 80%',
				once: true,
				onEnter: () => gsap.to(o, { v: to, duration: 1.2, ease: 'power3.out', onUpdate: () => (n.textContent = String(Math.round(o.v))) }),
			});
		});

		const line = panel.querySelector<SVGPathElement>('[data-chart-line]');
		const area = panel.querySelector<SVGPathElement>('[data-chart-area]');
		const dot = panel.querySelector<SVGCircleElement>('[data-chart-dot]');
		if (line && area && dot) {
			const len = line.getTotalLength();
			gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
			gsap.set(area, { opacity: 0 });
			gsap.set(dot, { scale: 0, transformOrigin: 'center', svgOrigin: `${dot.getAttribute('cx')} ${dot.getAttribute('cy')}` });
			ScrollTrigger.create({
				trigger: panel,
				start: 'top 75%',
				once: true,
				onEnter: () => {
					gsap.timeline()
						.to(line, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' })
						.to(area, { opacity: 1, duration: 0.7, ease: 'power1.out' }, 0.4)
						.to(dot, { scale: 1, duration: 0.4, ease: 'power3.out' }, 1.1);
				},
			});
		}

		const bars = q<HTMLElement>('[data-bar]', panel);
		ScrollTrigger.create({
			trigger: panel,
			start: 'top 70%',
			once: true,
			onEnter: () => gsap.to(bars, { scaleX: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1 }),
		});
	}

	/* ---------- Proceso: en escritorio la sección se fija y los pasos se encienden uno a uno; si no cabe, la línea baja con el scroll ---------- */
	const steps = q<HTMLElement>('[data-step]');
	const track = document.querySelector<HTMLElement>('.track');
	const processPin = document.querySelector<HTMLElement>('[data-process-pin]');
	if (steps.length && track && processPin) {
		const nodes = q<HTMLElement>('[data-pnode]');
		const cards = steps.map((s) => s.querySelector<HTMLElement>('.step-card')!);
		const last = steps.length - 1;
		gsap.matchMedia().add({ wide: '(min-width: 1024px)', narrow: '(max-width: 1023px)' }, (ctx) => {
			const pinned = ctx.conditions!.wide && processPin.offsetHeight <= window.innerHeight + 2;
			const paint = (p: number) => {
				track.style.setProperty('--p', String(p));
				const total = steps[0].parentElement!.scrollHeight || 1;
				nodes.forEach((n, i) => n.classList.toggle('is-on', p >= (pinned ? i / last : (steps[i].offsetTop + 24) / total) - 0.01));
			};
			if (pinned) {
				const tl = gsap.timeline();
				const line = { p: 0 };
				tl.to(line, { p: 1, duration: last, ease: 'none', onUpdate: () => paint(line.p) }, 0);
				cards.forEach((card, i) => {
					if (i === 0) return;
					tl.fromTo(card, { y: 70, opacity: 0.16, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, i - 0.6);
				});
				tl.to({}, { duration: 0.4 });
				paint(0);
				ScrollTrigger.create({ trigger: processPin, start: 'top top', end: '+=200%', pin: true, scrub: 0.6, anticipatePin: 1, refreshPriority: 1, animation: tl });
			} else {
				cards.forEach((card, i) => gsap.from(card, { y: 70, opacity: 0, scale: 0.94, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: steps[i], start: 'top 90%', once: true } }));
				ScrollTrigger.create({ trigger: '[data-process]', start: 'top 72%', end: 'bottom 62%', scrub: 0.4, onUpdate: (self) => paint(self.progress) });
			}
		});
	}

	/* ---------- Cierre: la frase de atrás se desplaza más despacio que la de delante ---------- */
	gsap.fromTo('[data-divider-back]', { yPercent: 38, scale: 0.94 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.divider', start: 'top 80%', end: 'top top', scrub: 0.6 } });

	/* ---------- Revelado: las piezas marcadas con data-reveal entran escalonadas al aparecer ---------- */
	const reveal = q<HTMLElement>('[data-reveal]');
	if (reveal.length) {
		gsap.set(reveal, { autoAlpha: 0, y: 44, scale: 0.97 });
		ScrollTrigger.batch(reveal, {
			start: 'top 92%',
			once: true,
			onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true, clearProps: 'transform' }),
		});
	}

	/* ---------- Refrescos: lo que cambia el alto de la página recalcula los disparadores ---------- */
	const refresh = () => ScrollTrigger.refresh();
	window.addEventListener('nx:ready', refresh);
	window.addEventListener('load', refresh);
	document.fonts?.ready.then(refresh);
	document.addEventListener('toggle', () => ScrollTrigger.refresh(), true);
}
