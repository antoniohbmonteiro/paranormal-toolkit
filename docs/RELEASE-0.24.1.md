# Paranormal Toolkit 0.24.1

Polimento visual do card multi-target depois da primeira funcionalidade de resistência por alvo.

## Mudanças

- Adiciona seção global **Dano** entre Conjuração e Alvos, mostrando apenas tipo, fórmula e total do dano rolado.
- Mantém resistência, dano normal/metade e efeito dentro de cada alvo.
- Padroniza o detalhe aberto da resistência por alvo para usar o mesmo padrão visual de fórmula/total das rolagens do card.
- Mostra dados da resistência no detalhe do alvo quando a rolagem já existe.
- Aumenta o botão de resultado da resistência para evitar quebra em duas linhas.
- Padroniza o ícone de metade com o escudo usado no resumo do alvo.
- Remove padding lateral do container externo do Toolkit para aproveitar melhor a largura do chat.

## Observações

- Não adiciona aplicação real de dano ou efeito por alvo.
- A rolagem de resistência por alvo continua sendo a funcionalidade principal da série 0.24.x.

## Validação sugerida

```bash
npm run typecheck
npm run build
```
