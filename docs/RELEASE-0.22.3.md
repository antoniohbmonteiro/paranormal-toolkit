# 0.22.3 — Efeito como seção real do card

## Objetivo

Remover o card visual legado de **Aplicar efeito** e transformar **Efeito** em uma seção real do card de ritual, irmã de **Conjuração** e **Dano**.

## Mudanças

- O efeito agora é montado como uma `workflow-section` própria dentro do roll card estruturado.
- A antiga seção visual de actions é consumida apenas como fonte do botão/pendingId e removida do DOM.
- O botão de efeito mantém o mesmo `pendingId`, handler e estado de automação.
- A seção nova possui estrutura própria:
  - header `Efeito`;
  - label do efeito;
  - container de ação;
  - botão de aplicar/resistir/aplicado.
- Mantém os estados:
  - `Role resistência`;
  - `✦ Aplicar`;
  - `✓ Resistiu`;
  - `✓ Aplicado`.
- O espaçamento entre **Conjuração**, **Dano** e **Efeito** passa a ser controlado pelo roll card estruturado, sem margem herdada do card legado.

## Fora de escopo

- Multi-target.
- Template Regions.
- Mudança de regra.
- Auto-aplicar dano ou efeito.
- Alterações no fluxo de Active Effects.
