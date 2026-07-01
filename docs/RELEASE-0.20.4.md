# Paranormal Toolkit 0.20.4

Hotfix técnico para fechar o baseline de `npm run check` depois da restauração do typecheck na linha 0.20.x.

## Corrigido

- Atualiza testes de `item-use-settings` para o contrato atual de settings:
  - modo padrão `ask`;
  - `systemCardMode`;
  - `ritualCastingCheckEnabled`;
  - `autoRun` mantido apenas como setting legado escondido.
- Torna a integração com Dice So Nice defensiva quando `game.modules` não existe no ambiente de teste.
- Mantém o comportamento em runtime: Dice So Nice só é usado quando o setting está ativo, o módulo está ativo e a API `game.dice3d.showForRoll` existe.

## Observação

Esta versão não altera regras, card de ritual, resistência, custo, dano, cura ou aplicação de efeitos.
