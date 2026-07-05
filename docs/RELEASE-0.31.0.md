# Paranormal Toolkit 0.31.0 — effect-only assisted workflow

## Resumo

A versão 0.31.0 adiciona suporte ao workflow assistido de efeito/condição sem dano para rituais e itens configurados pelo usuário. O objetivo é permitir automações em que há alvo e resistência, mas não há rolagem de dano: o card mostra o resultado público da resistência e permite que o Mestre aplique o efeito/condição quando a automação permitir.

Esta versão não empacota rituais oficiais, descrições oficiais, compêndios ou conteúdo protegido de Ordem Paranormal. Ela apenas amplia o suporte técnico para automações configuradas pelo usuário.

## O que mudou

### Effect-only assisted workflow

- Cards assistidos agora podem representar fluxos com efeito/condição sem dano.
- O fluxo suporta rituais/itens configurados com alvo, resistência e efeito/condição, sem criar seção de Dano quando não há dano estruturado.
- Players continuam vendo o estado público do card, enquanto ações assistidas de aplicação permanecem controladas pelo Mestre conforme a policy existente.

### Single-target sem Dano

- Cards single-target effect-only preservam e posicionam a seção/linha de Resistência mesmo quando não existe seção Dano.
- A seção Efeito pode ser montada após Resistência, usando Conjuração como fallback de posicionamento.
- O estado do botão de efeito continua vindo do ViewModel/assisted-actions existente.

### Multi-target sem Dano

- Cards multi-target effect-only renderizam sem criar seção Dano vazia.
- A seção Alvos pode aparecer com informação de Efeito e status público por alvo.
- O botão de dano não aparece quando não há dano estruturado.
- O refresh do card reutiliza seções existentes para evitar duplicação.

### Resistência multi-target desacoplada de Dano

- A leitura de resistência multi-target não depende mais exclusivamente da seção Dano.
- O ViewModel procura dados públicos de resistência em candidatos ordenados:
  1. seção Dano, quando existir;
  2. seção Efeito, quando existir;
  3. o roll card como fallback.

### Gate de efeito

- O gate de aplicação de efeito multi-target agora usa `effectActionState`.
- O gate de dano continua usando `damageActionState`.
- Isso evita usar o estado de dano como proxy para bloquear/liberar efeitos em workflows sem dano.

### Enriquecimento de resistência em item-use integration

- A integração de uso de item pode enriquecer automações effect-only com resistência derivada do item/ritual quando apropriado.
- Esse enriquecimento só acontece quando:
  - a automação ainda não possui resistência explícita;
  - há `conditionApplications` de alvo;
  - não há workflow de dano PV contra alvo.
- Automações com resistência explícita não são sobrescritas.

### Compatibilidade preservada

- Workflows com dano continuam usando a seção Dano e o comportamento existente.
- Workflows com dano + efeito continuam compatíveis.
- O card público continua sem expor detalhes privados de dano como RD/finalDamage.
- O feedback privado do Mestre para dano permanece preservado.

## Não mudou

- Não altera `DamageEngine`.
- Não altera `ConditionEngine`.
- Não altera `ResistanceEngine`.
- Não altera `item-use-automation-prompt.ts`.
- Não cria compêndios.
- Não cria presets oficiais.
- Não adiciona conteúdo protegido ou descrições oficiais.
- Não adiciona Template Regions.
- Não adiciona Paranormal FX/Sequencer.
- Não cria UI nova de configuração.
- Não altera CSS.
- Não cria card universal.

## Checklist manual recomendado

1. **Single-target effect-only com resistência**
   - Card mostra Conjuração/Resistência/Efeito.
   - Não mostra Dano.
   - Mestre rola resistência.
   - Falha permite aplicar efeito.
   - Sucesso mostra resistiu e não permite aplicar efeito.
   - Refresh não duplica seções.

2. **Single-target effect-only sem resistência confiável**
   - Card não trava.
   - Efeito aparece.
   - Mestre consegue aplicar manualmente se a policy atual permitir.

3. **Player single-target**
   - Player vê estado público.
   - Player não vê controle indevido de aplicação.

4. **Multi-target effect-only**
   - Card renderiza sem Dano.
   - Seção Alvos aparece.
   - Informação/botão de Efeito aparece conforme policy.
   - Botão de dano não aparece.
   - Resistência/status público por alvo aparece quando disponível.
   - Mestre aplica efeito apenas em alvos elegíveis.

5. **Player multi-target**
   - Player vê resultado/status público.
   - Player não controla aplicação.

6. **Regressão com dano**
   - Card com dano continua renderizando Dano/Alvos.
   - Aplicar dano continua funcionando.
   - Dano normal/metade continua respeitando resistência.

7. **Regressão com dano + efeito**
   - Dano + efeito continua funcionando.
   - Efeito continua respeitando resistência.

8. **Card público sem dados privados**
   - Card público não mostra RD/finalDamage.

9. **Whisper GM de dano preservado**
   - Feedback privado do Mestre para dano continua mostrando detalhes reais.
