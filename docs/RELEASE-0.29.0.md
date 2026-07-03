# Paranormal Toolkit 0.29.0

Paridade de feedback privado de dano no multi-target.

## Mudanças

- Adiciona `multi-target-damage-feedback-service.ts`.
- Multi-target continua aplicando dano via `DamageEngine` → `OrdemDamageAdapter` → `actor.applyDamage`.
- Após aplicar dano, cria mensagem de chat usando as mesmas chaves de i18n do sistema:
  - `op.applyDamageResult`
  - `op.damageBlocked`
- A mensagem é enviada por whisper para:
  - GMs;
  - donos do ator alvo quando aplicável.
- Mantém sem `ui.notifications.info` de sucesso.
- Mantém warnings visíveis apenas para erro/bloqueio.

## Motivo

O dano já passava pelo método do sistema, mas o feedback privado de chat não seguia o mesmo padrão do single/system card.
