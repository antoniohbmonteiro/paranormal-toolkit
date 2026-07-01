# Paranormal Toolkit 0.20.1 — Polimento visual da resistência rolada

## Mudanças

- Ajusta o resultado de resistência rolada para ocupar melhor a largura disponível no card.
- Mantém a fórmula da resistência no mesmo padrão de interação das rolagens de conjuração e dano.
- Garante que os dados da resistência usem chips arredondados e consistentes com as demais rolagens.
- Preserva o botão de resistência existente, a persistência do resultado e toda a lógica de rolagem/aplicação.

## Teste recomendado

1. Usar um ritual com resistência.
2. Clicar no botão de resistência.
3. Confirmar que o botão continua mostrando o total.
4. Confirmar que a fórmula ocupa a linha disponível à esquerda do total.
5. Clicar na fórmula e verificar os chips dos dados.
6. Em fórmulas com `kh`/`kl`, confirmar que o dado usado fica destacado e os descartados ficam apagados.
