import { SUPPORTED_SYSTEM_ID } from "../constants";

export class SystemGuard {
  static isSupportedSystem(): boolean {
    return game.system.id === SUPPORTED_SYSTEM_ID;
  }

  static getCurrentSystemId(): string {
    return game.system.id;
  }
}
