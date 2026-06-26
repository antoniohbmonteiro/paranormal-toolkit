# Roadmap

Este documento organiza a direção de desenvolvimento do **Paranormal Toolkit**.

O objetivo é evitar crescimento caótico: cada versão deve melhorar a base do módulo sem transformar o projeto em um protótipo difícil de manter.

> Projeto não-oficial e independente, compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT.

## Visão geral

O Paranormal Toolkit é uma camada companion para o sistema `ordemparanormal`.

Ele não pretende substituir o sistema base. A ideia é complementar o fluxo da mesa com automações configuráveis, presets, workflows e integrações futuras com efeitos visuais.

Prioridades atuais:

```txt
1. Paranormal Toolkit
2. Paranormal FX
3. Paranormal Sheets
```

A prioridade do Toolkit é construir uma base sólida para:

- custo e gasto de recursos;
- rituais automatizados;
- workflows de cura, dano, resistência e efeitos;
- automações opt-in por item;
- botões e modos de automação no chat;
- integração futura com animações;
- armas, melhorias, modificações e categoria;
- condições, Active Effects e Template Regions.

## Estado atual

A linha `0.8.x` já possui uma fundação funcional:

- manifesto para Foundry VTT v14+;
- build em TypeScript/Vite;
- camada de adaptação para o sistema Ordem;
- `ResourceEngine` para PV, SAN, PE e PD;
- custo de ritual por círculo;
- automações básicas de cura e dano;
- `WorkflowEngine` com fases e hooks públicos;
- presets aplicados por flags versionadas;
- integração experimental com uso normal de item pela ficha;
- debug e snapshots enxutos de workflow;
- documentação inicial de arquitetura;
- testes unitários iniciais para core.

A UX final ainda não está pronta para mesa pública. A linha `0.8.x` deve continuar sendo tratada como experimental.

## Linha 0.8.x — Fundação e segurança

Objetivo: estabilizar a base técnica antes de aumentar o número de automações.

### Concluído

- README enxuto e voltado para usuário.
- Documentação inicial de arquitetura.
- Base de testes com Vitest.
- Testes unitários para `ResourceEngine`.
- Testes unitários para leitura/validação de flags de automação.

### Próximos passos

- Criar testes para partes menores do `AutomationRunner`.
- Extrair resolução de quantidade para um módulo separado.
- Reduzir responsabilidades do `AutomationRunner`.
- Separar melhor core puro de APIs globais do Foundry.
- Preparar portas para rolagem de dados e emissão de hooks.
- Documentar decisões arquiteturais em `docs/DECISIONS.md`.

### Fora de escopo da 0.8.x

- UI final de mesa.
- Compêndios públicos de conteúdo.
- Automação completa de armas.
- Active Effects completos.
- Paranormal FX.

## Linha 0.9.x — UX real de mesa

Objetivo: transformar a base de automação em uma experiência utilizável por mestre e jogadores.

### Item use hook-first

Quando o sistema `ordemparanormal` expuser o hook oficial `ordemparanormal.itemUsed`, o Toolkit deve priorizar esse fluxo.

Plano:

- usar `ordemparanormal.itemUsed` como strategy principal;
- manter wrapper de `OrdemItem.roll()` apenas como fallback temporário e opcional;
- melhorar deduplicação usando `message.id` quando disponível;
- mostrar claramente no debug qual strategy executou a automação;
- remover ou desativar o fallback quando ele não for mais necessário.

### Modos de automação

Trocar o modelo atual de `autoRun` boolean por modos explícitos:

```ts
type AutomationExecutionMode =
  | "disabled"
  | "buttons"
  | "confirm"
  | "automatic";
```

Comportamento esperado:

- `disabled`: não executa automação ao usar item;
- `buttons`: mostra botões no chat, sem aplicar nada sozinho;
- `confirm`: pede confirmação antes de gastar/aplicar;
- `automatic`: executa direto, recomendado apenas para mesas que querem automação completa.

O padrão público deve ser conservador. Nada deve gastar PE, curar, causar dano ou aplicar efeito sem o mestre entender o que está acontecendo.

### Botões no chat

Adicionar ações assistidas no chat card:

- rolar fórmula;
- gastar custo;
- aplicar cura;
- aplicar dano;
- executar automação completa;
- cancelar/ignorar automação.

O objetivo é reduzir dependência de comandos de debug e deixar a automação visível para a mesa.

### Bloqueio de rolagem duplicada

Quando um item tiver automação ativa, o Toolkit deve evitar confusão com rolagens inline da descrição, como `[[2d8+2]]`.

Plano:

- detectar item com automação ativa;
- enriquecer o chat sem alterar a descrição original do item;
- desativar visualmente ou bloquear rolagens inline apenas no card renderizado;
- mostrar aviso curto explicando que a rolagem foi substituída pela automação do Toolkit.

### Presets específicos por ritual

Sair gradualmente dos presets genéricos de teste.

Primeiro alvo:

```txt
ritual.cicatrizacao
```

Depois:

- suportar forma padrão;
- preparar espaço para forma discente;
- preparar espaço para forma verdadeira;
- modelar alvo, resistência, duração, área e efeitos quando fizer sentido.

## Marco 1.0.0

A versão `1.0.0` deve representar um módulo público utilizável, não apenas um laboratório técnico.

Critérios desejados:

- fluxo de rituais estável;
- automações opt-in por item;
- flags versionadas e documentadas;
- UX mínima com botões/confirmações;
- testes mínimos para core;
- documentação de arquitetura;
- documentação de instalação/desenvolvimento;
- estratégia clara de releases;
- compatibilidade clara com Foundry VTT v14+;
- comportamento conservador por padrão.

A `1.0.0` não precisa automatizar tudo. Ela precisa automatizar bem o que se propõe a fazer.

## Depois da 1.0.0

Após a `1.0.0`, o projeto deve adotar práticas de manutenção mais formais.

### Processo de desenvolvimento

- Git Flow ou fluxo equivalente com branches estáveis;
- branch principal protegida;
- Pull Requests para mudanças relevantes;
- CI com typecheck, build e testes;
- releases versionadas;
- tags semânticas;
- changelog por release;
- política de compatibilidade para flags e presets;
- critérios claros para breaking changes.

Antes da `1.0.0`, o projeto pode continuar usando fluxo simples para iterar rápido sem burocracia prematura.

### Armas, melhorias e categoria

Implementar automação e validação de armas considerando:

- categoria base;
- melhorias aplicadas;
- modificações;
- aumento de categoria;
- categoria final;
- limite por patente/categoria;
- validação visual para jogador e mestre.

Importante: melhorias/modificações não devem ser tratadas apenas como bônus numéricos. Elas também podem alterar categoria e restrições da arma.

### Condições e Active Effects

Adicionar suporte gradual para:

- condições comuns;
- Active Effects V2;
- compêndios de efeitos próprios do Toolkit;
- aplicação e remoção por workflow;
- duração e expiração;
- integração futura com Template Regions quando fizer sentido.

### Template Regions

Usar Template Regions para rituais e efeitos de área quando o Foundry v14 oferecer um fluxo seguro e sustentável para isso.

Possíveis usos:

- dano por área;
- condição em área;
- efeitos persistentes;
- regiões perigosas;
- integração com FX.

### Presets e compêndios funcionais

Criar estrutura para presets mais completos sem redistribuir conteúdo protegido.

Regras:

- não copiar textos oficiais;
- não empacotar artes protegidas;
- não vender o módulo como oficial;
- separar motor de automação de conteúdo/presets;
- permitir que mestres apliquem automações em itens existentes.

## Integração com o sistema Ordem

O Toolkit deve respeitar o que o sistema `ordemparanormal` já faz.

Se o sistema implementar fluxo próprio de ataque, dano, defesa ou reações, o Toolkit não deve duplicar esse comportamento.

Divisão desejada:

```txt
Sistema Ordem:
- ficha base
- dados do sistema
- rolagens principais
- fluxo padrão de combate
- aplicação básica de dano quando existir

Paranormal Toolkit:
- automações configuráveis
- custo de rituais
- gasto de PE/PD
- presets por item
- workflows extensíveis
- condições e efeitos complementares
- validação de armas/melhorias
- eventos para FX
```

Quando existir hook oficial, o Toolkit deve preferir hook ao invés de monkey patch/wrapper.

## Paranormal FX

Paranormal FX deve ser um módulo companion separado.

Responsabilidade esperada:

- escutar hooks do Toolkit;
- tocar animações;
- tocar sons;
- integrar com Sequencer;
- integrar opcionalmente com bibliotecas como JB2A quando instaladas pelo usuário;
- oferecer presets visuais configuráveis.

O Toolkit não deve depender diretamente de assets de animação.

Fluxo desejado:

```txt
Toolkit executa workflow
↓
emite hook público
↓
Paranormal FX escuta
↓
toca efeito visual/sonoro
```

## Paranormal Sheets

Paranormal Sheets fica em prioridade menor enquanto o sistema base ainda estiver evoluindo fichas e UX.

Responsabilidade futura:

- fichas alternativas;
- layout moderno;
- melhor organização de perícias, armas, rituais e inventário;
- experiência visual mais amigável;
- melhorias de UX para jogadores e mestres.

Não deve ser prioridade antes do Toolkit ter uma base estável.

## Fora de escopo

O Toolkit público não deve:

- distribuir textos oficiais de Ordem Paranormal;
- distribuir artes oficiais ou protegidas;
- empacotar compêndios oficiais;
- empacotar assets de terceiros sem licença;
- se apresentar como módulo oficial;
- substituir o sistema `ordemparanormal`;
- depender de HTML interno frágil do sistema quando houver API/hook melhor;
- automatizar regras de forma invisível sem controle do mestre.

## Princípio final

A prioridade não é automatizar tudo rápido.

A prioridade é criar uma base sustentável para que cada automação nova seja fácil de entender, testar, configurar e manter.

Código bonito aqui não é perfumaria. É sobrevivência.
