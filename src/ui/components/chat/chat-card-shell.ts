export type ChatCardShellViewModel = {
  /** Trusted HTML produced by internal Paranormal Toolkit renderers only. */
  content: string;
};

/**
 * Wraps trusted component markup produced by internal Toolkit renderers.
 * Do not pass arbitrary or user-authored HTML to this renderer.
 */
export function renderChatCardShell(model: ChatCardShellViewModel): string {
  return `<article class="ptk-chat-card-shell">${model.content}</article>`;
}
