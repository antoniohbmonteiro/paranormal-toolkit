# Changelog

## 0.4.2

### Corrigido

- Corrigida leitura de círculo de ritual quando o sistema armazena `system.circle` como string.
- `OrdemRitualAdapter` agora aceita `1`, `2`, `3`, `4` numéricos e também `"1"`, `"2"`, `"3"`, `"4"`.
- Mantida validação estrita para rejeitar valores fora de 1 a 4.

## 0.4.1

### Corrigido

- Corrigido path do círculo de rituais do sistema Ordem.
- O adapter agora lê primeiro `system.circle`, que é o path atual dos itens do tipo `ritual`.
- Mantido fallback para `system.ritual.circle` por tolerância a dados antigos/customizados.
- Mensagem de erro agora mostra todos os paths testados.

## 0.4.0

### Adicionado

- `RitualCostProvider` para cálculo de custo de rituais.
- `OrdemRitualAdapter` para leitura do círculo do ritual.
- Custo padrão por círculo: 1, 3, 6 e 10 PE.
- Override de custo por flag em `flags.paranormal-toolkit.ritual.cost`.
- Step `spendRitualCost` no `AutomationRunner`.
- Registro do custo de ritual no `WorkflowContext` e no chat card de workflow.
- Debug API de rituais:
  - `ParanormalToolkit.debug.ritual.logFirstRitualCost()`;
  - `ParanormalToolkit.debug.ritual.setCustomCostOnFirstRitual(amount, resource?)`;
  - `ParanormalToolkit.debug.ritual.clearCustomCostOnFirstRitual()`;
  - `ParanormalToolkit.debug.ritual.setTestCostAutomationOnFirstRitual()`.

### Decisões

- Rituais continuam genéricos e configuráveis por flags.
- Nenhum conteúdo oficial ou ritual específico foi incluído.
- Cura/dano simples de rituais ficam para a próxima etapa.

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
