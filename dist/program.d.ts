import 'dotenv/config';
import { Command } from 'commander';
import { JsonRpcProvider, Provider, TransactionLike, Wallet, VoidSigner } from 'ethers';
import { getProviderOptions, TornadoWallet, TornadoVoidSigner, Relayer, RelayerInfo, RelayerError, RelayerClient, fetchDataOptions, NetIdType, Config } from './services';
export type commonProgramOptions = {
    rpc?: string;
    ethRpc?: string;
    graph?: string;
    ethGraph?: string;
    disableGraph?: boolean;
    accountKey?: string;
    relayer?: string;
    walletWithdrawal?: boolean;
    torPort?: number;
    token?: string;
    viewOnly?: string;
    mnemonic?: string;
    mnemonicIndex?: number;
    privateKey?: string;
    nonInteractive?: boolean;
    localRpc?: boolean;
};
export declare function promptConfirmation(nonInteractive?: boolean): Promise<void>;
export declare function getIPAddress(fetchDataOptions: fetchDataOptions): Promise<{
    ip: any;
    isTor: boolean;
}>;
export declare function getProgramOptions(options: commonProgramOptions): Promise<{
    options: commonProgramOptions;
    fetchDataOptions: fetchDataOptions;
}>;
export declare function getProgramGraphAPI(options: commonProgramOptions, config: Config): string;
export declare function getProgramProvider(netId: NetIdType, rpcUrl: string | undefined, config: Config, providerOptions?: getProviderOptions): JsonRpcProvider;
export declare function getProgramSigner({ options, provider, }: {
    options: commonProgramOptions;
    provider: Provider;
}): TornadoVoidSigner | TornadoWallet | undefined;
export declare function getProgramRelayer({ options, fetchDataOptions, netId, }: {
    options: commonProgramOptions;
    fetchDataOptions?: fetchDataOptions;
    netId: NetIdType;
}): Promise<{
    validRelayers?: RelayerInfo[] | Relayer[];
    invalidRelayers?: RelayerError[];
    relayerClient?: RelayerClient;
}>;
export declare function programSendTransaction({ signer, options, populatedTransaction, }: {
    signer: VoidSigner | Wallet;
    options: commonProgramOptions;
    populatedTransaction: TransactionLike;
}): Promise<void>;
export declare function tornadoProgram(): Command;
