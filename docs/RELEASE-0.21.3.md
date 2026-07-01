# Paranormal Toolkit 0.21.3 — Polimento dos botões e da resistência

## Mudanças

- Adiciona ícones nos botões de aplicar dano:
  - raio para dano normal;
  - escudo para dano reduzido/metade.
- Mantém o botão/resultado da resistência ancorado no canto superior direito do bloco.
- Move a fórmula rolada da resistência para uma linha própria com largura inteira.
- Remove o rótulo redundante da perícia dentro da fórmula expandível da resistência.
- Mantém a fórmula sempre visível depois da rolagem, com os dados abrindo apenas ao clicar na fórmula.
- Preserva a resolução assistida de dano da 0.21.x, sem aplicar dano automaticamente.

## Fora de escopo

- Não altera cálculo de DT.
- Não altera regras de dano ou resistência.
- Não muda o fluxo multi-target.
- Não refatora o builder principal do card.

## Teste recomendado

1. Usar um ritual de dano com resistência, como Eletrocussão.
2. Rolar a resistência.
3. Confirmar que o resultado numérico fica no canto superior direito da resistência.
4. Confirmar que a fórmula aparece em largura inteira abaixo da descrição/resultado.
5. Clicar na fórmula e confirmar que os dados aparecem abaixo, como antes.
6. Confirmar que a fórmula não repete `Fortitude:`.
7. Confirmar que o botão de dano normal usa ícone de raio.
8. Confirmar que o botão de dano reduzido/metade usa ícone de escudo.
