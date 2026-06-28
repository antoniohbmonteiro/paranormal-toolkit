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

Versão base do roadmap: `v0.13.5`.

O Toolkit já tem:

- automações por flags próprias do módulo;
- uso de item via hook `ordemparanormal.itemUsed`;
- modo `ask` com ações assistidas no chat;
- conjuração assistida de rituais;
- formas estruturadas de ritual: Padrão, Discente e Verdadeiro;
- presets iniciais para Cicatrização e Eletrocussão;
- custo de PE/PD por ritual;
- rolagens próprias do Toolkit com integração opcional ao Dice So Nice;
- card de resultado no chat com detalhes expansíveis da rolagem;
- ação de GM no menu da ficha para diagnosticar e aplicar presets de rituais.

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
| `0.13.5` | Concluído | Botão d20 para rolagem simples de resistência do alvo, ainda sem comparação automática de DT. |
| `0.13.x` | P2 | Ajustes de hook pré-chat e bloqueio visual de rolagem inline duplicada. |
| `0.14.0` | P2 | Condition Engine MVP com Active Effects informativos e flags próprias. |
| `0.13.x` | P2 | Abalado evolui para Apavorado ao reaplicar na mesma cena. |
| `0.14.0` | P2 | Permissões/visibilidade de ações no chat. |
| `0.15.x` | P2 | UI de inspeção/configuração de automação do item. |
| `0.16.x+` | P3 | Armas, melhorias, categorias, Template Regions e integrações visuais. |

## Não objetivos por enquanto

- Não copiar textos oficiais, artes, compêndios protegidos ou assets de terceiros.
- Não usar descrição do item como fonte de regra.
- Não automatizar penalidades de condição antes de controlar testes de perícia de forma confiável.
- Não acoplar core a paths internos do sistema `ordemparanormal`.
- Não transformar o Toolkit em substituto do sistema base.
- Não criar UI complexa antes do modelo de automação estabilizar.

## Critério para `1.0.0`

A versão `1.0.0` deve ter:

- flags documentadas;
- API interna minimamente estável;
- presets versionados;
- testes mínimos para core;
- workflows de ritual e recursos confiáveis em mesa real;
- UX sem dependência de console para operações comuns;
- documentação técnica separada para adapters, presets e condições.



## 0.13.5 — ajuste do botão d20 de resistência

- Alinha o botão d20 à direita do bloco de resistência.
- Usa o ator da ação assistida como alvo preferencial da rolagem.
- Mantém fallback por ator/token no canvas quando necessário.
- Ainda não compara automaticamente com DT.

## 0.13.4 — Chat Action Sections

- Padronizar ações assistidas do chat por seções.
- Usar a mesma estrutura para dano, cura e recursos.
- Preparar a base para futuras seções: rolagem de resistência e aplicação de condições.


## 0.13.4 — botão d20 de resistência

- Botão compacto no bloco de resistência para o mestre rolar a resistência do alvo.
- Resultado exibido no próprio botão e fórmula exibida abaixo da descrição.
- DT automática continua fora do escopo desta versão.
