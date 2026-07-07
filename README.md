# Paranormal Toolkit

Automações e melhorias de qualidade de vida para mesas de Ordem Paranormal no Foundry VTT.

O Paranormal Toolkit ajuda mestres e jogadores com conjuração de rituais, custos, rolagens, cards assistidos, dano, cura, condições e seleção de alvos na cena.

> Projeto não-oficial e independente. Compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT.

## Status

Versão atual: `0.32.0`

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
| Dano e cura | Permite aplicar dano/cura pelo card quando houver alvo válido. |
| Condições | Pode aplicar condições informativas como Active Effects. |
| Alvos por área | Permite selecionar alvos na cena para rituais com área. |
| Presets de rituais | Alguns rituais conhecidos já possuem automações configuradas. |

## Como usar

### Usando um ritual

1. Use o ritual normalmente pela ficha.
2. Escolha a forma do ritual.
3. Confira custo, alvo, duração e resistência.
4. Conjure.
5. Use o card no chat para aplicar dano, cura, condição ou resolver resistência quando fizer sentido.

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