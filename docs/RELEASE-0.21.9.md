# 0.21.9 — Estado resistido do efeito

## Objetivo

Corrigir o botão de **Efeito** quando a resistência do alvo passa na DT.

## Mudanças

- O estado `✓ Resistiu` agora tem prioridade sobre o compactador visual do botão de efeito.
- O enhancer não sobrescreve mais `✓ Resistiu` de volta para `✦ Aplicar`.
- Estados bloqueados (`Role resistência` e `✓ Resistiu`) não exibem hover/sombra/transform de botão clicável.
- Mantém `✓ Aplicado` como prioridade quando o efeito já foi aplicado.

## Fora de escopo

- Refactor do builder/card.
- Multi-target.
- Auto-aplicar efeito.
- Mudanças em dano, DT ou rolagem de resistência.
