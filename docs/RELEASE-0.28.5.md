# Paranormal Toolkit 0.28.5

Fundação inicial de UiState para cards de uso de item.

## Mudanças

- Adiciona `item-use-card-resistance-state.ts`.
- Adiciona `item-use-card-ui-state.ts`.
- Centraliza a leitura/conversão de resistência single-target para `ResistanceResolutionState`.
- Centraliza a conversão de resistência por alvo no multi-target.
- `item-use-card-damage-resolution.ts`, `item-use-card-effect-section.ts` e `item-use-card-multi-target.ts` passam a usar a fundação compartilhada.
- Não altera layout, CSS ou regra de negócio.

## Objetivo

Preparar a extração futura de ViewModel e Renderer sem mover DOM/renderização nesta versão.
