# Paranormal Toolkit 0.27.2

Hotfix de typecheck para resolução de ator no card multi-target.

## Correção

- Ajusta `resolveActorById` para não chamar `game.actors.get` diretamente quando a tipagem do projeto marca `get` como opcional.
- Não altera comportamento visual.
- Não altera fluxo de dano, resistência ou condição.
