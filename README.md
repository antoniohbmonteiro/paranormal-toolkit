# Paranormal Toolkit

Automações e melhorias de qualidade de vida para mesas de Ordem Paranormal no Foundry VTT.

O Paranormal Toolkit ajuda mestres e jogadores com conjuração de rituais, custos, rolagens, cards assistidos, dano, cura, condições, seleção de alvos na cena e Aliados que dão suporte aos Agentes.

> Projeto não-oficial e independente. Compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT.

## Status

Versão atual: `0.48.0`, com o hook público `paranormal-toolkit.attack.published` para integração visual de ataques nativos e gerenciados. Mantém o configurador de ataque, Mirar, Rajada e os presets existentes. Veja o [`CHANGELOG.md`](CHANGELOG.md).

O módulo está em desenvolvimento ativo. Algumas automações ainda são assistidas: o Toolkit ajuda a calcular, rolar e organizar informações, mas o mestre continua decidindo quando aplicar efeitos, dano ou condições.

Até a versão `1.0.0`, APIs internas, flags e presets ainda podem mudar sem compatibilidade retroativa.

## Instalação

No Foundry VTT, abra **Módulos complementares → Instalar módulo** e cole a Manifest URL:

```text
https://github.com/antoniohbmonteiro/paranormal-toolkit/releases/latest/download/module.json
```

Ela sempre aponta para a release mais recente publicada no GitHub. Depois, ative o módulo no mundo que usa o sistema Ordem Paranormal. Mantenha todos os clientes na mesma versão.

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
| Modificadores de ataque | Opções por ataque, como Tiro Intuitivo, com crítico, custo e RD registrados separadamente no chat. |
| Aliados | Actor próprio que concede benefícios passivos e habilidades a um Agente beneficiário, com suporte opcional a drones e piloto. |
| Efeitos da habilidade | Presets, edição rápida e editor nativo para efeitos próprios de habilidades e benefícios dos Aliados. |

## Como usar

### Gerenciar presets

No menu da ficha do personagem, abra **Gerenciar presets**. O Mestre e usuários com permissão **OWNER** podem identificar e aplicar presets específicos, como Eletrocussão, Definhar, Cicatrização e Tiro Intuitivo. A ação permanece disponível mesmo sem itens reconhecidos; nesse caso, a janela apresenta um estado vazio.

O nome sugere um preset, mas somente **Aplicar** grava seu vínculo. Depois disso, o ID persistido tem prioridade e o reconhecimento continua após renomear o item. A tela também identifica versões desatualizadas. Automações manuais são preservadas; fórmulas e usos genéricos de rituais e habilidades continuam sendo configurados pelos recursos existentes, fora deste gerenciamento. Não há associação manual de presets a itens.

### Configurar ataque — ações gerais e habilidades

Ao clicar em **Ataque** no card de uma arma suportada, o Toolkit abre o configurador mesmo sem presets vinculados. Ações gerais aparecem conforme as propriedades da arma; habilidades aparecem na lista compacta e mostram sua configuração somente quando selecionadas. O resumo reúne crítico original/resultante, mostra RD somente quando positiva e custo/saldo somente quando existe gasto. Um único card **Dados de ataque** mostra as parcelas e o saldo dos modificadores selecionados: `−1d20 + 2d20 = +1d20`. Quando as escolhas se anulam, o card mostra a conta com `0d20` e o pool nativo é preservado. As contribuições de dados adicionais da arma também se somam em um único card **Dano adicional**, como `+1d10 + 2d10 = +3d10`. Sem contribuições, os respectivos cards são omitidos. A janela limita sua altura e mantém os botões acessíveis com rolagem interna. O modo de automação **Desativado** continua respeitado.

**Mirar** aparece para armas à distância e declara que o personagem já realizou essa ação. Não consome movimento, gasta recurso, modifica penalidades ou concede bônus. Vale somente para este ataque. Mirar e Tiro Intuitivo são exclusivos: selecionar um desmarca o outro, inclusive o gasto adicional.

**Rajada** aparece somente para armas de fogo à distância com a propriedade **Automática**. Aplica −1 dado ao teste de ataque e +1 dado do mesmo tamanho do dano-base da arma. O dado adicional fica fora do crítico: `2d6` com crítico x3 causa `6d6 + 1d6`. A penalidade altera o pool: `3d20kh → 2d20kh`, `1d20kh → 2d20kl` e `2d20kl → 3d20kl`. Não consome munição. A base deve estar no formato `NdM`, como `2d6`; fórmulas-base compostas deixam somente Rajada indisponível. Dados extras configurados separadamente na arma são preservados. Rajada pode combinar com Mirar ou com Tiro Intuitivo.

**Ataque Especial** permite distribuir blocos de +5 entre ataque e dano, em dois controles lado a lado. Em progressão por NEX, os limites são 1 bloco em 5%, 2 em 25%, 3 em 55% e 4 em 85%; em progressão por nível, são os níveis 1, 5, 11 e 17. O custo é 2 PE/PD pelo primeiro bloco e +1 por bloco adicional. Selecionar começa em +0/+0 e exige distribuir pelo menos um bloco ou desmarcar antes de atacar. NEX abaixo de 5% oferece zero blocos; dados de progressão inválidos impedem somente essa habilidade. O vínculo não exige classe, NEX ou nível. O bônus no teste preserva os dados e demais bônus nativos; o bônus fixo no dano não multiplica no crítico e pode combinar com Rajada: `2d6`, crítico x3, Rajada e +10 geram `6d6 + 1d6 + 10`.

**Disparo da Morte — regra 1.1** exige arma de fogo ou de disparo, custa 2 PE/PD e fornece +2 na margem de ameaça. **Possui afinidade** começa desmarcado e é declarado manualmente para este ataque; marcado, ignora até 10 RD ao acertar, mesmo sem crítico, e informa que cobertura leve é ignorada. A resolução da cobertura permanece manual. Com Tiro Intuitivo pago, as duas penetrações somam até 20 RD. O custo antigo de 3 PE do Item não é usado nem alterado pelo preset.

**Disparo Letal** reconhece também o Item nativo **NEX 40% - Disparo Letal**. Após declarar **Mirar**, pode ser selecionado por 1 PE/PD para receber +2 na margem de ameaça no próximo ataque até o final do próximo turno. O Toolkit registra esse custo na publicação do ataque e não controla ações anteriores ou duração. Desmarcar Mirar remove Disparo Letal e seu custo; selecionar Tiro Intuitivo também remove ambos. Disparo da Morte e Disparo Letal válidos somam +4 na margem de ameaça.

Para usar essas habilidades, aplique seus presets nos Items correspondentes em **Gerenciar presets**. A configuração vale por execução, sem alterar a arma ou criar efeitos no personagem. Bônus, distribuição, afinidade, custo e alvo ficam registrados no ataque e sobrevivem ao reload; mudar a habilidade depois não recalcula um ataque publicado. Alterar o tipo principal do dano da arma bloqueia o bônus fixo já registrado até a conferência da arma.

Com uma habilidade chamada **Tiro Intuitivo** no personagem, abra **Gerenciar presets** e clique em **Aplicar**. O vínculo fica na habilidade: renomeá-la não altera o reconhecimento e nenhuma arma específica é exigida. O Toolkit não valida pré-requisitos de aquisição, como classe, Pontaria veterana ou NEX. Durante o ataque, exige a habilidade vinculada e uma arma compatível à distância.

As opções começam desmarcadas. Selecionar **Tiro Intuitivo** na lista de habilidades ativa **Usar Tiro Intuitivo — sem Mirar**, declarando que este ataque não usa a ação Mirar e acrescentando +2 à margem de ameaça. A subopção **Gastar 2 PE/PD** acrescenta +1 ao multiplicador e permite ignorar até 10 RD se acertar, mesmo sem crítico. Os valores são relativos à arma: **19/x3** passa a **17/x3**, ou **17/x4** com o gasto. O recurso segue a configuração Sem Sanidade do sistema.

**Atacar** sem selecionar opções mantém o ataque normal. **Cancelar** ou fechar não rola nem gasta. Cada ataque efetivo produzido pelo fluxo nativo tem escolhas, custo, crítico e alvo próprios; o Toolkit não gerencia sequências. A arma mantém seus dados originais.

O botão **Dano** usa os ataques do acionamento atual daquele card, respeitando erros e reações. Resultados já publicados são reutilizados; clicar novamente não rerrola o dano. O resumo da mensagem individual também permite acessar o dano daquele ataque. Após reabrir o chat, as referências e escolhas continuam persistidas. Um novo acionamento, inclusive cancelado ou sem alvo, não herda o anterior.

As escolhas de Rajada e seu dado adicional são recuperadas do ataque persistido. Se as faces do dado-base ou o tipo principal da arma mudarem antes de rolar dano, a resolução é bloqueada para conferência. Cards antigos continuam aceitos, com Mirar e Rajada desmarcados. Chamadas diretas de `rollAttack()`, como macros e contra-ataques, mantêm a abertura do popup somente quando existe preset elegível.

O Mestre executor conectado aplica o resultado ao alvo original, manualmente pelo card. Ataques sem alvo e danos de tipos diferentes continuam exigindo aplicação manual. Uma execução ou publicação incerta fica bloqueada para conferência: confira recursos, mensagens e alvo antes de iniciar outro uso. Não há rastreamento de Mirar, controle de gasto por rodada ou compensação automática de dano após alterações posteriores.

### Efeitos da habilidade

Na aba **Efeitos** da ficha nativa de uma habilidade, abaixo das listas do sistema, use **Paranormal Toolkit — Efeitos da habilidade → Configurar efeitos da habilidade**. As listas e ações nativas continuam disponíveis. A janela permite criar por preset, criar personalizado, visualizar efeitos existentes de qualquer autoria, editar rapidamente efeitos simples, abrir a edição avançada nativa e excluir mediante confirmação. Efeitos complexos, com fórmulas, condições ou comportamento externo usam o editor nativo.

Fórmulas em mudanças aditivas de campos conhecidos, como `system.PV.bonus`, recebem um resumo como **Bônus de PV máximo · fórmula personalizada**, mesmo sem valor fixo. Esse reconhecimento visual identifica o campo afetado; não valida a expressão nem calcula seu resultado. O campo **Valor ou fórmula** permite criar expressões como `(@NEX.value / 5) * 1`, preservadas no Active Effect e avaliadas nativamente pelo Ordem. Aceita aritmética e `floor`, `ceil`, `round`, `abs`, `min` e `max`, sem dados aleatórios. Use referências do Actor (`@NEX.value`, `@attributes.str.value`): o Ordem só avalia diretamente a expressão quando há `@`, condição necessária nos campos sem schema. Após salvar, fórmulas continuam usando a edição avançada nativa. As referências são resolvidas no Actor que recebe o efeito; em benefícios de Aliados, é o beneficiário. RD continua aceitando inteiro positivo no preset: uma fórmula negativa pode aumentar o dano e exige revisão no editor nativo.

Em Agentes e Items independentes, são efeitos próprios. Em **Aplicação do novo efeito**, escolha **Aplicar automaticamente ao Agente** ou **Manter somente na habilidade**. Uma habilidade ativa pode ter efeitos passivos permanentes: o padrão é **Aplicar automaticamente ao Agente**, independentemente da Execução, e a escolha vale para cada efeito criado por preset ou personalizado. Items independentes explicam que a aplicação ocorrerá quando incorporados a um Actor. **Usar a habilidade não aplica automaticamente seus efeitos.** O estado desativado e a transferência continuam sendo propriedades nativas editáveis no Foundry; para mudar a transferência de um efeito existente, use a edição avançada. Abrir, reconhecer, cancelar e fechar não altera efeitos, flags ou defaults anteriores.

Items independentes e de compêndios não são classificados como Aliados por nome, pasta ou flags: novos efeitos são próprios. Em compêndios bloqueados, cópias gerenciadas de concessões ou sem permissão de edição, a janela é somente leitura. Uma ficha alternativa sem a parte Efeitos e seu contêiner rolável declarado conserva somente a interface nativa, com diagnóstico no console.

Os presets incluem Defesa, as 27 perícias, Deslocamento, PV/PE/PD/SAN máximo, capacidade de carga, FOR/AGI/INT/VIG, DT de rituais, PE/PD por rodada e **Resistência a Dano**. Máximos exigem Classe e cálculos automáticos; os recursos seguem a regra de Sanidade do sistema. Limites por rodada não automatizam gastos. PRE e Esquiva aguardam correções do sistema; +Xd20 continua indisponível.

**Resistência a Dano:** selecione um dos 15 tipos e um inteiro positivo (padrão: Balístico, 5). Tipos disponíveis: Corte, Impacto, Perfurante, Balístico, Sangue, Morte, Conhecimento, Energia, Medo, Fogo, Frio, Eletricidade, Químico, Mental e Dano. **Dano é um tipo explícito**, sem resistência universal ou a dano sem tipo. Dois efeitos próprios aditivos somam nativamente; entre suportes concorrentes permanece a precedência dos Aliados. `ignoreRD` ignora a resistência por tipo, mas não o `extraRD` separado do sistema. Não são criadas imunidades, vulnerabilidades ou campos persistidos no Actor.

### Aliados

Aliados são Actors do tipo **Aliado** que dão suporte a um Agente: concedem benefícios passivos e disponibilizam suas habilidades enquanto o suporte estiver ativo.

**Criar e configurar habilidades.** Na aba **Habilidades** da ficha do Aliado, **Criar habilidade** cria um Item nativo do tipo habilidade e abre a janela **Benefícios passivos — Toolkit**. Também é possível arrastar habilidades do diretório ou de compêndios. Em cada linha, o nome expande a descrição, o lápis abre a ficha nativa da habilidade e o menu de três pontos oferece **Benefícios passivos** e **Remover habilidade**. Na ficha nativa da habilidade pertencente ao Aliado, a aba **Efeitos** oferece **Paranormal Toolkit — Benefícios passivos → Configurar benefícios passivos**, abaixo das listas nativas. Todos os acessos reutilizam uma janela por habilidade; o antigo botão do cabeçalho foi retirado.

**Benefícios passivos.** Escolha o tipo de benefício, informe o valor e clique em **Adicionar benefício**. Presets disponíveis:

| Preset | Efeito no beneficiário |
|---|---|
| Bônus de Defesa | Soma à Defesa (e à Esquiva). |
| Bônus de Perícia | Soma à perícia escolhida nas rolagens e no total da ficha. |
| Bônus de Deslocamento | Soma ao Deslocamento. |
| Bônus de PV, PE ou PD máximo | Soma ao máximo calculado pelo sistema (exige item de Classe e cálculos automáticos; PD usa a regra Sem Sanidade). |
| SAN máximo, carga, FOR/AGI/INT/VIG, DT e PE/PD por rodada | Usa os mesmos presets de efeitos próprios, respeitando os cálculos nativos. |
| Resistência a Dano | Reduz dano do tipo selecionado pela API nativa do Ordem. |
| Bônus de Dados (+Xd20) | Visível, mas indisponível até a mecânica existir no sistema Ordem. |

**Criar personalizado** cria um Active Effect vazio e abre o editor nativo, para mudanças livres. Todos os benefícios são Active Effects nativos da habilidade: editar atualiza o benefício projetado, desabilitar no editor nativo o suspende e excluir pela janela o remove do beneficiário.

**Legado e importação explícita.** Benefícios antigos válidos continuam projetados por leitura em memória, sem conversão da origem. Quando aplicável, **Importar benefícios legados** mostra a prévia para confirmação pelo Mestre: cria somente as fontes faltantes e grava o marcador ao concluir. Cancelar não escreve; uma falha parcial exige nova tentativa expressa, com as mesmas identidades. Fontes existentes e flags desconhecidas são preservadas. Benefícios exclusivamente legados precisam dessa importação para edição. Arrastar uma habilidade para um Aliado não transforma efeitos próprios em benefícios; só fontes marcadas participam da projeção. A reconciliação continua atualizando legitimamente as projeções gerenciadas.

**Beneficiário e suporte.** Na aba **Suporte**, escolha um Agente em **Beneficiário** para ativar o suporte; **Nenhum** encerra e remove benefícios e habilidades concedidas. Durante combate, a troca retira o suporte anterior imediatamente e aplica o novo na rodada seguinte. Com o suporte ativo, as habilidades do Aliado aparecem na ficha do beneficiário, que as usa pelo diálogo e card de habilidades existentes ou pela automação configurada, pagando seus próprios PE/PD. O ícone de cada habilidade na ficha do Aliado é um atalho para esse uso.

**Drones e piloto.** Com a opção de mundo **Homebrew: piloto utiliza habilidades do drone** (desligada por padrão), Aliados marcados como **É um Drone** em Detalhes mostram o seletor **Piloto**. As habilidades passam a ser concedidas somente ao piloto, que usa seus próprios dados, NEX e PE/PD; os benefícios passivos continuam no beneficiário. Escolher um piloto não concede permissão sobre a ficha dele.

**Mestre e limites.** Um Mestre conectado executa automaticamente as alterações protegidas e recebe avisos privados das mudanças. Remover como Mestre um benefício ou habilidade concedida suprime aquela fonte até uma nova ativação ou troca de beneficiário; **Reconciliar suporte** fica no menu da ficha do Aliado. Sem Mestre conectado, o suporte não é atualizado e as habilidades concedidas não podem ser usadas. Benefícios que alteram o mesmo campo do mesmo beneficiário não se somam: vale o suporte mais recente. Operações interrompidas com resultado incerto não são repetidas automaticamente. Detalhes técnicos e testes estão em [`docs/ALLY-ACTOR-POC.md`](docs/ALLY-ACTOR-POC.md).

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

O histórico de versões, decisões e próximas etapas fica em:

- [`CHANGELOG.md`](CHANGELOG.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)

## Licença

MIT. Veja [`LICENSE`](LICENSE).

## Aviso legal

Paranormal Toolkit é um projeto não-oficial e independente.

Este módulo não contém textos, artes, compêndios ou assets oficiais de Ordem Paranormal. Ele apenas oferece automações e melhorias de uso para mesas que utilizam o sistema não-oficial no Foundry VTT.
