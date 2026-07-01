# Paranormal Toolkit 0.21.2 — Resolução assistida estabilizada

## Mudanças

- Deixa de usar o texto renderizado do chat como fonte principal da DT de resistência.
- Resolve a DT primeiro pelos dados persistidos do card (`Conjuração DT`) e usa a DT atual do ator conjurador apenas como fallback para cards antigos.
- Mantém um fallback legado mínimo para cards já renderizados sem dados persistidos suficientes.
- Reorganiza visualmente a resolução de dano para ficar integrada ao bloco **Dano**, com resistência, divisor discreto e botões compactos.
- Compacta a ação de efeito para uma linha **Efeito** com o texto da condição e um botão **Aplicar** menor.
- Remove mensagens auxiliares redundantes quando o modo assistido já consegue resolver a DT.

## Fora de escopo

- Multi-target.
- Aplicação automática de dano ao rolar resistência.
- Detecção de tokens em template.
- Refactor completo do builder do card persistente.

## Teste recomendado

1. Deixar o setting **Resolução de dano com resistência** como `Assistida`.
2. Usar Eletrocussão ou ritual genérico de dano com resistência de metade contra um alvo.
3. Confirmar que a resistência aparece dentro do bloco **Dano**.
4. Confirmar que antes de rolar resistência aparece apenas o botão de dano normal.
5. Rolar resistência abaixo da DT e confirmar que o botão continua aplicando dano normal.
6. Rolar resistência igual/acima da DT e confirmar que o botão muda para metade.
7. Trocar o setting para `Manual` e confirmar que Normal/Metade aparecem juntos.
8. Confirmar que a seção **Efeito** fica compacta e com botão menor.
