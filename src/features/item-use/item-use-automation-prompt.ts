import { MODULE_ID } from "../../constants";
import type { AutomationExecutionMode } from "./item-use-execution-mode";
import type { ItemUseContext } from "./item-use-context";

const PENDING_ID_ATTRIBUTE = "data-paranormal-toolkit-pending-id";
const BUTTON_SELECTOR = `[${PENDING_ID_ATTRIBUTE}]`;

export type ItemUseAutomationPromptInput = {
  pendingId: string;
  context: ItemUseContext;
  mode: Extract<AutomationExecutionMode, "buttons">;
};

export type ItemUseAutomationPromptHandler = (pendingId: string) => Promise<boolean>;

let promptRendererRegistered = false;

export function registerItemUseAutomationPromptRenderer(handler: ItemUseAutomationPromptHandler): void {
  if (promptRendererRegistered) return;

  Hooks.on("renderChatMessageHTML", (_message: unknown, html: unknown) => {
    bindPromptButtons(html, handler);
  });

  promptRendererRegistered = true;
}

export async function createItemUseAutomationPromptMessage(input: ItemUseAutomationPromptInput): Promise<void> {
  const speaker = input.context.actor ? ChatMessage.getSpeaker({ actor: input.context.actor }) : undefined;

  await ChatMessage.create({
    speaker,
    content: createPromptContent(input),
    flags: {
      [MODULE_ID]: {
        itemUseAutomationPrompt: {
          pendingId: input.pendingId,
          itemId: input.context.item.id ?? null,
          itemName: input.context.item.name ?? "Item sem nome",
          source: input.context.source,
          mode: input.mode
        }
      }
    }
  });
}

function bindPromptButtons(html: unknown, handler: ItemUseAutomationPromptHandler): void {
  const root = resolveRootElement(html);
  if (!root) return;

  const buttons = root.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR);

  for (const button of buttons) {
    if (button.dataset.paranormalToolkitBound === "true") continue;

    button.dataset.paranormalToolkitBound = "true";
    button.addEventListener("click", () => {
      void handleButtonClick(button, handler);
    });
  }
}

async function handleButtonClick(button: HTMLButtonElement, handler: ItemUseAutomationPromptHandler): Promise<void> {
  const pendingId = button.getAttribute(PENDING_ID_ATTRIBUTE);

  if (!pendingId) return;

  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Executando...";

  const executed = await handler(pendingId);

  if (executed) {
    button.textContent = "Executado";
    return;
  }

  button.disabled = false;
  button.textContent = originalText;
}

function createPromptContent(input: ItemUseAutomationPromptInput): string {
  const itemName = escapeHtml(input.context.item.name ?? "Item sem nome");
  const targetText = input.context.targets.length > 0
    ? escapeHtml(input.context.targets.map((target) => target.name).join(", "))
    : "Nenhum alvo selecionado";

  return `
<section class="${MODULE_ID}-item-use-prompt">
  <strong>Paranormal Toolkit</strong>
  <p>Automação disponível para <strong>${itemName}</strong>.</p>
  <p><span>Alvos:</span> ${targetText}</p>
  <button type="button" ${PENDING_ID_ATTRIBUTE}="${escapeAttribute(input.pendingId)}">
    Executar automação
  </button>
</section>
`.trim();
}

function resolveRootElement(html: unknown): HTMLElement | null {
  if (html instanceof HTMLElement) {
    return html;
  }

  if (html && typeof html === "object") {
    const maybeArrayLike = html as { 0?: unknown };

    if (maybeArrayLike[0] instanceof HTMLElement) {
      return maybeArrayLike[0];
    }
  }

  return null;
}

function escapeHtml(value: string): string {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', "&quot;");
}
