# 0.22.0 — Refactor estrutural do card de ritual

## Objetivo

Reorganizar o card single-target depois do ciclo `0.21.x`, mantendo o comportamento validado na `0.21.9` e preparando a base para multi-target sem implementar multi-target ainda.

## Mudanças

- Separa responsabilidades do chat card em arquivos menores:
  - `item-use-card-resistance.ts`: layout da resistência, fórmula e dados.
  - `item-use-card-layout.ts`: normalização estrutural do card e ordem das seções.
  - `item-use-card-damage-resolution.ts`: resolução assistida/manual de dano.
  - `item-use-card-effect-section.ts`: estado do efeito e bloqueio por resistência.
  - `item-use-card-roll-context.ts`: leitura de DT, resistência, prompt persistido e normalização de texto.
  - `item-use-card-dom.ts`: helpers pequenos de DOM usados pelas seções.
- Remove a moldura externa do roll card.
- Mantém os cards internos de **Conjuração**, **Dano** e **Efeito**.
- Mantém a resistência dentro do card de **Dano**.
- Mantém as ações de dano dentro do card de **Dano**.
- Mantém o card de **Efeito** como seção irmã de **Dano**.
- Mantém os estados do efeito:
  - `Role resistência` antes de resolver a resistência;
  - `✦ Aplicar` se o alvo falhou;
  - `✓ Resistiu` se o alvo resistiu;
  - `✓ Aplicado` após aplicar.

## Fora de escopo

- Multi-target.
- Template Regions.
- Dano em área.
- Auto-aplicar dano ou efeito.
- Mudança de regra.
- Reescrita completa do fluxo de criação/persistência do chat card.

## Observação técnica

Este refactor ainda respeita o renderer atual de `item-use-automation-prompt.ts`, mas centraliza a montagem final do card em uma camada de layout própria. Isso reduz o acoplamento do antigo arquivo monolítico e cria pontos de extensão mais claros para o próximo passo.
