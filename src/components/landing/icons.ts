/** Iconos de Lucide por tarjeta (los mismos que usa el dashboard de la app). */
import {
  MessagesSquare, Table2, Repeat, Unplug, ChartNoAxesCombined, AppWindow,
  ScanSearch, Palette, Workflow, Plug, Sparkles, CodeXml, ChartColumn, LifeBuoy,
  HeartHandshake, Ruler, ChartLine, Layers, Puzzle, ShieldCheck,
  Building2, Dumbbell, UtensilsCrossed, Stethoscope, Wrench, Megaphone, Store, Briefcase, Truck, Plane,
  CircleAlert, Lightbulb, TrendingUp,
} from '@lucide/astro';

export const PAIN_ICONS = [MessagesSquare, Table2, Repeat, Unplug, ChartNoAxesCombined, AppWindow];

export const SERVICE_ICONS: Record<string, typeof Sparkles> = {
  descubrimiento: ScanSearch,
  diseno: Palette,
  desarrollo: CodeXml,
  automatizacion: Workflow,
  integraciones: Plug,
  ia: Sparkles,
  dashboards: ChartColumn,
  soporte: LifeBuoy,
};

export const DIFF_ICONS = [HeartHandshake, Ruler, ChartLine, Layers, Puzzle, LifeBuoy, ShieldCheck];

export const USECASE_ICONS: Record<string, typeof Sparkles> = {
  inmobiliarias: Building2,
  gimnasios: Dumbbell,
  restaurantes: UtensilsCrossed,
  clinicas: Stethoscope,
  talleres: Wrench,
  agencias: Megaphone,
  comercios: Store,
  servicios: Briefcase,
  distribuidoras: Truck,
  turismo: Plane,
};

export const BLOCK_ICONS = { problem: CircleAlert, solution: Lightbulb, result: TrendingUp };
