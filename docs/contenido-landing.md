# Contenido de la landing

La copia vive en `src/data/landing.ts`. Este documento reúne lo que no se ve en la página: estructura, SEO,
decisiones y los pendientes de información. El movimiento está en `docs/movimiento-landing.md`.

## Posicionamiento

NexusThrive se presenta como un equipo de **soluciones digitales para empresas**: el visitante reconoce un problema
de su negocio, descubre una solución y entiende por qué hablar con el equipo. No se vende un catálogo de
tecnologías ni una metodología de producto. Sin cifras, clientes ni testimonios inventados; las demostraciones
animadas usan datos simulados y lo dicen.

## Estructura de la página

| # | Sección | Ancla | Qué hace |
|---|---|---|---|
| 1 | Hero | — | Propuesta de valor y contacto principal; fondo animado y Auri |
| 2 | Problemas que resolvemos | `#problemas` | Seis situaciones reconocibles |
| 3 | Escena «del desorden a un panel» | `#sistema` | Motion graphics ligado al scroll (datos simulados) |
| 4 | Servicios | `#servicios` | Cuatro capacidades con widgets animados autónomos |
| 5 | Nuestro trabajo | `#trabajo` | NEXUS, producto propio: captura real grande que se arma con el scroll |
| 6 | Cómo trabajamos | `#nosotros` | Cuatro pasos |
| 7 | Por qué NexusThrive | `#diferenciales` | Siete diferenciadores |
| 8 | Preguntas frecuentes | `#faq` | Objeciones comerciales |
| 9 | Hablemos | `#diagnostico` | Formulario breve (abre WhatsApp) |

Navegación: Soluciones (lleva a la escena `#sistema`) · Servicios · Nuestro trabajo · Nosotros · **Hablemos de tu proyecto**.

Se quitó la sección «Soluciones para tu sector» y los textos pequeños con barra («eyebrows») sobre los títulos.

## SEO básico

- **Título:** NexusThrive | Soluciones digitales para empresas
- **Meta descripción:** Software, automatización e inteligencia artificial para empresas. Conectamos tus procesos y
  simplificamos tu operación. Desde Cartagena y Turbaco, Colombia.
- **Datos estructurados:** `Organization` (Layout) y `FAQPage` (Faq).

## Decisiones

- **Auri no es una IA generativa.** Responde con reglas por palabras clave (`AURI_RULES`). Sus respuestas ya no hablan de MVP.
- **El formulario no tiene servidor.** Valida, arma el mensaje y abre WhatsApp con el número del sitio.
- **«Nuestro trabajo» solo muestra NEXUS**, el producto propio, con capturas reales. No presenta resultados comerciales ni uso por clientes.
- **Modo oscuro fijo.** No hay selector de tema.
- **Hero:** el texto pedía «ayudarte a crecer con mayor control»; se dejó «a trabajar con más control» para evitar una promesa genérica de crecimiento.
- **Datos del equipo** (`FOUNDERS` en `src/data/site.ts`): existen del sitio anterior pero no se muestran hasta decidir el contenido de «Nosotros».

## Pendientes de información (privados; no aparecen en la página)

Estas respuestas hoy están redactadas sin comprometer cifras. Si se quiere más precisión, hace falta el dato real:

- Rangos de tiempo por tipo de proyecto (FAQ «¿Cuánto tarda?»).
- Política de datos y medidas de seguridad detalladas (FAQ «¿Cómo manejan los datos?»).
- Condiciones del soporte posterior (FAQ «soporte»).
- Correo y teléfono oficiales de contacto.
- Casos de clientes autorizados para publicar: cuando existan, se incorporan a «Nuestro trabajo» con contexto, alcance y resultados comprobables.
- Contenido real de «Nosotros» (equipo, trayectoria) si se quiere esa sección.
