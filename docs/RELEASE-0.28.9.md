# Paranormal Toolkit 0.28.9

Hotfix dos avisos de sucesso do multi-target.

## Correção

- Remove toast visível de sucesso ao aplicar dano por alvo no multi-target.
- Remove toast visível de sucesso ao aplicar efeito por alvo no multi-target.
- Mantém warnings de erro/bloqueio.
- Mantém persistência e atualização visual do card.

## Motivo

O multi-target estava exibindo `ui.notifications.info` como banner para sucesso de dano, gerando feedback diferente do single-target e duplicando/competindo com a mensagem privada/fluxo normal do sistema.
