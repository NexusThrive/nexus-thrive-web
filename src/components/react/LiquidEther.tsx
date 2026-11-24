import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* Fondo «éter líquido»: cintas de luz que fluyen y se curvan, con un brillo especular como de líquido.
   Un solo pase de fragmentos (sin simulación de fluidos): barato, a media resolución y a ~30 fps.
   El cursor remueve el campo con un remolino suave. Se pausa fuera de pantalla y, con movimiento
   reducido, dibuja un único cuadro. */

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
out vec4 o;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.02 + vec2(7.1, 3.7); a *= 0.5; }
  return v;
}
float field(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.12)), fbm(p + vec2(5.2, 1.3 - t * 0.1)));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.08), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.07));
  return fbm(p + 3.0 * r);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float s = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / s * 1.7;
  vec2 m = (uMouse * uRes - 0.5 * uRes) / s * 1.7;
  vec2 d = p - m;
  float k = exp(-dot(d, d) * 3.5);
  p += vec2(-d.y, d.x) * k * 0.4 + uVel * k * 0.7;
  float f = field(p, uTime);
  vec3 n = normalize(vec3(-dFdx(f) * 55.0, -dFdy(f) * 55.0, 1.0));
  float spec = pow(max(dot(n, normalize(vec3(-0.4, 0.55, 0.75))), 0.0), 28.0);
  vec3 col = mix(uC0, uC1, smoothstep(0.28, 0.62, f));
  col = mix(col, uC2, smoothstep(0.58, 0.9, f) * 0.85);
  col += spec * 0.45 * uC2;
  float vig = smoothstep(1.25, 0.15, length(uv - 0.5) * 1.25);
  o = vec4(col * (0.5 + 0.5 * vig), 1.0);
}`;

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export default function LiquidEther({
  colors = ["#0b0b0c", "#4a3810", "#d4af37"],
  speed = 1,
  resolution = 0.5,
}: { colors?: [string, string, string]; speed?: number; resolution?: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) * resolution, webgl: 2 });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    el.appendChild(gl.canvas);
    gl.canvas.style.cssText = "width:100%;height:100%;display:block";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uVel: { value: [0, 0] },
        uC0: { value: rgb(colors[0]) },
        uC1: { value: rgb(colors[1]) },
        uC2: { value: rgb(colors[2]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      program.uniforms.uRes.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: 0.5, y: 0.5 };
    const cur = { x: 0.5, y: 0.5 };
    const vel = { x: 0, y: 0 };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    };
    el.parentElement?.addEventListener("pointermove", move as EventListener, { passive: true });

    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // ~30 fps
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      t += dt * speed;
      const px = cur.x, py = cur.y;
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      vel.x += ((cur.x - px) * 25 - vel.x) * 0.2;
      vel.y += ((cur.y - py) * 25 - vel.y) * 0.2;
      program.uniforms.uTime.value = t;
      program.uniforms.uMouse.value = [cur.x, cur.y];
      program.uniforms.uVel.value = [vel.x, vel.y];
      renderer.render({ scene: mesh });
    };
    const start = () => { if (!running && !reduced) { running = true; last = 0; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    // Sin WebGL (o con el contexto bloqueado) no hay nada que dibujar: se deja el fondo oscuro del contenedor.
    try {
      program.uniforms.uTime.value = 6;
      renderer.render({ scene: mesh });
    } catch {
      el.removeChild(gl.canvas);
      ro.disconnect();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.05 });
    io.observe(el);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      el.parentElement?.removeEventListener("pointermove", move as EventListener);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <div ref={host} aria-hidden="true" style={{ position: "absolute", inset: 0 }} />;
}
