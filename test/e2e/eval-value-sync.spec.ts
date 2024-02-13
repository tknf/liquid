import { Liquid } from "../../src/liquid";

describe("#evalValueSync()", function () {
  var engine: Liquid;
  beforeEach(() => {
    engine = new Liquid();
  });

  it("should eval value syncly", async function () {
    return expect(engine.evalValueSync("true", { opts: {} } as any)).toBe(true);
  });
});
