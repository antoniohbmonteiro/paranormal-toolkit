# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas de Ordem Paranormal no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.10.4`.

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
| Conjuração assistida de rituais | Abre popup para forma do ritual, gasto opcional de PE/PD, rola dados pelo Toolkit e cria ações reais de cura/dano no chat. | MVP implementado |
| Bloqueio de rolagem duplicada | Evitará confusão com rolagens inline na descrição, como `[[2d8+2]]`, quando houver automação ativa. | Planejado |
| Condições e efeitos | Aplicará condições e Active Effects quando rituais, habilidades ou regras pedirem. | Planejado |
| Armas e melhorias | Validará categoria, modificações, melhorias e limites por patente/categoria. | Planejado |
| Integração com animações | Preparará eventos para efeitos visuais, sons e animações em um módulo companion. | Planejado |

O Paranormal Toolkit é pensado para ser configurável por mesa: o mestre pode deixar tudo desligado, usar modo assistido no chat ou ativar automações mais diretas conforme o estilo do grupo.

## Requisitos

- Foundry VTT v14+
- Sistema alvo: `ordemparanormal`

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

A forma do ritual ainda é registrada no workflow, mas o MVP não altera fórmula/custo por forma automaticamente. Essa evolução virá quando os presets de ritual tiverem dados estruturados para cada forma.

O checkbox de gasto de PE/PD existe porque mesa real é bagunçada no melhor sentido: o mestre pode desligar custo, o jogador pode já ter gastado manualmente ou alguém pode estar corrigindo um clique errado.

## Presets iniciais

Presets built-in atuais:

```txt
ritual.costOnly
ritual.simpleHealing
ritual.eletrocucao
ritual.simpleDamage
generic.simpleHealing
```

`Cicatrização` já é reconhecida por nome normalizado e aponta para um preset inicial de cura. `Eletrocussão` também é reconhecida por nome normalizado e aponta para um preset inicial de dano de energia: custo do ritual, rolagem `1d8` e ação assistida para aplicar dano em PV. A resistência de Fortitude para reduzir dano à metade ainda deve ser resolvida manualmente até o Toolkit ter workflow de resistência.

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

Antes da `1.0.0`, o foco é estabilizar a base:

- adicionar testes unitários para core;
- separar melhor core puro de APIs globais do Foundry;
- reduzir responsabilidades do `AutomationRunner`;
- evoluir o modo `ask` para mais ações específicas no chat, como aplicar condição e resistência;
- evoluir diálogo de conjuração de ritual para alterar fórmula/custo por forma base/discente/verdadeira;
- criar bloqueio visual de rolagens inline duplicadas;
- criar presets específicos por ritual;
- iniciar automações de armas, melhorias e categoria;
- preparar integração com condições, Active Effects V2 e Template Regions.

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
