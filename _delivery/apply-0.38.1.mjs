import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lockPath = path.join(root, "package-lock.json");
const roadmapPath = path.join(root, "docs", "ROADMAP.md");

updatePackageLock(lockPath);
updateRoadmap(roadmapPath);

console.log(
  "Paranormal Toolkit 0.38.1 aplicado: package-lock.json e docs/ROADMAP.md atualizados.",
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

  const supportedVersions = new Set(["0.38.0", "0.38.1"]);
  if (
    !supportedVersions.has(lock.version) ||
    !supportedVersions.has(rootPackage.version)
  ) {
    throw new Error(
      "O package-lock.json não está na base 0.38.0 esperada nem já atualizado para 0.38.1. Revise o diff antes de continuar.",
    );
  }

  lock.version = "0.38.1";
  rootPackage.version = "0.38.1";
  fs.writeFileSync(filePath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
}

function updateRoadmap(filePath) {
  assertFileExists(filePath, "docs/ROADMAP.md");

  let roadmap = fs.readFileSync(filePath, "utf8");
  const versionPattern = /Versão atual documentada: `v0\.(?:38\.0|38\.1)`\./;
  const sectionTitle =
    "### Concluído em 0.38.1 — Polimento visual das fórmulas de habilidade";

  if (!versionPattern.test(roadmap)) {
    throw new Error(
      "docs/ROADMAP.md não contém a versão 0.38.0 esperada nem a versão 0.38.1. Revise o arquivo antes de continuar.",
    );
  }

  roadmap = roadmap.replace(
    versionPattern,
    "Versão atual documentada: `v0.38.1`.",
  );

  if (!roadmap.includes(sectionTitle)) {
    const anchor =
      "### Concluído em 0.38.0 — Fórmulas de rolagem para habilidades";
    if (!roadmap.includes(anchor)) {
      throw new Error(
        "Não foi possível localizar o ponto de inserção da entrega 0.38.1 em docs/ROADMAP.md.",
      );
    }

    roadmap = roadmap.replace(anchor, `${releaseSection()}\n\n${anchor}`);
  }

  fs.writeFileSync(filePath, roadmap, "utf8");
}

function releaseSection() {
  return `### Concluído em 0.38.1 — Polimento visual das fórmulas de habilidade

Objetivo: corrigir o carregamento visual do editor de fórmulas de habilidade e alinhar sua apresentação ao padrão já usado pelo bloco de rituais.

Entrega feita:

- carregador reutilizável de folhas de estilo do módulo com rota compatível com prefixos do Foundry;
- o CSS do editor de habilidades passa a ser garantido em runtime, inclusive durante desenvolvimento sem reinício completo do Foundry;
- cabeçalho, badge, bordas, fundo e espaçamentos alinhados ao padrão visual do editor de rituais;
- cada rolagem agora possui card próprio, indicação de fórmula fixa ou progressão por NEX e seção de fórmula separada;
- campos de nome, tipo e dano usam layout responsivo e compacto;
- etapas de NEX foram reorganizadas em linhas legíveis com NEX mínimo, fórmula e ação de remoção;
- ações de adicionar, salvar e limpar foram agrupadas em um rodapé consistente;
- nenhuma flag, regra de resolução, gasto de recurso ou ação do chat foi alterada.`;
}

function assertFileExists(filePath, displayName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `${displayName} não encontrado. Execute este script na raiz do Paranormal Toolkit.`,
    );
  }
}
