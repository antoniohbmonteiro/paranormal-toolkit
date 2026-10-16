# Integração com o sistema ordemparanormal

Este documento registra decisões e cuidados para integração com o sistema não-oficial `ordemparanormal`.

## Objetivo

Integrar com o sistema sem tentar substituí-lo.

O Toolkit deve funcionar como módulo companion:

- opcional;
- desacoplado;
- tolerante a mudanças;
- sem duplicar responsabilidades do sistema base quando houver API nativa melhor.

## Sistema alvo

```txt
game.system.id === "ordemparanormal"
```

O módulo deve abortar inicialização funcional caso o sistema ativo seja outro.

## Dados atuais conhecidos

Paths atuais usados pelo adapter inicial:

```txt
Agente:
system.PV.value
system.PV.max
system.SAN.value
system.SAN.max
system.PE.value
system.PE.max
system.PD.value
system.PD.max
system.ritual.DT

Ameaça:
system.attributes.hp.value
system.attributes.hp.max
```

Esses paths são considerados detalhes de implementação atuais, não contrato permanente.

### Campos de bônus usados pelos presets de Active Effect

Os presets de benefícios passivos (`src/adapters/ordem/ordem-effect-presets.ts`, paths em `ORDEM_AGENT_BONUS_PATHS`) criam uma única mudança `add`, fase `initial`, prioridade 20. No Foundry v14, `initial` é aplicada antes de `prepareDerivedData` e `final` depois de `prepareData`. Verificado no Ordem 8.0.2 (fork local) e no Foundry 14.369:

| Preset | Path | No schema | Efeito real na preparação do Agente |
|---|---|---|---|
| Defesa | `system.defense.value` | sim | base de `calculateDefense` (+proteções, +AGI); entra também na Esquiva. `defense.bonus` existe, mas não é lido. |
| Deslocamento | `system.desloc.value` | sim | o derivado só subtrai 3 por sobrecarga. `desloc.bonus` existe, mas não é lido. |
| Perícia | `system.skills.<id>.value` | sim | soma na rolagem de perícia (`extraBonus`) e no total da ficha, sem travar o modificador editável `mod`. Não entra na iniciativa do combate com perícia treinada nem na Esquiva. |
| PV/PE/PD máximo | `system.PV.bonus`, `system.PE.bonus`, `system.PD.bonus` | não (aplicação unguided do v14) | somado por `_calculateMaxHP` somente com item de Classe e `disableCalculations` desligado; caso contrário, sem efeito. PD depende da regra Sem Sanidade. |
| Dados (+Xd20) | — | apenas na branch `feat/native-dice-bonus` do fork | preset bloqueado até a mecânica existir no sistema. |

Os ids de perícia aceitos são os 27 do `AgentData`, exceto `freeSkill`. `tests/reference/ordem-effect-preset-paths.test.ts` confere esses consumos com as fontes reais quando `PARANORMAL_TOOLKIT_ORDEM_REFERENCE` está definida.

## Refatoração do sistema

O mantenedor do sistema informou que pretende refatorar bastante os dados para melhorar compatibilidade, intuição e integração com módulos.

Impacto esperado:

- paths podem mudar;
- algumas operações podem virar nativas do sistema;
- hooks/flags podem ser adicionadas no futuro;
- nosso adapter pode precisar ser reescrito.

Decisão:

```txt
Core do Toolkit não acessa actor.system diretamente.
```

## Dano, cura e sanidade

O sistema já possui ou deve possuir alguma base para aplicação de dano, com possibilidade futura de cura e sanidade.

Decisão:

- o Toolkit pode implementar operações próprias enquanto não houver API nativa suficiente;
- essas operações devem ficar atrás de interface/adapter;
- se o sistema expuser método nativo futuro, o adapter deve delegar para ele.

Exemplo futuro desejável:

```ts
await ordemAdapter.applyDamage(actor, amount);
```

Hoje isso pode usar `actor.update`. Amanhã pode chamar API nativa do sistema.

## Hooks desejáveis no sistema

Não são requisitos imediatos, mas seriam pontos úteis de integração futura:

```ts
Hooks.callAll("ordemparanormal.itemUsed", data);
Hooks.callAll("ordemparanormal.attackRolled", data);
Hooks.callAll("ordemparanormal.damageRolled", data);
Hooks.callAll("ordemparanormal.damageApplied", data);
Hooks.callAll("ordemparanormal.resourceChanged", data);
```

Também seria útil uma API estável para:

- ler recurso;
- alterar recurso;
- aplicar dano;
- curar;
- identificar crítico;
- obter fórmula de dano de arma;
- obter categoria de arma.

## Chat cards

O Toolkit pode enriquecer o chat do sistema sem substituir o card original.

Estratégia inicial:

- usar `preCreateChatMessage` para capturar targets atuais;
- salvar dados em flags próprias;
- usar hook de renderização de chat para adicionar bloco visual;
- não parsear HTML do sistema como fonte de verdade.

## Active Effects no Foundry v14

Foi observado erro relacionado a `applyActiveEffects`/fase `final` em testes no Foundry v14.

Decisão:

- não depender de Active Effects para ResourceEngine inicial;
- usar `actor.update` via adapter para PV/SAN/PE/PD na v0.1/v0.2;
- revisar Active Effects após correções do sistema para v14;
- tratar Active Effects como etapa própria, não base da automação inicial.

## Comunicação com a comunidade

Pontos combinados/assumidos:

- acompanhar board do GitHub do sistema;
- acompanhar chat de desenvolvimento do servidor;
- evitar retrabalho;
- contribuir com testes, issues ou PRs pontuais quando fizer sentido;
- manter Toolkit/FX como módulos opcionais, não concorrentes do sistema.
