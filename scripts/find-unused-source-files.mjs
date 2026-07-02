#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const STRICT = process.argv.includes("--strict");

const ENTRY_FILES = [
  "src/main.ts",
  "src/toolkit-services.ts"
];

const IGNORE_PATTERNS = [
  /\.d\.ts$/u,
  /(^|\/)types(\/|$)/u
];

const IMPORT_PATTERNS = [
  /import\s+(?:type\s+)?(?:[^"'`]+?\s+from\s+)?["']([^"']+)["']/gu,
  /export\s+(?:type\s+)?(?:[^"'`]+?\s+from\s+)?["']([^"']+)["']/gu,
  /import\(["']([^"']+)["']\)/gu
];

if (!existsSync(SRC_DIR)) {
  console.error("src/ não encontrado. Rode este comando na raiz do projeto.");
  process.exit(1);
}

const sourceFiles = collectFiles(SRC_DIR)
  .filter((file) => file.endsWith(".ts"))
  .map(normalizePath)
  .filter((file) => !IGNORE_PATTERNS.some((pattern) => pattern.test(file)));

const sourceSet = new Set(sourceFiles);
const visited = new Set();
const queue = ENTRY_FILES
  .map((file) => normalizePath(path.join(ROOT, file)))
  .filter((file) => sourceSet.has(file));

for (const entry of queue) {
  visited.add(entry);
}

while (queue.length > 0) {
  const file = queue.shift();
  if (!file) continue;

  for (const specifier of readImportSpecifiers(file)) {
    if (!specifier.startsWith(".")) continue;

    const resolved = resolveLocalImport(file, specifier, sourceSet);
    if (!resolved || visited.has(resolved)) continue;

    visited.add(resolved);
    queue.push(resolved);
  }
}

const candidates = sourceFiles
  .filter((file) => !visited.has(file))
  .map((file) => path.relative(ROOT, file).replaceAll(path.sep, "/"))
  .sort();

if (candidates.length === 0) {
  console.log("Nenhum arquivo TypeScript órfão encontrado pela análise estática.");
  process.exit(0);
}

console.log("Possíveis arquivos TypeScript sem uso direto a partir dos entrypoints:");
for (const file of candidates) {
  console.log(`- ${file}`);
}

console.log("");
console.log("Observação: esta análise é conservadora e não entende imports dinâmicos montados por string, macros ou entrypoints externos.");
console.log("Confira manualmente antes de deletar.");

if (STRICT) {
  process.exit(1);
}

function collectFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) return collectFiles(fullPath);
    if (stat.isFile()) return [fullPath];
    return [];
  });
}

function readImportSpecifiers(file) {
  const source = readFileSync(file, "utf8");
  const specifiers = [];

  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier) specifiers.push(specifier);
    }
  }

  return specifiers;
}

function resolveLocalImport(fromFile, specifier, sourceSet) {
  const base = normalizePath(path.resolve(path.dirname(fromFile), specifier));
  const candidates = [
    base,
    `${base}.ts`,
    path.join(base, "index.ts")
  ].map(normalizePath);

  return candidates.find((candidate) => sourceSet.has(candidate)) ?? null;
}

function normalizePath(value) {
  return path.resolve(value);
}
