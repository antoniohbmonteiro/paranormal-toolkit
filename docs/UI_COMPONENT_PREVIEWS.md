# Previews dos componentes de UI (0.39.0)

Esta biblioteca visual é uma ferramenta **interna de desenvolvimento**. Ela permite comparar headers, seções, resultados, banners e cards inteiramente fictícios. Somente um usuário GM pode abrir a galeria, criar ou apagar suas mensagens; tentativas de outros usuários exibem um aviso e não alteram documentos.

## Console

```js
game.modules.get("paranormal-toolkit")?.api?.uiExamples.openGallery();
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.postChatCards();
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.clearChatCards();
```

Por padrão, `postChatCards` usa `replaceExisting: true` e `whisperToGm: true`. Para uma inspeção pública deliberada, ainda restrita a quem é GM:

```js
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.postChatCards({
  replaceExisting: false,
  whisperToGm: false,
});
```

Cada mensagem recebe exclusivamente `flags.paranormal-toolkit.uiExamples`, versão `1`, tipo `component-example` e um `batchId`. A limpeza consulta essa flag, não texto ou CSS, e portanto não alcança cards reais.

Os previews não executam rolagens, workflows, gastos, dano, cura ou efeitos. A 0.39.0 estabelece componentes e exemplos; a migração do card real de habilidade fica para 0.39.1+, e alterações reais do header de ritual para uma etapa posterior. Armas reais também permanecem intactas.
