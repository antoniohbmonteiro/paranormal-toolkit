import { AbilityUseApplication } from "../../applications/ability-use-application";
import { MODULE_ID } from "../../constants";
import type { ResourceAdapter } from "../../core/resources/actor-resource";
import type { ResourceEngine } from "../../core/resources/resource-engine";
import type { ItemUseContext } from "../item-use/item-use-context";
import { resolveAbilityUseData } from "./ability-item-resolver";
import { AbilityUseChatCardService } from "./ability-use-chat-card";
import { finalizeAbilityRolls } from "./config/ability-roll-config";
import { executeAbilityRolls } from "./ability-roll-executor";
import { buildAbilityUseCardState } from "./ability-use-card-state-builder";
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
      rollChoices: ability.rollPreparation.choices,
    });

    if (!options) return { status: "cancelled" };

    const resolvedRolls = finalizeAbilityRolls(
      ability.rollPreparation,
      options.selectedNexThresholds,
    );
    if (!resolvedRolls) {
      return this.fail(
        "invalid-roll-options",
        "Selecione uma faixa de NEX válida para cada rolagem.",
      );
    }

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

    let executedRolls;
    try {
      executedRolls = await executeAbilityRolls(resolvedRolls, actor);
    } catch (cause) {
      const restored = await this.restoreSpentResource(
        ability,
        spentResource,
        resourceBefore,
        resourceAfter,
      );
      console.error(
        `${MODULE_ID} | Falha técnica em rolagem de habilidade.`,
        cause,
      );
      return this.fail(
        "roll-failed",
        restored
          ? "Não foi possível executar a rolagem da habilidade. O recurso gasto foi restaurado."
          : "Não foi possível executar a rolagem nem restaurar o recurso com segurança. Confira a ficha manualmente.",
      );
    }

    try {
      const descriptionHtml = await enrichAbilityDescription(ability);
      const cardState = buildAbilityUseCardState({
        ability,
        descriptionHtml,
        rolls: executedRolls,
        spentResource,
        resourceBefore,
        resourceAfter,
      });
      await this.chatCards.publish(context, cardState);
    } catch (cause) {
      const resourceRestored = await this.restoreSpentResource(
        ability,
        spentResource,
        resourceBefore,
        resourceAfter,
      );

      console.error(
        `${MODULE_ID} | Falha ao executar ou publicar habilidade.`,
        cause,
      );
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
    resourceAfter: number,
  ): Promise<boolean> {
    if (!spentResource) return true;

    try {
      const current = this.resourceAdapter.getResource(
        ability.actor,
        ability.resource,
      );
      if (!current.ok || current.value.value !== resourceAfter) return false;
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

async function enrichAbilityDescription(
  ability: AbilityUseData,
): Promise<string> {
  const description = ability.chatDescription || ability.description;
  if (!description) return "";
  const editor = resolveFoundryTextEditor();
  if (typeof editor?.enrichHTML !== "function") return description;
  return editor.enrichHTML(description, {
    relativeTo: ability.item,
    rollData:
      (ability.actor as { getRollData?: () => unknown }).getRollData?.() ?? {},
  });
}

function resolveFoundryTextEditor(): {
  enrichHTML?: (
    html: string,
    options?: Record<string, unknown>,
  ) => Promise<string>;
} | null {
  return (
    foundry as unknown as {
      applications?: {
        ux?: {
          TextEditor?: {
            implementation?: {
              enrichHTML?: (
                html: string,
                options?: Record<string, unknown>,
              ) => Promise<string>;
            };
          };
        };
      };
    }
  ).applications?.ux?.TextEditor?.implementation ?? null;
}
