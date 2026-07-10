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

Versão atual documentada: `v0.34.13`.

O Toolkit já tem:

- automações por flags próprias do módulo;
- uso de item via hook `ordemparanormal.itemUsed`;
- modo `ask` com ações assistidas no chat;
- conjuração geral de rituais em ApplicationV2;
- formas estruturadas de ritual: Padrão, Discente e Verdadeiro;
- presets iniciais para Cicatrização e Eletrocussão, com Eletrocussão versionada em `1.4.1`;
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
- decisão documentada para uma futura camada opcional de Macro/Script Step, sem substituir o core estruturado;
- teste de Ocultismo na conjuração de rituais usando `actor.system.ritual.DT` e `actor.rollSkill`;
- falha no teste de Ocultismo não cancela o ritual e gera ação assistida para aplicar dano de SAN no conjurador;
- Condition Engine MVP com catálogo inicial de condições em TypeScript, Active Effects informativos aplicados direto no Actor, aliases em português para macros, duração por turno do afetado usando flags próprias, limpeza automática tardia/defensiva de condições temporárias expiradas e integração assistida inicial com Eletrocussão;
- Damage Adapter para Ordem, chamando `actor.applyDamage` do sistema e separando instâncias de dano para suportar RD por tipo;
- bloco Paranormal Toolkit na aba Atributos do item ritual para configurar fórmula genérica por forma, tipo de rolagem e tipo de dano em flags do módulo;
- rituais assistidos podem ser conjurados sem alvo selecionado; nesse caso o Toolkit rola e registra o resultado, mas não cria ações que alteram atores;
- seleção opcional de alvos por área na cena para rituais compatíveis, com preview visual, rotação, múltiplos alvos, minimização temporária de fichas abertas e remoção automática da área temporária.


### Concluído em 0.34.13 — Foco no canvas durante seleção de área

Objetivo: impedir que fichas abertas atrapalhem o posicionamento de linhas de área, como Eletrocussão Discente, sem adicionar configuração extra.

Entrega feita:

- durante a seleção de área por linha, o Toolkit minimiza temporariamente fichas de Actor/Item abertas no documento principal do Foundry;
- fichas destacadas em janela separada (`detach`) não são minimizadas, preservando setups com segunda tela;
- janelas já minimizadas pelo usuário não são alteradas;
- ao confirmar, cancelar ou falhar o posicionamento, o Toolkit restaura somente as janelas que ele mesmo minimizou;
- a mudança não altera alvo, resistência, dano, card de chat, hooks públicos ou integração com Paranormal FX.


### Concluído em 0.34.12 — Resistência em rituais sem dano

Objetivo: separar a leitura da resistência do ritual da automação de dano, permitindo exibir resistência também em rituais de utilidade, cura ou efeito manual.

Entrega feita:

- `system.resistance` passa a aceitar `nullifies`, `discredits`, `partial` e `reducesByHalf`;
- `system.skillResis` continua aceitando `resilience`, `reflexes` e `will`;
- rituais com resistência, mas sem fórmula configurada, ainda geram card assistido com custo, forma e resistência;
- rituais de utilidade/cura com fórmula configurada também exibem resistência quando o item possuir esses campos;
- automação de dano permanece conservadora: somente `reducesByHalf` cria opção de aplicação de dano pela metade.


### Concluído em 0.34.11 — Remoção da captura/enriquecimento legado de alvo

Objetivo: remover a feature legada que capturava alvos de qualquer ChatMessage e adicionava o bloco `Paranormal Toolkit / Origem / Alvo` no card do sistema.

Entrega feita:

- remove o registro de `registerChatTargetCapture()` no bootstrap do módulo;
- remove o registro de `registerChatEnrichmentRenderer()` no bootstrap do módulo;
- a captura genérica por chat deixa de gravar flags de workflow em mensagens comuns;
- o renderer legado deixa de anexar o bloco visual `Origem / Alvo`;
- cards modernos de rituais, resistência e ações assistidas continuam usando o fluxo próprio de item use.

### Concluído em 0.34.9 — Remoção robusta do card legado no DOM

Objetivo: remover o bloco legado `Paranormal Toolkit / Origem / Alvo` mesmo quando ele já vem anexado ao card original do sistema e não é removido apenas por CSS.

Entrega feita:

- registra limpeza defensiva no render de mensagens de chat;
- remove elementos legados que correspondem ao resumo antigo do workflow;
- preserva o card original do sistema e os cards modernos do Toolkit;
- mantém o fallback CSS da versão anterior para mensagens antigas.


### Concluído em 0.34.8 — Ocultar card legado de resumo do workflow

Objetivo: remover visualmente o bloco legado `Paranormal Toolkit / Origem / Alvo` que ainda podia aparecer anexado ao card original do sistema em mensagens de uso de item.

Entrega feita:

- mantém o step legado `chatCard` como no-op;
- adiciona fallback CSS para esconder cards antigos `.paranormal-toolkit-workflow-card`;
- preserva cards modernos de ritual, rolagem, resistência e ações assistidas.

## Roadmap por prioridade

### Concluído em 0.34.10 — Remoção do resumo legado de workflow

Objetivo: remover na origem o card legado de resumo do workflow que imprimia `Paranormal Toolkit`, `Origem` e `Alvo` em cards do sistema.

Entrega feita:

- `chatCard` legado passa a ser ignorado como compatibilidade silenciosa;
- `ChatMessageService` não possui mais gerador de resumo de workflow com Origem/Alvo;
- removido o workaround de limpeza por DOM introduzido durante diagnóstico;
- cards modernos de ritual, resistência e ações assistidas continuam sendo renderizados pelo fluxo atual.




### Concluído em 0.34.7 — Remoção do card legado de resumo

Objetivo: impedir que automações antigas criem mensagens genéricas no chat com apenas origem e alvo.

Entrega feita:

- transforma o step legado `chatCard` em no-op compatível;
- mantém automações antigas funcionando sem imprimir o resumo visual antigo;
- preserva os cards modernos de uso de item, rituais, dano, cura, resistência e ações assistidas;
- adiciona teste para garantir que o executor de chat legado não cria mensagem.

### Concluído em 0.34.6 — Resistência legível para jogadores

Objetivo: corrigir o layout do bloco de resistência para jogadores, onde a ausência do botão de rolagem podia deixar o texto preso na coluna estreita reservada ao botão.

Entrega feita:

- o bloco de resistência agora é normalizado mesmo quando não há botão de rolagem visível;
- a descrição da resistência passa a ficar na área principal do card para jogadores, como no card do mestre, mas sem o dado;
- preserva o layout com botão para o mestre;
- não altera rolagem, DT, permissões, aplicação de dano, aplicação de efeito ou fluxo multi-target.



### Concluído em 0.34.5 — Fórmulas por forma sem Padrão obrigatório

Objetivo: permitir que rituais genéricos tenham a forma Padrão apenas como efeito manual, enquanto Discente ou Verdadeiro possuem fórmula própria de dano, cura ou utilidade.

Entrega feita:

- configuração de rolagem de ritual passa a aceitar fórmula em qualquer forma disponível, sem exigir fórmula no Padrão;
- formas com fórmula vazia continuam aparecendo como `efeito manual` no popup de conjuração;
- ao conjurar uma forma sem fórmula, o Toolkit não tenta rolar nem criar ação de dano/cura baseada em rolagem inexistente;
- ao conjurar Discente ou Verdadeiro com fórmula configurada, a rolagem e as ações assistidas continuam funcionando normalmente.


### Concluído em 0.34.4 — Preset de Cicatrização e inicialização silenciosa

Objetivo: corrigir a progressão de cura do preset de Cicatrização e remover uma notificação visual desnecessária ao carregar o módulo.

Entrega feita:

- preset de Cicatrização passa a usar `3d8+3` na forma Padrão, `5d8+5` na Discente e `7d8+7` na Verdadeira;
- formas Discente e Verdadeira ficam habilitadas no item patch do preset de Cicatrização;
- remove o toast `Paranormal Toolkit inicializado.` no carregamento do mundo;
- mantém logs de inicialização no console para debug e não altera workflows de custo, conjuração, resistência, dano, efeitos ou chat card.


### Concluído em 0.34.3 — DT correta para resistência de ritual

Objetivo: corrigir regressão visual e funcional em que a resistência dos alvos usava a DT de conjuração de O Custo do Paranormal (`20 + PE`) em vez da DT do Ritual do conjurador.

Entrega feita:

- resistência single-target e multi-target passam a usar `actor.system.ritual.DT`/`dt` como fonte preferencial;
- mantém a DT de conjuração separada para O Custo do Paranormal;
- preserva fallback legado para cards antigos quando a DT do Ritual não está disponível;
- não altera custo, gasto de recurso, rolagem de dano, aplicação de dano, aplicação de efeito ou seleção de alvos.


### Concluído em 0.34.2 — Ajuste lateral do card substituído

Objetivo: ganhar espaço horizontal no card assistido quando o Toolkit substitui visualmente o card original do sistema, sem alterar o fluxo de rolagem ou aplicação.

Entrega feita:

- remove o padding lateral do `li.chat-message` apenas em mensagens marcadas como card do sistema substituído pelo Toolkit;
- preserva o padding vertical padrão da mensagem para manter respiro acima e abaixo do card;
- restaura o padding lateral do cabeçalho da mensagem para não colar nome, horário e ações nas bordas;
- não altera cards internos, rolagens, ações assistidas, resistência, dano, efeitos ou multi-target.


### Concluído em 0.34.1 — Ajuste visual da DT de resistência

Objetivo: reduzir o peso visual da linha de resistência e corrigir duplicação da DT no card multi-target, mantendo a informação visível sem poluir a lista de alvos.

Entrega feita:

- single-target mantém `Perícia · DT N · efeito`, mas destaca somente `DT N`;
- multi-target mantém a informação da resistência uma única vez entre o cabeçalho de **Alvos** e a lista;
- corrige o caso em que `DT N` podia aparecer duplicado após reidratação do card;
- não altera rolagem, estado pendente, aplicação de dano, aplicação de efeito ou fluxo multi-target.

### Concluído em 0.34.0 — DT de resistência visível no card

Objetivo: deixar clara a DT usada nos testes de resistência de rituais assistidos, sem alterar rolagem, dano, aplicação de efeitos ou comportamento multi-target.

Entrega feita:

- single-target passa a mostrar a resistência como `Perícia · DT N · efeito`;
- multi-target mostra a mesma informação uma única vez entre o cabeçalho de **Alvos** e a lista de alvos;
- evita repetir a DT dentro de cada alvo para não poluir o card;
- mantém os botões, estados pendentes, rolagem por alvo e aplicação manual exatamente como estavam.

### Concluído em 0.33.6 — Inferência tolerante de ray em área rotacionada

Objetivo: corrigir o caso em que o Foundry entrega `shape.direction` como `0`, mas o `bounds` final indica uma Scene Region retangular rotacionada com pequena inflação de pixels.

- aumenta a tolerância da inferência de direção a partir de `bounds`;
- cobre o caso real observado com `width ~= 1091.23` e `height ~= 688.6` para uma linha de 12 x 1 quadrados;
- mantém `area.ray.start/end` como fonte preferencial para consumidores externos, como Paranormal FX.

### Concluído em 0.33.5 — Hotfix do ray público de área

Objetivo: corrigir regressão da `0.33.2` ao ler dados opcionais da Scene Region quando o Foundry retorna `toObject()` nulo ou propriedades ausentes durante a resolução da linha.

Entrega feita:

- evita acesso inseguro a propriedades opcionais como `rotation` em candidatos nulos;
- mantém `area.ray.start` e `area.ray.end` preenchidos para áreas de ritual;
- mantém a compatibilidade com o fallback por `bounds`/`shape` da `0.33.2`;
- adiciona cobertura de teste para `toObject()` nulo.


### Concluído em 0.33.2 — Ray público para áreas de ritual rotacionadas

Objetivo: publicar a geometria final da linha de rituais de área para módulos externos, evitando que Paranormal FX precise adivinhar rotação a partir de `bounds` e `shape.direction`.

Entrega feita:

- preenche `area.ray.start` e `area.ray.end` no hook público `paranormal-toolkit.ritual.area.resolved`;
- preserva `area.bounds`, `area.shape`, `source` e `targetingMode` por compatibilidade;
- usa os dados de preview/rotação da Scene Region quando disponíveis;
- adiciona fallback defensivo para inferir a direção a partir do retângulo rotacionado quando o Foundry retorna `shape.direction` como `0`;
- mantém o fluxo de dano, resistência, card e seleção de alvos sem alterações.


### Concluído em 0.33.1 — DT correta para O Custo do Paranormal

Objetivo: corrigir a DT usada para definir se a falha na conjuração gera dano de sanidade no conjurador, sem alterar a resistência dos alvos.

Entrega feita:

- calcula a DT de conjuração do Custo do Paranormal como `20 + PE final`;
- mantém o bloco visual de Conjuração no chat card;
- mantém resistência dos alvos, dano normal/metade e aplicação assistida de efeitos sem alterações;
- não implementa dano permanente de sanidade.

### Concluído em 0.33.0 — API pública de lifecycle de rituais

Objetivo: expor hooks públicos estáveis para módulos externos observarem o ciclo de conjuração assistida sem transformar o Toolkit em módulo de animações.

Entrega feita:

- adiciona hooks versionados para início de conjuração, área resolvida e término de conjuração;
- expõe payloads públicos em snapshots serializáveis, sem usar `WorkflowContext` como contrato público;
- inclui metadados da fonte de automação, com `presetId` como chave estável para integrações externas;
- marca `automation.fxEligible` apenas para automações vindas de presets do Toolkit;
- documenta que Paranormal FX e outros módulos devem preferir `automation.presetId` / `ritual.presetId` e ignorar automações manuais ou genéricas;
- mantém o Toolkit sem Sequencer, JB2A, chamadas de animação, sons, engine de macros, configurações de FX ou presets de FX.

### Concluído em 0.32.0 — Seleção de alvos por área com Scene Regions

Objetivo: permitir que rituais com área, como Eletrocussão Discente, selecionem alvos pela cena em vez de depender só dos tokens já selecionados manualmente.

Entrega feita:

- adiciona seleção opcional de alvos por Region retangular rotacionável na cena;
- usa Scene Regions do Foundry v14 para preview e confirmação;
- resolve alvos com `canvas.tokens.quadtree.getObjects(region.bounds)` e `token.document.testInsideRegion(region)`;
- mostra preview visual de targets durante movimento/rotação;
- remove a Region temporária após confirmar ou cancelar;
- preserva o fluxo assistido existente de dano/resistência, sem aplicar efeitos automaticamente.

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







### Concluído em 0.19.10 — Remove registro redundante no card de ritual

Objetivo: deixar o card de ritual focado apenas em informações e ações úteis.

Entrega feita:

- remove a seção **Registro** do card de ritual;
- remove o botão **Ritual conjurado**, que não executava nenhuma ação real;
- mantém rolagem de conjuração, fórmula configurada, dano/cura/utilidade e aviso de aplicação manual;
- preserva ações assistidas reais quando existirem alvo e operação aplicável.

### Concluído em 0.19.9 — Remove registro redundante do card de ritual

Objetivo: limpar o card de ritual quando não há ação assistida para executar.

Entrega feita:

- remove visualmente a seção **Registro** dos cards de ritual sem ações pendentes;
- mantém as seções de conjuração e fórmula configurada;
- mantém avisos de aplicação manual quando não há alvo selecionado;
- evita mostrar o botão `✓ Ritual conjurado`, que não executava nenhuma regra útil.

Critérios de aceitação:

- conjurar ritual com fórmula e sem alvo não deve mostrar **Registro**;
- conjurar ritual com alvo continua mostrando ações reais, como dano/cura/efeito;
- o card não deve perder as rolagens nem os metadados do ritual.

### Concluído em 0.19.8 — Ritual assistido sem alvo selecionado

Objetivo: permitir conjuração e rolagem de rituais usados contra ambiente, área, objeto narrativo ou qualquer coisa sem ficha/token.

Entrega feita:

- ritual assistido não falha mais só porque não há alvo selecionado;
- fórmulas configuradas continuam rolando e aparecendo no card;
- ações que alteram documentos, como dano, cura e condição em alvo, são omitidas quando não há ator alvo;
- o card adiciona uma linha de aplicação manual para orientar o mestre;
- com alvo selecionado, o fluxo assistido continua criando os botões de dano/cura/efeito normalmente.

Critérios de aceitação:

- conjurar ritual configurado sem alvo deve rolar Ocultismo e a fórmula escolhida;
- o card deve ser criado sem erro;
- o card não deve criar botão de aplicar dano/cura/efeito em alvo inexistente;
- conjurar o mesmo ritual com alvo selecionado deve manter os botões assistidos.

### Concluído em 0.19.7 — Elemento em português no popup de conjuração

Objetivo: manter a UI em português também no cabeçalho do popup de conjuração.

Entrega feita:

- mapeia os elementos internos do ritual (`blood`, `death`, `knowledge`, `energy`, `fear`) para labels em português;
- corrige o subtítulo do popup, evitando `Blood • 1º Círculo`;
- mantém os valores internos sem tradução para não afetar adapters, presets ou regras.

Critérios de aceitação:

- ritual de Sangue deve mostrar `Sangue • 1º Círculo` no popup;
- demais elementos devem aparecer como Morte, Conhecimento, Energia e Medo;
- card do chat continua usando os labels de dano em português da 0.19.6.

### Concluído em 0.19.6 — Labels de dano em português no card

Objetivo: evitar que IDs canônicos internos, como `blood`, apareçam no card do chat para o mestre/jogador.

Entrega feita:

- adiciona label em português para tipos de dano do Toolkit;
- troca o resumo `Tipo: Blood` por `Tipo: Sangue`;
- cobre tipos físicos, paranormais e mundanos usados pelo Damage Adapter;
- mantém os IDs internos em inglês/código para dados e integração, mudando apenas a apresentação.

Critérios de aceitação:

- ritual configurado com dano `blood` deve mostrar `Tipo: Sangue` no card;
- ritual configurado com dano `electric` deve mostrar `Tipo: Eletricidade`;
- o Damage Adapter continua recebendo o ID canônico, não o texto traduzido.

### Concluído em 0.19.5 — Fórmula padrão no popup de conjuração

Objetivo: corrigir a apresentação da fórmula da forma Padrão no popup de conjuração dos rituais configurados pela ficha.

Entrega feita:

- a forma Padrão passa a expor a fórmula configurada em `rollFormulaOverrides`;
- o popup mostra Padrão, Discente e Verdadeiro de forma consistente;
- a execução continua usando a mesma fórmula base, sem mudar regra de dano/cura/utilidade.

### Concluído em 0.19.4 — Fórmula configurada no fluxo genérico

Objetivo: fazer a configuração salva na ficha do ritual ser usada no uso real do item, sem depender de preset hardcoded.

Entrega feita:

- lê `ritualRollConfig` em rituais sem preset específico;
- gera uma `AutomationDefinition` temporária para o fluxo assistido;
- habilita no popup apenas as formas configuradas com fórmula;
- rola a fórmula da forma escolhida;
- tipo Dano cria ações assistidas de dano usando o Damage Adapter;
- tipo Cura cria ação assistida de cura em PV;
- tipo Utilidade apenas registra o resultado no card;
- reutiliza a resistência original do item quando ela for `reducesByHalf`.

Critérios de aceitação:

- ritual sem preset, mas com fórmula Padrão, deve rolar e gerar card;
- Discente/Verdadeiro só aparecem no popup quando há fórmula e a forma existe no item;
- dano deve criar botões Normal/Metade quando o item tiver resistência de metade;
- cura deve gerar botão de cura;
- utilidade não deve gerar botão de aplicação.

### Concluído em 0.19.3 — Copy da fórmula de rolagem

Objetivo: deixar claro que o bloco da ficha configura uma fórmula genérica/fallback, não uma automação completa concorrente com presets.

Entrega feita:

- troca o subtítulo do bloco de **Automação do ritual** para **Fórmula de rolagem**;
- atualiza a descrição para explicar que a fórmula será usada quando o ritual não tiver preset específico;
- troca o botão **Salvar automação** para **Salvar fórmula**;
- mantém o armazenamento em `flags.paranormal-toolkit.ritualRollConfig`, sem alterar `system.*`.

Critérios de aceitação:

- o bloco deve continuar aparecendo na aba Atributos do item ritual;
- o bloco não deve usar o termo “automação” como título ou botão principal;
- salvar continua gravando a mesma flag, preservando compatibilidade com a 0.19.2.

### Concluído em 0.19.2 — Polimento do layout da configuração de fórmula

Objetivo: reduzir ruído visual do bloco de configuração e deixar Padrão, Discente e Verdadeiro mais fáceis de comparar.

Entrega feita:

- remove o resumo readonly de resistência do bloco, evitando duplicar dados que já existem na ficha original;
- remove o campo Nota, usando a aba Descrição do ritual como fonte de explicações textuais;
- adiciona a seção **Fórmulas por forma**;
- organiza Padrão, Discente e Verdadeiro em cards pequenos lado a lado;
- mantém Discente e Verdadeiro desabilitados quando `system.studentForm` ou `system.trueForm` não estão marcados.

Critérios de aceitação:

- o bloco deve continuar aparecendo na aba Atributos abaixo de Forma Discente/Forma Verdadeira;
- não deve haver campo duplicado de resistência dentro do bloco do Toolkit;
- não deve haver campo Nota dentro do bloco do Toolkit;
- Padrão, Discente e Verdadeiro devem aparecer agrupados em **Fórmulas por forma**, lado a lado quando houver largura suficiente.

### Concluído em 0.19.1 — Correção do bloco de fórmula na ficha de ritual

Objetivo: corrigir a injeção do bloco da 0.19.0 para não quebrar a navegação da ficha de item.

Entrega feita:

- troca o seletor genérico `[data-tab="ritualAttr"]` por `section[data-tab="ritualAttr"]`;
- impede que o bloco seja inserido dentro do botão/aba **Atributos** da navegação;
- mantém a âncora logo depois dos campos originais `system.studentForm` e `system.trueForm`;
- adiciona fallback de CSS injetado em runtime para o bloco renderizar corretamente mesmo antes de reiniciar o Foundry.

Critérios de aceitação:

- abrir um item ritual não deve mover as abas Descrição/Atributos/Efeitos;
- o bloco Paranormal Toolkit deve aparecer dentro da aba Atributos, abaixo de Forma Discente/Forma Verdadeira;
- o bloco deve aparecer com caixa/borda e layout em duas colunas quando houver largura suficiente.

### Concluído em 0.19.0 — Configuração de fórmula no item ritual

Objetivo: permitir que rituais genéricos e homebrews tenham uma rolagem principal configurável diretamente na ficha do ritual, sem depender de preset hardcoded.

Entrega feita:

- adiciona um bloco **Paranormal Toolkit** na aba **Atributos** da ficha de item de ritual;
- ancora a inserção logo após os campos originais `system.studentForm` e `system.trueForm`;
- fórmula Padrão fica sempre disponível;
- fórmulas Discente e Verdadeira ficam habilitadas conforme as formas marcadas no ritual original;
- permite escolher tipo de rolagem: dano, cura ou utilidade;
- permite escolher tipo de dano canônico do Toolkit quando o tipo é dano;
- mantém resistência, círculo, elemento, alvo, duração e formas como dados do sistema, sem duplicar campos;
- salva em `flags.paranormal-toolkit.ritualRollConfig`;
- mantém a execução dessa configuração para uma próxima etapa, evitando misturar UI nova com regra de automação no mesmo corte.

Critérios de aceitação:

- a ficha de item ritual deve mostrar o bloco abaixo de Forma Discente/Forma Verdadeira na aba Atributos;
- Padrão deve estar sempre habilitado;
- Discente deve desabilitar quando `system.studentForm` estiver falso;
- Verdadeiro deve desabilitar quando `system.trueForm` estiver falso;
- salvar deve persistir a configuração em flags do item;
- limpar deve remover a flag;
- o bloco não deve criar campos duplicados de resistência ou alterar `system.*`.

### Concluído em 0.18.1 — Feedback de dano e Eletrocussão elétrica

Objetivo: melhorar a resposta visual da aplicação de dano e corrigir o tipo de dano da Eletrocussão.

Entrega feita:

- corrige Eletrocussão para preset `1.4.1` com `damageType: "electric"`;
- mantém o elemento do ritual como Energia e o dano aplicado como Eletricidade;
- o botão executado do card passa a mostrar o resultado real aplicado após RD;
- cria whisper para GMs com resumo da aplicação de dano;
- o resumo mostra dano bruto, dano final, RD bloqueada, PV atual e suporte a dano misto.

Critérios de aceitação:

- Eletrocussão reaplicada deve aparecer como preset `1.4.1`;
- aplicar dano deve atualizar o botão para `✓ X PV aplicado (RD Y)` quando houver RD;
- o GM deve receber um whisper com detalhes do dano aplicado;
- Eletrocussão deve testar RD de Eletricidade, não RD de Energia.

### Concluído em 0.18.0 — Damage Adapter para Ordem

Objetivo: parar de duplicar regra de dano/PV no Toolkit e delegar a aplicação de dano para o sistema Ordem.

Entrega feita:

- adiciona `core/damage` com tipos e contrato de adapter de dano;
- adiciona `OrdemDamageAdapter`, que chama `actor.applyDamage`;
- mantém tipos canônicos no Toolkit e mapeia para os IDs internos do sistema no adapter;
- suporta dano misto separando instâncias e aplicando uma chamada por tipo de dano;
- registra o resultado agregado no `workflowContext.damageInstances`;
- mantém cura, SAN, PE e PD no `ResourceEngine`;
- atualiza Eletrocussão para preset `1.4.0` com `damageType: "energy"`.

Critérios de aceitação:

- aplicar dano normal/metade deve chamar `actor.applyDamage` no alvo;
- RD do sistema deve ser considerada conforme o tipo de dano;
- dano misto deve ser modelável como múltiplas instâncias, sem somar tudo em um tipo único.

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

