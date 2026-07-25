export type ChatCardHeaderTone =
  | "neutral"
  | "blood"
  | "death"
  | "knowledge"
  | "energy"
  | "fear";

export type ChatCardHeaderViewModel = {
  imageUrl: string;
  imageAlt?: string;
  eyebrow: string;
  title: string;
  target: string;
  badge?: {
    label: string;
    tone: ChatCardHeaderTone;
  };
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

/** Renders visual-only header markup from prepared display strings. */
export function renderChatCardHeader(model: ChatCardHeaderViewModel): string {
  const imageUrl = model.imageUrl.trim();
  const image = imageUrl
    ? `<img class="ptk-chat-card-header__image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(model.imageAlt ?? "")}">`
    : `<span class="ptk-chat-card-header__image-placeholder" aria-hidden="true"></span>`;
  const badge = model.badge
    ? `<span class="ptk-chat-card-header__badge ptk-chat-card-header__badge--${model.badge.tone}">${escapeHtml(model.badge.label)}</span>`
    : "";

  return `<header class="ptk-chat-card-header">
  <div class="ptk-chat-card-header__media">${image}</div>
  <div class="ptk-chat-card-header__content">
    <div class="ptk-chat-card-header__top-row">
      <span class="ptk-chat-card-header__eyebrow">${escapeHtml(model.eyebrow)}</span>
      ${badge}
    </div>
    <h3 class="ptk-chat-card-header__title">${escapeHtml(model.title)}</h3>
    <p class="ptk-chat-card-header__target">${escapeHtml(model.target)}</p>
  </div>
</header>`;
}
