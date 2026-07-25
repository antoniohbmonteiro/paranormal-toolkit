import { expect, it } from "vitest";
import { ritualSingleTargetPendingFixture, ritualSingleTargetResolvedFixture } from "../../../../src/ui/examples/component-example-fixtures";
it("fornece estados pending e resolved do ritual single-target",()=>{expect(ritualSingleTargetPendingFixture.damage.resistance.state).toBe("pending");expect(ritualSingleTargetResolvedFixture.damage.resistance.state).toBe("failure");expect(ritualSingleTargetResolvedFixture.damage.resistance.total).toBe(17)});
