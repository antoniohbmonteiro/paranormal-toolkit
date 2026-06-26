# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas paranormais no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.5.1`.

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
- roadmap atualizado para um Workflow Engine estilo mini Midi-QOL;
- direção de presets estilo mini Chris Premades, com aplicação por flags;
- API de debug organizada por domínio (`debug.actor.*`, `debug.ritual.*` e `debug.workflow.*`).

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

A partir da `v0.6`, o foco passa a ser construir um **Paranormal Workflow Engine**: uma base pequena, própria e sustentável para ciclo de vida de uso de item/ritual, inspirada na ideia central do Midi-QOL.

Lifecycle alvo:

```txt
beforeItemUse
resolveTargets
beforeCost
spendCost
beforeRoll
roll
afterRoll
beforeResistance
resistance
afterResistance
beforeApply
apply
afterApply
completed
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
1. gasta 1 PE do ator de origem;
2. rola 1d8;
3. cura PV do alvo marcado;
4. cria chat card de resumo.
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
