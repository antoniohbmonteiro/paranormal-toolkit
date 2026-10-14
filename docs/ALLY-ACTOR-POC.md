# Aliados — PoC do Actor e suporte passivo

## Resultado e limites

A PoC original adicionou o subtipo `paranormal-toolkit.ally`, um perfil mínimo e uma ficha baseada diretamente em ActorSheetV2. O smoke de criação, edição, habilidades, arraste e persistência foi aprovado pelo usuário no Foundry v14. O incremento 1 de suporte passivo está implementado e aguarda seu smoke, detalhado ao final deste documento. A versão continua em **0.42.0**, sem release.

A ficha permite editar nome, caminho de imagem, descrição e identificação de drone; criar, abrir, importar por arraste e remover Items nativos `ability`. A importação usa a API nativa de ActorSheetV2. Outros tipos de Item, Actors, folders e Active Effects não são aceitos pelo arraste desta ficha. Remover uma habilidade pede confirmação e revalida a permissão depois dela.

A ficha não oferece botão de uso. A ficha nativa do Item continua disponível para edição; seus controles próprios pertencem ao sistema e não são desativados globalmente por esta PoC. Usar macros ou controles nativos de uso não constitui um cenário suportado desta PoC.

Na execução original da PoC, o agente não executou testes no servidor Foundry. Posteriormente, o usuário informou aprovação do smoke citado acima. A preparação e migração verificadas abaixo utilizam fontes reais do sistema com substitutos das dependências Foundry; isso **não comprova** o ciclo real de preparação, arraste, formulário, persistência, ownership no servidor ou migração global do mundo.

**Recomendação atual: validar o suporte passivo no Foundry real antes de implementar comandos; decidir release separadamente.** Até aqui, não foi demonstrada necessidade de herdar AgentData ou modificar OrdemActor globalmente.

## Contratos e isolamento

- `src/core/allies/ally-profile.ts`: perfil simples, sem Foundry, namespace ou classes do Toolkit. Campos: `schemaVersion: 1`, `description` e `isDrone`.
- `AllyDataModel`: adapter do perfil para TypeDataModel, sem campos de Agente nem preparação de recursos.
- `ally-registration.ts`: concentra o tipo namespaced e a seleção da ficha. Preserva `CONFIG.Actor.documentClass` e os modelos/fichas de `agent` e `threat`.
- `AllySheet`: ações pequenas de edição e gestão de Items; renderer recebe valores simples e não altera Documents.
- Nome, imagem, UUIDs, ownership e persistência continuam sendo responsabilidade do Actor nativo.
- Descrição é um HTMLField com declaração de sanitização no manifest, editado nesta PoC como texto HTML em textarea.
- Dados inválidos ou de versão desconhecida bloqueiam edição pela ficha; não são normalizados silenciosamente.

O registro funciona em `init`, apenas quando `game.system.id === "ordemparanormal"`. O manifest declara `Actor.ally`; o Foundry adiciona o prefixo do módulo. Não há alteração em `CONFIG.Actor.documentClass`, prototypes ou arquivos do sistema.

Referências oficiais:
- https://foundryvtt.com/api/v14/classes/foundry.abstract.TypeDataModel.html
- https://foundryvtt.com/api/v14/classes/foundry.applications.sheets.ActorSheetV2.html
- https://foundryvtt.com/api/v14/classes/foundry.applications.api.DocumentSheetV2.html
- https://foundryvtt.com/api/v14/classes/foundry.applications.apps.DocumentSheetConfig.html
- https://foundryvtt.com/article/module-sub-types/

A documentação consultada identifica Foundry v14.368. Essa é a versão da documentação, **não uma versão de runtime testada**.

## Correções mantidas para as etapas futuras

`op.postBuildSkillRollConfig` está comentado em `module/dice/basic-roll.mjs`, no caminho sem diálogo. A emissão em `module/applications/roll-configuration-dialog.mjs` não estabelece cobertura uniforme. A integração de +1d20 permanece hipótese a validar, fora desta PoC.

A comparação de persistência foi concluída no plano aprovado: um único JournalEntry operacional restrito aos GMs, atrás de AllyStore, com referência ancorada nos Users GM. O incremento 1 implementa essa escolha; a proteção nativa ainda exige smoke multiplayer.

As decisões funcionais aprovadas permanecem válidas. O incremento 1 implementa beneficiário, transições de combate e precedência passiva. Custos, piloto, comandos e benefícios condicionais aguardam os incrementos seguintes. Não há controle de economia de ações.

## Evidência automatizada

Baseline: Toolkit `c8d6488`, versão 0.42.0. Referência Ordem: `7df956c`, sistema 8.0.2, compatibilidade declarada `verified: 14.365`.

- Testes de perfil e renderer são puros, sem DOM ou Documents.
- Testes de registro, schema e handlers usam substitutos de DataModel, campos, ActorSheetV2, permissões, diálogo e operações de Documents. Verificam contratos e chamadas, não o comportamento interno do Foundry.
- `tests/reference/ordem-ally-compatibility.test.ts` lê as fontes reais de `OrdemActor`, helpers de cálculo e migrações. Transforma módulos para execução no harness, sem escrever no sistema. Substitui somente a base Foundry e dependências de rolagem/diálogo que não são exercitadas.
- O harness verifica preparação repetida sem cálculos exclusivos de Agente, `getRollData()` sem PE/PV/NEX e migração de snapshot com versão atual.
- O harness não faz chamadas de rede nem cria Documents no servidor.

Para repetir a suite com referência local em PowerShell:

```powershell
$env:PARANORMAL_TOOLKIT_ORDEM_REFERENCE = 'D:/dev/ordemparanormal_fvtt'
npm run check
```

Sem essa variável, os cinco testes de referência são explicitamente ignorados. Nenhum caminho absoluto do sistema é exigido em produção ou nos testes unitários comuns.

Resultados finais são registrados após o check completo na seção de validação abaixo.

## Limitação de migração confirmada

`migrateActorData()` percorre `Object.entries(actorData.system.skills)` quando o snapshot é anterior a 6.9.2 ou quando a migração antiga é forçada. Um Aliado mínimo não possui `skills`: esses cenários geram TypeError.

Os dois testes que documentam essa falha passam porque **esperam a rejeição**. Eles não significam que migração antiga é compatível.

Snapshots com `_stats.systemVersion` igual à versão atual não entram nesse trecho e retornaram patch vazio no harness. Nenhum campo de perícia ou metadado artificial foi acrescentado para contornar a falha.

Além disso, no checkout inspecionado, `migrateWorld()` invoca a função assíncrona `migrateActorData()` sem await. Portanto, o teste direto de snapshots não valida o comportamento do loop global de migração. Este código não foi alterado.

Se o teste real de criação, preparação ou migração normal exigir modificar OrdemActor globalmente ou herdar AgentData, interromper a evolução e apresentar a incompatibilidade. Uma eventual correção no sistema deve ser tratada em tarefa própria, com autorização explícita.

## Roteiro manual no Foundry v14

### Ambiente

Usar um mundo descartável com sistema Ordem 8.0.2 e esta branch do Toolkit. Não instalar esta PoC sobre uma mesa de produção. Registrar build exato do Foundry, versão/commit do sistema e commit do Toolkit. Antes de cada grupo, observar o console para identificar erros novos.

Executar `npm run build` e disponibilizar `module.json`, `dist`, `styles` e `lang` deste worktree como o módulo `paranormal-toolkit` do ambiente descartável. Não alterar a versão, criar tag ou publicar release.

### Casos e critérios de aceite

| Caso | Procedimento | Resultado esperado | Estado |
|---|---|---|---|
| Registro | Ativar módulo; abrir diálogo nativo de criação de Actor | Tipo Aliado disponível e traduzido | Pendente |
| Criação | Criar Aliado com perfil mínimo | Ficha própria, sem campos obrigatórios de Agente | Pendente |
| Classe | Comparar construtor do Actor com CONFIG.Actor.documentClass | OrdemActor preservado; system usa o modelo registrado | Pendente |
| Formulário | Editar nome/imagem/descrição; marcar e desmarcar drone; salvar | Valores persistidos corretamente, incluindo false do checkbox | Pendente |
| Reabertura | Fechar e reabrir ficha; F5; reiniciar mundo | Mesmo UUID e perfil salvo | Pendente |
| Items | Criar três habilidades, abrir, editar e remover uma | Items ability nativos, alterações persistidas | Pendente |
| Arraste | Arrastar ability de Items e de compêndio | Item embutido no Aliado; nenhum Item concedido em outro Actor | Pendente |
| Rejeição | Arrastar ritual, Actor, pasta e Active Effect | Nenhum documento criado por esses drops | Pendente |
| Ownership | Owner edita; Observer lê; usuário sem acesso não edita | Escritas respeitam servidor e ficha nativos | Pendente |
| Preparação | Preparar repetidamente e obter roll data | Sem erro ou criação de campos persistidos de Agente | Pendente |
| Regressão | Abrir e preparar Agente e Ameaça; usar habilidade/ritual de Agente | Fichas e workflows anteriores preservados | Pendente |
| Duplicação | Duplicar Aliado | Novo UUID e habilidades preservadas, sem vínculos de suporte | Pendente |
| Exportação | Exportar, importar em outro Actor de teste e recarregar | Perfil e Items preservados | Pendente |
| Desativação | Desativar e reativar módulo apenas no mundo descartável | Registrar comportamento sem provedor e recuperação ao reativar | Pendente |
| Migração | Testar atualização normal em cópia descartável do mundo | Sem perda de perfil/Items ou tentativa de aplicar dados de Agente | Pendente |
| Snapshots antigos | Executar o teste abaixo sem escrever no Actor real | Falha conhecida registrada, sem mutação do mundo | Pendente |

Verificação pontual no console, usando o UUID do Aliado de teste:

```javascript
const ally = await fromUuid("Actor.SUBSTITUIR_ID");
console.log({
  documentClassPreserved: ally.constructor === CONFIG.Actor.documentClass,
  modelRegistered: ally.system instanceof CONFIG.Actor.dataModels["paranormal-toolkit.ally"],
  profile: ally.toObject(true).system,
  abilities: ally.items.filter(i => i.type === "ability").map(i => i.uuid)
});
const before = JSON.stringify(ally.toObject(true).system);
ally.prepareData();
ally.prepareData();
console.log({ sourcePreserved: before === JSON.stringify(ally.toObject(true).system), rollData: ally.getRollData() });
```

Migração de **snapshot**, sem alterar _stats ou dados do documento:

```javascript
const { migrateActorData } = await import("/systems/ordemparanormal/module/migrations.mjs");
const source = ally.toObject(true);
const actorDouble = { items: [] };
console.log("Versão salva:", source._stats?.systemVersion);
console.log("Patch atual:", await migrateActorData(actorDouble, structuredClone(source), {}, {}));
const oldSource = structuredClone(source);
oldSource._stats.systemVersion = "6.8.0";
try {
  await migrateActorData(actorDouble, oldSource, {}, {});
  console.warn("Comportamento mudou: conferir compatibilidade da migração.");
} catch (error) {
  console.log("Falha antiga reproduzida apenas no snapshot:", error);
}
```

Não chamar migrateWorld com bypassVersionCheck em uma mesa real, nem modificar _stats do Actor para simular uma versão antiga.

## Critério de decisão

- **Avançar:** roteiro real comprova criação, formulário, preparação, Items, reinício e migração normal; nenhum patch global ou herança de AgentData é necessário.
- **Validação parcial:** testes locais aprovados, mas runtime real ainda pendente. Manter branch isolada, sem v0.43.0.
- **Interromper:** incompatibilidade estrutural em fluxo normal exige alterar globalmente OrdemActor ou herdar AgentData. Registrar evidência antes de qualquer nova solução.

## Validação automatizada original da PoC

- Runtime automatizado: Node.js v24.19.0; Vitest 3.2.6; Vite 7.3.6. Nenhum runtime Foundry foi exercitado.
- npm run typecheck: aprovado.
- npm run test com a referência Ordem configurada: 459 testes aprovados em 71 arquivos (431 existentes + 28 novos).
- npm run build: aprovado; 236 módulos transformados. dist continua ignorado e não será versionado.
- git diff --check: aprovado.
- Versões em module.json, package.json e package-lock.json: 0.42.0, sem mudanças.
- Checkout original do Toolkit e checkout do sistema Ordem: limpos e sem alterações desta PoC.
- Runtime Foundry da PoC: smoke de criação, edição, habilidades, arraste e persistência aprovado pelo usuário; demais casos permanecem pendentes.

Arquivos da PoC (3 modificados, 12 novos):

| Arquivo | Estado |
|---|---|
| module.json | Modificado |
| src/main.ts | Modificado |
| src/types/foundry-shim.d.ts | Modificado |
| src/core/allies/ally-profile.ts | Novo |
| src/features/allies/ally-data-model.ts | Novo |
| src/features/allies/ally-registration.ts | Novo |
| src/applications/ally-sheet.ts | Novo |
| src/ui/components/ally/ally-sheet.ts | Novo |
| styles/ally-sheet.css | Novo |
| lang/pt-BR.json | Novo |
| docs/ALLY-ACTOR-POC.md | Novo |
| tests/core/allies/ally-profile.test.ts | Novo |
| tests/ui/components/ally/ally-sheet.test.ts | Novo |
| tests/unit/features/allies/ally-actor.test.ts | Novo |
| tests/reference/ordem-ally-compatibility.test.ts | Novo |

## Incremento 1 — suporte passivo (aguardando smoke)

Implementação na branch `codex/ally-actor-poc`, mantendo o worktree e a versão 0.42.0. O domínio não importa namespace, Documents ou serviços do Toolkit. O perfil v1 da PoC permanece intacto; o estado operacional usa contratos v1 próprios.

### Arquivos e responsabilidades

| Arquivos | Responsabilidade |
|---|---|
| `src/core/allies/ally-definition.ts` | Definição declarativa v1, IDs estáveis e fingerprint do escopo mecânico; habilidades sem benefícios não alteram autorização. |
| `src/core/allies/ally-support-state.ts` | Atribuição, ativação, desativação e espera por rodada; preserva beneficiário e espera ao desativar. |
| `src/core/allies/ally-benefit-resolver.ts` | Um vencedor por beneficiário/chave; ordens persistidas por entrada, com fallback da fonte anterior. |
| `src/features/allies/ally-support-service.ts` | Fila do executor, aprovação de vínculo/escopo, transições, ordens e coordenação da reconciliação. |
| `src/features/allies/ally-reconciliation-service.ts` | Remove antes de substituir; grava IDs antes da criação; reutiliza IDs após resposta perdida; operações sem diferenças não recriam efeitos. |
| `src/features/allies/ally-operation-authority.ts` | Leitura restrita do payload, ownership atual e eleição determinística do GM ativo. |
| `src/features/allies/ally-lifecycle-hooks.ts` | Integração em ready; updateActor identifica o solicitante pelo userId nativo; updates de combate são observados após persistência. |
| `src/features/allies/config/ally-ability-config.ts` | Flag `allyAbility` do Item e permissão de configuração; identificação dos Items fonte. |
| `src/adapters/foundry/foundry-ally-store.ts` | JournalEntry restrito, ancorado em flags dos Users GM; leitura defensiva sem normalizar registro corrompido. |
| `src/adapters/foundry/foundry-ally-request-adapter.ts` | Solicitações por Actor, resolução de Actors persistentes/combates, apresentação; o GM lê o registro protegido, não o espelho editável. |
| `src/adapters/ordem/ordem-ally-benefit-adapter.ts` | Active Effects v14: `system.defense.value`, `type: add`, `phase: initial`, `priority: 20`; nunca grava Defesa permanente. |
| `src/applications/ally-ability-config-application.ts`, `src/ui/components/ally/ally-ability-config.ts` | Editor mínimo de entradas numéricas de Defesa; renderer puro. |
| `src/applications/ally-sheet.ts`, `src/ui/components/ally/ally-sheet.ts` | Controles mínimos de suporte, combate, aprovação, diagnóstico e configuração; layout da PoC mantido. |
| `src/features/abilities/ability-use-integration.ts`, `src/features/item-use/item-use-integration.ts` | Bloqueiam execução/cobrança Toolkit dos Items fonte do Aliado, inclusive quando têm automação. |
| `src/main.ts`, `src/types/foundry-shim.d.ts` | Lifecycle e tipos das APIs efetivamente utilizadas. |
| `tests/core/allies/ally-support-state.test.ts`, `ally-benefit-resolver.test.ts` | Transições e precedência puras. |
| `tests/unit/features/allies/ally-support-service.test.ts`, `ally-foundry-adapters.test.ts`, `ally-lifecycle-hooks.test.ts`, `ally-source-routing.test.ts` | Aprovação, gates, recuperação, eleição, Journal e wiring com substitutos. |
| `tests/ui/components/ally/ally-ability-config.test.ts` | Renderer sem mutação e escaping. |
| `docs/ROADMAP.md`, este relatório | Estado da implementação e roteiro; sem associar incrementos a releases. |

Arquivos da PoC listados anteriormente continuam preservados. Não houve alteração em classes globais, herança de AgentData ou no repositório Ordem.

### Persistência e aprovação

Comparação mantida: flags de Actor são editáveis pelos proprietários e servem para solicitação/apresentação; settings podem ser configurados por papéis autorizados além de GM; guardar o ledger inteiro em User atrela seu ciclo de vida à conta. A escolha aprovada foi um JournalEntry nativo independente, com `ownership.default: 0` e sem páginas editoriais.

O registro é criado apenas no primeiro uso. A referência é escrita nas flags dos Users GM existentes. Referência apresentada por jogador, UUID em Actor ou busca por marcador não selecionam a autoridade. Divergência, âncora inválida, referência inexistente, acesso de não-GM ao Journal ou schema desconhecido bloqueiam a operação. Remover todas as contas que possuem âncora exige recuperação administrativa explícita da referência; o módulo não escolhe outro documento silenciosamente.

Beneficiário/tipo, ownership do solicitante, revisão, fingerprint e executor são revalidados. Um jogador solicita o vínculo; o GM revisa e aprova. Solicitações posteriores dentro do vínculo aprovado não precisam de nova aprovação. Trocar beneficiário ou alterar valores/entradas exige aprovação. Nome, descrição e adição de habilidade sem benefício não mudam o escopo. A aprovação rejeita uma configuração alterada depois da revisão enviada pelo GM.

O espelho no Actor não autoriza efeito. O registro protegido também guarda os IDs gerenciados: marcadores em efeitos arbitrários não autorizam sua exclusão. Uma única fila processa solicitações no GM eleito. A eleição é conferida antes das escritas. Solicitação com revisão ultrapassada é rejeitada; repetir deve ser uma nova ação explícita após atualizar a ficha.

### Gate manual antes dos efeitos

O incremento cria um bloqueio persistente de ambiente: até o GM registrar a validação da versão atual de Foundry/Ordem, nenhum bônus é concedido. O botão **Registrar validação manual do ambiente** é uma declaração do GM de que os testes abaixo passaram, não um teste automático. O servidor efetivamente rejeitar escritas de jogadores e a preparação real de Defesa/esquiva continuam pendentes.

A instalação local foi identificada como Foundry **14.369** por seu package.json. A fonte local confirmou `add`/prioridade 20 e a permissão nativa que impede jogador de atualizar User de GM. Isso é inspeção de fonte, não smoke no servidor. A referência Ordem permanece 8.0.2/`7df956c`; registrar as versões reais usadas no seu mundo.

### Smoke manual do incremento 1

Usar mundo descartável. Disponibilizar deste worktree `module.json`, **a pasta dist inteira** (o build contém chunks), `styles` e `lang`; reiniciar/recarregar o mundo. Usar dois GMs e dois jogadores em sessões independentes. João e Rafa devem ser Actors `agent` do mundo, com proprietários diferentes. O Aliado Íris pode pertencer ao jogador de Rafa.

1. **Criar a configuração e o registro:** em Íris, criar habilidade; abrir **Benefícios**, adicionar bônus de Defesa 5 e salvar. Selecionar João, clicar **Atribuir / trocar**, aguardar atualização; GM aprova e ativa. Antes da validação do ambiente, é esperado diagnóstico e nenhum efeito gerado.
2. **Gate mecânico nativo:** em João, criar um Active Effect temporário de teste com chave `system.defense.value`, valor `5`, tipo `add`, fase `initial` e prioridade `20`. Defesa e esquiva precisam subir exatamente 5; o valor salvo deve permanecer igual. Remover somente esse efeito de teste e conferir o retorno. Se falhar, parar e relatar; não registrar o gate.
3. **Gate de permissões:** obter UUID do registro no console de um GM: `game.user.getFlag("paranormal-toolkit", "allyStore")`. No console de cada jogador, executar os probes abaixo usando IDs reais. Ambos precisam ser rejeitados pelo servidor. O controle positivo precisa funcionar; as rejeições precisam mencionar autorização, não formato inválido. O GM confere que a referência e o ledger permanecem intactos. Se uma escrita indevida for aceita, interromper o gate e restaurar a âncora original como GM. O jogador não deve conseguir abrir o Journal operacional.
4. **Gate de executor:** com dois GMs conectados, aprovar/ativar/desativar uma solicitação por vez, inclusive iniciada pelo segundo GM. Ambos veem o mesmo estado/revisão; não aparecem dois registros ativos nem projeções duplicadas. Duas solicitações simultâneas com a mesma revisão podem rejeitar a segunda como ultrapassada.
5. Somente com os gates aprovados, clicar **Registrar validação manual do ambiente** como GM. Íris ativa deve conceder um único efeito. João ganha Defesa e esquiva +5.
6. Desativar: remove efeito, preserva atribuição. Reativar: reaplica uma vez. Reatribuir João: não reinicia suporte nem muda prioridade. Alterar a Defesa base por edição nativa/snapshot de teste com suporte ativo deve conservar a edição após a retirada.
7. Fora de combate, trocar para Rafa, aprovar novo vínculo: remove de João e aplica em Rafa imediatamente quando ativo. Se o jogador solicitou, aguardar aprovação e atualização antes do próximo botão.
8. Durante combate iniciado, trocar: retira o anterior imediatamente ao processar a troca aprovada; mostra espera; aplica no novo beneficiário só após avançar a rodada. Desativar/reativar durante espera não a elimina. Encerrar/excluir combate libera a espera; retroceder rodada após ativar não desfaz suporte.
9. Dois combates envolvendo os Actors: selecionar explicitamente o combate. Escolha de combate alheio deve falhar. Suporte já ativo continua quando um combate inicia.
10. Segundo Aliado com Defesa 10 no mesmo beneficiário: último aplicado vence, total +10, sem somar +15. Desativar o vencedor restaura +5. Recarregar/reconciliar/editar valor com reaprovação não altera a prioridade da entrada existente.
11. Remover habilidade ou Aliado de teste: seus efeitos desaparecem; fonte anterior elegível retorna. Duplicar/exportar/importar Aliado não concede suporte só por copiar flags de apresentação.
12. Recarregar e reiniciar o mundo com GM: vínculo, espera, IDs e prioridade persistem, sem duplicação. Retirar todos os GMs: novo pedido deve falhar antes de mudar o suporte; reconectar GM e reconciliar.
13. Regressão da PoC: criação, edição, Items, arraste e persistência. Regressão de Agente/Ameaça: fichas/preparação normais; habilidade comum e ritual mantêm o workflow anterior.

Probes de permissão, **somente na sessão de jogador no mundo de teste**:

```javascript
// Native v14.369 transport: bypasses client permission checks for this test.
// No caller identity is supplied; the server uses the authenticated session.
const probeWrite = (type, id, path, value) =>
  foundry.helpers.SocketInterface.dispatch("modifyDocument", {
    type, action: "update",
    operation: { updates: [{ _id: id, [path]: value }],
      diff: true, recursive: true, render: false }
  });
// Positive control: must succeed, proving the request format is valid.
await probeWrite("User", game.user.id,
  "flags.paranormal-toolkit.allyPermissionProbe", true);
// Run individually: both must reject with an authorization error.
await probeWrite("User", "GM_USER_ID",
  "flags.paranormal-toolkit.allyStore", "JournalEntry.allyPermissionProbe");
await probeWrite("JournalEntry", "JOURNAL_ID",
  "flags.paranormal-toolkit.allyPermissionProbe", true);
// Remove the harmless positive-control flag from this player's own User.
await game.user.unsetFlag("paranormal-toolkit", "allyPermissionProbe");
```

Checagem de Defesa salva antes/depois, no console do GM:

```javascript
const testAgent = game.actors.get("JOAO_ACTOR_ID");
console.log({
  savedDefense: testAgent.toObject(true).system.defense.value,
  preparedDefense: testAgent.system.defense.value,
  preparedDodge: testAgent.system.defense.dodge
});
```

Registrar: versões de Foundry/Ordem, caso que falhou, valores antes/depois, estado mostrado, número de efeitos e erro do console. Não marcar aprovação parcial como gate completo.

### Limitações e próxima etapa

- Smoke deste incremento será executado pelo usuário; nenhum resultado real de efeitos, combate ou multiplayer é declarado aprovado nesta implementação.
- Exclusões/edições nativas realizadas enquanto todos os GMs estão ausentes precisam do próximo ready/reconciliação de GM para limpar projeções. O módulo não altera permissões globais nem substitui o backend do Foundry.
- A eleição/fila e IDs persistidos não constituem uma transação atômica do servidor. Testar desconexão e troca do executor; divergência de referências ou falha deve ser revisada pelo GM.
- Falha na remoção bloqueia concessão substituta. Falha de criação preserva a identidade registrada para inspeção/reconciliação; erro aparece no diagnóstico.
- Schema operacional corrompido bloqueia execução e preserva os dados. A ficha de perfil continua disponível quando só o registro operacional está inválido.
- Desativar o módulo não remove Active Effects persistidos. Desativar suportes e conferir a limpeza antes de retirar o módulo do mundo.
- A migração antiga de Ordem descrita acima permanece uma limitação; não há campos ou metadados artificiais para escondê-la.
- Comandos concedidos, custos PE/PD, piloto, condições, modificações e +1d20 **não foram implementados**. O gate de +1d20 continua hipótese; nenhum hook ou atributo foi modificado.
- Recomendação: aprovar primeiro este smoke completo. Depois avançar ao incremento 2; release e v0.43.0 continuam decisão separada.

### Validação automatizada do incremento 1 — 2026-10-14

- `npm run check`: aprovado — typecheck, **519 testes em 78 arquivos**, build com 249 módulos.
- A suite inclui os cinco testes de referência Ordem, habilitados por `PARANORMAL_TOOLKIT_ORDEM_REFERENCE`. Destes, dois esperam a falha de migração antiga; não representam compatibilidade com esses snapshots.
- 60 testes adicionais do incremento cobrem transições, definições/precedência, serviços, recovery, autoridade/adapters, hooks, routing e renderer. Operações de Documents, servidor, diálogos e conexões são substituídas nesses testes.
- Node.js v24.19.0; Vitest 3.2.6; Vite 7.3.6. Inspeção de fonte Foundry 14.369 e Ordem 8.0.2; **smoke real deste incremento pendente**.
- `git diff --check`: aprovado. `dist` continua ignorado; o build local deve ser instalado inteiro para o smoke.
- Metadata de versão preservada em 0.42.0. Nenhuma tag, release ou alteração no checkout principal/sistema.
