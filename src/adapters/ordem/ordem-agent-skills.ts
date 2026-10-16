// Agent skill ids from the Ordem AgentData schema, with the system's pt-BR labels.
// freeSkill is excluded because its name is defined per Agent.
export const ORDEM_AGENT_SKILLS = [
  { id: "acrobatics", label: "Acrobacia" },
  { id: "animal", label: "Adestramento" },
  { id: "arts", label: "Artes" },
  { id: "athleticism", label: "Atletismo" },
  { id: "relevance", label: "Atualidades" },
  { id: "sciences", label: "Ciências" },
  { id: "crime", label: "Crime" },
  { id: "diplomacy", label: "Diplomacia" },
  { id: "deception", label: "Enganação" },
  { id: "resilience", label: "Fortitude" },
  { id: "stealth", label: "Furtividade" },
  { id: "initiative", label: "Iniciativa" },
  { id: "intimidation", label: "Intimidação" },
  { id: "intuition", label: "Intuição" },
  { id: "investigation", label: "Investigação" },
  { id: "fighting", label: "Luta" },
  { id: "medicine", label: "Medicina" },
  { id: "occultism", label: "Ocultismo" },
  { id: "perception", label: "Percepção" },
  { id: "driving", label: "Pilotagem" },
  { id: "aim", label: "Pontaria" },
  { id: "reflexes", label: "Reflexos" },
  { id: "religion", label: "Religião" },
  { id: "survival", label: "Sobrevivência" },
  { id: "tactics", label: "Tática" },
  { id: "technology", label: "Tecnologia" },
  { id: "will", label: "Vontade" }
] as const;

export type OrdemAgentSkillId = (typeof ORDEM_AGENT_SKILLS)[number]["id"];

export function isOrdemAgentSkillId(value: unknown): value is OrdemAgentSkillId {
  return ORDEM_AGENT_SKILLS.some(skill => skill.id === value);
}

export function ordemAgentSkillLabel(id: OrdemAgentSkillId): string {
  return ORDEM_AGENT_SKILLS.find(skill => skill.id === id)!.label;
}
