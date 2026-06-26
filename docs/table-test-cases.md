# Casos de teste da mesa

Este documento registra casos reais da mesa usados para validar o Toolkit.

A regra é: casos reais podem inspirar features, mas o código deve virar solução genérica.

## Regras de uso

- Não hardcodar nome de personagem, item ou ritual.
- Não copiar conteúdo protegido para dentro do módulo.
- Usar a mesa como teste manual, não como fonte de regras específicas.
- Toda solução deve funcionar para qualquer mesa com configuração equivalente.

## Caso 1 — Recursos do ator

### Objetivo

Validar leitura e atualização de PV, SAN, PE e PD.

### Fluxo

1. Selecionar token de agente.
2. Rodar:

```js
ParanormalToolkit.debug.actor.logResources();
```

3. Validar que o console mostra:

- PV atual/máximo;
- SAN atual/máximo;
- PE atual/máximo;
- PD atual/máximo;
- DT de ritual, quando existir.

### Critério de aceite

- Recursos aparecem corretamente.
- Nenhum path interno aparece fora do adapter.

## Caso 2 — Gasto de PE

### Objetivo

Validar primeira automação real do Toolkit.

### Fluxo

1. Selecionar token de agente.
2. Rodar:

```js
await ParanormalToolkit.debug.actor.spendPE(1);
```

3. Conferir ficha e chat.

### Critério de aceite

- PE atual diminui em 1.
- PE não fica negativo.
- Chat card é criado.
- PE insuficiente gera aviso controlado, não stack trace vermelho.

## Caso 3 — Chat com target

### Objetivo

Validar enriquecimento do chat do sistema com target capturado pelo Toolkit.

### Contexto

O chat atual do sistema mostra rolagem de ataque/dano, mas não mostra claramente o target.

### Fluxo esperado

1. Selecionar token atacante.
2. Marcar um token alvo usando target do Foundry.
3. Rolar ataque ou dano pelo card/arma do sistema.
4. Toolkit captura os targets atuais.
5. Toolkit salva targets em flags da `ChatMessage`.
6. Toolkit renderiza bloco embaixo do card original.

### Exemplo visual esperado

```txt
[Card original do sistema]

Paranormal Toolkit
Atacante: <nome do atacante>
Alvo: <nome do alvo>
```

### Critério de aceite

- Card original continua intacto.
- Bloco do Toolkit aparece abaixo do conteúdo original.
- Target fica salvo em flags.
- Não depende de procurar texto como "Ataque com" no HTML.

## Caso 4 — Dano/cura genérico

### Objetivo

Validar `ResourceEngine` para PV e SAN.

### Comandos esperados

```js
await ParanormalToolkit.debug.actor.damagePV(3);
await ParanormalToolkit.debug.actor.healPV(3);
await ParanormalToolkit.debug.actor.damageSAN(2);
await ParanormalToolkit.debug.actor.recoverSAN(2);
```

### Critério de aceite

- Dano em PV não baixa abaixo de 0.
- Cura em PV não passa do máximo.
- Dano em SAN não baixa abaixo de 0.
- Recuperação de SAN não passa do máximo.
- Chat mostra antes/depois quando apropriado.

## Caso 5 — Modificação simples de arma

### Objetivo

Validar o primeiro caso de modificação de arma sem trigger complexo.

### Regra alvo

```txt
A arma recebe +1d8 de dano.
A categoria da arma aumenta em +1.
```

### Critério de aceite

- Modificação é configurada por flag.
- Dano extra é rastreado como parte separada.
- Categoria final é calculada como base + modificações.
- Nenhum nome de arma é hardcoded.

## Caso 6 — Modificação vampírica

### Objetivo

Caso futuro para validar dano rastreável e trigger condicional.

### Regra alvo

```txt
A arma recebe +1d8 de dano.
Se o ataque for crítico, o atacante cura PV igual ao dano causado por esse +1d8.
```

### Dependências

- workflow de ataque;
- target salvo;
- crítico detectado;
- dano por partes;
- aplicação de dano rastreável;
- ResourceEngine com cura.

### Critério de aceite futuro

- Dano extra é rolado separadamente ou rastreado por tag.
- Cura usa apenas o dano extra da modificação, não necessariamente o dano total.
- Chat card mostra dano base, dano extra e cura aplicada.

## Caso 7 — Ritual simples de cura

### Objetivo

Validar a primeira automação de ritual genérico.

### Fluxo esperado

1. Selecionar conjurador.
2. Marcar alvo.
3. Rodar automação de item/ritual.
4. Toolkit calcula custo.
5. Toolkit gasta PE/PD.
6. Toolkit rola fórmula de cura.
7. Toolkit cura PV do alvo.
8. Toolkit mostra chat card.

### Critério de aceite

- Custo pode ser derivado pelo círculo.
- Custo pode ser sobrescrito por flag.
- Não depende do nome oficial do ritual.
- Funciona com item criado manualmente pelo mestre.
