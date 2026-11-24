# Movimiento de la landing

Criterio tomado de las skills `animate` (pbakaus), `animation-performance` y `improve-animations`
(emilkowalski) de ui-skills.com, y de la receta de GSAP instalada en `.claude/skills/gsap-scroll-animations`.
Modo de visita: **persuadir**, así que se prefiere un momento focal ensayado a revelar cada sección.

## Tesis de movimiento

- **Momento focal:** la secuencia de Auri. La píldora escribe un problema, viaja al centro, se arma una esfera
  de puntos con los ojos de Auri, se enrolla y se vuelve el Auri real, que despliega la respuesta. Corre sola en bucle.
- **Continuidad:** las tarjetas de problemas se apilan (la nueva hunde a la anterior); el número del proceso sigue
  al paso visible; el flujo de la solución se enciende paso a paso.
- **Retroalimentación:** botones, validación del formulario, pestañas de sectores, FAQ, salto de la pantalla de carga.
- **Presupuesto:** WebGL solo en el fondo del hero (PixelBlast, se pausa fuera de pantalla); dos canvas 2D (Auri y el
  logo del footer) que solo corren a la vista; todo lo demás es CSS.

## Reglas que se aplicaron

- Sin revelados genéricos de sección ni parallax decorativo; se quitaron.
- El hover no mueve el elemento enfocado: lo mueve un hijo (el icono) y la tarjeta solo gana sombra.
- Sin rebote ni elástico por reflejo; el único resorte es la aparición de Auri, que es el momento focal.
- Tiempos: retroalimentación 100–200 ms, cambios de estado 200–320 ms, entrada del hero 500–700 ms.
- Todo bucle no esencial se pausa fuera de pantalla o con la pestaña oculta (Auri, cinta de tecnologías, logo de puntos, PixelBlast).
- La pantalla de carga dura unos 5 s, se salta con un clic, un toque o una tecla, y sale solo en la primera visita (`nx-intro-seen` en localStorage, guardado al terminar; `/?intro` la repite).
- `will-change` solo donde hay animación; `contain` en la caja de Auri; sin `transition: all`.
- Contenido visible por defecto: si el script falla, nada queda oculto.

## Movimiento reducido (`prefers-reduced-motion`)

No se apaga todo: se reduce el movimiento y se conserva el significado.

- Sin Lenis, sin ScrollTrigger, sin pantalla de carga.
- Las barras del embudo, el flujo y los pasos del proceso se ven en su estado final.
- Auri sigue demostrando, pero con fundidos en lugar de vuelo y esfera giratoria, y escribe sin retardo.

## Rendimiento del inicio

- El hero ocupa toda la pantalla (`100svh`). Su fondo es GhostFibers (React Bits, WebGL2 sin dependencias): fibras de puntos de oro que se pliegan y fluyen por todo el ancho. No reacciona al cursor (`mouseInteraction`, `hoverEffect` y `pulseOnClick` apagados). Corre a resolución 1x, topado a ~30 fps y con pausa fuera de pantalla.
- Para comparar fondos se usa la dirección: `/?bg=ghost-fibers` (por defecto), `/?bg=magnet-lines`, `/?bg=threads`, `/?bg=aurora`, `/?bg=antigravity`, `/?bg=gradient-ascii` o `/?bg=pixel-blast`. Con `antigravity` también `&particle=capsule|sphere|box|tetrahedron&count=…`; con `gradient-ascii`, `&shape=horizon|rise|pinch|eclipse&scale=1.2…2.5`. El selector vive en `HeroBackground.tsx` y cada fondo se carga solo si se elige.
- Sin `backdrop-filter` sobre el WebGL (obligaba a repintar la caja de Auri en cada cuadro) ni filtros de desenfoque en la caja.
- Las caras de Auri (`EyeTracker`, cada una con su bucle de cuadros) se montan solo en las fases en que se ven.
- Medido en Chromium sin GPU: sin WebGL de 52 a 60 fps (p95 de 33 a 17 ms); con WebGL por software de 1,8 a 9,8 fps.
  Son cifras relativas: falta medir en una GPU y un teléfono reales.

## Qué se descartó a propósito

De las recetas de GSAP no se usaron el cursor elástico, la inclinación 3D de tarjetas ni el título palabra por palabra:
son decoración sin función y chocan con el criterio de `animate`. Sí se aplicaron sus reglas de rendimiento
(solo `transform` y `opacity` cuando se puede, `ScrollTrigger` en lugar de `scroll` sin throttle, curvas con desaceleración).

## Verificación

Capturas con Chromium en movimiento normal y reducido: fases de Auri, estados finales, pausa fuera de pantalla y
salto de la pantalla de carga. No se midieron cuadros por segundo en un teléfono real; falta esa prueba en dispositivo.

## Vidrio líquido

- **Tarjeta de respuesta de Auri:** casi transparente, con desenfoque y saturación de lo que hay detrás, borde de luz, reflejos internos y un brillo especular arriba a la izquierda.
- **Barra de navegación:** la misma idea en versión oscura (tinte negro translúcido). Los enlaces al pasar el cursor y el botón del menú móvil son cápsulas de vidrio.
- `backdrop-filter` está en la barra, en la tarjeta y en las piezas de la escena del sistema (sobre el fondo Lightfall a 1x, que se pausa fuera de pantalla). Mientras dura esa escena la barra se esconde; la caja de Auri ya no lo usa porque obligaba a repintar en cada cuadro del WebGL.

## Escena, widgets y logo (rediseño con motion graphics)

- **Escena «del desorden a un panel»** (`SystemScene.astro` + `src/scripts/system-scene.ts`): una sola línea de tiempo ligada al scroll
  (la única sección fijada de toda la página). Seis tarjetas sueltas se ordenan, se conectan en un flujo de tres nodos por donde
  viajan los datos y las mismas tarjetas se transforman en los widgets de un panel (KPIs, gráfico, embudo, tareas). Auri es el
  nodo que clasifica y termina como insignia del panel. Es la misma lógica de continuidad que la transformación de Auri en el hero.
  Se recalcula al cambiar el tamaño y tiene versión móvil. Sin movimiento reducido o sin JavaScript, muestra el panel final ya armado.
- **Widgets de Servicios** (`Capabilities.astro` + `src/scripts/widgets.ts`): cuatro animaciones autónomas que se repiten solas
  (interfaz que se construye, flujo de automatización, documento que se analiza, panel que se llena). Se pausan fuera de pantalla.
- **Logo del footer** (`DotLogo.tsx`): la N y la palabra THRIVE hechas de partículas, con la física de «Cursor driven particles
  typography» (repulsión por radio, resorte 0,08, amortiguación 0,85) pero con paso escalado por el tiempo real, para que se
  sienta igual a 60, 120 o 144 Hz. Se duerme en reposo.

### Actualización: Servicios, proceso, diferenciales, FAQ y contacto

- **Auri en la escena**: salta de nodo en nodo (squash al caer, estiramiento en el aire) y termina como insignia del panel. Sin textos de estado.
- **Servicios** (`Capabilities.astro` + `widgets.ts`): cuatro tarjetas de igual altura con visuales animados hechos con piezas de NEXUS (pantalla que se arma con cursor que pulsa el balance, flujo tipo n8n, documento leído por Auri, panel con anillo y embudo).
- **Nuestro trabajo** (`Proof.astro` + `assemble.ts`): la captura real llega en seis piezas, se endereza desde una inclinación y se pierde en un difuminado negro; el botón queda sobre el difuminado.
- **Cómo trabajamos** (`Process.astro`): sin elementos fijos. Una línea se dibuja con el scroll, las tarjetas entran con desenfoque y cada paso tiene su ilustración autónoma (conversación, plano, construcción, en funcionamiento).
- **Por qué NexusThrive** (`Differentials.astro`): mosaico con siete animaciones CSS autónomas y brillo que sigue al cursor.
- **Preguntas frecuentes** (`Faq.astro`): tarjetas numeradas con altura animada y una tarjeta de vidrio con Auri.
- **Contacto** (`DiagnosisForm.astro`): fondo de éter líquido (`LiquidEther.tsx`, OGL, ~30 fps, se pausa fuera de pantalla), tarjeta de vidrio, selector propio y Auri que habla según el campo (`FormAuri.tsx`).
- **Nota de desarrollo:** si el servidor de desarrollo muestra estilos viejos tras reescribir un archivo completo, reiniciarlo (`astro dev stop` y `astro dev --background`).

### Secciones a pantalla completa

- Cada sección lleva la clase `.full` (`global.css`): alto mínimo de la ventana, fondo WebGL propio a sangre (`SectionBackground.tsx`, blanco plata, sin cursor, montado solo cerca de la pantalla) y superficies de vidrio (`.glass-lg` y tokens redefinidos).
- Fijadas al scroll: la escena del sistema, Servicios (`caps-scene.ts`, un servicio por pantalla) y Cómo trabajamos (`motion.ts`, solo escritorio). Si el contenido no cabe en la ventana no se fijan y quedan apiladas.
- La barra se esconde al bajar y vuelve al subir; en la escena del sistema no aparece.

### Pendiente (siguiente fase)

- Páginas por sector y de cada servicio.
- Sección «Nosotros» con contenido real.
