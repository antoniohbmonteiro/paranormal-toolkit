# Paranormal Toolkit 0.28.6

Extração inicial do ViewModel multi-target.

## Mudanças

- Adiciona `src/features/item-use/chat-card/multi-target/multi-target-card-view-model.ts`.
- Move tipos de ViewModel multi-target para o novo arquivo.
- Move a criação do `MultiTargetCardViewModel` para o novo arquivo.
- Move a leitura de alvos, dano, resistência e efeito visual para a camada de ViewModel.
- Mantém renderização DOM, listeners e handlers no `item-use-card-multi-target.ts`.
- Não altera layout, CSS ou regra de negócio.

## Objetivo

Reduzir o tamanho e a responsabilidade do renderer multi-target sem fazer um split de renderer ainda.
