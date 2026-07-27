export interface ChatCardShellViewModel {
  /** Trusted HTML produced exclusively by internal Paranormal Toolkit renderers. */
  content: string;
}

/**
 * Wraps trusted internal component markup.
 * This contract does not accept arbitrary HTML supplied by a player or user.
 */
export function renderChatCardShell(model: ChatCardShellViewModel): string {
  return `<article class="paranormal-toolkit-chat-card-shell">${model.content}</article>`;
}
