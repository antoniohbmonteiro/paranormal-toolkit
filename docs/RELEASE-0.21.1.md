# Paranormal Toolkit 0.21.1 — Hotfix da resolução assistida de dano

## Mudanças

- Corrige a leitura da DT de conjuração no card assistido de dano com resistência.
- A resolução assistida agora procura a DT no bloco de conjuração, no card inteiro e na mensagem do chat antes de cair para o modo manual.
- Ajusta os botões compactos de aplicar dano para não herdarem estilos antigos que podiam transformá-los em botões grandes/ovais.
- Mantém o comportamento da 0.21.0: no modo assistido, o card mostra um único botão de dano quando consegue decidir pelo resultado da resistência.

## Teste recomendado

1. Usar um ritual de dano com resistência de metade e DT de conjuração visível no card.
2. Confirmar que o card não mostra mais `Sem DT confiável` quando a DT aparece como `vs DT X`.
3. Rolar resistência abaixo da DT e confirmar que fica disponível apenas o dano normal.
4. Rolar resistência igual/acima da DT e confirmar que fica disponível apenas o dano pela metade.
5. Confirmar que os botões de aplicar dano ficam compactos e retangulares, sem virarem círculos/ovais grandes.
6. Repetir em um ritual genérico configurado pela ficha.
