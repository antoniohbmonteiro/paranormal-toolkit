import type { ItemUseContext } from "./item-use-context";

type DialogV2ConfirmOptions = {
  window?: {
    title?: string;
  };
  content?: string;
  modal?: boolean;
  yes?: {
    label?: string;
  };
  no?: {
    label?: string;
  };
};

type DialogV2Api = {
  confirm?: (options: DialogV2ConfirmOptions) => boolean | Promise<boolean>;
};

type FoundryApplicationsApi = {
  applications?: {
    api?: {
      DialogV2?: DialogV2Api;
    };
  };
};

export async function confirmItemUseAutomationExecution(context: ItemUseContext): Promise<boolean> {
  const itemName = context.item.name ?? "Item sem nome";
  const title = "Executar automação?";
  const content = `<p>Executar a automação do Paranormal Toolkit para <strong>${escapeHtml(itemName)}</strong>?</p>`;

  const dialogResult = await confirmWithDialogV2(title, content);

  if (dialogResult !== null) {
    return dialogResult;
  }

  const browserConfirm = globalThis.confirm;

  if (typeof browserConfirm === "function") {
    return browserConfirm(`Executar a automação do Paranormal Toolkit para ${itemName}?`);
  }

  return false;
}

async function confirmWithDialogV2(title: string, content: string): Promise<boolean | null> {
  const foundryObject = (globalThis as { foundry?: FoundryApplicationsApi }).foundry;
  const dialog = foundryObject?.applications?.api?.DialogV2;

  if (typeof dialog?.confirm !== "function") {
    return null;
  }

  return Boolean(
    await dialog.confirm({
      window: { title },
      content,
      modal: true,
      yes: { label: "Executar" },
      no: { label: "Cancelar" }
    })
  );
}

function escapeHtml(value: string): string {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}
