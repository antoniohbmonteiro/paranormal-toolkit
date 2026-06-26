# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas paranormais no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.3.0`.

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
- API de debug organizada por domínio (`debug.actor.*` e `debug.workflow.*`).

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
- Não automatizar por nome de item.
- Core não deve conhecer paths internos do sistema.
- Paths ficam em adapters.
- Não distribuir conteúdo oficial, textos, artes, compêndios ou assets protegidos.

## Licença

Código sob licença MIT.

Este projeto não é oficial e não possui afiliação com os detentores da marca Ordem Paranormal.
