# Paranormal Toolkit

Automações e melhorias de qualidade de vida para mesas de Ordem Paranormal no Foundry VTT.

O Paranormal Toolkit ajuda mestres e jogadores com conjuração de rituais, custos, rolagens, cards assistidos, dano, cura, condições e seleção de alvos na cena.

> Projeto não-oficial e independente. Compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT.

## Status

Versão candidata: `0.44.0` — P1/P2 de Aliados aguardam smoke multiplayer.

O módulo está em desenvolvimento ativo. Algumas automações ainda são assistidas: o Toolkit ajuda a calcular, rolar e organizar informações, mas o mestre continua decidindo quando aplicar efeitos, dano ou condições.

Até a versão `1.0.0`, APIs internas, flags e presets ainda podem mudar sem compatibilidade retroativa.

## Instalação

Em construção.

A instalação pública será disponibilizada por release no GitHub. Quando a primeira release estiver pronta, o módulo poderá ser instalado pelo Foundry usando uma Manifest URL.

## Compatibilidade

- Foundry VTT v14+
- Sistema não-oficial Ordem Paranormal para Foundry VTT
- Sistema esperado: `ordemparanormal`

## Recursos principais

| Recurso | O que faz |
|---|---|
| Conjuração de rituais | Abre um popup próprio para escolher forma, custo e opções do ritual. |
| Formas de ritual | Suporte a Padrão, Discente e Verdadeiro quando disponíveis. |
| Custo de PE/PD | Mostra o custo final e pode gastar o recurso ao conjurar. |
| Teste de Ocultismo | Rola Ocultismo contra a DT de ritual do personagem. |
| Cards assistidos | Cria cards no chat com resultado, dano, cura, resistência e ações úteis. |
| Resistência | Ajuda o mestre a lidar com resistência e opções como dano normal ou metade. |
| Efeitos por resistência | Rituais genéricos podem configurar condições diferentes para sucesso e falha da resistência. |
| Dano e cura | Permite aplicar manualmente dano/cura pelo card nos targets originais do uso. |
| Condições | Pode aplicar condições informativas como Active Effects. |
| Alvos por área | Permite selecionar alvos na cena para rituais com área. |
| Presets de rituais | Alguns rituais conhecidos já possuem automações configuradas. |

## Como usar

### Suporte e habilidades de Aliados (`feature/allies`)

Crie um Item normal do tipo habilidade no diretório de Itens. No menu da ficha nativa (três pontos), abra **Benefícios passivos — Toolkit**. Em **Adicionar efeito**, informe nome e valor para criar um **Bônus de Defesa**, ou use **Personalizado** para abrir o editor nativo de Active Effects. Ambos já participam automaticamente do suporte, sem seleção adicional; sua transferência para o próprio Aliado permanece desativada. Efeitos antigos não identificados como suporte continuam intactos na ficha nativa e não são incluídos automaticamente.

Arraste a habilidade para o Aliado. O botão **Benefícios** abre o mesmo editor para a cópia incorporada, sem modificar o original do diretório. Selecione um Agente persistente e clique em **Atribuir / trocar**, depois **Ativar**. Os efeitos são aplicados automaticamente, com o Aliado como origem; **Desativar** os remove. Trocar durante combate retira os benefícios anteriores e aguarda a próxima rodada para aplicar no novo beneficiário.

Editar o efeito da cópia atualiza a projeção existente: Defesa +5 pode virar +7 ou +10 sem acumular valores. Desabilitar no editor nativo suspende o benefício; reabilitar restaura sua elegibilidade. **Excluir efeito** pede confirmação, exclui o efeito original do Item e retira sua projeção. Turnos e reconciliações sem mudanças preservam o ID e não escrevem no efeito. Benefícios antigos migram automaticamente para efeitos nativos; flags desconhecidas são preservadas. Efeitos personalizados admitem múltiplas mudanças, mas a interpretação mecânica de uma chave depende do sistema. Regras de conflitos, migração e limitações estão no relatório abaixo.

O proprietário opera o suporte sem aprovação administrativa. Um GM conectado executa as escritas protegidas automaticamente e os GMs recebem avisos privados das mudanças efetivas. Remover um efeito gerenciado como GM suprime aquela fonte até uma nova ativação ou troca real de beneficiário.

Enquanto o suporte estiver ativo, todas as habilidades do Aliado também aparecem na ficha do beneficiário, incluindo as passivas e as sem ativação preenchida. Edite a habilidade no Aliado para atualizar a concessão. O beneficiário executa e paga: usa o diálogo e o card de habilidades existentes ou a automação configurada, que tem precedência. A automação cobra somente seus próprios steps; a habilidade genérica mantém a regra global de PE/PD e a opção de gasto manual. Remover uma concessão como GM a suprime até uma nova ativação ou troca real; as habilidades normais permanecem intactas.

Efeitos `allyPassive` continuam exclusivamente no suporte passivo. Outros efeitos nativos reconhecidos preservam transferência, desabilitação e duração configuradas; efeitos desconhecidos bloqueiam o uso com diagnóstico, preservando a origem. O uso concedido exige GM executor conectado. Operações interrompidas com resultado incerto não são repetidas automaticamente; o GM deve conferir recursos e resultados. Evidências, recuperação e roteiro multiplayer estão em [ALLY-ACTOR-POC.md](docs/ALLY-ACTOR-POC.md).

### Usando uma habilidade com rolagens

Ao usar uma habilidade com fórmulas configuradas, o Toolkit executa cada rolagem uma única vez e persiste fórmula, total e dados individuais no card. Rolagens genéricas continuam informativas. Resultados de dano ou cura criam uma ação assistida independente para cada target selecionado no momento do uso.

As ações permanecem manuais e exclusivas do Mestre: aplicar usa exatamente o total já exibido, sem nova rolagem. Alterar os targets selecionados depois da publicação não muda os Actors vinculados ao card, e habilidades sem target continuam utilizáveis sem oferecer uma ação que possa atingir um alvo posterior.

### Usando um ritual

1. Use o ritual normalmente pela ficha.
2. Escolha a forma do ritual.
3. Confira custo, alvo, duração e resistência.
4. Conjure.
5. Use o card no chat para aplicar dano, cura, condição ou resolver resistência quando fizer sentido.


### Card estruturado de ritual para zero ou um alvo

Em `ritual.chatCard.mode = auto`, conjurações suportadas com zero ou um alvo compatível usam o novo card estruturado. Sem alvo, o card mantém fórmula, resultado e resistência informativa, mas não oferece rolagens ou aplicações que dependam de um Actor alvo. O estado, os metadados de execução, alcance e duração, a resistência e as ações manuais são persistidos e continuam disponíveis depois de recarregar o Foundry. Use `legacy` para que novas conjurações voltem diretamente ao card anterior; cards v2 existentes permanecem v2.

O card apresenta a descrição formatada do ritual em uma seção recolhível, usa cores próprias para dano, cura e resultados de resistência e agrupa as condições do outcome resolvido em uma única ação visual. As condições permanecem registradas e concluídas individualmente.

Sem alvo com ficha, resultados dependentes de alvo ficam para uso manual e o card informa essa limitação quando necessário. Múltiplos alvos, áreas, linhas, templates, mais de uma rolagem de efeito e outros casos não suportados usam automaticamente o legado. A resistência não pode ser rolada novamente na 0.40.0 e nunca aplica dano, cura ou condições automaticamente. O setting `itemUse.systemCardMode` continua controlando independentemente se o card original do sistema é mantido (`keep`) ou substituído (`replace`).

### Configurando condições por resistência

Na aba **Atributos** de um ritual, use o bloco **Efeitos da resistência** do Paranormal Toolkit para escolher condições disponíveis em caso de sucesso ou falha. Essa configuração usa flags próprias do módulo e funciona no fluxo genérico, sem exigir preset específico.

A resolução continua assistida: o mestre rola ou confere a resistência e escolhe no card a ação correspondente ao resultado.

### Usando alvos por área na cena

Alguns rituais podem permitir seleção de alvos direto na cena.

1. Marque a opção de usar área na cena.
2. Posicione a área sobre os tokens.
3. Mova ou rotacione a área até cobrir os alvos desejados.
4. Confirme.
5. O card será criado com os alvos encontrados.

O Toolkit não decide sozinho quem sofre dano ou efeito final. Ele prepara o fluxo para o mestre resolver.

## Destaque da versão 0.32.0

A versão `0.32.0` adiciona seleção de alvos por área na cena.

O primeiro fluxo validado é uma linha de efeito para rituais como **Eletrocussão Discente**:

- mostra uma área posicionável na cena;
- permite mover e rotacionar antes de confirmar;
- mostra preview dos tokens que serão afetados;
- cria o card com múltiplos alvos;
- remove a área temporária após confirmar ou cancelar.

## Limites atuais

O Paranormal Toolkit ainda não tenta automatizar tudo sozinho.

Atualmente:

- o mestre continua decidindo quando aplicar dano, metade, condição ou outro efeito;
- nem todos os rituais possuem preset específico;
- algumas automações dependem dos dados disponíveis no sistema Ordem Paranormal;
- integração com animações e sons fica para módulos ou versões futuras;
- o módulo ainda está em desenvolvimento ativo e pode mudar bastante antes da versão `1.0.0`.

## Roadmap e changelog

O histórico detalhado de versões, decisões e próximas etapas fica em:

- [`docs/ROADMAP.md`](docs/ROADMAP.md)

## Licença

MIT. Veja [`LICENSE`](LICENSE).

## Aviso legal

Paranormal Toolkit é um projeto não-oficial e independente.

Este módulo não contém textos, artes, compêndios ou assets oficiais de Ordem Paranormal. Ele apenas oferece automações e melhorias de uso para mesas que utilizam o sistema não-oficial no Foundry VTT.
