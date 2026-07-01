# Paranormal Toolkit 0.21.6 — Espaçamento do card de efeito

## Mudanças

- Reduz o espaçamento entre o bloco **Dano** e o card compacto **Efeito** no card de ritual.
- Mantém **Efeito** dentro do mesmo container visual do ritual, abaixo de **Dano**.
- Não altera regra de dano, resistência, condição, Active Effect ou estado aplicado.

## Teste recomendado

1. Usar Eletrocussão contra um alvo.
2. Confirmar que **Efeito** aparece abaixo de **Dano**, dentro do mesmo card principal.
3. Confirmar que o espaço entre **Dano** e **Efeito** está parecido com o espaço entre **Conjuração** e **Dano**.
4. Aplicar o efeito e confirmar que o botão continua como `✓ Aplicado`, sem quebrar layout.
