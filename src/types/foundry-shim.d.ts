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

type CanvasPointLike = {
  x: number;
  y: number;
};

type CanvasStageLike = {
  toLocal(point: CanvasPointLike): CanvasPointLike;
};

type CanvasAppLike = {
  view?: unknown;
  canvas?: unknown;
  renderer?: {
    view?: unknown;
  };
};

type ElevatedPointLike = CanvasPointLike & {
  elevation?: number | null;
};

type RegionShapeDataLike = Record<string, unknown> & {
  type: string;
};

type RegionDataLike = Record<string, unknown> & {
  name?: string;
  shapes?: RegionShapeDataLike[];
};

type RegionPlacementOptionsLike = {
  create?: boolean;
};

type RegionDocumentLike = {
  id?: string | null;
  name?: string | null;
  tokens?: ReadonlySet<unknown>;
  testPoint?: (point: ElevatedPointLike) => boolean;
  delete?: () => Promise<unknown>;
};

type RegionLayerLike = {
  placeRegion(
    data: RegionDataLike,
    options?: RegionPlacementOptionsLike,
  ): Promise<RegionDocumentLike | null>;
};

type TokenLike = {
  id?: string | null;
  uuid?: string | null;
  name?: string;
  actor?: Actor | null;
  scene?: SceneLike | null;
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  center?: CanvasPointLike | null;
  w?: number | null;
  h?: number | null;
  elevation?: number | null;
  document?: {
    id?: string | null;
    uuid?: string | null;
    actor?: Actor | null;
    name?: string | null;
    x?: number | null;
    y?: number | null;
    width?: number | null;
    height?: number | null;
    elevation?: number | null;
  } | null;
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

type FoundryUserLike = {
  id?: string;
  color?: string | null;
  isGM?: boolean;
  active?: boolean;
  character?: Actor | null;
  targets?: Set<TokenLike>;
};

type FoundryCollectionLike<T = unknown> = {
  contents?: T[];
  get?: (id: string) => T | undefined;
  find?: (predicate: (value: T) => boolean) => T | undefined;
  filter?: (predicate: (value: T) => boolean) => T[];
  forEach?: (callback: (value: T) => void) => void;
  values?: () => Iterable<T>;
  [Symbol.iterator]?: () => IterableIterator<T>;
};

type FoundryModuleLike = {
  active?: boolean;
};

declare const game: {
  system: {
    id: string;
  };
  user?: FoundryUserLike | null;
  users: FoundryUserLike[];
  actors: FoundryCollectionLike<Actor>;
  messages: FoundryCollectionLike<ChatMessageDocumentLike>;
  modules: Map<string, FoundryModuleLike>;
  settings: {
    register(namespace: string, key: string, data: GameSettingRegistrationData): void;
    get(namespace: string, key: string): unknown;
    set(namespace: string, key: string, value: unknown): Promise<unknown>;
  };
};

declare const canvas:
  | {
      ready?: boolean;
      scene?: SceneLike | null;
      stage?: CanvasStageLike;
      app?: CanvasAppLike;
      grid?: {
        size?: number | null;
      };
      tokens?: {
        controlled?: TokenLike[];
        placeables?: TokenLike[];
      };
      regions?: RegionLayerLike;
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
  once(hook: string, callback: (...args: any[]) => void): void;
  on(hook: string, callback: (...args: any[]) => void): void;
  callAll(hook: string, ...args: unknown[]): void;
};

declare const CONFIG: {
  Item?: {
    documentClass?: {
      prototype?: unknown;
    };
  };
};

type ChatMessageDocumentLike = {
  id?: string | null;
  content?: string;
  timestamp?: number;
  speaker?: { actor?: unknown };
  _stats?: { modifiedTime?: unknown };
  getFlag?: (scope: string, key: string) => unknown;
  setFlag?: (scope: string, key: string, value: unknown) => Promise<unknown> | unknown;
};

declare const ChatMessage: {
  create(data: ChatMessageCreateData): Promise<unknown>;
  getSpeaker(options: { actor?: Actor | null }): ChatSpeakerData;
};

declare class ApplicationV2 {
  static DEFAULT_OPTIONS: Record<string, unknown>;
  constructor(options?: Record<string, unknown>);
  render(options?: Record<string, unknown>): Promise<this> | this;
  close(options?: Record<string, unknown>): Promise<this> | this;
}

declare const foundry: {
  applications: {
    api: {
      ApplicationV2: typeof ApplicationV2;
    };
  };
  utils: {
    getProperty(object: unknown, path: string): unknown;
    randomID(): string;
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
  uuid?: string | null;
  name: string;
  type: string;
  system: Record<string, unknown>;
  items: ItemCollectionLike;
  token?: TokenLike | null;
  getActiveTokens?(): TokenLike[];
  update(data: Record<string, unknown>): Promise<this>;
  createEmbeddedDocuments(embeddedName: "ActiveEffect", data: Record<string, unknown>[]): Promise<Array<{ id?: string | null }>>;
}

declare class Item {
  id: string | null;
  name: string;
  type: string;
  uuid: string;
  system: Record<string, unknown>;
  parent: Actor | null;
  actor?: Actor | null;
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<this>;
  unsetFlag(scope: string, key: string): Promise<this>;
  update(data: Record<string, unknown>): Promise<this>;
}

declare global {
  // eslint-disable-next-line no-var
  var ParanormalToolkit: unknown;
}
