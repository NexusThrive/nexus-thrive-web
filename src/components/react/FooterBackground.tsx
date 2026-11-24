import { useEffect, useRef, useState } from "react";
import HeroBackground from "./HeroBackground";

/* El mismo fondo animado del hero, para el pie. Se monta recién cuando el pie está cerca de verse
   (así no se crea un segundo contexto WebGL al cargar la página) y el propio fondo se pausa fuera de pantalla. */
export default function FooterBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} style={{ position: "absolute", inset: 0 }}>{seen ? <HeroBackground /> : null}</div>;
}
