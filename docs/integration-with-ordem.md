# Integração com o sistema ordemparanormal

Este documento registra decisões e cuidados para integração com o sistema não-oficial `ordemparanormal`.

## Objetivo

Integrar com o sistema sem tentar substituí-lo.

O Toolkit deve funcionar como módulo companion:

- opcional;
- desacoplado;
- tolerante a mudanças;
- sem duplicar responsabilidades do sistema base quando houver API nativa melhor.

## Sistema alvo

```txt
game.system.id === "ordemparanormal"
```

O módulo deve abortar inicialização funcional caso o sistema ativo seja outro.

## Dados atuais conhecidos

Paths atuais usados pelo adapter inicial:

```txt
Agente:
system.PV.value
system.PV.max
system.SAN.value
system.SAN.max
system.PE.value
system.PE.max
system.PD.value
system.PD.max
system.ritual.DT

Ameaça:
system.attributes.hp.value
system.attributes.hp.max
```

Esses paths são considerados detalhes de implementação atuais, não contrato permanente.

### Campos de bônus usados pelos presets de Active Effect

Na 0.45.1, o campo de valor também aceita fórmulas aritméticas com referências `@` do roll data do Actor (ex.: `(@NEX.value / 5) * 1`). O Toolkit restringe a sintaxe determinística e usa `Roll.validate()` antes de gravar a expressão original; o próprio `OrdemActor.applyActiveEffects()` chama `Roll.replaceFormulaData()` e `Roll.safeEval()`. Sem hooks ou avaliação própria. Expressões sem `@` não são oferecidas: a avaliação do Ordem depende desse marcador, inclusive em campos ausentes do schema. Os dados são do Actor que recebe o efeito, inclusive nas projeções. RD mantém o requisito de inteiro positivo no preset. Fórmulas já existentes permanecem intactas e editáveis nativamente.


Os presets compartilhados de efeitos próprios e benefícios passivos (`src/adapters/ordem/ordem-effect-presets.ts`, paths em `ORDEM_AGENT_BONUS_PATHS`) criam uma única mudança em `system.changes`, `add`, fase `initial`, prioridade 20. No Foundry v14, `initial` é aplicada antes de `prepareDerivedData` e `final` depois de `prepareData`. Referência: Ordem 8.0.2 (`0e9fcc4`) e Foundry 14.369. A comprovação abaixo usa fontes reais em harness com banco e ciclo base dos Documents substituídos; não substitui smoke em mundo real.

| Preset | Path | No schema | Efeito real na preparação do Agente |
|---|---|---|---|
| Defesa | `system.defense.value` | sim | base de `calculateDefense` (+proteções, +AGI); entra também na Esquiva. `defense.bonus` existe, mas não é lido. |
| Deslocamento | `system.desloc.value` | sim | o derivado só subtrai 3 por sobrecarga. `desloc.bonus` existe, mas não é lido. |
| Perícia | `system.skills.<id>.value` | sim | soma na rolagem de perícia (`extraBonus`) e no total da ficha, sem travar o modificador editável `mod`. Não entra na iniciativa do combate com perícia treinada nem na Esquiva. |
| PV/PE/PD/SAN máximo | `system.PV.bonus`, `system.PE.bonus`, `system.PD.bonus`, `system.SAN.bonus` | não (aplicação unguided do v14) | somado por `_calculateMaxHP` somente com item de Classe e `disableCalculations` desligado; caso contrário, sem efeito. PD depende da regra Sem Sanidade. |
| Carga | `system.spaces.bonus.max` | sim | soma à capacidade calculada com FOR; peso e penalidades continuam nativos. |
| FOR/AGI/INT/VIG | `system.attributes.str/dex/int/vit.value` | sim | atributo preparado para rolagens; FOR afeta carga, AGI Defesa, VIG PV calculado. INT não concede benefícios de progressão. Validação/limites dos campos continuam nativos. |
| DT de rituais | `system.ritual.DT` | sim | soma direta após o cálculo base da DT; independente do preset PRE adiado. |
| PE/PD por rodada | `system.PE.perRound`, `system.PD.perRound` | sim | soma após cálculo base de progressão/Sobrevivente/Sem Sanidade; nenhum controle de gastos. |
| RD por tipo | `system.resistances.<tipo>.value` | não | aplicação nativa unguided cria apenas dados preparados transitórios. `OrdemActor.applyDamage()` consome a resistência correspondente. |
| Dados (+Xd20) | — | apenas na branch `feat/native-dice-bonus` do fork | preset bloqueado até a mecânica existir no sistema. |

Os ids de perícia aceitos são os 27 do `AgentData`, exceto `freeSkill`. `tests/reference/ordem-effect-preset-paths.test.ts` confere esses consumos com as fontes reais quando `PARANORMAL_TOOLKIT_ORDEM_REFERENCE` está definida.

### RD e tipos canônicos — 0.45.0

`ordem-damage-types.ts` concentra os 15 IDs: `cuttingDamage`, `impactDamage`, `piercingDamage`, `ballisticDamage`, `bloodDamage`, `deathDamage`, `knowledgeDamage`, `energyDamage`, `fearDamage`, `fireDamage`, `coldDamage`, `eletricDamage`, `chemicalDamage`, `mentalDamage` e `damageDamage`. O identificador `eletricDamage` preserva a grafia do sistema. `damageDamage` é o tipo explícito **Dano**, diferente de ausência de tipo; aliases genéricos continuam resolvendo para `null`. O preset não aceita segmentos de path arbitrários nem valores negativos, zero ou não inteiros seguros.

RD 5 reduz dano 10 do mesmo tipo para 5; outro tipo ou dano sem tipo não usa essa resistência. O mínimo zero, `extraRD` e `ignoreRD` continuam no sistema: nessa base, `ignoreRD` ignora a resistência por tipo, mas não elimina `extraRD`. Efeitos próprios aditivos somam; suportes concorrentes preservam a seleção por campo/fase/operação do resolver atual. Um efeito próprio pode somar com a projeção selecionada. Não há segunda subtração no adapter do Toolkit, inicialização persistida de `resistances`, interceptação de `applyDamage()`, imunidades ou vulnerabilidades.

`tests/reference/ordem-damage-resistance-effects.test.ts` executa os 15 tipos individualmente com campos, aplicação e filtragem de transferência do Active Effect v14, `AgentData`, cálculos e `OrdemActor.applyDamage()` reais. Cobre soma, fonte sem campo no schema, preparações repetidas, atualização de PV, desativação, retirada, reidratação, precedência dos Aliados, efeitos próprios somados à projeção, dano inferior à RD, tipo diferente, ausência de tipo e as duas opções de ignorar. Os efeitos e o ciclo base/banco são substitutos: não comprova transferência persistida ou reload de um mundo no servidor.

Para executar as referências, definir `PARANORMAL_TOOLKIT_ORDEM_REFERENCE` para o checkout Ordem e `PARANORMAL_TOOLKIT_FOUNDRY_REFERENCE` para `resources/app` da instalação Foundry e executar `npm run check`. Sem as referências locais, essas suites são ignoradas explicitamente.

### PRE, Esquiva e armas adiados

A ordem observada é **base → efeitos iniciais → derivados → efeitos finais**. `AgentData.prepareBaseData()` calcula a DT usando PRE antes dos efeitos iniciais. Prioridade ou fase final não antecipa PRE a esse consumidor. O Toolkit não adiciona hooks nem recálculos compensatórios: o sistema precisa calcular DT após a aplicação de efeitos ao atributo, preservando depois os bônus diretos à DT. PRE não integra o seletor de atributos desta versão.

`system.defense.dodge` é refeito nos derivados e a reação não tem o mesmo consumidor; não oferecemos Esquiva como preset independente. Mudanças transferidas ao Actor não modificam automaticamente seus Items. Os modificadores opcionais de ataque usam contexto por execução, conforme descrito abaixo; dados adicionais e propriedades permanentes de armas continuam fora desse fluxo.

### Entrada na ficha e limites de extensão

`renderItemSheetV2` usa `sheet.parts.effects`, o seletor declarado em `PARTS.effects.scrollable` e um único contêiner pertencente à ficha. Não há slot semântico do Ordem para módulos após as listas; a inserção fica isolada em `item-sheet-ability-effect-config-block.ts`. Ausência/ambiguidade da estrutura gera diagnóstico deduplicado e preserva a ficha nativa. O registro é idempotente; rerenders reutilizam o nó, substituições abortam listeners e `closeItemSheetV2` descarta a montagem. Não há controles de cabeçalho, observers ou timers. A aplicação compartilhada mantém drafts, revalidação de contexto/permissões e registro por UUID, independente do fechamento da ficha.

## Modificadores opcionais de ataque

Referência de implementação: Ordem 8.0.2, commit **0e9fcc4**, e Foundry **14.369**. O vínculo explícito do preset fica na flag **attackModifier** da habilidade, no namespace do Toolkit. O gerenciador reconhece Tiro Intuitivo pelo nome somente para sugerir sua aplicação; o ataque usa o vínculo persistido e exige uma arma compatível à distância. Classe, Pontaria e NEX não são validados como requisitos de aquisição. Nenhuma arma específica identifica a regra.

**Uso e execução.** Usar a arma cria o card; a rolagem ocorre depois, por **rollAttack()**. O adapter mantém a expansão nativa de ataques/alvos e abre o diálogo somente em chamadas efetivas. Um **useId** identifica cada acionamento do card; cada chamada observada recebe seu próprio **executionId**, snapshot, custo e alvo. Não existe um gerenciador de sequências do Toolkit. O cancelamento retorna uma entrada sem roll e com erro explícito para que o agregador nativo não a interprete como ataque sem alvo.

**Publicação.** Instâncias efêmeras mantêm a identidade da arma e recebem apenas overrides de **isCritical()** e **getRollData()**. O bridge de **Roll.toMessage()** atua exclusivamente sobre marcadores presentes no registro interno e adiciona a flag **attackExecution** à criação original. O ID da mensagem é capturado mesmo sem alvo, quando o nativo não fornece **hitResult**. A arma e seus efeitos permanecem intactos. Flags nativas de visibilidade e reação são preservadas.

**Dano individual.** A flag **attackModifierState** do card aponta para as execuções do acionamento atual. O resolver reidrata cada mensagem por ID, confere a identidade e consulta seu resultado nativo atualizado. O método **rollVolleyDamage()** original continua filtrando e percorrendo as entradas; sua chamada interna de **rollDamage()** é interceptada pelo **attackMessageId** para fornecer o multiplicador daquela execução. A publicação recebe **attackDamage** com alvo, penetração e resultado próprios. A mesma integração atende uma única entrada. O retorno agregado externo nunca fornece o snapshot individual.

**Sem alvo e atualizações.** Uma entrada sem alvo pode rolar dano, mas não afirma acerto nem oferece aplicação assistida. Cancelamentos e falhas anteriores à publicação não geram dano. Referências incompletas ou incertas bloqueiam a resolução. Um guard de **preUpdateChatMessage** impede que a busca nativa pelo último card com o mesmo item sobrescreva outro card ou outro acionamento. Atualizações de reações atualizam a apresentação do card explicitamente vinculado, por uma fila de mutação que relê a revisão vigente.

**Recursos.** A seleção PE/PD reutiliza a configuração Sem Sanidade. O gasto usa **ResourceEngine**, uma vez por execução, após avaliação e imediatamente antes de publicar. Uma criação vetada de forma confirmada permite compensação se o saldo ainda corresponder ao débito. Exceções de atualização/publicação podem representar resposta perdida após commit: a execução fica incerta, sem repetição automática. Publicações anteriores válidas não são desfeitas quando um ataque posterior falha.

**Aplicação de RD.** O botão assistido é manual e exclusivo do GM executor eleito pelo mesmo helper compartilhado com Aliados. O caminho nativo de aplicação é omitido nas mensagens gerenciadas. O serviço revalida acerto, reação, alvo e resultado persistido antes de delegar ao **DamageEngine**. Para penetração positiva, o adapter calcula **max(0, RD do tipo + RD adicional − penetração)** e chama **actor.applyDamage(danoBruto, { ignoreRD: true, extraRD: residual })**. O dano bruto não é aumentado e PV continua sendo atualizado pelo sistema. Os parâmetros novos são opcionais; o caminho anterior permanece quando não há penetração.

A eleição converte **game.users** em array antes de usar operações de Array: a coleção nativa do Foundry não oferece **flatMap()**. O teste de referência do card usa a Collection real do v14, passa pelos hooks de renderização e pelo clique de aplicação, cobrindo exibição ao GM, penetração de RD, alvo original e reapresentação sem aplicação duplicada.

**Persistência e idempotência.** Os schemas começam em 1 e não alteram os schemas de rituais/habilidades. Um resultado publicado é reutilizado; estado de execução sem confirmação impede replay após reload. A aplicação também tem claim e recibo persistidos. Filas locais e flags não constituem transação distribuída; mudanças de executor/conexão com efeito incerto exigem conferência manual. O estado de um novo acionamento substitui o vínculo ativo do card, inclusive em cancelamentos, e não procura modificadores pelo último uso da arma. Mensagens antigas conservam seus vínculos individuais. Conteúdo original é preservado diante de flags inválidas.

**Validação.** As suites de referência de modificadores executam os métodos reais de ataque, crítico, volley, dano, aplicação e reações com banco/Document base/aleatoriedade substituídos. Uma suite separada executa **Roll.toMessage()** real do Foundry v14. Cobrem crítico pago/gratuito no mesmo uso, acerto não crítico com penetração, cancelamentos, alvos diferentes/ausentes, índices nativos nulos, reabertura, mensagens intercaladas e falhas parciais. Isso não comprova banco/socket de um mundo real. A fixture de navegador **tests/browser/attack-modifiers.html**, servida por Vite, usa a ApplicationV2 substituída e o diálogo/renderer reais para conferir visual, confirmação e cancelamento.

Smoke de mesa ainda necessário: jogador e GM no mesmo mundo v14, ataque/dano após reload, Esquiva, aplicação única e visibilidade. Dano misto, ausência de alvo, Mirar e limites de gasto por rodada conservam os limites descritos no README.

## Gerenciamento de presets específicos

A aplicação existente de presets reúne rituais e habilidades por meio de **PresetManagerService**, que agrega os diagnósticos e encaminha a aplicação aos serviços existentes. Não há catálogo universal, associação manual ou unificação dos motores. Nos rituais, somente presets com reconhecimento específico por nome entram no gerenciamento; o ID de um vínculo aplicado tem prioridade sobre o nome atual. Presets genéricos permanecem nos fluxos próprios.

O acesso usa **Actor.testUserPermission(user, "OWNER")** e **canUserModify(user, "update")**, com revalidação por Item antes das escritas. GM e OWNER podem abrir a janela mesmo em Actors sem itens. Habilidades concedidas e compêndios bloqueados conservam suas proteções. Rituais mantêm **AutomationBinder**, **itemPatch** e seus schemas atuais; habilidades de ataque mantêm **attackModifier**. Automações manuais e dados inválidos não são substituídos pelo reconhecimento por nome. Não há migração ou escrita ao diagnosticar.

A aplicação de ritual continua com as chamadas de persistência existentes, sem transação ou merge histórico. O **itemPatch** conserva os campos declarados pelo preset, inclusive o nome quando presente, e não altera descrições ou flags de configurações genéricas. Falhas exigem conferir o item antes de tentar novamente. Configurar presets não altera snapshots de ataques ou cards já publicados.

## Refatoração do sistema

O mantenedor do sistema informou que pretende refatorar bastante os dados para melhorar compatibilidade, intuição e integração com módulos.

Impacto esperado:

- paths podem mudar;
- algumas operações podem virar nativas do sistema;
- hooks/flags podem ser adicionadas no futuro;
- nosso adapter pode precisar ser reescrito.

Decisão:

```txt
Core do Toolkit não acessa actor.system diretamente.
```

## Dano, cura e sanidade

O sistema já possui ou deve possuir alguma base para aplicação de dano, com possibilidade futura de cura e sanidade.

Decisão:

- o Toolkit pode implementar operações próprias enquanto não houver API nativa suficiente;
- essas operações devem ficar atrás de interface/adapter;
- se o sistema expuser método nativo futuro, o adapter deve delegar para ele.

Exemplo futuro desejável:

```ts
await ordemAdapter.applyDamage(actor, amount);
```

Hoje isso pode usar `actor.update`. Amanhã pode chamar API nativa do sistema.

## Hooks desejáveis no sistema

Não são requisitos imediatos, mas seriam pontos úteis de integração futura:

```ts
Hooks.callAll("ordemparanormal.itemUsed", data);
Hooks.callAll("ordemparanormal.attackRolled", data);
Hooks.callAll("ordemparanormal.damageRolled", data);
Hooks.callAll("ordemparanormal.damageApplied", data);
Hooks.callAll("ordemparanormal.resourceChanged", data);
```

Também seria útil uma API estável para:

- ler recurso;
- alterar recurso;
- aplicar dano;
- curar;
- identificar crítico;
- obter fórmula de dano de arma;
- obter categoria de arma.

## Chat cards

O Toolkit pode enriquecer o chat do sistema sem substituir o card original.

Estratégia inicial:

- usar `preCreateChatMessage` para capturar targets atuais;
- salvar dados em flags próprias;
- usar hook de renderização de chat para adicionar bloco visual;
- não parsear HTML do sistema como fonte de verdade.

## Active Effects no Foundry v14

Foi observado erro relacionado a `applyActiveEffects`/fase `final` em testes no Foundry v14.

Decisão:

- não depender de Active Effects para ResourceEngine inicial;
- usar `actor.update` via adapter para PV/SAN/PE/PD na v0.1/v0.2;
- revisar Active Effects após correções do sistema para v14;
- tratar Active Effects como etapa própria, não base da automação inicial.

Situação na 0.44.0: o ResourceEngine continua alterando PV/SAN/PE/PD por `actor.update` via adapter. Active Effects nativos passaram a ser usados nas condições informativas e nos benefícios passivos de Aliados, com fases `initial`/`final` do v14 conferidas no código do Foundry 14.369 (ver [campos de bônus](#campos-de-bônus-usados-pelos-presets-de-active-effect)).

## Comunicação com a comunidade

Pontos combinados/assumidos:

- acompanhar board do GitHub do sistema;
- acompanhar chat de desenvolvimento do servidor;
- evitar retrabalho;
- contribuir com testes, issues ou PRs pontuais quando fizer sentido;
- manter Toolkit/FX como módulos opcionais, não concorrentes do sistema.
