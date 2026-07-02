# Paranormal Toolkit 0.28.3

Primeira extração de use cases para o card de uso de item.

## Mudanças

- Adiciona `RollTargetResistanceUseCase`.
- Adiciona `ApplyTargetDamageUseCase`.
- Adiciona `ApplyTargetEffectUseCase`.
- Multi-target passa a chamar use cases para resistência, dano e efeito.
- Use cases chamam os engines:
  - `ResistanceEngine`
  - `DamageEngine`
  - `ConditionEngine`
- Use cases validam novamente a política de resistência antes de aplicar dano/efeito.

## Observação

Esta versão ainda não separa renderer/ViewModel. O objetivo é reduzir acoplamento de execução no card antes de partir para UiState/renderer.
