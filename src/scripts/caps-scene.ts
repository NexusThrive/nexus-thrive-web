/**
 * «Servicios»: los cuatro servicios se suceden a pantalla completa en un solo lugar, guiados por el scroll.
 * Sin JavaScript o con movimiento reducido quedan apilados, uno debajo del otro.
 * Los textos solo cambian de opacidad (siguen disponibles para lectores de pantalla); las demostraciones, que son
 * decorativas, además se ocultan para que el navegador no las pinte.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector<HTMLElement>('[data-caps]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (section && !reduced) init(section);

function init(section: HTMLElement) {
	const bento = section.querySelector<HTMLElement>('.bento')!;
	const panels = [...section.querySelectorAll<HTMLElement>('[data-cap]')];
	const tabs = [...section.querySelectorAll<HTMLButtonElement>('[data-cap-tab]')];
	section.classList.add('is-live');
	// Si algún servicio no cabe en la ventana (teléfonos muy bajos), se quedan apilados: mejor eso que un texto tapado.
	if (panels.some((p) => p.querySelector('.cap-copy')!.scrollHeight + (innerWidth < 900 ? p.querySelector('.vis')!.scrollHeight + 12 : 0) > bento.clientHeight)) {
		section.classList.remove('is-live');
		return;
	}
	const last = panels.length - 1;
	const part = (p: HTMLElement, sel: string) => p.querySelector<HTMLElement>(sel)!;

	const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut', duration: 0.34 } });
	panels.forEach((p, i) => {
		if (i === 0) return;
		const prev = panels[i - 1];
		gsap.set(part(p, '.cap-copy'), { opacity: 0 });
		gsap.set(part(p, '.vis'), { autoAlpha: 0 });
		const at = i - 0.67;
		tl.to(part(prev, '.cap-copy'), { y: -70, opacity: 0, duration: 0.2, ease: 'power2.in' }, at)
			.to(part(prev, '.vis'), { y: -120, autoAlpha: 0, duration: 0.24, ease: 'power2.in' }, at)
			.fromTo(part(p, '.vis'), { y: 150, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: 'power3.out' }, at + 0.16)
			.fromTo(part(p, '.cap-copy'), { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: 'power3.out' }, at + 0.2);
	});
	tl.to({}, { duration: 0.01 }, last - 0.01);

	let current = -1;
	const mark = (i: number) => {
		if (i === current) return;
		current = i;
		tabs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
		panels.forEach((p, k) => p.classList.toggle('is-on', k === i));
	};
	mark(0);

	const st = ScrollTrigger.create({
		trigger: section,
		start: 'top top',
		end: `+=${last * 90}%`,
		pin: true,
		scrub: 0.6,
		anticipatePin: 1,
		refreshPriority: 2,
		animation: tl,
		onUpdate: (self) => mark(Math.round(self.progress * last)),
	});
	tabs.forEach((t, i) => t.addEventListener('click', () => window.scrollTo({ top: st.start + ((st.end - st.start) * i) / last, behavior: 'smooth' })));
}
