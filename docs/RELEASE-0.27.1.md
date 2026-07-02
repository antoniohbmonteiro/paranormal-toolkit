# Paranormal Toolkit 0.27.1

Hotfix de typecheck da padronização de engines.

## Correções

- Remove chamada remanescente direta para `rollOrdemResistance` no card multi-target.
- Usa `ResistanceEngine.rollResistance` também no handler de resistência por alvo.
- Adiciona resolução tipada de ator por id para recuperar o item fonte da automação estruturada.
- Adiciona type guard `isItemLike`.
- Corrige acesso a `game.items` sem depender da tipagem global do Foundry neste projeto.
- Ajusta callbacks de busca de item para narrowing explícito de `unknown`.

## Observação

Não altera comportamento visual nem regras de dano/condição. É apenas correção de typecheck.
