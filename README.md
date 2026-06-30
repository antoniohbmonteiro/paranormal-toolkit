# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas de Ordem Paranormal no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.19.7`.

O projeto ainda está em desenvolvimento ativo. A base atual já possui automações funcionais para recursos, rituais, presets e workflows, além da integração com o hook oficial de uso de item do sistema não-oficial de Ordem Paranormal e do primeiro fluxo assistido de conjuração de rituais.

Até a versão `1.0.0`, APIs internas, flags e presets ainda podem mudar sem compatibilidade retroativa.

## Principais recursos

| Recurso | O que faz | Status |
|---|---|---|
| Custo de rituais | Calcula o custo pelo círculo e gasta PE quando a automação é usada. | Implementado |
| Cura e dano automáticos | Rola a fórmula configurada; cura usa o ResourceEngine e dano em PV usa o adapter do sistema Ordem com suporte a RD por tipo. | Implementado |
| Controle de recursos | Gasta, cura, recupera ou reduz PV, SAN, PE e PD respeitando limites da ficha. | Implementado |
| Automações por item | Permite aplicar automações em rituais, habilidades ou itens usando flags próprias do módulo. | Implementado |
| Uso pela ficha | Escuta o hook `ordemparanormal.itemUsed` do sistema e reage ao uso normal de itens automatizados. | Implementado inicial |
| Modo perguntar no chat | Ao usar um item automatizado, cria ações assistidas no card de chat em vez de aplicar imediatamente. | Implementado inicial |
| Modo automático | Executa a automação diretamente ao usar o item. | Experimental |
| Conjuração geral de rituais | Abre ApplicationV2 para qualquer ritual, mostra forma/custo final, rola Ocultismo contra a DT de ritual do conjurador e usa automação assistida quando houver preset. | MVP implementado |
| Formas de ritual | Presets podem declarar Padrão, Discente e Verdadeiro com custo extra, fórmula própria e notas manuais no chat. | MVP implementado |
| Configuração de fórmula no ritual | Adiciona um bloco Paranormal Toolkit na aba Atributos da ficha de ritual, com tipo de rolagem e fórmula por forma salvos em flags do módulo. | MVP implementado |
| Dice So Nice | Quando o módulo Dice So Nice está ativo, as rolagens do Toolkit são animadas em 3D sem criar mensagem extra no chat. | Implementado inicial |
| Bloqueio de rolagem duplicada | Evitará confusão com rolagens inline na descrição, como `[[2d8+2]]`, quando houver automação ativa. | Planejado |
| Condições e efeitos | Cria Active Effects informativos no ator alvo, com registry em TypeScript, catálogo inicial de condições, flags próprias, duração por rodada, limpeza automática tardia/defensiva e ações assistidas em rituais. | MVP implementado |
| Armas e melhorias | Validará categoria, modificações, melhorias e limites por patente/categoria. | Planejado |
| Integração com animações | Preparará eventos para efeitos visuais, sons e animações em um módulo companion. | Planejado |
| Macro/Script Step | Camada futura de extensão controlada para casos avançados, sem virar a base das automações. | Planejado |

O Paranormal Toolkit é pensado para ser configurável por mesa: o mestre pode deixar tudo desligado, usar modo assistido no chat ou ativar automações mais diretas conforme o estilo do grupo.

## Requisitos

- Foundry VTT v14+
- Sistema alvo: `ordemparanormal`


### 0.12.4 — Gerenciador de presets de rituais

A versão `0.12.4` mantém a ação de GM no menu de três pontinhos da ficha de agente, melhora contraste do popup, deixa o botão Aplicar desabilitado quando não há presets pendentes e troca o destaque do botão Aplicar para verde.

Fluxo esperado:

```txt
Ficha do agente
↓
⋮
↓
Gerenciar presets de rituais
↓
Ver diagnóstico dos rituais
↓
Aplicar
```

O popup foca apenas nos rituais que interessam ao fluxo do Toolkit:

- prontos para aplicar;
- desatualizados;
- automatizados.

Rituais sem preset conhecido são ignorados no painel para evitar uma lista gigante em mesas reais.

Por enquanto, a ação fica disponível apenas para GM e apenas em fichas de agente com rituais.










### 0.19.7 — Elemento em português no popup de conjuração

- Corrige o subtítulo do popup de conjuração para mostrar o elemento do ritual em português.
- `Blood • 1º Círculo` passa a aparecer como `Sangue • 1º Círculo`.
- Mantém os IDs internos do sistema/Toolkit em inglês; a mudança é apenas visual.

### 0.19.6 — Labels de dano em português no card

- Corrige o resumo do card de ritual para exibir tipos de dano canônicos do Toolkit em português, como `Sangue`, `Eletricidade` e `Conhecimento`.
- Evita que configurações genéricas salvas como `blood`, `electric` ou `knowledge` vazem para a UI do chat.
- Centraliza uma função simples de label em `core/damage`, preparando reuso em outros pontos da UI.

### 0.19.5 — Fórmula padrão no popup de conjuração

- Corrige a exibição da fórmula da forma **Padrão** no popup de conjuração para rituais configurados pela ficha.
- A forma Padrão agora também expõe `rollFormulaOverrides`, igual Discente e Verdadeiro, mantendo a UI do popup consistente.
- A execução da fórmula não muda: a correção é de apresentação/consistência do modelo usado pelo popup.

### 0.19.3 — Copy da fórmula de rolagem

- Renomeia o subtítulo do bloco de `Automação do ritual` para **Fórmula de rolagem**, deixando claro que o bloco configura a rolagem genérica/fallback do ritual.
- Atualiza a descrição do bloco para explicar que a fórmula é usada quando o ritual não tiver um preset específico.
- Troca o botão de `Salvar automação` para **Salvar fórmula**.
- Mantém a configuração salva em `flags.paranormal-toolkit.ritualRollConfig`, sem alterar os campos do sistema.

### 0.19.2 — Polimento do bloco de fórmula no item ritual

- Remove o resumo de resistência do bloco do Toolkit, já que a resistência continua visível e configurável na ficha original do ritual.
- Remove o campo Nota do bloco, mantendo textos e instruções na aba Descrição do item.
- Reorganiza Padrão, Discente e Verdadeiro em cards pequenos lado a lado dentro da seção **Fórmulas por forma**.
- Mantém Discente e Verdadeiro desabilitados quando as formas correspondentes não existem no ritual.
- Reduz ruído visual do formulário e deixa o bloco focado apenas em tipo da rolagem, tipo de dano/utilidade e fórmulas.

### 0.19.1 — Correção do encaixe da configuração no item ritual

- Corrige o alvo de injeção do bloco de configuração para usar especificamente `section[data-tab="ritualAttr"]`, evitando inserir o bloco dentro da navegação de abas.
- O bloco agora entra abaixo de Forma Discente/Forma Verdadeira sem deslocar Descrição, Atributos ou Efeitos.
- Injeta estilos mínimos em runtime como fallback, para não depender do carregamento imediato de um stylesheet novo após atualização do módulo.

### 0.19.0 — Configuração de fórmula no item ritual

- Adiciona um bloco **Paranormal Toolkit** na aba **Atributos** da ficha de item de ritual.
- O bloco é inserido logo abaixo dos campos originais **Forma Discente** e **Forma Verdadeira**, usando esses campos como âncora.
- Permite configurar uma rolagem principal por forma: Padrão, Discente e Verdadeiro.
- A fórmula Padrão fica sempre habilitada; Discente e Verdadeiro ficam habilitados somente quando as formas correspondentes existem no ritual.
- Permite escolher o tipo da rolagem: Dano, Cura ou Utilidade.
- Para Dano, permite escolher o tipo de dano canônico do Toolkit, como Eletricidade, Sangue ou Corte.
- O bloco não duplica resistência, círculo, elemento, alvo, duração ou formas: esses dados continuam vindo da ficha original do sistema.
- Salva a configuração em `flags.paranormal-toolkit.ritualRollConfig`, sem alterar o DataModel do sistema.
- Esta versão entrega a UI/configuração; a execução automática dessa configuração fica para a próxima etapa.

### 0.19.4 — Fórmula configurada no ritual genérico

- O fluxo genérico de ritual passa a ler `flags.paranormal-toolkit.ritualRollConfig` quando não houver preset específico.
- A forma escolhida no popup usa a fórmula configurada para Padrão, Discente ou Verdadeiro.
- Tipo **Dano** rola a fórmula e cria ações assistidas de dano usando o Damage Adapter.
- Tipo **Cura** rola a fórmula e cria ação assistida de cura em PV.
- Tipo **Utilidade** rola a fórmula e registra o resultado no card, sem criar ação de aplicação.
- A resistência continua vindo dos campos originais do ritual e, por enquanto, só gera opções Normal/Metade quando o efeito original é `reducesByHalf`.

### 0.18.1 — Feedback de dano e Eletrocussão elétrica

- Corrige o preset de Eletrocussão para `1.4.1`, usando `damageType: "electric"`.
- Mantém o elemento do ritual como Energia, mas aplica o dano como Eletricidade no adapter do sistema.
- Ao aplicar dano assistido, o botão do card passa a mostrar o resultado real: `✓ X PV aplicado (RD Y)`.
- Cria um whisper para GMs com resumo de dano bruto, dano final, RD bloqueada e PV atual.
- O resumo suporta dano simples e dano misto, mostrando uma linha por tipo de dano.

### 0.18.0 — Damage Adapter para Ordem

- Adiciona uma camada `core/damage` para o Toolkit modelar dano por instâncias.
- Adiciona `OrdemDamageAdapter`, que chama `actor.applyDamage` do sistema Ordem em vez de reduzir PV manualmente.
- Mapeia tipos canônicos do Toolkit, como `energy`, `cutting` e `electric`, para os tipos internos do sistema, como `energyDamage`, `cuttingDamage` e `eletricDamage`.
- Suporta dano misto separando instâncias e aplicando cada tipo em uma chamada própria, permitindo que a RD correta do sistema seja usada por tipo de dano.
- Atualiza o preset de Eletrocussão para `1.4.0`, usando temporariamente `damageType: "energy"`.

### 0.17.9 — Duração Toolkit desacoplada do Foundry

- Condições com duração por rodada passam a guardar a regra real somente em flags do Paranormal Toolkit.
- O ActiveEffect fica indefinido para o Foundry, evitando expiração antecipada na virada da rodada.
- O cleanup automático ignora a expiração nativa para condições temporárias do Toolkit.
- A remoção ocorre apenas quando chega ao turno do combatente afetado na rodada correta.
- O efeito força exibição de ícone no token via `showIcon`, sem depender de duração nativa finita.

### 0.17.8 — Duração de condição por turno do afetado

- Corrige a expiração de condições de 1 rodada para não sair na simples virada da rodada.
- O Toolkit passa a controlar a duração por flags próprias, sem depender da expiração nativa do Foundry para esse caso.
- A ação assistida da Eletrocussão ancora a duração no combatente que recebeu a condição.
- Vulnerável aplicado no Amendoim, por exemplo, permanece após a virada da rodada e sai no início do próximo turno do Amendoim.
- Fora de combate, a duração por rodadas continua sendo ignorada com aviso, evitando criar uma expiração ambígua.

### 0.17.5 — Catálogo inicial de condições

- Expande o `ConditionRegistry` para um catálogo inicial com 34 condições informativas.
- Mantém IDs canônicos em inglês/código, seguindo o padrão interno do sistema, e adiciona aliases em português sem acento para uso em macros/console.
- Mantém os nomes exibidos em português no Active Effect.
- Cada condição fica em arquivo próprio em `src/features/conditions/conditions/`, preparando automações mecânicas futuras sem virar um arquivo gigante.
- As condições novas ainda não alteram mecânicas: todas usam `changes: []` por enquanto.
- `Vulnerável` continua usando o ID canônico `vulnerable`, então a Eletrocussão 1.3.0 não precisa mudar.

### 0.17.4 — Eletrocussão aplica Vulnerável assistido

- Atualiza o preset versionado de Eletrocussão para `1.3.0`.
- O card assistido passa a mostrar uma seção **Aplicar efeito** perto das ações de dano.
- A Eletrocussão cria a ação **Vulnerável: 1 rodada** para o alvo, independente da forma usada: Padrão, Discente ou Verdadeiro.
- A ação usa o `ConditionEngine` para criar `ActiveEffect` no Actor alvo, com duração de 1 rodada quando houver combate ativo.
- O Toolkit ainda não decide automaticamente se a Fortitude falhou; por enquanto o mestre clica no efeito quando fizer sentido.

### 0.17.3 — Cleanup automático tardio de condições temporárias

- Reintroduz limpeza automática usando `combatTurnChange`, que roda depois do update de combate do Foundry.
- O cleanup é atrasado e debounced para não competir com o ciclo interno de Active Effects.
- Só o cliente GM executa a limpeza automática; jogadores continuam podendo usar remoção manual se tiverem permissão no ator.
- Condições temporárias expiradas do Toolkit agora saem da ficha automaticamente depois que o Foundry termina de avançar o combate.
- A limpeza continua revalidando o Active Effect antes de deletar e tratando efeitos já removidos como sucesso defensivo.
- O comando manual `ParanormalToolkit.conditions.cleanupExpired()` continua disponível para debug.

### 0.17.2 — Cleanup defensivo de condições temporárias

- Remove a limpeza automática no hook `updateCombat`, evitando corrida com o ciclo interno de expiração do Foundry v14.
- Mantém cleanup em `ready`, cleanup tardio ao deletar combate e comando manual `ParanormalToolkit.conditions.cleanupExpired()`.
- A remoção revalida se o `ActiveEffect` ainda existe antes de deletar.
- Erros de efeito já removido pelo Foundry são tratados como sucesso defensivo, não como falha fatal.

### 0.17.1 — Limpeza de condições expiradas

- Condições temporárias criadas pelo Toolkit agora recebem flags de ciclo de vida (`deleteOnExpire` e `expiresWithCombat`).
- O `ConditionEngine` pode limpar Active Effects temporários expirados por comando manual ou fallback tardio, sem competir com o avanço de combate do Foundry.
- Ao deletar um combate, efeitos temporários do Toolkit associados a ele também são removidos.
- A API de console ganhou `ParanormalToolkit.conditions.cleanupExpired()` para forçar a limpeza manualmente em testes.

### 0.17.0 — Condition Engine MVP

- Introduz `ConditionEngine` separado do fluxo de rituais.
- Cria registry de condições em TypeScript, começando por `Vulnerável`.
- Aplica condições como `ActiveEffect` diretamente no ator alvo, sem criar Item.
- Guarda flags próprias do `paranormal-toolkit` para identificar condição, origem, versão da definição e duração solicitada.
- Expõe API de desenvolvimento em `ParanormalToolkit.conditions` para testar pelo console ou por macro.
- Suporta aplicação sem duração e duração por rodada quando há combate ativo.
- Integração com Eletrocussão e automação mecânica real ficam para versões futuras.


### 0.16.8 — Corrige fórmulas da Eletrocussão

- Atualiza o preset versionado de Eletrocussão para `1.2.0`.
- Corrige as fórmulas de dano para Padrão `3d6`, Discente `6d6` e Verdadeiro `8d6`.
- Itens que já tinham o preset antigo devem aparecer como desatualizados no diagnóstico e precisam ser reaplicados pelo GM.

### 0.16.7 — Ação contextual de SAN na conjuração

- A ação de dano de SAN por falha no Ocultismo deixa de aparecer como seção separada no fim do card.
- O botão agora aparece no cabeçalho da seção **Conjuração**, ao lado do status `Falha`, como ação contextual.
- Remove a observação redundante “Falha de conjuração...” do corpo do card; a consequência fica indicada pelo botão.

### 0.16.6 — Falha de conjuração causa dano de SAN

- Falha no teste de Ocultismo não cancela mais o ritual: dano, cura, resistência e efeitos assistidos continuam sendo preparados normalmente.
- Quando a conjuração falha, o card cria uma ação assistida para aplicar dano de SAN no conjurador.
- O valor sugerido de SAN usa o custo final da forma conjurada, incluindo Discente e Verdadeiro.

### 0.16.5 — Estado explícito de conjuração

- A forma selecionada e a opção de gasto de recurso passam a ser guardadas também no estado da aplicação.
- O botão Conjurar usa esse estado como fallback caso o DOM do Foundry não exponha os inputs no momento da ação.
- O workflow normaliza `spendResource` e ignora qualquer step de custo quando a opção de gastar está desmarcada.

### 0.16.3 — Seleção robusta de forma no popup de conjuração

- Corrige a leitura da forma escolhida quando o radio visual está escondido.
- Garante que Discente e Verdadeiro sejam enviados corretamente ao fluxo de conjuração.
- Mantém o visual limpo dos cards de forma sem perder seleção por teclado/clique.

### 0.16.2 — Correção visual do popup de conjuração

- Garante que o CSS novo dos cards de forma seja carregado por um stylesheet já existente do módulo.
- Esconde o radio visual dos cards de forma sem remover o input semântico.
- Mantém o custo ao lado do nome da forma no popup de conjuração.

### 0.16.1 — DialogModel do popup de conjuração e UX das formas

- Introduz `RitualCastDialogModel` como modelo único para renderizar o popup de conjuração.
- Mantém o popup renderizando um estado de tela já resolvido, em vez de espalhar regra de apresentação pela `ApplicationV2`.
- Para rituais genéricos, Discente e Verdadeiro passam a respeitar `item.system.studentForm` e `item.system.trueForm`.
- O custo por forma passa a ser aplicado também no fluxo genérico: Padrão usa custo base, Discente usa base + 2 e Verdadeiro usa base + 5.
- Move a pílula de PE para o lado do nome da forma e esconde o radio visual, deixando a seleção indicada pelo próprio card.

### 0.16.0 — Refactor interno do card de item use

- Separa a lógica incremental do card de item use em módulos menores por responsabilidade: registro, DOM, dados de rolagem, metadados de ritual, resistência e estilos.
- Mantém o ponto de entrada antigo `registerItemUseWorkflowDiceToggle` apenas como compatibilidade interna.
- Preserva o comportamento visual da série 0.15.x sem mudar regra, custo, resistência ou botões.
- Prepara a base para melhorar o fluxo de ritual genérico sem continuar inflando um único arquivo de renderer/hidratação.

### 0.15.6 — Ajuste fino do bloco de resistência

- Reorganiza o bloco de resistência em duas colunas: conteúdo à esquerda e botão de rolagem à direita.
- Garante que a descrição da resistência não avance para a área reservada ao botão d20.
- Alinha título, descrição e resultado de resistência com espaçamento consistente.

### 0.15.5 — Correção de hierarquia visual dos metadados de ritual

- Move os chips de custo, alvo, duração e resistência para o cabeçalho do card, junto do nome/forma e do alvo selecionado.
- Mantém as seções de workflow focadas apenas em conjuração, dano/cura/efeito e resistência assistida.
- Garante o estilo do badge de elemento/círculo e dos chips mesmo em cards reidratados do chat.

### 0.15.4 — Metadados de ritual no topo do card

- Move os metadados do ritual para o topo do card, antes das seções de conjuração e dano.
- Remove a tag de forma duplicada, já que a forma aparece no título do card.
- Exibe o elemento/círculo como badge principal abaixo do nome do ritual.
- Adiciona chips compactos para custo gasto, alvo de regra, duração e resistência.
- Usa dados estruturados do `chatCard` e do `item.system` do ritual, sem depender do HTML do card original do sistema.

### 0.15.3 — Dados da rolagem sob demanda no card de ritual

- Remove visualmente o bloco expansível de detalhes duplicados das seções de workflow do card de ritual.
- Mantém resultado, DT, status e fórmula sempre visíveis no resumo da seção.
- Esconde os dados brutos por padrão para reduzir altura do card.
- Permite clicar na fórmula da rolagem para abrir/fechar apenas as pílulas dos dados rolados.

### 0.15.1 — animação Dice So Nice no teste de conjuração

- Corrige o teste de Ocultismo de conjuração para também passar pelo serviço de animação do Dice So Nice.
- Mantém a rolagem sem mensagem extra de chat; apenas anima os dados e registra o resultado no card persistente do Toolkit.

### 0.15.0 — Teste de Ocultismo na conjuração

A versão `0.15.0` adiciona a etapa de conjuração real no fluxo de rituais: antes de resolver dano, cura ou efeitos, o Toolkit rola **Ocultismo** pelo método nativo do sistema Ordem e compara o resultado com `actor.system.ritual.DT`.

Decisões desta versão:

```txt
- a DT vem do ator, não de cálculo próprio do Toolkit;
- a rolagem usa actor.rollSkill({ skill: "occultism" }) via adapter;
- em falha, o efeito do ritual não é resolvido e nenhum botão de dano/cura é criado;
- o custo é gasto na tentativa de conjuração quando o jogador marcou gasto de recurso;
- o resultado é persistido no chatCard do Toolkit e sobrevive a reload;
- existe setting de mundo para desligar essa etapa se a mesa quiser fluxo rápido.
```

### 0.14.3 — Decisão futura sobre macros

A versão `0.14.3` documenta a decisão arquitetural para macros/scripts: o Toolkit **não** será baseado em macros como fonte principal de regra. O core continua sendo TypeScript tipado, presets estruturados, steps de automação e adapters do sistema.

Quando a API estiver mais madura, macros entram como uma camada avançada e opcional de extensão, para casos específicos que ainda não justificam um step nativo.

Regras da decisão:

```txt
- macro não é o formato principal de automação;
- macro não substitui step nativo quando o step resolve;
- macro recebe contexto limitado e documentado;
- macro passa por executor próprio com try/catch e erro amigável;
- macro não acessa paths internos do sistema se houver adapter;
- macro é opt-in para mestre/preset avançado;
- presets básicos do Toolkit não dependem de macro.
```

### 0.14.0 — Dialog geral de conjuração em ApplicationV2

A versão `0.14.0` troca o popup legado de ritual por uma `ApplicationV2` própria. O Toolkit passa a abrir a tela de conjuração para qualquer ritual usado pela ficha: rituais com preset continuam usando a automação assistida; rituais sem preset geram um card persistente simples de conjuração e, se o jogador escolher, gastam o custo base de PE/PD.

Decisões importantes:

```txt
- o popup nasce ApplicationV2;
- o visual segue a mesma família do card de chat do Toolkit;
- formas Discente/Verdadeiro só ficam habilitadas quando houver dado estruturado/preset;
- o custo exibido por forma é sempre valor final, não "+2 PE" ou "+5 PE";
- sem preset, o Toolkit não inventa fórmula, efeito ou custo extra.
```

### 0.14.3 — Layout compacto do dialog de ritual

A versão `0.14.3` reduz a altura do popup de conjuração: as formas Padrão, Discente e Verdadeiro aparecem em cards lado a lado, o bloco de custo usa resumo compacto para custo/conjurador/alvos e os radios passam a ter visual claro próprio do Toolkit.

### 0.13.12 — Card persistente como fonte primária

A versão `0.13.12` fecha a base do card assistido persistente: `flags.paranormal-toolkit.chatCard` passa a ser a fonte primária de leitura e escrita do card do Toolkit. A flag legada `flags.paranormal-toolkit.itemUsePrompts` ainda é mantida como espelho temporário para compatibilidade com mensagens antigas, mas o renderer e os fluxos pós-F5 devem depender do modelo estruturado do `chatCard`.

Arquitetura do card persistente:

```txt
ChatMessage do sistema Ordem
```
