# Paranormal Toolkit 0.28.0

Padronização inicial da política de resistência nos cards de uso de item.

## Mudanças

- Adiciona setting `itemUse.resistanceGateMode`.
- Adiciona modo `strict`: bloqueia dano e efeito até rolar resistência.
- Adiciona modo `open`: permite aplicação manual antes da resistência.
- Aplica a mesma política em card single-target e multi-target.
- Cria `item-use-resistance-gate-policy.ts` como regra compartilhada.
- Atualiza a documentação de arquitetura de card em `docs/ITEM-USE-CARD-ARCHITECTURE.md`.

## Compatibilidade

- O padrão novo é `strict`.
- Se a mesa quiser o comportamento mais livre, altere a configuração para `Permitir aplicação manual sem resistência`.
- Não há mudança intencional no layout visual do card além de estados habilitado/desabilitado e labels de bloqueio.
