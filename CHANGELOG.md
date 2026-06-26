# Changelog

## 0.3.1

### Corrigido

- Adicionado suporte para PV de ameaças (`threat`) no path `system.attributes.hp`.
- O adapter de recursos agora resolve paths por tipo de ator antes de usar candidatos genéricos.
- Mensagens de erro de recurso ausente agora incluem tipo do ator e paths testados.

### Observação

- O erro de Active Effects no Foundry v14 continua sendo causado pelo ciclo de preparação de dados do sistema base ao executar `actor.update`. O Toolkit não depende de Active Effects nessa etapa.

## 0.3.0

### Adicionado

- `AutomationRunner` inicial para executar automações declaradas por flags em itens.
- Tipos versionados para `AutomationDefinition` e `AutomationStep`.
- `WorkflowContext` com origem, item, targets, rolagens e transações de recurso.
- Steps iniciais:
  - `spendResource`;
  - `rollFormula`;
  - `modifyResource`;
  - `chatCard`.
- Debug API de workflow:
  - `ParanormalToolkit.debug.workflow.setTestHealingAutomationOnFirstItem()`;
  - `ParanormalToolkit.debug.workflow.runFirstAutomation()`;
  - `ParanormalToolkit.debug.workflow.runSelectedItemAutomation()`;
  - `ParanormalToolkit.debug.workflow.runItemAutomationByUuid(uuid)`.
- Chat card de resumo de workflow.

### Decisões

- Automação continua opt-in por flag.
- Nenhum item é automatizado por nome.
- A primeira automação de teste é genérica: gasta 1 PE, rola 1d8 e cura PV do alvo.

## 0.2.1

### Alterado

- Trava arquitetural antes do `AutomationRunner`.
- Separação entre `OrdemSystemAdapter` e `OrdemResourceAdapter`.
- `ResourceEngine` passou a ser criado no composition root (`ToolkitServices`).
- `ChatMessageService` saiu de `core/` e foi para `ui/`.
- `ORDEM_RESOURCE_PATHS` passou a ser mapeado por `ActorResource`.
- Leitura de recursos passou a falhar quando path obrigatório não existe, em vez de mascarar como `0`.

### Adicionado

- `ToolkitServices` como composition root simples.
- Source/origem no flag de workflow do chat enrichment.
- Filtro para não capturar targets em mensagens criadas pelo próprio Toolkit.

## 0.2.0

### Adicionado

- `ResourceEngine` genérico.
- Operações de PE, PD, PV e SAN.
- Chat cards genéricos de recurso.
- Captura de targets em mensagens de chat.
- Enriquecimento visual de chat com bloco do Toolkit.

## 0.1.0

### Adicionado

- Scaffold inicial Foundry v14+.
- TypeScript + Vite.
- Guard para o sistema `ordemparanormal`.
- Adapter inicial para leitura de PV, SAN, PE, PD e DT de ritual.
- API global de debug.
- Gasto de PE com validação.
- Chat card simples de gasto de PE.
