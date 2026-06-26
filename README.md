# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas paranormais no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.8.0`.

O projeto ainda está em fase inicial, mas já possui:

- manifesto `module.json` para Foundry v14+;
- build ES Module em `dist/main.js`;
- fontes TypeScript em `src/`;
- detecção do sistema `ordemparanormal`;
- adapters para isolar paths do sistema;
- `ResourceEngine` para PV, SAN, PE e PD;
- chat cards de operações de recurso;
- captura/enriquecimento de targets em chat;
- `AutomationRunner` inicial por flags de item;
- custo de rituais por círculo, com override por flag;
- step `spendRitualCost` para automações de ritual;
- automações básicas de ritual: cura simples e dano simples;
- `WorkflowEngine` inicial com ciclo de vida/fases estilo mini Midi-QOL;
- rolagens tipadas por intenção (`damage`, `healing`, `generic`, etc.);
- instâncias iniciais de dano/cura no contexto de workflow;
- snapshots limpos de debug para inspeção do último workflow;
- hooks públicos por fase de workflow;
- `AutomationRegistry` e `AutomationBinder` para presets versionados;
- presets built-in iniciais de ritual e debug;
- direção de presets estilo mini Chris Premades, com aplicação por flags;
- integração experimental com uso normal de item pela ficha;
- fallback isolado em `OrdemItem.roll()`, preparado para trocar por hook oficial `ordemparanormal.itemUsed`;
- settings de debug/output configuráveis no Foundry;
- API de debug organizada por domínio (`debug.actor.*`, `debug.ritual.*`, `debug.workflow.*`, `debug.itemUseIntegration.*` e `debug.output.*`).

## Requisitos

- Foundry VTT v14+
- Sistema alvo: `ordemparanormal`

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Rode typecheck e build:

```bash
npm run typecheck
npm run build
```

Ou rode em modo watch:

```bash
npm run dev
```

## Instalação local para desenvolvimento

Crie um link simbólico deste projeto dentro da pasta de módulos do Foundry.

No Windows, em um terminal com permissão de administrador:

```powershell
mklink /D "C:\Users\SEU_USUARIO\AppData\Local\FoundryVTT\Data\modules\paranormal-toolkit" "C:\caminho\para\paranormal-toolkit"
```

Depois, ative o módulo no mundo do Foundry.


## Direção arquitetural

A partir da `v0.6`, o projeto possui um **Paranormal Workflow Engine** inicial: uma base pequena, própria e sustentável para ciclo de vida de uso de item/ritual, inspirada na ideia central do Midi-QOL.

Lifecycle alvo:

```txt
created
beforeItemUse
resolveTargets
beforeCost
spendCost
afterCost
beforeRoll
beforeDamageRoll / beforeHealingRoll
roll
damageRoll / healingRoll
afterDamageRoll / afterHealingRoll
afterRoll
beforeDamageResolution / damageResolution / afterDamageResolution
beforeApply
beforeApplyDamage / beforeApplyHealing
apply
applyDamage / applyHealing
afterApplyDamage / afterApplyHealing
afterApply
beforeChat
chat
completed
failed
```

A partir disso, o Toolkit deve evoluir para um modelo de presets estilo Chris Premades:

```txt
item existente na mesa/sistema
↓
Toolkit encontra preset compatível
↓
mestre aplica preset
↓
item recebe flags do Toolkit
↓
ao usar o item normalmente, o WorkflowEngine executa a automação
```

Isso permite automatizar conteúdo que já existe na mesa sem empacotar descrições oficiais ou compêndios protegidos no módulo público.



## Automation Registry e Preset Binder

A partir da `v0.7.0`, automações novas são aplicadas por preset registrado, usando somente o formato novo de flag. A `v0.7.1` garante que reaplicar um preset limpe totalmente qualquer formato híbrido/legado antes de gravar a flag nova. O core não executa mais uma definição antiga gravada diretamente em `flags.paranormal-toolkit.automation.steps`.

Formato conceitual da flag:

```ts
flags["paranormal-toolkit"].automation = {
  schemaVersion: 1,
  source: {
    type: "preset",
    presetId: "ritual.simpleHealing",
    presetVersion: "1.0.0",
    appliedAt: "...",
    appliedBy: "..."
  },
  definition: {
    version: 1,
    label: "Ritual de cura simples",
    steps: []
  }
};
```

Presets built-in iniciais:

```txt
ritual.costOnly
ritual.simpleHealing
ritual.simpleDamage
generic.simpleHealing
```

Debug/API:

```js
ParanormalToolkit.debug.automation.listPresets();
ParanormalToolkit.debug.automation.findPresetsForFirstRitual();

await ParanormalToolkit.debug.automation.applyPresetToFirstRitual("ritual.simpleHealing");
await ParanormalToolkit.debug.automation.applyBestPresetToFirstRitual();
await ParanormalToolkit.debug.automation.clearAutomationFromFirstRitual();
```

`Cicatrização` já é reconhecida por matcher de nome normalizado e aponta para `ritual.simpleHealing`. Isso é o começo do modelo mini Chris Premades: nome pode ajudar a aplicar um preset, mas a execução real usa a flag gravada no item.

## Item Use Integration

A partir da `v0.8.0`, o Toolkit consegue executar automações aplicadas ao item quando ele é usado normalmente pela ficha.

A arquitetura é **fallback-first, hook-ready**:

```txt
hoje:
OrdemItem.roll() wrapper isolado

futuro ideal:
ordemparanormal.itemUsed hook oficial
```

O fallback é registrado no adapter do sistema Ordem e chama o `roll()` original antes de executar qualquer automação do Toolkit. Assim, o card normal do sistema continua aparecendo mesmo se a automação falhar.

A execução automática fica desligada por padrão. Para testar:

```js
await ParanormalToolkit.debug.automation.applyBestPresetToFirstRitual();
await ParanormalToolkit.debug.itemUseIntegration.enable();

ParanormalToolkit.debug.itemUseIntegration.status();
```

Depois use o item/ritual pela ficha. Se o item tiver `flags.paranormal-toolkit.automation.definition`, o `WorkflowEngine` será executado usando o ator do item como origem e os targets atuais do usuário como alvos.

Para desativar:

```js
await ParanormalToolkit.debug.itemUseIntegration.disable();
```

## Workflow lifecycle

A `v0.6.0` introduz o ciclo de vida inicial de workflow. Os helpers de debug de ritual e workflow agora passam pelo `WorkflowEngine` antes de chegar no `AutomationRunner`.

Fases atuais:

```js
ParanormalToolkit.debug.workflow.phases();
```

Resultado esperado:

```txt
created
beforeItemUse
resolveTargets
beforeCost
spendCost
afterCost
beforeRoll
beforeDamageRoll / beforeHealingRoll
roll
damageRoll / healingRoll
afterDamageRoll / afterHealingRoll
afterRoll
beforeDamageResolution / damageResolution / afterDamageResolution
beforeApply
beforeApplyDamage / beforeApplyHealing
apply
applyDamage / applyHealing
afterApplyDamage / afterApplyHealing
afterApply
beforeChat
chat
completed
failed
```

Hooks públicos emitidos por fase:

```js
Hooks.on("paranormal-toolkit.workflow.afterRoll", (event) => {
  console.log(event.phase, event.context.rolls);
});

Hooks.on("paranormal-toolkit.workflow.afterApply", (event) => {
  console.log(event.phase, event.context.resourceTransactions);
});
```

Cada evento recebe `{ phase, context, stepIndex?, step?, rollRequest?, rollResult?, damage?, healing?, resourceTransaction?, metadata? }`.

Para inspecionar o último workflow executado:

```js
ParanormalToolkit.debug.workflow.lastContext();
```

A partir da `v0.6.2`, esse comando retorna um snapshot enxuto. Ele não despeja `Actor`, `Item`, `Token` ou `Roll` completos; mostra apenas IDs, nomes, fases, rolagens resumidas, custos, instâncias de dano/cura e transações de recurso.

Com debug/chat ligado, o chat card de workflow mostra a lista de fases executadas. Isso é diagnóstico de desenvolvimento, não UX final de jogo.

## Debug output

A partir da `v0.5.2`, os cards de debug/teste no chat são controlados por settings do módulo.

Settings disponíveis em **Configure Settings → Module Settings → Paranormal Toolkit**:

```txt
Ativar debug do Paranormal Toolkit
Debug no console
Debug como notificação
Debug no chat
```

Defaults:

```txt
debug desligado
console ligado
notificação ligada
chat desligado
```

O chat de debug, quando ligado, é enviado como whisper para GMs.

Também é possível controlar pelo console:

```js
ParanormalToolkit.debug.output.status();

await ParanormalToolkit.debug.output.enable();
await ParanormalToolkit.debug.output.disable();

await ParanormalToolkit.debug.output.enableChat();
await ParanormalToolkit.debug.output.disableChat();
```

Com o debug/chat desligado, helpers de teste continuam alterando recursos e executando automações, mas não criam cards de diagnóstico no chat.

## Debug de recursos

Com um token de Agente selecionado na cena, abra o console do Foundry e rode:

```js
ParanormalToolkit.debug.actor.logResources();
```

Operações disponíveis:

```js
await ParanormalToolkit.debug.actor.spendPE(1);
await ParanormalToolkit.debug.actor.spendPD(1);
await ParanormalToolkit.debug.actor.damagePV(3);
await ParanormalToolkit.debug.actor.healPV(3);
await ParanormalToolkit.debug.actor.damageSAN(2);
await ParanormalToolkit.debug.actor.recoverSAN(2);
```

## Debug de rituais

Com um token de Agente selecionado e pelo menos um item do tipo ritual no ator:

```js
ParanormalToolkit.debug.ritual.logFirstRitualCost();
```

A regra padrão de custo por círculo é:

```txt
1º círculo → 1 PE
2º círculo → 3 PE
3º círculo → 6 PE
4º círculo → 10 PE
```

Também é possível sobrescrever o custo do primeiro ritual por flag:

```js
await ParanormalToolkit.debug.ritual.setCustomCostOnFirstRitual(2, "PE");
await ParanormalToolkit.debug.ritual.clearCustomCostOnFirstRitual();
```

Para testar o step `spendRitualCost` no workflow:

```js
await ParanormalToolkit.debug.ritual.setTestCostAutomationOnFirstRitual();
await ParanormalToolkit.debug.ritual.runFirstRitualAutomation();
```

Para testar rituais básicos com alvo marcado:

```js
await ParanormalToolkit.debug.ritual.setTestHealingAutomationOnFirstRitual();
await ParanormalToolkit.debug.ritual.runFirstRitualAutomation();

await ParanormalToolkit.debug.ritual.setTestDamageAutomationOnFirstRitual();
await ParanormalToolkit.debug.ritual.runFirstRitualAutomation();
```

A fórmula padrão do preset de cura de `Cicatrização` é `2d8+2`. As fórmulas também podem ser sobrescritas no helper de debug:

```js
await ParanormalToolkit.debug.ritual.setTestHealingAutomationOnFirstRitual("2d8");
await ParanormalToolkit.debug.ritual.setTestDamageAutomationOnFirstRitual("2d6");
```

Essas automações são genéricas de teste. Elas não distribuem conteúdo oficial.

## Debug de workflow

Para testar a primeira automação genérica:

```js
await ParanormalToolkit.debug.workflow.setTestHealingAutomationOnFirstItem();
```

Depois selecione o conjurador, marque um alvo e rode:

```js
await ParanormalToolkit.debug.workflow.runFirstAutomation();
```

A automação de teste:

```txt
1. cria um WorkflowContext;
2. emite fases do lifecycle;
3. gasta 1 PE do ator de origem;
4. rola 2d8+2;
5. cura PV do alvo marcado;
6. cria chat card de resumo quando debug/chat estiver ligado;
7. emite completed ou failed.
```

Também é possível executar por UUID de item:

```js
await ParanormalToolkit.debug.workflow.runItemAutomationByUuid("Actor.x.Item.y");
```

## Princípios

- O Toolkit é companion opcional, não substituto do sistema base.
- Automação é opt-in por flags.
- Nome de item pode ser usado como matcher inicial de preset, mas a execução deve depender de flags aplicadas ao item.
- O Toolkit público não deve redistribuir textos oficiais, descrições oficiais, artes ou compêndios protegidos.
- Core não deve conhecer paths internos do sistema.
- Paths ficam em adapters.
- Não distribuir conteúdo oficial, textos, artes, compêndios ou assets protegidos.

## Licença

Código sob licença MIT.

Este projeto não é oficial e não possui afiliação com os detentores da marca Ordem Paranormal.
