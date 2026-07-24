Paranormal Toolkit 0.38.2

Esta entrega corrige os erros de typecheck do carregador de estilos introduzido na 0.38.1.

Aplicação:
1. Extraia o ZIP na raiz do repositório, substituindo os arquivos.
2. Execute: node .\_delivery\apply-0.38.2.mjs
3. Execute: npm run check
4. Execute: npm run check:unused
5. Remova a pasta _delivery antes do commit.

O script atualiza package-lock.json e docs/ROADMAP.md de forma idempotente.
