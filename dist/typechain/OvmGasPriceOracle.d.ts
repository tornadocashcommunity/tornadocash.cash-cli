import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "./common";
export interface OvmGasPriceOracleInterface extends Interface {
    getFunction(nameOrSignature: "decimals" | "gasPrice" | "getL1Fee" | "getL1GasUsed" | "l1BaseFee" | "overhead" | "owner" | "renounceOwnership" | "scalar" | "setDecimals" | "setGasPrice" | "setL1BaseFee" | "setOverhead" | "setScalar" | "transferOwnership"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "DecimalsUpdated" | "GasPriceUpdated" | "L1BaseFeeUpdated" | "OverheadUpdated" | "OwnershipTransferred" | "ScalarUpdated"): EventFragment;
    encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
    encodeFunctionData(functionFragment: "gasPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "getL1Fee", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "getL1GasUsed", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "l1BaseFee", values?: undefined): string;
    encodeFunctionData(functionFragment: "overhead", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "scalar", values?: undefined): string;
    encodeFunctionData(functionFragment: "setDecimals", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setGasPrice", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setL1BaseFee", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setOverhead", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "setScalar", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getL1Fee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getL1GasUsed", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "l1BaseFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "overhead", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "scalar", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setDecimals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setGasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setL1BaseFee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setOverhead", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setScalar", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
}
export declare namespace DecimalsUpdatedEvent {
    type InputTuple = [arg0: BigNumberish];
    type OutputTuple = [arg0: bigint];
    interface OutputObject {
        arg0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace GasPriceUpdatedEvent {
    type InputTuple = [arg0: BigNumberish];
    type OutputTuple = [arg0: bigint];
    interface OutputObject {
        arg0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace L1BaseFeeUpdatedEvent {
    type InputTuple = [arg0: BigNumberish];
    type OutputTuple = [arg0: bigint];
    interface OutputObject {
        arg0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OverheadUpdatedEvent {
    type InputTuple = [arg0: BigNumberish];
    type OutputTuple = [arg0: bigint];
    interface OutputObject {
        arg0: bigint;
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
export declare namespace ScalarUpdatedEvent {
    type InputTuple = [arg0: BigNumberish];
    type OutputTuple = [arg0: bigint];
    interface OutputObject {
        arg0: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interface OvmGasPriceOracle extends BaseContract {
    connect(runner?: ContractRunner | null): OvmGasPriceOracle;
    waitForDeployment(): Promise<this>;
    interface: OvmGasPriceOracleInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    decimals: TypedContractMethod<[], [bigint], "view">;
    gasPrice: TypedContractMethod<[], [bigint], "view">;
    getL1Fee: TypedContractMethod<[_data: BytesLike], [bigint], "view">;
    getL1GasUsed: TypedContractMethod<[_data: BytesLike], [bigint], "view">;
    l1BaseFee: TypedContractMethod<[], [bigint], "view">;
    overhead: TypedContractMethod<[], [bigint], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    scalar: TypedContractMethod<[], [bigint], "view">;
    setDecimals: TypedContractMethod<[
        _decimals: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setGasPrice: TypedContractMethod<[
        _gasPrice: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setL1BaseFee: TypedContractMethod<[
        _baseFee: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setOverhead: TypedContractMethod<[
        _overhead: BigNumberish
    ], [
        void
    ], "nonpayable">;
    setScalar: TypedContractMethod<[_scalar: BigNumberish], [void], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "decimals"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "gasPrice"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getL1Fee"): TypedContractMethod<[_data: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "getL1GasUsed"): TypedContractMethod<[_data: BytesLike], [bigint], "view">;
    getFunction(nameOrSignature: "l1BaseFee"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "overhead"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "scalar"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "setDecimals"): TypedContractMethod<[_decimals: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setGasPrice"): TypedContractMethod<[_gasPrice: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setL1BaseFee"): TypedContractMethod<[_baseFee: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setOverhead"): TypedContractMethod<[_overhead: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "setScalar"): TypedContractMethod<[_scalar: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getEvent(key: "DecimalsUpdated"): TypedContractEvent<DecimalsUpdatedEvent.InputTuple, DecimalsUpdatedEvent.OutputTuple, DecimalsUpdatedEvent.OutputObject>;
    getEvent(key: "GasPriceUpdated"): TypedContractEvent<GasPriceUpdatedEvent.InputTuple, GasPriceUpdatedEvent.OutputTuple, GasPriceUpdatedEvent.OutputObject>;
    getEvent(key: "L1BaseFeeUpdated"): TypedContractEvent<L1BaseFeeUpdatedEvent.InputTuple, L1BaseFeeUpdatedEvent.OutputTuple, L1BaseFeeUpdatedEvent.OutputObject>;
    getEvent(key: "OverheadUpdated"): TypedContractEvent<OverheadUpdatedEvent.InputTuple, OverheadUpdatedEvent.OutputTuple, OverheadUpdatedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    getEvent(key: "ScalarUpdated"): TypedContractEvent<ScalarUpdatedEvent.InputTuple, ScalarUpdatedEvent.OutputTuple, ScalarUpdatedEvent.OutputObject>;
    filters: {
        "DecimalsUpdated(uint256)": TypedContractEvent<DecimalsUpdatedEvent.InputTuple, DecimalsUpdatedEvent.OutputTuple, DecimalsUpdatedEvent.OutputObject>;
        DecimalsUpdated: TypedContractEvent<DecimalsUpdatedEvent.InputTuple, DecimalsUpdatedEvent.OutputTuple, DecimalsUpdatedEvent.OutputObject>;
        "GasPriceUpdated(uint256)": TypedContractEvent<GasPriceUpdatedEvent.InputTuple, GasPriceUpdatedEvent.OutputTuple, GasPriceUpdatedEvent.OutputObject>;
        GasPriceUpdated: TypedContractEvent<GasPriceUpdatedEvent.InputTuple, GasPriceUpdatedEvent.OutputTuple, GasPriceUpdatedEvent.OutputObject>;
        "L1BaseFeeUpdated(uint256)": TypedContractEvent<L1BaseFeeUpdatedEvent.InputTuple, L1BaseFeeUpdatedEvent.OutputTuple, L1BaseFeeUpdatedEvent.OutputObject>;
        L1BaseFeeUpdated: TypedContractEvent<L1BaseFeeUpdatedEvent.InputTuple, L1BaseFeeUpdatedEvent.OutputTuple, L1BaseFeeUpdatedEvent.OutputObject>;
        "OverheadUpdated(uint256)": TypedContractEvent<OverheadUpdatedEvent.InputTuple, OverheadUpdatedEvent.OutputTuple, OverheadUpdatedEvent.OutputObject>;
        OverheadUpdated: TypedContractEvent<OverheadUpdatedEvent.InputTuple, OverheadUpdatedEvent.OutputTuple, OverheadUpdatedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        "ScalarUpdated(uint256)": TypedContractEvent<ScalarUpdatedEvent.InputTuple, ScalarUpdatedEvent.OutputTuple, ScalarUpdatedEvent.OutputObject>;
        ScalarUpdated: TypedContractEvent<ScalarUpdatedEvent.InputTuple, ScalarUpdatedEvent.OutputTuple, ScalarUpdatedEvent.OutputObject>;
    };
}