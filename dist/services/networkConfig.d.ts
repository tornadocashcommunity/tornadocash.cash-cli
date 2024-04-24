export interface RpcUrl {
    name: string;
    url: string;
}
export type RpcUrls = {
    [key in string]: RpcUrl;
};
export interface SubgraphUrl {
    name: string;
    url: string;
}
export type SubgraphUrls = {
    [key in string]: SubgraphUrl;
};
export type TornadoInstance = {
    instanceAddress: {
        [key in string]: string;
    };
    optionalInstances?: string[];
    tokenAddress?: string;
    tokenGasLimit?: number;
    symbol: string;
    decimals: number;
    gasLimit?: number;
};
export type TokenInstances = {
    [key in string]: TornadoInstance;
};
export type Config = {
    rpcCallRetryAttempt?: number;
    gasPrices: {
        instant: number;
        fast?: number;
        standard?: number;
        low?: number;
        maxPriorityFeePerGas?: number;
    };
    nativeCurrency: string;
    currencyName: string;
    explorerUrl: {
        tx: string;
        address: string;
        block: string;
    };
    merkleTreeHeight: number;
    emptyElement: string;
    networkName: string;
    deployedBlock: number;
    rpcUrls: RpcUrls;
    multicall: string;
    routerContract: string;
    registryContract?: string;
    echoContract: string;
    aggregatorContract?: string;
    reverseRecordsContract?: string;
    gasPriceOracleContract?: string;
    gasStationApi?: string;
    ovmGasPriceOracleContract?: string;
    tornadoSubgraph: string;
    registrySubgraph?: string;
    subgraphs: SubgraphUrls;
    tokens: TokenInstances;
    optionalTokens?: string[];
    ensSubdomainKey: string;
    pollInterval: number;
    constants: {
        GOVERNANCE_BLOCK?: number;
        NOTE_ACCOUNT_BLOCK?: number;
        ENCRYPTED_NOTES_BLOCK?: number;
        REGISTRY_BLOCK?: number;
        MINING_BLOCK_TIME?: number;
    };
    'torn.contract.tornadocash.eth'?: string;
    'governance.contract.tornadocash.eth'?: string;
    'staking-rewards.contract.tornadocash.eth'?: string;
    'tornado-router.contract.tornadocash.eth'?: string;
    'tornado-proxy-light.contract.tornadocash.eth'?: string;
};
export type networkConfig = {
    [key in string]: Config;
};
export declare const blockSyncInterval = 10000;
export declare const enabledChains: string[];
export declare const networkConfig: networkConfig;
export declare const subdomains: string[];
export default networkConfig;
