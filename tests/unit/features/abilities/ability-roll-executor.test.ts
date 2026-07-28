import { beforeEach, describe, expect, it, vi } from "vitest";
const { animate } = vi.hoisted(() => ({ animate: vi.fn() }));
vi.mock("../../../../src/features/dice/dice-animation-service", () => ({ animateRollWithDiceSoNice: animate }));
import { executeAbilityRolls } from "../../../../src/features/abilities/ability-roll-executor";
const inputs = [
  { id:"one",sourceRollId:"one",label:"Ataque",intent:"generic" as const,damageType:null,formula:"1d20",nexThreshold:null },
  { id:"two",sourceRollId:"two",label:"Dano",intent:"damage" as const,damageType:"fear",formula:"2d6",nexThreshold:40 },
];
describe("executeAbilityRolls",()=>{
 beforeEach(()=>{ animate.mockReset(); });
 it("executes sequentially, animates and serializes results",async()=>{
  const order:string[]=[]; let index=0;
  class FakeRoll { total=0; dice:unknown[]=[]; constructor(readonly formula:string, readonly data:unknown){} async evaluate(){order.push(this.formula); this.total=++index*5; this.dice=[{results:[{result:index},{result:index+1}]}]; return this;} }
  vi.stubGlobal("Roll",FakeRoll); animate.mockImplementation(async(r:{formula:string})=>{order.push(`dsn:${r.formula}`)});
  const result=await executeAbilityRolls(inputs,{getRollData:()=>({bonus:2})} as unknown as Actor);
  expect(order).toEqual(["1d20","dsn:1d20","2d6","dsn:2d6"]);
  expect(result).toEqual([expect.objectContaining({total:5,diceResults:[1,2]}),expect.objectContaining({total:10,diceResults:[2,3],damageType:"fear"})]);
 });
 it("stops after the first technical failure",async()=>{
  const formulas:string[]=[]; class FakeRoll { total=1; constructor(readonly formula:string){} async evaluate(){formulas.push(this.formula); if(this.formula==="1d20")throw new Error("invalid"); return this;} }
  vi.stubGlobal("Roll",FakeRoll); await expect(executeAbilityRolls(inputs,{} as Actor)).rejects.toThrow("invalid"); expect(formulas).toEqual(["1d20"]); expect(animate).not.toHaveBeenCalled();
 });
});
