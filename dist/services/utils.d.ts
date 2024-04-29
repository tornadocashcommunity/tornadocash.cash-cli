/// <reference types="node" />
/// <reference types="node" />
import { webcrypto } from 'crypto';
import BN from 'bn.js';
import type { BigNumberish } from 'ethers';
type bnInput = number | string | number[] | Uint8Array | Buffer | BN;
export declare const isNode: boolean;
export declare const crypto: webcrypto.Crypto;
export declare const chunk: <T>(arr: T[], size: number) => T[][];
export declare function sleep(ms: number): Promise<unknown>;
export declare function validateUrl(url: string, protocols?: string[]): boolean;
export declare function concatBytes(...arrays: Uint8Array[]): Uint8Array;
export declare function bufferToBytes(b: Buffer): Uint8Array;
export declare function bytesToBase64(bytes: Uint8Array): string;
export declare function base64ToBytes(base64: string): Uint8Array;
export declare function bytesToHex(bytes: Uint8Array): string;
export declare function hexToBytes(hexString: string): Uint8Array;
export declare function bytesToBN(bytes: Uint8Array): bigint;
export declare function bnToBytes(bigint: bigint | string): Uint8Array;
export declare function leBuff2Int(bytes: Uint8Array): BN;
export declare function leInt2Buff(bigint: bnInput | bigint): Uint8Array;
export declare function toFixedHex(numberish: BigNumberish, length?: number): string;
export declare function toFixedLength(string: string, length?: number): string;
export declare function rBigInt(nbytes?: number): bigint;
export declare function bigIntReplacer(key: any, value: any): any;
export declare function substring(str: string, length?: number): string;
export {};
