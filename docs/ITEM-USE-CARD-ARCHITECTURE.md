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

## Assisted actions compartilhadas

A partir da 0.29.1, as regras de ações assistidas passam a ficar em uma camada compartilhada em `src/features/item-use/assisted-actions/`.

Arquivos principais:

- `assisted-action-policy.ts`: concentra permissão GM-only, estado de resistência, modo de dano e modo de efeito.
- `assisted-action-view-model.ts`: cria o ViewModel de ação assistida por alvo consumido pelos renderers.
- `assisted-action-labels.ts`: cria labels públicos de dano sem RD e sem dano final pós-RD.
- `assisted-damage-feedback-service.ts`: cria o whisper privado de dano para GMs.

Decisões:

- Renderers single-target e multi-target continuam separados.
- Renderer não deve decidir a regra principal de permissão, resistência, dano normal/metade ou efeito resistido.
- Renderer deve consumir policy/ViewModel e transformar o estado em DOM.
- Controle de resolução é GM-only por enquanto:
  - aplicar dano;
  - aplicar efeito;
  - rolar/re-rolar resistência assistida do alvo.
- Jogadores podem ver o resultado público de resistência já rolado, mas não podem controlar a rolagem.
- RD, dano bloqueado e dano final pós-RD não entram no estado público do card.
- O feedback privado para GM é o local correto para detalhes reais de dano.
- O multi-target mantém `multi-target-damage-feedback-service.ts` como wrapper legado, mas ele deve delegar para o serviço compartilhado.

## Privacidade do estado público

O estado público do chat card deve evitar dados que revelem RD ou dano final real após RD.

Permitido no card público:

- dano pré-RD escolhido pela ação;
- resultado público da resistência;
- estado aplicado, resistido ou pendente.

Não permitido no estado público do card:

- `finalDamage`;
- `blocked`;
- `totalFinalDamage`;
- `totalBlocked`;
- texto público com RD.

Campos internos como `finalDamage` e `blocked` continuam válidos no `DamageApplicationResult`, em contexto de workflow interno e no whisper privado para GM.
