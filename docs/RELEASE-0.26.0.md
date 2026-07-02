# Paranormal Toolkit 0.26.0

Aplicação de efeito por alvo no card multi-target.

## Mudanças

- Botão de efeito por alvo agora aplica condição no ator/token correto.
- Alvo pendente mantém efeito bloqueado até rolar resistência.
- Alvo que resistiu mostra `✓ Resistiu` e não permite aplicar efeito.
- Alvo que falhou permite aplicar efeito.
- Estado de efeito aplicado é persistido no flag do chat card.
- A aplicação usa `ConditionEngine.applyCondition`, o mesmo caminho usado pelas ações assistidas de condição.
- Quando a label do efeito contém duração em rodadas, a duração é preservada para a condição.
- Não altera aplicação de dano por alvo.

## Observação técnica

Esta versão resolve a condição pelo registry do Toolkit a partir da label do efeito renderizado. Se o efeito não corresponder a uma condição registrada, o botão fica bloqueado como efeito não resolvido.
