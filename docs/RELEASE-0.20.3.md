# Paranormal Toolkit 0.20.3

Correção técnica pequena para finalizar o baseline de `npm run check` depois da 0.20.2.

## Corrigido

- Ajusta a assinatura de `RitualCastApplication.close` para aceitar o mesmo tipo usado pelo shim de `ApplicationV2`.
- Remove `Actor.effects` do shim global para não conflitar com o tipo local `ActorWithEffects` do `ConditionEngine`.
- Mantém a leitura de efeitos tipada localmente em `condition-engine.ts`, onde o formato real necessário já é conhecido.

## Observação

Esta versão não altera comportamento de rituais, cards, resistência, dano, cura ou condições.
