import { BaseContract, Provider, EventLog, ContractEventName } from 'ethers';
import type { Tornado, TornadoRouter, TornadoProxyLight, Governance, RelayerRegistry } from '@tornado/contracts';
import { BatchEventsService, BatchBlockService, BatchTransactionService, BatchEventOnProgress, BatchBlockOnProgress } from '../batch';
import { fetchDataOptions } from '../providers';
import type { BaseEvents, MinimalEvents, DepositsEvents, WithdrawalsEvents, EncryptedNotesEvents, GovernanceProposalCreatedEvents, GovernanceVotedEvents, GovernanceDelegatedEvents, GovernanceUndelegatedEvents, RegistersEvents } from './types';
export declare const DEPOSIT = "deposit";
export declare const WITHDRAWAL = "withdrawal";
export type BaseEventsServiceConstructor = {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    contract: BaseContract;
    type?: string;
    deployedBlock?: number;
    fetchDataOptions?: fetchDataOptions;
};
export type BatchGraphOnProgress = ({ type, fromBlock, toBlock, count, }: {
    type?: ContractEventName;
    fromBlock?: number;
    toBlock?: number;
    count?: number;
}) => void;
export type BaseGraphParams = {
    graphApi: string;
    subgraphName: string;
    fetchDataOptions?: fetchDataOptions;
    onProgress?: BatchGraphOnProgress;
};
export declare class BaseEventsService<EventType extends MinimalEvents> {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    contract: BaseContract;
    type: string;
    deployedBlock: number;
    batchEventsService: BatchEventsService;
    fetchDataOptions?: fetchDataOptions;
    constructor({ netId, provider, graphApi, subgraphName, contract, type, deployedBlock, fetchDataOptions, }: BaseEventsServiceConstructor);
    getInstanceName(): string;
    getType(): string;
    getGraphMethod(): string;
    getGraphParams(): BaseGraphParams;
    updateEventProgress({ percentage, type, fromBlock, toBlock, count }: Parameters<BatchEventOnProgress>[0]): void;
    updateBlockProgress({ percentage, currentIndex, totalIndex }: Parameters<BatchBlockOnProgress>[0]): void;
    updateTransactionProgress({ percentage, currentIndex, totalIndex }: Parameters<BatchBlockOnProgress>[0]): void;
    updateGraphProgress({ type, fromBlock, toBlock, count }: Parameters<BatchGraphOnProgress>[0]): void;
    formatEvents(events: EventLog[]): Promise<EventType[]>;
    /**
     * Get saved or cached events
     */
    getEventsFromDB(): Promise<BaseEvents<EventType>>;
    getEventsFromCache(): Promise<BaseEvents<EventType>>;
    getSavedEvents(): Promise<BaseEvents<EventType>>;
    /**
     * Get latest events
     */
    getEventsFromGraph({ fromBlock, methodName, }: {
        fromBlock: number;
        methodName?: string;
    }): Promise<BaseEvents<EventType>>;
    getEventsFromRpc({ fromBlock, toBlock, }: {
        fromBlock: number;
        toBlock?: number;
    }): Promise<BaseEvents<EventType>>;
    getLatestEvents({ fromBlock }: {
        fromBlock: number;
    }): Promise<BaseEvents<EventType>>;
    validateEvents({ events, lastBlock }: BaseEvents<EventType>): void;
    /**
     * Handle saving events
     */
    saveEvents({ events, lastBlock }: BaseEvents<EventType>): Promise<void>;
    /**
     * Trigger saving and receiving latest events
     */
    updateEvents(): Promise<{
        events: EventType[];
        lastBlock: number | null;
    }>;
}
export type BaseDepositsServiceConstructor = {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    Tornado: Tornado;
    type: string;
    amount: string;
    currency: string;
    deployedBlock?: number;
    fetchDataOptions?: fetchDataOptions;
};
export type DepositsGraphParams = BaseGraphParams & {
    amount: string;
    currency: string;
};
export declare class BaseDepositsService extends BaseEventsService<DepositsEvents | WithdrawalsEvents> {
    amount: string;
    currency: string;
    batchTransactionService: BatchTransactionService;
    batchBlockService: BatchBlockService;
    constructor({ netId, provider, graphApi, subgraphName, Tornado, type, amount, currency, deployedBlock, fetchDataOptions, }: BaseDepositsServiceConstructor);
    getInstanceName(): string;
    getGraphMethod(): string;
    getGraphParams(): DepositsGraphParams;
    formatEvents(events: EventLog[]): Promise<(DepositsEvents | WithdrawalsEvents)[]>;
    validateEvents({ events }: {
        events: (DepositsEvents | WithdrawalsEvents)[];
    }): void;
}
export type BaseEncryptedNotesServiceConstructor = {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    Router: TornadoRouter | TornadoProxyLight;
    deployedBlock?: number;
    fetchDataOptions?: fetchDataOptions;
};
export declare class BaseEncryptedNotesService extends BaseEventsService<EncryptedNotesEvents> {
    constructor({ netId, provider, graphApi, subgraphName, Router, deployedBlock, fetchDataOptions, }: BaseEncryptedNotesServiceConstructor);
    getInstanceName(): string;
    getType(): string;
    getGraphMethod(): string;
    formatEvents(events: EventLog[]): Promise<EncryptedNotesEvents[]>;
}
export type BaseGovernanceEventTypes = GovernanceProposalCreatedEvents | GovernanceVotedEvents | GovernanceDelegatedEvents | GovernanceUndelegatedEvents;
export type BaseGovernanceServiceConstructor = {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    Governance: Governance;
    deployedBlock?: number;
    fetchDataOptions?: fetchDataOptions;
};
export declare class BaseGovernanceService extends BaseEventsService<BaseGovernanceEventTypes> {
    batchTransactionService: BatchTransactionService;
    constructor({ netId, provider, graphApi, subgraphName, Governance, deployedBlock, fetchDataOptions, }: BaseGovernanceServiceConstructor);
    getInstanceName(): string;
    getType(): string;
    getGraphMethod(): string;
    formatEvents(events: EventLog[]): Promise<BaseGovernanceEventTypes[]>;
    getEventsFromGraph({ fromBlock }: {
        fromBlock: number;
    }): Promise<BaseEvents<BaseGovernanceEventTypes>>;
}
export type BaseRegistryServiceConstructor = {
    netId: number | string;
    provider: Provider;
    graphApi?: string;
    subgraphName?: string;
    RelayerRegistry: RelayerRegistry;
    deployedBlock?: number;
    fetchDataOptions?: fetchDataOptions;
};
export declare class BaseRegistryService extends BaseEventsService<RegistersEvents> {
    constructor({ netId, provider, graphApi, subgraphName, RelayerRegistry, deployedBlock, fetchDataOptions, }: BaseRegistryServiceConstructor);
    getInstanceName(): string;
    getType(): string;
    getGraphMethod(): string;
    formatEvents(events: EventLog[]): Promise<{
        ensName: any;
        relayerAddress: any;
        blockNumber: number;
        logIndex: number;
        transactionHash: string;
    }[]>;
    fetchRelayers(): Promise<RegistersEvents[]>;
}
