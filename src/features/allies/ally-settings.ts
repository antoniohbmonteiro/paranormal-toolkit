import { MODULE_ID } from "../../constants";

export const ALLY_PILOT_ABILITIES_SETTING = "allies.dronePilotAbilities";
export const ALLY_PILOT_ABILITIES_SETTING_KEY = `${MODULE_ID}.${ALLY_PILOT_ABILITIES_SETTING}`;

export function registerAllySettings(): void {
  game.settings.register(MODULE_ID, ALLY_PILOT_ABILITIES_SETTING, {
    name: "Homebrew: piloto utiliza habilidades do drone",
    hint: "Drones concedem suas habilidades somente ao piloto, que as utiliza e paga seus próprios PE/PD. Os benefícios passivos continuam no beneficiário. Sem piloto válido, as habilidades não são concedidas.",
    scope: "world", config: true, type: Boolean, default: false,
  });
}
export function getAllyPilotAbilitiesEnabled(): boolean {
  return game.settings.get(MODULE_ID, ALLY_PILOT_ABILITIES_SETTING) === true;
}
