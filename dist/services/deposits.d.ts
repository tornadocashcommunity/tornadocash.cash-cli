export type DepositType = {
    currency: string;
    amount: string;
    netId: string | number;
};
export type createDepositParams = {
    nullifier: bigint;
    secret: bigint;
};
export type createDepositObject = {
    preimage: Uint8Array;
    noteHex: string;
    commitment: bigint;
    commitmentHex: string;
    nullifierHash: bigint;
    nullifierHex: string;
};
export type createNoteParams = DepositType & {
    nullifier?: bigint;
    secret?: bigint;
};
export type parsedNoteExec = DepositType & {
    note: string;
};
export type depositTx = {
    from: string;
    transactionHash: string;
};
export type withdrawalTx = {
    to: string;
    transactionHash: string;
};
export declare function createDeposit({ nullifier, secret }: createDepositParams): Promise<createDepositObject>;
export interface DepositConstructor {
    currency: string;
    amount: string;
    netId: number;
    nullifier: bigint;
    secret: bigint;
    note: string;
    noteHex: string;
    invoice: string;
    commitmentHex: string;
    nullifierHex: string;
}
export declare class Deposit {
    currency: string;
    amount: string;
    netId: number;
    nullifier: bigint;
    secret: bigint;
    note: string;
    noteHex: string;
    invoice: string;
    commitmentHex: string;
    nullifierHex: string;
    constructor({ currency, amount, netId, nullifier, secret, note, noteHex, invoice, commitmentHex, nullifierHex, }: DepositConstructor);
    toString(): string;
    static createNote({ currency, amount, netId, nullifier, secret }: createNoteParams): Promise<Deposit>;
    static parseNote(noteString: string): Promise<Deposit>;
}
export type parsedInvoiceExec = DepositType & {
    commitment: string;
};
export declare class Invoice {
    currency: string;
    amount: string;
    netId: number;
    commitment: string;
    invoice: string;
    constructor(invoiceString: string);
    toString(): string;
}
