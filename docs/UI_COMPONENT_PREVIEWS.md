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

## Carregamento dos estilos e diagnóstico

Os dois stylesheets permanecem declarados no `module.json` e também são confirmados no `init` pelo carregador de assets do módulo, usando a rota `modules/paranormal-toolkit/...` e um parâmetro de versão. A redundância é intencional: preserva a carga normal do manifesto e recupera instalações em que o manifesto carregado estava desatualizado, sem injetar regras CSS por TypeScript.

O pacote oficial copia todo o diretório `styles`, incluindo `styles/components`. Se um teste ainda exibir HTML sem estilo, verifique no Network do navegador se `chat-card-components.css` retorna HTTP 200 e confira se a instalação contém os arquivos e o `module.json` da mesma revisão.

## Warning de `renderChatMessage`

A investigação da 0.39.0 encontrou registros legados no próprio Toolkit, além de `renderChatMessageHTML`, em integrações reais de habilidade e item-use. Esses arquivos pertencem aos cards/workflows reais e permanecem fora do escopo desta versão, portanto não foram modificados nesta correção visual. O warning não deve ser atribuído aos componentes ou ao serviço de exemplos; a criação de uma `ChatMessage` apenas faz o Foundry disparar os hooks já registrados.
