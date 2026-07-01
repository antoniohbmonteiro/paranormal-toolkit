# 0.22.4 — Corrige montagem tardia da seção de Efeito

## Objetivo

Corrigir o caso em que a antiga action visual `Aplicar efeito` ainda aparecia no chat porque a normalização do card podia rodar antes das actions estarem disponíveis no DOM.

## Mudanças

- Agenda passadas curtas de normalização do layout do card depois do render.
- Garante que a action antiga de efeito seja encontrada mesmo quando o vínculo por `pendingId` ainda não está disponível.
- Mantém o efeito como seção real do roll card estruturado.
- Mantém a paleta dourada, o botão compacto e os estados:
  - `Role resistência`;
  - `✦ Aplicar`;
  - `✓ Resistiu`;
  - `✓ Aplicado`.
- Não reintroduz o card legado como UI. A action antiga continua sendo apenas fonte do botão/pendingId e é removida quando consumida.

## Fora de escopo

- Multi-target.
- Template Regions.
- Mudanças de regra.
- Auto-aplicar dano ou efeito.
