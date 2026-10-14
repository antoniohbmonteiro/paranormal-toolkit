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
  deleteEmbeddedDocuments?: (embeddedName: string, ids: string[]) => Promise<unknown>;
};

type CanvasPointLike = {
  x: number;
  y: number;
};

type BoundsLike = CanvasPointLike & {
  width: number;
  height: number;
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
  z?: number | null;
};

type RegionShapeDataLike = Record<string, unknown> & {
  type: string;
};

type RegionDataLike = Record<string, unknown> & {
  name?: string;
  shapes?: RegionShapeDataLike[];
};

type RegionObjectLike = Record<string, unknown> & {
  id?: string | null;
  bounds?: BoundsLike | null;
  document?: RegionDocumentLike | null;
  delete?: () => Promise<unknown>;
};

type RegionPlacementCallbackArgsLike = {
  document: RegionDocumentLike;
  preview?: RegionObjectLike | null;
  shape?: RegionShapeDataLike | null;
};

type RegionPlacementCallbackLike = (args: RegionPlacementCallbackArgsLike) => void;

type RegionPlacementOptionsLike = {
  create?: boolean;
  allowRotation?: boolean;
  onChange?: RegionPlacementCallbackLike;
  onMove?: RegionPlacementCallbackLike;
  onRotate?: RegionPlacementCallbackLike;
};

type RegionDocumentLike = {
  id?: string | null;
  name?: string | null;
  bounds?: BoundsLike | null;
  shapes?: RegionShapeDataLike[];
  tokens?: ReadonlySet<unknown>;
  object?: RegionObjectLike | null;
  toObject?: () => RegionDataLike;
  delete?: () => Promise<unknown>;
};

type RegionLayerLike = {
  placeRegion(
    data: RegionDataLike,
    options?: RegionPlacementOptionsLike,
  ): Promise<RegionDocumentLike | RegionObjectLike | null>;
};

type TokenTargetOptionsLike = {
  user?: FoundryUserLike | null;
  releaseOthers?: boolean;
  groupSelection?: boolean;
};

type TokenLike = {
  baseActor?: Actor | null;
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
  setTarget?: (targeted: boolean, options?: TokenTargetOptionsLike) => void;
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
    testInsideRegion?: (region: RegionDocumentLike | RegionObjectLike, data?: Partial<ElevatedPointLike>) => boolean;
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
  getFlag?: (scope: string, key: string) => unknown;
  setFlag?: (scope: string, key: string, value: unknown) => Promise<unknown>;
  color?: string | null;
  isGM?: boolean;
  active?: boolean;
  character?: Actor | null;
  targets?: Set<TokenLike>;
  updateTokenTargets?: (targetIds: string[]) => void;
  broadcastActivity?: (activity: { targets?: string[] }) => void;
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
    version?: string;
  };
  release?: { version?: string };
  combats?: FoundryCollectionLike<AllyCombatLike>;
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
        quadtree?: {
          getObjects?: (bounds: BoundsLike) => Iterable<TokenLike> | ArrayLike<TokenLike>;
        };
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
  Actor: { documentClass: typeof Actor; dataModels: Record<string, typeof TypeDataModel> };
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

declare class TypeDataModel {
  static defineSchema(): Record<string, FoundryDataField>;
}

declare class FoundryDataField {
  constructor(options?: Record<string, unknown>);
}

declare class ActorSheetV2 extends ApplicationV2 {
  actor: Actor;
  isEditable: boolean;
  _prepareContext(options: Record<string, unknown>): Promise<object>;
  _onDropItem(event: DragEvent, item: Item): Promise<Item | null | undefined>;
}

declare const foundry: {
  documents: { JournalEntry: { create(data: Record<string, unknown>): Promise<AllyJournalLike | null> } };
  applications: {
    sheets: { ActorSheetV2: typeof ActorSheetV2 };
    apps: { DocumentSheetConfig: {
      registerSheet(documentClass: typeof Actor, scope: string, sheetClass: typeof ActorSheetV2, options: Record<string, unknown>): void;
    } };
    api: {
      ApplicationV2: typeof ApplicationV2;
      DialogV2: { confirm(options: Record<string, unknown>): Promise<boolean | null> };
    };
  };
  abstract: { TypeDataModel: typeof TypeDataModel };
  data: { fields: {
    NumberField: typeof FoundryDataField;
    HTMLField: typeof FoundryDataField;
    BooleanField: typeof FoundryDataField;
  } };
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
  _stats?: { lastModifiedBy?: string | null };
  id: string | null;
  uuid?: string | null;
  name: string;
  img: string;
  type: string;
  system: Record<string, unknown>;
  items: ItemCollectionLike;
  isToken?: boolean;
  effects?: { get(id: string): AllyEffectLike | undefined };
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<this>;
  token?: TokenLike | null;
  getActiveTokens?(): TokenLike[];
  canUserModify(user: FoundryUserLike, action: string): boolean;
  deleteEmbeddedDocuments(embeddedName: "Item", ids: string[]): Promise<Item[]>;
  deleteEmbeddedDocuments(embeddedName: "ActiveEffect", ids: string[], options?: Record<string, unknown>): Promise<unknown>;
  createEmbeddedDocuments(embeddedName: "Item", data: Record<string, unknown>[]): Promise<Item[]>;
  update(data: Record<string, unknown>): Promise<this>;
  createEmbeddedDocuments(embeddedName: "ActiveEffect", data: Record<string, unknown>[], options?: Record<string, unknown>): Promise<Array<{ id?: string | null }>>;
}

declare class Item {
  documentName: "Item";
  sheet: { render(options: Record<string, unknown>): Promise<unknown> | unknown };
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

type AllyEffectLike = {
  disabled: boolean; transfer: boolean;
  changes: { key: string; type: string; phase: string; priority: number; value: string }[];
  getFlag(scope: string, key: string): unknown;
};
type AllyCombatLike = {
  id: string; started: boolean; round: number | null; name?: string;
  combatants: { contents?: { actorId?: string; actor?: Actor | null }[] };
};
type AllyJournalLike = {
  documentName: string; uuid: string;
  testUserPermission(user: FoundryUserLike, level: string): boolean;
  getFlag(scope: string, key: string): unknown;
  setFlag(scope: string, key: string, value: unknown): Promise<unknown>;
};

declare global {
  // eslint-disable-next-line no-var
  var ParanormalToolkit: unknown;
}
