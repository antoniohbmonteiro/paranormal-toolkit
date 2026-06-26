# Changelog

## 0.7.1

### Corrigido

- `AutomationBinder` agora limpa a flag `flags.paranormal-toolkit.automation` antes de gravar uma nova automação.
- Reaplicar um preset não preserva mais campos legados/híbridos como `version`, `label` e `steps` no topo da flag.
- O formato gravado fica restrito a `schemaVersion`, `source` e `definition`, conforme decidido para a linha 0.7.x.

### Teste recomendado

- Reaplicar um preset em um ritual que já tinha flag antiga/híbrida e verificar que a flag final não possui campos top-level `version`, `label` ou `steps`.

## 0.7.0

### Adicionado

- `AutomationPreset` como modelo versionado de automações reutilizáveis.
- `AutomationRegistry` para registrar, listar e encontrar presets compatíveis com itens.
- `AutomationBinder` para aplicar presets em itens usando flags do Toolkit.
- Formato novo de flag de automação com `schemaVersion`, `source` e `definition`.
- Matchers iniciais por tipo de item, nome normalizado e círculo de ritual.
- Presets built-in iniciais:
  - `ritual.costOnly`;
  - `ritual.simpleHealing`;
  - `ritual.simpleDamage`;
  - `generic.simpleHealing`.
- Matcher inicial `Cicatrização` → `ritual.simpleHealing`.
- API `ParanormalToolkit.debug.automation.*` para listar, buscar, aplicar e limpar presets.

### Alterado

- Helpers de debug de ritual agora aplicam presets por `AutomationRegistry` + `AutomationBinder`.
- Helpers de debug de workflow usam o formato novo de flag.
- `readAutomationDefinition` agora lê somente o formato novo de flag e rejeita automações antigas gravadas diretamente como definição.
- `runFirstAutomation()` ignora itens com flag antiga inválida ao procurar o primeiro item automatizado.
- API global expõe `automationRegistry` e `automationBinder` para inspeção/desenvolvimento.

### Decisões

- Não haverá compatibilidade com o formato legado de flag antes da v1.0.
- Presets em código são a fonte inicial de verdade; compêndios funcionais tipo CPR ficam para uma etapa futura, depois da integração de uso normal do item.

## 0.6.2

### Adicionado

- `WorkflowDebugSnapshot` para inspecionar workflows sem despejar documentos inteiros do Foundry no console.
- `createWorkflowDebugSnapshot` e `createResourceTransactionDebugSnapshot` como serializers centralizados de diagnóstico.
- `WorkflowEngine.getLastDebugSnapshot()` para expor uma visão enxuta do último workflow.

### Alterado

- `ParanormalToolkit.debug.workflow.lastContext()` agora retorna um snapshot limpo, com IDs, nomes, fases, rolagens, custos, dano/cura e transações resumidas.
- Logs de sucesso de automação passaram a usar snapshot enxuto em vez de carregar `Actor`, `Item`, `Token` e `Roll` completos.
- Flags de resumo de workflow no chat agora reutilizam o serializer centralizado.
- Logs de operações de recurso agora usam transações resumidas, sem incluir o ator inteiro.

### Decisões

- `WorkflowContext` interno continua rico e com referências reais de Foundry para execução.
- Saída de debug/API pública deve usar snapshots serializados para evitar payload gigante, referências circulares e confusão entre dado base e dado preparado.

## 0.6.1

### Adicionado

- Intenções tipadas de rolagem (`damage`, `healing`, `attack`, `resistance`, `skill`, `ritual` e `generic`).
- `WorkflowRollRequest` e `WorkflowRollResult` no contexto do workflow.
- Fases especializadas de rolagem: `beforeDamageRoll`, `damageRoll`, `afterDamageRoll`, `beforeHealingRoll`, `healingRoll` e `afterHealingRoll`.
- Fases iniciais de resolução/aplicação de dano: `beforeDamageResolution`, `damageResolution`, `afterDamageResolution`, `beforeApplyDamage`, `applyDamage` e `afterApplyDamage`.
- Fases iniciais de aplicação de cura: `beforeApplyHealing`, `applyHealing` e `afterApplyHealing`.
- `damageInstances` e `healingInstances` no `WorkflowContext`, preparando suporte futuro para resistência, vulnerabilidade, redução e dano final.
- `ParanormalToolkit.debug.workflow.lastContext()` para inspecionar o último contexto executado.

### Alterado

- Steps `rollFormula` agora aceitam `intent` e `damageType`.
- Presets de teste de ritual agora marcam rolagens de cura como `healing` e rolagens de dano como `damage`.
- Chat card de debug de workflow mostra intenção da rolagem e instâncias simples de dano/cura quando disponíveis.

### Decisões

- A camada geral de lifecycle continua existindo, mas dano e cura começam a ganhar eventos especializados.
- Resistência/vulnerabilidade ainda não é aplicada automaticamente; a estrutura de `DamageInstance` foi criada para receber essa lógica em versão futura.

## 0.6.0

### Adicionado

- `core/workflow/` como fronteira interna para o mini Midi-QOL do Toolkit.
- `WorkflowEngine` para orquestrar execução de automações.
- `WorkflowHookEmitter` para emitir hooks públicos por fase.
- `WorkflowContext` com `id`, `phases`, `lifecycleEvents`, origem, item, alvos, rolagens, custos de ritual e transações de recurso.
- Fases iniciais do lifecycle: `created`, `beforeItemUse`, `resolveTargets`, `beforeCost`, `spendCost`, `afterCost`, `beforeRoll`, `roll`, `afterRoll`, `beforeApply`, `apply`, `afterApply`, `beforeChat`, `chat`, `completed` e `failed`.
- Hook por fase em `paranormal-toolkit.workflow.<phase>`.
- Hook genérico `paranormal-toolkit.workflow.phase`.
- API `ParanormalToolkit.debug.workflow.phases()`.

### Alterado

- Helpers de debug de ritual e workflow agora executam pelo `WorkflowEngine`.
- `AutomationRunner` passou a executar steps dentro das fases do lifecycle.
- Chat card de debug de workflow agora inclui a sequência de fases executadas quando debug/chat está ligado.
- API global agora expõe `ParanormalToolkit.workflow`.

### Corrigido

- Removido fallback deprecated `renderChatMessage`; o chat enrichment usa apenas `renderChatMessageHTML`, compatível com Foundry v14-first.

### Fora de escopo

- Interceptar clique normal da ficha.
- UI Medkit.
- Registry/Binder de presets.
- Resistência, templates, Active Effects e automações oficiais.

## 0.5.3

### Corrigido

- Chat enrichment passou a usar apenas `renderChatMessageHTML`.
- Removido uso do hook deprecated `renderChatMessage`, que gerava warning no Foundry v14 e será removido no v15.

## 0.5.2

### Adicionado

- Settings de debug/output visíveis nas configurações do módulo.
- `DebugOutputService` para centralizar saídas de debug em console, notificação e chat.
- API `ParanormalToolkit.debug.output.*` para ligar/desligar debug e canais de saída pelo console.

### Alterado

- Cards de debug/teste de recurso e workflow agora passam pelo `DebugOutputService`.
- Cards de debug no chat ficam desligados por padrão.
- Quando ativado, o chat de debug é enviado como whisper para GMs.

### Decisões

- `ChatMessage.create` não deve ficar espalhado em helpers de debug.
- Mensagens reais de gameplay e mensagens de diagnóstico devem continuar separadas antes da fundação do `WorkflowEngine`.

## 0.5.1

### Alterado

- Roadmap atualizado para priorizar um `WorkflowEngine` estilo mini Midi-QOL para Ordem.
- Roadmap reorganizado para colocar `AutomationRegistry`, `PresetBinder` e integração com uso normal de item antes de modificações de armas.
- README atualizado com a direção de presets estilo mini Chris Premades.
- Princípio de automação por nome refinado: nome pode ser matcher inicial, mas a execução real deve depender de flags aplicadas ao item.

### Decisões

- O Toolkit pode suportar automação de conteúdo existente na mesa/sistema, inclusive por nomes conhecidos, sem redistribuir descrições oficiais ou compêndios protegidos no módulo público.
- O próximo foco técnico passa a ser o ciclo de vida de workflow: origem, alvo, custo, rolagem, resistência, aplicação e eventos.

## 0.5.0

### Adicionado

- Automação básica de ritual de cura.
- Automação básica de ritual de dano.
- Helpers de debug:
  - `ParanormalToolkit.debug.ritual.setTestHealingAutomationOnFirstRitual(formula?)`;
  - `ParanormalToolkit.debug.ritual.setTestDamageAutomationOnFirstRitual(formula?)`;
  - `ParanormalToolkit.debug.ritual.runFirstRitualAutomation()`.
- Presets genéricos usando `spendRitualCost`, `rollFormula`, `modifyResource` e `chatCard`.
- Suporte a fórmula customizada nos helpers de debug de cura/dano simples.

### Decisões

- As automações de ritual são presets genéricos de teste, não conteúdo oficial.
- O workflow de ritual usa custo calculado por círculo ou override por flag.
- Resistência, área, duração, condições e Active Effects continuam fora de escopo desta versão.

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
