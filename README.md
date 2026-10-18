# Paranormal Toolkit

Automações e melhorias de qualidade de vida para mesas de Ordem Paranormal no Foundry VTT.

O Paranormal Toolkit ajuda mestres e jogadores com conjuração de rituais, custos, rolagens, cards assistidos, dano, cura, condições, seleção de alvos na cena e Aliados que dão suporte aos Agentes.

> Projeto não-oficial e independente. Compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT.

## Status

Versão atual: `0.45.2`, com correção do uso de habilidades concedidas pelos Aliados quando os relógios do servidor e dos clientes diferem. Veja o [`CHANGELOG.md`](CHANGELOG.md).

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
| Aliados | Actor próprio que concede benefícios passivos e habilidades a um Agente beneficiário, com suporte opcional a drones e piloto. |
| Efeitos da habilidade | Presets, edição rápida e editor nativo para efeitos próprios de habilidades e benefícios dos Aliados. |

## Como usar

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
