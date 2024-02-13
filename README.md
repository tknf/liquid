# @tknf-labs/liquid

This repository is a fork of LiquidJS by [harttle](https://github.com/harttle).
Modified to work in ESM environments such as Vite.

## Installation

Install from npm in Node.js:

```bash
npm install @tknf-labs/liquid
```

## How to Use

For more information on the functionality of liquidjs and how to use it in your project, please refer to the [documentation](https://liquidjs.com/index.html) of the fork source.

The only difference is that the `fs` option is required during initialization when loading in a Node.js environment.

```typescript
import { Liquid } from "@tknf-labs/liquid";
import * as fs from "@tknf-labs/liquid/node/fs";

const engine = new Liquid({ fs });
```


## Acknowledgements

This project builds on the incredible work done by Jun Yang and all contributors to the original LiquidJS project. We aim to complement their efforts by extending functionality for specific use cases.

