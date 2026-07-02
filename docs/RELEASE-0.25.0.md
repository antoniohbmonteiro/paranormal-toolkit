# Paranormal Toolkit 0.25.0

Aplicação de dano por alvo no card multi-target.

## Mudanças

- Botão de dano por alvo agora aplica dano no ator/token correto.
- Alvo com resistência bem-sucedida aplica metade do dano.
- Alvo com resistência falha aplica dano normal.
- Alvo pendente mantém dano bloqueado até rolar resistência.
- A aplicação usa o `OrdemDamageAdapter`, o mesmo caminho de dano assistido usado pelo single-target para respeitar `actor.applyDamage`, tipo de dano e RD do sistema.
- Estado de dano aplicado é persistido no flag do chat card.
- Após aplicar, o botão mostra o dano final aplicado e RD bloqueada quando houver.
- Não altera aplicação de efeito por alvo.

## Validação sugerida

```bash
npm run typecheck
npm run build
```
