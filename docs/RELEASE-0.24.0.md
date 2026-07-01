# Paranormal Toolkit 0.24.0

Primeiro passo funcional do card multi-target: rolagem de resistência por alvo.

## Mudanças

- O botão de d20 de cada alvo agora rola a resistência daquele alvo.
- Resolve o ator alvo por token/ator com o mesmo nome exibido no card.
- Atualiza o estado visual por alvo:
  - pendente;
  - falha;
  - sucesso.
- Atualiza o contador da seção `Alvos` com falhas, sucessos e pendentes.
- Atualiza a ação visual de dano:
  - falhou: dano normal;
  - resistiu: metade do dano.
- Atualiza a ação visual de efeito:
  - falhou: efeito disponível visualmente;
  - resistiu: efeito marcado como resistido.
- Persiste o resultado no flag do chat card quando possível.
- Mantém dano e efeito por alvo como ações visuais/desabilitadas. Aplicação real fica para a próxima etapa.

## Arquitetura

- Adiciona `item-use-card-multi-target-state.ts` para leitura/gravação do estado persistido do multi-target.
- Mantém o render do DOM em `item-use-card-multi-target.ts`.
- Usa o adapter existente `rollOrdemResistance` em vez de duplicar regra de rolagem do sistema.

## Validação sugerida

```bash
npm run typecheck
npm run build
```
