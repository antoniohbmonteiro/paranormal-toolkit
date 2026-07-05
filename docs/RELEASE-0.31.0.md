# Paranormal Toolkit 0.31.0 — effect-only assisted workflow

## Resumo

A versão 0.31.0 adiciona suporte a workflows assistidos de efeito/condição sem dano. O foco é permitir rituais e itens configurados pelo usuário com alvo, resistência e efeito, mas sem rolagem de dano, preservando ações GM-only e mantendo o resultado público da resistência no card.

Também foi adicionado suporte genérico a efeitos por resultado de resistência via `applyOnResistance`, usado pelo preset mecânico de **Definhar — Padrão**.

Esta release não cria tag e não publica release no GitHub. Ela apenas prepara os arquivos da versão.

## Destaques

### Effect-only assisted workflow

- Cards assistidos agora suportam automações com efeito/condição e resistência sem seção de Dano.
- O fluxo funciona para single-target e multi-target.
- O Mestre continua controlando a aplicação assistida.
- Players podem ver o estado público, mas não recebem controles indevidos de aplicação.

### Single-target sem Dano

- Cards single-target effect-only preservam a seção/linha de Resistência mesmo sem Dano.
- A seção Efeito pode ser montada sem depender de `damageSection`.
- O posicionamento esperado é Conjuração/Resistência/Efeito, quando essas informações existem.

### Multi-target sem Dano

- Cards multi-target effect-only renderizam sem criar seção Dano vazia.
- A seção Alvos pode mostrar estado público por alvo.
- O botão de dano não aparece quando não existe dano estruturado.
- Cada alvo resolve seu próprio estado de resistência/efeito.

### `applyOnResistance`

`conditionApplications` agora aceita o campo opcional:

```ts
applyOnResistance?: "failure" | "success" | "always";
```

Semântica:

- `"failure"`: aplica somente quando a resistência falha.
- `"success"`: aplica somente quando a resistência passa.
- `"always"`: aplica independentemente do resultado, respeitando a política existente do fluxo.
- `undefined`: equivale a `"failure"`, preservando compatibilidade com automações antigas.

Efeitos dependentes de resultado (`failure`/`success`) exigem um resultado de resistência compatível antes de liberar a aplicação.

### Definhar — Padrão via presets

Foi adicionado um preset assistido mecânico para **Definhar — Padrão** usando o sistema existente de presets de rituais.

Dados mecânicos incluídos:

- Círculo: 1.
- Elemento: Morte.
- Dano: nenhum.
- Resistência: Fortitude parcial.
- Falha na resistência: aplicar Fatigado.
- Sucesso na resistência: aplicar Vulnerável.

Não foram adicionados:

- texto oficial;
- descrição oficial;
- compêndio oficial;
- Discente;
- Verdadeiro;
- afinidade;
- alvo “até 5 seres”.

### Condition actions em workflows sem steps executáveis

Workflows effect-only como Definhar podem não ter steps executáveis depois da preparação, já que não possuem dano/cura/rolagem própria e o `chatCard` não vira step de preparação.

A 0.31.0 garante que, mesmo quando `preparationDefinition.steps.length === 0`, as `conditionApplications` ainda gerem ações assistidas quando houver alvo válido.

### Feedback visual compacto da resistência

O resultado single-target de resistência agora ganha feedback compacto:

- falha: o total existente aparece como `12 ✕` e recebe visual de falha;
- sucesso: o total existente aparece como `28 ✓` e recebe visual de sucesso;
- pendente/indeterminado: mantém o visual anterior, sem ícone.

O feedback decora o total existente no card; não cria badge grande, nova linha, nem box duplicado.

### Resistência multi-target desacoplada de Dano

A leitura de resistência multi-target passou a procurar dados públicos em fontes ordenadas:

1. seção Dano, quando existir;
2. seção Efeito, quando existir;
3. o roll card como fallback.

Isso prepara e mantém o fluxo effect-only sem depender de dano como âncora.

### Enriquecimento de resistência no item-use integration

Quando uma automação não tem resistência explícita, mas possui `conditionApplications` de alvo e não possui workflow de dano PV contra alvo, a integração pode derivar resistência a partir dos campos do item/ritual.

Esse enriquecimento não sobrescreve resistência já definida explicitamente.

## Compatibilidade preservada

- Workflows com Dano continuam usando a seção Dano e o fluxo existente.
- Workflows com Dano + Efeito continuam compatíveis.
- Efeitos antigos sem `applyOnResistance` continuam equivalentes a `failure`.
- Sucesso sem efeito configurado para `success` continua mostrando Resistiu.
- O card público continua sem expor RD/finalDamage.
- O whisper/feedback privado de dano para Mestre continua preservado.

## Não mudou

- Não altera `DamageEngine`.
- Não altera `ConditionEngine`.
- Não altera `ResistanceEngine`.
- Não altera `item-use-automation-prompt.ts`.
- Não cria compêndios oficiais.
- Não adiciona texto oficial ou descrição oficial.
- Não adiciona Discente/Verdadeiro ao Definhar.
- Não adiciona Template Regions.
- Não adiciona Paranormal FX/Sequencer.
- Não cria UI nova de configuração.
- Não cria card universal.
- Não cria tag.
- Não publica release no GitHub.

## Checklist manual recomendado

1. **Definhar Padrão single-target sem resistência rolada**
   - Card mostra Conjuração/Resistência/Efeito.
   - Não mostra Dano.
   - Não permite aplicar Fatigado/Vulnerável antes da resistência.
   - Mostra estado aguardando resistência ou equivalente.

2. **Definhar Padrão single-target com falha**
   - Total da resistência mostra algo como `12 ✕`.
   - O total recebe visual de falha.
   - Efeito exibido/aplicado é Fatigado.
   - Não aplica Vulnerável.

3. **Definhar Padrão single-target com sucesso**
   - Total da resistência mostra algo como `28 ✓`.
   - O total recebe visual de sucesso.
   - Efeito exibido/aplicado é Vulnerável.
   - Não aplica Fatigado.

4. **Definhar Padrão multi-target**
   - Sem seção Dano.
   - Alvo que falha mostra/aplica Fatigado.
   - Alvo que passa mostra/aplica Vulnerável.
   - Alvo pendente não aplica efeito dependente de resultado.

5. **Effect-only comum sem success effect**
   - Antes da resistência, mantém gate/policy atual.
   - Falha aplica o efeito antigo.
   - Sucesso continua mostrando Resistiu quando não há `applyOnResistance: "success"`.

6. **Single-target effect-only sem resistência confiável**
   - Card não trava.
   - Efeito aparece se a automação permitir.

7. **Player single-target/multi-target**
   - Player vê estado público.
   - Player não recebe controles indevidos de aplicação.

8. **Regressão com Dano**
   - Card com Dano continua renderizando Dano/Alvos.
   - Aplicar dano continua funcionando.
   - Dano normal/metade continua respeitando resistência.

9. **Regressão com Dano + Efeito**
   - Dano + efeito continua funcionando.
   - Efeito por falha continua respeitando resistência.

10. **Privacidade do card público**
    - Card público não mostra RD/finalDamage.
    - Whisper GM de dano continua preservado.
