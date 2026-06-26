# Paranormal Toolkit — Roadmap

Roadmap da suíte de módulos companion para o sistema não-oficial `ordemparanormal` no Foundry VTT.

O objetivo do projeto não é substituir o sistema base. O Toolkit deve atuar como uma camada opcional de automação, qualidade de vida e workflows em cima dos documentos do sistema.

A direção arquitetural atual é construir um **mini Midi-QOL para Ordem** e, depois, uma camada de presets no estilo **Chris Premades**, mas adequada ao ecossistema do sistema `ordemparanormal`.

## Visão de longo prazo

```txt
Sistema Ordem
- documentos
- ficha
- rolagens base
- dados oficiais já existentes na mesa/sistema

Paranormal Toolkit
- ResourceEngine
- WorkflowEngine
- AutomationRunner
- custo, rolagem, dano, cura, resistência e efeitos
- integração com uso normal de item/ritual

Paranormal Presets
- presets de automação aplicáveis em itens existentes
- match inicial por tipo/nome normalizado quando fizer sentido
- persistência por flags do Toolkit

Paranormal FX
- animações e sons em cima dos eventos de workflow
```

## Princípios

- Foundry VTT v14-first.
- TypeScript, Vite e ES Modules.
- Automação opt-in: mestres podem usar ou ignorar.
- Integração desacoplada com o sistema `ordemparanormal`.
- Paths internos do sistema devem ficar isolados em adapters.
- Evitar depender de HTML/templates internos da ficha.
- Preferir APIs públicas do Foundry.
- Usar flags próprias do módulo para dados próprios.
- Não empacotar assets de terceiros; módulos visuais devem referenciar assets instalados pelo usuário.
- Não distribuir textos oficiais, artes oficiais ou compêndios protegidos dentro do Toolkit público.
- Automatizar conteúdo oficial existente na mesa pode ser suportado por presets/matchers, desde que o módulo público não redistribua descrições, textos completos ou assets protegidos.
- Nome de item pode ser usado como matcher inicial de preset, mas a execução real deve depender de flags/metadados aplicados ao item.

## Módulos planejados

### Paranormal Toolkit

Módulo principal de automações e qualidade de vida.

Responsável por:

- recursos de ator: PV, SAN, PE e PD;
- gasto automático de recursos;
- lifecycle de uso de item, arma, habilidade e ritual;
- workflows de custo, rolagem, resistência, dano, cura e efeitos;
- chat cards enriquecidos;
- automações configuráveis por flags;
- presets aplicáveis em itens existentes;
- modificações/melhorias de armas;
- cálculo e validação de categoria de arma;
- integração futura com Active Effects, Template Regions e Paranormal FX.

### Paranormal FX

Módulo visual separado para animações, efeitos e sons.

Direção inicial:

- requer Sequencer;
- requer JB2A gratuito na primeira versão;
- não empacota assets de terceiros;
- escuta eventos/hooks do Toolkit ou do sistema;
- fornece presets visuais configuráveis.

### Paranormal Sheets

Módulo de ficha/UX alternativa.

Status atual: baixa prioridade.

O sistema base deve receber melhorias de ficha/UX diretamente. Se esse módulo existir no futuro, deve ser tratado como alternativa visual opcional, não substituição da ficha principal.

## Lifecycle alvo do WorkflowEngine

A inspiração é o ciclo de vida de rolagem de módulos como Midi-QOL: um fluxo previsível, com fases bem definidas, que outros recursos do Toolkit e do FX possam observar.

Paralelo mental com Android: o workflow precisa de fases tipo `onCreate`, `onResolveTargets`, `onRoll`, `onApply`, `onComplete`.

```ts
export type WorkflowPhase =
  | "created"
  | "beforeItemUse"
  | "resolveTargets"
  | "beforeCost"
  | "spendCost"
  | "afterCost"
  | "beforeRoll"
  | "beforeDamageRoll"
  | "beforeHealingRoll"
  | "roll"
  | "damageRoll"
  | "healingRoll"
  | "afterDamageRoll"
  | "afterHealingRoll"
  | "afterRoll"
  | "beforeDamageResolution"
  | "damageResolution"
  | "afterDamageResolution"
  | "beforeApply"
  | "beforeApplyDamage"
  | "beforeApplyHealing"
  | "apply"
  | "applyDamage"
  | "applyHealing"
  | "afterApplyDamage"
  | "afterApplyHealing"
  | "afterApply"
  | "beforeChat"
  | "chat"
  | "completed"
  | "failed";
```

Fluxo alvo:

```txt
item/ritual/arma usado
↓
WorkflowEngine cria contexto
↓
resolve origem e alvos
↓
executa custo
↓
executa rolagens
↓
resolve resistência quando houver
↓
aplica dano/cura/efeitos
↓
emite hooks/eventos
↓
cria ou enriquece chat card
```

Eventos futuros desejados:

```ts
Hooks.callAll("paranormal-toolkit.workflow.beforeItemUse", context);
Hooks.callAll("paranormal-toolkit.workflow.afterRoll", context);
Hooks.callAll("paranormal-toolkit.workflow.afterApply", context);
Hooks.callAll("paranormal-toolkit.workflow.completed", context);
```

Esses eventos serão a base para:

- presets avançados;
- integração com Paranormal FX;
- integrações futuras com Active Effects e Template Regions;
- customizações de mesa.


## v0.6.2 — Workflow Debug Snapshot

Status: fechado.

Objetivo: separar o contexto interno rico do workflow da saída de debug usada no console/chat/API.

Escopo entregue:

- `WorkflowDebugSnapshot`;
- serializer centralizado para workflow;
- serializer centralizado para transações de recurso;
- `ParanormalToolkit.debug.workflow.lastContext()` retornando snapshot enxuto;
- logs de sucesso de automação usando snapshot em vez de documentos completos;
- flags de resumo de workflow no chat usando snapshot.

Decisão arquitetural:

- o `WorkflowContext` interno pode carregar documentos reais do Foundry;
- debug/output público deve expor somente dados serializados e pequenos.

## v0.6.1 — Typed Workflow Events

Status: fechado.

Objetivo: enriquecer o lifecycle com intenção de rolagem e eventos especializados para dano/cura, sem ainda automatizar resistência.

Escopo entregue:

- `WorkflowRollIntent`;
- `WorkflowRollRequest`;
- `WorkflowRollResult`;
- `damageInstances`;
- `healingInstances`;
- fases especializadas de dano/cura;
- estrutura inicial para futura resolução de resistência/vulnerabilidade/redução;
- debug `ParanormalToolkit.debug.workflow.lastContext()`.

Fora de escopo:

- aplicar resistência automaticamente;
- ler resistência do sistema;
- botão de aplicar dano;
- interceptar clique normal da ficha.

## v0.6.0 — Workflow Lifecycle Foundation

Status: fechado.

Objetivo: criar a primeira fundação do mini Midi-QOL do Toolkit, com lifecycle rastreável para uso/rolagem de item.

Escopo entregue:

- `core/workflow/` como nova fronteira interna;
- `WorkflowEngine` como orquestrador de execução;
- `WorkflowHookEmitter` para emitir hooks públicos por fase;
- `WorkflowContext` com `id`, `phases`, `lifecycleEvents`, origem, item, alvos, rolagens, custos e transações;
- fases iniciais:
  - `created`;
  - `beforeItemUse`;
  - `resolveTargets`;
  - `beforeCost`;
  - `spendCost`;
  - `afterCost`;
  - `beforeRoll`;
  - `roll`;
  - `afterRoll`;
  - `beforeApply`;
  - `apply`;
  - `afterApply`;
  - `beforeChat`;
  - `chat`;
  - `completed`;
  - `failed`.
- hooks por fase no formato `paranormal-toolkit.workflow.<phase>`;
- hook genérico `paranormal-toolkit.workflow.phase`;
- helpers de debug de ritual/workflow agora rodam por `WorkflowEngine`;
- chat card de debug mostra fases executadas quando debug/chat está ligado;
- remoção do fallback deprecated `renderChatMessage`; mantido apenas `renderChatMessageHTML` para Foundry v14-first.

Fora de escopo:

- interceptar clique normal da ficha;
- UI/Medkit;
- Preset Registry;
- resistência;
- templates/área;
- Active Effects;
- split físico em múltiplos módulos.

## v0.5.2 — Debug Output Settings

Status: fechado.

Objetivo: limpar a casa antes do `WorkflowEngine`, centralizando saídas de debug/teste e evitando cards de diagnóstico espalhados pelo chat.

Escopo:

- settings de debug/output no Foundry;
- `DebugOutputService`;
- canais configuráveis: console, notificação e chat;
- chat de debug desligado por padrão;
- chat de debug como whisper para GMs;
- API `ParanormalToolkit.debug.output.*`;
- cards de debug/teste de recurso e workflow controlados por settings.

## v0.1 — Fundação do Toolkit

Status: fechado.

Objetivo: provar que o módulo carrega, reconhece o sistema, lê dados reais de ator e executa a primeira automação simples.

Escopo:

- scaffold Foundry v14+;
- TypeScript + Vite;
- `module.json` compatível com Foundry v14;
- guard para `game.system.id === "ordemparanormal"`;
- `OrdemAdapter` inicial;
- leitura de PV, SAN, PE, PD e DT de ritual;
- `ActorResolver` para token selecionado;
- API global de debug;
- `ParanormalToolkit.debug.actor.logResources()`;
- `ParanormalToolkit.debug.actor.spendPE(amount)`;
- validação de PE insuficiente;
- `Result` type para falhas esperadas;
- chat card simples ao gastar PE.

Critérios de aceite:

- módulo aparece no Foundry;
- módulo inicializa apenas no sistema `ordemparanormal`;
- token selecionado é encontrado;
- recursos do ator aparecem no console;
- PE diminui quando há PE suficiente;
- PE não fica negativo;
- PE insuficiente vira aviso controlado;
- gasto de PE gera chat card;
- build passa.

## v0.2 — Resource Engine + Chat Enrichment

Status: fechado.

Objetivo: transformar o gasto de PE em uma camada genérica de recursos e começar a enriquecer os chat cards existentes do sistema.

Escopo:

- `ResourceEngine` genérico;
- operações de recurso:
  - gastar PE;
  - gastar PD;
  - causar dano em PV;
  - curar PV;
  - causar dano em SAN;
  - recuperar SAN;
- validação de mínimo/máximo;
- transações rastreáveis de recurso;
- chat cards genéricos para gasto, dano, cura e falhas;
- captura de targets no momento da criação do chat;
- flags de workflow em `ChatMessage`;
- bloco visual do Toolkit abaixo do card original do sistema.

Critérios de aceite:

```js
await ParanormalToolkit.debug.actor.spendPE(1);
await ParanormalToolkit.debug.actor.spendPD(1);
await ParanormalToolkit.debug.actor.damagePV(3);
await ParanormalToolkit.debug.actor.healPV(3);
await ParanormalToolkit.debug.actor.damageSAN(2);
await ParanormalToolkit.debug.actor.recoverSAN(2);
```

E também:

- ao rolar uma mensagem com target marcado, o chat mostra o alvo em um bloco do Toolkit;
- o card original do sistema continua intacto;
- targets ficam salvos em flags da mensagem;
- não há dependência de parsing frágil do HTML do sistema.

## v0.3 — Automation Runner inicial

Status: fechado.

Objetivo: executar automações simples declaradas por flags em itens.

Escopo:

- `AutomationRunner` mínimo;
- definição de automação versionada;
- steps iniciais:
  - `spendResource`;
  - `rollFormula`;
  - `modifyResource`;
  - `chatCard`;
- execução sequencial de steps;
- parada segura em caso de falha obrigatória;
- debug API para rodar automação por UUID ou primeiro item com flag;
- helper de debug para aplicar uma automação de cura simples no primeiro item do ator selecionado.

Primeira automação alvo:

```txt
Gastar PE + rolar fórmula + curar PV do alvo
```

Exemplo conceitual:

```ts
item.flags["paranormal-toolkit"].automation = {
  version: 1,
  steps: [
    { type: "spendResource", actor: "self", resource: "PE", amount: 1 },
    { type: "rollFormula", id: "healing", formula: "1d8" },
    {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amountFrom: "healing.total"
    }
  ]
};
```

## v0.4 — Ritual Cost Foundation

Status: fechado.

Objetivo: criar a base de custo de rituais antes de automatizar efeitos reais.

Escopo:

- `RitualCostProvider`;
- `OrdemRitualAdapter`;
- leitura do círculo em `system.circle`;
- custo padrão por círculo: 1, 3, 6 e 10 PE;
- override por flag em `flags.paranormal-toolkit.ritual.cost`;
- step `spendRitualCost` no `AutomationRunner`;
- registro do custo no `WorkflowContext`;
- chat card mostrando custo calculado e gasto aplicado.

Critérios de aceite:

```js
ParanormalToolkit.debug.ritual.logFirstRitualCost();
await ParanormalToolkit.debug.ritual.setCustomCostOnFirstRitual(2, "PE");
await ParanormalToolkit.debug.ritual.clearCustomCostOnFirstRitual();
await ParanormalToolkit.debug.ritual.setTestCostAutomationOnFirstRitual();
await ParanormalToolkit.debug.workflow.runFirstAutomation();
```

## v0.5 — Basic Ritual Automations

Status: fechado.

Objetivo: criar automações genéricas de ritual básico e provar que custo + rolagem + aplicação em alvo funcionam.

Escopo:

- automação genérica de cura simples;
- automação genérica de dano simples;
- ambas usando `spendRitualCost`;
- fórmula customizável nos helpers de debug;
- alvo via targets do Foundry;
- chat card rico;
- nenhum compêndio oficial empacotado.

Exemplos alvo:

```txt
Ritual de cura simples:
- gasta custo do ritual
- rola 1d8
- cura PV do alvo

Ritual de dano simples:
- gasta custo do ritual
- rola 1d8
- causa dano em PV do alvo
```

Critérios de aceite:

```js
await ParanormalToolkit.debug.ritual.setTestHealingAutomationOnFirstRitual();
await ParanormalToolkit.debug.ritual.runFirstRitualAutomation();

await ParanormalToolkit.debug.ritual.setTestDamageAutomationOnFirstRitual();
await ParanormalToolkit.debug.ritual.runFirstRitualAutomation();
```

## v0.6 — Workflow Engine Foundation

Objetivo: transformar o `AutomationRunner` em parte de um ciclo de vida de uso de item/ritual, criando a base do nosso mini Midi-QOL.

Escopo planejado:

- criar `WorkflowEngine` como orquestrador;
- mover o conceito de contexto para `core/workflow/`;
- separar `WorkflowContext`, `WorkflowTarget`, `WorkflowResult`, `WorkflowPass` e `WorkflowEvent`;
- criar IDs rastreáveis para cada workflow;
- criar eventos/hooks próprios do Toolkit;
- manter o `AutomationRunner` como executor de steps dentro do workflow;
- preparar `runItemWorkflow(item)` como API de alto nível;
- evitar duplicação de execução;
- documentar o lifecycle oficial do Toolkit.

Critérios de aceite:

```js
await ParanormalToolkit.debug.workflow.runFirstItemWorkflow();
await ParanormalToolkit.debug.ritual.runFirstRitualWorkflow();
```

E também:

- o workflow sabe origem, item e targets;
- o workflow tem ID próprio;
- hooks são emitidos nas fases principais;
- automações existentes de ritual continuam funcionando;
- chat card continua mostrando custo, rolagens e transações.

## v0.7 — Automation Registry + Preset Binder

Objetivo: criar a base do mini Chris Premades: registro de presets, matcher e aplicação de automação em itens existentes.

Escopo planejado:

- `AutomationRegistry`;
- `AutomationPreset` versionado;
- `AutomationMatcher` por tipo de item e nome normalizado;
- `AutomationBinder` para aplicar preset em flags do item;
- detectar presets compatíveis com itens existentes;
- debug API para listar presets;
- debug API para aplicar o melhor preset no primeiro ritual compatível;
- preservar `presetId`, `presetVersion` e `appliedAt` nas flags.

Princípio importante:

```txt
O nome do item pode ajudar a encontrar o preset.
Depois que o preset é aplicado, a execução depende da flag, não do nome.
```

Exemplo conceitual:

```ts
{
  id: "ritual.simple-healing",
  version: "1.0.0",
  category: "ritual",
  matcher: {
    itemType: "ritual",
    normalizedNames: ["cicatrizacao"]
  },
  automation: {
    version: 1,
    steps: [
      { type: "spendRitualCost" },
      { type: "rollFormula", id: "healing", formula: "1d8" },
      {
        type: "modifyResource",
        actor: "target",
        resource: "PV",
        operation: "heal",
        amountFrom: "healing.total"
      },
      { type: "chatCard", title: "Ritual" }
    ]
  }
}
```

## v0.8 — Item Use Integration

Objetivo: aproximar o Toolkit do comportamento esperado pelo jogador: usar o item/ritual normalmente e a automação rodar no fluxo natural.

Escopo planejado:

- investigar pontos de integração do sistema `ordemparanormal`;
- detectar uso normal de item/ritual sem depender de botão de debug;
- se o item tiver flag de automação, rodar `WorkflowEngine`;
- manter ou enriquecer o chat card normal do sistema quando possível;
- evitar parsing frágil de HTML;
- se faltar hook estável no sistema, preparar proposta/PR para o sistema base.

Hooks desejáveis no sistema:

```ts
Hooks.callAll("ordemparanormal.itemUse", workflow);
Hooks.callAll("ordemparanormal.ritualUse", workflow);
Hooks.callAll("ordemparanormal.weaponAttack", workflow);
Hooks.callAll("ordemparanormal.damageRoll", workflow);
```

## v0.9 — Ritual Preset Pack inicial

Objetivo: começar automações reais de rituais por preset, incluindo nomes oficiais existentes na mesa/sistema quando o usuário optar por isso.

Escopo planejado:

- presets iniciais de cura;
- presets iniciais de dano;
- custo por círculo integrado;
- target simples;
- resistência simples quando aplicável;
- chat card com resumo do efeito;
- sem copiar descrições oficiais no repo público.

Observação:

- Se o sistema já fornece o item e a mesa possui o conteúdo, o Toolkit pode aplicar automação por preset.
- O Toolkit público deve evitar distribuir texto completo ou compêndio protegido.

## v0.10 — Weapon Workflow + Modifications Foundation

Objetivo: criar uma base genérica para ataques e modificações de armas.

Escopo planejado:

- workflow de ataque/dano rastreável;
- flags de modificações em armas;
- cálculo de categoria base, aumento e categoria final;
- validação visual de categoria;
- modificadores de dano rastreáveis por origem/tag;
- início de triggers condicionais.

Caso alvo:

```txt
Modificação que adiciona +1d8 de dano.
Se o ataque for crítico, cura o atacante com base no dano causado por esse 1d8.
```

Observação: essa modificação exige workflow rastreável. Não deve ser implementada apenas concatenando string na fórmula da arma.

## v1.0 — Toolkit público estável

Critérios esperados para considerar v1.0:

- Resource Engine estável;
- Workflow Engine usável;
- Automation Runner usável;
- Registry/Binder de presets;
- chat cards enriquecidos;
- automações básicas de item/ritual;
- integração com uso normal de item ou fallback aceitável;
- modificações de arma iniciais;
- documentação de instalação e uso;
- integração tolerante a mudanças do sistema;
- sem dependência de console debug para uso básico.
