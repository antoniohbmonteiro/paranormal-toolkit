export class ActorResolver {
  static getSelectedActor(): Actor | null {
    const controlledTokens = canvas?.tokens?.controlled ?? [];
    const selectedToken = controlledTokens[0];

    return selectedToken?.actor ?? game.user?.character ?? null;
  }
}
