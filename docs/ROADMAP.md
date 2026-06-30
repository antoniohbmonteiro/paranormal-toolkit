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

Versão base do roadmap: `v0.15.6`.

O Toolkit já tem:

- automações por flags próprias do módulo;
- uso de item via hook `ordemparanormal.itemUsed`;
- modo `ask` com ações assistidas no chat;
- conjuração geral de rituais em ApplicationV2;
- formas estruturadas de ritual: Padrão, Discente e Verdadeiro;
- presets iniciais para Cicatrização e Eletrocussão;
- custo de PE/PD por ritual;
- rolagens próprias do Toolkit com integração opcional ao Dice So Nice;
- card de resultado no chat com dados brutos expansíveis pela fórmula da rolagem;
- metadados de ritual no cabeçalho do card usando badge de elemento/círculo e chips de custo, alvo, duração e resistência;
- bloco de resistência com coluna reservada para o botão d20, sem a descrição invadir a área da ação;
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
