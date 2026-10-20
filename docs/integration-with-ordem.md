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

Referência de implementação: Ordem 8.0.2, commit **9aaa634**, e Foundry **14.369**. O vínculo explícito do preset fica na flag **attackModifier** da habilidade, no namespace do Toolkit. O gerenciador reconhece Tiro Intuitivo pelo nome somente para sugerir sua aplicação; o ataque usa o vínculo persistido e exige uma arma compatível à distância. Classe, Pontaria e NEX não são validados como requisitos de aquisição. Nenhuma arma específica identifica a regra.

**Configurador geral.** O botão Ataque do chat abre a mesma ApplicationV2 para armas `armament` com Actor e campos nativos de ataque, mesmo sem presets. A entrada direta de `rollAttack()` mantém a exigência de preset elegível para abrir o popup; o modo desativado continua respeitado. O retorno separa `generalActions` e `presets`, mantendo as opções dos presets no contrato anterior. O `use` do Tiro Intuitivo controla a seleção compacta; somente sua subopção é exibida no card expandido. Selecionar Mirar limpa todas as opções de Tiro Intuitivo e selecionar Tiro Intuitivo limpa Mirar. A fronteira de execução revalida essa exclusão.

**Ações gerais.** `system.types.rangeType.name === "ranged"` habilita Mirar declarativo, sem efeito numérico ou estado futuro. Rajada exige adicionalmente `system.types.rangeType.subRangeType === "fire"` e `system.conditions.automatic === true`. O resolver puro fornece a contribuição ao mesmo compositor dos presets, sem registrar ações no gerenciador. O adapter identifica o dado adicional exclusivamente em `system.formulas.damage.formula` no formato `NdM` e preserva o tipo principal. Base ambígua desabilita somente Rajada no popup.

**Consolidação de dados.** Cada opção pode contribuir com `attackDiceModifier`, inteiro com sinal, e `bonusWeaponDamageDice`, inteiro não negativo. O compositor soma as contribuições de todas as habilidades selecionadas e das ações gerais antes da preparação e conserva as parcelas para apresentação. Um único card mostra a conta, como `−1d20 + 2d20 = +1d20`; apenas o saldo é aplicado ao pool, uma vez. Escolhas que se anulam mostram a conta com `0d20` e preservam o Roll nativo; sem contribuições, o card é omitido. O pool `2d20kl` com bônus `+1d20` passa a `1d20kh`, e com `+2d20` a `2d20kh`. Dados adicionais compatíveis usam as faces/tipo da base da arma e mostram as parcelas e a quantidade acumulada no mesmo card de dano.

**Presets da Etapa 2.** `attack.ataqueEspecial` v1.0.0, `attack.disparoDaMorte` v1.1.0 e `attack.disparoLetal` v1.0.0 reutilizam registry, vínculo e gerenciador compartilhados. Letal reconhece o nome nativo `NEX 40% - Disparo Letal`. A aplicação grava somente a flag de vínculo, conservando custo nativo, descrições e configurações manuais. Aquisição não é validada. Morte segue a regra 1.1 do projeto, mesmo que o Item informe 3 PE.

**Validação da Etapa 2 (19/10/2026).** `npm run check` passou com ambas as referências habilitadas: 119 suites, 1.311 testes, typecheck e build. O harness de ataque agora executa `BasicRoll.constructParts()` real do Ordem, incluindo o bônus da arma. Regressões cobrem patamares de progressão, todas as distribuições, bônus fixo fora do crítico normal/forçado, parcelas e Rajada, custos PE/PD, penetração 20 RD sem crítico, exclusões antes da execução, serialização e compatibilidade v1/v2/v3/v4. A fixture usa ApplicationV2 substituída e controles reais: passou em janela padrão de 540 px, 460 × 640 e 320 × 640, com foco, limite, rodapé acessível e sem overflow horizontal; no modo estreito os steppers empilham. Smoke com GM e jogador em mundo Foundry permanece pendente: a porta local 30000 recusou conexão. As fontes nativas nos testes não comprovam banco/socket de um mundo real.

**Configuração e progressão.** `resolveAttackConfiguration()` é o resolver puro compartilhado pelo ViewModel e execução. `AttackConfigurationSelection.specialAttack` contém `attackBlocks`/`damageBlocks`; o resolver valida, materializa a contribuição numa cópia local do preset e usa o compositor existente. `attackBonus` e `damageBonus` são inteiros não negativos separados dos dados adicionais. O adapter lê `globalProgressRules`: 1 usa `system.NEX.value` (patamares 5/25/55/85), 2 usa `system.nivel.value` (1/5/11/17). Não usa `_progress`, classe ou estágio. Limites de 1/2/3/4 blocos custam 2/3/4/5 PE ou PD; seleção vazia bloqueia confirmar sem conceder bônus ou gasto. A execução revalida vínculos, arma, progressão e saldo após o diálogo.

**Bônus fixos.** O clone de ataque recebe o bônus em `system.formulas.attack.bonus`, preservando a expressão anterior entre parênteses. O nativo continua construindo e avaliando o teste; Rajada prepara o pool pelo bridge existente. O clone de dano acrescenta `[bônusFixo, tipoPrincipal]` em `system.formulas.damage.parts`, depois dos dados adicionais. Somente a base é multiplicada pelo nativo: `2d6`, x3, Rajada e +10 geram `6d6+(1d6)+(10)`. O bônus fixo não exige base `NdM`; essa restrição continua pertencendo aos dados adicionais. O snapshot guarda `flatDamageType`; mudança do tipo principal bloqueia o bônus antes de rolar. Nenhum update é feito na arma ou em efeitos do Actor.

**Condições dos disparos.** Morte exige `armament`, `rangeType.name === "ranged"` e `subRangeType` em `fire`/`shoot`. A opção `use` custa 2 e soma +2 de ameaça; `affinity` depende de `use` e acrescenta 10 de penetração no grupo `death-shot`, com `highest`. O grupo atual `intuitive-shot` permanece separado: os dois somam até 20 RD por decisão do projeto. Afinidade é manual e inicialmente falsa; cobertura leve gera somente informação persistente. Letal exige arma à distância e Mirar, custa 1 e soma +2 de ameaça. Desmarcar Mirar ou selecionar Intuitivo remove Letal; a condição também é validada antes de rolar/gastar. O custo é registrado neste ataque, sem rastrear a ação anterior ou turnos.

**Uso e execução.** Usar a arma cria o card; a rolagem ocorre depois, por **rollAttack()**. O adapter mantém a expansão nativa de ataques/alvos e abre o diálogo somente em chamadas efetivas. Um **useId** identifica cada acionamento do card; cada chamada observada recebe seu próprio **executionId**, snapshot, custo e alvo. Não existe um gerenciador de sequências do Toolkit. O cancelamento retorna uma entrada sem roll e com erro explícito para que o agregador nativo não a interprete como ataque sem alvo.

**Publicação e preparação.** Instâncias efêmeras mantêm a identidade da arma e os overrides de **isCritical()** e **getRollData()**. O bridge envolve **Roll.evaluate()** e **Roll.toMessage()**, atuando exclusivamente sobre marcadores presentes no registro interno. A preparação dos modificadores de dados ocorre uma vez antes de avaliar, quando o saldo é diferente de zero, e altera apenas `number` e `modifiers` do primeiro termo d20, recompilando com `resetFormula()`. Mantém o mesmo Roll e todos os bônus; para a penalidade de Rajada: `3d20kh → 2d20kh`, `1d20kh → 2d20kl`, `2d20kl → 3d20kl`. O nativo reduz qualquer atributo abaixo de 1 a `2d20kl`; não corrigimos esse comportamento. Formato inesperado falha antes da avaliação e gasto. A publicação adiciona **attackExecution** à criação original. O ID da mensagem é capturado mesmo sem alvo, quando o nativo não fornece **hitResult**. A arma e seus efeitos permanecem intactos. Flags nativas de visibilidade e reação são preservadas.

**Dano individual.** A flag **attackModifierState** do card aponta para as execuções do acionamento atual. O resolver reidrata cada mensagem por ID, confere a identidade e consulta seu resultado nativo atualizado. O método **rollVolleyDamage()** original continua filtrando e percorrendo as entradas; sua chamada interna de **rollDamage()** é interceptada pelo **attackMessageId** para fornecer o multiplicador daquela execução. A publicação recebe **attackDamage** com alvo, penetração e resultado próprios. A mesma integração atende uma única entrada. O retorno agregado externo nunca fornece o snapshot individual.

**Dano adicional.** O snapshot guarda faces e tipo do dado adicional e a quantidade consolidada. A cópia efêmera de dano recebe uma única parte `["NdM", tipoPrincipal]`, sendo N a soma das contribuições; a base permanece intacta. O nativo multiplica somente a base no crítico e soma essa parte depois, inclusive com Alt: `2d6`, x3 e três dados adicionais geram `6d6+(3d6)`. Atributo e partes extras são preservados; dano misto continua manual. Faces ou tipo principal diferentes do snapshot bloqueiam a resolução antes de rolar; o dano-base restante mantém a política nativa. Dano publicado continua sendo reutilizado, sem nova rolagem.

**Sem alvo e atualizações.** Uma entrada sem alvo pode rolar dano, mas não afirma acerto nem oferece aplicação assistida. Cancelamentos e falhas anteriores à publicação não geram dano. Referências incompletas ou incertas bloqueiam a resolução. Um guard de **preUpdateChatMessage** impede que a busca nativa pelo último card com o mesmo item sobrescreva outro card ou outro acionamento. Atualizações de reações atualizam a apresentação do card explicitamente vinculado, por uma fila de mutação que relê a revisão vigente.

**Recursos.** A seleção PE/PD reutiliza a configuração Sem Sanidade. O gasto usa **ResourceEngine**, uma vez por execução, após avaliação e imediatamente antes de publicar. Uma criação vetada de forma confirmada permite compensação se o saldo ainda corresponder ao débito. Exceções de atualização/publicação podem representar resposta perdida após commit: a execução fica incerta, sem repetição automática. Publicações anteriores válidas não são desfeitas quando um ataque posterior falha.

**Aplicação de RD.** O botão assistido é manual e exclusivo do GM executor eleito pelo mesmo helper compartilhado com Aliados. O caminho nativo de aplicação é omitido nas mensagens gerenciadas. O serviço revalida acerto, reação, alvo e resultado persistido antes de delegar ao **DamageEngine**. Para penetração positiva, o adapter calcula **max(0, RD do tipo + RD adicional − penetração)** e chama **actor.applyDamage(danoBruto, { ignoreRD: true, extraRD: residual })**. O dano bruto não é aumentado e PV continua sendo atualizado pelo sistema. Os parâmetros novos são opcionais; o caminho anterior permanece quando não há penetração.

A eleição converte **game.users** em array antes de usar operações de Array: a coleção nativa do Foundry não oferece **flatMap()**. O teste de referência do card usa a Collection real do v14, passa pelos hooks de renderização e pelo clique de aplicação, cobrindo exibição ao GM, penetração de RD, alvo original e reapresentação sem aplicação duplicada.

**Persistência e idempotência.** **attackExecution** usa schema 4, com ações gerais, saldo assinado `attackDiceModifier`, quantidade `bonusWeaponDamageDice`, descritor `bonusDamageDie`, bônus fixos resolvidos, `flatDamageType` e distribuição em `selected[].parameters` para Ataque Especial. O leitor aceita v1/v2/v3: v1 recebe ações falsas e contribuições de dados zero; v2 converte `attackDicePenalty` para o saldo negativo e `burstDamage` para o descritor genérico, após validar o contrato antigo; todos recebem bônus fixos zero e tipo nulo. A normalização é em memória, sem consultar presets atuais ou regravar flags ao renderizar; uma mutação posterior pode salvar v4. **attackModifierState** e **attackDamage** permanecem em 1, sem mudanças nos schemas de rituais/habilidades. Um resultado publicado é reutilizado; estado de execução sem confirmação impede replay após reload. A aplicação também tem claim e recibo persistidos. Filas locais e flags não constituem transação distribuída; mudanças de executor/conexão com efeito incerto exigem conferência manual. O estado de um novo acionamento substitui o vínculo ativo do card, inclusive em cancelamentos, e não procura modificadores pelo último uso da arma. Mensagens antigas conservam seus vínculos individuais. Conteúdo original é preservado diante de flags inválidas.

As listas opcionais `attackDiceContributions` e `bonusWeaponDamageContributions` preservam as parcelas nos snapshots v3/v4 para apresentar a conta após reload. Quando presentes, o leitor exige inteiros válidos e soma idêntica ao saldo persistido. Mensagens anteriores sem essas listas mostram somente o total conhecido; não se inventam parcelas nem se consultam presets atuais.

Mensagens renderizadas antes do registro dos hooks são reidratadas uma vez na inicialização. Cards com botão nativo de ataque reutilizam `OrdemItem.chatListeners()` para recuperar a delegação nativa; resumos e ações do Toolkit são remontados pelo mesmo controller idempotente usado nos hooks. Nenhuma flag é regravada por essa recuperação.

**Validação.** As suites de referência de modificadores executam os métodos reais de ataque, crítico, volley, dano, aplicação e reações com banco/Document base/aleatoriedade substituídos. Uma suite separada executa **Roll.toMessage()** real do Foundry v14. Cobrem crítico pago/gratuito no mesmo uso, acerto não crítico com penetração, cancelamentos, alvos diferentes/ausentes, índices nativos nulos, reabertura, mensagens intercaladas e falhas parciais. Isso não comprova banco/socket de um mundo real. A fixture de navegador **tests/browser/attack-modifiers.html**, servida por Vite, usa a ApplicationV2 substituída e o diálogo/renderer reais para conferir visual, confirmação e cancelamento.

**Validação de ações gerais e consolidação.** Testes adicionais cobrem elegibilidade, exclusão bidirecional, soma e anulação de contribuições, pools nativos positivos/negativos, dano extra consolidado fora do crítico, recuperação e normalização v1/v2/v3, mudanças incompatíveis da arma e sequência nativa. O teste do bridge usa `Roll.evaluate()`, termos e regras de keep reais do Foundry, fornecendo os termos/AST e resultados determinísticos, para conferir quantidade, seleção do maior/menor, identidade e avaliação única. A fixture verifica seleção, custo, exclusão, foco, limpeza, Rajada, confirmação, cancelamento e soma de habilidades fictícias, além de oferecer arma sem presets, corpo a corpo e muitas opções.

**Smoke em mundo real (19/10/2026).** No mundo de testes Paranormal dev, Foundry 14.369 e Ordem 8.0.2, GM e Player2 conectados simultaneamente validaram abertura sem presets (Acha e Pistola), elegibilidade de Mirar/Rajada, exclusão com Tiro Intuitivo, cancelamento/fechamento, teclado, gasto único de 2 PE ou 2 PD, bloqueio por saldo insuficiente e publicação entre clientes. A Rajada nativa produziu `2d20kh + 10 + 5 + 5`; os danos críticos produziram `6d10 + 5 + (1d10)` e `8d10 + 5 + (1d10)` com Tiro Intuitivo pago e Alt. O dano permaneceu ligado a Mercy após desmarcar o alvo; aplicação manual debitou 39 PV uma vez e manteve o botão desabilitado após reload. Uma reação pendente bloqueou a rolagem de dano, e a Esquiva enviada pelo jogador atualizou a Defesa no GM. O teste revelou e corrigiu a reidratação inicial descrita acima.

Outra Rajada com total 33 acertou a Defesa 13; a Esquiva enviada por Player2 elevou a Defesa para 48, mudou o resultado para falha e impediu a rolagem de dano. Os valores temporários do defensor, os recursos consumidos e a configuração PE/PD foram restaurados após os testes. A janela real também foi redimensionada para 420 × 500: seletores em uma coluna, conteúdo com rolagem interna e rodapé acessível.

PE/PD, Esquiva convertendo acerto em erro, dados d6/d10/d12, alterações incompatíveis da arma, sequência nativa e falhas de publicação também têm regressões automatizadas com fontes nativas. A fixture foi conferida em 460 × 640, com rolagem interna, rodapé acessível e preservação de foco. Dano misto, ausência de alvo, Mirar declarativo e limites de gasto por rodada conservam os limites descritos no README.

## Gerenciamento de presets específicos

A aplicação existente de presets reúne rituais e habilidades por meio de **PresetManagerService**, que agrega os diagnósticos e encaminha a aplicação aos serviços existentes. Não há catálogo universal, associação manual ou unificação dos motores. Nos rituais, somente presets com reconhecimento específico por nome entram no gerenciamento; o ID de um vínculo aplicado tem prioridade sobre o nome atual. Presets genéricos permanecem nos fluxos próprios.

O acesso usa **Actor.testUserPermission(user, "OWNER")** e **canUserModify(user, "update")**, com revalidação por Item antes das escritas. GM e OWNER podem abrir a janela mesmo em Actors sem itens. Habilidades concedidas e compêndios bloqueados conservam suas proteções. Rituais mantêm **AutomationBinder**, **itemPatch** e seus schemas atuais; habilidades de ataque mantêm **attackModifier**. Automações manuais e dados inválidos não são substituídos pelo reconhecimento por nome. Não há migração ou escrita ao diagnosticar.

A aplicação de ritual continua com as chamadas de persistência existentes, sem transação ou merge histórico. O **itemPatch** conserva os campos declarados pelo preset, inclusive o nome quando presente, e não altera descrições ou flags de configurações genéricas. Falhas exigem conferir o item antes de tentar novamente. Configurar presets não altera snapshots de ataques ou cards já publicados.

## Evento público de ataque publicado

Disponível desde a versão **0.48.0**. A integração visual foi testada manualmente
no Foundry e confirmada pelo usuário antes desta release.

`paranormal-toolkit.attack.published` comunica uma publicação individual confirmada
de ataque com arma `armament`. O hook é local ao cliente executor; não é um evento
de rede, não cancela o ataque e não aguarda efeitos visuais. Consumidores devem
executar somente quando `event.userId === game.user.id`. O Paranormal FX utiliza
esse contrato e deixa a propagação visual a cargo do Sequencer.

```ts
type AttackTokenReference = {
  sceneId: string;
  tokenId: string;
  tokenUuid: string;
  actorUuid: string | null;
};

type AttackPublishedEvent = {
  version: 1;
  actionId: string;
  messageId: string;
  userId: string;
  item: { uuid: string; name: string; type: "armament" };
  source: AttackTokenReference | null;
  target: AttackTokenReference | null;
  visibility: "public" | "private";
};
```

Um acionamento externo recebe um contexto efêmero em um `Symbol` nas opções de
`rollAttack()`. A expansão nativa preserva esse contexto por `...options`: várias
mensagens podem compartilhar `actionId`, mas cada `messageId` é emitido uma vez.
O retorno agregado não é outra publicação. Consumidores que desejem um efeito
por acionamento devem reservar `actionId` antes de iniciar operações assíncronas.
Não existe replay ao renderizar, atualizar ou recarregar o chat.

O caminho gerenciado emite após a confirmação de `resources.publish()` e antes
da atualização auxiliar do card. Nome e alvo vêm do snapshot original. O caminho
nativo, inclusive com automação mecânica desativada, observa o retorno original,
confere `messageRoll.type`, `itemUuid` e a mensagem correlacionada por
`hitResult.attackMessageId`. Sem esse ID, `lastAttackMessageId` somente é aceito
quando mudou e a rolagem persistida corresponde ao retorno da chamada.

A origem vem do token do `speaker`, conferido contra o Actor da arma no canvas.
O alvo gerenciado preserva a referência do snapshot. O alvo nativo forçado é
conferido contra o Actor publicado. Nos demais ataques nativos, só se resolve o
Actor publicado quando há um único token correspondente na cena de origem;
múltiplos tokens vinculados ao mesmo Actor deixam `target: null`. Não se consulta
a seleção atual do usuário após o ataque. Referências indisponíveis também são
nulas, permitindo ao consumidor omitir o efeito com segurança.

`visibility` considera os campos finais `whisper` e `blind`. O payload não contém
Documents, defesa, resultado, crítico ou estado da reação. Ataques privados ainda
podem emitir o contrato local, mas consumidores precisam respeitar sua visibilidade;
o FX os ignora. O evento não aplica dano, condições ou gasto adicional.

Cancelamento, criação vetada e publicação incerta não emitem eventos. Uma
publicação gerenciada confirmada não perde seu evento se a atualização posterior
do card falhar. Exceções nativas sem confirmação confiável não produzem efeito.
Falhas de observação ou de listeners não alteram o retorno nem a contabilidade
de recursos. Não foram adicionadas flags persistidas nem migrações de cards.

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
