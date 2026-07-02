# Arquitetura de Engines, Adapters e Services

Este projeto usa uma separação simples para manter single-target, multi-target, armas, habilidades e rituais usando a mesma base de domínio.

## Convenção

- `Engine`: regra/orquestração de domínio do Paranormal Toolkit.
- `Adapter`: ponte com API do sistema Ordem Paranormal ou Foundry.
- `Service`: integração transversal, UI, debug, chat, settings, dados externos ou módulos opcionais.

A UI e os workflows não devem chamar APIs específicas do sistema diretamente quando existir uma engine para o caso.

## Fluxos alvo

```txt
Card / Workflow
  -> RitualCastingEngine
  -> ResistanceEngine
  -> DamageEngine
  -> ConditionEngine
```

Cada engine pode delegar para um adapter quando precisar falar com o sistema Ordem.

```txt
DamageEngine
  -> OrdemDamageAdapter
  -> actor.applyDamage do sistema

ResistanceEngine
  -> OrdemResistanceAdapter
  -> actor.rollSkill do sistema

RitualCastingEngine
  -> OrdemRitualCastingAdapter
  -> DT de ritual + actor.rollSkill("occultism")

ConditionEngine
  -> ConditionRegistry
  -> ActiveEffect no ator
```

## Estado atual

- `ConditionEngine` é a fonte de aplicação de condições e Active Effects.
- `DamageEngine` centraliza aplicação de dano e delega para `OrdemDamageAdapter`.
- `OrdemDamageAdapter` chama `actor.applyDamage`, preservando RD, tipo de dano e comportamento nativo do sistema.
- `ResistanceEngine` centraliza rolagens de resistência e delega para `OrdemResistanceAdapter`.
- `RitualCastingEngine` centraliza o teste de conjuração e delega para `OrdemRitualCastingAdapter`.
- Funções legadas dos adapters podem continuar exportadas durante transição, mas código novo deve preferir engines.

## Regra prática

Código de card deve cuidar de renderização e eventos de UI. Código de workflow deve coordenar a feature. Regra de domínio deve ficar nas engines. Integração com o sistema deve ficar nos adapters.

## Checagem de arquivos sem uso

Use:

```bash
npm run check:unused
```

Para falhar o processo quando houver candidatos:

```bash
npm run check:unused:strict
```

Essa checagem é estática e conservadora. Revise os candidatos antes de deletar.
