import { createRequire } from "module";
import { uglify } from "rollup-plugin-uglify";
import typescript from "rollup-plugin-typescript2";
import replace from "rollup-plugin-replace";
import versionInjector from "rollup-plugin-version-injector";

const pkg = createRequire(import.meta.url)("./package.json");
const version = process.env.VERSION || pkg.version;
const sourcemap = true;
const banner = `/*
 * @tknf-labs/liquid@${version}, https://github.com/tknf/liquid
 * (c) 2016-${new Date().getFullYear()} harttle
 * (c) ${new Date().getFullYear()} TKNF LLC
 * Released under the MIT License.
 */`;
const treeshake = {
  propertyReadSideEffects: false,
};
const tsconfig = (target) => ({
  check: true,
  tsconfigOverride: {
    include: ["src"],
    exclude: ["test", "benchmark"],
    compilerOptions: {
      target,
      module: "ES2015",
      rootDir: "src",
    },
  },
});
const versionInjection = versionInjector({
  injectInComments: false,
  injectInTags: {
    fileRegexp: /\.(ts|js|html|css)$/,
    tagId: "VI",
    dateFormat: "mmmm d, yyyy HH:MM:ss",
  },
  packageJson: "./package.json",
  logLevel: "info",
  logger: console,
  exclude: [],
});
const input = "./src/index.ts";
const browserFS = {
  include: "./src/liquid-options.ts",
  delimiters: ["", ""],
  "./fs/fs-impl": "./browser/fs",
};
const browserStream = {
  include: "./src/emitters/index.ts",
  delimiters: ["", ""],
  "./streamed-emitter": "../browser/streamed-emitter",
};

const nodeCjs = {
  output: [
    {
      file: "dist/liquid.node.cjs.js",
      format: "cjs",
      banner,
    },
  ],
  external: ["path", "fs", "stream"],
  plugins: [versionInjection, typescript(tsconfig("ES2020"))],
  treeshake,
  input,
};

const nodeEsm = {
  output: [
    {
      file: "dist/liquid.node.esm.js",
      format: "esm",
      banner,
    },
  ],
  external: ["path", "fs", "stream"],
  plugins: [versionInjection, typescript(tsconfig("es6"))],
  treeshake,
  input,
};

const browserEsm = {
  output: [
    {
      file: "dist/liquid.browser.esm.js",
      format: "esm",
      banner,
    },
  ],
  external: ["path", "fs"],
  plugins: [versionInjection, replace(browserFS), replace(browserStream), typescript(tsconfig("es6"))],
  treeshake,
  input,
};

const browserUmd = {
  output: [
    {
      file: "dist/liquid.browser.umd.js",
      name: "liquidjs",
      format: "umd",
      sourcemap,
      banner,
    },
  ],
  plugins: [versionInjection, replace(browserFS), replace(browserStream), typescript(tsconfig("es5"))],
  treeshake,
  input,
};

const browserMin = {
  output: [
    {
      file: "dist/liquid.browser.min.js",
      name: "liquidjs",
      format: "umd",
      sourcemap,
      banner,
    },
  ],
  plugins: [versionInjection, replace(browserFS), replace(browserStream), typescript(tsconfig("es5")), uglify()],
  treeshake,
  input,
};

const nodeFsCjs = {
  input: "./src/node/fs.ts",
  output: [
    {
      file: "dist/node/fs.cjs.js",
      format: "cjs",
      banner,
    },
  ],
  plugins: [versionInjection, typescript(tsconfig("ES2020"))],
  treeshake,
};

const nodeFsEsm = {
  input: "./src/node/fs.ts",
  output: [
    {
      file: "dist/node/fs.esm.js",
      format: "esm",
      banner,
    },
  ],
  plugins: [versionInjection, typescript(tsconfig("es6"))],
  treeshake,
};

const bundles = [];
const env = process.env.BUNDLES || "";
if (env.includes("cjs")) bundles.push(nodeCjs, nodeFsCjs);
if (env.includes("esm")) bundles.push(nodeEsm, browserEsm, nodeFsEsm);
if (env.includes("umd")) bundles.push(browserUmd);
if (env.includes("min")) bundles.push(browserMin);
if (bundles.length === 0) bundles.push(nodeCjs, nodeEsm, browserEsm, browserUmd, browserMin, nodeFsCjs, nodeFsEsm);

export default bundles;
