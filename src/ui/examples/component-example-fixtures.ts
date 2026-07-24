import type { ChatCardHeaderModel, ChatCardSectionTone, ChatRollDisplayModel, ChatStatusBannerModel } from "../components";

export const componentHeaderExamples: readonly ChatCardHeaderModel[] = [
  { image: { src: "icons/svg/upgrade.svg", alt: "Símbolo geométrico" }, eyebrow: "Habilidade fictícia", title: "Pulso Vetorial", subtitle: "Movimento experimental", badges: [] },
  { image: { src: null, fallbackSrc: "icons/svg/mystery-man.svg" }, eyebrow: "Preview", title: "Eco", badges: [{ label: "Único", tone: "info" }] },
  { eyebrow: "Ritual fictício", title: "Órbita Prismática", subtitle: "Uma demonstração sem regras reais", badges: [{ label: "Círculo alfa", tone: "accent" }, { label: "Cena", tone: "warning" }] },
  { eyebrow: "Equipamento fictício", title: "Lançador de Bruma", subtitle: "Categoria experimental", badges: [{ label: "Categoria Z", tone: "neutral" }] },
  { eyebrow: "Teste de largura", title: "Uma denominação deliberadamente extensa para observar quebras de linha", subtitle: "Subtítulo igualmente extenso, criado apenas para validar a composição visual em espaços reduzidos e sem qualquer regra de jogo.", badges: [{ label: "Alfa", tone: "success" }, { label: "Beta", tone: "resource" }, { label: "Gama", tone: "danger" }] },
];

export const componentSectionExamples: readonly { title: string; description: string; tone: ChatCardSectionTone; text: string }[] = (["generic", "test", "damage", "healing", "resistance"] as const).map((tone, index) => ({ title: `Seção ${tone}`, description: index === 4 ? "Descrição longa e inteiramente fictícia para examinar ritmo, contraste, alinhamento e quebra de linha no catálogo visual." : "Descrição breve de preview.", tone, text: `Conteúdo estático ${index + 1}.` }));

export const componentRollExamples: readonly ChatRollDisplayModel[] = [
  { label: "Pendente", formula: "2d8 + 3", tone: "test", action: { label: "Ação visual" } },
  { label: "Resolvido", formula: "1d6", total: 7, tone: "generic", dice: [{ value: "6", state: "active" }] },
  { formula: "12d12 + 12345 + 2d6", total: "123456", tone: "damage", dice: [{ value: "12", state: "active" }, { value: "2", state: "discarded" }, { value: "7", state: "neutral" }], action: { label: "Indisponível", disabled: true } },
  { formula: "1d4", total: 4, tone: "healing" }, { formula: "1d20", total: 19, tone: "resistance" },
];

export const componentStatusExamples: readonly ChatStatusBannerModel[] = (["success", "failure", "info", "resource", "warning", "manual"] as const).map((tone, index) => ({ tone, title: index % 2 ? undefined : `Estado ${tone}`, message: index === 5 ? "Mensagem longa de demonstração que explica um estado puramente visual sem acionar qualquer automação, documento ou fluxo real." : `Mensagem fictícia ${index + 1}.` }));
