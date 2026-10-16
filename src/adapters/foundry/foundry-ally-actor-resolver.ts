import { readAllyProfile, type AllyProfile } from "../../core/allies/ally-profile";
import { ALLY_TYPE } from "../../features/allies/config/ally-ability-config";

type SerializableSystem = { toObject?: (source?: boolean) => unknown };

export function readFoundryAllyProfile(actor: Actor): AllyProfile | null {
  try {
    const system = actor.system as SerializableSystem | null;
    // Validate persisted model data, independently of prepared instance properties.
    return readAllyProfile(typeof system?.toObject === "function" ? system.toObject(true) : system);
  } catch { return null; }
}

export function resolveFoundryAllyActor(origin: Actor): Actor | null {
  if (origin.type !== ALLY_TYPE) return null;
  const candidate = origin.isToken ? origin.token?.baseActor : origin;
  if (!candidate?.id || candidate.isToken || candidate.type !== ALLY_TYPE) return null;
  const actor = game.actors?.get?.(candidate.id);
  if (!actor || actor.isToken || actor.type !== ALLY_TYPE || !readFoundryAllyProfile(actor)) return null;
  if (candidate.uuid && actor.uuid !== candidate.uuid) return null;
  return actor;
}

function profileShape(value: unknown) {
  const data = value as Record<string, unknown> | null;
  return { schemaVersion: data?.schemaVersion, descriptionType: typeof data?.description, isDroneType: typeof data?.isDrone };
}

export function reportAllyActorResolution(origin: Actor): void {
  const candidate = origin.isToken ? origin.token?.baseActor : origin;
  const current = candidate?.id ? game.actors?.get?.(candidate.id) : undefined;
  const registeredModel = typeof CONFIG !== "undefined" ? CONFIG.Actor?.dataModels?.[ALLY_TYPE] : undefined;
  console.error("Paranormal Toolkit | Allies: origem inválida", {
    bundle: import.meta.url,
    origin: { uuid: origin.uuid, type: origin.type, isToken: Boolean(origin.isToken) },
    baseActor: origin.token?.baseActor?.uuid ?? null,
    worldActor: current?.uuid ?? null,
    originIsCurrentWorldActor: current === origin,
    model: origin.system?.constructor?.name,
    modelMatchesRegistration: typeof registeredModel === "function" ? origin.system instanceof registeredModel : null,
    instanceProfile: profileShape(origin.system),
    persistedProfile: profileShape(readFoundryAllyProfile(origin)),
    originalProfileValid: Boolean(candidate && readFoundryAllyProfile(candidate)),
    currentProfileValid: Boolean(current && readFoundryAllyProfile(current)),
  });
}
