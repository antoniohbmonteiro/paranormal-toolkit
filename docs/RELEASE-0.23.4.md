# Paranormal Toolkit 0.23.4

Hotfix de tipagem do card multi-target.

## Mudanças

- Corrige o `typecheck` em `item-use-card-multi-target.ts`.
- Garante que a seção informativa de efeito só é renderizada quando existe um `HTMLElement` válido.
- Tipagem explícita da lista de alvos como `MultiTargetViewModel[]`, preservando o estado literal `pending`.
- Não altera visual, comportamento ou CSS do multi-target.

## Validação sugerida

```bash
npm run typecheck
npm run build
```
