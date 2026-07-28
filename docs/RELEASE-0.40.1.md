# Paranormal Toolkit 0.40.1

Esta correção completa o card persistente de ritual sem alterar o domínio de execução, resistência ou ações assistidas.

## Card de ritual

- Falhas de conjuração mostram `Perde N SAN` quando o workflow já produziu uma ação de dano de SAN com valor; sem esse valor, mostram `Dano de Sanidade`.
- O alvo permanece somente no contexto do cabeçalho.
- As pills passam a mostrar custo, execução, alcance e duração resolvidos a partir do item pelo adapter.
- Os metadados resolvidos são armazenados no estado serializável e voltam após F5. Payloads v2 antigos, sem esses campos opcionais, continuam válidos.
- Rituais sem alvo usam o card v2 sem Actor ou Token fictício: dano, cura e efeito continuam visíveis, a resistência fica informativa e aplicações dependentes de alvo são orientadas para uso manual. Dois ou mais alvos e targeting de área, linha ou template permanecem no card legado.

## Validação manual

1. Conjure um ritual com alvo e confirme que o alvo aparece no cabeçalho, mas não nas pills.
2. Confirme custo, execução, alcance e duração nas pills.
3. Falhe a conjuração e confirme a consequência de SAN.
4. Conjure sem selecionar alvo e confirme os resultados, a resistência sem botão e a nota de uso manual.
5. Recarregue o Foundry e confirme que o card sem alvo e seus metadados continuam disponíveis.
