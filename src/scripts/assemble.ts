/**
 * «Nuestro trabajo»: la captura real del dashboard de NEXUS llega en seis piezas sueltas y, mientras
 * se hace scroll, se arma hasta formar la pantalla completa (continuidad en lugar de un fundido).
 * Con movimiento reducido (o sin JavaScript) se ve la pantalla ya armada.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const host = document.querySelector<HTMLElement>('[data-assemble]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (host && !reduced) {
	const frame = host.querySelector<HTMLElement>('.as-frame')!;
	const stage = host.querySelector<HTMLElement>('[data-stage]')!;
	const tiles = [...host.querySelectorAll<HTMLElement>('[data-tile]')];
	// Hacia dónde está «lejos» cada pieza (x, y en px y giro), a la escala del ancho del marco.
	const SCATTER: [number, number, number][] = [[-130, -90, -10], [30, -150, 7], [150, -80, 12], [-150, 100, 9], [20, 160, -8], [170, 120, -12]];
	const k = Math.min(1.6, host.clientWidth / 760);
	const finals = tiles.map((t) => getComputedStyle(t).borderRadius);

	const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
	tiles.forEach((tile, i) => {
		const [x, y, r] = SCATTER[i];
		tl.fromTo(
			tile,
			{ x: x * k, y: y * k, rotation: r, scale: 0.82, opacity: 0.35, borderRadius: '16px 16px 16px 16px', boxShadow: '0 14px 30px -12px rgba(0,0,0,0.7)' },
			{ x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, borderRadius: finals[i], boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 1, immediateRender: true },
			i * 0.07,
		);
	});
	tl.fromTo(frame, { boxShadow: '0 0 0 rgba(0,0,0,0)' }, { boxShadow: getComputedStyle(frame).boxShadow, duration: 0.5, ease: 'power2.out' }, 0.9);
	// La pantalla ya armada se endereza desde una ligera inclinación (como una presentación de producto).
	tl.fromTo(stage, { rotationX: 14, y: 50, scale: 0.94 }, { rotationX: 0, y: 0, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.4);

	ScrollTrigger.create({
		trigger: host,
		start: 'top 90%',
		end: 'top 22%',
		scrub: 0.8,
		animation: tl,
	});
}
