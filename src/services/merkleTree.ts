import { Worker as NodeWorker } from 'worker_threads';
import { MerkleTree, Element } from '@tornado/fixed-merkle-tree';
import type { Tornado } from '@tornado/contracts';
import { isNode, toFixedHex } from './utils';
import { mimc } from './mimc';
import type { DepositType } from './deposits';
import type { DepositsEvents } from './events';

export type MerkleTreeConstructor = DepositType & {
  Tornado: Tornado;
  commitment?: string;
  merkleTreeHeight?: number;
  emptyElement?: string;
  merkleWorkerPath?: string;
};

export class MerkleTreeService {
  currency: string;
  amount: string;
  netId: number;
  Tornado: Tornado;
  commitment?: string;
  instanceName: string;

  merkleTreeHeight: number;
  emptyElement: string;

  merkleWorkerPath?: string;

  constructor({
    netId,
    amount,
    currency,
    Tornado,
    commitment,
    merkleTreeHeight = 20,
    emptyElement = '21663839004416932945382355908790599225266501822907911457504978515578255421292',
    merkleWorkerPath,
  }: MerkleTreeConstructor) {
    const instanceName = `${netId}_${currency}_${amount}`;

    this.currency = currency;
    this.amount = amount;
    this.netId = Number(netId);

    this.Tornado = Tornado;
    this.instanceName = instanceName;
    this.commitment = commitment;

    this.merkleTreeHeight = merkleTreeHeight;
    this.emptyElement = emptyElement;
    this.merkleWorkerPath = merkleWorkerPath;
  }

  async createTree({ events }: { events: Element[] }) {
    const { hash: hashFunction } = await mimc.getHash();

    if (this.merkleWorkerPath) {
      console.log('Using merkleWorker\n');

      try {
        if (isNode) {
          const merkleWorkerPromise = new Promise((resolve, reject) => {
            const worker = new NodeWorker(this.merkleWorkerPath as string, {
              workerData: {
                merkleTreeHeight: this.merkleTreeHeight,
                elements: events,
                zeroElement: this.emptyElement,
              },
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
              if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          }) as Promise<string>;

          return MerkleTree.deserialize(JSON.parse(await merkleWorkerPromise), hashFunction);
        } else {
          const merkleWorkerPromise = new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const worker = new (Worker as any)(this.merkleWorkerPath);

            worker.onmessage = (e: { data: string }) => {
              resolve(e.data);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            worker.onerror = (e: any) => {
              reject(e);
            };

            worker.postMessage({
              merkleTreeHeight: this.merkleTreeHeight,
              elements: events,
              zeroElement: this.emptyElement,
            });
          }) as Promise<string>;

          return MerkleTree.deserialize(JSON.parse(await merkleWorkerPromise), hashFunction);
        }
      } catch (err) {
        console.log('merkleWorker failed, falling back to synchronous merkle tree');
        console.log(err);
      }
    }

    return new MerkleTree(this.merkleTreeHeight, events, {
      zeroElement: this.emptyElement,
      hashFunction,
    });
  }

  async verifyTree({ events }: { events: DepositsEvents[] }) {
    console.log(
      `\nCreating deposit tree for ${this.netId} ${this.amount} ${this.currency.toUpperCase()} would take a while\n`,
    );

    console.time('Created tree in');
    const tree = await this.createTree({ events: events.map(({ commitment }) => BigInt(commitment).toString()) });
    console.timeEnd('Created tree in');
    console.log('');

    const isKnownRoot = await this.Tornado.isKnownRoot(toFixedHex(BigInt(tree.root)));

    if (!isKnownRoot) {
      const errMsg = `Deposit Event ${this.netId} ${this.amount} ${this.currency} is invalid`;
      throw new Error(errMsg);
    }

    return tree;
  }
}