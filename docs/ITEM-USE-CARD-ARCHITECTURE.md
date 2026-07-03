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

## Action state helpers

A partir da 0.28.4, estados visuais comuns de ação ficam em `item-use-card-action-state.ts`.

Esse helper não executa ação. Ele só responde como uma ação deve aparecer para o usuário:

- habilitada;
- aguardando resistência;
- resistida;
- aplicada;
- indisponível.

Single-target e multi-target devem consultar esse helper antes de decidir labels e estado disabled.

## UiState foundation

A partir da 0.28.5, estados compartilhados de resistência e tipos base de UiState ficam em:

- `item-use-card-resistance-state.ts`
- `item-use-card-ui-state.ts`

A intenção é que single-target e multi-target usem a mesma representação de resistência antes de criarem seus ViewModels específicos.

## Multi-target ViewModel

A partir da 0.28.6, a criação do ViewModel multi-target fica em:

- `chat-card/multi-target/multi-target-card-view-model.ts`

O arquivo de card ainda mantém DOM, listeners e refresh visual. A separação do renderer fica para uma versão posterior.

## Multi-target resolvers

A partir da 0.28.8, resolução de atores e item de origem do card multi-target fica em:

- `chat-card/multi-target/multi-target-target-resolver.ts`
- `chat-card/multi-target/multi-target-source-item-resolver.ts`

O card principal não deve conhecer detalhes de `canvas.tokens`, `game.actors`, `actor.items` ou `game.items` além de chamar esses resolvers.

## Multi-target damage feedback

A partir da 0.29.0, dano multi-target mantém a aplicação pelo adapter de Ordem (`actor.applyDamage`) e cria feedback privado de chat com `multi-target-damage-feedback-service.ts`.

O serviço usa as chaves de i18n do sistema e whisper para GMs/donos do alvo, evitando `ui.notifications.info` de sucesso.
