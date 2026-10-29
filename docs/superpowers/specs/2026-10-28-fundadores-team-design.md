# Sección de fundadores (cambio corto)

## Intención

La sección "Las personas que construyen NEXUS" debe mostrar solo a los
fundadores: Santiago (CEO) y Nicolas (CFO). Carlos y Justin salen de la
landing. El objetivo es que ambos se perciban como fundadores al mismo nivel,
con más peso visual que el equipo anterior, y dejar listo el espacio para la
foto del CEO que llegará después.

## Alcance

- `src/data/site.ts`: `TEAM` pasa a `FOUNDERS` con dos entradas.
- `src/components/landing/Team.astro`: grilla de 2 columnas con tarjetas
  grandes de fundador; se conserva el id `#equipo`, el `<section>` y las
  animaciones `data-reveal`.
- Sin cambios en navegación, footer ni otras secciones.

## Diseño

Cada tarjeta:

- Avatar grande (112 px) con el corte diagonal actual; si existe `photo`, se
  renderiza la foto recortada al mismo formato; si no, las iniciales.
- Etiqueta mono en dorado: `Fundador · CEO` / `Fundador · CFO`.
- Nombre como `h3` y texto de una o dos líneas.
- Tarjeta con borde y padding generoso, no solo columnas separadas por línea.

Textos:

- Santiago Castellar — CEO y fundador. Dirige NEXUS y acompaña a cada negocio
  desde la primera conversación hasta la entrega.
- Nicolas Florez — CFO y fundador. Presupuestos claros y pagos con
  comprobante, sin sorpresas.

Encabezado: se mantiene el `h2` "Las personas que construyen NEXUS." y se
ajusta el `lead` para nombrar a los dos fundadores.

Responsive: 2 columnas ≥ 720 px, 1 columna con avatar a la izquierda en móvil.

## Foto del CEO

`FOUNDERS` admite un campo opcional `photo`. Cuando llegue la imagen se
importa en `Team.astro` desde `src/assets/` y se asigna a Santiago; no hay que
tocar el layout. Mientras tanto se muestra el monograma `SC`.

## Fuera de alcance

- Retoques de copy en otras secciones.
- Cambios al README o a `docs/` fuera de este documento.
