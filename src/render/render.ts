import { toPromise } from "../util/async";
import type { Context } from "../context";
import type { Template } from "../template";
import type { Emitter } from "../emitters";
import { KeepingTypeEmitter, StreamedEmitter, SimpleEmitter } from "../emitters";
import { RenderError } from "../util/error";

export class Render {
  public renderTemplatesToNodeStream(templates: Template[], ctx: Context): NodeJS.ReadableStream {
    const emitter = new StreamedEmitter();
    Promise.resolve()
      .then(() => toPromise(this.renderTemplates(templates, ctx, emitter)))
      .then(
        () => emitter.end(),
        (err) => emitter.error(err),
      );
    return emitter.stream;
  }
  public *renderTemplates(templates: Template[], ctx: Context, emitter?: Emitter): IterableIterator<any> {
    if (!emitter) {
      emitter = ctx.opts.keepOutputType ? new KeepingTypeEmitter() : new SimpleEmitter();
    }
    for (const tpl of templates) {
      try {
        // if tpl.render supports emitter, it'll return empty `html`
        const html = yield tpl.render(ctx, emitter);
        // if not, it'll return an `html`, write to the emitter for it
        html && emitter.write(html);
        if (emitter["break" as keyof typeof emitter] || emitter["continue" as keyof typeof emitter]) break;
      } catch (e) {
        const err = RenderError.is(e) ? e : new RenderError(e as Error, tpl);
        throw err;
      }
    }
    return emitter.buffer;
  }
}
