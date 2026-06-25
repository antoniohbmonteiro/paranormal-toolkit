type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

declare const game: {
  system: {
    id: string;
  };
};

declare const ui: {
  notifications?: {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
  };
};

declare const Hooks: {
  once(hook: string, callback: (...args: unknown[]) => void): void;
  on(hook: string, callback: (...args: unknown[]) => void): void;
  callAll(hook: string, ...args: unknown[]): void;
};

declare const foundry: {
  utils: {
    getProperty(object: unknown, path: string): unknown;
  };
};

declare class Actor {
  system: Record<string, unknown>;
  update(data: Record<string, unknown>): Promise<this>;
}
