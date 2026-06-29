import { RitualCastApplication, type RitualCastApplicationInput } from "../../applications/ritual-cast-application";
import type { RitualCastOptions } from "./ritual-cast-options";

export type RitualCastDialogInput = RitualCastApplicationInput;

export async function requestRitualCastOptions(input: RitualCastDialogInput): Promise<RitualCastOptions | null> {
  return RitualCastApplication.request(input);
}
