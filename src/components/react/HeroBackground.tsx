import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";

/* Fondos del hero para probar. El de por defecto es GradientASCII (React Bits); para ver otro,
   se añade `?bg=` a la dirección: /?bg=pixel-blast. Cada fondo se carga solo cuando se elige. */
/* Los .jsx de React Bits no traen tipos y TypeScript marca como obligatorias props que tienen valor por defecto. */
type Loose = { default: ComponentType<Record<string, unknown>> };
const GradientASCII = lazy(() => import("./reactbits/GradientASCII.jsx") as unknown as Promise<Loose>);
const GhostFibers = lazy(() => import("./reactbits/GhostFibers.jsx") as unknown as Promise<Loose>);
const MagnetLines = lazy(() => import("./reactbits/MagnetLines.jsx") as unknown as Promise<Loose>);
const Threads = lazy(() => import("./reactbits/Threads.jsx") as unknown as Promise<Loose>);
const Aurora = lazy(() => import("./reactbits/Aurora.jsx") as unknown as Promise<Loose>);
const Antigravity = lazy(() => import("./reactbits/Antigravity.jsx") as unknown as Promise<Loose>);
const PixelBlast = lazy(() => import("./reactbits/PixelBlast.jsx") as unknown as Promise<Loose>);

export const HERO_BACKGROUNDS = ["ghost-fibers", "magnet-lines", "threads", "aurora", "antigravity", "gradient-ascii", "pixel-blast"] as const;
type Bg = (typeof HERO_BACKGROUNDS)[number];

const SHAPES = ["horizon", "pinch", "rise", "eclipse"] as const;
const PARTICLES = ["capsule", "sphere", "box", "tetrahedron"] as const;

export default function HeroBackground() {
  const [bg, setBg] = useState<Bg>("ghost-fibers");
  const [shape, setShape] = useState<(typeof SHAPES)[number]>("pinch");
  const [cell, setCell] = useState(16);
  const [scale, setScale] = useState(2);
  const [particle, setParticle] = useState<(typeof PARTICLES)[number]>("capsule");
  const [count, setCount] = useState(1100);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const b = q.get("bg") as Bg | null;
    if (b && (HERO_BACKGROUNDS as readonly string[]).includes(b)) setBg(b);
    const sh = q.get("shape") as (typeof SHAPES)[number] | null;
    if (sh && (SHAPES as readonly string[]).includes(sh)) setShape(sh);
    const pa = q.get("particle") as (typeof PARTICLES)[number] | null;
    if (pa && (PARTICLES as readonly string[]).includes(pa)) setParticle(pa);
    const n = parseInt(q.get("count") ?? "", 10);
    if (Number.isFinite(n) && n > 0) setCount(n);
    const sc = parseFloat(q.get("scale") ?? "");
    if (Number.isFinite(sc)) setScale(sc);
    setCell(window.innerWidth < 700 ? 12 : 16);
  }, []);

  return (
    <Suspense fallback={null}>
      {bg === "ghost-fibers" ? (
        <GhostFibers
          /* Fibras de oro (puntos) que se pliegan y fluyen por todo el hero. Sin ningún efecto con el cursor. */
          glowColor="#d4af37"
          lineColor="#d4af37"
          secondaryColor="#f6ebc4"
          gradient="depth"
          fiberStyle="dots"
          speed={0.5}
          threads={52}
          layers={2}
          particles={0.3}
          sparkle={0.3}
          glow={0.7}
          brightness={0.9}
          vignette={0.35}
          mouseInteraction={false}
          hoverEffect="none"
          pulseOnClick={false}
          dpr={0.75}
        />
      ) : bg === "magnet-lines" ? (
        <MagnetLines
          /* Rejilla de puntos de oro que apuntan al cursor (modo dipolo) y se estiran al acercarse. Con lineHeight 0 son puntos. */
          spacing={31}
          lineWidth={3.5}
          lineHeight={0}
          mode="dipole"
          lineColor="#d4af37"
          accentColor="#f6ebc4"
          baseAngle={-10}
          radius={200}
          fade={0.65}
          edgeFade={0.35}
          stretch={0.4}
          ripple={0.3}
          clickPulse
          intro
          maxDevicePixelRatio={1}
        />
      ) : bg === "threads" ? (
        <Threads
          /* Hebras de oro que ondulan por todo el hero; el cursor las mece apenas. */
          color="#d4af37"
          accentColor="#f6ebc4"
          amplitude={1.4}
          distance={0.4}
          lineCount={70}
          thickness={0.6}
          softness={1.3}
          speed={0.5}
          waves={1.05}
          split={0.04}
          fray={0.5}
          angle={25}
          taper={0.85}
          brightness={1.1}
          opacity={0.9}
          enableMouseInteraction
        />
      ) : bg === "aurora" ? (
        <Aurora
          /* Cortinas de oro que fluyen por todo el ancho del hero; el cursor las empuja apenas. */
          colorStops={["#7f6210", "#d4af37", "#f6ebc4"]}
          amplitude={1.1}
          blend={0.75}
          height={0.6}
          scale={0.9}
          glow={0.55}
          brightness={0.85}
          opacity={0.6}
          layers={2}
          speed={0.6}
          direction="top"
          mouseInteraction
          dpr={0.6}
        />
      ) : bg === "antigravity" ? (
        <Antigravity
          /* Partículas de oro que se acomodan en un anillo pequeño alrededor del cursor; un clic las dispersa con suavidad. */
          colors={["#d4af37", "#f6ebc4", "#b8921f"]}
          colorMode="conic"
          particleShape={particle}
          count={count}
          magnetRadius={5}
          ringRadius={4.5}
          waveSpeed={0.3}
          waveAmplitude={0.5}
          waveCount={3}
          particleSize={0.9}
          lerpSpeed={0.03}
          fieldStrength={6}
          depthFactor={1}
          ambient={0.25}
          interactive
          clickBurst
          maxDevicePixelRatio={1}
        />
      ) : bg === "gradient-ascii" ? (
        <GradientASCII
          /* Degradado de oro sobre negro: de la tinta del tema al oro de la marca. */
          colors={["#0a0a0b", "#3a2e0b", "#7f6210", "#d4af37", "#f6ebc4"]}
          shape={shape}
          scale={scale}
          characters=" .:-=+*#%@"
          cellSize={cell}
          density={0.8}
          glyphOpacity={0.75}
          glow={0.35}
          flicker={0.25}
          softness={0.6}
          flow={0.55}
          speed={0.8}
          gradientOpacity={0.55}
          grain={0.06}
          mouseInteraction
          scrambleRadius={0.12}
          clickEffect="wave"
          fontFamily={'"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace'}
          dpr={1}
        />
      ) : (
        <PixelBlast
          variant="circle"
          pixelSize={4}
          color="#d4af37"
          accentColor="#f6ebc4"
          patternScale={2.4}
          patternDensity={1.15}
          pixelSizeJitter={0.4}
          speed={0.35}
          glow={0.7}
          twinkle={0.4}
          drift={0.15}
          driftAngle={25}
          softness={0.6}
          edgeFade={0.55}
          hoverEffect="grow"
          hoverRadius={200}
          enableRipples
          rippleSpeed={0.32}
          rippleThickness={0.12}
          rippleIntensityScale={1.3}
          dpr={1}
        />
      )}
    </Suspense>
  );
}
