# Paranormal Toolkit 0.21.7 — Encaixe estrutural do card de efeito

## Mudanças

- Normaliza o bloco **Efeito** como seção visual irmã de **Dano** dentro do card do ritual.
- Remove a margem herdada do container antigo de ações quando o efeito está dentro do card.
- Mantém o estado compacto do botão aplicado como `✓ Aplicado`.
- Mantém a aplicação de condição/Active Effect sem alteração de regra.

## Teste recomendado

1. Usar Eletrocussão contra um alvo.
2. Confirmar que **Efeito** aparece logo abaixo de **Dano**, com espaçamento parecido ao de **Conjuração** para **Dano**.
3. Confirmar que `Vulnerável · 1 rodada` aparece no card de efeito.
4. Clicar em **Aplicar** e confirmar que o botão vira `✓ Aplicado`.
5. Confirmar que o alvo recebeu o efeito normalmente.
