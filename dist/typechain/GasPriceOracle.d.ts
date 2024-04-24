import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface GasPriceOracleInterface extends Interface {
    getFunction(nameOrSignature: "GAS_UNIT" | "changeDerivationThresold" | "changeGasUnit" | "changeHeartbeat" | "changeOwnership" | "derivationThresold" | "gasPrice" | "heartbeat" | "maxFeePerGas" | "maxPriorityFeePerGas" | "owner" | "pastGasPrice" | "setGasPrice" | "timestamp"): FunctionFragment;
    encodeFunctionData(functionFragment: "GAS_UNIT", values?: undefined): string;
    encodeFunctionData(functionFragment: "changeDerivationThresold", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeGasUnit", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeHeartbeat", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "derivationThresold", values?: undefined): string;
    encodeFunctionData(functionFragment: "gasPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "heartbeat", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxFeePerGas", values?: undefined): string;
    encodeFunctionData(functionFragment: "maxPriorityFeePerGas", values?: undefined): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pastGasPrice", values?: undefined): string;
    encodeFunctionData(functionFragment: "setGasPrice", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "timestamp", values?: undefined): string;
    decodeFunctionResult(functionFragment: "GAS_UNIT", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeDerivationThresold", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeGasUnit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeHeartbeat", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "derivationThresold", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "gasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "heartbeat", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxFeePerGas", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "maxPriorityFeePerGas", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pastGasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setGasPrice", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "timestamp", data: BytesLike): Result;
}
export interface GasPriceOracle extends BaseContract {
    connect(runner?: ContractRunner | null): GasPriceOracle;
    waitForDeployment(): Promise<this>;
    interface: GasPriceOracleInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    GAS_UNIT: TypedContractMethod<[], [bigint], "view">;
    changeDerivationThresold: TypedContractMethod<[
        _derivationThresold: BigNumberish
    ], [
        void
    ], "nonpayable">;
    changeGasUnit: TypedContractMethod<[
        _gasUnit: BigNumberish
    ], [
        void
    ], "nonpayable">;
    changeHeartbeat: TypedContractMethod<[
        _heartbeat: BigNumberish
    ], [
        void
    ], "nonpayable">;
    changeOwnership: TypedContractMethod<[
        _owner: AddressLike
    ], [
        void
    ], "nonpayable">;
    derivationThresold: TypedContractMethod<[], [bigint], "view">;
    gasPrice: TypedContractMethod<[], [bigint], "view">;
    heartbeat: TypedContractMethod<[], [bigint], "view">;
    maxFeePerGas: TypedContractMethod<[], [bigint], "view">;
    maxPriorityFeePerGas: TypedContractMethod<[], [bigint], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    pastGasPrice: TypedContractMethod<[], [bigint], "view">;
    setGasPrice: TypedContractMethod<[
        _gasPrice: BigNumberish
    ], [
        void
    ], "nonpayable">;
    timestamp: TypedContractMethod<[], [bigint], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "GAS_UNIT"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "changeDerivationThresold"): TypedContractMethod<[
        _derivationThresold: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "changeGasUnit"): TypedContractMethod<[_gasUnit: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "changeHeartbeat"): TypedContractMethod<[_heartbeat: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "changeOwnership"): TypedContractMethod<[_owner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "derivationThresold"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "gasPrice"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "heartbeat"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "maxFeePerGas"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "maxPriorityFeePerGas"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pastGasPrice"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "setGasPrice"): TypedContractMethod<[_gasPrice: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "timestamp"): TypedContractMethod<[], [bigint], "view">;
    filters: {};
}
