# Arquitetura

Este documento descreve a arquitetura desejada para o Paranormal Toolkit.

## Visão geral

O Toolkit deve ser uma camada opcional de automação para o sistema `ordemparanormal` no Foundry VTT.

O sistema base continua sendo responsável por:

- documentos principais;
- ficha;
- itens;
- habilidades;
- dados de ator;
- lógica nativa do sistema.

O Toolkit adiciona:

- workflows;
- automações configuráveis;
- chat cards enriquecidos;
- gasto automático de recursos;
- modificações de armas;
- integrações futuras com FX.

## Regra central

O core do Toolkit não deve conhecer paths internos do sistema.

Errado:

```ts
await actor.update({ "system.PV.value": nextValue });
```

Certo:

```ts
await resourceAdapter.updateResource(actor, "PV", nextValue);
```

Somente o adapter do sistema deve saber que, hoje, PV fica em `system.PV.value`.

## Camadas

Estrutura travada a partir da v0.2.1:

```txt
src/
  main.ts
  constants.ts
  toolkit-services.ts

  adapters/
    ordem/
      ordem-system-adapter.ts
      ordem-resource-adapter.ts
      ordem-paths.ts

  core/
    result.ts
    actor-resolver.ts
    system-guard.ts
    module-logger.ts

    resources/
      actor-resource.ts
      resource-engine.ts
      resource-operation.ts
      resource-transaction.ts

  features/
    chat/
      chat-target-capture.ts
      chat-enrichment-renderer.ts
      chat-workflow-flags.ts

  ui/
    chat-message-service.ts

  debug/
    debug-api.ts
    actor-debug-api.ts

  types/
    foundry-shim.d.ts
```

Regra de dependência:

```txt
core não cria ChatMessage
core não conhece paths do sistema
features orquestram comportamento de módulo
adapters falam com Foundry/sistema
ui renderiza/apresenta
debug é API temporária de desenvolvimento
```

`main.ts` é o composition root do módulo. Ele cria `ToolkitServices` e injeta as dependências onde precisa.

## Responsabilidades

### `OrdemSystemAdapter`

Sabe ler informações gerais do sistema `ordemparanormal`, como snapshot de ator e DT de ritual.

Não deve executar regra de domínio.

### `OrdemResourceAdapter`

Sabe ler e atualizar PV, SAN, PE e PD nos paths atuais do sistema.

Responsável por:

- mapear `PV`, `SAN`, `PE` e `PD` para paths reais do sistema;
- validar se os paths existem;
- falhar explicitamente quando o data model mudar;
- atualizar apenas o valor atual do recurso.

Se um path esperado não existir, o adapter deve retornar falha controlada. Ele não deve mascarar path quebrado como `0`.

### `ResourceEngine`

Use case de domínio para recursos.

Responsável por:

- gastar recurso;
- causar dano;
- curar;
- recuperar;
- impedir valor negativo;
- impedir passar do máximo;
- retornar transações rastreáveis.

Não deve saber se PV fica em `system.PV.value`, `system.resources.health.value` ou outro path futuro.

### `AutomationRunner`

Executa automações declarativas.

Responsável por:

- ler uma `AutomationDefinition`;
- executar steps em ordem;
- parar quando um step obrigatório falhar;
- preencher `WorkflowContext`;
- delegar operações para engines especializadas.

### `WorkflowContext`

Fonte de verdade de um workflow em execução.

Deve conter, quando aplicável:

- atacante/conjurador;
- token de origem;
- item usado;
- targets;
- rolls;
- resultados;
- transações de recurso;
- dados para chat card;
- dados para eventos/hooks.

### `Chat Enrichment`

Responsável por enriquecer mensagens de chat sem substituir o card original do sistema.

Direção inicial:

- capturar targets atuais em `preCreateChatMessage`;
- salvar dados em flags próprias do Toolkit;
- renderizar um bloco visual embaixo do card original;
- evitar parsing frágil de HTML/texto.

### `WeaponModificationEngine`

Responsável por transformar modificações declaradas em efeitos de workflow.

Não deve hardcodar por nome de item.

Errado:

```ts
if (item.name === "Presas de Abate") {
  // regra especial
}
```

Certo:

```ts
const modifications = weapon.getFlag(MODULE_ID, "weapon.modifications");
```

## Flags

Namespace obrigatório:

```txt
paranormal-toolkit
```

Exemplos:

```ts
item.flags["paranormal-toolkit"].automation
item.flags["paranormal-toolkit"].weapon.modifications
chatMessage.flags["paranormal-toolkit"].workflow
```

## Result Type

Falhas esperadas de regra não devem ser exception.

Exemplos de falhas esperadas:

- recurso insuficiente;
- amount inválido;
- nenhum alvo selecionado;
- item sem automação configurada.

Exceptions devem ser reservadas para erros inesperados:

- falha no `actor.update`;
- documento inválido;
- erro de API;
- bug de implementação.

## Integração com sistema em refatoração

O sistema `ordemparanormal` deve passar por refatoração de dados.

Por isso:

- não espalhar paths no core;
- manter adapters pequenos e explícitos;
- documentar assumptions atuais;
- criar testes manuais de mesa;
- preferir interfaces e providers para regras que podem virar nativas.


## Automation Runner inicial

A partir da v0.3, automações são declaradas por flag no item:

```ts
item.flags["paranormal-toolkit"].automation
```

A automação é versionada e executada sequencialmente pelo `AutomationRunner`.

Steps suportados na primeira versão:

- `spendResource`;
- `rollFormula`;
- `modifyResource`;
- `chatCard`.

O runner não deve automatizar item por nome. A configuração deve ser explícita e opt-in.

O `WorkflowContext` guarda origem, item, targets, rolagens e transações de recurso para que versões futuras possam aplicar rituais, armas, triggers condicionais e eventos de FX sobre a mesma base.

## Paralelo com Android/Kotlin

```txt
OrdemSystemAdapter/OrdemResourceAdapter = Repository/DataSource específico do sistema
ResourceEngine = UseCase de domínio
AutomationRunner = Orquestrador de caso de uso
ChatMessageService = Presenter/View adapter
Flags = metadados persistidos próprios do módulo
```

A regra é a mesma: domínio não conhece detalhe de armazenamento.
