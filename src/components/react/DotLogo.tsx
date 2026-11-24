import { useEffect, useRef } from "react";
import { MARK_BOX, N_PATH } from "./logo-paths";

/* ══ Logo hecho de partículas ══════════════════════════════
   Física tomada de «Cursor driven particles typography»: cada partícula tiene su sitio; el cursor
   la repele dentro de un radio, un resorte la devuelve (0,08) y la amortiguación (0,85) hace que
   el regreso sea suave. Cambios para NexusThrive:
   · El logo es la N oficial más la palabra THRIVE (se muestrean del canvas; sin imágenes).
   · El paso de física escala con el tiempo real (dt): se siente igual a 60, 120 o 144 Hz.
   · Las partículas desplazadas se tiñen de oro y crecen un poco.
   · El bucle se duerme cuando todo está en reposo y fuera de pantalla no corre.
   · Con movimiento reducido queda quieto. */

const DISPERSION = 15;
const RETURN = 0.08;
const DAMPING = 0.85;

export default function DotLogo({ label = "Logo de NEXUS THRIVE hecho de partículas" }: { label?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current, canvas = cvs.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let n = 0;
    let ox = new Float32Array(0), oy = new Float32Array(0);
    let x = new Float32Array(0), y = new Float32Array(0);
    let vx = new Float32Array(0), vy = new Float32Array(0), rr = new Float32Array(0);
    let W = 0, H = 0, dpr = 1, radius = 110;
    let raf = 0, visible = false, running = false, last = 0, alive = true;
    const ptr = { x: -9999, y: -9999, on: false, burst: 0 };
    let ink = "#f7f6f3", gold = "#d4af37", tick = 0;

    const readColors = () => {
      ink = getComputedStyle(canvas).color || ink;
      gold = getComputedStyle(document.documentElement).getPropertyValue("--nx-gold-500").trim() || gold;
    };

    const build = () => {
      W = Math.max(180, Math.min(360, Math.round(el.clientWidth)));
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const mw = W * 0.7, mh = mw * (MARK_BOX.h / MARK_BOX.w);
      const fs = W * 0.1, tracking = fs * 0.62;
      const gap = W * 0.07;
      H = Math.round(mh + gap + fs * 1.1);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = Math.max(90, Math.min(130, W * 0.38));

      // Se dibuja el logo en un lienzo aparte y se muestrean los píxeles con alfa.
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.setTransform(dpr, 0, 0, dpr, 0, 0);
      o.fillStyle = "#000";
      const k = mw / MARK_BOX.w;
      o.save();
      o.translate((W - mw) / 2 - MARK_BOX.x * k, -MARK_BOX.y * k);
      o.scale(k, k);
      o.fill(new Path2D(N_PATH));
      o.restore();
      o.font = `700 ${fs}px Montserrat, "Segoe UI", system-ui, sans-serif`;
      o.textBaseline = "alphabetic";
      const word = "THRIVE";
      const widths = [...word].map((c) => o.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + tracking * (word.length - 1);
      let cx = (W - total) / 2;
      [...word].forEach((c, i) => { o.fillText(c, cx, mh + gap + fs * 0.9); cx += widths[i] + tracking; });

      const cell = Math.max(4, Math.min(6.5, W / 60));
      const step = Math.max(1, Math.round(cell * dpr));
      const img = o.getImageData(0, 0, off.width, off.height);
      const px: number[] = [], py: number[] = [], pr: number[] = [];
      for (let j = 0; j < img.height; j += step) {
        for (let i = 0; i < img.width; i += step) {
          const a = img.data[(j * img.width + i) * 4 + 3];
          if (a > 128) { px.push(i / dpr); py.push(j / dpr); pr.push(cell * (0.27 + 0.1 * (a / 255))); }
        }
      }
      n = px.length;
      ox = Float32Array.from(px); oy = Float32Array.from(py); rr = Float32Array.from(pr);
      x = new Float32Array(n); y = new Float32Array(n); vx = new Float32Array(n); vy = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        // Entrada: nacen cerca de su sitio con un empujón al azar y se acomodan solas.
        x[i] = ox[i] + (Math.random() - 0.5) * 10;
        y[i] = oy[i] + (Math.random() - 0.5) * 10;
        vx[i] = reduced ? 0 : (Math.random() - 0.5) * 5;
        vy[i] = reduced ? 0 : (Math.random() - 0.5) * 5;
        if (reduced) { x[i] = ox[i]; y[i] = oy[i]; }
      }
      readColors();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const pass of [0, 1]) {
        ctx.fillStyle = pass === 0 ? ink : gold;
        ctx.globalAlpha = pass === 0 ? 0.95 : 1;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const d = Math.hypot(x[i] - ox[i], y[i] - oy[i]);
          if ((pass === 1) !== d > 4) continue;
          const r = pass === 1 ? rr[i] * (1 + Math.min(0.6, d / 70)) : rr[i];
          ctx.moveTo(x[i] + r, y[i]);
          ctx.arc(x[i], y[i], r, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (now: number) => {
      raf = 0;
      if (!alive || !visible) { running = false; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      const k = dt * 60; // 1 a 60 Hz; la física no depende de la frecuencia de la pantalla
      if (++tick % 90 === 0) readColors();
      const R = ptr.burst > 0 ? radius * 1.5 : radius;
      const strength = ptr.burst > 0 ? DISPERSION * 1.8 : DISPERSION;
      const interacting = ptr.on || ptr.burst > 0;
      const damp = Math.pow(DAMPING, k);
      let moving = false;
      for (let i = 0; i < n; i++) {
        if (interacting) {
          const dx = ptr.x - x[i], dy = ptr.y - y[i];
          const d = Math.hypot(dx, dy);
          if (d < R && d > 0.001) {
            const f = (R - d) / R;
            vx[i] -= (dx / d) * f * strength * k;
            vy[i] -= (dy / d) * f * strength * k;
          }
        }
        vx[i] += (ox[i] - x[i]) * RETURN * k;
        vy[i] += (oy[i] - y[i]) * RETURN * k;
        vx[i] *= damp;
        vy[i] *= damp;
        x[i] += vx[i] * k;
        y[i] += vy[i] * k;
        if (!moving && (Math.abs(x[i] - ox[i]) + Math.abs(y[i] - oy[i]) > 0.15 || vx[i] * vx[i] + vy[i] * vy[i] > 0.0004)) moving = true;
      }
      if (ptr.burst > 0) ptr.burst -= k;
      draw();
      if (moving || interacting) raf = requestAnimationFrame(step);
      else { running = false; last = 0; for (let i = 0; i < n; i++) { x[i] = ox[i]; y[i] = oy[i]; } draw(); }
    };

    const wake = () => {
      if (running || reduced || !visible || !alive) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(step);
    };

    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const onMove = (e: PointerEvent) => { toLocal(e); ptr.on = true; wake(); };
    const onLeave = () => { ptr.on = false; ptr.x = ptr.y = -9999; wake(); };
    const onDown = (e: PointerEvent) => { toLocal(e); ptr.burst = 14; ptr.on = e.pointerType === "mouse"; wake(); };
    const onUp = (e: PointerEvent) => { if (e.pointerType !== "mouse") onLeave(); };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onLeave);

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) { draw(); wake(); }
    });
    io.observe(el);

    let lastEl = 0;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.clientWidth);
      if (Math.abs(w - lastEl) < 2) return;
      lastEl = w;
      build();
      wake();
    });
    ro.observe(el);

    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // La palabra usa Montserrat: se espera a la fuente antes de muestrear.
    (document.fonts?.load('700 40px Montserrat') ?? Promise.resolve()).finally(() => { if (alive) { build(); wake(); } });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onLeave);
    };
  }, []);

  return (
    <div ref={wrap} className="dot-logo" style={{ width: "100%" }}>
      <canvas ref={cvs} role="img" aria-label={label} style={{ display: "block", margin: "0 auto", touchAction: "pan-y", color: "var(--foreground)" }} />
    </div>
  );
}
