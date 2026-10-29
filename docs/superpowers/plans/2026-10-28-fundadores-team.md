# Fundadores en la landing — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (ejecución nativa en esta sesión). Pasos con checkbox.

**Goal:** Dejar en la sección `#equipo` solo a Santiago (CEO) y Nicolas (CFO), como fundadores destacados, con espacio listo para la foto del CEO.

**Architecture:** Los datos salen de `src/data/site.ts` (`FOUNDERS`) y se renderizan en `src/components/landing/Team.astro` como dos tarjetas grandes con avatar de 112 px y etiqueta `Fundador · CEO/CFO`. La foto del CEO es opcional: si existe, se importa en `Team.astro` y se asigna en `photos`.

**Tech Stack:** Astro 7, `astro:assets` para la imagen, CSS con tokens de marca.

**Spec:** `docs/superpowers/specs/2026-10-28-fundadores-team-design.md`

## Global Constraints

- Solo texto en español, sin emojis.
- Colores y formas desde los tokens (`--surface`, `--border`, `--radius-lg`, `--accent-text`); sin valores nuevos de marca.
- El `id="equipo"` y los `data-reveal` se conservan.
- No tocar navegación, footer ni otras secciones.

---

### Task 1: Datos de fundadores

**Files:**
- Modify: `src/data/site.ts:142-152`

**Interfaces:**
- Produces: `FOUNDERS: readonly { name: string; role: 'CEO' | 'CFO'; text: string; initials: string }[]`

- [x] **Step 1:** Reemplazar `TEAM` por `FOUNDERS` con Santiago Castellar (CEO) y Nicolas Florez (CFO), textos del spec.
- [x] **Step 2:** Verificar que no queden referencias a `TEAM`, Carlos ni Justin.

### Task 2: Tarjetas de fundadores

**Files:**
- Modify: `src/components/landing/Team.astro`

**Interfaces:**
- Consumes: `FOUNDERS` de Task 1.

- [x] **Step 1:** Importar `Image` de `astro:assets`, `ImageMetadata` y `FOUNDERS`; definir `photos` vacío con el comentario de la foto del CEO.
- [x] **Step 2:** Renderizar 2 tarjetas: avatar (foto o iniciales), `Fundador · {role}`, nombre y texto.
- [x] **Step 3:** Reemplazar la grilla de 4 columnas por 2 tarjetas con borde; móvil en 1 columna con avatar a la izquierda.
- [x] **Step 4:** Ajustar `lead` para nombrar a los fundadores.

### Task 3: Verificación

- [x] **Step 1:** `pnpm astro check` (si existe) y `pnpm build`.
- [x] **Step 2:** Revisar `dist/index.html`: aparecen Santiago y Nicolas, no aparecen Carlos ni Justin, y están las etiquetas `Fundador · CEO` y `Fundador · CFO`.
- [x] **Step 3:** Confirmar que el dev server en background sigue respondiendo en `http://localhost:4321`.
