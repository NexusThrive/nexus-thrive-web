import { useEffect, useRef, useState } from "react";
import { EyeTracker, type EyeMood } from "./EyeTracker";

/* Auri sobre el formulario: saluda y, según el campo que se está llenando, dice una frase corta.
   Son textos fijos de la página (no es una IA). Escucha el formulario por eventos del DOM. */

const SAY: Record<string, { text: string; mood: EyeMood }> = {
  hello: { text: "Hola, soy Auri. Cuéntanos qué quieres mejorar y te ayudamos a empezar.", mood: "joy" },
  name: { text: "Encantado. Con tu nombre ya empezamos.", mood: "curious" },
  business: { text: "¿A qué se dedica tu empresa?", mood: "curious" },
  topic: { text: "Elige lo que más se parezca; no tiene que ser exacto.", mood: "neutral" },
  message: { text: "Con una frase basta: ¿qué te quita tiempo hoy?", mood: "think" },
  invalid: { text: "Faltan un par de datos. Revisa los campos marcados.", mood: "think" },
  sent: { text: "¡Listo! Abrimos WhatsApp con tu mensaje.", mood: "joy" },
};

export default function FormAuri() {
  const [key, setKey] = useState("hello");
  const [typed, setTyped] = useState("");
  const timer = useRef(0);
  const full = SAY[key];

  useEffect(() => {
    window.clearInterval(timer.current);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setTyped(full.text); return; }
    let i = 0;
    setTyped("");
    timer.current = window.setInterval(() => {
      i += 1;
      setTyped(full.text.slice(0, i));
      if (i >= full.text.length) window.clearInterval(timer.current);
    }, 16);
    return () => window.clearInterval(timer.current);
  }, [key]);

  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>("[data-diag]");
    if (!form) return;
    const onFocus = (e: Event) => {
      const t = e.target as HTMLElement;
      const id = t.id?.replace("f-", "");
      if (id && SAY[id]) setKey(id);
    };
    const onSubmit = () => window.setTimeout(() => setKey(form.querySelector('[aria-invalid="true"]') ? "invalid" : "sent"), 30);
    form.addEventListener("focusin", onFocus);
    form.addEventListener("submit", onSubmit);
    return () => { form.removeEventListener("focusin", onFocus); form.removeEventListener("submit", onSubmit); };
  }, []);

  const speaking = typed.length < full.text.length;

  return (
    <div className="fa" role="status" aria-live="polite">
      <div className="fa-face">
        <EyeTracker fit decorative poke={false} size={56} shape="Ball" eyeScale={1.2} mood={full.mood} speaking={speaking} />
      </div>
      <p className="fa-bubble">
        {typed}
        <span className="fa-caret" aria-hidden="true" />
      </p>
    </div>
  );
}
