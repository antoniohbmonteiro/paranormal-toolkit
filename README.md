# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas de Ordem Paranormal no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão experimental atual: `v0.8.1`.

O projeto ainda está em desenvolvimento ativo. A base atual já possui automações funcionais para recursos, rituais, presets e workflows, mas a UX final de mesa ainda está em construção.

Até a versão `1.0.0`, APIs internas, flags e presets ainda podem mudar sem compatibilidade retroativa.

## Principais recursos

| Recurso | O que faz | Status |
|---|---|---|
| Custo de rituais | Calcula o custo pelo círculo e gasta PE quando a automação é usada. | Implementado |
| Cura e dano automáticos | Rola a fórmula configurada e aplica cura ou dano no alvo selecionado. | Implementado |
| Controle de recursos | Gasta, cura, recupera ou reduz PV, SAN, PE e PD respeitando limites da ficha. | Implementado |
| Automações por item | Permite aplicar automações em rituais, habilidades ou itens usando flags próprias do módulo. | Implementado |
| Uso pela ficha | Executa automações experimentais ao usar o item normalmente pela ficha do sistema. | Experimental |
| Modos de automação | Permitirá ao mestre escolher entre manual, botões, confirmação ou execução automática. | Planejado |
| Botões no chat | Permitirá rolar, gastar recurso e aplicar efeitos direto pelo card do chat. | Planejado |
| Bloqueio de rolagem duplicada | Evitará confusão com rolagens inline na descrição, como `[[2d8+2]]`, quando houver automação ativa. | Planejado |
| Condições e efeitos | Aplicará condições e Active Effects quando rituais, habilidades ou regras pedirem. | Planejado |
| Armas e melhorias | Validará categoria, modificações, melhorias e limites por patente/categoria. | Planejado |
| Integração com animações | Preparará eventos para efeitos visuais, sons e animações em um módulo companion. | Planejado |

O Paranormal Toolkit é pensado para ser configurável por mesa: o mestre pode deixar tudo manual, usar apenas botões assistidos ou ativar automações mais completas conforme o estilo do grupo.

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
gastar custo/recurso
↓
rolar fórmula
↓
aplicar cura/dano/efeito
↓
gerar resumo
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

## Presets iniciais

Presets built-in atuais:

```txt
ritual.costOnly
ritual.simpleHealing
ritual.simpleDamage
generic.simpleHealing
```

`Cicatrização` já é reconhecida por nome normalizado e aponta para um preset inicial de cura. Isso é apenas o começo do modelo: nome pode ajudar a encontrar uma automação compatível, mas a execução real usa a flag gravada no item.

## Uso pela ficha

A partir da linha `0.8.x`, o Toolkit consegue executar automações quando um item automatizado é usado normalmente pela ficha do sistema.

A execução automática fica desligada por padrão por ser experimental.

Para testar:

```js
await ParanormalToolkit.debug.automation.applyBestPresetToFirstRitual();
await ParanormalToolkit.debug.itemUseIntegration.enable();

ParanormalToolkit.debug.itemUseIntegration.status();
```

Depois use o item/ritual pela ficha. Se o item tiver `flags.paranormal-toolkit.automation.definition`, o workflow será executado usando o ator do item como origem e os targets atuais do usuário como alvos.

Para desativar:

```js
await ParanormalToolkit.debug.itemUseIntegration.disable();
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

Para inspecionar o último workflow executado:

```js
ParanormalToolkit.debug.workflow.lastContext();
```

Esse comando retorna um snapshot enxuto, sem despejar `Actor`, `Item`, `Token` ou `Roll` completos no console.

## Roadmap resumido

Antes da `1.0.0`, o foco é estabilizar a base:

- adicionar testes unitários para core;
- separar melhor core puro de APIs globais do Foundry;
- reduzir responsabilidades do `AutomationRunner`;
- trocar `autoRun` boolean por modos de automação;
- usar `ordemparanormal.itemUsed` como integração principal quando disponível;
- manter wrapper de item como fallback temporário;
- adicionar botões no chat para automação assistida;
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
