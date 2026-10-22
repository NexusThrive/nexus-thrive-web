/**
 * Contenido del centro de ayuda (/help).
 *
 * Regla: aquí solo va lo que la app hace de verdad hoy
 * (repositorio nexus-thrive, app.nexusthrive.com.co). Si una función no
 * existe todavía, no se promete: se dice que está en camino.
 */

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  /** Pasos numerados de la tarea. */
  steps: string[];
  /** Errores frecuentes y qué hacer. */
  notes?: { q: string; a: string }[];
  /** A dónde lleva dentro de la app. */
  where?: string;
};

export const HELP_INTRO = {
  eyebrow: 'Centro de ayuda',
  title: 'Cómo se usa NEXUS, paso a paso.',
  lead: 'Guías cortas de lo que hoy hace la plataforma: clientes, membresías, pagos, caja, agenda, control de acceso y presencia digital. Si algo no aparece en tu pantalla, escríbenos: la app cambia con cada versión.',
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: 'primer-dia',
    title: 'El primer día: dejar el negocio ordenado',
    summary:
      'El orden recommended para partir con datos reales: perfil, clientes, catálogo, cobros y accesos.',
    where: 'NEXUS → Inicio',
    steps: [
      'Ajustes → Perfil: nombre comercial, dirección, NIT y WhatsApp. Con eso el negocio ya se ve en la ficha y en los comprobantes.',
      'Clientes → Nuevo: cada persona que te compra o se inscribe tiene su ficha 360° con datos, pagos, membresías, notas y actividad.',
      'Inventario → Productos: carga lo que vendes. Sin catálogo no hay venta ni control de existencias.',
      'Finanzas → Cobros: registra el primer cobro. Cada pago sale con recibo numerado y entra a la caja.',
      'Agenda → Citas: abre el calendario y empieza a agendar.',
      'Módulos (Ajustes → Módulos): activa solo los que usarás de verdad. Se pueden cambiar cuando quieras.',
    ],
    notes: [
      {
        q: '¿El equipo de mi negocio también entra?',
        a: 'Sí. Ajustes → Equipo: invitas por correo y eliges rol (Administración, Recepción o Asesor). Cada quien entra solo a lo que su rol permite.',
      },
    ],
  },
  {
    slug: 'clientes',
    title: 'Clientes: la ficha 360°',
    summary:
      'Todo lo de una persona en una sola pantalla: datos, pagos, membresías, notas y actividad.',
    where: 'NEXUS → Clientes',
    steps: [
      'Clientes → Nuevo: nombre, documento, teléfono y correo. El documento es lo que permite encontrarlo rápido.',
      'Sube la foto: en la ficha, el ícono de imagen. Se ve en recepción y en los recibos.',
      'Los datos que dependen del rubro (peso y objetivo en un gimnasio,Measurements y talla en un taller) aparecen solos según el módulo activo.',
      'Cada pago, cada membresía y cada nota quedan en la misma ficha: no hace falta buscar en otro lado.',
      'Desde la ficha puedes escribirle por WhatsApp sin copiar el número a mano.',
    ],
  },
  {
    slug: 'membresias',
    title: 'Membresías: quién está al día y quién venció',
    summary:
      'Los estados se calculan solos cada día. Tú renuevas, congelas o cancelas con un motivo.',
    where: 'NEXUS → Membresías',
    steps: [
      'Membresías → Nueva: eliges el socio, el plan, el precio y las fechas.',
      'El estado (activa, por vencer, vencida) se recalcula solo: no hay que marcar nada.',
      'Renovar extends las fechas; congelar corre el vencimiento los días que decidas (guarda el tiempo no usado); cancelar deja el motivo registrado.',
      'La lista de la semana trae el aviso por WhatsApp listo para enviar a quien vence.',
    ],
    notes: [
      {
        q: '¿El socio entra si está congelado?',
        a: 'No. En el control de acceso se ve "Su membresía está congelada" y el tiempo que le queda guardado.',
      },
    ],
  },
  {
    slug: 'pagos-y-caja',
    title: 'Pagos, caja y gastos',
    summary:
      'Cada cobro numerado, con comprobante; la caja se abre, se cuenta y se cierra.',
    where: 'NEXUS → Finanzas',
    steps: [
      'Finanzas → Cobros: registra el pago (socio, cliente o venta). Sale con recibo numerado y se puede imprimir o enviar por WhatsApp.',
      'Una anulación pide motivo y no borra el historial: el dinero sigue auditado.',
      'Caja menor: Ábrela al empezar el turno, registra entradas y salidas (gastos con soporte) y haz el arqueo al cerrar.',
      'Facturación: emite cuentas de cobro y recibos imprimibles para quien necesita factura.',
      'El Inicio muestra ingresos, gastos y balance del mes: ahí ves si el día cuadró.',
    ],
  },
  {
    slug: 'control-de-acceso',
    title: 'Control de acceso con QR y NFC',
    summary:
      'En la puerta se lee el QR o la tarjeta y se ve en grande si puede entrar y cuánto le queda.',
    where: 'NEXUS → Control de acceso',
    steps: [
      'Cada socio tiene un código personal (el QR de su carné). Con la cámara de cualquier teléfono se lee.',
      'Para usar una tarjeta NFC: en la ficha del socio, "Acceso al gimnasio" → Vincular. Se acerca la tarjeta al teléfono (Chrome en Android) o se escribe el número de serie.',
      'En la puerta: Control de acceso → escribir el código, escanear con la cámara o acercar la tarjeta. Sale "Puede entrar" o "No puede entrar" con el motivo.',
      'Cada intento queda registrado, permitido o negado, y los códigos desconocidos se ven aparte: así sabes si alguien está probando códigos.',
    ],
    notes: [
      {
        q: 'En iPhone no me deja leer la tarjeta.',
        a: 'La web de iOS no lee NFC. Usa el QR del carné (cámara) o un lector USB, que funciona como teclado.',
      },
      {
        q: '¿Y si alguien copia el QR de otro?',
        a: 'El QR es como una tarjeta: personal e intransferible. Si se pierde o se filtra, genera uno nuevo en la ficha (el botón "Nuevo").',
      },
    ],
  },
  {
    slug: 'agenda',
    title: 'Agenda y citas',
    summary: 'Calendario con cupos, responsables y recordatorios por WhatsApp.',
    where: 'NEXUS → Agenda',
    steps: [
      'Agenda → Nueva cita: cliente, servicio, hora y duración.',
      'El calendario muestra mes, semana y día, con el color de cada servicio y los cupos ocupados.',
      'Si se encima una cita, la app lo avisa antes de guardarla.',
      'Cada cita puede llevar un recordatorio por WhatsApp.',
    ],
  },
  {
    slug: 'presencia',
    title: 'Presencia digital: tu puntaje y tus canales',
    summary:
      'Mide qué tan fácil te encuentran en internet y de qué_channels está conectado.',
    where: 'NEXUS → Presence Thrive',
    steps: [
      'Ajustes → Perfil → Presencia digital: escribe tu sitio web, tu Instagram y el enlace de tu ficha de Google.',
      'Presence Thrive → "Analizar ahora": comprueba tu sitio y recalcula el puntaje (de 0 a 100) con el detalle de cada criterio.',
      'Cada canal tiene un estado: declarado (lo escribiste) o conectado (el sistema lo comprobó). Puedes comprobarlos uno por uno.',
      'Si no tienes sitio, el botón "Solicitar mi página" abre el formulario: cuentas qué necesitas y el equipo NEXUS lo diseña y lo publica.',
      'Tu sitio publicado aparece en el mismo panel, con vista previa.',
    ],
    notes: [
      {
        q: '¿NEXUS entra a mi Instagram?',
        a: 'Hoy comprueba que el canal responda, sin guardar contraseñas ni pedir permisos de la plataforma. La conexión oficial por API llega más adelante.',
      },
    ],
  },
  {
    slug: 'equipo-y-roles',
    title: 'Equipo, roles y permisos',
    summary: 'Cada quien entra solo a lo que su rol permite.',
    where: 'NEXUS → Ajustes → Equipo',
    steps: [
      'Ajustes → Equipo → Invitar: correo, nombre y rol.',
      'Administración: dinero, inventario y equipo. Recepción: cobros, caja, agenda, clientes y membresías. Asesor: clientes, agenda y WhatsApp, sin dinero.',
      'Los módulos se activan por negocio: si un módulo está apagado, nadie lo ve.',
      'En el panel de NEXUS, el equipo del negocio tiene su propio rol y sus permisos.',
    ],
  },
  {
    slug: 'presupuesto-obras',
    title: 'Presupuesto y control de obra',
    summary:
      'Para constructoras: catálogo APU, presupuesto, cotización al cliente, avance y reportes.',
    where: 'NEXUS → Obras',
    steps: [
      'Obras → Nueva: la obra es el contenedor de todo (presupuesto, cotizaciones, planificación y bitácora).',
      'Catálogo → Importar: sube tu libro de actividades y precios; el importador avisa qué cambió.',
      'Presupuesto: arma el proyecto con actividades de tu catálogo; al cotizar, la composición queda congelada.',
      'Avance: registra entradas en sitio con fotos y actas; los informesweekly muestran el avance real y el valor ganado.',
    ],
  },
];

export const HELP_FAQ = [
  {
    q: '¿Cada negocio tiene sus datos aislados?',
    a: 'Sí. Un negocio ve solo lo suyo: el panel de NEXUS (administración de la plataforma) es aparte y lo ve únicamente el equipo de NEXUS.',
  },
  {
    q: '¿Puedo empezar con pocos módulos?',
    a: 'Sí. Se activa lo que necesitas y se enciende lo demás cuando estés listo. El plan define qué está disponible.',
  },
  {
    q: '¿Los datos se pueden exportar?',
    a: 'Sí, el equipo de NEXUS puede exportar la información de tu negocio cuando lo pidas.',
  },
  {
    q: '¿NEXUS cobra por usar la plataforma?',
    a: 'Hoy hay un piloto interno: el acceso se coordina con el equipo de NEXUS, que te indica el alcance y el tiempo.',
  },
  {
    q: '¿Hay soporte?',
    a: 'Sí, por WhatsApp. Cada negocio tiene su propio canal y el equipo responde con contexto.',
  },
] as const;

export const HELP_SUPPORT = {
  title: '¿Te quedó una duda?',
  text: 'Escríbenos por WhatsApp con el nombre de tu negocio y qué estabas intentando hacer. Lo revisamos contigo.',
};
