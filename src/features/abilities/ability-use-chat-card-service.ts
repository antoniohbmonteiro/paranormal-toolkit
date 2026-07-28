import { MODULE_ID } from "../../constants";
import { renderAbilityUseCard } from "../../ui/components/ability/ability-use-card";
import type { ItemUseContext } from "../item-use/item-use-context";
import { getItemUseSystemCardMode } from "../item-use/item-use-settings";
import { normalizeAbilityUseMessageFlag, type AbilityUseMessageFlagV3 } from "./ability-roll-chat-contract";
import { buildAbilityUseCardViewModel } from "./ability-use-card-view-model-builder";
import type { AbilityUseCardState } from "./ability-use-card-state";
type Message = { id?: unknown; getFlag?: (scope:string,key:string)=>unknown; update?: (data:Record<string,unknown>)=>Promise<unknown> };
export class AbilityUseChatCardService {
  async publish(context: ItemUseContext, state: AbilityUseCardState): Promise<void> {
    const content = renderAbilityUseCard(buildAbilityUseCardViewModel(state));
    const flag: AbilityUseMessageFlagV3 = { version: 3, state };
    const data = { speaker: ChatMessage.getSpeaker({ actor: context.actor ?? undefined }), content, flags: { [MODULE_ID]: { abilityUse: flag } } };
    const message = context.message as Message | null;
    if (getItemUseSystemCardMode() === "replace" && typeof message?.update === "function") { await message.update(data); return; }
    await ChatMessage.create(data);
  }
}
export function renderPersistedAbilityCard(message: Message, root: HTMLElement): boolean {
  const raw = message.getFlag?.(MODULE_ID, "abilityUse");
  if (!raw || typeof raw !== "object" || (raw as {version?:unknown}).version !== 3) return false;
  const flag = normalizeAbilityUseMessageFlag(raw);
  if (!flag || flag.version !== 3) { console.warn("Paranormal Toolkit: flag v3 de habilidade inválida; conteúdo preservado."); return false; }
  const host = root.classList.contains("message-content") ? root : root.querySelector<HTMLElement>(".message-content") ?? root;
  const existing = host.querySelector<HTMLElement>('[data-paranormal-toolkit-card-renderer="ability-result"]');
  const wrapper = existing?.closest<HTMLElement>(".paranormal-toolkit-chat-card-shell") ?? document.createElement("div");
  const html = renderAbilityUseCard(buildAbilityUseCardViewModel(flag.state));
  if (existing) wrapper.outerHTML = html;
  else { wrapper.innerHTML = html; if (getItemUseSystemCardMode() === "replace") host.replaceChildren(wrapper); else host.append(wrapper); }
  return true;
}
