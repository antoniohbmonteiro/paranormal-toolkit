# Aliados — Actor, suporte e concessões

## Resultado e limites

A PoC original adicionou o subtipo `paranormal-toolkit.ally`, um perfil mínimo e uma ficha baseada diretamente em ActorSheetV2. O smoke de criação, edição, habilidades, arraste e persistência foi aprovado pelo usuário no Foundry v14. Os passivos usam Active Effects nativos em Items ability. A candidata **0.44.0** acrescenta P1/P2 (concessões e execução autorizada), P3 (destino opcional no piloto) e a ficha final de três abas. A implementação está em `D:/dev/paranormal-toolkit`, branch `feature/allies`, sem worktree adicional, tag, release, commit ou push nesta etapa. A seção final de UI/UX substitui os controles e roteiros de botões das etapas anteriores.

**Decisão funcional vigente:** suporte passivo automático pelo proprietário, sem aprovação de vínculo/benefícios nem registro de validação manual do ambiente. O GM executor continua automático e recebe avisos privados. As seções anteriores à seção final “Suporte automático sem aprovação” registram evidências históricas; seus gates e roteiros de aprovação foram substituídos pelo roteiro final.

**Fonte de verdade vigente:** os Active Effects identificados como suporte no Item nativo ability. A criação pelo editor Toolkit já inclui essa identificação, sem seleção adicional. A seção final “Efeitos passivos nativos” substitui o editor/configuração `allyAbility` v1 e os roteiros anteriores que o utilizavam.

A ficha permite editar nome, caminho de imagem, descrição e identificação de drone; criar, abrir, importar por arraste e remover Items nativos `ability`. A importação usa a API nativa de ActorSheetV2. Outros tipos de Item, Actors, folders e Active Effects não são aceitos pelo arraste desta ficha. Remover uma habilidade pede confirmação e revalida a permissão depois dela.

A ficha oferece atalho de uso exclusivamente para uma concessão autorizada e sincronizada no destinatário. A fonte original continua sem execução pelo Toolkit; sua ficha nativa permanece disponível para edição. O comportamento vigente está na seção final de UI/UX.

Na execução original da PoC, o agente não executou testes no servidor Foundry. Posteriormente, o usuário informou aprovação do smoke citado acima. A preparação e migração verificadas abaixo utilizam fontes reais do sistema com substitutos das dependências Foundry; isso **não comprova** o ciclo real de preparação, arraste, formulário, persistência, ownership no servidor ou migração global do mundo.

**Recomendação atual: concluir o smoke final de ficha/P3 multiplayer no Foundry real antes de publicar release.** O usuário informou aprovação do fluxo principal P1/P2. Não houve herança de AgentData ou alteração global de OrdemActor. Os registros abaixo de etapas anteriores são históricos; suas recomendações de escopo e versões não substituem a seção final vigente.

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

> Histórico da primeira implementação. Os gates de aprovação e validação descritos abaixo foram removidos pela decisão funcional documentada na seção final.

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

## Correção do recebimento de solicitações — 2026-10-14

### Causa e evidência

A hipótese de update diferencial foi reproduzida com as fontes instaladas do Foundry **14.369**. `Document.setFlag()` envia o objeto completo em `flags.paranormal-toolkit.allyRequest`. `ClientDatabaseBackend` usa o diff de `updateSource()` no envio e novamente no recebimento; `ObjectField._updateDiff()` omite campos iguais à fonte. O `updateActor` é chamado depois de atualizar o Actor, com essas diferenças.

Exemplo reproduzido: flag antiga contém `{id: "request-01", revision: 0, action: "assign", beneficiaryId: "joao"}`; nova solicitação mantém os campos e muda apenas `id`. O hook recebe:

```json
{"flags":{"paranormal-toolkit":{"allyRequest":{"id":"request-02"}}},"_id":"iris"}
```

Nesse momento, `actor.getFlag("paranormal-toolkit", "allyRequest")` já retorna a solicitação completa. O handler anterior passava o delta para `readAllyRequest()`, que corretamente rejeitava a ausência de `revision`/ação/beneficiário. O defeito era confundir delta com solicitação completa, não o schema nem o tipo agent.

`tests/reference/foundry-ally-request-diff.test.ts` executa os métodos reais de setFlag/update, o cálculo nativo de diferenças de ObjectField e o backend cliente que dispara o hook. Schema/coleção e socket/servidor são substituídos. Não há Foundry vendorizado, escrita na instalação ou alteração do mundo. **Essa reprodução confirma o caminho defeituoso do código; a validação no seu runtime/mundo permanece pendente.**

### Correção e arquivos

- `src/adapters/foundry/foundry-ally-request-adapter.ts`: detecta novo ID no delta em formatos aninhados, pontilhados ou mistos; lê imediatamente a flag completa do Actor; aplica o mesmo reader estrito e confere nonce/campos presentes contra o snapshot.
- `src/features/allies/ally-lifecycle-hooks.ts`: somente o GM executor captura/processa; deduplica IDs por Actor durante sua sessão. O userId continua vindo do hook, nunca da flag.
- `src/types/foundry-shim.d.ts`: tipa somente lastModifiedBy, metadado nativo utilizado para rejeitar snapshot sobrescrito por outro autor antes do callback.
- `tests/unit/features/allies/ally-lifecycle-hooks.test.ts`: 25 casos, incluindo fluxo com serviço/ambiente reais e persistência/Documents substituídos.
- `tests/reference/foundry-ally-request-diff.test.ts`: dois casos contra fontes nativas.
- Este relatório: evidência, limites e roteiro.

Sem mudança em `readAllyRequest()`, schema persistido, versão 0.42.0, UI, sistema Ordem, benefícios ou cobrança. Atualização sem mudança de nonce não é solicitação nova: nome, descrição, espelho, remoção da flag e edição/replay do mesmo ID não disparam execução. Snapshot com outro nonce/autor ou campos inconsistentes é recusado. Revision, ownership, beneficiário persistente, eleição, vínculo e escopo continuam validados pelo serviço.

A captura é síncrona e produz dados independentes do Actor antes de entrar na fila. IDs vistos só filtram callbacks repetidos na sessão do executor; após reload, solicitações antigas continuam bloqueadas pela revisão canônica persistida. Ready/reconciliação não reapresentam flags antigas como pedidos.

Para reproduzir as fontes opcionais em PowerShell:

```powershell
$env:PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE = 'C:/Program Files/Foundry Virtual Tabletop/resources/app'
$env:PARANORMAL_TOOLKIT_ORDEM_REFERENCE = 'D:/dev/ordemparanormal_fvtt'
npm run check
```

Sem as variáveis, os testes correspondentes são ignorados explicitamente. Não presumir que um teste ignorado confirmou o comportamento nativo.

### Repetição do smoke deste fix

1. Disponibilizar **a pasta dist inteira** construída de `D:/dev/paranormal-toolkit` na instalação de teste e recarregar todos os clientes, especialmente o GM executor.
2. Usar um Aliado persistente e um Actor real de tipo agent do mundo. Clicar **Atribuir / trocar**. Deve registrar atribuição (GM) ou pedido de aprovação (jogador), sem “Solicitação de suporte inválida”.
3. Aguardar atualização do estado, aprovar quando necessário e repetir a atribuição ao mesmo beneficiário. O suporte não deve reiniciar nem duplicar efeitos. Repetir sem mudar o contexto também exercita diferenças que omitem campos iguais.
4. Editar nome/descrição e recarregar. Nenhuma atribuição/pedido antigo deve ser executado novamente.
5. Repetir com dois proprietários e dois GMs. O solicitante registrado precisa ser o usuário nativo da operação, mesmo se uma flag contiver um userId falso.
6. Confirmar que pedidos com revisão antiga, usuário sem ownership e beneficiário sintético/ausente continuam recusados. Usar IDs novos para esses testes; editar um pedido antigo sem mudar ID não é uma nova submissão.
7. O gate mecânico/multiplayer do incremento permanece vigente: esta correção não o aprova nem o remove.

Observação opcional, somente leitura, para capturar o formato **real do seu mundo** no console do GM executor:

```javascript
const allyUpdateProbe = Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (actor.type !== "paranormal-toolkit.ally") return;
  const prefix = "flags.paranormal-toolkit.allyRequest.";
  const flat = foundry.utils.flattenObject(changes);
  if (!Object.keys(flat).some(key => key.startsWith(prefix))) return;
  console.log("Ally request probe", {
    userId,
    changes: foundry.utils.deepClone(changes),
    fullRequest: foundry.utils.deepClone(actor.getFlag("paranormal-toolkit", "allyRequest"))
  });
});
// Remove the probe after testing.
Hooks.off("updateActor", allyUpdateProbe);
```

Executar o registro do probe antes dos cliques e a última linha separadamente depois. O callback não altera Documents. Informar build real, quem clicou, delta, flag completa e resultado; o bug só será considerado validado após esse smoke.

Validação automatizada desta correção: `npm run check` aprovado com **543 testes em 79 arquivos**, incluindo as sete verificações opcionais de Foundry/Ordem; `npm run build` separado aprovado (249 módulos); `git diff --check` aprovado, também conferindo o novo arquivo de referência. Node.js v24.19.0, Vitest 3.2.6 e Vite 7.3.6. Versões 0.42.0 preservadas. Resultado manual do mundo: **pendente do usuário**.

## Correção da origem do suporte e diagnóstico do DataModel — 2026-10-14

### Evidência e limites da investigação

- **Solicitação diferencial:** a causa reproduzida na seção anterior permanece confirmada. O reader estrito, a captura da flag completa e o userId nativo de `7e32732` foram preservados.
- **Token não vinculado:** `submitAllyRequest()` rejeitava qualquer `actor.isToken`, antes de resolver sua origem. Esta causa de “Aliado inválido” foi reproduzida. Na API pública instalada do Foundry 14.369, `Actor.token` retorna o TokenDocument e `TokenDocument.baseActor` retorna o Actor do mundo de `game.actors`. Um token vinculado já utiliza o Actor do mundo.
- **Íris persistente com o perfil informado:** não foi possível reproduzir a rejeição. O `AllyDataModel` atual, construído sobre TypeDataModel, DataModel, campos, validação e primitivas **nativos** do Foundry 14.369, aceita schemaVersion 1, descrição vazia e isDrone true. Tanto as propriedades inicializadas como `toObject(true)` passam no reader. Não há evidência de colisão de schemaVersion nem necessidade de alterar o schema.
- **Build divergente:** a junction `C:/Users/Antonio/AppData/Local/FoundryVTT/Data/modules/paranormal-toolkit` aponta para `C:/Users/Antonio/.codex/worktrees/ally-actor-poc/paranormal-toolkit`, enquanto esta correção está em `D:/dev/paranormal-toolkit`, branch `feature/allies`, baseada em `7e32732`. A entrada instalada importa `main-9M2iSYp7.js`; o build anterior deste checkout importava `main-BjhG87lE.js`. O sourcemap instalado contém o handler anterior e **não contém `readUpdatedAllyRequest`**. Portanto, a instalação consultada não contém sequer o fix diferencial. Isso confirma a divergência de deployment, mas não prova qual instância produziu a rejeição do Actor persistente no smoke anterior. A consulta HTTP local foi recusada por ausência de servidor escutando na porta configurada 30000; o cache/browser daquele smoke não foi observado.

### Implementação

`src/adapters/foundry/foundry-ally-actor-resolver.ts` centraliza dois comportamentos:

1. Serializar o system DataModel pela API pública `toObject(true)` e validar com o mesmo `readAllyProfile` estrito. Objetos simples continuam passando pelo mesmo contrato. Não converter campos inválidos, alterar defaults ou preencher dados artificialmente. Falha de serialização bloqueia o perfil. Isso evita depender de propriedades preparadas sem assumir que elas causaram o erro relatado.
2. Resolver a origem: Actor persistente → instância atual da coleção; token sintético → `actor.token.baseActor` → instância atual da coleção. Exigir subtipo, identidade UUID quando disponível, Actor não sintético presente no mundo e perfil persistido válido. Nunca usar apenas o id sintético como fallback quando o original estiver ausente.

Solicitação, apresentação e revisão do GM usam esse Actor original. Solicitar exige update permission tanto na origem como no original. Revision, beneficiário, aprovação e fingerprint vêm do mesmo fluxo existente; os benefícios continuam vindo dos Items do Actor original. Nenhuma flag de suporte é gravada no token. Edições nativas de perfil/Items em um token sintético continuam sendo edições daquele token; não se tornam fontes mecânicas autorizadas do suporte do Actor original.

O hook somente processa solicitações de Actors persistentes que sejam a instância atual de `game.actors`. Uma flag copiada/adulterada no Actor sintético não é encaminhada ao original. Reconciliação e validações protegidas continuam existentes; beneficiários sintéticos permanecem recusados.

Quando a origem é recusada, o console registra URL do bundle, UUID/tipo/isToken da origem, baseActor, Actor atual da coleção, nome da classe do model, formato dos campos preparados/serializados e validade do perfil original. Não registra conteúdo da descrição, saldos ou payloads de autorização. A apresentação informa ausência do original ou perfil inválido. Sem redesign: o renderer apenas deixa os controles de suporte dependerem da disponibilidade do original, independentemente da validade do perfil local do token.

Arquivos de produção: novo resolver; `foundry-ally-request-adapter.ts`; `ally-lifecycle-hooks.ts`; `ally-sheet.ts`; renderer `src/ui/components/ally/ally-sheet.ts`; `foundry-shim.d.ts` (baseActor público). Nenhuma alteração no AllyDataModel, domínio, sistema Ordem ou versão 0.42.0.

### Testes

- `tests/unit/features/allies/ally-actor-resolution.test.ts`: 14 regressões para origem persistente, token vinculado/não vinculado, ausência/tipo/UUID inválidos do original, instância antiga da ficha, perfis inválidos, erro de serialização, permissions em ambas as origens e mesma revision/estado entre múltiplos tokens. Documents substituídos.
- `tests/unit/features/allies/ally-lifecycle-hooks.test.ts`: duas regressões novas; ignora solicitações sintéticas/instâncias antigas e exercita token → solicitação no original → delta → serviço real → vínculo único, alternando com o diretório. Preserva os casos de identidade falsa, replay, revisão antiga, ownership e beneficiário persistente. Persistência/hook substituídos.
- `tests/reference/foundry-ally-data-model.test.ts`, com loader em `tests/reference/helpers/foundry-data-model.ts`: quatro verificações com o código real do AllyDataModel e a construção/validação/serialização nativas. Defaults, edição com updateSource, diferença simulada entre preparação e fonte, e fonte corrompida. Model sem parent Document; coleções não utilizadas são substituídas. A divergência de propriedades é criada explicitamente no teste; não é apresentada como ocorrência confirmada no mundo.
- Ajustados dois fixtures de `ally-foundry-adapters.test.ts` para representar Actors registrados no mundo.
- `tests/unit/features/allies/ally-actor.test.ts`: três regressões do handler real do botão Atribuir / trocar, acionado na ficha do diretório, vinculada e sintética; o ActorSheetV2/DOM são substituídos.

`npm run check`: **566 testes aprovados em 81 arquivos**, incluindo os 11 casos de referência Foundry/Ordem, usando as variáveis de referência documentadas anteriormente. Node v24.19.0, Vitest 3.2.6, Vite 7.3.6; 250 módulos no build. Testes nativos são opcionais sem as variáveis e não substituem persistência/multiplayer no servidor real.

`npm run build` separado e `git diff --check` aprovados. Conferidos também os novos arquivos por diff sem index, sem erros de whitespace. Os sourcemaps do build final correspondem ao código atual em 248 entradas de src, normalizando somente finais de linha. Arquivos gerados continuam ignorados pelo Git.

### Smoke do usuário

1. Disponibilizar **a pasta dist inteira deste checkout** na instalação de teste, ou ajustar a instalação para apontar para `D:/dev/paranormal-toolkit`. Não basta construir aqui enquanto a junction continua servindo o dist do worktree antigo. Nenhuma junction ou arquivo do worktree antigo foi alterado nesta tarefa.
2. Recarregar todos os clientes. Este build importa `main-DOqL1aQG.js` em `dist/main.js`. No console, conferir a URL realmente carregada:

   ```javascript
   performance.getEntriesByType("resource")
     .map(entry => entry.name)
     .filter(url => url.includes("/modules/paranormal-toolkit/dist/"));
   ```

   Confirmar o chunk atual, não apenas main.js ou versão 0.42.0; a versão permanece igual entre builds. Se persistir algum erro, o diagnóstico também imprime `bundle`.
3. No diretório, abrir Íris (`Actor.pc26OJV8AOmi6WS6`), selecionar um agent persistente e atribuir. Aprovar como GM quando necessário; ativar e desativar.
4. Colocar um token vinculado e dois não vinculados de Íris. Abrir cada ficha e alternar atribuição/ativação/desativação. Todas devem apresentar o mesmo beneficiário/estado/revision após reabrir; somente a flag do Actor original recebe a solicitação.
5. Repetir atribuição ao mesmo beneficiário para exercitar o delta parcial; editar nome/descrição e confirmar que isso não gera solicitações. Conferir vínculo único e ausência de efeitos duplicados, inclusive após reload/reconciliação.
6. Em cópia descartável, testar token cujo original esteja ausente/inválido; os controles devem ficar indisponíveis e nenhuma concessão deve aparecer. Testar usuário que controla o token, mas não pode atualizar o original: deve receber “Sem permissão”. Beneficiário sintético permanece proibido.
7. Repetir com dois jogadores/dois GMs e os gates mecânicos anteriores. Se o Actor persistente ainda falhar, enviar o diagnóstico completo e comparar a instância da ficha com a coleção:

   ```javascript
   const ally = game.actors.get("pc26OJV8AOmi6WS6");
   console.log({
     uuid: ally.uuid, type: ally.type, isToken: ally.isToken,
     modelClass: ally.system.constructor.name,
     registeredModel: ally.system instanceof CONFIG.Actor.dataModels[ally.type],
     instanceProfile: { schemaVersion: ally.system.schemaVersion,
       descriptionType: typeof ally.system.description, isDroneType: typeof ally.system.isDrone },
     modelSource: ally.system.toObject(true), actorSource: ally.toObject(true).system
   });
   ```

O snippet é somente leitura. A causa específica de uma eventual rejeição da Íris persistente permanece pendente dessa observação; os dados informados passam nos testes nativos. **A correção não será considerada validada no Foundry até o smoke do usuário.**

Após a entrega, o usuário informou que o erro ainda ocorre. A validação manual permanece reprovada; este commit registra a resolução de origem e os diagnósticos, sem declarar o bug resolvido. O novo stack e a identidade do bundle carregado ainda não foram informados.

## Suporte automático sem aprovação — 2026-10-14

### Fluxo vigente

- O proprietário do Aliado solicita atribuição, ativação, desativação e troca. Não há botão de aprovação nem de validação do ambiente.
- A atribuição inicial seleciona imediatamente o beneficiário; clicar Ativar cria os efeitos automaticamente. Suporte já ativo permanece ativo ao iniciar combate. Trocar fora de combate remove os efeitos anteriores e concede os novos imediatamente; em combate, a retirada é imediata e a concessão aguarda a próxima rodada. A mesma referência não reinicia o suporte ou muda prioridade; desativar/reativar não elimina uma espera de rodada existente.
- Editar os benefícios da habilidade original provoca reconciliação automática, preservando identidade e precedência da fonte. Apenas o benefício vencedor por chave mecânica é aplicado; o anterior retorna quando o vencedor deixa de ser elegível.
- Dados continuam vindo das habilidades do Actor persistente original, inclusive nas solicitações pela ficha de tokens vinculados/não vinculados. Beneficiários continuam limitados a agentes persistentes do mundo.
- Ownership, nonce, revision, usuário nativo do hook, eleição do executor e whitelist de benefícios permanecem validados. Flags de solicitação não fornecem mudanças arbitrárias de Active Effects. O Foundry autoriza cada escrita; nenhum bypass de permissões foi introduzido.
- Um GM executor conectado continua necessário para o registro protegido e as escritas entre proprietários distintos. Sem GM, a solicitação é recusada antes de atualizar a flag. Nenhuma confirmação manual é necessária; todos os GMs podem desativar suporte pela ficha.

### Migração do registro protegido

O Journal operacional permanece protegido e ancorado nas flags dos GMs. `AllyLedger` passa de v1 para **v2**; o perfil do Actor continua v1 e os metadados do módulo permanecem **0.42.0**. O reader valida v1 antes da conversão, preservando beneficiaryId, estado, espera de combate, revision, nextSequence, orders e managed effect IDs. Approval, pending administrativo e validatedRuntime não integram o novo contrato.

Uma solicitação antiga aguardando aprovação não equivale a vínculo efetivado e não é executada automaticamente durante a migração: o usuário deve solicitar novamente. O vínculo já efetivado continua intacto. Estado `pending` por espera de combate continua válido.

O primeiro processamento/reconciliação com links inicializa o baseline de notificações e persiste v2. Um registro v1 vazio é interpretado como v2 e gravado na próxima operação. A flag é atualizada em uma única operação; `foundry.data.operators.ForcedDeletion` remove validatedRuntime, sem apagar o registro e recriá-lo. Arrays de links são substituídos pelo contrato novo, preservando os valores efetivos. Flags antigas de apresentação também são retiradas com o operador v14; campos de apresentação adicionais não disparam escritas repetidas.

Registros corrompidos ou de versão desconhecida bloqueiam execução e permanecem intactos. Efeitos existentes que já correspondem ao desejo canônico preservam seus IDs; migração não os recria apenas para mudar o contrato.

### Avisos e controle manual

O executor envia uma mensagem privada aos GMs por Aliado que mudou efetivamente, agregando eventos: ativação, desativação, mudança de beneficiário, alteração dos benefícios aplicados e conclusão de espera de combate. Mostra Aliado, beneficiário anterior/atual e Defesa anterior/atual. Nomes são escapados e não há botões ou comandos no aviso. Uma atribuição inicial e uma ativação posterior são duas operações distintas e podem gerar dois avisos.

O baseline protegido contém somente estado e benefícios efetivamente projetados. É atualizado depois de a reconciliação terminar e persistido antes de publicar no chat. Reconciliações iguais, revisões sem alteração funcional, reload e inicialização de baseline legado não geram avisos. Falhas mecânicas não anunciam sucesso; recuperação concluída anuncia uma vez. Falha de chat é registrada no console, preserva os efeitos e não é repetida automaticamente. Os avisos são de melhor esforço; não há outbox, auditoria ou transação distribuída.

Quando **um GM remove manualmente** um efeito registrado, o hook usa o userId nativo e os IDs protegidos do Actor/efeito; a flag de origem do efeito sozinha não autoriza supressão. A fonte daquele benefício fica suprimida no link. Reconciliar, editar o valor e recarregar não a recriam. Atribuir o mesmo beneficiário ou clicar Ativar enquanto já ativo não remove a supressão. Desativar e ativar novamente, ou trocar realmente de beneficiário, inicia um novo contexto e limpa a supressão. Não há veto permanente.

Outra fonte elegível pode retornar depois de suprimir o vencedor, conforme a regra de substituição aprovada. Para retirar todo o suporte de um Aliado, o GM usa Desativar. Exclusões do próprio reconciliador carregam `allyReconciliation` e não criam supressões; uma remoção por jogador não é tratada como decisão manual do GM e pode ser reparada pelo reconciliador.

### Arquivos e validação

| Arquivos | Alteração |
|---|---|
| `src/features/allies/ally-support-service.ts` | Operações imediatas; reconciliação sem gate; supressão por fonte e snapshots de mudanças. |
| `src/features/allies/ally-operation-authority.ts` | Somente assign/activate/deactivate/reconcile; mantém autorização e parser estrito. |
| `src/features/allies/ally-support-notifications.ts` (novo) | Contrato serializável e classificação pura de mudanças. |
| `src/adapters/foundry/foundry-ally-store.ts` | Leitura v1/v2, migração e persistência protegida. |
| `src/adapters/foundry/foundry-ally-request-adapter.ts` | Solicitações sem review/scope; apresentação limpa e envio pelo executor. |
| `src/adapters/foundry/foundry-ally-notifications.ts` (novo) | Chat privado aos GMs, com nomes escapados e resumo de efeitos. |
| `src/features/allies/ally-lifecycle-hooks.ts` | Remoção manual de efeito encaminhada pela identidade nativa. |
| `src/applications/ally-sheet.ts`, `src/ui/components/ally/ally-sheet.ts` | Retirada de ações/botões/mensagens administrativos; interface mínima preservada. |
| `src/types/foundry-shim.d.ts` | Operador público ForcedDeletion v14. |
| `tests/unit/features/allies/ally-support-service.test.ts` | Ativação/troca automática, edição, remoção, permissões, falhas, avisos, supressão e reload. |
| `tests/unit/features/allies/ally-ledger-migration.test.ts` (novo) | Vínculos/esperas/IDs preservados; pedidos antigos não executados; corrupção recusada. |
| `tests/unit/features/allies/ally-notifications.test.ts` (novo) | Destinatários GM, conteúdo escapado, resumo e eleição. |
| `tests/unit/features/allies/ally-foundry-adapters.test.ts`, `ally-lifecycle-hooks.test.ts`, `tests/ui/components/ally/ally-sheet.test.ts` | Migração de flags, hook nativo, solicitação sem aprovação e ausência dos gates na UI. |
| `tests/reference/foundry-ally-request-diff.test.ts` | Operadores/limpeza nativos e transporte JSON; remoção atômica do gate sem perder IDs. Socket/servidor continuam substituídos. |
| `README.md`, este relatório | Fluxo vigente e roteiro atual. |

`ally-reconciliation-service.ts` foi inspecionado e reutilizado sem alteração: conserva diff, retirada antes da concessão, IDs persistidos antes de criar, recuperação e bloqueio de substituição se a retirada falhar. Não houve alteração no sistema Ordem, em workflows de comandos/recursos, CSS ou versão.

Validação: `npm run check` aprovado com **591 testes em 83 arquivos**, incluindo fontes nativas Foundry 14.369 e Ordem 8.0.2; Node v24.19.0, Vitest 3.2.6, Vite 7.3.6. `npm run build` separado e `git diff --check` aprovados. Build final: 252 módulos, entrada importando `main-Copc4sf2.js`; dist continua ignorado pelo Git. Os testes de domínio/portas utilizam Documents/persistência substituídos; as referências executam fontes reais, com dependências explicitamente substituídas. Não comprovam execução e ownership no servidor do seu mundo. Smoke desta decisão funcional: pendente do usuário.

### Smoke curto vigente

1. Construir com `npm run build` em `D:/dev/paranormal-toolkit`; conferir que a instalação aponta para essa pasta, como foi confirmado nesta tarefa. Recarregar todos os clientes. Conferir o chunk importado pelo `dist/main.js` atual; os nomes de chunks nas seções históricas pertencem a builds anteriores.
2. Como proprietário de Íris, configurar Defesa +5, escolher João (agent persistente), clicar Atribuir / trocar e Ativar. Com GM conectado, o efeito deve aparecer automaticamente; não deve existir aprovação/validação administrativa na ficha. Somente GMs recebem avisos discretos.
3. Desativar e conferir retirada sem mudar a Defesa salva. Reativar, editar +5 para +10 e conferir ajuste automático, um efeito e um aviso de mudança. Reconciliar várias vezes/recarregar: IDs e quantidade permanecem, sem novos avisos.
4. Trocar para Rafa fora de combate: retirar de João e aplicar em Rafa. Em combate, trocar novamente: retirar imediatamente, manter espera e aplicar somente na próxima rodada, com aviso de conclusão. Repetir a mesma referência não reinicia suporte.
5. Como GM, remover o efeito gerenciado manualmente. Reconciliar/recarregar/editar o valor: aquela fonte permanece suprimida. Desativar e ativar novamente restaura o benefício; conferir fallback com dois Aliados se aplicável.
6. Repetir pela ficha de um token não vinculado e com dois jogadores de proprietários distintos/dois GMs. Conferir um vínculo original e um executor; usuário sem ownership e revisão obsoleta continuam recusados. Em cópia de mundo com registro v1/efeitos existentes, confirmar migração sem recriação dos efeitos inalterados e sem executar aprovação antiga.

## Efeitos passivos nativos — 0.43.0 (vigente)

Esta seção substitui o editor e o modelo mecânico de Defesa das etapas históricas acima. O Actor continua sendo `paranormal-toolkit.ally`, com o mesmo perfil v1, e a habilidade continua sendo um Item nativo `ability`. Não existem novos tipos de Item, comandos ativos, cobrança de recursos, aprimoramentos automáticos ou conteúdo de livros nesta entrega.

### Uso do editor

No diretório, criar uma habilidade normal, abrir sua ficha do Ordem e acessar **Benefícios passivos — Toolkit** no menu de controles do cabeçalho. Na ficha do Aliado, o botão de benefícios da habilidade abre exatamente a mesma aplicação. A ficha nativa e seus campos permanecem disponíveis.

**Adicionar efeito → Bônus de Defesa** recebe nome e valor numérico finito, incluindo +5, +7 ou +10, e cria um Active Effect nativo. **Personalizado** cria um efeito e abre sua ficha nativa; permite várias mudanças e propriedades fora dos presets. Ambos gravam `allyPassive: {version: 1}` na própria criação, sem atualização intermediária ou confirmação de participação. Editar na ficha nativa preserva essa identificação. O editor lista apenas os efeitos identificados como suporte, incluindo os previamente selecionados. Cada efeito oferece somente **Editar efeito nativo** e **Excluir efeito**, com confirmação para excluir o original do Item. Não existem ações Usar/Retirar do suporte. As operações conferem `Item.canUserModify(user, "update")`, além da autorização normal do Foundry; o serviço também rejeita editar/excluir efeitos não identificados como suporte.

Arrastar a habilidade para o Aliado copia seus efeitos incorporados pelo fluxo nativo. A cópia pode ser editada sem modificar o Item do diretório. A ficha aberta por token vinculado ou não vinculado resolve o Actor persistente original também para edição das habilidades e arraste, sem criar suporte ou fonte mecânica por token.

### Fonte, projeção e concorrência

Os dados mecânicos são os Active Effects incorporados ao Item. `flags.paranormal-toolkit.allyPassive = {version: 1}` apenas identifica uma fonte; não mantém uma segunda definição editável. Benefícios usam `transfer: false`, reforçado nos hooks públicos de criação/atualização e cópia de Item. Efeitos antigos não selecionados conservam seu comportamento nativo e não são marcados, ativados ou apagados por esta mudança; continuam acessíveis na ficha nativa. Desabilitar um benefício suspende sua projeção sem excluir a fonte; reabilitar permite aplicá-lo novamente, respeitando precedência e supressão manual. Excluir a fonte confirmada dispara a retirada automática da projeção. Editar uma fonte elegível atualiza a projeção no mesmo ID.

O editor entra pelo hook público `getHeaderControlsItemSheetV2`, usando `onClick`. A integração não substitui a ficha do Ordem nem inspeciona seu HTML. Foram conferidas as implementações instaladas de ItemSheetV2/DocumentSheetV2, do despacho de controles de ApplicationV2, do Active Effect e da ficha de habilidade do Ordem.

O domínio recebe somente templates serializáveis lidos dos efeitos; o adapter projeta as mudanças nativas em `system.changes`, com `type`, `phase`, `priority` e valores tipados. O preset de Defesa utiliza `system.defense.value`, adição na fase inicial. Cada projeção tem `origin` apontando para o UUID do **Actor Aliado persistente**, além de metadados próprios com Aliado, Item, efeito de origem e identidade da fonte. Não se copiam flags arbitrárias de terceiros para executar mecânicas.

As disputas são resolvidas por beneficiário, caminho da mudança, fase e tipo. A última fonte que entrou no suporte vence para essa chave, conforme a sequência protegida já persistida. Alterar valor ou reconciliar não muda a precedência. Mudanças independentes do mesmo efeito continuam aplicadas; mudanças repetidas pertencentes ao próprio efeito vencedor são preservadas. Status usam a identidade do status como chave. Retirar a fonte vencedora permite retornar à anterior elegível. A projeção pode, portanto, conter um subconjunto das mudanças do efeito de origem.

Continuam vigentes ownership do Aliado, revisão, identidade nativa do hook, rejeição de replay, executor GM eleito e registro protegido. Não há aprovação manual. As notificações usam alterações mecânicas efetivas, preservando o formato de Defesa anterior e acrescentando resumo para efeitos personalizados. Reconciliar sem mudança não gera mensagens. A remoção manual pelo GM de uma projeção registrada conserva a política de supressão; excluir um efeito de origem do Item apenas dispara a reconciliação correspondente.

### Causa confirmada da recriação nos turnos

No Foundry **14.369**, `BaseActiveEffect.migrateData()` converte o antigo campo raiz `changes` para `system.changes`. Também converte valores numéricos textuais, como `"5"`, para `5`. O builder anterior enviava o formato antigo com valor textual, e `matches()` exigia igualdade com esse texto. O documento nativo continha o número; a comparação falhava em cada reconciliação disparada pelo combate e o reconciliador removia/criava o efeito.

A comparação atual usa `effect.toObject(true)` normalizado, evitando os dados preparados que o próprio sistema pode modificar ao avaliar fórmulas. São comparados template configurado, origem e metadados. Dados derivados de preparação, referências de Documents e início de duração não fazem parte dessa comparação. Uma edição segura atualiza a mesma projeção por `updateEmbeddedDocuments`, usando `ForcedReplacement` público para substituir seu `system` sem deixar campos antigos. A identidade é preservada. Cinco reconciliações sem alteração geram zero criações, atualizações ou exclusões de Active Effects. O hook `updateCombat` permanece para as esperas de rodada; a configuração de exibição nativa não foi ocultada para mascarar popups.

### Migração e recuperação

Um serviço separado, executado pelo GM durante a preparação das fontes e a abertura do editor, converte benefícios `allyAbility` v1 para efeitos nativos. O valor e a identidade lógica anteriores são preservados. IDs de efeitos são determinísticos; uma tentativa interrompida pode continuar sem duplicar fontes. `legacyId` conserva a identidade usada por ordem, vínculos e supressão. Somente após confirmar as criações é gravado `allyEffectsMigration: {version: 1}`.

A flag antiga, incluindo campos desconhecidos, permanece intacta como dado legado. Depois do marcador, somente os efeitos nativos alimentam a aplicação. Versões desconhecidas, colisões ou efeitos divergentes não são convertidos silenciosamente. A leitura do registro aceita v1/v2 e normaliza para **ledger v3**, preservando estado, revision, beneficiário, espera de combate, ordens, IDs gerenciados, supressões e baseline de notificações. Projeções antigas são atualizadas no mesmo ID, sem exclusão apenas para migrar o contrato.

Uma fonte ativa inválida interrompe conservadoramente a reconciliação mecânica, publica diagnóstico e preserva projeções existentes até correção ou desativação. Isso pode pausar também atualizações de outros suportes enquanto houver fonte inválida; evita retirar bônus ou substituir dados com configuração incompreendida. A migração não altera o repositório do sistema Ordem.

### Arquivos desta entrega

| Área | Arquivos |
|---|---|
| Domínio | `src/core/allies/ally-passive-effect.ts` (novo), `ally-definition.ts`, `ally-benefit-resolver.ts` |
| Configuração | `src/features/allies/config/ally-ability-config.ts`; `src/features/allies/ally-effect-config-service.ts`, `ally-effect-migration-service.ts`, `ally-effect-sheet-integration.ts` (novos) |
| Aplicações | `src/applications/ally-ability-config-application.ts`, `ally-sheet.ts`; `src/ui/components/ally/ally-ability-config.ts` |
| Mecânica Ordem | `src/adapters/ordem/ordem-ally-effect-presets.ts` (novo), `ordem-ally-benefit-adapter.ts` |
| Operação | `src/features/allies/ally-support-service.ts`, `ally-reconciliation-service.ts`, `ally-lifecycle-hooks.ts`, `ally-support-notifications.ts` |
| Persistência/avisos | `src/adapters/foundry/foundry-ally-store.ts`, `foundry-ally-request-adapter.ts`, `foundry-ally-notifications.ts` |
| Registro/tipos | `src/main.ts`, `src/types/foundry-shim.d.ts`, `src/features/allies/ally-registration.ts`, `lang/pt-BR.json` |
| Testes novos | `tests/helpers/ally-effects.ts`, `tests/unit/features/allies/ally-native-effects.test.ts`, `ally-effect-sheet-integration.test.ts`, `tests/reference/foundry-ally-native-effects.test.ts` |
| Regressões atualizadas | `tests/core/allies/ally-benefit-resolver.test.ts`; testes `ally-actor`, `ally-foundry-adapters`, `ally-ledger-migration`, `ally-lifecycle-hooks`, `ally-support-service` em `tests/unit/features/allies`; `tests/ui/components/ally/ally-ability-config.test.ts`; `tests/reference/helpers/foundry-data-model.ts` |
| Versão/documentação | `module.json`, `package.json`, `package-lock.json`, `README.md`, este relatório |

### Evidências automatizadas e limites

`npm run check`: **621 testes aprovados em 86 arquivos**, typecheck e build aprovados, com as referências Foundry 14.369 e Ordem 8.0.2 habilitadas. Runtime: Node v24.19.0, Vitest 3.2.6 e Vite 7.3.6. O build processa 257 módulos; `dist/main.js` está atualizado, e `dist` continua ignorado pelo Git. Build separado e `git diff --check` também aprovados.

As regressões cobrem editor em Item independente e incorporado, permissões, presets configuráveis, efeito personalizado, marcação automática, cópia e edição independente, origem, aplicação, alteração +5 para +10 no mesmo ID, cinco passagens sem escritas, transições existentes, concorrência entre fontes, múltiplas mudanças, supressão e migração recuperável/idempotente. Os handlers reais de criação do editor são exercitados nos dois contextos, verificando a flag na própria operação de criação, abertura da ficha personalizada, ausência das ações de seleção e cancelamento/confirmação da exclusão. Um teste integrado com Documents substituídos cria Defesa +5 e Religião +6, copia para Íris, projeta em Mauro, edita, desabilita/reabilita e exclui a fonte, preservando efeitos antigos não marcados. Testes de referência executam a migração e os campos reais de Active Effect do Foundry e o caminho real `_onDropItem` de ActorSheetV2. Banco, servidor, interface e algumas dependências dos Documents são substituídos nesses testes; eles não comprovam persistência ou permissões no servidor de um mundo em execução.

Efeitos personalizados aceitam caminhos de dados genéricos, mas bloqueiam estruturas inválidas, metadados de autorização/identidade, caminhos internos/protótipos e substituição de funções do Actor. Uma chave desconhecida não passa a ser uma mecânica do Ordem por ter sido configurada: pode não produzir resultado. Tipos de efeito de outros módulos, fórmulas e durações temporárias precisam de smoke específico; não foi criada automação própria de duração, RD, comandos ou recursos. Smoke no Foundry desta entrega **pendente do usuário**.

### Smoke manual desta versão

Usar mundo de teste com um GM conectado e recarregar todos os clientes após o build em `D:/dev/paranormal-toolkit`.

1. Criar Item `ability` no diretório e abrir sua ficha nativa.
2. Pelo menu do cabeçalho, abrir **Benefícios passivos — Toolkit**.
3. Em **Adicionar efeito**, preencher nome e valor 5; usar **Bônus de Defesa**.
4. Abrir o efeito na ficha nativa, conferir mudança `system.defense.value`, tipo adição, fase inicial, valor 5 e transferência desativada.
5. Arrastar a habilidade para Íris e confirmar efeito e seleção preservados.
6. Abrir o mesmo editor pela habilidade incorporada e conferir os campos nativos da habilidade preservados.
7. Atribuir Mauro, um `agent` persistente; ativar o suporte.
8. Conferir Defesa +5, sem alterar a Defesa base salva e sem aplicar o efeito à própria Íris.
9. Na projeção de Mauro, conferir origem Íris e registrar seu ID.
10. Avançar cinco turnos sem mudanças: mesmo ID, sem remoção/adição, sem popups do Toolkit ou novos avisos de suporte.
11. Editar o efeito incorporado na Íris para +10: uma projeção, mesmo ID, benefício +10.
12. Abrir o Item original do diretório: ele continua +5.
13. Desativar: somente a projeção gerenciada desaparece. Reativar e trocar fora/dentro de combate, conferindo retirada imediata e espera até a próxima rodada quando aplicável.
14. Criar **Personalizado**, configurar adição +6 em `system.skills.religion.mod`, fase inicial, e conferir aplicação automática sem seleção adicional. Testar desabilitar/reabilitar pela ficha nativa e excluir pelo Toolkit, cancelando primeiro a confirmação: a fonte só deve ser excluída após confirmar e a projeção deve acompanhar. Testar múltiplas mudanças e precedência com outro Aliado; retirar o vencedor restaura o anterior. Conferir que efeitos antigos não selecionados continuam intactos na ficha nativa e fora do suporte.
15. Como GM, remover uma projeção; reconciliar e recarregar não devem recriá-la. Desativar/ativar inicia novo contexto. Repetir por token não vinculado e com proprietários distintos/dois GMs.
16. Em cópia descartável com benefícios legados, confirmar migração, valores e IDs de projeções preservados, sem duplicação após reload. Se houver configuração inválida, conferir diagnóstico e preservação dos dados.

## P1/P2 — candidata 0.44.0 (vigente)

### Concessões e roteamento

Todos os Items `ability` incorporados ao Aliado são concedidos ao beneficiário persistente enquanto o suporte está ativo, independentemente de ativação ou custo. A identidade usa Aliado/Item original e destinatário, nunca o nome. Renomear e editar atualiza o mesmo Item; não há execução na criação. Inativação, troca, exclusão de fonte ou Aliado retiram somente concessões registradas. A troca em combate retira imediatamente e concede ao novo beneficiário na rodada prevista. Uma exclusão pelo jogador é reconciliada; exclusão pelo GM suprime aquela concessão até desativação/reativação ou troca real. A supressão é independente dos passivos.

O ledger protegido migra de v1/v2/v3 para **v4**, preservando vínculos, revisões de suporte, ordens, projeções e supressões anteriores. Novos inventários não adotam Items por nome ou apenas por flag. Antes da criação, o GM reserva o ID no ledger e publica `allyGrantProtocol`/`allyGrantRouteIndex` nos Users GM ancorados no mesmo Journal. A entrada só sai do índice após exclusão confirmada. IDs reservados ocupados por documentos sem criação confirmada pelo GM são preservados com diagnóstico.

As duas integrações compartilham o mesmo `AllyItemUseGateway`. Ele reconhece a concessão pelo par Actor/Item do índice protegido e assume a mensagem nativa sincronamente antes de qualquer preparação normal. Flag removida não converte concessão em habilidade comum; flag copiada sem registro bloqueia o uso. Índice inconsistente exige recuperação pelo executor. Items normais mantêm seus settings e continuam funcionando sem GM quando o índice é válido. Items originais no Aliado mantêm o retorno já existente, sem execução pelo Toolkit.

O solicitante vem do hook nativo `updateActor`, com ownership atual, revisão/identidade da solicitação e origem conferidos; o payload não escolhe outro usuário. O executor não chama `Item.roll()` nem reemite o hook. Invoca os pontos preparados dos motores existentes usando controle interno não serializável. Cards e confirmações também retornam ao caminho autorizado, sem reentrada por `executePendingAutomation()`.

### Motores e efeitos nativos

`automation` válida tem precedência; configuração inválida não faz fallback. A automação usa apenas seus steps de recursos. O motor genérico preserva diálogo, NEX, PE/PD global e gasto manual. Ambos usam dados do beneficiário. Alvos são referências capturadas no uso; ações de dano/cura permanecem manuais pelo GM e usam resultados persistidos, inclusive após retirada do suporte, sem nova rolagem. Nenhum workflow de ritual foi substituído.

- Efeitos identificados por `allyPassive` não entram na concessão: continuam somente na projeção passiva.
- Efeitos base nativos com operações conhecidas, sem flags/handlers/implementações externas, preservam configuração, `transfer`, `disabled`, status e duração. Transferíveis participam da preparação nativa ao conceder; não transferíveis permanecem incorporados, sem aplicação inventada no uso.
- Qualquer efeito desconhecido preserva a origem, gera diagnóstico e bloqueia a execução. A concessão fica visível, sem copiar um subconjunto dos efeitos nativos como se fosse completo. Corrigir a origem reavalia automaticamente.
- IDs dos efeitos copiados são inventariados separadamente. Reconciliar sem mudanças não atualiza o Item nem reinicia início de duração. Colisões com efeitos não gerenciados são bloqueadas, preservando esses documentos. Efeitos adicionais na cópia bloqueiam o uso autorizado até conferência.

Não há regra de pilotagem, terceiro motor, controle de economia de ações, popup/card próprio de Aliados ou reformulação da ficha.

### Recibos, falhas e retenção

Admissão exige mensagem real do solicitante, criada há até dois minutos por `_stats.createdTime`, comparado com data Unix em milissegundos no executor. `game.time.serverTime` do v14 é uptime e não serve para essa comparação. O GM emite sequência monotônica; executar exige recibo já admitido. Uma execução nova intencional exige nova mensagem. Preparação expira em 15 minutos ou na troca de geração operacional.

| Estado | Gravação e recuperação |
|---|---|
| `prepared` | Antes do diálogo/confirmação; confirma uma vez ou cancela. |
| `running` | Antes da primeira mutação/rolagem; checkpoint antes de cada operação e resultado após confirmação. Não retoma automaticamente. |
| `resolved` | Resultados persistidos antes da publicação; recupera apenas publicação. |
| `completed` | Card e recibo protegidos verificados; ações históricas têm seu próprio estado. |
| `cancelled` / `failed` | Terminais; não repetem a execução. Falhas conhecidas sem escrita, como saldo insuficiente, não são tratadas como cobrança incerta. |
| `uncertain` | Operação possivelmente executada ou `running` abandonado; conferência manual, sem repetição ou estorno presumido. |

O executor verifica eleição e geração persistida antes das novas escritas. Perder e recuperar a liderança invalida o contexto anterior. A fila é compartilhada com suporte e ações históricas. Os recibos têm sequência própria e não invalidam a revisão de suporte apresentada ao proprietário. Uma falha de persistência interrompe o avanço; operações já possivelmente ocorridas nunca são compensadas automaticamente.

O GM assume autoria nativa da mensagem original na preparação; em `keep`, o resultado usa uma segunda mensagem de GM com ID reservado. Speaker, visibilidade e apresentação existentes são preservados. O card guarda o recibo completo, vinculado à própria mensagem e ledger. O adapter relê e verifica conteúdo e proteção antes de compactar. Copiar flags para outra mensagem não cria um recibo válido. Uma falha de publicação mantém o resultado recuperável, sem gastar ou rolar outra vez.

O ledger guarda até **256 recibos em andamento**. Após publicação verificada, remove o detalhe e avança o marcador durável de identidades aposentadas na mesma gravação. Recibos ainda abertos são exceções explícitas; uma identidade ausente nunca é recriada por confirmação. Casos sem publicação confirmada permanecem no ledger; atingir o limite recusa novas preparações sem descarte. Excluir um card perde seu histórico, mas não reabre a execução. As mensagens de GM conservam detalhes enquanto existirem. Ações históricas gravam estado do card e recibo juntos; uma ação abandonada em `executing` vira `uncertain` na recuperação.

Essa coordenação não é uma transação atômica do servidor contra alterações nativas ou outros módulos. Não oferece antitrapaça contra clientes modificados; preserva as permissões nativas e não utiliza flags de jogador como autorização mecânica. Ausência de GM impede iniciar uso concedido. Mensagens ou autoria removidas/alteradas administrativamente podem impedir recuperação, conservando recibos no registro para diagnóstico.

### Arquivos P1/P2

Todos os caminhos são relativos a `D:/dev/paranormal-toolkit`.

| Área | Arquivos adicionados ou alterados |
|---|---|
| Domínio/controle | `src/core/allies/ally-grant.ts`, `ally-passive-effect.ts`; `src/core/serialization/json-data.ts`; `src/core/workflow/workflow-execution-control.ts`, `workflow-context.ts` |
| Operação | `src/features/allies/ally-granted-ability-service.ts`, `ally-granted-ability-use-service.ts`, `ally-execution-receipts.ts`, `ally-operation-queue.ts`, `ally-support-service.ts`, `ally-lifecycle-hooks.ts` |
| Foundry | `src/adapters/foundry/foundry-ally-item-adapter.ts`, `foundry-ally-item-effects.ts`, `foundry-ally-ability-request-adapter.ts`, `foundry-ally-receipt-adapter.ts`, `foundry-ally-request-adapter.ts`, `foundry-ally-store.ts` |
| Integração/motores | `src/features/item-use/item-use-route.ts`, `item-use-integration.ts`; `src/features/abilities/ability-use-integration.ts`, `ability-use-workflow.ts`, `ability-roll-executor.ts`, `ability-assisted-action-controller.ts`; `src/core/automation/automation-runner.ts`, `automation-roll-executor.ts` |
| Composição/tipos | `src/main.ts`, `src/toolkit-services.ts`, `src/types/foundry-shim.d.ts` |
| Testes | `tests/helpers/ally-grant-world.ts`; `tests/unit/features/allies/ally-grants.test.ts`, `ally-source-routing.test.ts`, `ally-foundry-adapters.test.ts`, `ally-ledger-migration.test.ts`, `ally-support-service.test.ts`; `tests/reference/foundry-ally-authority.test.ts`, `ordem-ally-compatibility.test.ts` |
| Candidata/documentação | `module.json`, `package.json`, `package-lock.json`, `README.md`, `docs/ROADMAP.md`, este relatório |

### Validação P1/P2

Testes de concessões executam os serviços, os dois motores e os adapters de recursos reais do Toolkit com Documents, banco, rede, dados de rolagem e diálogo substituídos. Cobrem roteamento compartilhado, adulterações, custos, NEX, supressão, combate, exclusões, estabilidade e falhas em oito gravações críticas, cobrança ambígua, publicação, compactação/replay, limite de 256 e troca de geração. Testes de referência carregam permissões nativas de User/ChatMessage, campos estatísticos e preparação dos efeitos transferíveis do Foundry **14.369**, com herança/banco substituídos. A referência Ordem **8.0.2** usa o checkout local, incluindo seu cálculo atual de pool d20. Nenhum arquivo do sistema foi alterado.

`npm run check`: **675 testes aprovados em 88 arquivos**, typecheck e build aprovados, com ambas as referências habilitadas. Node **24.19.0**, Vitest **3.2.6**, Vite **7.3.6**; 269 módulos no bundle. `npm run build` separado e `git diff --check` também aprovados. `dist` permanece ignorado pelo Git e deve ser servido a partir desta pasta. O Vite informa que o import dinâmico do diálogo já importado estaticamente permanece no mesmo chunk; o build conclui normalmente.

Para incluir as referências nesta máquina, definir `PARANORMAL_TOOLKIT_ORDEM_REFERENCE=D:/dev/ordemparanormal_fvtt` e `PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE=C:/Program Files/Foundry Virtual Tabletop/resources/app` antes de `npm run check`. Sem essas variáveis, as suites de referência correspondentes são ignoradas explicitamente. **Nenhum smoke de P1/P2 no servidor Foundry foi executado pelo agente.** A proteção entre clientes, tempo, autoria e propagação do índice precisam da validação abaixo.

### Smoke P1/P2 — dois jogadores e dois GMs

1. Executar `npm run build` em `D:/dev/paranormal-toolkit`; conferir que o módulo servido pelo Foundry aponta para essa pasta e mostra 0.44.0. Recarregar os quatro clientes. Registrar build Foundry e versão/commit do Ordem.
2. Jogador A possui Íris; jogador B possui Mauro. Criar na Íris habilidades ativa, passiva e com ativação vazia, além de duas homônimas. Deixar um Item normal homônimo em Mauro. Ativar suporte: todas as concessões aparecem uma vez; Item normal permanece intacto. Conferir que `allyPassive` aparece uma única vez nos efeitos do Actor.
3. Editar nome, custo, fórmula e faixas de NEX na fonte. Registrar IDs da concessão/efeitos; conferir atualização nesses mesmos IDs, reload e cinco turnos sem escritas repetidas. Repetir com outro Aliado, sem fusão por nome.
4. Usar habilidade genérica com custo 2 e uma rolagem: diálogo e card existentes, dados/NEX de Mauro, uma rolagem e uma cobrança. Repetir em PE/PD e com gasto manual. Criar uma automação com custo explícito 1 PE e custo nativo 9: somente 1 PE. Testar modo `ask`, confirmar como GM e clicar novamente sem novo gasto. Configuração inválida deve bloquear sem fallback.
5. Com dois targets originais e rolagens de dano/cura, mudar os targets depois do uso; retirar suporte e aplicar pelo card como GM. Apenas os alvos originais devem receber os totais persistidos, uma vez, sem rolar novamente. Jogador não aplica ações de GM.
6. Testar efeito nativo transferível, não transferível, desabilitado e temporário. Conferir transferência nativa e início de duração estável. Adicionar efeito com integração desconhecida à origem: concessão visível com diagnóstico, execução bloqueada e fonte intacta; passivos independentes continuam. Corrigir e conferir recuperação.
7. Excluir concessão como jogador: restaura. Excluir como GM: suprime e não retorna por reload/edição/turno. Desativar/ativar reinicia o contexto. Trocar em combate: retira imediatamente e concede ao novo destinatário na rodada seguinte. Excluir fonte e Aliado: limpa somente concessões registradas.
8. Como jogador, tentar editar o Journal e as flags dos Users GM; o servidor deve rejeitar. Remover a flag da concessão: uso continua gerenciado pelo ID. Copiar/adulterar flag em Item comum: bloqueio, sem execução privilegiada. Tentar alterar recibo/card de GM ou copiá-lo para mensagem do jogador: não autoriza ação. Conferir que habilidades normais e rituais preservam comportamento, inclusive sem GM para habilidades normais.
9. Durante preparação, gasto, rolagem e publicação, desconectar o executor/recarregar e deixar o segundo GM assumir. Preparações antigas cancelam; execução abandonada fica incerta e não repete cobrança/rolagem; resultados resolvidos recuperam só publicação. Reconectar o primeiro GM e conferir que nenhum contexto antigo volta a escrever. Sem GM conectado, concessões não executam.
10. Testar `replace` e `keep`, público/whisper/blind; conferir autoria GM, speaker Mauro e visibilidade. Repetir confirmação histórica após compactação e após exclusão do card: nenhum novo gasto ou rolagem. Diagnósticos incertos exigem conferência manual; não clicar para tentar recuperar um gasto possivelmente iniciado.

Somente aprovar a release após esse smoke. Persistência real, propagação das permissões e failover entre clientes continuam critérios pendentes, mesmo com toda a suíte automatizada aprovada.

## Correção 0.44.0 — admissão da habilidade e base do relógio

Base: `c6c36d9`, branch `feature/allies`, em `D:/dev/paranormal-toolkit`. Versão mantida em **0.44.0**, sem commit ou push desta correção.

O probe executado pelo usuário no Foundry **14.369** / Ordem **8.0.2**, usando o GM como solicitante, identificou exclusivamente `inFuture: true`, com idade próxima de **−1,792 × 10¹² ms**. Mensagem encontrada, autoria correspondente ao solicitante, `_stats.createdTime` numérico, ownership/origem do hook consistentes e ausência de recibo/vínculo anterior foram confirmados. O predicado de idade acima de 120 segundos era falso. Não houve transferência antecipada de autoria.

A fonte real do servidor (`dist/components/activity.mjs`) define `Activity.serverTime` como `Date.now() - inícioDaAtividade`. O `GameTime` do cliente sincroniza esse uptime. Já `ServerDocumentMixin._tagStats()` grava `_stats.createdTime` com `Date.now()`, em época Unix. O Toolkit comparava essas bases distintas em `allyServerTime()`. Os mocks anteriores igualavam uptime e data de criação, ocultando o defeito.

A correção usa `allyUnixTime()` para admissão, `preparedAt` e expiração. A verificação de autoria e a janela exata de **0 a 120.000 ms** permanecem: mensagens realmente futuras, mesmo por 1 ms, continuam rejeitadas com diagnóstico próprio. Não há uso de `timestamp` editável ou flags de cliente como autoridade, ampliação de janela, repetição de `Item.roll()` ou mudança nos motores, passivos, combate e concessões. Autoria passa ao GM somente após admissão e persistência da preparação, como antes. Registros v4 existentes continuam legíveis; preparações de uma geração anterior são canceladas e execuções abandonadas ficam incertas pelo mecanismo já existente.

`diagnoseAllyMessageAdmission()` informa separadamente `message-not-found`, `author-mismatch`, `invalid-created-time`, `message-too-old`, `future-created-time`, `existing-receipt` e `existing-binding`. A exceção inclui somente booleanos, diferença de tempo e esses códigos; não inclui nomes, conteúdo de mensagens, fórmulas, alvos ou saldos.

### Arquivos da correção

- `src/features/allies/ally-granted-ability-use-service.ts`: relógio Unix e diagnóstico na admissão.
- `src/adapters/foundry/foundry-ally-receipt-adapter.ts`: diagnóstico dos predicados e erro específico, mantendo a proteção dos recibos.
- `tests/helpers/ally-grant-world.ts`: uptime e `_stats.createdTime` distintos, como no runtime.
- `tests/unit/features/allies/ally-grants.test.ts`: restauração de timestamp na mesma base Unix.
- `tests/unit/features/allies/ally-message-admission.test.ts`: 17 regressões de autoria, predicados, limites, probe, diálogo no solicitante, deduplicação e confirmar/cancelar.
- `tests/reference/foundry-ally-message-admission.test.ts`: duas regressões com o `Activity`, `GameTime`, `_tagStats` e `DocumentAuthorField` reais; rede, calendário e banco substituídos. O teste executa o método de stats extraído da fonte real, sem alterar o Foundry.
- `scripts/diagnostics/ally-ability-admission-probe.mjs`: observação opcional e temporária de hooks, sem escrita em Documents; compara idade Unix atual e a idade incorreta pelo uptime.
- Este relatório.

### Validação e smoke da correção

`npm run check`: **694 testes aprovados em 90 arquivos**, com as referências locais Foundry/Ordem habilitadas, typecheck e build aprovados. Build separado e `git diff --check` aprovados. Bundle regenerado em `dist` (ignorado pelo Git). A reprodução real do defeito foi fornecida pelo usuário; o uso após a correção e o diálogo no cliente de jogador ainda exigem smoke.

1. Servir o módulo de `D:/dev/paranormal-toolkit` e recarregar o Foundry após o build. A versão continua 0.44.0; uma nova mensagem de uso é necessária.
2. Como GM, usar a habilidade concedida na ficha de Mauro. O diálogo existente deve abrir. Antes de confirmar, conferir que PE/PD e rolagens permanecem intactos. Cancelar deve preservar os recursos.
3. Usar novamente e confirmar: uma cobrança e uma rolagem, dados de Mauro e um resultado persistido. Repetir clique não deve duplicar o fluxo.
4. Repetir com jogador proprietário de Mauro e GM conectado: o diálogo deve abrir no jogador; a execução permanece no executor GM.
5. Se necessário, instalar o probe nos consoles envolvidos com `globalThis.allyAdmissionProbe = (await import('/modules/paranormal-toolkit/scripts/diagnostics/ally-ability-admission-probe.mjs?probe=2')).installAllyAbilityAdmissionProbe()`, após `allyAdmissionProbe?.stop()` de uma instalação anterior. Usar `globalThis.allyAdmissionProbe?.stop()` ao terminar. `report()` retorna somente os diagnósticos; `ageMs` usa Unix e `legacyUptimeAgeMs` demonstra a comparação antiga. Autoria pode mudar legitimamente após a preparação; o probe preserva a identidade do solicitante para distinguir essa mudança.

## P3 — drones e homebrew de piloto (vigente, candidata 0.44.0)

Base `c7d796f`, em `D:/dev/paranormal-toolkit`, branch `feature/allies`. P1/P2/P3 permanecem na mesma candidata, sem alterar versões, DataModel, motores, adapters de passivos ou repositórios irmãos. O fluxo principal P1/P2 foi informado como aprovado pelo usuário. O agente não realizou smoke P3 no servidor Foundry.

### Política e persistência

A setting de mundo `allies.dronePilotAbilities` usa as permissões nativas, é booleana e vem desligada. O nome exibido é **Homebrew: piloto utiliza habilidades do drone**. Desligada, ou com um Aliado comum, as habilidades continuam no beneficiário. Ligada e com drone, todas as habilidades são destinadas ao piloto; os passivos identificados por `allyPassive` continuam exclusivamente no beneficiário.

`pilotId` é uma referência opcional a um Actor persistente `agent` no vínculo protegido do ledger v4. Registros anteriores normalizam ausência para `null`, preservando vínculos, esperas, supressões, IDs de efeitos/grants e recibos. Referência malformada bloqueia a leitura sem destruir o original. Referência a Actor removido, sintético ou de outro tipo não é um destinatário válido: concessões antigas são retiradas, não há fallback e o diagnóstico por Aliado não bloqueia passivos ou outros Aliados.

`setPilot` usa o fluxo de solicitação existente: proprietário do Aliado ou GM, identidade nativa do hook, revisão atual, executor eleito e referência persistente validada. Não é uma autorização para operar a ficha do piloto. O solicitante do uso precisa possuir o Actor destinatário. A preparação e a execução leem o mesmo resolver usado pelas concessões, sem confiar na apresentação da ficha.

Configurar ou limpar o piloto não ativa o suporte, não muda o beneficiário, não altera a sequência de ativação e não limpa supressões. A referência é conservada com suporte inativo, setting desligada ou drone desmarcado. Trocar piloto é imediato mesmo em combate, mas não remove uma espera existente por troca de beneficiário. Durante `pending`, não há concessões, mesmo com piloto inalterado.

O destinatário executa e paga pelos motores já existentes. Homebrew ligada: dados/NEX, PE/PD e contexto de fórmulas vêm do piloto. Automação continua cobrando somente seus próprios steps. Sem piloto válido, a ficha mostra aviso discreto e os passivos seguem normalmente. Não há aprovação administrativa, novo popup/card, regra de pilotagem ou controle de ações.

### Reconciliação, execução e interface

A remoção do grant anterior é confirmada antes da retirada do índice e da criação no novo Actor. Falha bloqueia a substituição; o grant obsoleto também não pode ser usado. Mesmo destinatário preserva IDs de Items e efeitos, inclusive com piloto igual ao beneficiário. As regras de Active Effects nativos e supressão pelo GM de P1/P2 permanecem intactas. Trocar piloto, setting ou `isDrone` não reinicia a ativação nem a precedência dos passivos.

A elegibilidade é revalidada antes da confirmação e nos checkpoints existentes. Troca de destinatário com diálogo aberto falha antes da cobrança. Se uma alteração externa ocorrer depois de uma mutação, o checkpoint seguinte pode encerrar o uso como incerto, sem redirecionar o pagador, repetir ou presumir estorno. Cards e ações históricas conservam Actor e targets originais.

O lifecycle observa `createSetting`/`updateSetting` pela chave exata, `system.isDrone` em updates aninhados ou pontilhados e mudança de tipo/exclusão de Actor. Mantém recuperação no `ready` e troca de executor. A atualização visual percorre as instâncias nativas de ApplicationV2, inclusive fichas de tokens, sem abrir fichas fechadas. O piloto e o estado continuam pertencendo ao Actor original.

A ficha recebe somente seletor **Piloto**, **Sem piloto**, **Salvar piloto**, destinatário e diagnóstico. O seletor aparece apenas para drone com homebrew ligada e permissão de operação. O renderer permanece puro. Reconciliar sem diferença não recria documentos nem repete notificações.

### Arquivos P3

| Área | Arquivos e responsabilidade |
|---|---|
| Política | `src/core/allies/ally-ability-recipient.ts`: resolver puro, sem Foundry ou namespace. |
| Setting | `src/features/allies/ally-settings.ts` e `src/main.ts`: registro, leitura e composição. |
| Referência protegida | `ally-operation-authority.ts`, `ally-support-service.ts`, `foundry-ally-store.ts`, `foundry-ally-request-adapter.ts`: validação, normalização compatível, transporte e apresentação. |
| Concessão e uso | `foundry-ally-item-adapter.ts`, `ally-granted-ability-service.ts`, `ally-granted-ability-use-service.ts`: resolução compartilhada, diagnóstico local e revalidação. |
| Eventos e ficha | `ally-lifecycle-hooks.ts`, `src/applications/ally-sheet.ts`, `src/ui/components/ally/ally-sheet.ts`, `foundry-shim.d.ts`: eventos relevantes, seletor e refresh nativo. |
| Regressões | Novos testes de política, setting e fluxos P3; atualização dos testes de Actor/ficha, adapter, lifecycle, autoridade e migração. `tests/helpers/ally-grant-world.ts` simula ownership distinto, passivos reais e os motores existentes. |

### Evidências automatizadas e limites

Validação desta implementação: `npm run check` aprovado com **767 testes em 93 arquivos**, typecheck e build, com as referências locais habilitadas. `npm run build` separado e `git diff --check` aprovados. O bundle `dist` foi regenerado e permanece ignorado pelo Git. O Vite mantém o aviso já existente de importação simultaneamente estática/dinâmica de `AbilityUseApplication`; não impede o build.

As regressões exercitam a matriz desligado/ligado, drone/comum, piloto ausente/igual/diferente, ambos os motores, PE/PD, NEX do piloto, cancelamento, dupla interceptação, revisão/ownership, fontes editadas, retirada antes de criação, falha de exclusão, estabilidade de IDs, supressão, espera de combate, política alterada em execução e ação histórica no target original. Cobrem também o transporte diferencial de `setPilot`, apresentação adulterada e fichas do diretório/tokens.

Os testes de P3 usam Documents, transporte e banco substituídos; não comprovam permissões entre clientes nem persistência no servidor. As suites de referência existentes leem o Foundry **14.369** e o Ordem **8.0.2** locais, incluindo a regressão de relógio Unix/autoria. O novo refresh usa `ApplicationV2.instances()` e `render({force:false})` verificados na fonte instalada. Nenhum sibling foi alterado.

Todos os clientes precisam carregar o mesmo bundle antes de habilitar P3: clientes antigos desconhecem `pilotId` e podem descartá-lo ao salvar. As referências são operacionais do mundo, sem cópia automática para Actors duplicados/compêndios. Não há transação atômica contra edições nativas ou outros módulos. A proteção permanece dentro do modelo de permissões do Foundry; flags editáveis não autorizam mecânicas.

### Smoke P3 — dois jogadores e dois GMs

1. Gerar o build em `D:/dev/paranormal-toolkit`, conferir a pasta servida pelo Foundry e recarregar os quatro clientes. Registrar build Foundry e versão Ordem. Preparar Íris (drone), Mauro (beneficiário) e Rafa (piloto), com proprietários distintos. Na Íris, configurar Defesa +5 passiva e duas habilidades, uma com rolagem/custo genéricos e outra com automação. Usar NEX distintos em Mauro e Rafa.
2. Com homebrew desligada, ativar suporte: passivos e habilidades em Mauro. Conferir também um Aliado comum, sem mudança do fluxo P1/P2.
3. Ligar a setting e salvar Rafa piloto: passivos somente em Mauro, habilidades somente em Rafa. Registrar IDs. Como proprietário de Rafa, usar cada motor: diálogo nesse cliente, NEX/fórmula e custo de Rafa. Testar PE/PD, cancelar sem gasto e cliques repetidos sem duplicação. O proprietário apenas da Íris/Mauro não ganha permissão para operar Rafa.
4. Trocar piloto fora e durante combate: retirada imediata no anterior; passivos intactos. Escolher Mauro como piloto não duplica Items. Limpar/excluir o piloto ou alterar seu tipo: nenhuma concessão, diagnóstico discreto e passivos preservados. Salvar piloto novamente recupera o fluxo.
5. Trocar beneficiário fora de combate mantém o grant quando o piloto continua igual. Durante combate, retira passivos e habilidades imediatamente; salvar outro piloto não apaga a espera. Somente na rodada prevista o suporte retorna. Testar encerramento de combate e reload.
6. Alternar setting e `isDrone`: os grants mudam de destinatário, passivos preservam IDs. Com piloto igual a Mauro, o grant também mantém ID. Como GM, excluir um grant para suprimi-lo; trocar piloto/setting/drone, editar fonte, recarregar e avançar turnos não deve restaurá-lo. Desativar/ativar restaura pelo mecanismo existente. Items externos não são tocados.
7. Editar e excluir fontes. Conferir sincronização no mesmo ID, retirada correspondente e reconciliações sem duplicação ou avisos repetidos. Repetir a configuração pela ficha do diretório e por tokens vinculados/não vinculados: todas mostram o mesmo piloto e vínculo original; fichas fechadas não são abertas.
8. Abrir diálogo de uso e trocar destinatário antes de confirmar: recusa sem gasto. Depois de um uso concluído, trocar piloto e executar uma ação histórica: deve atingir o target original, sem nova rolagem. Trocar GM executor ou perder conexão durante uso não pode repetir cobrança nem retomar operação incerta automaticamente; conferir os recibos pelo fluxo P1/P2.

Recomendação: manter a candidata em validação até concluir esse smoke. Os testes automatizados não substituem o teste real de rede, permissões e persistência.

## Ficha final de UI/UX — candidata 0.44.0 (vigente)

Implementação sobre `5e0a92b`, branch `feature/allies`, em `D:/dev/paranormal-toolkit`. Sem bump, release, worktree, commit ou push. O polimento preserva o layout aprovado: retrato, nome e contexto no header permanente; abas Suporte, Habilidades e Detalhes menores e contíguas ao painel; conteúdo rolável em fundo claro, bordas discretas e vinho nos destaques. A barra nativa é escura, sem substituir seus controles. Não há faixa vertical colorida. A janela inicia em 760 × 650 e os seletores empilham em largura reduzida.

### Fluxo vigente

- Selecionar um Agente em Beneficiário envia uma única solicitação `setBeneficiary`, que atribui e ativa em uma transição. Selecionar Nenhum limpa o beneficiário e encerra o suporte. O fluxo normal não usa mais os botões de atribuição/ativação/desativação/salvamento. Abrir ou atualizar a ficha não envia essas operações.
- A troca em combate mantém a retirada imediata e a próxima rodada. Limpar com suporte ativo em combate também estabelece esse limite; limpar durante espera mantém o limite anterior. Reselecionar não o contorna nem o adia. Em caso de múltiplos combates, a escolha contextual é validada pelo executor antes de aceitar a alteração.
- Mesmo beneficiário ativo/pending não muda sequência, prioridade ou supressões. Nova ativação ou troca real conserva o reinício de supressões já aprovado. Piloto, setting e drone continuam sem reiniciá-las.
- Piloto salva ao selecionar e Sem piloto limpa, somente com drone + homebrew. P3 permanece: passivos no beneficiário; habilidades, NEX e recursos no destinatário resolvido.
- Suporte e Habilidades reutilizam `renderAllyAbilityList`: imagem/d20 utiliza a concessão, nome/área principal expande a descrição real enriquecida e o lápis separado abre o Item original. Botões independentes evitam ações duplas. O indicador d20 não muda de tamanho no hover. Criar, arrastar, configurar benefícios e remover com confirmação foram preservados. O menu nativo da janela mantém Reconciliar suporte para GM.
- Nome e retrato são editados somente no header: nome confirma ao Enter/blur; retrato usa `foundry.applications.apps.FilePicker.implementation`, com escrita por campo apenas no callback. Cancelar não escreve. A imagem é revalidada contra o valor existente quando o seletor abriu, incluindo conflito e perda de ownership.
- Detalhes contém identificação de drone e descrição. A descrição usa `<prose-mirror toggled>` nativo, HTML enriquecido fora do renderer e persistência no HTMLField existente, sanitizado pelo servidor conforme o manifest. Não há editor externo nem gravação por tecla. O renderer não escreve Documents nem resolve permissões.

### Decisões do polimento

`DocumentSheetV2.title` lê `CONFIG.Actor.typeLabels[type]` e localiza `TYPES.Actor.paranormal-toolkit.ally`. O arquivo de idioma tinha somente `TYPES.Actor.ally`; acrescentar a chave completa corrige o título para **Aliado: Íris**, mantendo o getter nativo e sua atualização ao renomear. Não houve mudança de subtipo nem override de título.

O rich text mantém o elemento nativo inteiro enquanto estiver aberto, incluindo sua seleção e toolbar. A atualização por chave não percorre seus filhos. Quando fechado, só substitui o editor se valor ou HTML enriquecido mudarem. A baseline é capturada antes de abrir; conflito usa a escolha explícita existente. O evento público `save` confirma o campo, inclusive ao tentar salvar novamente o mesmo HTML após uma falha; `change` de controles internos não grava. Uma falha mantém o rascunho e reabre a edição. Não se usa `collaborate`: a gravação continua no fluxo por campo com detecção de conflito, sem persistência paralela pelo editor.

Descrições de habilidades são enriquecidas por `TextEditor.implementation.enrichHTML`, com referência ao Item original, dados nativos e visibilidade de segredos conforme ownership. O renderer recebe apenas HTML já enriquecido; não executa rolagens nem resolve Documents. Efeitos, concessões, ledger, recibos, recursos e motores não receberam mudanças neste polimento.

A rodada visual final altera `styles/ally-sheet.css`, o renderer da ficha, seus testes de estrutura, a fixture DOM existente e este relatório. A retirada da sombra externa (`0 1px 6px #0002`) não eliminou o contorno claro informado no smoke: os prints posteriores mostraram a borda e o fundo claros da raiz envolvendo a barra escura. A moldura agora usa fundo/borda da mesma cor da barra; o bege fica exclusivamente em `.window-content`, incluindo seu padding. O recorte arredondado pertence à moldura, sem um arredondamento separado na barra. A sombra externa continua desativada e as sombras dos controles permanecem intactas.

O ícone permanece como imagem inteira em repouso. O mesmo d20 existente cobre 100% da imagem somente em hover/foco visível, com transição de opacidade e sem receber eventos de ponteiro. A conferência em navegador detectou a largura de 28 px herdada do Font Awesome; definir largura/altura de 100% garante cobertura dos 34 × 34 px, inclusive sob o CSS nativo. **Descrição** fica acima e fora do novo container `.ally-description-card`, que recebe borda, raio, padding e fundo claro. Somente o mesmo `<prose-mirror>` fica dentro desse card, tanto vazio quanto preenchido e durante edição. Handlers, persistência e fluxos mecânicos permanecem intactos.

### Segurança, confirmação e estabilidade

`setBeneficiary` aceita referência nullable explícita. Validação de Agente persistente, revisão, ownership, identidade nativa do hook, executor e reconciliação permanecem no caminho existente. O estado continua no ledger v4, sem novo campo ou migração. A espera já admitia vínculo inativo sem beneficiário.

O cliente aguarda `allySupportResponse`, correlacionado por nonce, Actor e solicitante. Só aceita o evento nativo do GM executor esperado e atual, com verificação do último modificador. A resposta é feedback e nunca autorização mecânica. Há fila local, indicadores de andamento, erro de revisão e timeout/troca de executor sem reenvio automático. Reconciliação incompleta conserva a intenção e o rastreamento. Erros não simulam rollback de uma escrita já concluída.

Como `setFlag` mescla objetos, uma escolha explícita de combate é limpa na próxima intenção que não a informar. Ela não pode vazar para outra troca por um campo remanescente do request anterior.

O índice protegido recebe `allyId` e `sourceItemId` em suas entradas como extensão aditiva. Sua versão de roteamento e a leitura das entradas anteriores permanecem; o atalho só fica disponível com origem publicada e coerente entre os GMs. Não usa nome ou `allyGrantedAbility` editável como autoridade. Todos os clientes devem recarregar o mesmo bundle.

O atalho chama `Item.roll()` apenas na concessão, no cliente solicitante. A mensagem nativa entra no mesmo gateway compartilhado e nos motores existentes. Não existe execução alternativa, chamada de roll pelo GM ou alteração dos recibos. A disponibilidade local é conservadora; a autorização final continua lendo o ledger e a origem canônica.

Uma regressão dedicada reproduz a retirada da concessão durante a preparação nativa, inclusive com a flag removida: os dois listeners consomem o evento, sem encaminhá-lo ao workflow comum. Mensagens já assumidas permanecem consumidas mesmo após retirada do índice. Se a chamada nativa ultrapassar o prazo antes do hook, sua reserva conserva o bloqueio até a chamada encerrar e consome o evento tardio, sem iniciar execução silenciosa. Uma chamada já interceptada permanece bloqueada até a submissão terminar, não apenas até `Item.roll()` retornar.

Abas usam as APIs nativas `TABS`, `tabGroups` e `changeTab`. Atualizações preservam o shell e fazem atualização por chave; campos, linhas e menus existentes não são recriados indiscriminadamente. O estado local guarda rascunho, baseline e erro por campo. Texto em edição não é sobrescrito por atualização remota. Conflito no mesmo campo pede escolha; cancelar mantém o rascunho e o aviso. Se o campo mudar novamente durante a escolha, nenhuma escrita é presumida. Foco, seleção de texto e rolagem são preservados, incluindo fichas de tokens do mesmo Actor original.

### Arquivos desta etapa

| Área | Arquivos |
|---|---|
| Seleção e confirmação | `src/core/allies/ally-support-state.ts`; `src/features/allies/ally-operation-authority.ts`, `ally-support-service.ts`, `ally-lifecycle-hooks.ts`; `src/adapters/foundry/foundry-ally-request-adapter.ts`. |
| Atalho e composição | `src/features/allies/ally-granted-ability-shortcut.ts` (novo); `src/adapters/foundry/foundry-ally-item-adapter.ts`; `src/features/item-use/item-use-route.ts`; `src/main.ts`; `src/toolkit-services.ts`. |
| Ficha e edição | `src/applications/ally-sheet.ts`; `src/applications/ally-sheet-dom.ts` (novo); `src/features/allies/ally-sheet-edit-state.ts` (novo); `src/ui/components/ally/ally-sheet.ts`; `styles/ally-sheet.css`; `src/types/foundry-shim.d.ts`. |
| Polimento | `src/applications/ally-sheet-rich-text.ts` e `src/ui/components/ally/ally-ability-list.ts` (novos); `lang/pt-BR.json`; ajustes na ficha, renderer, atualização DOM e CSS acima. |
| Regressões novas | `tests/unit/features/allies/ally-direct-support.test.ts`, `ally-support-requests.test.ts`, `ally-granted-ability-shortcut.test.ts`, `ally-sheet-edit-state.test.ts`; `tests/browser/ally-sheet-dom.fixture.ts`. |
| Regressões atualizadas | Testes de estado, Actor, resolução de origem, grants, renderer e `tests/reference/ordem-ally-compatibility.test.ts`. Este último deixou de carregar `d20-pool.mjs`, ausente e não importado pelo OrdemActor do checkout local atual; nenhuma fonte do sistema foi alterada. |
| Regressões do polimento | `tests/reference/foundry-ally-sheet-title.test.ts`, `tests/browser/ally-sheet-native-editor.fixture.ts` (novos); testes de Actor, renderer e fixture DOM atualizados. |
| Documentação | `README.md`, `docs/ROADMAP.md` e este relatório. |

### Validação e limites

`npm run check`: **842 testes em 98 arquivos**, com referências locais habilitadas, typecheck e build aprovados. Build separado e `git diff --check` aprovados. Foundry **14.369** e Ordem **8.0.2**, checkout `8ee2c41`, usados como referências de código, com banco/rede/dependências substituídos. O teste de título executa o getter real de DocumentSheetV2 e a classe Localization real. Motores, DataModel, adapters passivos e repositórios irmãos não foram modificados. O Vite mantém somente o aviso já conhecido de importação estática/dinâmica de `AbilityUseApplication`.

Uma prévia isolada em Chrome headless carregou os renderers/CSS e a fixture de DOM real: **27 verificações aprovadas**, incluindo rascunho focado, seleção, aba, rolagem, header, linhas compartilhadas por ID, expansão, menu aberto e perda de ownership. O ajuste final acrescenta ausência de sombra externa, moldura/barra da mesma cor, corpo bege separado, recorte dos cantos somente na moldura, imagem inteira em repouso, overlay nas mesmas dimensões, foco sem deslocamento, retorno à imagem, título fora/acima do card vazio delimitado e HTML formatado dentro dele. Outras **10 verificações** exercitaram o elemento `<prose-mirror>` real do v14, seus eventos e DOM: abertura sem escrita, edição durante refresh remoto, seleção, save único, conflito, repetição explícita de save com o mesmo HTML, retorno ao HTML formatado, estabilidade sem mudanças e perda de permissão. Nessa fixture, TextEditor/ProseMirror e lookup do Document foram substituídos; ela não comprova a toolbar completa nem persistência de servidor. Layout conferido em 760 px, 480 px, Habilidades expandida e Detalhes, com fontes/ícones locais do Foundry. As fixtures em `tests/browser/` não adicionam dependência de DOM aos testes Node.

Essa prévia usa dados fictícios e não é um servidor Foundry. **Nenhum Actor ou vínculo do mundo real foi resetado pelo agente.** Persistência multiplayer, diálogos nativos, seletor de arquivo e permissões reais ainda exigem smoke. Não há promessa de transação atômica contra outros módulos ou edições externas.

### Reset e smoke final — mundo descartável

1. Servir o módulo de `D:/dev/paranormal-toolkit` após o build e recarregar os quatro clientes, com dois jogadores e dois GMs. Não apagar o Journal nem flags manualmente. A versão continua 0.44.0.
2. Encerrar os Aliados de teste escolhendo **Nenhum**. Conferir que suas projeções e concessões registradas desapareceram, incluindo cópias com flags adulteradas. Se houver falha, manter os registros e usar Reconciliar suporte pelo GM; não considerar o reset concluído até limpar os inventários. Fontes excluídas seguem a limpeza existente. Recibos, cards, contadores e marcadores contra replay devem permanecer intactos.
3. Reconfigurar os vínculos. Não há placeholder de retomada nem migração para antigos vínculos inativos com beneficiário salvo; esses registros de desenvolvimento são descartáveis. Selecionar Mauro deve ativar diretamente; trocar fora de combate deve remover/aplicar; Nenhum deve retirar tudo.
4. Em combate, trocar e depois limpar/reselecionar na mesma rodada: não aplicar antes do limite estabelecido. Testar rodada seguinte, encerramento de combate e ambiguidade entre combates.
5. Com Íris drone + homebrew, escolher Rafa como piloto. Conferir passivos somente em Mauro, habilidades/dados/NEX e PE/PD em Rafa. Trocar/limpar piloto e alternar política mantêm as regras P3 e supressões existentes.
6. Em ambas as abas, clicar no nome expande/recolhe a descrição; o lápis abre somente o Item original. Em repouso, o ícone mostra somente a imagem; hover/foco revela d20 em toda a área, sem deslocamento. Usar pelo ícone com proprietário do destinatário: um diálogo nesse cliente, uma execução e uma cobrança. Cancelar não gasta. Testar os dois motores, clique repetido e ausência de ownership/GM. Menu permite benefícios e remoção confirmada; arraste e criação continuam funcionando.
7. Alternar abas, diminuir janela e operar por teclado. Conferir **Aliado: Íris**, barra nativa escura sem contorno claro nos cantos/topo, corpo bege e abas contíguas ao painel. Editar o nome pelo header e conferir título atualizado; trocar/cancelar retrato no seletor nativo. Detalhes não duplica identidade: conferir **Descrição acima e fora do card**, com borda/padding/fundo somente no texto vazio ou preenchido; marcar drone e editar descrição pelo lápis/conteúdo, usar negrito, listas e links, concluir pelo save nativo e reabrir/recarregar. O editor e a toolbar permanecem no mesmo card. Manter texto/foco/seleção/rolagem enquanto o GM altera suporte e fontes. Editar o mesmo campo em dois clientes: escolha explícita, cancelamento conserva o texto e falha não envia o formulário inteiro. Após falha de gravação, tentar concluir novamente sem alterar o texto; deve persistir uma vez.
8. Repetir pela ficha do diretório e tokens vinculados/não vinculados. Testar reload, revisão concorrente, perda de conexão e troca de executor. Conferir supressões, efeitos externos e ações históricas nos alvos originais. Nenhum recibo incerto pode ser repetido automaticamente.

Recomendação: manter a candidata sem release até concluir o smoke final no Foundry.
