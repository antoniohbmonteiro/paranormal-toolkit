# Release 0.29.1 — Shared assisted action rules

A versão `0.29.1` estabiliza as regras assistidas dos cards de ritual/item-use e alinha o comportamento entre single-target e multi-target sem redesenhar os cards.

## Destaques

- Unifica as regras de ações assistidas entre single-target e multi-target.
- Adiciona camada compartilhada em `src/features/item-use/assisted-actions/` para policy, ViewModel, labels públicos e feedback privado de dano.
- Mantém renderers separados: single-target continua como decorator do prompt atual e multi-target continua com renderer próprio por alvo.
- Aplicar dano e aplicar efeito passam a ser ações GM-only.
- Rolar ou re-rolar resistência assistida do alvo também passa a ser GM-only.
- Jogadores podem ver o resultado público de resistência já rolado, mas não podem controlar a rolagem.
- Labels públicos de dano aplicado não mostram RD, dano bloqueado ou dano final pós-RD.
- Multi-target não persiste mais `finalDamage`, `blocked` ou detalhes de RD no estado público do chat card.
- Feedback privado para GM mostra `inputAmount -> finalDamage`, RD bloqueada, PV atual e condições sugeridas quando existirem.
- `multi-target-damage-feedback-service.ts` permanece como wrapper de compatibilidade, delegando para o serviço compartilhado.

## Decisões de privacidade

O card público deve mostrar apenas estado de jogo seguro para jogadores:

- resistência pendente, sucesso ou falha;
- resultado público da resistência;
- dano pré-RD usado pela ação, como `✓ 10 PV` ou `✓ 5 PV`;
- efeito aplicado ou resistido.

O card público não deve mostrar:

- RD;
- dano bloqueado;
- dano final pós-RD;
- detalhes internos do adapter de dano.

Esses detalhes ficam no whisper privado para GMs.

## Teste manual recomendado

### GM single-target

1. Usar ritual com dano e resistência em um alvo.
2. Rolar resistência pelo botão do card.
3. Confirmar que resistência persiste e atualiza o card.
4. Aplicar dano normal quando o alvo falhar.
5. Aplicar dano metade quando o alvo resistir.
6. Confirmar que efeito só é aplicável quando o alvo não resistiu.
7. Confirmar que o whisper privado mostra input, final, RD e PV atual.

### GM multi-target

1. Usar ritual com dois ou mais alvos.
2. Rolar resistência por alvo.
3. Confirmar que o alvo que falhou recebe ação de dano normal.
4. Confirmar que o alvo que resistiu recebe ação de metade.
5. Confirmar que efeito fica resistido para quem passou.
6. Aplicar dano nos alvos e validar whisper privado para GM.
7. Confirmar que o card público mostra apenas o dano pré-RD aplicado.

### Player não-GM single-target

1. Abrir o card como jogador.
2. Confirmar que não aparece botão para aplicar dano.
3. Confirmar que não aparece botão para aplicar efeito.
4. Confirmar que não aparece botão de rolar/re-rolar resistência assistida.
5. Confirmar que não existe seção vazia de ação assistida.

### Player não-GM multi-target

1. Abrir o card como jogador.
2. Confirmar que não aparece botão d20 clicável nos alvos.
3. Confirmar que resultados já rolados aparecem como status público não interativo.
4. Confirmar que não é possível aplicar dano ou efeito.
5. Confirmar que o card público não mostra RD ou dano final pós-RD.

### Casos de regressão

- Ritual com dano e sem efeito.
- Ritual com dano e sem resistência confiável.
- Ritual com dano, resistência e efeito estruturado.
- Card antigo multi-target com atributos legados de `finalDamage`/`blocked`, validando que eles são ignorados/removidos no re-render.
