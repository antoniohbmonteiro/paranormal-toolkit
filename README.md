# Paranormal Toolkit

Kit de automações e qualidade de vida para mesas paranormais no Foundry VTT v14+.

> Projeto não-oficial e independente. Este módulo é pensado para ser compatível com o sistema não-oficial de Ordem Paranormal para Foundry VTT, cujo `game.system.id` esperado é `ordemparanormal`.

## Status

Versão inicial experimental: `v0.1.4`.

Esta primeira versão contém apenas a fundação do módulo:

- manifesto `module.json`;
- build ES Module em `dist/main.js`;
- fontes TypeScript em `src/`;
- detecção do sistema `ordemparanormal`;
- adapter inicial para isolar paths do sistema;
- logger interno;
- CSS inicial;
- chat card simples para gasto de PE via debug;
- API de debug organizada por domínio (`debug.actor.*`);
- resultado controlado para gasto de PE, sem exception para regra esperada como PE insuficiente.

## Requisitos

- Foundry VTT v14+
- Sistema alvo: `ordemparanormal`

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Rode o build:

```bash
npm run build
```

Ou rode em modo watch:

```bash
npm run dev
```

## Instalação local para desenvolvimento

Crie um link simbólico deste projeto dentro da pasta de módulos do Foundry:

```bash
ln -s /caminho/para/paranormal-toolkit /caminho/FoundryVTT/Data/modules/paranormal-toolkit
```

No Windows, em um terminal com permissão de administrador:

```powershell
mklink /D "C:\Users\SEU_USUARIO\AppData\Local\FoundryVTT\Data\modules\paranormal-toolkit" "C:\caminho\para\paranormal-toolkit"
```

Depois, ative o módulo no mundo do Foundry.


## Debug inicial

Com um token de Agente selecionado na cena, abra o console do Foundry e rode:

```js
ParanormalToolkit.debug.actor.logResources();
```

Isso deve imprimir um snapshot com:

- PV;
- SAN;
- PE;
- PD;
- DT de ritual.

Também dá para testar gasto de PE:

```js
await ParanormalToolkit.debug.actor.spendPE(1);
```

Esse comando deve reduzir o PE do ator selecionado e criar uma mensagem simples no chat. Se o ator não tiver PE suficiente, o módulo mostra um aviso controlado e não deixa o valor ficar negativo.

Os comandos antigos continuam funcionando como aliases temporários:

```js
ParanormalToolkit.debug.logSelectedActorResources();
await ParanormalToolkit.debug.spendSelectedActorPE(1);
```

Se nenhum token estiver selecionado, o módulo tenta usar o personagem vinculado ao usuário (`game.user.character`).

## Próximos passos planejados

### v0.1.x

- Ler recursos do ator: PV, SAN, PE e PD.
- Criar comandos internos para gastar PE/PD.
- Criar chat card simples de gasto de recurso.

### v0.2.x

- Automatizar melhorias/modificações de armas.
- Calcular categoria base, aumento por modificação e categoria final.
- Validar categoria final contra limites de patente/categoria.

### v0.3.x

- Automatizar conjuração de rituais.
- Calcular custo por círculo.
- Exibir DT, resistência, alvo, duração e área.
- Preparar integração com Active Effects V2 e Template Regions.

## Licença

Código sob licença MIT.

Não copie textos, artes, compêndios, assets ou conteúdo protegido de Ordem Paranormal. Este projeto não é oficial e não possui afiliação com os detentores da marca.
