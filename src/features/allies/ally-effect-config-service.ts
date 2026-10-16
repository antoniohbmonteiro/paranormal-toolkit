import { MODULE_ID } from "../../constants";
import type { AllyEffectTemplate } from "../../core/allies/ally-passive-effect";
import { readEffectTemplate } from "../../core/allies/ally-passive-effect";
import { ALLY_PASSIVE_EFFECT_FLAG, canConfigureAllyEffects } from "./config/ally-ability-config";

export class AllyEffectConfigService {
  constructor(private readonly item: Item) {}
  private assertEdit(): void {
    if (!canConfigureAllyEffects(this.item)) throw new Error("Sem permissão para configurar esta habilidade.");
  }
  async create(template: AllyEffectTemplate): Promise<AllyEffectLike> {
    this.assertEdit();
    const parsed = readEffectTemplate(template);
    if (!parsed) throw new Error("Estrutura do efeito inválida ou incompatível com suporte.");
    const [effect] = await this.item.createEmbeddedDocuments("ActiveEffect", [{ ...parsed, transfer: false, disabled: false,
      flags: { [MODULE_ID]: { [ALLY_PASSIVE_EFFECT_FLAG]: { version: 1 } } } }]);
    if (!effect) throw new Error("Não foi possível criar o efeito.");
    return effect;
  }
  private supportEffect(id: string): AllyEffectLike {
    const effect = this.item.effects?.get(id);
    if (!effect?.getFlag(MODULE_ID, ALLY_PASSIVE_EFFECT_FLAG)) throw new Error("Benefício passivo não encontrado nesta habilidade.");
    return effect;
  }
  async open(id: string): Promise<void> {
    this.assertEdit(); await this.supportEffect(id).sheet.render({ force: true });
  }
  async remove(id: string): Promise<void> {
    this.assertEdit(); this.supportEffect(id);
    await this.item.deleteEmbeddedDocuments("ActiveEffect", [id]);
  }
}
