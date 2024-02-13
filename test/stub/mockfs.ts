import { isString, forOwn } from "../../src/util/underscore";
import { nodeFs as fs } from "../../src/node/fs";
import { resolve } from "path";

interface FileDescriptor {
  mode: string;
  content: string;
}

let files: { [path: string]: FileDescriptor } = {};
const { readFile, exists, readFileSync, existsSync } = fs;

export function mock(options: { [path: string]: string | FileDescriptor }) {
  forOwn(options, (val, key) => {
    files[resolve(key)] = isString(val) ? { mode: "33188", content: val } : (val as FileDescriptor);
  });
  Object.assign(fs, {
    readFileSync: function (path: string) {
      const file = files[path];
      if (file === undefined) throw new Error("ENOENT");
      if (file.mode === "0000") throw new Error("EACCES");
      return file.content;
    },
    existsSync: function (path: string) {
      return !!files[path];
    },
    readFile: async function (path: string) {
      return fs.readFileSync(path);
    },
    exists: async function (path: string) {
      return fs.existsSync(path);
    },
  });
}

export function restore() {
  files = {};

  Object.assign(fs, {
    readFileSync,
    existsSync,
    readFile,
    exists,
  });
}
