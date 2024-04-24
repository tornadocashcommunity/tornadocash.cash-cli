import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export declare namespace Multicall3 {
    type CallStruct = {
        target: AddressLike;
        callData: BytesLike;
    };
    type CallStructOutput = [target: string, callData: string] & {
        target: string;
        callData: string;
    };
    type Call3Struct = {
        target: AddressLike;
        allowFailure: boolean;
        callData: BytesLike;
    };
    type Call3StructOutput = [
        target: string,
        allowFailure: boolean,
        callData: string
    ] & {
        target: string;
        allowFailure: boolean;
        callData: string;
    };
    type ResultStruct = {
        success: boolean;
        returnData: BytesLike;
    };
    type ResultStructOutput = [success: boolean, returnData: string] & {
        success: boolean;
        returnData: string;
    };
    type Call3ValueStruct = {
        target: AddressLike;
        allowFailure: boolean;
        value: BigNumberish;
        callData: BytesLike;
    };
    type Call3ValueStructOutput = [
        target: string,
        allowFailure: boolean,
        value: bigint,
        callData: string
    ] & {
        target: string;
        allowFailure: boolean;
        value: bigint;
        callData: string;
    };
}
export interface MulticallInterface extends Interface {
    getFunction(nameOrSignature: "aggregate" | "aggregate3" | "aggregate3Value" | "blockAndAggregate" | "getBasefee" | "getBlockHash" | "getBlockNumber" | "getChainId" | "getCurrentBlockCoinbase" | "getCurrentBlockDifficulty" | "getCurrentBlockGasLimit" | "getCurrentBlockTimestamp" | "getEthBalance" | "getLastBlockHash" | "tryAggregate" | "tryBlockAndAggregate"): FunctionFragment;
    encodeFunctionData(functionFragment: "aggregate", values: [Multicall3.CallStruct[]]): string;
    encodeFunctionData(functionFragment: "aggregate3", values: [Multicall3.Call3Struct[]]): string;
    encodeFunctionData(functionFragment: "aggregate3Value", values: [Multicall3.Call3ValueStruct[]]): string;
    encodeFunctionData(functionFragment: "blockAndAggregate", values: [Multicall3.CallStruct[]]): string;
    encodeFunctionData(functionFragment: "getBasefee", values?: undefined): string;
    encodeFunctionData(functionFragment: "getBlockHash", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "getBlockNumber", values?: undefined): string;
    encodeFunctionData(functionFragment: "getChainId", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentBlockCoinbase", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentBlockDifficulty", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentBlockGasLimit", values?: undefined): string;
    encodeFunctionData(functionFragment: "getCurrentBlockTimestamp", values?: undefined): string;
    encodeFunctionData(functionFragment: "getEthBalance", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getLastBlockHash", values?: undefined): string;
    encodeFunctionData(functionFragment: "tryAggregate", values: [boolean, Multicall3.CallStruct[]]): string;
    encodeFunctionData(functionFragment: "tryBlockAndAggregate", values: [boolean, Multicall3.CallStruct[]]): string;
    decodeFunctionResult(functionFragment: "aggregate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "aggregate3", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "aggregate3Value", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "blockAndAggregate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBasefee", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBlockHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getBlockNumber", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getChainId", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentBlockCoinbase", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentBlockDifficulty", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentBlockGasLimit", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getCurrentBlockTimestamp", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getEthBalance", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getLastBlockHash", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tryAggregate", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "tryBlockAndAggregate", data: BytesLike): Result;
}
export interface Multicall extends BaseContract {
    connect(runner?: ContractRunner | null): Multicall;
    waitForDeployment(): Promise<this>;
    interface: MulticallInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    aggregate: TypedContractMethod<[
        calls: Multicall3.CallStruct[]
    ], [
        [bigint, string[]] & {
            blockNumber: bigint;
            returnData: string[];
        }
    ], "payable">;
    aggregate3: TypedContractMethod<[
        calls: Multicall3.Call3Struct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    aggregate3Value: TypedContractMethod<[
        calls: Multicall3.Call3ValueStruct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    blockAndAggregate: TypedContractMethod<[
        calls: Multicall3.CallStruct[]
    ], [
        [
            bigint,
            string,
            Multicall3.ResultStructOutput[]
        ] & {
            blockNumber: bigint;
            blockHash: string;
            returnData: Multicall3.ResultStructOutput[];
        }
    ], "payable">;
    getBasefee: TypedContractMethod<[], [bigint], "view">;
    getBlockHash: TypedContractMethod<[
        blockNumber: BigNumberish
    ], [
        string
    ], "view">;
    getBlockNumber: TypedContractMethod<[], [bigint], "view">;
    getChainId: TypedContractMethod<[], [bigint], "view">;
    getCurrentBlockCoinbase: TypedContractMethod<[], [string], "view">;
    getCurrentBlockDifficulty: TypedContractMethod<[], [bigint], "view">;
    getCurrentBlockGasLimit: TypedContractMethod<[], [bigint], "view">;
    getCurrentBlockTimestamp: TypedContractMethod<[], [bigint], "view">;
    getEthBalance: TypedContractMethod<[addr: AddressLike], [bigint], "view">;
    getLastBlockHash: TypedContractMethod<[], [string], "view">;
    tryAggregate: TypedContractMethod<[
        requireSuccess: boolean,
        calls: Multicall3.CallStruct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    tryBlockAndAggregate: TypedContractMethod<[
        requireSuccess: boolean,
        calls: Multicall3.CallStruct[]
    ], [
        [
            bigint,
            string,
            Multicall3.ResultStructOutput[]
        ] & {
            blockNumber: bigint;
            blockHash: string;
            returnData: Multicall3.ResultStructOutput[];
        }
    ], "payable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "aggregate"): TypedContractMethod<[
        calls: Multicall3.CallStruct[]
    ], [
        [bigint, string[]] & {
            blockNumber: bigint;
            returnData: string[];
        }
    ], "payable">;
    getFunction(nameOrSignature: "aggregate3"): TypedContractMethod<[
        calls: Multicall3.Call3Struct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    getFunction(nameOrSignature: "aggregate3Value"): TypedContractMethod<[
        calls: Multicall3.Call3ValueStruct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    getFunction(nameOrSignature: "blockAndAggregate"): TypedContractMethod<[
        calls: Multicall3.CallStruct[]
    ], [
        [
            bigint,
            string,
            Multicall3.ResultStructOutput[]
        ] & {
            blockNumber: bigint;
            blockHash: string;
            returnData: Multicall3.ResultStructOutput[];
        }
    ], "payable">;
    getFunction(nameOrSignature: "getBasefee"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getBlockHash"): TypedContractMethod<[blockNumber: BigNumberish], [string], "view">;
    getFunction(nameOrSignature: "getBlockNumber"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getChainId"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getCurrentBlockCoinbase"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "getCurrentBlockDifficulty"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getCurrentBlockGasLimit"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getCurrentBlockTimestamp"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "getEthBalance"): TypedContractMethod<[addr: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "getLastBlockHash"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "tryAggregate"): TypedContractMethod<[
        requireSuccess: boolean,
        calls: Multicall3.CallStruct[]
    ], [
        Multicall3.ResultStructOutput[]
    ], "payable">;
    getFunction(nameOrSignature: "tryBlockAndAggregate"): TypedContractMethod<[
        requireSuccess: boolean,
        calls: Multicall3.CallStruct[]
    ], [
        [
            bigint,
            string,
            Multicall3.ResultStructOutput[]
        ] & {
            blockNumber: bigint;
            blockHash: string;
            returnData: Multicall3.ResultStructOutput[];
        }
    ], "payable">;
    filters: {};
}
