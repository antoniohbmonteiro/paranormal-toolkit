# Paranormal Toolkit 0.40.2

Esta versão corrige a apresentação dos resultados de efeito e protege conteúdo autoral durante a aplicação de presets.

## Efeito mais fácil de identificar

A seção **Efeito** dos cards persistentes passa a usar uma identidade azul-petróleo dessaturada própria. A seção **Conjuração** mantém o roxo existente, e as cores de dano, cura, resistência e ações assistidas não mudam.

O campo interno `utilityLabel` da configuração genérica continua compatível com itens existentes, mas aparece na ficha como **Rótulo do resultado**, com o placeholder `Ex.: PV temporários`. Em rolagens de utilidade, o valor é exibido acima da fórmula; quando ausente ou vazio, o card usa **Resultado**.

O rótulo resolvido é gravado como propriedade opcional no estado serializável do card schema v2. Assim, cards novos preservam exatamente o rótulo após F5 sem reler o item, enquanto payloads v2 antigos continuam válidos e usam o fallback.

## Presets preservam descrições

Presets cuidam apenas da configuração mecânica e das flags de automação. Suas definições não incluem mais descrição, e o adaptador central que constrói o patch não emite `system.description`, `system.chatDescription` nem substitui o objeto `system`. Isso protege conteúdo vazio, HTML, texto original do sistema e personalizações do mestre tanto na primeira aplicação quanto na reaplicação.

Não há tentativa de recuperar descrições removidas por versões anteriores, pois não existe fonte confiável para reconstruí-las.

## Compatibilidade mecânica

Não houve mudança no custo, conjuração, dano de SAN, resistência, dano, cura, condições, ações assistidas, seleção de área, fallback multi-target ou Dice So Nice. Cicatrização e Eletrocussão mantêm suas fórmulas e demais configurações mecânicas.
