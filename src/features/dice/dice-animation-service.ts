import { ModuleLogger } from "../../core/module-logger";
import { getDiceAnimationSettings } from "./dice-animation-settings";

const DICE_SO_NICE_MODULE_ID = "dice-so-nice";

type Dice3DApi = {
  showForRoll?: (roll: Roll, user?: unknown, synchronize?: boolean, whisper?: unknown, blind?: boolean) => Promise<unknown> | unknown;
};

type GameModuleCollectionLike = {
  get?: (id: string) => { active?: boolean } | undefined;
};

export async function animateRollWithDiceSoNice(roll: Roll): Promise<void> {
  if (!areDiceAnimationsEnabled()) return;
  if (!isDiceSoNiceActive()) return;

  const dice3d = getDice3DApi();

  if (!dice3d?.showForRoll) return;

  try {
    await Promise.resolve(dice3d.showForRoll(roll, game.user, true));
  } catch (cause) {
    ModuleLogger.warn("Não foi possível animar a rolagem com Dice So Nice.", cause);
  }
}

function areDiceAnimationsEnabled(): boolean {
  try {
    return getDiceAnimationSettings().enabled;
  } catch {
    return false;
  }
}

function isDiceSoNiceActive(): boolean {
  const modules = (game as typeof game & { modules?: GameModuleCollectionLike }).modules;
  return modules?.get?.(DICE_SO_NICE_MODULE_ID)?.active === true;
}

function getDice3DApi(): Dice3DApi | null {
  const gameWithDice = game as typeof game & { dice3d?: unknown };
  const dice3d = gameWithDice.dice3d;

  if (!dice3d || typeof dice3d !== "object") return null;

  return dice3d as Dice3DApi;
}
