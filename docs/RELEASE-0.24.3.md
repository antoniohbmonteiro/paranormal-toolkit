# Paranormal Toolkit 0.24.3

Hotfix estrutural pequeno para o card multi-target.

## Mudanças

- Extrai um componente interno reutilizável de rolagem: `item-use-card-roll-display.ts`.
- O card global de **Dano** agora usa o mesmo `RollDisplay` usado pela resistência do alvo.
- O card global de **Dano** passa a preservar os dados da rolagem original e pode abrir/fechar os dados pela fórmula.
- Remove helpers duplicados de dice tray do `item-use-card-multi-target.ts`.
- Ajusta o encaixe lateral do card geral do Toolkit com margem negativa controlada por variável CSS, mantendo padding interno normal.

## Fora do escopo

- Aplicar dano por alvo.
- Aplicar efeito por alvo.
- Refactor completo de todos os componentes do chat card.

## Validação sugerida

```bash
npm run typecheck
npm run build
```
