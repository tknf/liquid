export async function exists(filepath: string): Promise<boolean> {
  return false;
}
export function readFile(filepath: string): Promise<string> {
  throw new Error("Not implemented");
}
export function existsSync(filepath: string): boolean {
  throw new Error("Not implemented");
}
export function readFileSync(filepath: string): string {
  throw new Error("Not implemented");
}
export function resolve(root: string, file: string, ext: string): string {
  throw new Error("Not implemented");
}
export function fallback(file: string): string {
  throw new Error("Not implemented");
}
export function dirname(filepath: string): string {
  throw new Error("Not implemented");
}
export function contains(root: string, file: string): boolean {
  return true;
}

export const sep = "/";
