# Paranormal Toolkit 0.21.5 — Efeito dentro do card principal

## Mudanças

- Move o card **Efeito** para dentro do mesmo container visual do card de ritual, como irmão de **Dano**.
- Mantém **Efeito** como bloco próprio, em vez de misturar condição dentro do bloco **Dano**.
- Ajusta o estado aplicado do botão de efeito para `✓ Aplicado`, sem repetir o nome da condição.
- Mantém o botão pendente como `✦ Aplicar`.
- Preserva a aplicação assistida de condição/Active Effect existente.

## Fora de escopo

- Não muda regra de resistência.
- Não faz efeito depender automaticamente de sucesso/falha da resistência.
- Não altera multi-target.

## Teste recomendado

1. Conjurar Eletrocussão contra um alvo.
2. Confirmar que **Efeito** aparece abaixo de **Dano**, dentro do mesmo card principal.
3. Confirmar que o card mostra `Vulnerável · 1 rodada` e botão `✦ Aplicar`.
4. Clicar em **Aplicar**.
5. Confirmar que o botão vira `✓ Aplicado` sem quebrar a largura do layout.
6. Confirmar que a condição continua sendo aplicada no alvo.
