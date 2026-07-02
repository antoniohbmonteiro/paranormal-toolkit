# Paranormal Toolkit 0.28.4

Shared action state helpers para cards de uso de item.

## Mudanças

- Adiciona `item-use-card-action-state.ts`.
- Centraliza estado visual de ações de dano e efeito:
  - disponível;
  - aguardando resistência;
  - resistido;
  - aplicado;
  - indisponível.
- Single-target passa a usar o helper compartilhado no estado de dano e efeito.
- Multi-target passa a usar o helper compartilhado para labels/estado de dano e efeito.
- Não altera regras de negócio nem layout estrutural.

## Objetivo

Reduzir duplicação entre single-target e multi-target antes de extrair ViewModel/UiState formalmente.
