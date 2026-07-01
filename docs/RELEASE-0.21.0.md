# Paranormal Toolkit 0.21.0 — Resolução assistida de dano no card

## Mudanças

- Move a resistência para dentro do contexto visual do bloco de **Dano** quando o card tem dano e resistência.
- Compacta a seção de aplicação de dano para ficar junto do resultado de dano, evitando os blocos grandes de placeholder.
- Adiciona o setting **Resolução de dano com resistência**:
  - `Assistida` (padrão): usa o resultado de resistência contra a DT de conjuração para mostrar um único botão relevante.
  - `Manual`: mantém os botões Normal/Metade visíveis para o mestre escolher.
- Em modo assistido:
  - antes da resistência, o card mostra a aplicação normal;
  - se a resistência passar, mostra apenas a aplicação de metade;
  - se falhar, mostra apenas a aplicação normal;
  - se não houver DT confiável, cai para o modo manual naquele card.
- Mantém a aplicação manual: o Toolkit não aplica dano automaticamente depois da resistência.
- O fluxo também cobre ritual genérico quando o card tiver dano, resistência de metade, alvo e DT de conjuração disponíveis.

## Fora de escopo

- Multi-target.
- Aplicação automática após rolar resistência.
- Template Regions.
- Mudanças no cálculo de dano do adapter do sistema.

## Teste recomendado

1. Verificar em Configurações que **Resolução de dano com resistência** está em `Assistida`.
2. Usar Eletrocussão Padrão contra um alvo.
3. Confirmar que resistência e aplicação aparecem compactadas dentro do bloco de Dano.
4. Antes de rolar resistência, confirmar que há um único botão para aplicar dano normal.
5. Rolar resistência abaixo da DT e confirmar que o botão continua aplicando o dano normal.
6. Rolar resistência igual/acima da DT e confirmar que o botão muda para metade.
7. Trocar o setting para `Manual` e confirmar que Normal/Metade voltam a aparecer juntos.
8. Testar um ritual genérico configurado como Dano com resistência de metade.
