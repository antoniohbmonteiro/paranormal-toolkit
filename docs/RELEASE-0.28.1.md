# Paranormal Toolkit 0.28.1

Hotfix visual do bloqueio de dano no card single-target.

## Correção

- Quando a política de resistência está em modo `strict`, o botão de dano single-target pendente agora troca o label para `Role resistência`.
- O botão continua desabilitado até a resistência ser rolada.
- Quando a resistência é resolvida, o label original do botão de dano é restaurado.
- Multi-target não foi alterado.

## Motivo

Na 0.28.0 o botão já recebia `disabled`, mas ainda mantinha o texto `Normal: X PV`, o que parecia uma ação clicável.
