// **DO NOT CHANGE THIS FILE**
//
// This file is generated by bin/character-gen.js
// bitmask character types to boost performance
export const TYPES = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 4, 4, 4, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 8, 0, 0, 0,
  0, 8, 0, 0, 0, 64, 0, 65, 0, 0, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 0, 0, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
];
export const WORD = 1;
export const OPERATOR = 2;
export const BLANK = 4;
export const QUOTE = 8;
export const INLINE_BLANK = 16;
export const NUMBER = 32;
export const SIGN = 64;
export const PUNCTUATION = 128;

export function isWord(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 128 ? !TYPES[code] : !!(TYPES[code] & WORD);
}
TYPES[160] =
  TYPES[5760] =
  TYPES[6158] =
  TYPES[8192] =
  TYPES[8193] =
  TYPES[8194] =
  TYPES[8195] =
  TYPES[8196] =
  TYPES[8197] =
  TYPES[8198] =
  TYPES[8199] =
  TYPES[8200] =
  TYPES[8201] =
  TYPES[8202] =
  TYPES[8232] =
  TYPES[8233] =
  TYPES[8239] =
  TYPES[8287] =
  TYPES[12288] =
    BLANK;
TYPES[8220] = TYPES[8221] = PUNCTUATION;
