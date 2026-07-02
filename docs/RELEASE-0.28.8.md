# Paranormal Toolkit 0.28.8

Extração de resolvers do multi-target card.

## Mudanças

- Adiciona `multi-target-target-resolver.ts`.
- Adiciona `multi-target-source-item-resolver.ts`.
- Move a resolução de ator por nome de alvo para resolver dedicado.
- Move a resolução de item de origem para resolver dedicado.
- `item-use-card-multi-target.ts` fica mais focado em renderização, handlers, persistência e refresh.
- Não altera layout, CSS ou regra de negócio.

## Objetivo

Reduzir responsabilidades do arquivo principal antes do split de renderer multi-target.
