# Paranormal Toolkit 0.26.1

Aplicação de efeito por alvo usando automação estruturada do item.

## Mudanças

- Botão de efeito por alvo aplica condição no ator/token correto.
- O efeito não é resolvido por texto visual.
- O card lê a automação estruturada do item usado (`flags.paranormal-toolkit.automation`), incluindo `conditionApplications`.
- Para rituais como Eletrocussão, o efeito vem do preset aplicado no item, com `conditionId`, `label`, `duration`, `source` e `originUuid`.
- A aplicação usa `ConditionEngine.applyCondition`.
- Alvo pendente mantém efeito bloqueado até rolar resistência.
- Alvo que resistiu mostra `✓ Resistiu`.
- Alvo que falhou permite aplicar efeito.
- Estado de efeito aplicado é persistido no flag do chat card.
- Mantém a aplicação de dano por alvo da 0.25.0.

## Observação

Se o item não tiver automação estruturada com `conditionApplications` para `target`, o card mostra a seção de efeito apenas como informação e não habilita aplicação por alvo.
