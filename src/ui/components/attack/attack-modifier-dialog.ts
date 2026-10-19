import type { AttackModifierDialogModel } from "../../../features/attack-modifiers/attack-modifier-dialog-model";
import { escapeHtml as escape } from "../../rendering/escape-html";

export function renderAttackModifierDialog(model: AttackModifierDialogModel): string {
  const groups = model.groups.map(group => '<section class="paranormal-toolkit-ritual-cast__panel"><h3>' + escape(group.label)
    + '</h3><div class="paranormal-toolkit-attack-options">' + group.options.map(option =>
      '<label class="paranormal-toolkit-attack-option' + (option.disabled ? ' is-disabled' : '') + '">'
      + '<input type="checkbox" data-preset-id="' + escape(group.id) + '" data-option-id="' + escape(option.id) + '"'
      + (option.checked ? ' checked' : '') + (option.disabled ? ' disabled' : '') + '>'
      + '<span><strong>' + escape(option.label) + '</strong><small>' + escape(option.description) + '</small></span></label>').join("")
    + '</div></section>').join("");
  return '<header class="paranormal-toolkit-ritual-cast__header paranormal-toolkit-ability-use__header">'
    + '<img class="paranormal-toolkit-ability-use__image" src="' + escape(model.header.image) + '" alt="">'
    + '<div><p class="paranormal-toolkit-ritual-cast__eyebrow">Configurar ataque</p><h2>' + escape(model.header.title)
    + '</h2><p>' + escape(model.header.subtitle) + '</p></div></header>' + groups
    + '<section class="paranormal-toolkit-ritual-cast__panel"><h3>Resumo do ataque</h3><dl class="paranormal-toolkit-ritual-cast__summary">'
    + summary("Crítico original", model.baseCritical) + summary("Crítico resultante", model.critical)
    + summary("RD ignorada", model.penetration) + '</dl></section>'
    + '<section class="paranormal-toolkit-ritual-cast__panel"><h3>Custo</h3><dl class="paranormal-toolkit-ritual-cast__summary">'
    + summary("Custo adicional", model.cost) + summary("Recurso atual", model.current) + summary("Após o ataque", model.after)
    + '</dl>' + (model.error ? '<p class="paranormal-toolkit-ability-use__warning" role="alert">' + escape(model.error) + '</p>' : '') + '</section>'
    + '<footer class="paranormal-toolkit-ritual-cast__footer"><button type="button" data-action="cancel">Cancelar</button>'
    + '<button type="button" data-action="attack" class="paranormal-toolkit-ritual-cast__cast-button"'
    + (model.canConfirm ? '' : ' disabled') + '><i class="fa-solid fa-crosshairs"></i> Atacar</button></footer>';
}
function summary(label: string, value: string): string { return "<div><dt>" + escape(label) + "</dt><dd>" + escape(value) + "</dd></div>"; }
