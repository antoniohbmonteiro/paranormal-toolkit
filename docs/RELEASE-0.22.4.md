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

## Hotfix de resolver do efeito

- Corrige o caso em que a busca por actions filtrava apenas as seções com `pendingId` e deixava a action `Aplicar efeito` fora do resultado.
- A busca do efeito agora tenta primeiro o vínculo estrito por `pendingId` e, se não encontrar, faz fallback posicional no mesmo prompt, entre o roll card atual e o próximo roll card.
- `sectionContainsPromptId` agora considera o próprio elemento da action, não só descendentes.
- O card real de **Efeito** continua sendo a única UI final; a action legada é apenas fonte do botão/pendingId.

## Hotfix de ordenação da seção de Efeito

- Garante a ordem final `Conjuração → Dano → Efeito`.
- A seção real de **Efeito** agora é ancorada depois de **Dano** quando ele existe.
- Se **Dano** ainda não estiver disponível em uma passada de normalização, o fallback é inserir depois de **Conjuração**.
- Se nenhuma âncora existir, o efeito vai para o final do roll card, nunca para o topo.
