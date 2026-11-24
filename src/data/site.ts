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
  { label: 'Soluciones', href: '/#sistema' },
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Nuestro trabajo', href: '/#trabajo' },
  { label: 'Nosotros', href: '/#nosotros' },
] as const;

/** Equipo fundador (datos del sitio anterior). Hoy no se muestra: queda para una sección «Nosotros» cuando se decida su contenido. */
export const FOUNDERS = [
  { name: 'Santiago Castellar', role: 'CEO', text: 'Dirige NEXUS y acompaña a cada negocio desde la primera conversación hasta la entrega.', initials: 'SC' },
  { name: 'Nicolas Florez', role: 'CFO', text: 'Presupuestos claros y pagos con comprobante, sin sorpresas.', initials: 'NF' },
] as const;
