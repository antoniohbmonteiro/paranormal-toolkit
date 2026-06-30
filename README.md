# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas de Ordem Paranormal no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.15.0`.

O projeto ainda está em desenvolvimento ativo. A base atual já possui automações funcionais para recursos, rituais, presets e workflows, além da integração com o hook oficial de uso de item do sistema não-oficial de Ordem Paranormal e do primeiro fluxo assistido de conjuração de rituais.

Até a versão `1.0.0`, APIs internas, flags e presets ainda podem mudar sem compatibilidade retroativa.

## Principais recursos

| Recurso | O que faz | Status |
|---|---|---|
| Custo de rituais | Calcula o custo pelo círculo e gasta PE quando a automação é usada. | Implementado |
| Cura e dano automáticos | Rola a fórmula configurada e aplica cura ou dano no alvo selecionado. | Implementado |
| Controle de recursos | Gasta, cura, recupera ou reduz PV, SAN, PE e PD respeitando limites da ficha. | Implementado |
| Automações por item | Permite aplicar automações em rituais, habilidades ou itens usando flags próprias do módulo. | Implementado |
| Uso pela ficha | Escuta o hook `ordemparanormal.itemUsed` do sistema e reage ao uso normal de itens automatizados. | Implementado inicial |
| Modo perguntar no chat | Ao usar um item automatizado, cria ações assistidas no card de chat em vez de aplicar imediatamente. | Implementado inicial |
| Modo automático | Executa a automação diretamente ao usar o item. | Experimental |
| Conjuração geral de rituais | Abre ApplicationV2 para qualquer ritual, mostra forma/custo final, rola Ocultismo contra a DT de ritual do conjurador e usa automação assistida quando houver preset. | MVP implementado |
| Formas de ritual | Presets podem declarar Padrão, Discente e Verdadeiro com custo extra, fórmula própria e notas manuais no chat. | MVP implementado |
| Dice So Nice | Quando o módulo Dice So Nice está ativo, as rolagens do Toolkit são animadas em 3D sem criar mensagem extra no chat. | Implementado inicial |
| Bloqueio de rolagem duplicada | Evitará confusão com rolagens inline na descrição, como `[[2d8+2]]`, quando houver automação ativa. | Planejado |
| Condições e efeitos | Aplicará condições e Active Effects quando rituais, habilidades ou regras pedirem. | Planejado |
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
├─ content original do sistema, mantido como fallback
└─ flags.paranormal-toolkit.chatCard
   ├─ source: ator e item
   ├─ prompts/actions persistidos
   ├─ resultado de resistência
   └─ estado executado/skipped dos botões
```

O modo **Manter** adiciona o card do Toolkit abaixo do card original. O modo **Substituir** troca apenas a renderização visual da mensagem; a `ChatMessage` original não é destruída.

### 0.13.11 — Reidratação após F5

A versão `0.13.11` corrige a reidratação visual dos cards já renderizados no histórico do chat. Após reload, o Toolkit varre as mensagens existentes no DOM, lê `flags.paranormal-toolkit.chatCard` e redesenha o card assistido respeitando a configuração de manter/substituir.


### 0.13.10 — Persistência robusta da ChatMessage

A versão `0.13.10` corrige a gravação do card estruturado quando o hook do sistema não entrega uma `ChatMessage` resolvida imediatamente. O Toolkit agora procura a mensagem recém-criada no histórico do chat, tenta novamente por alguns segundos e grava `flags.paranormal-toolkit.chatCard` antes de depender do F5.

### 0.13.9 — Card persistente estruturado

A versão `0.13.9` adicionou o modelo estruturado em `flags.paranormal-toolkit.chatCard`. A `0.13.10` corrigiu o ponto de escrita para garantir que a flag seja gravada na `ChatMessage` real. A `0.13.12` consolida essa flag como fonte primária do card.

### 0.13.8 — Card persistente e modo substituir

A versão `0.13.8` adicionou a configuração para manter ou substituir visualmente o card original do sistema Ordem. A base atual usa `flags.paranormal-toolkit.chatCard` para não depender de prompts em memória nem de mensagem resolvida cedo demais.

### 0.13.7 — Rolagem correta de resistência

A versão `0.13.7` corrige o botão d20 do bloco de resistência para usar a rolagem nativa de perícia do sistema Ordem. Fortitude, Reflexos e Vontade agora são roladas pelo `actor.rollSkill` do sistema, sem criar outro card de chat e sem fallback silencioso para `1d20`.

### 0.13.4 — Polish do card de resistência

A versão `0.13.4` ajusta o layout do card de resistência assistida para cards estreitos do chat: o bloco de resistência ganhou mais respiro, o rótulo ficou compacto e os botões de dano normal/metade usam textos mais curtos.

### 0.13.0 — Resistência assistida

A versão `0.13.0` adiciona o primeiro fluxo de resistência assistida para rituais de dano. O Toolkit ainda não rola a resistência do alvo automaticamente; ele prepara opções de aplicação para o mestre escolher.

Para Eletrocussão, o card do Toolkit passa a exibir:

```txt
Resistência: Fortitude reduz dano à metade

[Aplicar dano normal]
[Aplicar metade]
```

As duas ações são tratadas como alternativas do mesmo grupo: quando uma é escolhida, a outra é marcada como indisponível para evitar dano duplicado.

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Rode typecheck e build:

```bash
npm run typecheck
npm run build
```

Ou rode em modo watch:

```bash
npm run dev
```

## Instalação local para desenvolvimento

Crie um link simbólico deste projeto dentro da pasta de módulos do Foundry.

No Windows, em um terminal com permissão de administrador:

```powershell
mklink /D "C:\Users\SEU_USUARIO\AppData\Local\FoundryVTT\Data\modules\paranormal-toolkit" "C:\caminho\para\paranormal-toolkit"
```

Depois, ative o módulo no mundo do Foundry.

## Como funciona

O Toolkit usa automações aplicadas em itens por flags próprias do módulo.

Fluxo conceitual:

```txt
item usado
↓
resolver origem e alvos
↓
modo disabled, ask ou automatic
↓
para rituais em ask: abrir popup de conjuração
↓
gastar custo/recurso quando marcado
↓
rolar fórmula pelo Toolkit
↓
preparar ações de cura/dano no chat
↓
aplicar cura/dano/efeito quando a ação for clicada
```

A descrição do item não é fonte de verdade para automação. Rolagens inline como `[[2d8+2]]` pertencem ao texto/renderização do Foundry, enquanto a automação real fica em dado estruturado salvo na flag do item.

Formato conceitual da flag:

```ts
flags["paranormal-toolkit"].automation = {
  schemaVersion: 1,
  source: {
    type: "preset",
    presetId: "ritual.simpleHealing",
    presetVersion: "1.0.0",
    appliedAt: "...",
    appliedBy: "..."
  },
  definition: {
    version: 1,
    label: "Ritual de cura simples",
    steps: []
  }
};
```

## Modos de automação ao usar item

A partir da `0.9.1`, a configuração principal é `executionMode`.

```txt
disabled  -> não faz nada quando um item é usado
ask       -> mostra ação assistida no chat
automatic -> executa a automação diretamente
```

`ask` é o modo recomendado durante o desenvolvimento e para mesas reais. Ele representa uma decisão de produto: o Toolkit pode preparar o workflow, mas a aplicação de cura, dano ou efeito deve acontecer por uma ação clara no chat.

O botão atual ainda é um fallback genérico de automação. A evolução planejada é trocar esse fallback por ações específicas de jogo, por exemplo:

```txt
Curar Amendoin
Aplicar dano em Existido
Gastar PE
Testar resistência
Aplicar condição
```

Os modos antigos `buttons` e `confirm` são tratados como compatibilidade e convertidos para `ask`.


## Conjuração assistida de rituais

A partir da `0.10.0`, rituais automatizados em modo `ask` usam um fluxo assistido inicial.

> Aviso temporário: até o sistema Ordem expor uma etapa pré-`ChatMessage.create`, o Toolkit ainda não consegue impedir completamente rolagens inline da descrição nem evitar que o card original seja criado antes da confirmação do popup. O resultado oficial automatizado é o bloco do Paranormal Toolkit.

Fluxo atual:

```txt
usar ritual pela ficha
↓
popup de conjuração
↓
escolher forma: Padrão, Discente ou Verdadeiro
↓
marcar ou desmarcar gasto automático de PE/PD
↓
Toolkit rola a fórmula configurada
↓
card de chat recebe resumo e ações reais
```

Exemplo de ação no chat:

```txt
Curar Amendoin em 11 PV
Aplicar 12 de dano em Existido
```

A forma do ritual agora é lida do dado estruturado salvo pela automação. O popup habilita apenas as formas declaradas pelo preset aplicado; os checkboxes da ficha são apenas reflexo visual do patch de item.

O checkbox de gasto de PE/PD existe porque mesa real é bagunçada no melhor sentido: o mestre pode desligar custo, o jogador pode já ter gastado manualmente ou alguém pode estar corrigindo um clique errado.


## Formas estruturadas de rituais

A partir da `0.11.0`, a fonte de verdade para Padrão, Discente e Verdadeiro é a automação aplicada pelo preset, não os checkboxes da ficha.

```txt
preset/flag controla comportamento
patch visual atualiza system.studentForm/system.trueForm
popup lê as formas estruturadas da automação
```

Isso evita que uma edição manual na ficha quebre o workflow. Rodar `applyBestPresetToAllRituals()` novamente normaliza a automação e os dados visíveis do item.

Para Eletrocussão, o MVP atual usa:

```txt
Padrão      -> 1d8
Discente    -> +2 PE, 3d8
Verdadeiro  -> +5 PE, 6d8
```

O Verdadeiro também imprime no chat uma observação para aplicar Atordoado manualmente caso o alvo falhe na Fortitude.

## Animação de dados com Dice So Nice

A partir da `0.11.1`, as rolagens feitas pelo workflow do Toolkit podem acionar o Dice So Nice quando ele estiver instalado e ativo.

A partir da `0.11.4`, os resultados do Toolkit no chat usam um card próprio mais legível: total em destaque, fórmula visível, metadados de forma/custo/tipo e detalhes expansíveis da rolagem. A ideia é deixar a automação parecer ferramenta de mesa, não só debug formatado.

A partir da `0.11.6`, os detalhes expansíveis do card mantêm labels limpos, valores alinhados à esquerda e breakdown de dados com dados rolados entre parênteses, por exemplo `(4, 5) + 2`.

O Toolkit chama a API 3D diretamente e **não cria uma mensagem extra no chat** para essas rolagens. O resultado continua sendo mostrado no bloco do Paranormal Toolkit dentro do card original do item.

```txt
Roll.evaluate() do Toolkit
↓
se Dice So Nice estiver ativo e a setting permitir
↓
game.dice3d.showForRoll(...)
↓
sem ChatMessage extra
```

A setting fica em:

```txt
Paranormal Toolkit → Animar rolagens com Dice So Nice
```

Sem Dice So Nice, o workflow continua funcionando normalmente e apenas ignora a animação.

## Presets iniciais

Presets built-in atuais:

```txt
ritual.costOnly
ritual.simpleHealing
ritual.eletrocucao
ritual.simpleDamage
generic.simpleHealing
```

`Cicatrização` já é reconhecida por nome normalizado e aponta para um preset inicial de cura. Ela só possui forma Padrão no Toolkit. `Eletrocussão` também é reconhecida por nome normalizado e aponta para um preset inicial de dano de energia com formas estruturadas: Padrão `1d8`, Discente `3d8` com `+2 PE` e Verdadeiro `6d8` com `+5 PE`. A resistência de Fortitude agora gera opções assistidas de dano normal/metade para o mestre escolher; a condição Atordoado do Verdadeiro ainda deve ser resolvida manualmente até o Toolkit ter Condition Engine.

Isso é apenas o começo do modelo: nome pode ajudar a encontrar uma automação compatível, mas a execução real usa a flag gravada no item.

## Uso pela ficha

A partir da linha `0.9.x`, o Toolkit usa `ordemparanormal.itemUsed` como fonte principal de uso de item no sistema não-oficial de Ordem Paranormal.

Para testar o modo assistido com todos os rituais conhecidos do ator selecionado:

```js
await ParanormalToolkit.debug.automation.applyBestPresetToAllRituals();
await ParanormalToolkit.debug.itemUseIntegration.ask();

ParanormalToolkit.debug.itemUseIntegration.status();
```

O comando antigo `applyBestPresetToFirstRitual()` continua disponível para testes pontuais, mas o fluxo recomendado agora é aplicar presets em todos os rituais do ator selecionado.

Depois use o item/ritual pela ficha. Se o item tiver `flags.paranormal-toolkit.automation.definition`, o Toolkit criará uma ação assistida no card de chat do item.

Para desativar:

```js
await ParanormalToolkit.debug.itemUseIntegration.disable();
```

Para executar diretamente, uso recomendado apenas para teste controlado:

```js
await ParanormalToolkit.debug.itemUseIntegration.automatic();
```

## API de debug

A API global de debug fica disponível em:

```js
ParanormalToolkit
```

Principais grupos atuais:

```txt
debug.actor.*
debug.ritual.*
debug.workflow.*
debug.automation.*
debug.itemUseIntegration.*
debug.output.*
```

Comandos úteis para automações e uso de item:

```js
await ParanormalToolkit.debug.automation.applyBestPresetToAllRituals();
await ParanormalToolkit.debug.automation.applyBestPresetToFirstRitual();

await ParanormalToolkit.debug.itemUseIntegration.disable();
await ParanormalToolkit.debug.itemUseIntegration.ask();
await ParanormalToolkit.debug.itemUseIntegration.automatic();

ParanormalToolkit.itemUseIntegration.status();
```

`applyBestPresetToAllRituals()` retorna um resumo com rituais atualizados e rituais ignorados por falta de preset compatível. Isso facilita testar Cicatrização e Eletrocussão no mesmo ator sem reaplicar preset manualmente.

Para inspecionar o último workflow executado:

```js
ParanormalToolkit.debug.workflow.lastContext();
```

Esse comando retorna um snapshot enxuto, sem despejar `Actor`, `Item`, `Token` ou `Roll` completos no console.


## Presets de ritual e dados visíveis do item

A partir da `0.10.4`, presets específicos de ritual podem aplicar duas coisas juntas:

- a automação do Toolkit, com custo, rolagem, cura/dano e botão assistido no chat;
- um patch visual/dados do item, com nome, círculo, elemento, execução, alcance, alvo, duração, resistência e descrição técnica do Toolkit.

Por enquanto isso é intencionalmente acoplado ao ato de aplicar preset. Rodar o comando abaixo normaliza o item novamente:

```js
await ParanormalToolkit.debug.automation.applyBestPresetToAllRituals();
```

Presets atuais com patch de item:

```txt
Cicatrização
- Círculo: 1
- Elemento: Morte
- Execução: Padrão
- Alcance: Toque
- Alvo: 1 ser
- Duração: Instantânea
- Resistência: nenhuma

Eletrocussão
- Círculo: 1
- Elemento: Energia
- Execução: Padrão
- Alcance: Médio
- Alvo: 1 ser
- Duração: Instantânea
- Resistência: Fortitude reduz à metade
```

A descrição original é substituída por um aviso curto do Paranormal Toolkit. Isso evita redistribuir texto protegido e deixa claro que a automação é controlada pela flag do módulo, não pela descrição do item. Se o jogador ou mestre editar a descrição depois, a automação continua funcionando.

## Roadmap resumido

O roadmap detalhado, com níveis de prioridade, fica em [`docs/ROADMAP.md`](docs/ROADMAP.md).

Prioridades atuais antes da `1.0.0`:

| Prioridade | Frente | Objetivo |
|---|---|---|
| P1 | Presets na ficha | Implementado: ação de GM na ficha do ator para aplicar presets do Toolkit em todos os rituais conhecidos, sem depender do console. |
| P1 | Resistência assistida | Implementado inicial: rituais podem mostrar opções para o mestre aplicar dano normal/metade; dobro e outras variações ficam para evolução futura. |
| P2 | Condições informativas | Criar Condition Engine inicial com Active Effects gerenciados pelo Toolkit, flags próprias, duração e progressão simples, como Abalado evoluindo para Apavorado. |
| P2 | Permissões e visibilidade | Controlar quem vê detalhes e quem pode executar ações de chat, como aplicar dano, cura, resistência ou condição. Esta frente está em hold até o fluxo de ações estabilizar. |
| P2 | Hook pré-chat no sistema | Evoluir a integração com o sistema Ordem para uma etapa pré-`ChatMessage.create`, permitindo cancelar ou preparar o uso de item antes do card original. |
| P3 | Armas e categorias | Automatizar melhorias, modificações, categoria base, aumento de categoria, categoria final e validação por patente/categoria. |
| P3 | FX e Sheets | Preparar eventos para Paranormal FX e, depois, evoluir Paranormal Sheets com UX moderna. |

A versão `1.0.0` deve representar uma API interna mais estável, flags documentadas, UX utilizável em mesa real, testes mínimos para core e documentação técnica separada.

## Práticas de Git e releases

Antes da `1.0.0`, o projeto usa um fluxo simples de desenvolvimento para permitir iteração rápida.

Após a `1.0.0`, a intenção é adotar práticas mais formais de manutenção, como:

- Pull Requests para mudanças relevantes;
- branch principal protegida;
- Git Flow ou fluxo equivalente com branch estável de release;
- versionamento semântico;
- tags por release;
- changelog por versão;
- CI com typecheck, build e testes;
- política de compatibilidade para flags e presets.

## Princípios

- O Toolkit é companion opcional, não substituto do sistema base.
- Automação é opt-in por flags.
- A descrição do item não é fonte de verdade para automação.
- Nome de item pode sugerir preset, mas execução depende da flag aplicada.
- Core não deve conhecer paths internos do sistema.
- Paths ficam em adapters.
- UI, debug e regra de negócio devem ficar separados.
- Integrações visuais devem ficar no Paranormal FX, não no Toolkit.
- O módulo público não deve redistribuir textos oficiais, artes, compêndios protegidos ou assets de terceiros sem licença.

## Licença

Código sob licença MIT.

Este projeto não é oficial e não possui afiliação com os detentores da marca Ordem Paranormal.


## 0.12.1

Correção do clique na ação de presets de rituais no menu da ficha.


## 0.12.4

Polimento visual do gerenciador de presets de rituais:

- fundo do popup mais opaco para melhorar legibilidade;
- cards internos com contraste maior;
- lista de rituais sem preset ocultada do painel para manter o foco no fluxo do Toolkit.


## 0.13.0

Resistência assistida inicial:

- Eletrocussão declara Fortitude reduz dano à metade;
- card de ritual mostra bloco simples de resistência;
- ações alternativas de dano normal/metade são criadas no chat;
- escolher uma ação desabilita a alternativa irmã para evitar aplicação duplicada.


### 0.13.4 — seções de ações no card

- As ações assistidas do chat agora carregam metadados de seção.
- O renderer cria seções independentes, como **Aplicar danos**, **Aplicar cura** e **Aplicar recursos**.
- Os textos dos botões ficaram mais curtos e dependem do cabeçalho do card para indicar origem e alvo.
- Essa base prepara o card para ações futuras, como rolar resistência e aplicar condições, sem empilhar `if` visual no fluxo de ritual.

### 0.13.12 — card persistente como fonte primária

- `flags.paranormal-toolkit.chatCard` passa a ser a fonte primária do card assistido;
- `flags.paranormal-toolkit.itemUsePrompts` continua existindo apenas como espelho legado temporário;
- cards antigos que só tenham `itemUsePrompts` ainda podem ser lidos;
- novos updates de resistência e botões escrevem o modelo estruturado do card antes do espelho legado;
- essa base prepara o popup geral de rituais para gerar cards próprios sem depender do card visual do sistema.

### 0.13.11 — reidratação do card após F5

- agenda reidratação após o `ready`;
- varre mensagens já renderizadas no chat;
- redesenha o card do Toolkit a partir de `flags.paranormal-toolkit.chatCard`;
- respeita o modo **Manter** ou **Substituir** depois do reload.

### 0.13.8 — card persistente e substituição visual

- adiciona setting de mundo para o card original do sistema: **Manter card original** ou **Substituir pelo card do Toolkit**;
- em modo substituir, o conteúdo visual da mensagem é trocado pelo card persistente do Toolkit sem apagar a `ChatMessage`;
- o render do chat usa as flags persistidas para reconstruir o card após F5;
- o resultado da rolagem de resistência continua persistido no card.

### 0.13.7 — botão d20 de resistência

- adiciona botão compacto de d20 no bloco de Resistência do card assistido;
- o mestre pode rolar a resistência do alvo diretamente pelo card;
- usa o roller nativo de perícia do sistema Ordem, então Fortitude com Vigor 3 rola como teste real de Fortitude do sistema;
- não cria um segundo card de chat só para a resistência;
- após a rolagem, o botão mostra o resultado e o card exibe a fórmula usada;
- ainda não compara automaticamente com DT do ritual.
