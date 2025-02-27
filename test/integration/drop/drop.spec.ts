import { Liquid, Drop } from "../../../src";
import { nodeFs } from "../../../src/node/fs";

describe("drop/drop", function () {
  let liquid: Liquid;
  beforeEach(function () {
    liquid = new Liquid({ fs: nodeFs });
  });

  class CustomDrop extends Drop {
    private name = "NAME";
    public getName() {
      return "GET NAME";
    }
  }
  class CustomDropWithMethodMissing extends CustomDrop {
    public liquidMethodMissing(key: string) {
      return key.toUpperCase();
    }
  }
  class PromiseDrop extends Drop {
    private name = Promise.resolve("NAME");
    public async getName() {
      return "GET NAME";
    }
    public async liquidMethodMissing(key: string) {
      return key.toUpperCase();
    }
  }
  it("should call corresponding method when output", async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new CustomDrop() });
    expect(html).toBe("GET NAME");
  });
  it("should call corresponding method when expression evaluates", async function () {
    const html = await liquid.parseAndRender(`{% if obj.getName == "GET NAME" %}true{% endif %}`, {
      obj: new CustomDrop(),
    });
    expect(html).toBe("true");
  });
  it("should read corresponding property", async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new CustomDrop() });
    expect(html).toBe("NAME");
  });
  it("should output empty string if not exist", async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDrop() });
    expect(html).toBe("");
  });
  it("should respect liquidMethodMissing", async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new CustomDropWithMethodMissing() });
    expect(html).toBe("FOO");
  });
  it("should call corresponding promise method", async function () {
    const html = await liquid.parseAndRender(`{{obj.getName}}`, { obj: new PromiseDrop() });
    expect(html).toBe("GET NAME");
  });
  it("should read corresponding promise property", async function () {
    const html = await liquid.parseAndRender(`{{obj.name}}`, { obj: new PromiseDrop() });
    expect(html).toBe("NAME");
  });
  it("should resolve before calling filters", async function () {
    const html = await liquid.parseAndRender(`{{obj.name | downcase}}`, { obj: new PromiseDrop() });
    expect(html).toBe("name");
  });
  it("should support promise returned by liquidMethodMissing", async function () {
    const html = await liquid.parseAndRender(`{{obj.foo}}`, { obj: new PromiseDrop() });
    expect(html).toBe("FOO");
  });
  it("should respect valueOf", async () => {
    class CustomDrop extends Drop {
      prop = "not enumerable";
      valueOf() {
        return ["foo", "bar"];
      }
    }
    const tpl = "{{drop}}: {% for field in drop %}{{ field }};{% endfor %}";
    const html = await liquid.parseAndRender(tpl, { drop: new CustomDrop() });
    expect(html).toBe("foobar: foo;bar;");
  });
  it("should support valueOf in == expression", async () => {
    class AddressDrop extends Drop {
      valueOf() {
        return "test";
      }
    }
    const address = new AddressDrop();
    const customer = { default_address: new AddressDrop() };
    const tpl = `{% if address == customer.default_address %}{{address}}{% endif %}`;
    const html = await liquid.parseAndRender(tpl, { address, customer });
    expect(html).toBe("test");
  });
});
