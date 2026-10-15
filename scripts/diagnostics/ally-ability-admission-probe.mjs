// Read-only document observations; no flags, messages or requests are written.
export function installAllyAbilityAdmissionProbe() {
  const scope = "paranormal-toolkit";
  const records = [];
  const tracked = new Map();
  const creations = new Map();
  const listeners = [];
  const observe = (event, callback) => listeners.push([event, Hooks.on(event, callback)]);
  const path = (object, parts) => {
    if (!object || typeof object !== "object") return { found: false };
    for (let length = parts.length; length > 0; length--) {
      const key = parts.slice(0, length).join(".");
      if (!Object.hasOwn(object, key)) continue;
      return length === parts.length ? { found: true, value: object[key] } : path(object[key], parts.slice(length));
    }
    return { found: false };
  };
  const snapshot = (message, requesterId) => {
    const now = Date.now();
    const serverUptime = game.time?.serverTime;
    const createdTime = message?._stats?.createdTime;
    return {
      messageFound: Boolean(message),
      authorMatchesRequester: message?.author?.id === requesterId,
      authorIsGM: Boolean(message?.author?.isGM),
      createdTimeValid: Number.isFinite(createdTime),
      createdTimeType: typeof createdTime,
      clockValid: Number.isFinite(now),
      ageMs: Number.isFinite(now) && Number.isFinite(createdTime) ? now - createdTime : null,
      tooOld: Boolean(message && now - createdTime > 120_000),
      inFuture: Boolean(message && now < createdTime),
      legacyUptimeAgeMs: Number.isFinite(serverUptime) && Number.isFinite(createdTime) ? serverUptime - createdTime : null,
      hasReceipt: Boolean(message?.getFlag(scope, "allyExecutionReceipt")),
      hasBinding: Boolean(message?.getFlag(scope, "allyExecutionBinding")),
    };
  };
  const log = (phase, messageId, requesterId, extra = {}) => {
    const row = { phase, messageId, clientIsGM: Boolean(game.user?.isGM),
      requesterIsThisClient: requesterId === game.user?.id,
      ...snapshot(game.messages.get(messageId), requesterId), ...extra };
    records.push(row);
    if (records.length > 64) records.shift();
    console.info("Paranormal Toolkit | Ally admission probe", row);
  };
  const track = (id, requesterId) => {
    if (!tracked.has(id)) tracked.set(id, requesterId);
    if (tracked.size > 32) tracked.delete(tracked.keys().next().value);
  };
  observe("createChatMessage", (message, _options, userId) => {
    creations.set(message.id, { phase: "createChatMessage", messageId: message.id,
      clientIsGM: Boolean(game.user?.isGM), requesterIsThisClient: userId === game.user?.id,
      ...snapshot(message, userId) });
    if (creations.size > 32) creations.delete(creations.keys().next().value);
  });
  observe("ordemparanormal.itemUsed", payload => {
    if (payload?.item?.type !== "ability" || !payload.message?.id) return;
    const id = payload.message.id; track(id, game.user?.id);
    const created = creations.get(id);
    if (created) { records.push(created); console.info("Paranormal Toolkit | Ally admission probe", created); }
    log("ordemparanormal.itemUsed", id, game.user?.id);
  });
  observe("updateActor", (actor, changes, _options, userId) => {
    if (actor.type !== "agent" || actor.isToken) return;
    const changed = path(changes, ["flags", scope, "allyAbilityRequest", "id"]);
    if (!changed.found) return;
    const request = actor.getFlag(scope, "allyAbilityRequest");
    if (!request || request.id !== changed.value || typeof request.messageId !== "string") return;
    track(request.messageId, userId);
    const created = creations.get(request.messageId);
    if (created) { records.push(created); console.info("Paranormal Toolkit | Ally admission probe", created); creations.delete(request.messageId); }
    log("updateActor", request.messageId, userId, {
      requestAction: ["prepare", "execute", "cancel", "apply"].includes(request.action) ? request.action : "invalid",
      actorLastModifiedByMatchesHook: actor._stats?.lastModifiedBy === userId,
      actorIsWorldDocument: game.actors.get(actor.id) === actor,
    });
  });
  observe("updateChatMessage", (message, changes, _options, userId) => {
    if (!tracked.has(message.id)) return;
    log("updateChatMessage", message.id, tracked.get(message.id), {
      updatingUserIsThisClient: userId === game.user?.id,
      authorChanged: path(changes, ["author"]).found,
      receiptChanged: path(changes, ["flags", scope, "allyExecutionReceipt"]).found,
      bindingChanged: path(changes, ["flags", scope, "allyExecutionBinding"]).found,
    });
  });
  console.info("Paranormal Toolkit | Ally admission probe ativo (somente leitura)", {
    clockBasis: "unix-ms",
    toolkit: game.modules.get(scope)?.version,
    foundry: game.release?.version,
    system: game.system?.version,
  });
  return {
    report: () => structuredClone(records),
    stop() { for (const [event, id] of listeners) Hooks.off(event, id); listeners.length = 0; },
  };
}
