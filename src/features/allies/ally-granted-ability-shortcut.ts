import { findAllyShortcutGrant, grantSourceData, rollAllyGrantedItem } from "../../adapters/foundry/foundry-ally-item-adapter";
import { allyUsers, readAllySupportView, type AllySupportPresentation } from "../../adapters/foundry/foundry-ally-request-adapter";
import { electAllyExecutor } from "./ally-operation-authority";
import { AllyItemUseGateway, resolveGrantedItemEngine } from "../item-use/item-use-route";
import { getItemUseSettings } from "../item-use/item-use-settings";
import { resolveFoundryAllyActor } from "../../adapters/foundry/foundry-ally-actor-resolver";
import { getActorItems } from "../automation/actor-item-resolver";

export class AllyGrantedAbilityShortcut {
  onPendingChange?: (allyId: string) => void;
  constructor(private readonly gateway: AllyItemUseGateway) {}
  inspect(allyId: string, item: Item, support: AllySupportPresentation): { enabled: boolean; reason: string | null } {
    try {
      const target = this.resolve(allyId, item, support);
      return this.gateway.isNativeUsePending(target.actor.id!, target.item.id!)
        ? { enabled: false, reason: "Uso em andamento." } : { enabled: true, reason: null };
    }
    catch (error) { return { enabled: false, reason: error instanceof Error ? error.message : "Uso indisponível." }; }
  }
  private resolve(allyId: string, item: Item, support: AllySupportPresentation) {
    if (support.status !== "active" || support.available === false) throw new Error("Ative o suporte escolhendo um beneficiário.");
    if (support.diagnostic?.startsWith("Reconciliação interrompida")) throw new Error(support.diagnostic);
    if (!electAllyExecutor(allyUsers())) throw new Error("Nenhum GM executor conectado.");
    if (getItemUseSettings().executionMode === "disabled") throw new Error("Uso de habilidades desativado nas configurações do Toolkit.");
    const target = findAllyShortcutGrant(allyId, item.id!);
    if (target.actor.id !== support.abilityRecipientId) throw new Error("O destinatário da habilidade mudou. Aguarde a sincronização.");
    if (!game.user || !target.actor.canUserModify(game.user, "update")) throw new Error("Você não possui permissão para usar o destinatário desta habilidade.");
    const data = grantSourceData(item);
    if (data.diagnostic) throw new Error(data.diagnostic);
    resolveGrantedItemEngine(item);
    return target;
  }
  async use(origin: Actor, itemId: string): Promise<void> {
    const ally = resolveFoundryAllyActor(origin);
    if (!ally) throw new Error("Aliado original ausente ou inválido.");
    const source = getActorItems(ally).find(item => item.id === itemId && item.type === "ability");
    if (!source) throw new Error("Habilidade original ausente.");
    const target = this.resolve(ally.id!, source, await readAllySupportView(ally));
    const pending = this.gateway.useNative(target.actor.id!, target.item.id!, () => rollAllyGrantedItem(target.item));
    this.onPendingChange?.(ally.id!);
    try { await pending; } finally { this.onPendingChange?.(ally.id!); }
  }
}
