/**
 * Presupuesto de dibujo de los fondos WebGL. Todos piden su cuadro aquí en lugar de a requestAnimationFrame:
 * cada uno va a ~30 fps y nunca se dibujan dos en el mismo cuadro, así el scroll no compite con ellos.
 *
 * Además mide el ritmo real de la página. Si va lenta de forma sostenida baja un nivel (queda en `data-perf`
 * de <html> y en la sesión): 1 = 20 fps, menos resolución y vidrio sin desenfoque; 2 = 15 fps y la mitad de resolución.
 */
type Frame = (now: number) => void;
export type PerfLevel = 0 | 1 | 2;

const INTERVAL = [31, 48, 64];
const DPR = [1, 0.75, 0.5];
const queue = new Map<number, Frame>();
const lastRun = new WeakMap<Frame, number>();
const listeners = new Set<(level: PerfLevel) => void>();

let nextId = 1;
let raf = 0;
let level: PerfLevel = 0;
let prev = 0;
let slow = 0;

const setLevel = (next: PerfLevel) => {
	level = next;
	document.documentElement.dataset.perf = String(next);
	try { sessionStorage.setItem('nx-perf', String(next)); } catch {}
	listeners.forEach((fn) => fn(next));
};

if (typeof window !== 'undefined') {
	let start = 0;
	try { start = Number(sessionStorage.getItem('nx-perf')) || 0; } catch {}
	const nav = navigator as Navigator & { deviceMemory?: number };
	const modest = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4 || matchMedia('(pointer: coarse)').matches;
	const initial = Math.min(2, Math.max(start, modest ? 1 : 0)) as PerfLevel;
	if (initial) setLevel(initial);
}

const measure = (now: number) => {
	const delta = now - prev;
	prev = now;
	// Los cortes largos (cambio de pestaña, carga) no cuentan como lentitud.
	if (delta > 1000 || document.documentElement.classList.contains('preloading')) return;
	slow = delta > 27 ? slow + 1 : Math.max(0, slow - 2);
	if (slow > 40 && level < 2) {
		slow = 0;
		setLevel((level + 1) as PerfLevel);
	}
};

const tick = (now: number) => {
	raf = 0;
	measure(now);
	let pick = 0;
	let waited = INTERVAL[level];
	for (const [id, fn] of queue) {
		const wait = now - (lastRun.get(fn) ?? -Infinity);
		if (wait >= waited) { pick = id; waited = wait; }
	}
	if (pick) {
		const fn = queue.get(pick)!;
		queue.delete(pick);
		lastRun.set(fn, now);
		fn(now);
	}
	if (queue.size && !raf) raf = requestAnimationFrame(tick);
};

export function requestFrame(fn: Frame): number {
	const id = nextId++;
	queue.set(id, fn);
	if (!raf) {
		prev = performance.now();
		raf = requestAnimationFrame(tick);
	}
	return id;
}

export function cancelFrame(id: number) {
	queue.delete(id);
}

export const perfDpr = () => DPR[level];

export function onPerf(fn: (level: PerfLevel) => void) {
	listeners.add(fn);
	return () => { listeners.delete(fn); };
}
