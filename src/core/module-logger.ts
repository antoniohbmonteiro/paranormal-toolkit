import { MODULE_ID } from "../constants";

export class ModuleLogger {
  static info(message: string, ...args: unknown[]): void {
    console.log(`${MODULE_ID} | ${message}`, ...args);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`${MODULE_ID} | ${message}`, ...args);
  }

  static error(message: string, ...args: unknown[]): void {
    console.error(`${MODULE_ID} | ${message}`, ...args);
  }
}
