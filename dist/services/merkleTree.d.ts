import { MerkleTree, Element } from '@tornado/fixed-merkle-tree';
import type { Tornado } from '@tornado/contracts';
import type { DepositType } from './deposits';
import type { DepositsEvents } from './events';
export type MerkleTreeConstructor = DepositType & {
    Tornado: Tornado;
    commitment?: string;
    merkleTreeHeight?: number;
    emptyElement?: string;
    merkleWorkerPath?: string;
};
export declare class MerkleTreeService {
    currency: string;
    amount: string;
    netId: number;
    Tornado: Tornado;
    commitment?: string;
    instanceName: string;
    merkleTreeHeight: number;
    emptyElement: string;
    merkleWorkerPath?: string;
    constructor({ netId, amount, currency, Tornado, commitment, merkleTreeHeight, emptyElement, merkleWorkerPath, }: MerkleTreeConstructor);
    createTree({ events }: {
        events: Element[];
    }): Promise<MerkleTree>;
    verifyTree({ events }: {
        events: DepositsEvents[];
    }): Promise<MerkleTree>;
}
