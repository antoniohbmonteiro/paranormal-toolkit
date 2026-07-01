# 0.21.8 — Efeito condicionado à resistência

## Objetivo

Fechar a regra visual/assistida da Eletrocussão: se o alvo resistir, o botão de aplicar **Vulnerável** não deve ficar disponível.

## Mudanças

- O card agora bloqueia efeitos de vulnerabilidade quando a resistência do alvo passa na DT.
- Antes da resistência ser rolada, o botão do efeito fica em estado de espera: `Role resistência`.
- Se a resistência falhar, o botão volta para `✦ Aplicar`.
- Se a resistência passar, o botão fica desabilitado como `✓ Resistiu`.
- Se o efeito já tiver sido aplicado, o estado continua `✓ Aplicado`.
- A regra é aplicada apenas para efeitos reconhecidos como `Vulnerável`/`Vulnerable` em cards com resistência, evitando bloquear genericamente todo efeito futuro.

## Fora de escopo

- Multi-target.
- Auto-aplicar efeito.
- Refactor estrutural do builder/card.
- Nova configuração de item para dependência explícita de resistência.
