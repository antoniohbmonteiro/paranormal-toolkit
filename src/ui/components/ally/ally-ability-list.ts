import { escapeHtml as esc } from "../../rendering/escape-html";

export type AllyAbilityRow = {
  id: string; name: string; image?: string; execution?: string; cost?: string | null;
  usable?: boolean; useReason?: string | null; expanded?: boolean; descriptionHTML?: string;
};

export function renderAllyAbilityList(items: AllyAbilityRow[], options: { prefix: string; editable: boolean }): string {
  if (!items.length) return '<p class="ally-empty">Nenhuma habilidade adicionada.</p>';
  return `<ul class="ally-abilities">${items.map(item => {
    const id = esc(item.id), descriptionId = `${esc(options.prefix)}-description-${id}`;
    const reasonId = `${esc(options.prefix)}-reason-${id}`;
    return `<li class="ally-ability" data-ally-key="ability-${id}">
      <div class="ally-ability-row">
        <button type="button" class="ally-use" data-action="useAbility" data-item-id="${id}" aria-label="Usar ${esc(item.name)}" title="${esc(item.usable ? `Usar ${item.name}` : item.useReason ?? "Uso indisponível")}"${item.usable ? "" : " disabled"}>
          <img src="${esc(item.image || "icons/svg/mystery-man.svg")}" alt="" loading="lazy"><i class="fa-solid fa-dice-d20" aria-hidden="true"></i></button>
        <button type="button" class="ally-ability-name" data-action="toggleAbility" data-item-id="${id}" aria-expanded="${Boolean(item.expanded)}" aria-controls="${descriptionId}"${!item.usable && item.useReason ? ` aria-describedby="${reasonId}"` : ""}>
          <strong>${esc(item.name)}</strong>${item.execution || item.cost ? `<span>${esc([item.execution, item.cost].filter(Boolean).join(" · "))}</span>` : ""}
        </button>
        ${!item.usable && item.useReason ? `<span class="ally-sr-only" id="${reasonId}">${esc(item.useReason)}</span>` : ""}
        <button type="button" class="ally-edit-ability" data-action="openAbility" data-item-id="${id}" aria-label="${options.editable ? "Editar" : "Abrir"} ${esc(item.name)}" title="${options.editable ? "Editar" : "Abrir"} ficha da habilidade"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i></button>
        ${options.editable ? `<details class="ally-item-menu"><summary aria-label="Ações de ${esc(item.name)}" title="Ações da habilidade"><i class="fa-solid fa-ellipsis" aria-hidden="true"></i></summary>
          <div><button type="button" data-action="configureBenefits" data-item-id="${id}">Benefícios passivos</button>
          <button type="button" data-action="removeAbility" data-item-id="${id}">Remover habilidade</button></div></details>` : ""}
      </div>
      <div class="ally-ability-description" id="${descriptionId}"${item.expanded ? "" : " hidden"}>${item.expanded ? item.descriptionHTML || '<p class="ally-empty">Sem descrição.</p>' : ""}</div>
    </li>`;
  }).join("")}</ul>`;
}
