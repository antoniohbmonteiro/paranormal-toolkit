import type { AttackModifierDialogModel } from "../../../features/attack-modifiers/attack-modifier-dialog-model";
import { escapeHtml as escape } from "../../rendering/escape-html";

export function renderAttackModifierDialog(model: AttackModifierDialogModel): string {
  const actions = model.generalActions.map(action => option(action.label, action.description,
    'data-general-action="' + action.id + '" data-control-id="general:' + action.id + '"', action.checked, action.disabled)).join("");
  const abilities = model.groups.map(group => option(group.label, group.disabled ? "Declare Mirar para usar esta habilidade." : "",
    attributes(group.id, group.primaryId), group.selected, group.disabled)).join("");
  const configurations = model.groups.filter(group => group.selected).map(group => panel(group.label,
    '<p class="paranormal-toolkit-attack-description">' + escape(group.description) + '</p>'
    + (group.allocation ? allocation(group.allocation) : '') + '<div class="paranormal-toolkit-attack-options">'
    + group.options.map(entry => option(entry.label, entry.description, attributes(group.id, entry.id), entry.checked, entry.disabled)).join("")
    + '</div>')).join("");
  return '<header class="paranormal-toolkit-ritual-cast__header paranormal-toolkit-ability-use__header">'
    + '<img class="paranormal-toolkit-ability-use__image" src="' + escape(model.header.image) + '" alt="">'
    + '<div><p class="paranormal-toolkit-ritual-cast__eyebrow">Configurar ataque</p><h2>' + escape(model.header.title)
    + '</h2><p>' + escape(model.header.subtitle) + '</p></div></header>'
    + '<div class="paranormal-toolkit-attack-body" data-attack-scroll>'
    + (actions ? panel("Ações gerais", '<div class="paranormal-toolkit-attack-actions">' + actions + '</div>') : '')
    + (abilities ? panel("Habilidades", '<div class="paranormal-toolkit-attack-abilities">' + abilities + '</div>') : '')
    + configurations
    + panel("Resumo do ataque", '<dl class="paranormal-toolkit-ritual-cast__summary">' + summary("Crítico", model.critical)
      + (model.penetration ? summary("RD ignorada", model.penetration) : '')
      + (model.attackDice ? summary("Dados de ataque", model.attackDice) : '')
      + (model.bonusDamage ? summary("Dano adicional", model.bonusDamage) : '') + '</dl>')
    + (model.attackBonus || model.damageBonus ? panel("Bônus fixos", '<dl class="paranormal-toolkit-ritual-cast__summary">'
      + (model.attackBonus ? summary("Ataque", model.attackBonus) : '')
      + (model.damageBonus ? summary("Dano", model.damageBonus) : '') + '</dl>') : '')
    + (model.cost ? panel("Custo", '<dl class="paranormal-toolkit-ritual-cast__summary paranormal-toolkit-attack-cost">'
      + summary("Custo adicional", model.cost.additional) + summary("Recurso", model.cost.balance) + '</dl>') : '')
    + (model.error ? '<p class="paranormal-toolkit-ability-use__warning" role="alert">' + escape(model.error) + '</p>' : '')
    + '</div><footer class="paranormal-toolkit-ritual-cast__footer"><button type="button" data-action="cancel">Cancelar</button>'
    + '<button type="button" data-action="attack" class="paranormal-toolkit-ritual-cast__cast-button"'
    + (model.canConfirm ? '' : ' disabled') + '><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Atacar</button></footer>';
}
function allocation(model: NonNullable<AttackModifierDialogModel["groups"][number]["allocation"]>): string {
  return '<p class="paranormal-toolkit-attack-description">' + escape(model.limit) + '</p><div class="paranormal-toolkit-attack-allocation">'
    + model.controls.map(control => '<div class="paranormal-toolkit-attack-stepper"><strong>' + escape(control.label)
      + '</strong><div>' + stepButton(control, -1, control.canDecrease)
      + '<output aria-live="polite">' + escape(control.value) + '</output>' + stepButton(control, 1, control.canIncrease) + '</div></div>').join('') + '</div>';
}
function stepButton(control: NonNullable<AttackModifierDialogModel["groups"][number]["allocation"]>["controls"][number], delta: number, enabled: boolean): string {
  return '<button type="button" data-special-field="' + control.field + '" data-delta="' + delta
    + '" data-control-id="special:' + control.field + ':' + delta + '" aria-label="'
    + (delta > 0 ? 'Aumentar ' : 'Diminuir ') + escape(control.label.toLowerCase()) + ' em 5"'
    + (enabled ? '' : ' disabled') + '>' + (delta > 0 ? '+' : '−') + '</button>';
}
function attributes(preset: string, id: string): string {
  return 'data-preset-id="' + escape(preset) + '" data-option-id="' + escape(id)
    + '" data-control-id="' + escape(preset + ':' + id) + '"';
}
function option(label: string, description: string, attributes: string, checked: boolean, disabled: boolean): string {
  return '<label class="paranormal-toolkit-attack-option' + (disabled ? ' is-disabled' : '') + '"><input type="checkbox" '
    + attributes + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span><strong>' + escape(label) + '</strong>'
    + (description ? '<small>' + escape(description) + '</small>' : '') + '</span></label>';
}
function panel(title: string, content: string): string {
  return '<section class="paranormal-toolkit-ritual-cast__panel"><h3>' + escape(title) + '</h3>' + content + '</section>';
}
function summary(label: string, value: string): string { return "<div><dt>" + escape(label) + "</dt><dd>" + escape(value) + "</dd></div>"; }
