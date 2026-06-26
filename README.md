# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas paranormais no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.6.2`.

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
- direção de presets estilo mini Chris Premades, com aplicação por flags;
- settings de debug/output configuráveis no Foundry;
- API de debug organizada por domínio (`debug.actor.*`, `debug.ritual.*`, `debug.workflow.*` e `debug.output.*`).

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

As fórmulas padrão são `1d8`, mas podem ser sobrescritas no helper de debug:

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
4. rola 1d8;
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
