# Roadmap do Paranormal Toolkit

Este roadmap organiza as próximas frentes do Paranormal Toolkit por prioridade prática, não por desejo. A regra é simples: primeiro estabilizar o que afeta mesa real, depois automatizar mais regras, depois deixar lindo.

## Legenda de prioridade

| Prioridade | Significado |
|---|---|
| P0 | Crítico para manter o que já existe funcionando. Correção de bug, regressão ou dívida que bloqueia desenvolvimento. |
| P1 | Próximo foco. Entrega com valor direto para uso em mesa ou para remover dependência de console/debug. |
| P2 | Importante, mas deve esperar o fluxo principal estabilizar. Normalmente precisa de arquitetura mais clara antes de virar UI. |
| P3 | Backlog futuro, polimento, integrações grandes ou frentes que dependem das anteriores. |

## Estado atual

Versão base do roadmap: `v0.17.9`.

O Toolkit já tem:

- automações por flags próprias do módulo;
- uso de item via hook `ordemparanormal.itemUsed`;
- modo `ask` com ações assistidas no chat;
- conjuração geral de rituais em ApplicationV2;
- formas estruturadas de ritual: Padrão, Discente e Verdadeiro;
- presets iniciais para Cicatrização e Eletrocussão, com Eletrocussão versionada em `1.3.0`;
- custo de PE/PD por ritual;
- rolagens próprias do Toolkit com integração opcional ao Dice So Nice;
- card de resultado no chat com dados brutos expansíveis pela fórmula da rolagem;
- metadados de ritual no cabeçalho do card usando badge de elemento/círculo e chips de custo, alvo, duração e resistência;
- bloco de resistência com coluna reservada para o botão d20, sem a descrição invadir a área da ação;
- card de item use com hidratação incremental separada em módulos menores por responsabilidade;
- popup de conjuração renderizado por `RitualCastDialogModel`;
- ritual genérico respeitando Discente/Verdadeiro marcados no item e custo extra por forma;
- card assistido persistente, com opção de substituir visualmente o card original do sistema;
- card simples persistente para rituais sem preset conhecido;
- ação de GM no menu da ficha para diagnosticar e aplicar presets de rituais;
- decisão documentada para uma futura camada opcional de Macro/Script Step, sem substituir o core estruturado.
- teste de Ocultismo na conjuração de rituais usando `actor.system.ritual.DT` e `actor.rollSkill`;
- falha no teste de Ocultismo não cancela o ritual e gera ação assistida para aplicar dano de SAN no conjurador;
- Condition Engine MVP com catálogo inicial de condições em TypeScript, Active Effects informativos aplicados direto no Actor, aliases em português para macros, duração por turno do afetado usando flags próprias, limpeza automática tardia/defensiva de condições temporárias expiradas e integração assistida inicial com Eletrocussão.

## Roadmap por prioridade

### Concluído em 0.12.0 — Ação de GM para aplicar presets pela ficha

Objetivo: tirar o fluxo normal do console.

Entrega feita:

- adicionar ação de GM na ficha do ator, idealmente no menu de ações/três pontinhos quando houver ponto de extensão limpo;
- aplicar o melhor preset conhecido em todos os rituais do ator;
- mostrar resumo de aplicados e ignorados;
- manter os comandos de debug atuais para desenvolvimento.

Critérios de aceitação:

- apenas GM vê ou executa a ação;
- Cicatrização e Eletrocussão recebem preset sem abrir console;
- rituais sem preset compatível são ignorados sem erro;
- o fluxo não depende de HTML frágil além do necessário.

Risco arquitetural:

- se o sistema não expor uma ação limpa na sheet, injetar botão por DOM pode ficar acoplado. Nesse caso, preferir uma integração pequena e bem isolada em `ui/` ou `adapters/ordem/`, com seletores mínimos e testes manuais claros.

### Concluído em 0.13.0 — Resistência assistida inicial

Objetivo: o Toolkit sugere as opções, mas o mestre decide o que aplicar.

Entrega feita:

- presets podem declarar opções de resistência ou modificação de dano;
- o card mostra dano normal e variações relevantes;
- uma ação escolhida desabilita a alternativa irmã para evitar dano duplicado;
- para Eletrocussão, mostra:
  - aplicar dano normal;
  - aplicar metade;
- futuramente suportar dobro, redução fixa, imunidade, vulnerabilidade ou outro multiplicador.

Exemplo de UX:

```txt
Dano: 18
Resistência: Fortitude reduz à metade

[Aplicar 18 de dano]
[Aplicar 9 de dano]
```

Decisão de produto:

- o Toolkit não deve escolher automaticamente o resultado da resistência neste momento;
- o mestre deve poder ignorar a sugestão e aplicar dano normal;
- o cálculo sugerido deve ser visível, mas não autoritário.







### Concluído em 0.17.9 — Duração do Toolkit sem expiração nativa

- Duração real das condições temporárias fica nas flags do Paranormal Toolkit.
- O ActiveEffect criado pelo Toolkit não recebe duração finita nativa do Foundry.
- Cleanup automático não usa mais `effect.duration.expired`/`remaining` para condições com duração especial do Toolkit.
- Condições de 1 rodada expiram no turno do combatente afetado, não na virada da rodada.
- Ícone do efeito é forçado no token com `showIcon`.

### Concluído em 0.17.8 — Duração por turno do afetado

Objetivo: alinhar condições de 1 rodada com a expectativa prática da mesa: o efeito permanece após a virada da rodada e sai no início do próximo turno do combatente afetado.

Entrega feita:

- deixa de usar a expiração nativa do Foundry para condições com duração em rodadas controladas pelo Toolkit;
- registra round, turno, iniciativa e combatente afetado nas flags do Active Effect;
- ações assistidas de ritual ancoram a duração no ator que recebeu a condição;
- o cleanup defensivo remove o efeito quando chega no turno do afetado após o número de rodadas solicitado;
- mantém fallback seguro fora de combate, onde duração por rodadas é ignorada com aviso.

Critérios de aceitação:

- conjurar Eletrocussão em combate e aplicar Vulnerável deve manter o efeito até voltar no turno do conjurador;
- virar a rodada antes do turno do conjurador não deve remover o efeito;
- ao chegar no turno do conjurador na rodada seguinte, o efeito deve sair da ficha automaticamente;
- o comportamento deve continuar sem erro de `EmbeddedCollectionDelta`.

### Concluído em 0.17.5 — Catálogo inicial de condições

Objetivo: criar o vocabulário base do `ConditionEngine` antes de automatizar mais rituais e regras.

Entrega feita:

- adiciona um catálogo inicial com 34 condições informativas;
- mantém um arquivo por condição para facilitar evolução futura;
- usa IDs canônicos em inglês/código e aliases em português sem acento;
- mantém labels em português no Active Effect exibido ao jogador;
- não copia textos oficiais e não adiciona mecânica automática ainda;
- preserva `vulnerable` como ID principal de Vulnerável, mantendo compatibilidade com a Eletrocussão.

Critérios de aceitação:

- `ParanormalToolkit.conditions.list()` deve listar o catálogo completo;
- `ParanormalToolkit.conditions.get("vulnerable")` e `get("vulneravel")` devem resolver a mesma condição;
- aplicar condições novas pelo console deve criar Active Effect informativo sem `changes`;
- remover por alias em português deve remover o efeito canônico quando o ator tiver permissão;
- Eletrocussão continua aplicando `vulnerable` por 1 rodada.

### Concluído em 0.17.4 — Eletrocussão aplica Vulnerável assistido

Objetivo: plugar o `ConditionEngine` validado em uma automação real sem automatizar ainda a decisão da resistência.

Entrega feita:

- adiciona `conditionApplications` ao modelo de automação;
- atualiza o preset de Eletrocussão para `1.3.0`;
- Eletrocussão cria uma ação assistida **Vulnerável: 1 rodada** no alvo;
- o card mostra a ação em uma seção **Aplicar efeito**, perto das ações de dano;
- a ação usa o `ConditionEngine` e cria `ActiveEffect` no Actor alvo;
- a duração é sempre 1 rodada, independente de Padrão, Discente ou Verdadeiro;
- a decisão de clicar no efeito continua manual, porque o Toolkit ainda não usa o resultado da Fortitude para escolher automaticamente.

Critérios de aceitação:

- reaplicar o preset de Eletrocussão deve marcar a automação como `1.3.0`;
- usar Eletrocussão deve mostrar dano normal/metade e também **Vulnerável: 1 rodada**;
- clicar em Vulnerável aplica o Active Effect no alvo;
- em combate, o efeito expira e sai da ficha via cleanup automático;
- Padrão, Discente e Verdadeiro usam o mesmo efeito de 1 rodada.

### Concluído em 0.17.3 — Cleanup automático tardio de condições temporárias

Objetivo: fazer condições temporárias expiradas sumirem da ficha automaticamente sem voltar à corrida com o ciclo interno do Foundry.

Entrega feita:

- reintroduz cleanup automático usando `combatTurnChange`, hook pós-update do combate;
- agenda cleanup com atraso e debounce para evitar corrida com o processamento interno de Active Effects;
- executa o cleanup automático apenas no cliente GM conectado;
- mantém revalidação do efeito no Actor antes da remoção;
- mantém o comando manual `ParanormalToolkit.conditions.cleanupExpired()` como fallback/debug.

Critérios de aceitação:

- `Vulnerável` com `{ duration: { rounds: 1 } }` deve sair da ficha automaticamente alguns instantes depois de expirar;
- avançar rodada não deve disparar erro de `EmbeddedCollectionDelta`;
- efeitos sem duração continuam intactos;
- cleanup manual continua funcionando.

### Concluído em 0.17.2 — Cleanup defensivo de condições temporárias

Objetivo: evitar corrida entre o cleanup do Toolkit e a expiração nativa de Active Effects temporários pelo Foundry durante avanço de combate.

Entrega feita:

- remove cleanup automático no hook `updateCombat`;
- mantém cleanup manual via `ParanormalToolkit.conditions.cleanupExpired()`;
- mantém cleanup tardio em `ready` e ao deletar combate;
- revalida o Active Effect no Actor antes de deletar;
- ignora de forma segura erros de efeito já removido pelo Foundry.

Critérios de aceitação:

- avançar rodada com `Vulnerável` de 1 round não deve disparar erro de `EmbeddedCollectionDelta`;
- se o Foundry remover o efeito sozinho, o Toolkit não tenta remover de novo no mesmo ciclo;
- cleanup manual continua funcionando para efeitos temporários que ficarem sobrando;
- efeitos sem duração continuam intactos.

### Concluído em 0.17.1 — Limpeza de condições expiradas

Objetivo: garantir que condições temporárias do Toolkit não fiquem poluindo a ficha depois que o Foundry deixa de exibir o ícone no token.

Entrega feita:

- Active Effects temporários criados pelo `ConditionEngine` recebem flags `deleteOnExpire` e `expiresWithCombat`;
- `ConditionEngine.cleanupExpiredConditions()` varre apenas efeitos criados pelo Toolkit;
- hooks de ciclo de vida evitam o avanço de combate e deixam o Foundry conduzir a expiração nativa;
- ao deletar um combate, efeitos temporários vinculados a ele são removidos;
- `ParanormalToolkit.conditions.cleanupExpired()` fica disponível para teste manual via console/macro.

Critérios de aceitação:

- `Vulnerável` sem duração continua até remoção manual;
- `Vulnerável` com `{ duration: { rounds: 1 } }` é removido ao expirar;
- a limpeza não remove Active Effects de outros módulos ou efeitos sem flags do Toolkit;
- o comando manual de cleanup retorna um resumo com efeitos varridos/removidos.

### Concluído em 0.17.0 — Condition Engine MVP

Objetivo: criar o esqueleto limpo para condições antes de integrar com rituais, ataques ou regras automáticas.

Entrega feita:

- criação de `ConditionEngine` separado dos workflows de ritual;
- registry de condições em TypeScript;
- primeira condição base: `Vulnerável`;
- aplicação de condições como `ActiveEffect` diretamente no ator alvo;
- flags próprias do `paranormal-toolkit` para `conditionId`, origem, versão da definição, usuário e duração solicitada;
- suporte a duração por rodada quando há combate ativo;
- API de desenvolvimento em `ParanormalToolkit.conditions` para testar via console/macro;
- sem integração automática com Eletrocussão ainda.

Critérios de aceitação:

- selecionar token e rodar `ParanormalToolkit.conditions.applyToSelectedTokens("vulnerable")` cria o efeito sem duração;
- selecionar token em combate e rodar `ParanormalToolkit.conditions.applyToSelectedTokens("vulnerable", { duration: { rounds: 1 } })` cria/atualiza o efeito com duração de 1 rodada;
- o ícone do Active Effect aparece no token pelo comportamento nativo do Foundry;
- `ParanormalToolkit.conditions.removeFromSelectedTokens("vulnerable")` remove somente efeitos criados pelo Toolkit com esse `conditionId`.


### Concluído em 0.16.8 — Corrige fórmulas da Eletrocussão

- O preset de Eletrocussão foi atualizado para a versão `1.2.0`.
- As fórmulas passam a ser Padrão `3d6`, Discente `6d6` e Verdadeiro `8d6`.
- O diagnóstico de presets deve marcar itens com Eletrocussão `1.1.0` como desatualizados para reaplicação pelo GM.

### Concluído em 0.16.7 — Ação contextual de SAN na conjuração

- A ação assistida de dano na SAN por falha no Ocultismo passa a ser renderizada no cabeçalho da seção **Conjuração**.
- O status `Falha` fica junto do título da seção, e o botão contextual fica isolado à direita.
- A seção separada “Dano na sanidade” deixa de aparecer para essa consequência específica.

### Concluído em 0.16.6 — Falha de conjuração causa dano de SAN

- A falha no teste de Ocultismo deixa de interromper o workflow do ritual.
- Dano, cura, resistência e demais ações assistidas continuam aparecendo mesmo quando a conjuração falha.
- Quando há falha, o Toolkit cria uma ação assistida de dano na SAN contra o conjurador.
- O valor da SAN sugerida usa o custo final da forma conjurada: base, Discente ou Verdadeiro.

### Concluído em 0.16.5 — Estado explícito de conjuração

- O popup mantém a forma selecionada e a opção de gastar recurso no estado da aplicação além dos inputs escondidos/visuais.
- O fluxo de conjuração passa a normalizar `spendResource` antes de preparar custo, rolagem e card.
- Quando “Gastar ao conjurar” está desmarcado, steps de custo e custo extra de forma são ignorados mesmo se o ator estiver com 0 PE/PD.

### Concluído em 0.16.3 — Seleção robusta de forma no popup de conjuração

- O popup passa a sincronizar explicitamente o card clicado com o radio escondido da forma.
- Discente e Verdadeiro voltam a chegar corretamente no fluxo de conjuração.
- O custo final da forma escolhida passa a ser respeitado ao gastar PE/PD.

### Concluído em 0.16.2 — Correção visual do popup de conjuração

- O estilo novo dos cards de forma também passa a existir no stylesheet de workflow já carregado pelo módulo.
- O radio visual deixa de aparecer nos cards de forma.
- O custo da forma permanece alinhado ao lado do nome, evitando altura desperdiçada.

### Concluído em 0.16.1 — DialogModel do popup de conjuração

Objetivo: preparar o fluxo de ritual genérico para evoluir sem duplicar lógica de UI.

Entrega feita:

- criação do `RitualCastDialogModel` como estado único de renderização do popup;
- separação entre disponibilidade da forma e automação da forma;
- rituais genéricos passam a habilitar Discente/Verdadeiro a partir de `item.system.studentForm` e `item.system.trueForm`;
- custo final por forma passa a funcionar no genérico, incluindo base + 2 para Discente e base + 5 para Verdadeiro;
- a pílula de PE fica ao lado do nome da forma;
- o radio visual dos cards de forma fica escondido, mantendo o card como indicação visual de seleção.

Critérios de aceitação:

- Eletrocussão continua exibindo Padrão, Discente e Verdadeiro com 1 PE, 3 PE e 6 PE;
- ritual sem preset com Discente marcado no item mostra Discente habilitado;
- ritual sem preset com Verdadeiro marcado no item mostra Verdadeiro habilitado;
- escolher Discente/Verdadeiro em ritual genérico gasta o custo final correto quando o gasto está marcado;
- cards de forma não exibem mais a bolinha/radio visual.

### Concluído em 0.16.0 — Refactor interno do card de item use

Objetivo: preparar a base para melhorar o ritual genérico sem continuar acumulando leitura de flags, manipulação de DOM, metadados, resistência e dados de rolagem em um único arquivo.

Entrega feita:

- extração do ponto de entrada de enhancers do card para `src/features/item-use/chat-card/`;
- separação de responsabilidades entre registro/hydration, utilitários DOM, rolagens expansíveis, metadados de ritual, layout de resistência e remoção de detalhes legados;
- manutenção do entrypoint antigo `registerItemUseWorkflowDiceToggle` como delegador para evitar mexer em `main.ts` nesta etapa;
- nenhuma mudança funcional intencional no card: Eletrocussão, Cicatrização, rituais sem preset, F5 do chat e botões assistidos devem continuar iguais.

Critérios de aceitação:

- Eletrocussão Padrão/Discente/Verdadeiro continua exibindo o mesmo card;
- Cicatrização continua exibindo cura e botões esperados;
- ritual sem preset continua abrindo o fluxo genérico atual;
- dados da rolagem continuam escondidos por padrão e abrem ao clicar na fórmula;
- metadados de ritual continuam no cabeçalho do card;
- bloco de resistência continua com coluna reservada para o botão d20.

### Concluído em 0.15.6 — Layout do bloco de resistência

- O bloco de resistência passa a reservar uma coluna própria para o botão de rolagem.
- O título, a descrição e o resultado da resistência ficam agrupados na coluna esquerda.
- A descrição não atravessa por baixo do botão d20, mantendo leitura e clique mais previsíveis em cards estreitos.

### Concluído em 0.15.3 — Card de ritual mais compacto

- O bloco de detalhes duplicados das seções de workflow foi removido visualmente.
- A fórmula da rolagem virou o controle de expansão dos dados brutos.
- O card fechado mantém apenas o essencial: seção, status, resumo, fórmula e total.
- O card aberto mostra somente as pílulas dos dados rolados, sem repetir resultado, DT ou fórmula.


### Concluído em 0.15.5 — Metadados fora do workflow

- Os chips de custo, alvo, duração e resistência passam a ficar no cabeçalho do card, abaixo do resumo de origem → alvo selecionado.
- O workflow deixa de ser esticado por metadados do ritual; ele fica reservado para conjuração, dano/cura/efeito e resistência assistida.
- O badge de elemento/círculo mantém cor por elemento: Energia, Sangue, Morte, Conhecimento e Medo.

### Concluído em 0.15.4 — Hierarquia visual do card de ritual

- O elemento/círculo do ritual passa a aparecer como badge principal abaixo do nome do ritual.
- As tags de regra ficam acima do workflow: custo gasto, alvo, duração e resistência.
- A tag de forma foi removida porque a forma já aparece no título do card.
- As cores dos elementos seguem a identidade visual do sistema: Energia roxo, Sangue vermelho, Morte escuro, Conhecimento dourado e Medo cinza/prata.
- A leitura de alvo, duração, resistência e elemento usa dados estruturados do `chatCard` e do `item.system`, não scraping do HTML do card original.

### Concluído em 0.15.0 — Teste de Ocultismo em rituais

- Rituais conjurados pelo Toolkit agora podem rolar Ocultismo antes de resolver dano, cura ou efeitos.
- A DT é lida de `actor.system.ritual.DT`, que já é calculada pelo sistema Ordem.
- A rolagem usa `actor.rollSkill({ skill: "occultism" })` via adapter do sistema, mantendo a regra nativa fora do core do Toolkit.
- Se a conjuração falhar, o card registra a falha e não cria botões de aplicação de dano/cura.
- O resultado de conjuração entra em `flags.paranormal-toolkit.chatCard` junto do restante do workflow.
- Existe setting de mundo para desativar o teste se a mesa quiser continuar no fluxo simplificado.

### Concluído em 0.14.3 — Dialog geral de ritual em ApplicationV2

Objetivo: transformar o Toolkit no ponto de entrada da conjuração de rituais, mesmo quando ainda não existe preset de automação para aquele ritual.

Entrega feita:

- substituir o popup legado por uma `ApplicationV2`;
- abrir a tela para qualquer item do tipo ritual no modo `ask`;
- usar layout compacto com formas em cards lado a lado;
- mostrar forma, custo final, conjurador e alvos;
- manter Padrão/Discente/Verdadeiro como modelo estruturado, mas só habilitar formas com dados conhecidos;
- exibir custo final por forma, sem texto de `+2 PE`/`+5 PE`;
- para ritual com preset, seguir o workflow assistido existente;
- para ritual sem preset, gastar custo base quando escolhido e registrar conjuração em card persistente.

Critérios de aceitação:

- clicar em Eletrocussão continua abrindo popup e criando card com dano/resistência;
- clicar em ritual sem preset abre o mesmo popup visual;
- se gastar recurso, o custo base é aplicado;
- se não gastar recurso, o card registra `não gasto`;
- F5 mantém o card simples ou assistido, conforme `flags.paranormal-toolkit.chatCard`;
- Discente/Verdadeiro não exibem custo extra inventado quando não houver preset/configuração.

### P2 — Condition Engine MVP

Objetivo: criar uma base própria para condições sem depender de texto de descrição ou de uma condição oficial inexistente/instável no sistema.

Entrega inicial:

- aplicar condições como Active Effects informativos gerenciados pelo Toolkit;
- usar flags próprias para identificar condição, origem, duração e versão da definição;
- suportar duração simples em rodadas/cena quando possível;
- permitir botões de chat para aplicar condição quando o preset pedir;
- começar com poucas condições bem modeladas.

Condições candidatas:

| Condição | MVP informativo | Regra futura |
|---|---:|---|
| Atordoado | Sim | Impedir ações e/ou aplicar efeitos relacionados quando houver motor confiável. |
| Abalado | Sim | Penalidade configurável em testes de perícia; reaplicar na mesma cena evolui para Apavorado. |
| Apavorado | Sim | Penalidade configurável em testes de perícia e aviso de comportamento obrigatório. |

Decisão importante:

- no MVP, condição é principalmente estado rastreável e visível;
- penalidade automática só entra quando o Toolkit tiver integração confiável com testes de perícia;
- não tentar automatizar penalidades mexendo em paths frágeis ou incompletos.

Modelo conceitual:

```ts
type ToolkitConditionDefinition = {
  id: string;
  label: string;
  category: "mental" | "physical" | "paranormal" | "other";
  defaultDuration?: {
    kind: "rounds" | "scene" | "unlimited";
    value?: number;
  };
  escalation?: {
    whenAppliedAgain: string;
    scope: "scene" | "combat" | "actor";
  };
};
```

Estrutura sugerida:

```txt
src/features/conditions/
  condition-definition.ts
  condition-engine.ts
  condition-effect-factory.ts
  condition-application-service.ts
  condition-registry.ts
```

### P2 — Permissões e visibilidade no chat
