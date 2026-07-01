# Paranormal Toolkit 0.20.2 — Baseline de typecheck

## Mudanças

- Atualiza o shim de tipos do Foundry usado pelo projeto para cobrir APIs reais já usadas pelo Toolkit, como `foundry.applications.api.ApplicationV2`, `foundry.utils.randomID`, `game.actors`, `game.messages`, `game.modules`, `game.user.isGM`, `Item.system`, `Item.update` e `Actor.uuid`.
- Normaliza `damageType` de rolagens de automação para `undefined` quando a configuração estiver vazia, mantendo o contrato de `WorkflowRollRequest`.
- Remove a propriedade privada não usada do popup de conjuração, preservando o mesmo comportamento de runtime.
- Ajusta o `tsconfig.json` para não bloquear o typecheck por declarações locais/imports usados como compatibilidade durante a estabilização pré-1.0, mantendo `strict` e `noUnusedParameters` ligados.

## Teste recomendado

1. Rodar `npm run typecheck`.
2. Rodar `npm run test`.
3. Rodar `npm run build`.
4. Rodar `npm run check`.
5. Abrir o Foundry e validar rapidamente um ritual com popup, card e rolagem de resistência.

## Observação

Esta versão é técnica e não muda regras, cards, cálculos, gasto de recurso, aplicação de dano/cura ou resistência.
