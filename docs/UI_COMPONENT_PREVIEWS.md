# Preview do ritual single-target (0.39.0)

A biblioteca visual da 0.39.0 é uma ferramenta interna de QA focada exclusivamente no card de ritual single-target. O header compartilhado continua derivado do card de habilidade; todo o corpo abaixo dele duplica temporariamente a anatomia e os valores visuais do card real de item-use. A consolidação com o card real ocorrerá somente durante sua migração futura.

Somente GM pode abrir, publicar ou limpar exemplos:

```js
game.modules.get("paranormal-toolkit")?.api?.uiExamples.openGallery();
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.postChatCards();
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.clearChatCards();
```

`postChatCards` publica um único ritual single-target fictício. Os defaults são `replaceExisting: true` e `whisperToGm: true`. O modo público deliberado continua disponível:

```js
await game.modules.get("paranormal-toolkit")?.api?.uiExamples.postChatCards({
  replaceExisting: false,
  whisperToGm: false,
});
```

A galeria mantém apenas estado local para seleção de fórmulas, conjuração, resistência, ação assistida e resistência do efeito. Ela não executa `Roll`, não acessa Actor, Item ou target, não gasta PE e não aplica dano ou efeito. Cards publicados têm controles desabilitados.

Mensagens usam exclusivamente `flags.paranormal-toolkit.uiExamples`, com versão `1`, tipo `component-example` e `batchId`. A limpeza consulta essa flag, sem alcançar cards reais.

Os stylesheets são registrados no `module.json` e confirmados no `init` pelo loader versionado do módulo. O pacote oficial inclui todo o diretório `styles`. Para QA runtime, confirme no Network que `styles/components/chat-card-components.css?v=0.39.0` retorna HTTP 200 e verifique a persistência após reload.

Nenhum card real foi migrado na 0.39.0. Os arquivos reais de item-use, resistência e ritual continuam como fonte de verdade intocada.
