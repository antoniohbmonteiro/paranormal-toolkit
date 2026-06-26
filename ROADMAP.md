# Paranormal Toolkit — Roadmap

Roadmap inicial da suíte de módulos companion para o sistema não-oficial `ordemparanormal` no Foundry VTT.

O objetivo do projeto não é substituir o sistema base. O Toolkit deve atuar como uma camada opcional de automação, qualidade de vida e workflows em cima dos documentos do sistema.

## Princípios

- Foundry VTT v14-first.
- TypeScript, Vite e ES Modules.
- Automação opt-in: mestres podem usar ou ignorar.
- Integração desacoplada com o sistema `ordemparanormal`.
- Paths internos do sistema devem ficar isolados em adapters.
- Evitar depender de HTML/templates internos da ficha.
- Preferir APIs públicas do Foundry.
- Usar flags próprias do módulo para dados próprios.
- Não distribuir conteúdo oficial, textos oficiais, artes ou compêndios protegidos.
- Não empacotar assets de terceiros; módulos visuais devem referenciar assets instalados pelo usuário.

## Módulos planejados

### Paranormal Toolkit

Módulo principal de automações e qualidade de vida.

Responsável por:

- recursos de ator: PV, SAN, PE e PD;
- gasto automático de recursos;
- workflows de item, habilidade e ritual;
- chat cards enriquecidos;
- automações configuráveis por flags;
- modificações/melhorias de armas;
- cálculo e validação de categoria de arma;
- integração futura com Active Effects, Template Regions e Paranormal FX.

### Paranormal FX

Módulo visual separado para animações, efeitos e sons.

Direção inicial:

- requer Sequencer;
- requer JB2A gratuito na primeira versão;
- não empacota assets de terceiros;
- escuta eventos/hooks do Toolkit ou do sistema;
- fornece presets visuais configuráveis.

### Paranormal Sheets

Módulo de ficha/UX alternativa.

Status atual: baixa prioridade.

O sistema base deve receber melhorias de ficha/UX diretamente. Se esse módulo existir no futuro, deve ser tratado como alternativa visual opcional, não substituição da ficha principal.

## v0.1 — Fundação do Toolkit

Status: fechado.

Objetivo: provar que o módulo carrega, reconhece o sistema, lê dados reais de ator e executa a primeira automação simples.

Escopo:

- scaffold Foundry v14+;
- TypeScript + Vite;
- `module.json` compatível com Foundry v14;
- guard para `game.system.id === "ordemparanormal"`;
- `OrdemAdapter` inicial;
- leitura de PV, SAN, PE, PD e DT de ritual;
- `ActorResolver` para token selecionado;
- API global de debug;
- `ParanormalToolkit.debug.actor.logResources()`;
- `ParanormalToolkit.debug.actor.spendPE(amount)`;
- validação de PE insuficiente;
- `Result` type para falhas esperadas;
- chat card simples ao gastar PE.

Critérios de aceite:

- módulo aparece no Foundry;
- módulo inicializa apenas no sistema `ordemparanormal`;
- token selecionado é encontrado;
- recursos do ator aparecem no console;
- PE diminui quando há PE suficiente;
- PE não fica negativo;
- PE insuficiente vira aviso controlado;
- gasto de PE gera chat card;
- build passa.

## v0.2 — Resource Engine + Chat Enrichment

Objetivo: transformar o gasto de PE em uma camada genérica de recursos e começar a enriquecer os chat cards existentes do sistema.

Status: implementado e validado em mesa local.

Escopo planejado:

- `ResourceEngine` genérico;
- operações de recurso:
  - gastar PE;
  - gastar PD;
  - causar dano em PV;
  - curar PV;
  - causar dano em SAN;
  - recuperar SAN;
- validação de mínimo/máximo;
- transações rastreáveis de recurso;
- chat cards genéricos para gasto, dano, cura e falhas;
- captura de targets no momento da criação do chat;
- flags de workflow em `ChatMessage`;
- bloco visual do Toolkit abaixo do card original do sistema.

Critérios de aceite:

```js
await ParanormalToolkit.debug.actor.spendPE(1);
await ParanormalToolkit.debug.actor.spendPD(1);
await ParanormalToolkit.debug.actor.damagePV(3);
await ParanormalToolkit.debug.actor.healPV(3);
await ParanormalToolkit.debug.actor.damageSAN(2);
await ParanormalToolkit.debug.actor.recoverSAN(2);
```

E também:

- ao rolar uma mensagem com target marcado, o chat mostra o alvo em um bloco do Toolkit;
- o card original do sistema continua intacto;
- targets ficam salvos em flags da mensagem;
- não há dependência de parsing frágil do HTML do sistema.

## v0.3 — Automation Runner inicial

Objetivo: executar automações simples declaradas por flags em itens.

Escopo planejado:

- `AutomationRunner` mínimo;
- definição de automação versionada;
- steps iniciais:
  - `spendResource`;
  - `rollFormula`;
  - `modifyResource`;
  - `chatCard`;
- execução sequencial de steps;
- parada segura em caso de falha obrigatória;
- debug API para rodar automação de item selecionado.

Primeira automação alvo:

```txt
Gastar PE + rolar fórmula + curar PV do alvo
```

Exemplo conceitual:

```ts
item.flags["paranormal-toolkit"].automation = {
  version: 1,
  steps: [
    { type: "spendResource", actor: "self", resource: "PE", amount: 1 },
    { type: "rollFormula", id: "healing", formula: "1d8" },
    {
      type: "modifyResource",
      actor: "target",
      resource: "PV",
      operation: "heal",
      amountFrom: "healing.total"
    }
  ]
};
```

## v0.4 — Weapon Modifications

Objetivo: criar uma base genérica para modificações de armas.

Escopo planejado:

- flags de modificações em armas;
- cálculo de categoria base, aumento e categoria final;
- validação visual de categoria;
- modificadores de dano rastreáveis por origem/tag;
- início de triggers condicionais.

Caso alvo:

```txt
Modificação que adiciona +1d8 de dano.
Se o ataque for crítico, cura o atacante com base no dano causado por esse 1d8.
```

Observação: essa modificação exige workflow rastreável. Não deve ser implementada apenas concatenando string na fórmula da arma.

## v0.5 — Ritual Workflows

Objetivo: sair do ritual puramente descritivo e criar automações configuráveis.

Escopo planejado:

- custo de ritual via `RitualCostProvider`;
- custo padrão por círculo: 1, 3, 6 e 10;
- override por flag;
- gasto de PE/PD;
- alvo;
- rolagem de dano/cura;
- resistência simples;
- chat card rico;
- preparação para Active Effects e Template Regions.

## v1.0 — Toolkit público estável

Critérios esperados para considerar v1.0:

- Resource Engine estável;
- Automation Runner usável;
- chat cards enriquecidos;
- automações básicas de item/ritual;
- modificações de arma iniciais;
- documentação de instalação e uso;
- integração tolerante a mudanças do sistema;
- sem dependência de console debug para uso básico.
