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

Versão base do roadmap: `v0.15.0`.

O Toolkit já tem:

- automações por flags próprias do módulo;
- uso de item via hook `ordemparanormal.itemUsed`;
- modo `ask` com ações assistidas no chat;
- conjuração geral de rituais em ApplicationV2;
- formas estruturadas de ritual: Padrão, Discente e Verdadeiro;
- presets iniciais para Cicatrização e Eletrocussão;
- custo de PE/PD por ritual;
- rolagens próprias do Toolkit com integração opcional ao Dice So Nice;
- card de resultado no chat com detalhes expansíveis da rolagem;
- card assistido persistente, com opção de substituir visualmente o card original do sistema;
- card simples persistente para rituais sem preset conhecido;
- ação de GM no menu da ficha para diagnosticar e aplicar presets de rituais;
- decisão documentada para uma futura camada opcional de Macro/Script Step, sem substituir o core estruturado.
- teste de Ocultismo na conjuração de rituais usando `actor.system.ritual.DT` e `actor.rollSkill`.

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

- se o sistema não expuser uma ação limpa na sheet, injetar botão por DOM pode ficar acoplado. Nesse caso, preferir uma integração pequena e bem isolada em `ui/` ou `adapters/ordem/`, com seletores mínimos e testes manuais claros.

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

Objetivo: controlar quem vê detalhes e quem executa ações sem espalhar `game.user.isGM` pelo código.

Status: em hold até as ações de chat ficarem mais estáveis.

Defaults sugeridos futuramente:

| Recurso | Default |
|---|---|
| Ver resultado e dados | Todos |
| Ver detalhes sensíveis de resistência | GM |
| Aplicar dano | GM |
| Aplicar cura | GM e dono do ator, configurável |
| Aplicar condição | GM |

Estrutura sugerida:

```txt
src/features/chat/permissions/
  chat-permission-settings.ts
  chat-action-permission-service.ts
```

### P2 — Integração pré-chat com o sistema Ordem

Objetivo: permitir que o Toolkit prepare ou cancele o uso de item antes do `ChatMessage.create` original do sistema.

Motivação:

- hoje o hook de uso de item acontece depois da criação do card;
- isso limita cancelamento real do fluxo;
- também dificulta bloquear rolagens inline duplicadas na descrição do item.

Entrega desejada no sistema:

```ts
const preparation = await globalThis.ParanormalToolkit?.integrations?.ordem?.prepareItemUse?.({
  item: this,
  actor: this.actor,
  token,
  chatMessageData,
});

if (preparation?.cancelled) return null;

const preparedChatMessageData = preparation?.chatMessageData ?? chatMessageData;
const message = await ChatMessage.create(preparedChatMessageData);
```

Entrega desejada no Toolkit:

- adapter para `prepareItemUse`;
- fallback mantendo `ordemparanormal.itemUsed`;
- sem quebrar mundos que usam versão antiga do sistema.

### P2 — UI de configuração de automação do item

Objetivo: permitir que o mestre veja o que foi aplicado no item sem abrir flag no console.

Status: esperar o modelo estabilizar antes de criar UI.

Entrega futura:

- ApplicationV2 para inspecionar automação aplicada;
- mostrar preset, versão, formas, custo, fórmula e ações;
- no futuro, permitir overrides estruturados por item para homebrew.

Não fazer agora:

- editor completo de automação antes da API interna estabilizar;
- UI que grava texto livre como regra.

### P3 — Armas, melhorias e categoria

Objetivo: automatizar a parte de armas sem tratar modificação como simples bônus.

Escopo futuro:

- categoria base;
- melhorias aplicadas;
- aumento de categoria;
- categoria final;
- limite por patente/categoria;
- validação visual para jogador e mestre;
- integração com workflow de ataque, dano e resistência.

Decisão arquitetural:

- manter cálculo em core puro;
- paths internos do sistema ficam no adapter;
- UI deve refletir validação, não ser fonte de verdade.

### P3 — Template Regions e rituais avançados

Objetivo: sair de rituais apenas descritivos e permitir área, alvo, duração e efeitos persistentes.

Escopo futuro:

- Template Regions para área de ritual;
- Active Effects temporários;
- dano/condição por entrada ou permanência em região quando fizer sentido;
- duração por rodada/cena;
- integração futura com Paranormal FX.

### P3 — Macro/Script Step como extensão controlada

Objetivo: permitir extensões avançadas sem transformar o Toolkit em uma coleção de macros frágeis.

Decisão arquitetural:

- o formato principal de automação continua sendo `AutomationDefinition` tipado em TypeScript;
- presets internos devem preferir steps nativos (`spendRitualCost`, `rollFormula`, `modifyResource`, `chatCard`, futuros `applyCondition`, etc.);
- macros/scripts entram apenas como escape hatch para casos avançados, homebrew ou integrações opcionais;
- macros não devem acessar paths internos do sistema quando existir adapter;
- macros devem receber um contexto limitado, documentado e seguro;
- erros de macro precisam ser capturados e exibidos sem quebrar o workflow inteiro;
- presets básicos do Toolkit não devem depender de macros para funcionar.

Modelo conceitual futuro:

```ts
type MacroStep = {
  type: "runMacro";
  timing: "beforeRoll" | "afterRoll" | "beforeApply" | "afterApply";
  macroUuid: string;
  args?: Record<string, unknown>;
};

type ToolkitMacroContext = {
  actor: Actor;
  item: Item;
  targets: WorkflowTarget[];
  rolls: Record<string, WorkflowRollResult>;
  flags: Record<string, unknown>;
  toolkit: ToolkitSafeMacroApi;
};
```

Estrutura sugerida:

```txt
src/core/macros/
  macro-executor.ts
  macro-context.ts
  macro-error.ts

src/core/automation/
  automation-macro-step.ts
```

Não fazer:

- não transformar presets como Eletrocussão em `macro.eletrocussao.js`;
- não salvar HTML ou script solto como regra principal;
- não exigir macro para recursos comuns de ritual, condição, arma ou dano;
- não expor `globalThis` inteiro como API para macro.

### P3 — Paranormal FX

Objetivo: módulo companion para animações, sons e efeitos visuais.

Escopo futuro:

- integração opcional com Sequencer;
- integração opcional com bibliotecas instaladas pelo usuário, como JB2A;
- eventos emitidos pelo Toolkit para armas, rituais e condições;
- presets visuais configuráveis;
- não empacotar asset de terceiro sem licença.

### P3 — Paranormal Sheets

Objetivo: UX moderna para fichas alternativas.

Escopo futuro:

- ficha de agente mais bonita;
- ficha de ameaça;
- organização melhor de perícias, armas, rituais e inventário;
- experiência visual mais amigável para jogadores e mestres.

Prioridade atual: depois de Toolkit e FX.

## Ordem recomendada de entrega

| Versão alvo | Prioridade | Entrega |
|---|---|---|
| `0.12.0` | Concluído | Ação de GM na ficha para diagnosticar e aplicar presets em rituais conhecidos. |
| `0.12.4` | Concluído | Polimento de legibilidade do gerenciador de presets, foco em rituais aplicáveis/automatizados e botão Aplicar com destaque verde. |
| `0.13.0` | Concluído | Resistência assistida inicial com opções de dano normal/metade para Eletrocussão. |
| `0.13.4` | Concluído | Polish de layout do card de resistência assistida em cards estreitos. |
| `0.13.7` | Concluído | Botão d20 para rolagem correta de resistência do alvo usando o roller nativo de perícia do sistema Ordem, ainda sem comparação automática de DT. |
| `0.13.8` | Concluído | Setting para manter ou substituir visualmente o card original do sistema Ordem. |
| `0.13.9` | Concluído | Modelo estruturado em flag de ChatMessage para reconstruir o card assistido após F5 e manter ações persistidas. |
| `0.13.10` | Concluído | Escrita robusta do card estruturado na ChatMessage real, com busca por mensagem recente e retries quando o hook não entrega a mensagem resolvida. |
| `0.13.11` | Concluído | Reidratação dos cards persistidos após F5, respeitando o modo manter/substituir. |
| `0.13.12` | Concluído | `flags.paranormal-toolkit.chatCard` consolidado como fonte primária do card assistido, com `itemUsePrompts` mantido apenas como espelho legado temporário. |
| `0.14.0` | P1 | Popup geral de conjuração em ApplicationV2 para qualquer ritual, com visual alinhado ao card do chat. |
| `0.13.x` | P2 | Ajustes de hook pré-chat e bloqueio visual de rolagem inline duplicada. |
| `0.14.x` | P2 | Condition Engine MVP com Active Effects informativos e flags próprias. |
| `0.13.x` | P2 | Abalado evolui para Apavorado ao reaplicar na mesma cena. |
| `0.14.0` | P2 | Permissões/visibilidade de ações no chat. |
| `0.15.x` | P2 | UI de inspeção/configuração de automação do item. |
| `0.16.x+` | P3 | Armas, melhorias, categorias, Template Regions e integrações visuais. |
| `0.15.0` | P1 | Teste de Ocultismo na conjuração, usando DT de ritual do ator e rolagem nativa do sistema. |
| `0.17.x+` | P3 | Macro/Script Step como extensão controlada para homebrew e integrações avançadas, sem substituir o core estruturado. |

## Não objetivos por enquanto

- Não copiar textos oficiais, artes, compêndios protegidos ou assets de terceiros.
- Não usar descrição do item como fonte de regra.
- Não automatizar penalidades de condição antes de controlar testes de perícia de forma confiável.
- Não acoplar core a paths internos do sistema `ordemparanormal`.
- Não transformar o Toolkit em substituto do sistema base.
- Não criar UI complexa antes do modelo de automação estabilizar.
- Não basear automações principais em macros quando um step tipado resolve melhor.

## Critério para `1.0.0`

A versão `1.0.0` deve ter:

- flags documentadas;
- API interna minimamente estável;
- presets versionados;
- testes mínimos para core;
- workflows de ritual e recursos confiáveis em mesa real;
- UX sem dependência de console para operações comuns;
- documentação técnica separada para adapters, presets e condições.



## 0.13.12 — chatCard como fonte primária

- `flags.paranormal-toolkit.chatCard` vira a fonte primária para reconstruir e atualizar cards assistidos.
- `flags.paranormal-toolkit.itemUsePrompts` permanece como espelho legado temporário para compatibilidade com mensagens antigas.
- A leitura mescla `chatCard` primeiro e só usa `itemUsePrompts` como fallback.
- A escrita atualiza o modelo estruturado antes do espelho legado.
- Esta decisão evita depender de estado em memória, HTML persistido ou estrutura interna do card visual do sistema Ordem.

## 0.13.11 — reidratação após F5

- O Toolkit agenda reidratação do chat após registrar os hooks de render.
- Mensagens já existentes no DOM são varridas por `data-message-id`.
- Quando a `ChatMessage` possui `flags.paranormal-toolkit.chatCard`, o card assistido é reconstruído e os botões são religados.
- O modo manter/substituir é respeitado depois do reload.


## 0.13.10 — escrita robusta do card estruturado

- O Toolkit tenta persistir o card na `ChatMessage` direta do hook quando ela existe.
- Quando a mensagem ainda não está resolvida, procura a mensagem recém-criada por id, ator, nome/id do item e proximidade de timestamp.
- A persistência é tentada novamente por alguns segundos para cobrir timing de render/criação do chat.
- O comando de teste `game.messages.contents.at(-1)?.getFlag("paranormal-toolkit", "chatCard")` deve retornar o modelo logo após usar o ritual.

## 0.13.9 — card persistente estruturado

- `flags.paranormal-toolkit.chatCard` passa a guardar o modelo estruturado do card assistido.
- O renderer reconstrói o card a partir da flag após F5.
- Ações de dano/cura persistidas continuam executáveis após reload.
- O modo manter/substituir passa a depender da presença do card persistente, não de estado em memória.

## 0.13.8 — card persistente e substituição visual

- Setting de mundo para escolher se o card original do sistema deve ser mantido ou substituído pelo card persistente do Toolkit.
- O modo substituir limpa apenas o conteúdo visual renderizado da mensagem; a `ChatMessage` original continua existindo.
- O card do Toolkit é reconstruído pelas flags persistidas da mensagem, inclusive após F5.
- O resultado da resistência rolada permanece no card quando a mensagem é renderizada novamente.

## 0.13.7 — rolagem correta de resistência

- O botão d20 do bloco de resistência usa o roller nativo de perícia do sistema Ordem.
- Fortitude, Reflexos e Vontade são chamadas como perícias reais do alvo, respeitando atributo e proficiência do sistema.
- Não existe fallback silencioso para `1d20`: se não for possível rolar pelo sistema, o Toolkit mostra erro.
- O resultado aparece no próprio card do Toolkit e não cria outro card de chat.
- Ainda não compara automaticamente com DT.

## 0.13.4 — Chat Action Sections

- Padronizar ações assistidas do chat por seções.
- Usar a mesma estrutura para dano, cura e recursos.
- Preparar a base para futuras seções: rolagem de resistência e aplicação de condições.


## 0.13.4 — botão d20 de resistência

- Botão compacto no bloco de resistência para o mestre rolar a resistência do alvo.
- Resultado exibido no próprio botão e fórmula exibida abaixo da descrição.
- DT automática continua fora do escopo desta versão.


## 0.14.3 — decisão futura sobre Macro/Script Step

- O Toolkit não deve copiar o modelo de depender de macros como fonte principal de regra.
- O core continua em TypeScript, com definitions estruturadas, adapters, flags e steps tipados.
- Macros/scripts serão uma camada opcional e avançada para homebrew, integrações e exceções difíceis de modelar.
- A futura API de macro deve expor apenas um contexto seguro e documentado, não o estado interno inteiro do módulo.
- Todo Macro Step deve ter executor próprio, tratamento de erro e logs claros.


### 0.15.1 — Ritual Casting Check / Dice So Nice

- Corrigir o teste de Ocultismo de conjuração para animar com Dice So Nice quando a integração estiver ativa.
- Manter o resultado persistido em `flags.paranormal-toolkit.chatCard` sem criar mensagem extra de rolagem.

