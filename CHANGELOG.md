# Changelog

## 0.2.1

Architecture lock antes do Automation Runner.

- Separa `OrdemSystemAdapter` e `OrdemResourceAdapter`.
- Cria `ToolkitServices` como composition root simples.
- Move `ChatMessageService` para `src/ui`.
- Remove API legada `createResourceSpendMessage`.
- Limpa duplicação de paths de recurso em `ORDEM_PATHS`.
- Faz leitura de recurso falhar explicitamente quando path do sistema não existe ou não é numérico.
- Adiciona origem/source ao flag de workflow do chat.
- Evita capturar targets em mensagens criadas pelo próprio Toolkit.
- Atualiza versão para `0.2.1` sem sufixo alpha.

## 0.2.0

- Resource Engine genérico.
- Operações de PV/SAN/PE/PD.
- Chat cards genéricos de recurso.
- Captura inicial de targets no chat.

## 0.1.0

- Fundação do módulo.
- Guard de sistema `ordemparanormal`.
- Leitura inicial de recursos.
- Gasto inicial de PE via debug API.
