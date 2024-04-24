import type { Aggregator } from '@tornado/contracts';
import type { RelayerStructOutput } from '@tornado/contracts/dist/contracts/Governance/Aggregator/Aggregator';
import type { Config } from './networkConfig';
import { fetchDataOptions } from './providers';
import type { snarkProofs } from './websnark';
export declare const MIN_STAKE_BALANCE: bigint;
export interface RelayerParams {
    ensName: string;
    relayerAddress?: string;
}
export interface Relayer {
    netId: number;
    url: string;
    rewardAccount: string;
    currentQueue: number;
    tornadoServiceFee: number;
}
export type RelayerInfo = Relayer & {
    hostname: string;
    ensName: string;
    stakeBalance: bigint;
    relayerAddress: string;
    ethPrices?: {
        [key in string]: string;
    };
};
export type RelayerError = {
    hostname: string;
    relayerAddress?: string;
    errorMessage?: string;
};
export interface RelayerStatus {
    url: string;
    rewardAccount: string;
    instances: {
        [key in string]: {
            instanceAddress: {
                [key in string]: string;
            };
            tokenAddress?: string;
            symbol: string;
            decimals: number;
        };
    };
    gasPrices?: {
        fast: number;
        additionalProperties?: number;
    };
    netId: number;
    ethPrices?: {
        [key in string]: string;
    };
    tornadoServiceFee: number;
    latestBlock?: number;
    version: string;
    health: {
        status: string;
        error: string;
        errorsLog: any[];
    };
    currentQueue: number;
}
export interface RelayerTornadoWithdraw {
    id?: string;
    error?: string;
}
export interface RelayerTornadoJobs {
    error?: string;
    id: string;
    type?: string;
    status: string;
    contract?: string;
    proof?: string;
    args?: string[];
    txHash?: string;
    confirmations?: number;
    failedReason?: string;
}
export interface semanticVersion {
    major: string;
    minor: string;
    patch: string;
    prerelease?: string;
    buildmetadata?: string;
}
export declare function parseSemanticVersion(version: string): semanticVersion;
export declare function isRelayerUpdated(relayerVersion: string, netId: number | string): boolean;
export declare function calculateScore({ stakeBalance, tornadoServiceFee }: RelayerInfo, minFee?: number, maxFee?: number): bigint;
export declare function getWeightRandom(weightsScores: bigint[], random: bigint): number;
export declare function pickWeightedRandomRelayer(relayers: RelayerInfo[], netId: string | number): RelayerInfo;
export interface RelayerClientConstructor {
    netId: number | string;
    config: Config;
    Aggregator: Aggregator;
    fetchDataOptions?: fetchDataOptions;
}
export type RelayerClientWithdraw = snarkProofs & {
    contract: string;
};
export declare class RelayerClient {
    netId: number;
    config: Config;
    Aggregator: Aggregator;
    selectedRelayer?: Relayer;
    fetchDataOptions?: fetchDataOptions;
    constructor({ netId, config, Aggregator, fetchDataOptions }: RelayerClientConstructor);
    askRelayerStatus({ hostname, relayerAddress, }: {
        hostname: string;
        relayerAddress?: string;
    }): Promise<RelayerStatus>;
    filterRelayer(curr: RelayerStructOutput, relayer: RelayerParams, subdomains: string[], debugRelayer?: boolean): Promise<RelayerInfo | RelayerError>;
    getValidRelayers(relayers: RelayerParams[], subdomains: string[], debugRelayer?: boolean): Promise<{
        validRelayers: RelayerInfo[];
        invalidRelayers: RelayerError[];
    }>;
    pickWeightedRandomRelayer(relayers: RelayerInfo[]): RelayerInfo;
    tornadoWithdraw({ contract, proof, args }: RelayerClientWithdraw): Promise<void>;
}
