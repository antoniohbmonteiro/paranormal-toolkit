# Paranormal Toolkit 0.28.2

Hotfix visual dos botões bloqueados por resistência no single-target.

## Correção

- Botão de dano single-target em estado `Role resistência` agora usa estilo realmente desabilitado.
- Botão de efeito single-target em estado `Role resistência` usa o mesmo tratamento visual.
- Remove hover/box-shadow de ação principal enquanto bloqueado.
- Adiciona `aria-disabled` no estado visual bloqueado.

## Motivo

Na 0.28.1 o label já indicava bloqueio, mas o botão ainda parecia clicável por causa do contraste, borda e aparência de ação principal.
