export type AttackTokenReference = {
  sceneId: string;
  tokenId: string;
  tokenUuid: string;
  actorUuid: string | null;
};

export type AttackPublishedEvent = {
  version: 1;
  actionId: string;
  messageId: string;
  userId: string;
  item: { uuid: string; name: string; type: "armament" };
  source: AttackTokenReference | null;
  target: AttackTokenReference | null;
  visibility: "public" | "private";
};
