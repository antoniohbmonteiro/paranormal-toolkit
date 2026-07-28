# Paranormal Toolkit 0.41.0

## Resultados de habilidade no primeiro uso

Ao confirmar **Usar habilidade**, o Toolkit valida custo e escolhas de NEX, gasta PE ou PD quando solicitado e executa todas as fórmulas configuradas em ordem. Dice So Nice é aguardado quando disponível e o chat recebe apenas um card com fórmula, total e dados individuais.

Progressões `highest-unlocked` usam automaticamente a maior faixa liberada. Progressões `choose-unlocked` mostram radio buttons no popup e começam com a maior faixa liberada selecionada.

## Card persistente

O card v3 usa as mesmas fundações visuais dos rituais e guarda um snapshot serializável completo. Depois de F5, a apresentação é reconstruída da flag da mensagem sem reler ator ou item. Cards v2 continuam preservados e seus botões legados permanecem funcionais.

Cards novos não possuem botão de rolagem, inline roll, `Roll.toMessage()` ou mensagem adicional. Dano e cura são somente resultados informativos: não há aplicação automática, DT, crítico ou detecção mecânica de sucesso e falha.

## Segurança do gasto

Falhas técnicas interrompem a sequência. O Toolkit só restaura o recurso se o valor atual ainda corresponder ao saldo imediatamente posterior ao gasto; alterações concorrentes nunca são sobrescritas silenciosamente.
