// Verifica que los primitivos de marca (--nx-*) de la landing coincidan con
// la fuente oficial: packages/brand/css/tokens.css del repositorio de la app.
//
// Uso: pnpm check:brand [ruta-al-tokens.css-de-la-marca]
// Por defecto busca el repo de la app como carpeta hermana (../nexus-thrive).

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const brandPath = resolve(
  process.argv[2] ?? resolve(root, "../nexus-thrive/packages/brand/css/tokens.css"),
);
const landingPath = resolve(root, "src/styles/tokens.css");

if (!existsSync(brandPath)) {
  console.error(`No se encontró la marca en ${brandPath}. Pasa la ruta como argumento.`);
  process.exit(2);
}

/** Primitivos --nx-* del primer bloque :root (modo claro). */
function primitives(path) {
  const firstRoot = readFileSync(path, "utf8").split("}")[0];
  const tokens = new Map();
  for (const [, name, value] of firstRoot.matchAll(/(--nx-[\w-]+):\s*([^;]+);/g)) {
    tokens.set(name, value.trim().toLowerCase());
  }
  return tokens;
}

const brand = primitives(brandPath);
const landing = primitives(landingPath);
const problems = [];

for (const [name, value] of landing) {
  if (!brand.has(name)) problems.push(`${name}: no existe en la marca`);
  else if (brand.get(name) !== value) problems.push(`${name}: marca ${brand.get(name)} · landing ${value}`);
}

if (problems.length > 0) {
  console.error(`Tokens de la landing desalineados con la marca (${problems.length}):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

// La página 404 es la misma en la app y en la landing: el CSS se copia tal cual.
const notFoundBrand = resolve(brandPath, "../not-found.css");
const notFoundLanding = resolve(root, "src/styles/not-found.css");
if (existsSync(notFoundBrand) && readFileSync(notFoundBrand, "utf8") !== readFileSync(notFoundLanding, "utf8")) {
  console.error(`La 404 se separó de la marca. Copia ${notFoundBrand} en src/styles/not-found.css.`);
  process.exit(1);
}

console.log(`Marca alineada: ${landing.size} primitivos --nx-* coinciden con ${brandPath}; la 404 es idéntica.`);
