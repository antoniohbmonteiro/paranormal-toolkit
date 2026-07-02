# Item-use card architecture

O fluxo de cards de uso de item deve caminhar para uma separação próxima de `View -> UiState -> UseCase -> Engine`.

## Camadas

- Renderer/View: cria DOM e liga eventos. Não deve chamar API do sistema Ordem diretamente.
- UiState/ViewModel: transforma estado persistido, configuração e dados do card em estado visual.
- UseCase: executa uma ação específica do card, valida política de negócio e persiste resultado.
- Engine: capacidade de domínio reutilizável, como `DamageEngine`, `ResistanceEngine`, `RitualCastingEngine` e `ConditionEngine`.
- Adapter: ponte com Foundry ou sistema Ordem, como `OrdemDamageAdapter`.

## Política de resistência

A configuração `itemUse.resistanceGateMode` controla se ações podem ser aplicadas antes da resistência:

- `strict`: dano e efeito ficam bloqueados até a resistência ser rolada.
- `open`: mestre pode aplicar dano normal e efeito manualmente antes da resistência.

Single-target e multi-target devem usar a mesma política. O visual pode variar, mas a regra precisa ser a mesma.

## Próximos passos

- Extrair use cases para resistência, dano e efeito.
- Criar UiState compartilhado para action buttons.
- Separar renderer de single-target e multi-target.

## Use cases

A partir da 0.28.3, ações específicas do card devem sair gradualmente dos arquivos de renderização:

- `RollTargetResistanceUseCase`
- `ApplyTargetDamageUseCase`
- `ApplyTargetEffectUseCase`

Os cards continuam responsáveis por DOM e refresh visual, mas devem delegar execução para use cases. Os use cases validam política de resistência e chamam engines.
