import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from "react";

/* Fondo animado de cada sección (React Bits). Todos en blanco plata sobre negro, como Lightfall en la escena
   del sistema, y sin reacción al cursor. El contexto WebGL solo existe cerca de la pantalla: al alejarse la
   sección se desmonta, para que nunca convivan más de dos o tres. */
type Loose = { default: ComponentType<Record<string, unknown>> };
const Antigravity = lazy(() => import("./reactbits/Antigravity.jsx") as unknown as Promise<Loose>);
const Threads = lazy(() => import("./reactbits/Threads.jsx") as unknown as Promise<Loose>);
const GhostFibers = lazy(() => import("./reactbits/GhostFibers.jsx") as unknown as Promise<Loose>);
const PixelBlast = lazy(() => import("./reactbits/PixelBlast.jsx") as unknown as Promise<Loose>);
const Lightfall = lazy(() => import("./reactbits/Lightfall.jsx") as unknown as Promise<Loose>);

export type SectionBg = "dispersion" | "hebras" | "fibras" | "pixeles" | "ondas" | "lluvia";

function Scene({ kind }: { kind: SectionBg }) {
  switch (kind) {
    case "dispersion":
      // Sin imán ni recorrido automático: entra con su animación y después solo queda un leve movimiento en el sitio.
      return <Antigravity colors={["#ffffff", "#cbd5e1", "#94a3b8"]} count={900} particleSize={0.8} ambient={0.85} magnetRadius={0} autoAnimate={false} interactive={false} clickBurst={false} maxDevicePixelRatio={1} />;
    case "hebras":
      return <Threads color="#ffffff" accentColor="#94a3b8" amplitude={1.4} lineCount={60} speed={0.5} brightness={1.2} opacity={0.75} />;
    case "fibras":
      return <GhostFibers glowColor="#94a3b8" lineColor="#ffffff" secondaryColor="#cbd5e1" fiberStyle="lines" threads={48} layers={2} particles={0.3} sparkle={0.3} glow={0.6} brightness={0.75} mouseInteraction={false} hoverEffect="none" pulseOnClick={false} dpr={0.75} />;
    case "pixeles":
      return <PixelBlast variant="circle" pixelSize={4} color="#cbd5e1" accentColor="#ffffff" patternScale={2.4} patternDensity={1.35} edgeFade={0.15} intro={false} pixelSizeJitter={0.4} speed={0.35} glow={0.5} twinkle={0.5} drift={0.15} hoverEffect="none" enableRipples={false} dpr={1} />;
    case "ondas":
      return <Threads color="#ffffff" accentColor="#64748b" amplitude={2.1} lineCount={46} speed={0.45} waves={0.8} angle={-32} seed={7} brightness={1.2} opacity={0.6} />;
    case "lluvia":
      return <Lightfall mouseInteraction={false} holdToWarp={false} dpr={1} />;
  }
}

export default function SectionBackground({ kind }: { kind: SectionBg }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "25% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }}>{near ? <Suspense fallback={null}><Scene kind={kind} /></Suspense> : null}</div>;
}
