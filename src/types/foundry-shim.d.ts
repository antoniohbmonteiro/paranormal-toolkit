type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type ChatSpeakerData = unknown;

type ChatMessageCreateData = {
  speaker?: ChatSpeakerData;
  content: string;
  flags?: Record<string, unknown>;
  whisper?: string[];
};

type SceneLike = {
  id?: string | null;
};

type TokenLike = {
  id?: string | null;
  uuid?: string | null;
  name?: string;
  actor?: Actor | null;
  scene?: SceneLike | null;
};

type ItemCollectionLike = Iterable<Item> | { contents?: unknown } | Item[];

type GameSettingBaseRegistrationData = {
  name: string;
  hint?: string;
  scope: "client" | "world";
  config: boolean;
};

type BooleanGameSettingRegistrationData = GameSettingBaseRegistrationData & {
  type: BooleanConstructor;
  default: boolean;
};

type StringGameSettingRegistrationData = GameSettingBaseRegistrationData & {
  type: StringConstructor;
  default: string;
  choices?: Record<string, string>;
};

type GameSettingRegistrationData = BooleanGameSettingRegistrationData | StringGameSettingRegistrationData;

declare const game: {
  system: {
    id: string;
  };
  user?: {
    id?: string;
    character?: Actor | null;
    targets?: Set<TokenLike>;
  } | null;
  users?: Array<{
    id?: string;
    isGM?: boolean;
    active?: boolean;
  }>;
  settings: {
    register(namespace: string, key: string, data: GameSettingRegistrationData): void;
    get(namespace: string, key: string): unknown;
    set(namespace: string, key: string, value: unknown): Promise<unknown>;
  };
};

declare const canvas:
  | {
      tokens?: {
        controlled?: TokenLike[];
      };
    }
  | undefined;

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

declare const CONFIG: {
  Item?: {
    documentClass?: {
      prototype?: unknown;
    };
  };
};

declare const ChatMessage: {
  create(data: ChatMessageCreateData): Promise<unknown>;
  getSpeaker(options: { actor?: Actor | null }): ChatSpeakerData;
};

declare const foundry: {
  utils: {
    getProperty(object: unknown, path: string): unknown;
  };
};

declare function fromUuid(uuid: string): Promise<unknown>;

declare class Roll {
  constructor(formula: string, data?: Record<string, unknown>);
  formula: string;
  total: number | null;
  evaluate(options?: Record<string, unknown>): Roll | Promise<Roll>;
}

declare class Actor {
  id: string | null;
  name: string;
  type: string;
  system: Record<string, unknown>;
  items: ItemCollectionLike;
  token?: TokenLike | null;
  getActiveTokens?(): TokenLike[];
  update(data: Record<string, unknown>): Promise<this>;
}

declare class Item {
  id: string | null;
  name: string;
  type: string;
  uuid: string;
  parent: Actor | null;
  actor?: Actor | null;
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<this>;
  unsetFlag(scope: string, key: string): Promise<this>;
}

declare global {
  // eslint-disable-next-line no-var
  var ParanormalToolkit: unknown;
}
