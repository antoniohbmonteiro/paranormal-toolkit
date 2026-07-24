import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lockPath = path.join(root, "package-lock.json");
const roadmapPath = path.join(root, "docs", "ROADMAP.md");

updatePackageLock(lockPath);
updateRoadmap(roadmapPath);

console.log(
  "Paranormal Toolkit 0.38.2 aplicado: package-lock.json e docs/ROADMAP.md atualizados.",
);

function updatePackageLock(filePath) {
  assertFileExists(filePath, "package-lock.json");

  const lock = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const rootPackage = lock.packages?.[""];

  if (!rootPackage) {
    throw new Error(
      'package-lock.json não contém packages[""]. Revise o arquivo antes de continuar.',
    );
  }

  const supportedVersions = new Set(["0.38.1", "0.38.2"]);
  if (
    !supportedVersions.has(lock.version) ||
    !supportedVersions.has(rootPackage.version)
  ) {
    throw new Error(
      "O package-lock.json não está na base 0.38.1 esperada nem já atualizado para 0.38.2. Revise o diff antes de continuar.",
    );
  }

  lock.version = "0.38.2";
  rootPackage.version = "0.38.2";
  fs.writeFileSync(filePath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
}

function updateRoadmap(filePath) {
  assertFileExists(filePath, "docs/ROADMAP.md");

  let roadmap = fs.readFileSync(filePath, "utf8");
  const versionPattern = /Versão atual documentada: `v0\.(?:38\.1|38\.2)`\./;
  const sectionTitle =
    "### Concluído em 0.38.2 — Compatibilidade de tipos do carregador de estilos";

  if (!versionPattern.test(roadmap)) {
    throw new Error(
      "docs/ROADMAP.md não contém a versão 0.38.1 esperada nem a versão 0.38.2. Revise o arquivo antes de continuar.",
    );
  }

  roadmap = roadmap.replace(
    versionPattern,
    "Versão atual documentada: `v0.38.2`.",
  );

  if (!roadmap.includes(sectionTitle)) {
    const anchor =
      "### Concluído em 0.38.1 — Polimento visual das fórmulas de habilidade";
    if (!roadmap.includes(anchor)) {
      throw new Error(
        "Não foi possível localizar o ponto de inserção da entrega 0.38.2 em docs/ROADMAP.md.",
      );
    }

    roadmap = roadmap.replace(anchor, `${releaseSection()}\n\n${anchor}`);
  }

  fs.writeFileSync(filePath, roadmap, "utf8");
}

function releaseSection() {
  return `### Concluído em 0.38.2 — Compatibilidade de tipos do carregador de estilos

Objetivo: corrigir a incompatibilidade entre o carregador de folhas de estilo da 0.38.1 e os contratos TypeScript locais do Foundry usados pelo projeto.

Entrega feita:

- acesso defensivo e tipado a \`foundry.utils.getRoute\`, preservando a rota oficial quando disponível em runtime;
- fallback seguro para a rota relativa do módulo quando a função não estiver exposta;
- leitura defensiva da versão instalada do módulo sem ampliar globalmente os tipos do Foundry;
- suporte opcional a \`manifest.version\` como fallback;
- nenhuma alteração no editor visual, nas flags ou no workflow de habilidades.`;
}

function assertFileExists(filePath, displayName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${displayName} não encontrado. Execute este script na raiz do Paranormal Toolkit.`,
    );
  }
}
