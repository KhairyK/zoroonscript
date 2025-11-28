/**
 * ZoroonScript (ZS) Runtime & Transpiler Type Declarations
 * Author: Sholehuddin Khairy
 * License: MIT
 */

export interface ZSExports {
  [key: string]: unknown;
}

/**
 * Transpile ZoroonScript → JavaScript
 * @param code ZoroonScript source
 * @returns JavaScript output
 */
export function transpileZS(code: string): string;

/**
 * Execute ZoroonScript code in the browser
 * @param code ZoroonScript source
 * @returns record object of exported variables
 */
export function runZS(code: string): Promise<ZSExports>;

/**
 * Internal import function for ZS module system
 */
export function __ZS_IMPORT__(path: string, namespace: string): Promise<ZSExports>;

/**
 * Internal ZS module cache
 */
export const __ZS_MODULES__: Record<string, ZSExports>;

/**
 * Internal ZS exports buffer
 */
export const __ZS_EXPORTS__: unknown[];

/**
 * Type augmentation for global window API
 */
declare global {
  interface Window {
    runZS: typeof runZS;
  }
}
declare module "zoroon-script";

export default runZS;
