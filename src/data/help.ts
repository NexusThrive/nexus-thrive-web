/**
 * Contenido del centro de ayuda (/help y /help/<guía>).
 *
 * Regla: aquí solo va lo que la app hace de verdad hoy (repositorio
 * nexus-thrive, app.nexusthrive.com.co), con los nombres que se ven en
 * pantalla. Si una función no existe todavía, no se promete. Cada guía se
 * revisa contra el código cuando cambia el flujo (ver README, "Ayuda").
 *
 * Las capturas son de la app real con datos de demostración ("Gimnasio
 * Demo"), en src/assets/product/. Se renuevan cuando cambia la pantalla.
 */

export type HelpSection = {
	id: string;
	title: string;
	summary: string;
};

export type HelpArticle = {
	slug: string;
	section: HelpSection['id'];
	title: string;
	/** Para qué sirve, en una frase. */
	summary: string;
	/** Dónde se encuentra en la app (como se ve en el menú). */
	where: string;
	/** Qué hace falta antes de empezar. */
	prerequisites?: string[];
	/** Pasos numerados de la tarea. */
	steps: string[];
	/** Qué se ve cuando salió bien. */
	result?: string;
	/** Captura real (nombre en src/assets/product, sin -light/-dark). */
	shot?: { name: string; alt: string; caption: string };
	/** Errores frecuentes y cómo salir de ellos. */
	notes?: { q: string; a: string }[];
	/** Otras guías relacionadas (slug). */
	related?: string[];
};

export const HELP_INTRO = {
	eyebrow: 'Centro de ayuda',
	title: 'Cómo se usa NEXUS, paso a paso.',
	lead: 'Guías cortas de lo que hoy hace la plataforma, con los nombres que ves en pantalla. Si algo no coincide con tu app, escríbenos: la app cambia con cada versión.',
};

export const HELP_SECTIONS: HelpSection[] = [
	{ id: 'empezar', title: 'Empezar', summary: 'Cómo está organizada la app y qué hacer el primer día.' },
	{ id: 'operacion', title: 'Clientes y operación', summary: 'Fichas, membresías, agenda y control de acceso.' },
	{ id: 'dinero', title: 'Dinero', summary: 'Cobros, gastos, caja menor y cuentas de cobro.' },
	{ id: 'canales', title: 'Canales y presencia', summary: 'Cómo te encuentran y cómo te escriben.' },
	{ id: 'equipo', title: 'Equipo y configuración', summary: 'Quién entra, con qué rol y qué módulos están activos.' },
	{ id: 'rubros', title: 'Por rubro', summary: 'Pantallas propias de un tipo de negocio.' },
];

export const HELP_ARTICLES: HelpArticle[] = [
	{
		slug: 'como-esta-organizada',
		section: 'empezar',
		title: 'Cómo está organizada la app',
		summary: 'El menú, los nombres que cambian según tu rubro y dónde está cada cosa.',
		where: 'NEXUS → menú lateral (en el celular, la barra de abajo)',
		steps: [
			'Inicio: el resumen del negocio. Ingresos, gastos y balance, la actividad reciente y la tarjeta de Presencia digital.',
			'Debajo, los módulos que tu negocio tiene activos, con el vocabulario de tu rubro: en un gimnasio dice Socios y Clases; en otros negocios, Clientes y Reservas, Pacientes o Visitantes.',
			'Configuración, al final del menú: perfil del negocio, plan, módulos, equipo, apariencia y la zona de peligro.',
			'Buscar o ejecutar (arriba, o Ctrl K en el computador): salta a cualquier sección o acción sin pasar por el menú.',
			'En el celular, el botón central de la barra de abajo crea lo más común (un cliente, un cobro, una cita) según los módulos activos.',
		],
		result: 'Solo ves lo que tu negocio usa y lo que tu rol permite. Si un módulo está apagado, no aparece ni en el menú ni en la búsqueda.',
		shot: {
			name: 'inicio',
			alt: 'Inicio de NEXUS con el menú lateral, los indicadores del mes y la actividad reciente de un gimnasio de demostración.',
			caption: 'Inicio de un gimnasio de demostración.',
		},
		notes: [
			{
				q: 'No veo un módulo que sí tenemos contratado.',
				a: 'Configuración → Módulos: actívalo (lo puede hacer el dueño). Si no aparece en la lista, tu plan no lo incluye: escríbenos.',
			},
			{
				q: '¿Qué es el "panel de NEXUS"?',
				a: 'Es la administración de la plataforma y solo la usa el equipo de NEXUS (soporte, planes, facturación de la suscripción). Tu negocio no lo ve ni lo necesita.',
			},
		],
		related: ['primer-dia', 'equipo-y-roles'],
	},
	{
		slug: 'primer-dia',
		section: 'empezar',
		title: 'El primer día: dejar el negocio ordenado',
		summary: 'El orden recomendado para empezar con datos reales: perfil, clientes, catálogo, cobros y equipo.',
		where: 'NEXUS → Inicio',
		prerequisites: ['Haber terminado el alta del negocio (nombre, rubro y plan).'],
		steps: [
			'Configuración → Perfil del negocio: nombre comercial, dirección, NIT y WhatsApp. Con eso el negocio ya sale bien en recibos y cuentas de cobro.',
			'Clientes (o Socios, Pacientes… según tu rubro) → Nuevo: cada persona tiene su ficha con datos, pagos, membresías, notas y actividad.',
			'Catálogo: carga lo que vendes, con precio. Sin catálogo no hay venta directa ni control de existencias.',
			'Finanzas → Cobros: registra el primer cobro. Sale con recibo numerado y entra al dinero del día.',
			'Agenda (Clases, Reservas o Citas según tu rubro): abre el calendario y agenda.',
			'Configuración → Módulos: deja activos solo los que vas a usar. Se pueden cambiar cuando quieras.',
			'Configuración → Equipo → Invitar persona: el correo y el rol de quien trabaja contigo.',
		],
		result: 'El Inicio empieza a mostrar cifras reales y tu equipo puede entrar con su propio usuario.',
		related: ['como-esta-organizada', 'clientes', 'equipo-y-roles'],
	},
	{
		slug: 'clientes',
		section: 'operacion',
		title: 'Clientes: la ficha 360°',
		summary: 'Todo lo de una persona en una sola pantalla: datos, pagos, membresías, notas y actividad.',
		where: 'NEXUS → Clientes (Socios, Pacientes… según tu rubro)',
		steps: [
			'Clientes → Nuevo: nombre, documento, teléfono y correo. Con el documento y el teléfono se encuentra rápido.',
			'Los datos propios de tu rubro aparecen solos en el formulario según tu tipo de negocio.',
			'La foto se sube desde Editar, en la ficha. Se ve en la ficha y en el carné.',
			'En la ficha, las pestañas Resumen, Pagos, Membresías, Notas y Timeline 360° reúnen todo lo de esa persona.',
			'Desde la ficha: WhatsApp abre la conversación sin copiar el número y Registrar pago cobra sin salir de ahí.',
		],
		result: 'Cada pago, membresía y nota queda en la misma ficha, con fecha y quién la hizo.',
		shot: {
			name: 'ficha',
			alt: 'Ficha de una socia de demostración con su membresía activa, los días que le quedan y el resumen de sus pagos.',
			caption: 'Ficha 360° de una socia (datos de demostración).',
		},
		notes: [
			{
				q: 'Archivé a alguien por error.',
				a: 'En la lista, cambia el filtro a Archivados y restáuralo. Eliminar definitivamente solo se puede desde Archivados y pide confirmación.',
			},
		],
		related: ['membresias', 'pagos-y-caja'],
	},
	{
		slug: 'membresias',
		section: 'operacion',
		title: 'Membresías: quién está al día y quién venció',
		summary: 'Los estados se calculan solos cada día. Tú renuevas, congelas o cancelas con un motivo.',
		where: 'NEXUS → Membresías',
		prerequisites: ['El cliente ya existe en Clientes (o Socios).'],
		steps: [
			'Membresías → Nueva: eliges la persona, el plan, el precio y las fechas.',
			'El estado (activa, por vencer, vencida) se recalcula solo: no hay que marcar nada.',
			'Renovar extiende las fechas. Congelar corre el vencimiento los días que decidas y guarda el tiempo no usado. Cancelar pide un motivo y lo deja registrado.',
			'Quien vence pronto aparece con el aviso por WhatsApp listo para enviar.',
		],
		result: 'La lista muestra en cada fila el estado y los días que quedan; el control de acceso usa ese mismo estado.',
		shot: {
			name: 'membresias',
			alt: 'Lista de membresías de demostración con su estado y vencimiento.',
			caption: 'Membresías de un gimnasio de demostración.',
		},
		notes: [
			{
				q: '¿La persona entra si su membresía está congelada?',
				a: 'No. En el control de acceso se ve que está congelada y el tiempo que le queda guardado.',
			},
			{
				q: 'Cancelé una membresía por error.',
				a: 'La cancelación queda registrada con su motivo y no se deshace: crea una membresía nueva con las fechas correctas.',
			},
		],
		related: ['control-de-acceso', 'pagos-y-caja'],
	},
	{
		slug: 'control-de-acceso',
		section: 'operacion',
		title: 'Control de acceso con QR y NFC',
		summary: 'En la puerta se lee el QR o la tarjeta y se ve en grande si puede entrar y cuánto le queda.',
		where: 'NEXUS → Control de acceso (gimnasios)',
		prerequisites: ['El socio tiene una membresía.', 'Para NFC: una tarjeta y un teléfono Android con Chrome, o un lector USB.'],
		steps: [
			'Cada socio tiene un código personal: el QR de su carné. Se lee con la cámara de cualquier teléfono.',
			'Para usar una tarjeta NFC: en la ficha del socio, Acceso al gimnasio → Vincular. Se acerca la tarjeta al teléfono (Chrome en Android) o se escribe el número de serie.',
			'En la puerta: Control de acceso → escanea el QR, acerca la tarjeta o escribe el código, y Validar.',
		],
		result: 'Sale "Puede entrar" con el tiempo que le queda, o "No puede entrar" con el motivo. Cada intento queda registrado, y los códigos desconocidos se cuentan aparte.',
		shot: {
			name: 'acceso',
			alt: 'Pantalla de control de acceso: casilla para escanear, resultado "Puede entrar" y la lista de vencimientos.',
			caption: 'Control de acceso con un ingreso permitido.',
		},
		notes: [
			{
				q: 'En iPhone no me deja leer la tarjeta.',
				a: 'La web de iOS no lee NFC. Usa el QR del carné (cámara) o un lector USB, que funciona como teclado.',
			},
			{
				q: '¿Y si alguien copia el QR de otro?',
				a: 'El QR es personal. Si se pierde o se filtra, en la ficha del socio usa Nuevo: se pide confirmación y el QR anterior deja de servir.',
			},
		],
		related: ['membresias', 'clientes'],
	},
	{
		slug: 'agenda',
		section: 'operacion',
		title: 'Agenda: clases, reservas y citas',
		summary: 'Calendario por mes, semana o día, con responsables, cupos y recordatorio por WhatsApp.',
		where: 'NEXUS → Clases, Reservas o Citas (según tu rubro)',
		steps: [
			'Toca un día o una hora del calendario para agendar: cliente, servicio, hora y duración.',
			'Cambia entre Mes, Semana y Día. Los colores muestran qué días están llenos.',
			'Si el responsable ya tiene algo a esa hora, o el servicio no tiene cupo, la app lo avisa antes de guardar.',
			'En el detalle de la cita: Recordar por WhatsApp abre el mensaje listo para enviar.',
		],
		result: 'La cita aparece en el calendario de todo el equipo con su estado.',
		related: ['clientes'],
	},
	{
		slug: 'pagos-y-caja',
		section: 'dinero',
		title: 'Cobros, gastos y caja menor',
		summary: 'Cada cobro con recibo numerado; los gastos con soporte; la caja se abre, se cuenta y se cierra.',
		where: 'NEXUS → Finanzas',
		prerequisites: ['Tu rol maneja dinero (Dueño, Administración o Recepción).'],
		steps: [
			'Finanzas tiene cuatro pestañas: Resumen, Cobros, Gastos y Caja menor.',
			'Cobros: registra el pago (de un cliente, una membresía o una venta). Sale con recibo numerado para imprimir o enviar por WhatsApp.',
			'Gastos: registra la salida de dinero con su soporte; puedes escanear el comprobante.',
			'Caja menor: ábrela al empezar el turno, registra entradas y salidas, y al cerrar haz el arqueo (lo que cuentas contra lo esperado).',
			'Anular un cobro pide un motivo y no borra el historial: el dinero sigue auditado.',
		],
		result: 'El Resumen y el Inicio muestran ingresos, gastos y balance del periodo con cifras de verdad.',
		shot: {
			name: 'finanzas',
			alt: 'Finanzas de un gimnasio de demostración con ingresos, gastos y balance.',
			caption: 'Resumen de Finanzas (datos de demostración).',
		},
		notes: [
			{
				q: 'Registré un cobro dos veces.',
				a: 'Anula el repetido desde su detalle, con el motivo. El sistema evita duplicar un mismo cobro por error de conexión, pero no dos registros hechos a mano.',
			},
			{
				q: 'El arqueo no cuadra.',
				a: 'La diferencia queda registrada en el cierre. Revisa los movimientos de la sesión de caja antes de cerrar.',
			},
		],
		related: ['cuentas-de-cobro'],
	},
	{
		slug: 'cuentas-de-cobro',
		section: 'dinero',
		title: 'Cuentas de cobro y recibos',
		summary: 'Documentos numerados para quien necesita un soporte de lo que te debe o de lo que pagó.',
		where: 'NEXUS → Facturación',
		steps: [
			'Facturación → nueva cuenta de cobro: cliente, conceptos y valores.',
			'Imprímela o compártela. Queda numerada.',
			'Cuando te paguen, márcala como pagada: se registra el cobro con su recibo en Finanzas.',
		],
		result: 'La cuenta queda como pagada y el dinero aparece en Finanzas.',
		notes: [
			{
				q: '¿Es factura electrónica de la DIAN?',
				a: 'No. Hoy NEXUS emite cuentas de cobro y recibos. La factura electrónica está en camino, a través de un proveedor autorizado.',
			},
		],
		related: ['pagos-y-caja'],
	},
	{
		slug: 'presencia',
		section: 'canales',
		title: 'Presencia digital: tu puntaje y tus canales',
		summary: 'Qué tan fácil te encuentran en internet, criterio por criterio.',
		where: 'NEXUS → Inicio → tarjeta Presencia digital',
		steps: [
			'En el Inicio, la tarjeta Presencia digital lleva a Presence Thrive.',
			'Ahí ves tu puntaje (de 0 a 100) con el detalle de cada criterio, y tus canales: Sitio web, Instagram, Ficha de Google y WhatsApp, cada uno con su estado.',
			'Analizar ahora vuelve a revisar tu sitio y recalcula el puntaje.',
			'Si no tienes sitio, Solicitar mi página abre el formulario: cuentas qué necesitas y el equipo NEXUS lo diseña y lo publica.',
		],
		result: 'Tu sitio publicado aparece en el mismo panel, con vista previa.',
		notes: [
			{
				q: 'Mi Instagram o mi ficha de Google salen "Sin conectar".',
				a: 'Hoy esos enlaces los registra el equipo de NEXUS. Escríbenos por WhatsApp con el enlace y lo agregamos.',
			},
			{
				q: '¿NEXUS entra a mi Instagram?',
				a: 'No. No guarda contraseñas ni pide permisos de la plataforma; solo muestra el enlace.',
			},
		],
	},
	{
		slug: 'equipo-y-roles',
		section: 'equipo',
		title: 'Equipo, roles y permisos',
		summary: 'Cada persona entra con su usuario y solo a lo que su rol permite.',
		where: 'NEXUS → Configuración → Equipo',
		prerequisites: ['Ser el dueño o tener el rol Administración.'],
		steps: [
			'Configuración → Equipo → Invitar persona: correo, nombre y rol.',
			'Dueño: todo, incluido el plan y el equipo. Administración: dinero, inventario, equipo y reportes. Recepción: cobros, caja, agenda, clientes y membresías. Asesor: clientes, agenda y WhatsApp, sin dinero.',
			'Avísale que entre a NEXUS con ese mismo correo: al entrar queda en tu equipo con el rol que elegiste.',
			'Los módulos se activan por negocio en Configuración → Módulos: si uno está apagado, nadie lo ve.',
		],
		result: 'La persona aparece en el equipo con su rol; los botones que su rol no permite no le aparecen.',
		notes: [
			{
				q: 'Entró y no ve el negocio.',
				a: 'Tiene que entrar con el mismo correo que invitaste. Revisa que esté bien escrito en Configuración → Equipo; si sigue sin verlo, escríbenos.',
			},
		],
		related: ['como-esta-organizada'],
	},
	{
		slug: 'presupuesto-obras',
		section: 'rubros',
		title: 'Construcción: presupuesto y control de obra',
		summary: 'Catálogo APU, presupuesto, cotización al cliente, avance y reportes.',
		where: 'NEXUS → Obras (constructoras)',
		steps: [
			'Obras → Nueva obra: la obra es el contenedor de todo (presupuesto, cotizaciones, planificación y bitácora).',
			'Catálogo APU → Importar: sube tu libro de actividades y precios; el importador avisa qué cambió.',
			'Presupuesto: arma la obra con actividades de tu catálogo; al cotizar, la composición queda congelada.',
			'Avance: registra lo hecho en sitio con fotos y actas; los informes semanales muestran el avance real y el valor ganado.',
		],
		notes: [
			{
				q: 'Quiero pasar a "En ejecución" y la app me pregunta por la línea base.',
				a: 'Sin línea base aprobada la obra puede avanzar, pero queda sin cifras congeladas para comparar. Aprueba la línea base en Presupuesto si quieres medir contra ella.',
			},
		],
	},
];

export const HELP_FAQ = [
	{
		q: '¿Cada negocio tiene sus datos aislados?',
		a: 'Sí. Un negocio ve solo lo suyo. El panel de NEXUS (administración de la plataforma) es aparte y lo ve únicamente el equipo de NEXUS.',
	},
	{
		q: '¿Puedo empezar con pocos módulos?',
		a: 'Sí. Activas lo que necesitas y enciendes lo demás cuando estés listo. El plan define qué está disponible.',
	},
	{
		q: '¿Los datos se pueden exportar?',
		a: 'Sí, el equipo de NEXUS puede exportar la información de tu negocio cuando lo pidas.',
	},
	{
		q: '¿NEXUS cobra por usar la plataforma?',
		a: 'Hoy el acceso se coordina con el equipo de NEXUS, que te indica el alcance, el precio y el tiempo.',
	},
	{
		q: '¿Hay soporte?',
		a: 'Sí, por WhatsApp. El equipo responde con el contexto de tu negocio.',
	},
] as const;

export const HELP_SUPPORT = {
	title: '¿Te quedó una duda?',
	text: 'Escríbenos por WhatsApp con el nombre de tu negocio y qué estabas intentando hacer. Lo revisamos contigo.',
};

export const articleBySlug = (slug: string) => HELP_ARTICLES.find((a) => a.slug === slug);
export const articlesIn = (section: HelpSection['id']) => HELP_ARTICLES.filter((a) => a.section === section);
