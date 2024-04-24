import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common";
export interface OffchainOracleInterface extends Interface {
    getFunction(nameOrSignature: "addConnector" | "addOracle" | "connectors" | "getRate" | "getRateToEth" | "getRateToEthWithCustomConnectors" | "getRateToEthWithThreshold" | "getRateWithCustomConnectors" | "getRateWithThreshold" | "multiWrapper" | "oracles" | "owner" | "removeConnector" | "removeOracle" | "renounceOwnership" | "setMultiWrapper" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "ConnectorAdded" | "ConnectorRemoved" | "MultiWrapperUpdated" | "OracleAdded" | "OracleRemoved" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "addConnector", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "addOracle", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "connectors", values?: undefined): string;
    encodeFunctionData(functionFragment: "getRate", values: [AddressLike, AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "getRateToEth", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "getRateToEthWithCustomConnectors", values: [AddressLike, boolean, AddressLike[], BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRateToEthWithThreshold", values: [AddressLike, boolean, BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRateWithCustomConnectors", values: [AddressLike, AddressLike, boolean, AddressLike[], BigNumberish]): string;
    encodeFunctionData(functionFragment: "getRateWithThreshold", values: [AddressLike, AddressLike, boolean, BigNumberish]): string;
    encodeFunctionData(functionFragment: "multiWrapper", values?: undefined): string;
    encodeFunctionData(functionFragment: "oracles", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeConnector", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "removeOracle", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMultiWrapper", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "addConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "connectors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateToEth", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateToEthWithCustomConnectors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateToEthWithThreshold", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateWithCustomConnectors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getRateWithThreshold", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "multiWrapper", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "oracles", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeConnector", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeOracle", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMultiWrapper", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
export declare namespace ConnectorAddedEvent {
    type InputTuple = [connector: AddressLike];
    type OutputTuple = [connector: string];
    interface OutputObject {
        connector: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace ConnectorRemovedEvent {
    type InputTuple = [connector: AddressLike];
    type OutputTuple = [connector: string];
    interface OutputObject {
        connector: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace MultiWrapperUpdatedEvent {
    type InputTuple = [multiWrapper: AddressLike];
    type OutputTuple = [multiWrapper: string];
    interface OutputObject {
        multiWrapper: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OracleAddedEvent {
    type InputTuple = [oracle: AddressLike, oracleType: BigNumberish];
    type OutputTuple = [oracle: string, oracleType: bigint];
    interface OutputObject {
        oracle: string;
        oracleType: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OracleRemovedEvent {
    type InputTuple = [oracle: AddressLike, oracleType: BigNumberish];
    type OutputTuple = [oracle: string, oracleType: bigint];
    interface OutputObject {
        oracle: string;
        oracleType: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OffchainOracle extends BaseContract {
    connect(runner?: ContractRunner | null): OffchainOracle;
    waitForDeployment(): Promise<this>;
    interface: OffchainOracleInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    addConnector: TypedContractMethod<[
        connector: AddressLike
    ], [
        void
    ], "nonpayable">;
    addOracle: TypedContractMethod<[
        oracle: AddressLike,
        oracleKind: BigNumberish
    ], [
        void
    ], "nonpayable">;
    connectors: TypedContractMethod<[], [string[]], "view">;
    getRate: TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean
    ], [
        bigint
    ], "view">;
    getRateToEth: TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean
    ], [
        bigint
    ], "view">;
    getRateToEthWithCustomConnectors: TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean,
        customConnectors: AddressLike[],
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getRateToEthWithThreshold: TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean,
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getRateWithCustomConnectors: TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean,
        customConnectors: AddressLike[],
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getRateWithThreshold: TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean,
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    multiWrapper: TypedContractMethod<[], [string], "view">;
    oracles: TypedContractMethod<[
    ], [
        [string[], bigint[]] & {
            allOracles: string[];
            oracleTypes: bigint[];
        }
    ], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    removeConnector: TypedContractMethod<[
        connector: AddressLike
    ], [
        void
    ], "nonpayable">;
    removeOracle: TypedContractMethod<[
        oracle: AddressLike,
        oracleKind: BigNumberish
    ], [
        void
    ], "nonpayable">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    setMultiWrapper: TypedContractMethod<[
        _multiWrapper: AddressLike
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "addConnector"): TypedContractMethod<[connector: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "addOracle"): TypedContractMethod<[
        oracle: AddressLike,
        oracleKind: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "connectors"): TypedContractMethod<[], [string[]], "view">;
    getFunction(nameOrSignature: "getRate"): TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getRateToEth"): TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getRateToEthWithCustomConnectors"): TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean,
        customConnectors: AddressLike[],
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getRateToEthWithThreshold"): TypedContractMethod<[
        srcToken: AddressLike,
        useSrcWrappers: boolean,
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getRateWithCustomConnectors"): TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean,
        customConnectors: AddressLike[],
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "getRateWithThreshold"): TypedContractMethod<[
        srcToken: AddressLike,
        dstToken: AddressLike,
        useWrappers: boolean,
        thresholdFilter: BigNumberish
    ], [
        bigint
    ], "view">;
    getFunction(nameOrSignature: "multiWrapper"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "oracles"): TypedContractMethod<[
    ], [
        [string[], bigint[]] & {
            allOracles: string[];
            oracleTypes: bigint[];
        }
    ], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "removeConnector"): TypedContractMethod<[connector: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeOracle"): TypedContractMethod<[
        oracle: AddressLike,
        oracleKind: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "setMultiWrapper"): TypedContractMethod<[_multiWrapper: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "ConnectorAdded"): TypedContractEvent<ConnectorAddedEvent.InputTuple, ConnectorAddedEvent.OutputTuple, ConnectorAddedEvent.OutputObject>;
    getEvent(key: "ConnectorRemoved"): TypedContractEvent<ConnectorRemovedEvent.InputTuple, ConnectorRemovedEvent.OutputTuple, ConnectorRemovedEvent.OutputObject>;
    getEvent(key: "MultiWrapperUpdated"): TypedContractEvent<MultiWrapperUpdatedEvent.InputTuple, MultiWrapperUpdatedEvent.OutputTuple, MultiWrapperUpdatedEvent.OutputObject>;
    getEvent(key: "OracleAdded"): TypedContractEvent<OracleAddedEvent.InputTuple, OracleAddedEvent.OutputTuple, OracleAddedEvent.OutputObject>;
    getEvent(key: "OracleRemoved"): TypedContractEvent<OracleRemovedEvent.InputTuple, OracleRemovedEvent.OutputTuple, OracleRemovedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "ConnectorAdded(address)": TypedContractEvent<ConnectorAddedEvent.InputTuple, ConnectorAddedEvent.OutputTuple, ConnectorAddedEvent.OutputObject>;
        ConnectorAdded: TypedContractEvent<ConnectorAddedEvent.InputTuple, ConnectorAddedEvent.OutputTuple, ConnectorAddedEvent.OutputObject>;
        "ConnectorRemoved(address)": TypedContractEvent<ConnectorRemovedEvent.InputTuple, ConnectorRemovedEvent.OutputTuple, ConnectorRemovedEvent.OutputObject>;
        ConnectorRemoved: TypedContractEvent<ConnectorRemovedEvent.InputTuple, ConnectorRemovedEvent.OutputTuple, ConnectorRemovedEvent.OutputObject>;
        "MultiWrapperUpdated(address)": TypedContractEvent<MultiWrapperUpdatedEvent.InputTuple, MultiWrapperUpdatedEvent.OutputTuple, MultiWrapperUpdatedEvent.OutputObject>;
        MultiWrapperUpdated: TypedContractEvent<MultiWrapperUpdatedEvent.InputTuple, MultiWrapperUpdatedEvent.OutputTuple, MultiWrapperUpdatedEvent.OutputObject>;
        "OracleAdded(address,uint8)": TypedContractEvent<OracleAddedEvent.InputTuple, OracleAddedEvent.OutputTuple, OracleAddedEvent.OutputObject>;
        OracleAdded: TypedContractEvent<OracleAddedEvent.InputTuple, OracleAddedEvent.OutputTuple, OracleAddedEvent.OutputObject>;
        "OracleRemoved(address,uint8)": TypedContractEvent<OracleRemovedEvent.InputTuple, OracleRemovedEvent.OutputTuple, OracleRemovedEvent.OutputObject>;
        OracleRemoved: TypedContractEvent<OracleRemovedEvent.InputTuple, OracleRemovedEvent.OutputTuple, OracleRemovedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
