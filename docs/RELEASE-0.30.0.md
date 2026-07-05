# Release 0.30.0 — Single-target card architecture cleanup

A versão `0.30.0` reorganiza a arquitetura do card single-target de uso de item/ritual sem mudar regra de jogo, layout visual ou textos públicos intencionais.

## Destaques

- Cria a pasta `src/features/item-use/chat-card/single-target/` para concentrar a arquitetura single-target.
- Centraliza helpers DOM/leitura em `single-target-card-dom.ts`.
- Centraliza decisões de dano e efeito single-target em `single-target-card-view-model.ts`.
- Move a orquestração de layout single-target para `single-target-card-enhancer.ts`.
- Move apenas o bind mínimo de refresh pós-resistência para `single-target-card-actions.ts`.
- Adiciona `single-target/index.ts` como barrel interno estável para os entrypoints single-target.
- Mantém `item-use-card-layout.ts` como entrypoint público de layout, chamando single-target e multi-target.
- Mantém `item-use-card-damage-resolution.ts` e `item-use-card-effect-section.ts` como facades/decorators DOM compatíveis.
- Preserva o comportamento GM/player definido na `0.29.1`.

## Correção incluída

- O card single-target de dano passa a manter somente uma ação principal visível depois da resolução.
- O botão alternativo marcado como `✓ Outra opção escolhida` é removido quando dano normal ou metade já foi aplicado.
- O comportamento manual atual permanece preservado quando não há resistência confiável.

## Sem mudanças intencionais

Esta release não altera intencionalmente:

- layout visual do card;
- CSS;
- textos visuais públicos, exceto evitar o estado alternativo `✓ Outra opção escolhida` no dano single-target;
- regra de dano;
- regra de efeito;
- regra de resistência;
- permissões GM/player;
- adapters Ordem;
- `ConditionEngine`, `DamageEngine` ou `ResistanceEngine`;
- automações novas;
- Template Regions;
- Paranormal FX.

## Arquitetura resultante

### Single-target

- `single-target-card-dom.ts`: leitura de seções, botões e escopo DOM do single-target.
- `single-target-card-view-model.ts`: estados públicos de dano/efeito, resistência, permissões e labels.
- `single-target-card-enhancer.ts`: orquestra reposicionamento de resistência, dano e efeito.
- `single-target-card-actions.ts`: bind mínimo de refresh depois de rolar/re-rolar resistência.
- `index.ts`: barrel interno dos entrypoints single-target.

### Facades preservadas

- `item-use-card-layout.ts` continua exportando `enhanceRitualCardLayout`.
- `item-use-card-damage-resolution.ts` continua exportando `enhanceDamageResolutionSection`.
- `item-use-card-effect-section.ts` continua exportando `findEffectActionSection`, `mountEffectActionSection` e `updateEffectActionResistanceGate`.

## Teste manual recomendado

### GM single-target

1. Usar ritual/item com dano e resistência.
2. Confirmar que a resistência fica dentro da seção de dano.
3. Rolar resistência pelo card e confirmar refresh visual.
4. Re-rolar resistência e confirmar que não duplica seções.
5. Com resistência falha, confirmar que só a ação de dano normal aparece antes da aplicação.
6. Com resistência bem-sucedida, confirmar que só a ação de metade aparece antes da aplicação.
7. Depois de aplicar dano, confirmar que só o estado aplicado do modo escolhido aparece.
8. Confirmar que `✓ Outra opção escolhida` não aparece no card.
9. Confirmar que efeito fica aplicável, pendente ou resistido conforme a resistência.
10. Confirmar que o whisper privado GM ainda mostra detalhes reais de dano.

### Player single-target

1. Abrir o card como jogador.
2. Confirmar que o jogador não controla rolagem/re-rolagem de resistência assistida.
3. Confirmar que o jogador não aplica dano.
4. Confirmar que o jogador não aplica efeito.
5. Confirmar que resultado público de resistência já rolado continua visível.
6. Confirmar que o card público não expõe RD, `finalDamage`, `blocked`, `totalFinalDamage` ou `totalBlocked`.

### Multi-target

1. Usar card com múltiplos alvos.
2. Confirmar que o layout multi-target não mudou visualmente.
3. Confirmar que rolagem de resistência, dano e efeito por alvo continuam funcionando.
4. Confirmar que o card público multi-target não expõe RD ou dano final pós-RD.

## Validação automática da release

- `npm run typecheck`
- `npm run build`
- `rg -n '<{7}|={7}|>{7}' .`
- `git diff --check`
