/**
 * Contenido de la landing, separado de la presentación.
 *
 * Regla: aquí solo va lo verificable. Las funciones marcadas "disponible"
 * existen hoy en la app (app.nexusthrive.com.co, repositorio nexus-thrive);
 * "en desarrollo" está planeado pero no se puede contratar; "a medida" es
 * un servicio que el equipo implementa por proyecto.
 */

export const SITE_URL = 'https://nexusthrive.com.co';
export const APP_URL = 'https://app.nexusthrive.com.co';
export const SITE_NAME = 'NEXUS THRIVE';

export const WHATSAPP_NUMBER = '573237453913';
export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Redes publicadas en el sitio anterior. */
export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/nexusthrive' },
  { label: 'TikTok', href: 'https://tiktok.com/@nexusthrive' },
  { label: 'X', href: 'https://x.com/nexusthrive' },
] as const;

export const NAV = [
  { label: 'Producto', href: '/#producto' },
  { label: 'Soluciones', href: '/#soluciones' },
  { label: 'Cómo funciona', href: '/#metodo' },
  { label: 'Ayuda', href: '/help' },
  { label: 'Nosotros', href: '/#equipo' },
] as const;

export type Availability = 'live' | 'dev' | 'custom';

export const AVAILABILITY: Record<Availability, string> = {
  live: 'Disponible',
  dev: 'En desarrollo',
  custom: 'A medida',
};

/** Beneficios de "¿Qué es NEXUS?" (resultados, no promesas). */
export const OUTCOMES = [
  { title: 'Operación en un solo lugar', text: 'Clientes, cobros, caja, agenda e inventario comparten la misma información. Lo que pasa en recepción se ve en finanzas.' },
  { title: 'Clientes ordenados', text: 'Una ficha 360° por cliente con sus datos, pagos, membresías, notas y actividad.' },
  { title: 'Menos tareas repetidas', text: 'Recibos numerados automáticamente, vencimientos calculados solos y recordatorios listos para enviar por WhatsApp.' },
  { title: 'Pagos con trazabilidad', text: 'Cada cobro tiene recibo consecutivo y comprobante; una anulación lleva motivo y no borra el historial.' },
  { title: 'Adaptado al negocio', text: 'El vocabulario, los campos del cliente y los módulos cambian según el rubro: socios en un gimnasio, visitantes en un museo, obras en una constructora.' },
  { title: 'Crece con la empresa', text: 'Equipo con roles y permisos, módulos que se activan por plan y una base técnica pensada para sumar funciones.' },
] as const;

export type Module = {
  id: string;
  title: string;
  problem: string;
  points: string[];
  status: Availability;
  /** Funciones del módulo que todavía no existen (se muestran aparte). */
  next?: string;
};

export const MODULES: Module[] = [
  {
    id: 'clientes',
    title: 'Clientes y relaciones',
    problem: 'Los datos del cliente viven en cuadernos, chats y hojas sueltas.',
    points: ['Ficha 360° con historial de pagos, membresías y notas', 'Campos según el rubro y etiquetas', 'WhatsApp directo desde la ficha'],
    status: 'live',
  },
  {
    id: 'membresias',
    title: 'Membresías y suscripciones',
    problem: 'Nadie sabe con certeza quién está al día y quién venció.',
    points: ['Estados activa, por vencer y vencida calculados al día', 'Renovar, congelar y cancelar con motivo', 'Lista de vencimientos con aviso por WhatsApp'],
    status: 'live',
  },
  {
    id: 'pagos',
    title: 'Pagos, caja e historial',
    problem: 'El dinero entra por varios lados y al final del día no cuadra.',
    points: ['Recibo consecutivo y comprobante en cada cobro', 'Caja menor con apertura, arqueo y cierre', 'Gastos con soporte, cuentas de cobro e inventario'],
    status: 'live',
    next: 'Factura electrónica DIAN y cobro en línea de planes: en desarrollo.',
  },
  {
    id: 'acceso',
    title: 'Identificación con QR y NFC',
    problem: 'En la puerta no hay forma rápida de saber si alguien puede entrar.',
    points: ['QR personal leído con la cámara de cualquier teléfono', 'Tarjeta NFC vinculada al socio (Chrome en Android o lector USB)', 'Cada intento queda registrado, permitido o negado'],
    status: 'live',
  },
  {
    id: 'automatizacion',
    title: 'Automatización de procesos',
    problem: 'Las mismas tareas se repiten a mano todos los días.',
    points: ['Hoy: recibos, vencimientos y recordatorios preparados por el sistema', 'En camino: conectar el WhatsApp de cada negocio', 'En camino: asistente por WhatsApp que pide confirmación antes de cambiar algo'],
    status: 'dev',
  },
  {
    id: 'digital',
    title: 'Soluciones digitales',
    problem: 'Un negocio sin presencia digital no existe para quien lo busca.',
    points: ['Sitios web y páginas de negocio', 'Presence Thrive: medición de la visibilidad del negocio dentro de la app', 'Proyectos diseñados desde el problema real'],
    status: 'custom',
  },
  {
    id: 'infraestructura',
    title: 'Infraestructura e integraciones',
    problem: 'Las herramientas no se hablan entre sí.',
    points: ['Datos aislados por negocio, roles y auditoría', 'Integraciones a medida según el caso', 'Pasarela de pagos y WhatsApp Business: en desarrollo'],
    status: 'custom',
  },
];

/** Otros rubros que la app ya tiene implementados (verificado en el código). */
export const ALSO_LIVE = ['Agenda con calendario y cupos', 'Taquilla de museo con aforo por franja', 'Presupuesto y control de obra para constructoras', 'Equipo con roles y permisos'];

/** Flujo del caso gimnasio. Cada paso existe en la app. */
export const GYM_FLOW = [
  { title: 'Registro del socio', text: 'Ficha con documento, contacto, foto y datos del gimnasio (peso, estatura, objetivo).' },
  { title: 'Membresía', text: 'Se crea con su plan y su precio; el cobro inicial sale con recibo numerado.' },
  { title: 'Vencimientos', text: 'El estado se calcula cada día y la lista de la semana trae el aviso por WhatsApp listo.' },
  { title: 'Pagos', text: 'Renovaciones con recibo y entrada a caja cuando se paga en efectivo.' },
  { title: 'Acceso con QR o NFC', text: 'En la puerta se lee el QR o la tarjeta y se ve en grande si puede entrar y cuánto le queda.' },
  { title: 'Historial y actividad', text: 'Asistencia, pagos y membresías de cada socio en su ficha 360°.' },
  { title: 'Panel administrativo', text: 'Ingresos, gastos, socios activos y caja desde el Inicio del negocio.' },
] as const;

export const METHOD = [
  { n: '01', title: 'Entender el problema', text: 'Escuchamos cómo opera hoy el negocio: qué se anota, dónde se pierde el dinero, qué se repite.' },
  { n: '02', title: 'Diseñar la solución', text: 'Definimos qué módulos sirven, qué datos importan y cómo debe verse cada pantalla para quien la usa.' },
  { n: '03', title: 'Construir el sistema', text: 'Configuramos NEXUS para el negocio y construimos a medida lo que falte, con pruebas.' },
  { n: '04', title: 'Implementar y mejorar', text: 'Acompañamos la puesta en marcha, medimos el uso real y ajustamos.' },
] as const;

export const AUDIENCES = [
  { title: 'Emprendimientos', text: 'Empezar ordenado desde el primer cliente, sin hojas de cálculo.' },
  { title: 'Comercios locales', text: 'Ventas, caja, inventario y clientes en un mismo lugar.' },
  { title: 'Gimnasios y negocios de membresías', text: 'Socios, vencimientos, cobros y control de acceso: el caso más completo hoy.' },
  { title: 'Instituciones educativas', text: 'Se analiza cada caso: registros, pagos y comunicación según sus procesos.' },
  { title: 'Empresas que se digitalizan', text: 'Procesos en papel convertidos en flujos con datos y responsables.' },
] as const;

/**
 * Equipo: nombres y áreas tal como aparecían en la landing anterior. Sin
 * fotos publicadas: se muestran iniciales. Para agregar una foto, importar
 * el archivo en Team.astro y asignarlo a `photo`.
 */
export const TEAM = [
  { name: 'Santiago Castellar', area: 'Dirección', text: 'Dirige NEXUS y acompaña a cada negocio desde la primera conversación hasta la entrega.', initials: 'SC' },
  { name: 'Carlos Mario Hernandez', area: 'Producto', text: 'Convierte las necesidades de cada negocio en producto que se usa de verdad.', initials: 'CH' },
  { name: 'Nicolas Florez', area: 'Finanzas', text: 'Presupuestos claros y pagos con comprobante, sin sorpresas.', initials: 'NF' },
  { name: 'Justin Cabarcas', area: 'Redes y captación', text: 'Redes y captación: que a cada negocio lo encuentren y lo contacten.', initials: 'JC' },
] as const;

export const PRINCIPLES = [
  { title: 'Entender antes de construir', text: 'Primero el problema; después la solución.' },
  { title: 'Soluciones útiles', text: 'Si una pantalla no se usa, sobra.' },
  { title: 'Tecnología con propósito', text: 'Cada función responde a una tarea real del negocio.' },
  { title: 'Sistemas mantenibles', text: 'Código probado y datos ordenados que resisten el crecimiento.' },
  { title: 'Mejora continua', text: 'Versiones pequeñas, medidas y corregidas.' },
  { title: 'Relaciones de confianza', text: 'Acuerdos claros y trato directo con quien construye.' },
] as const;
