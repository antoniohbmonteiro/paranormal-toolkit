export function resolveOrdemEffortResource(): "PE" | "PD" {
  return game.settings.get("ordemparanormal", "globalPlayingWithoutSanity") === true ? "PD" : "PE";
}
