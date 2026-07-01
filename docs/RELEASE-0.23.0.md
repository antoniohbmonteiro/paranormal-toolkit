# Paranormal Toolkit 0.23.0

## Multi-target ritual card visual model

- Adiciona o primeiro modelo visual de card multi-target para rituais com 2+ alvos.
- Mantém o fluxo single-target atual intacto.
- Para multi-target, o card passa a priorizar `Conjuração → Alvos → Efeito`.
- A seção **Alvos** lista cada alvo do resumo real do card e prepara a UI compacta por alvo.
- Cada alvo nasce em estado pendente, com botão visual de d20, dano normal e efeito em estado aguardando resistência.
- O bloco **Efeito** no multi-target vira informação global: o efeito existe, mas a aplicação será por alvo na próxima etapa funcional.

## Limitações desta etapa

- Os botões por alvo ainda são visuais/desabilitados.
- A resistência por alvo, aplicação de dano por alvo e aplicação de efeito por alvo ficam para a próxima etapa.
- Não há aplicação em lote, seleção por template ou auto-target.

## Validação manual sugerida

1. Usar um ritual como Eletrocussão com um único alvo e confirmar que o card single-target continua igual.
2. Usar o mesmo ritual com 2+ alvos.
3. Confirmar que o cabeçalho continua mostrando os alvos reais, sem duplicar texto fora da seção.
4. Confirmar que aparece a seção **Alvos** com uma linha por alvo.
5. Confirmar que abrir/fechar cada alvo funciona sem afetar os outros.
6. Confirmar que a seção **Efeito** aparece como informação global com `Aplicação por alvo`.
