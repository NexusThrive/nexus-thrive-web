/** Convierte los marcadores [COMPLETAR: …] en una marca visible; el resto del texto se escapa. */
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const withTodos = (text: string) =>
	esc(text).replace(/\[COMPLETAR:[^\]]*\]/g, (m) => `<mark class="todo">${m}</mark>`);

/** Texto sin marcadores, para datos estructurados y meta. */
export const stripTodos = (text: string) => text.replace(/\s*\[COMPLETAR:[^\]]*\]/g, '').trim();
