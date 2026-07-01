# Paranormal Toolkit 0.21.4 — Polimento visual do efeito no card

## Mudanças

- Mantém **Aplicar efeito** como um card compacto próprio, separado semanticamente do bloco de Dano.
- Deixa o card de efeito com destaque dourado mais claro, para parecer uma consequência do ritual em vez de uma ação solta.
- Compacta o botão de efeito para `✦ Aplicar`, com ícone textual seguro sem depender de asset externo.
- Preserva a ação assistida existente e o estado aplicado do botão.

## Fora de escopo

- Não muda a regra de aplicação de condição/Active Effect.
- Não liga o efeito automaticamente ao sucesso ou falha da resistência.
- Não altera multi-target.

## Teste recomendado

1. Conjurar Eletrocussão contra um alvo.
2. Confirmar que o bloco **Efeito** aparece como card compacto abaixo do Dano.
3. Confirmar que o texto mostra `Vulnerável · 1 rodada`.
4. Confirmar que o botão mostra `✦ Aplicar`.
5. Clicar em **Aplicar** e confirmar que a condição continua sendo aplicada normalmente.
6. Confirmar que o botão aplicado continua usando o feedback padrão de ação executada.
