import { Liquid } from "../../../src/liquid";

describe("tags/case", function () {
  const liquid = new Liquid();

  it("should reject if not closed", function () {
    const src = '{% case "foo"%}';
    return expect(liquid.parseAndRender(src)).rejects.toThrow(/{% case "foo"%} not closed/);
  });
  it("should hit the specified case", async function () {
    const src = '{% case "foo"%}' + '{% when "foo" %}foo{% when "bar"%}bar' + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("foo");
  });
  it("should resolve blank as empty string", async function () {
    const src = '{% case blank %}{% when ""%}bar{%endcase%}';
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("bar");
  });
  it("should resolve empty as empty string", async function () {
    const src = '{% case empty %}{% when ""%}bar{%endcase%}';
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("bar");
  });
  it("should accept empty string as branch name", async function () {
    const src = '{% case "" %}{% when ""%}bar{%endcase%}';
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("bar");
  });
  it("should support boolean case", async function () {
    const src = "{% case false %}" + '{% when "foo" %}foo{% when false%}bar' + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("bar");
  });
  it("should support else branch", async function () {
    const src = '{% case "a" %}' + '{% when "b" %}b{% when "c"%}c{%else %}d' + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("d");
  });
  describe("sync support", function () {
    it("should hit the specified case", function () {
      const src = '{% case "foo"%}' + '{% when "foo" %}foo{% when "bar"%}bar' + "{%endcase%}";
      const html = liquid.parseAndRenderSync(src);
      return expect(html).toBe("foo");
    });
    it("should support else branch", function () {
      const src = '{% case "a" %}' + '{% when "b" %}b{% when "c"%}c{%else %}d' + "{%endcase%}";
      const html = liquid.parseAndRenderSync(src);
      return expect(html).toBe("d");
    });
  });
  it("should support case with multiple values", async function () {
    const src = '{% case "b" %}' + '{% when "a", "b" %}foo' + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("foo");
  });
  it("should render multiple matching branches", async function () {
    const src = '{% case "b" %}' + '{% when "a", "b" %}first' + '{% when "b" %}second' + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("firstsecond");
  });
  it("should support case with multiple values separated by or", async function () {
    const src = "{% case 3 %}" + "{% when 1 or 2 or 3 %}1 or 2 or 3" + "{% else %}not 1 or 2 or 3" + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("1 or 2 or 3");
  });
  it("should support case with multiple strings separated by or", async function () {
    const src = '{% case "or" %}' + '{% when "and" or "or" %}and or or' + "{% else %}not and or or" + "{%endcase%}";
    const html = await liquid.parseAndRender(src);
    return expect(html).toBe("and or or");
  });
});
