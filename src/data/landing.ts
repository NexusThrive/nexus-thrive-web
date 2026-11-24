/**
 * Contenido de la landing (soluciones digitales para empresas).
 *
 * Regla: nada inventado. Sin clientes, métricas, testimonios, precios ni casos
 * reales. La única prueba que se muestra es NEXUS, el producto propio del
 * equipo, con capturas reales de la app. Los sectores son «posibilidades de
 * implementación»; las demostraciones animadas usan datos simulados y lo dicen.
 * Los pendientes de información están en docs/contenido-landing.md, no en la
 * página. Sin palabras de relleno ni promesas genéricas de crecimiento.
 */

export const HERO = {
  eyebrow: 'Tecnología para empresas que quieren avanzar',
  titleLines: ['Tu empresa tiene más potencial.', 'Hagamos que la tecnología trabaje a su favor.'],
  titleMark: 'Hagamos que la tecnología trabaje a su favor.',
  subtitle:
    'Desarrollamos software, automatizaciones e inteligencia artificial para conectar tus procesos, simplificar tu operación y ayudarte a trabajar con más control.',
  primary: 'Cuéntanos qué necesitas',
  secondary: 'Explorar soluciones',
  note: 'Desde Cartagena y Turbaco, desarrollamos soluciones para empresas en Colombia.',
} as const;

export const CTA = {
  primary: 'Hablemos de tu proyecto',
  send: 'Hablemos de tu proyecto',
  sending: 'Preparando tu mensaje…',
} as const;

export const PROBLEM = {
  eyebrow: 'Problemas que resolvemos',
  title: '¿Te resulta familiar alguna de estas situaciones?',
  pains: [
    { title: 'Los clientes escriben, pero el seguimiento se pierde.' },
    { title: 'Tu operación depende de hojas de cálculo y procesos manuales.' },
    { title: 'Tu equipo dedica horas a tareas que podrían automatizarse.' },
    { title: 'Tus sistemas funcionan por separado y duplican el trabajo.' },
    { title: 'Tienes información, pero cuesta convertirla en decisiones.' },
    { title: 'Necesitas una plataforma que tus clientes o empleados puedan utilizar.' },
  ],
} as const;

/** Escena animada: del desorden a un panel conectado (datos simulados). */
export const SCENE = {
  eyebrow: 'Así trabaja un sistema conectado',
  title: 'Del desorden a un solo lugar donde ver y decidir.',
  captions: [
    'Mensajes, documentos y hojas de cálculo llegan por todos lados.',
    'Los ordenamos en un flujo que sabe qué hacer con cada solicitud.',
    'Cada dato recorre el flujo y se vuelve un registro, un aviso o una tarea.',
    'El resultado: un panel con lo importante en un solo lugar.',
  ],
  sources: ['WhatsApp', 'Correo', 'Hoja de cálculo', 'Formulario', 'Calendario', 'Facturas'],
  nodes: ['Llega una solicitud', 'Se clasifica', 'Se registra y avisa'],
} as const;

export const CAPABILITIES_SECTION = {
  eyebrow: 'Servicios',
  title: 'Cuatro formas de hacer que tu empresa trabaje mejor.',
} as const;

export type Capability = { id: string; title: string; text: string; widget: 'build' | 'flow' | 'ai' | 'data' };

export const CAPABILITIES: Capability[] = [
  {
    id: 'software',
    title: 'Software diseñado para tu empresa',
    text: 'Deja de adaptar tu operación a herramientas que no fueron pensadas para ella. Creamos plataformas, portales y sistemas que responden a la forma en que realmente trabajas.',
    widget: 'build',
  },
  {
    id: 'automatizacion',
    title: 'Automatización de procesos',
    text: 'Hay tareas que tu equipo no debería repetir todos los días. Conectamos herramientas y automatizamos procesos para reducir trabajo manual, errores y retrasos.',
    widget: 'flow',
  },
  {
    id: 'ia',
    title: 'Inteligencia artificial aplicada',
    text: 'Convertimos la IA en una herramienta útil para tu operación: organizar información, preparar respuestas, analizar documentos y asistir a tu equipo en tareas concretas.',
    widget: 'ai',
  },
  {
    id: 'datos',
    title: 'Datos, control y crecimiento',
    text: 'Reúne la información importante de tu negocio en un solo lugar. Diseñamos paneles y herramientas para que puedas seguir tu operación y tomar decisiones con información clara.',
    widget: 'data',
  },
];

export const PROOF = {
  eyebrow: 'Nuestro trabajo',
  title: 'No solo hablamos de construir tecnología. También desarrollamos nuestros propios productos.',
  text: 'NEXUS es la plataforma de gestión que desarrollamos de punta a punta: clientes, membresías, pagos, caja, agenda y control de acceso. Es una demostración real de cómo piensa y construye el equipo.',
  note: 'Capturas reales de la app con datos de demostración.',
  cta: 'Conocer NEXUS',
} as const;

export const PROCESS_SECTION = {
  eyebrow: 'Cómo trabajamos',
  title: 'De un problema que cuesta tiempo a una solución que trabaja contigo.',
  lead: 'Un proceso claro, por etapas y con comunicación directa.',
} as const;

export const PROCESS = [
  { n: '01', title: 'Entendemos tu negocio', text: 'Nos cuentas qué necesitas mejorar, cómo trabajas hoy y qué resultado buscas.', note: 'La primera conversación es gratuita.' },
  { n: '02', title: 'Diseñamos una solución viable', text: 'Definimos qué conviene construir, integrar o automatizar, con alcance y prioridades claras.', note: 'Una propuesta concreta, por escrito.' },
  { n: '03', title: 'Construimos y validamos', text: 'Desarrollamos por etapas para que puedas revisar avances y probar lo que estamos creando.', note: 'Sin sorpresas al final.' },
  { n: '04', title: 'Implementamos y acompañamos', text: 'Ponemos la solución en funcionamiento, orientamos a tu equipo y acordamos el soporte necesario.', note: 'Tu equipo queda con autonomía.' },
] as const;

export const DIFFERENTIALS_SECTION = {
  eyebrow: 'Por qué NexusThrive',
  title: 'Soluciones a tu medida, con un equipo cercano.',
} as const;

export const DIFFERENTIALS = [
  { title: 'Atención directa', text: 'Hablas con quienes construyen tu solución. Sin intermediarios ni tickets sin respuesta.' },
  { title: 'Soluciones a tu medida', text: 'Partimos de cómo trabajas, no de una plantilla.' },
  { title: 'Entregas por etapas', text: 'Ves avances reales desde las primeras semanas y ajustas antes de invertir en lo siguiente.' },
  { title: 'Con lo que ya usas', text: 'Integramos tus herramientas actuales cuando sirven. No te obligamos a empezar de cero.' },
  { title: 'Resultados medibles', text: 'Definimos desde el inicio qué vamos a medir para saber si la solución funciona.' },
  { title: 'Transparencia con tus datos', text: 'Sabes dónde viven tus datos, quién tiene acceso y cómo se mantiene el sistema.' },
  { title: 'Soporte y evolución', text: 'Después de implementar seguimos disponibles para corregir, medir y mejorar.' },
] as const;

export const FORM = {
  eyebrow: 'Hablemos de tu empresa',
  title: 'Ese proceso que hoy te quita tiempo podría funcionar de otra manera.',
  lead: 'Cuéntanos qué quieres mejorar. Revisaremos tu situación y te ayudaremos a identificar un primer paso viable, sin compromiso.',
  fields: {
    name: { label: 'Tu nombre', placeholder: 'Ej. Laura Gómez', error: 'Escribe tu nombre para saber cómo llamarte.' },
    business: { label: 'Tu empresa', placeholder: 'Ej. Inmobiliaria del Caribe', error: 'Cuéntanos el nombre de tu empresa.' },
    topic: {
      label: '¿Qué quieres resolver?',
      placeholder: 'Elige lo que más se parece',
      error: 'Elige un tema para orientar la conversación.',
      options: [
        'Software a medida',
        'Automatizar procesos repetitivos',
        'IA para clasificar, resumir o redactar',
        'Datos, paneles y control',
        'Mejorar algo que ya tengo',
        'No lo tengo claro todavía',
      ],
    },
    message: {
      label: 'Cuéntanos qué quieres mejorar',
      placeholder: 'Ej. Mis clientes escriben por varios canales y no tengo cómo saber a quién le falta respuesta.',
      help: 'No necesitas ser técnico. Con una frase nos basta.',
      error: 'Cuéntanos en una frase qué quieres mejorar (mínimo 10 caracteres).',
    },
  },
  privacy: 'Solo usamos estos datos para responder tu solicitud.',
  success: {
    title: 'Listo, ya tenemos tu mensaje.',
    text: 'Se abrió WhatsApp con tu solicitud. Envíala y te respondemos para acordar los 20 minutos. Si no se abrió, usa el botón de abajo.',
    retry: 'Abrir WhatsApp de nuevo',
  },
  failure: 'No pudimos abrir WhatsApp desde aquí. Escríbenos directo y cuéntanos tu caso.',
} as const;

export const FAQ_SECTION = {
  eyebrow: 'Preguntas frecuentes',
  title: 'Lo que nos suelen preguntar.',
} as const;

export const FAQ = [
  {
    q: '¿Para qué tipo de empresas trabajan?',
    a: 'Pymes, empresas de servicios, comercios y equipos de Cartagena, Turbaco, Bolívar y el resto de Colombia. Lo que importa no es el sector, sino que haya procesos manuales, datos dispersos o una plataforma por construir.',
  },
  {
    q: '¿Qué pasa en la primera conversación?',
    a: 'Nos cuentas qué quieres mejorar y cómo trabajas hoy. Te decimos con honestidad qué haría sentido hacer primero y, si hay un camino viable, te enviamos una propuesta por escrito de la primera etapa. No hay compromiso.',
  },
  {
    q: '¿Hacen páginas web o software a medida?',
    a: 'Ambas, y lo que hay en medio: sitios, portales, paneles, sistemas internos, automatizaciones e integraciones. Una página que capte contactos puede ser el primer paso; lo siguiente depende de lo que tu operación necesite.',
  },
  {
    q: '¿Pueden integrar herramientas que ya uso? ¿Necesito un CRM?',
    a: 'Sí, y en general preferimos aprovechar lo que ya tienes: Google Workspace, tu CRM o ERP, pasarelas de pago o los servicios que ya utilizas. No necesitas un CRM para empezar; si más adelante lo requieres, te ayudamos a elegir el adecuado o a construir lo que falte.',
  },
  {
    q: '¿Pueden automatizar WhatsApp?',
    a: 'Es una posibilidad, pero depende de tu número, de tu cuenta de Meta Business y de los permisos y la verificación que Meta exija. Por eso lo tratamos como un canal opcional que se evalúa en la conversación, no como algo inmediato.',
  },
  {
    q: '¿Cuánto tarda un proyecto?',
    a: 'Depende del alcance: no es lo mismo una automatización puntual que una plataforma completa. Después de la primera conversación te damos un tiempo estimado por escrito para la primera etapa.',
  },
  {
    q: '¿Cómo manejan los datos y la seguridad?',
    a: 'Trabajamos con los accesos mínimos necesarios y te decimos dónde viven tus datos y quién puede verlos. Lo acordamos por escrito antes de empezar, junto con cómo se hace el mantenimiento.',
  },
  {
    q: '¿Ofrecen soporte después de la implementación?',
    a: 'Sí. Acordamos el soporte y la evolución según cada proyecto: corregimos, medimos y sumamos funciones cuando tu negocio lo pida.',
  },
] as const;

export const FOOTER = {
  tagline: 'Soluciones digitales para empresas · Turbaco, Bolívar, Colombia.',
} as const;

/* ---------- Auri: sugerencias por palabras clave (sin IA generativa) ---------- */

export const AURI = {
  placeholder: 'Ej. Mis clientes escriben por varios canales y se me pierde el seguimiento…',
  labels: ['Leyendo', 'Buscando ruta', 'Analizando', 'Redactando'],
  done: 'Listo',
  answerTitle: 'Auri sugiere',
  send: 'Enviar',
  examples: [
    'Los clientes escriben por WhatsApp y se me pierde el seguimiento',
    'Mis reservas están en cuadernos y se cruzan',
    'Paso horas copiando datos de Excel a otro sistema',
    'Armo los reportes del mes a mano',
  ],
} as const;

export type AuriRule = { service: string; keys: RegExp; text: string };

/** Sugerencias de Auri: la primera regla que coincida gana. */
export const AURI_RULES: AuriRule[] = [
  {
    service: 'software',
    keys: /\bapp\b|aplicaci[oó]n|plataforma|portal|sistema propio|desde cero/i,
    text: 'Empezaría por entender qué necesitan hacer tus clientes o tu equipo en esa plataforma y definir qué conviene construir primero.',
  },
  {
    service: 'software',
    keys: /lead|prospecto|cliente.*(escrib|pierd|respond|segu)|(segu|respond).*cliente|whatsapp|instagram|campa[nñ]a|anuncio|interesad|p[aá]gina|landing|web/i,
    text: 'Un formulario que registre cada contacto y avise a tu equipo, con seguimiento automático para que ninguna solicitud se pierda.',
  },
  {
    service: 'software',
    keys: /reserva|turno|cita|agenda|calendario|inventario|stock|cotiz|ticket|pedido/i,
    text: 'Esto pide un sistema a la medida: registro ordenado, estados claros y avisos automáticos, construido por etapas.',
  },
  {
    service: 'automatizacion',
    keys: /excel|hoja|dato|informaci[oó]n.*(dispers|regad|suelt)|dispers|duplic|varios (lados|sistemas)|conectar|integrar/i,
    text: 'Conectar tus herramientas para que un dato se escriba una sola vez y llegue a donde se necesita.',
  },
  {
    service: 'datos',
    keys: /reporte|informe|dashboard|panel|m[eé]trica|indicador|visibilidad|c[oó]mo va/i,
    text: 'Un panel que junte tus datos y muestre lo importante, sin armar el reporte a mano.',
  },
  {
    service: 'automatizacion',
    keys: /repet|manual|a mano|copiar|pegar|correo|cobro|pago|factura|cartera|recordatorio|tarea|proceso/i,
    text: 'Un flujo automatizado: lo repetitivo lo hace el sistema y tu equipo solo revisa lo importante.',
  },
  {
    service: 'ia',
    keys: /\bia\b|inteligencia|clasific|resum|redact|borrador|chatbot/i,
    text: 'La IA puede clasificar, resumir y preparar borradores, siempre con una persona que revisa. Se evalúa en qué parte del proceso aporta más.',
  },
];

export const AURI_FALLBACK: AuriRule = {
  service: 'claridad',
  keys: /./,
  text: 'Con una frase no alcanzo a ver el panorama completo. Lo más útil es una conversación corta para entender tu caso.',
};

export function auriSuggest(input: string): AuriRule {
  return AURI_RULES.find((r) => r.keys.test(input)) ?? AURI_FALLBACK;
}
