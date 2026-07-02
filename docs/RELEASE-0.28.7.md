# Paranormal Toolkit 0.28.7

Hotfix de typecheck da extração do ViewModel multi-target.

## Correções

- Restaura constantes locais usadas pelo renderer para atributos de perícia de resistência.
- Reimporta helpers de `item-use-card-resistance-state.ts` usados pelo estado de resistência por alvo.
- Corrige `refreshTargetSection` para usar o wrapper `createMultiTargetCardViewModelFromLayout`, que injeta resultados persistidos/renderizados e resolver de condição.
- Não altera regra de negócio, layout ou CSS.
