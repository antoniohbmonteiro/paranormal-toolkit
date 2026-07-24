import { MODULE_ID } from "../../../constants";

export function createField(
  labelText: string,
  control: HTMLElement,
): HTMLElement {
  const label = document.createElement("label");
  label.classList.add(`${MODULE_ID}-ability-roll-config__field`);
  const text = document.createElement("span");
  text.textContent = labelText;
  label.append(text, control);
  return label;
}

export function createTextInput(
  value: string,
  placeholder: string,
  editable: boolean,
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.placeholder = placeholder;
  input.disabled = !editable;
  return input;
}

export function createButton(
  label: string,
  iconClass: string,
  className?: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  if (className) button.classList.add(className);
  const icon = document.createElement("i");
  icon.className = iconClass;
  const text = document.createElement("span");
  text.textContent = label;
  button.append(icon, text);
  return button;
}

export function createIconButton(
  label: string,
  iconClass: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add(`${MODULE_ID}-ability-roll-config__icon-button`);
  button.title = label;
  button.setAttribute("aria-label", label);
  const icon = document.createElement("i");
  icon.className = iconClass;
  button.append(icon);
  return button;
}

export function createOption(
  value: string,
  label: string,
  selected = false,
): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  option.selected = selected;
  return option;
}
