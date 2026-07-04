import type { DamageApplicationResult } from "../../../core/damage/damage-application";

export async function whisperDamageApplicationResultToGms(result: DamageApplicationResult): Promise<void> {
  const whisper = getGmUserIds();
  if (whisper.length === 0) return;

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor: result.actor }),
    whisper,
    content: createDamageApplicationWhisperContent(result),
  });
}

export function createDamageApplicationWhisperContent(result: DamageApplicationResult): string {
  const rows = result.instances
    .map((instance) => {
      const blocked = instance.blocked > 0 ? ` <span class="muted">(RD ${instance.blocked})</span>` : "";
      return `<li><strong>${escapeHtml(instance.label ?? "Dano")}</strong>: ${instance.inputAmount} → ${instance.finalDamage} PV${blocked}</li>`;
    })
    .join("");

  const totalRows = result.instances.length > 1
    ? `<li><strong>Total aplicado</strong>: ${result.totalFinalDamage} PV</li>`
    : "";
  const blockedRow = result.totalBlocked > 0
    ? `<li><strong>RD bloqueou</strong>: ${result.totalBlocked}</li>`
    : "";
  const pvRow = createDamageApplicationPvRow(result);
  const conditionsRow = result.conditions.length > 0
    ? `<li><strong>Condições sugeridas</strong>: ${escapeHtml(result.conditions.join(", "))}</li>`
    : "";

  return `
    <div class="paranormal-toolkit-damage-feedback">
      <strong>Paranormal Toolkit</strong>
      <p>Dano aplicado em <strong>${escapeHtml(result.actorName)}</strong></p>
      <ul>
        ${rows}
        ${totalRows}
        ${blockedRow}
        ${pvRow}
        ${conditionsRow}
      </ul>
    </div>
  `;
}

function createDamageApplicationPvRow(result: DamageApplicationResult): string {
  const snapshot = readActorPvSnapshot(result.actor);
  const current = result.newPV ?? snapshot?.value ?? null;
  const max = snapshot?.max ?? null;

  if (current === null) return "";

  const value = max === null ? `${current}` : `${current}/${max}`;
  return `<li><strong>PV atual</strong>: ${escapeHtml(value)}</li>`;
}

function readActorPvSnapshot(actor: Actor): { value: number; max: number | null } | null {
  const system = actor.system as {
    PV?: { value?: unknown; max?: unknown };
    attributes?: { hp?: { value?: unknown; max?: unknown } };
  };

  const resource = actor.type === "threat" ? system.attributes?.hp : system.PV;
  const value = readFiniteNumber(resource?.value);

  if (value === null) return null;

  return {
    value,
    max: readFiniteNumber(resource?.max),
  };
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getGmUserIds(): string[] {
  return game.users
    .filter((user) => user.isGM)
    .map((user) => user.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
}

function escapeHtml(value: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/gu, (char) => htmlEscapes[char] ?? char);
}
