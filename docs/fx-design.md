# Paranormal FX — Design inicial

Documento inicial para o módulo visual da suíte.

## Objetivo

O Paranormal FX deve ser um módulo separado para efeitos visuais, animações e sons.

Ele não deve conter regras de jogo. Regras e workflows pertencem ao Paranormal Toolkit ou ao sistema base.

## Dependências planejadas

Para a primeira versão:

```txt
Sequencer: obrigatório
JB2A gratuito: obrigatório
```

Motivo:

- Sequencer resolve execução, posicionamento e encadeamento de efeitos no canvas;
- JB2A gratuito fornece base inicial de assets animados;
- FX v0.1 deve ser opinativo e pequeno.

## Regra de assets

O Paranormal FX não deve empacotar assets do JB2A.

Ele deve apenas referenciar assets instalados pelo usuário.

Errado:

```txt
copiar assets do JB2A para dentro do nosso módulo
```

Certo:

```txt
referenciar arquivos do módulo JB2A instalado
```

## Integração com Toolkit

Fluxo desejado:

```txt
Toolkit executa workflow
↓
Toolkit emite evento/hook
↓
FX escuta evento
↓
FX escolhe preset
↓
FX toca animação via Sequencer
```

Exemplo conceitual:

```ts
Hooks.on("paranormal-toolkit.workflow.damageApplied", async (event) => {
  new Sequence()
    .effect()
    .file(event.preset.file)
    .atLocation(event.sourceToken)
    .stretchTo(event.targetToken)
    .play();
});
```

Esse código deve ficar no Paranormal FX, não no Toolkit.

## Eventos desejáveis do Toolkit

```ts
"paranormal-toolkit.workflow.started"
"paranormal-toolkit.workflow.completed"
"paranormal-toolkit.resource.spent"
"paranormal-toolkit.damage.applied"
"paranormal-toolkit.healing.applied"
"paranormal-toolkit.ritual.cast"
"paranormal-toolkit.weapon.attackRolled"
"paranormal-toolkit.weapon.damageRolled"
```

## Roadmap do FX

### FX v0.1

- requires: Sequencer;
- requires: JB2A gratuito;
- presets básicos para eventos do Toolkit;
- sem UI complexa;
- sem assets próprios.

### FX v0.2

- configuração simples de preset;
- escolha de efeito por tipo de evento;
- suporte inicial a som;
- fallback quando preset não existir.

### FX v1.0

- presets configuráveis por item/ritual/arma;
- integração mais rica com Toolkit;
- suporte opcional a JB2A Patreon;
- suporte a assets customizados do usuário;
- documentação de criação de presets.

## Fora de escopo do FX

- gasto de PE/PD;
- dano/cura;
- resistência;
- cálculo de categoria;
- regra de ritual;
- regra de arma.

Essas responsabilidades ficam no Toolkit ou no sistema base.
