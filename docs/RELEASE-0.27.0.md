# Paranormal Toolkit 0.27.0

Padronização inicial de engines especialistas.

## Mudanças

- Adiciona `DamageEngine`.
- Adiciona `ResistanceEngine`.
- Adiciona `RitualCastingEngine`.
- `OrdemResistanceAdapter` passa a existir como classe especializada, mantendo `rollOrdemResistance` como compatibilidade.
- `OrdemRitualCastingAdapter` passa a existir como classe especializada, mantendo `rollOrdemRitualCastingCheck` como compatibilidade.
- Card multi-target passa a usar `DamageEngine` e `ResistanceEngine`.
- `ToolkitServices` passa a expor `damage`, `resistance` e `ritualCasting` como engines.
- Adiciona documentação de arquitetura em `docs/ARCHITECTURE-ENGINES.md`.
- Adiciona `npm run check:unused` para listar possíveis arquivos TypeScript sem uso direto.

## Observação

`DamageEngine` ainda delega diretamente ao adapter, mas isso é proposital: ele vira a porta estável para single-target, multi-target, armas e habilidades.
