import { AbilityUseApplication } from "../../applications/ability-use-application";
import { MODULE_ID } from "../../constants";
import type { ResourceAdapter } from "../../core/resources/actor-resource";
import type { ResourceEngine } from "../../core/resources/resource-engine";
import type { ItemUseContext } from "../item-use/item-use-context";
import { resolveAbilityUseData } from "./ability-item-resolver";
import { AbilityUseChatCardService } from "./ability-use-chat-card";
import type {
  AbilityUseData,
  AbilityUseResult,
} from "./ability-use-options";

export class AbilityUseWorkflow {
  constructor(
    private readonly resources: ResourceEngine,
    private readonly resourceAdapter: ResourceAdapter,
    private readonly chatCards = new AbilityUseChatCardService(),
  ) {}

  async run(context: ItemUseContext): Promise<AbilityUseResult> {
    const actor = context.actor;
    if (!actor) {
      return this.fail(
        "missing-actor",
        "Não foi possível identificar o personagem desta habilidade.",
      );
    }

    if (!canCurrentUserUseActor(actor)) {
      return this.fail(
        "missing-permission",
        "Você não possui permissão para usar esta habilidade.",
      );
    }

    const ability = resolveAbilityUseData(actor, context.item);
    const currentResourceResult = this.readCurrentResource(ability);

    if (!currentResourceResult.ok) {
      return this.fail(
        "resource-unavailable",
        currentResourceResult.message,
      );
    }

    const options = await AbilityUseApplication.request({
      abilityName: ability.name,
      abilityImage: ability.image,
      actorName: actor.name ?? "Personagem sem nome",
      activationLabel: ability.activationLabel,
      resource: ability.resource,
      cost: ability.cost,
      currentResource: currentResourceResult.value,
      passive: ability.passive,
    });

    if (!options) return { status: "cancelled" };

    let resourceBefore = currentResourceResult.value;
    let resourceAfter = resourceBefore;
    let spentResource = false;

    if (options.spendResource && ability.cost > 0) {
      const spendResult = await this.resources.spend(
        actor,
        ability.resource,
        ability.cost,
      );

      if (!spendResult.ok) {
        const reason =
          spendResult.error.reason === "insufficient-resource"
            ? "insufficient-resource"
            : "resource-update-failed";
        return this.fail(reason, spendResult.error.message);
      }

      resourceBefore = spendResult.value.before.value;
      resourceAfter = spendResult.value.after.value;
      spentResource = true;
    }

    try {
      await this.chatCards.publish(context, ability, {
        spentResource,
        resourceBefore,
        resourceAfter,
      });
    } catch (cause) {
      const resourceRestored = await this.restoreSpentResource(
        ability,
        spentResource,
        resourceBefore,
      );

      console.error(`${MODULE_ID} | Falha ao criar card de habilidade.`, cause);
      return this.fail(
        "chat-message-failed",
        resourceRestored
          ? "Não foi possível registrar o uso da habilidade no chat. O recurso gasto foi restaurado."
          : "Não foi possível registrar o uso da habilidade nem restaurar o recurso. Verifique a ficha manualmente.",
      );
    }

    return {
      status: "completed",
      spentResource,
      resource: ability.resource,
      cost: ability.cost,
    };
  }

  private readCurrentResource(
    ability: AbilityUseData,
  ): { ok: true; value: number } | { ok: false; message: string } {
    if (ability.passive || ability.cost <= 0) {
      return { ok: true, value: 0 };
    }

    const resourceRead = this.resourceAdapter.getResource(
      ability.actor,
      ability.resource,
    );

    if (!resourceRead.ok) {
      return { ok: false, message: resourceRead.error.message };
    }

    return { ok: true, value: resourceRead.value.value };
  }

  private async restoreSpentResource(
    ability: AbilityUseData,
    spentResource: boolean,
    resourceBefore: number,
  ): Promise<boolean> {
    if (!spentResource) return true;

    try {
      await this.resourceAdapter.updateResourceValue(
        ability.actor,
        ability.resource,
        resourceBefore,
      );
      return true;
    } catch (rollbackCause) {
      console.error(
        `${MODULE_ID} | Falha ao restaurar recurso após erro no card de habilidade.`,
        rollbackCause,
      );
      return false;
    }
  }

  private fail(
    reason: Extract<AbilityUseResult, { status: "failed" }>["reason"],
    message: string,
  ): AbilityUseResult {
    ui.notifications?.warn(message);
    return { status: "failed", reason, message };
  }
}


function canCurrentUserUseActor(actor: Actor): boolean {
  if (game.user?.isGM) return true;

  const candidate = actor as unknown as { isOwner?: unknown };
  return candidate.isOwner === true;
}
