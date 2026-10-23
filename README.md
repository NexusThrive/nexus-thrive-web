# nexus-landing

Sitio público de NEXUS THRIVE (nexusthrive.com.co): landing, centro de ayuda
y páginas legales. Astro 7, sin framework de UI.

```bash
pnpm install
pnpm dev            # o: astro dev --background
pnpm build
pnpm check:brand    # los primitivos --nx-* coinciden con la marca de la app
```

## Marca

La fuente de la marca es `packages/brand/css/tokens.css` del repositorio de la
app (`nexus-thrive`), documentada en su `DESIGN.md`. Aquí se copian los
primitivos en `src/styles/tokens.css`; `pnpm check:brand` falla si se
desalinean. No se agregan colores, fuentes ni radios propios.

## Centro de ayuda

- Contenido: `src/data/help.ts` (secciones, guías y preguntas frecuentes).
- Páginas: `/help` (índice por sección) y `/help/<guía>` (una por guía). Los
  enlaces viejos `/help#<guía>` redirigen a la página de la guía.
- Cada guía tiene: para qué sirve, dónde está, qué hace falta antes, pasos,
  qué deberías ver, errores frecuentes y guías relacionadas.

Reglas:

1. Solo lo que la app hace hoy, con los nombres que se ven en pantalla. Antes
   de escribir un paso, se verifica en el código de `nexus-thrive`.
2. Capturas: solo de la app real con datos de demostración, en
   `src/assets/product/<nombre>-light.webp` y `-dark.webp`. Nada de datos de
   clientes reales.
3. Cuando cambia un flujo en la app, en el mismo ciclo se actualiza su guía y,
   si cambió la pantalla, su captura.
