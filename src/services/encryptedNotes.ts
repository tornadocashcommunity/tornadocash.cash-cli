import { getEncryptionPublicKey, encrypt, decrypt, EthEncryptedData } from '@metamask/eth-sig-util';
import { Echoer } from '@tornado/contracts';
import { Wallet, computeAddress } from 'ethers';
import { crypto, base64ToBytes, bytesToBase64, bytesToHex, hexToBytes, toFixedHex, concatBytes } from './utils';
import { EchoEvents, EncryptedNotesEvents } from './events';

export interface DecryptedNotes {
  blockNumber: number;
  address: string;
  noteHex: string;
}

export function packEncryptedMessage({ nonce, ephemPublicKey, ciphertext }: EthEncryptedData) {
  const nonceBuf = toFixedHex(bytesToHex(base64ToBytes(nonce)), 24);
  const ephemPublicKeyBuf = toFixedHex(bytesToHex(base64ToBytes(ephemPublicKey)), 32);
  const ciphertextBuf = bytesToHex(base64ToBytes(ciphertext));

  const messageBuff = concatBytes(hexToBytes(nonceBuf), hexToBytes(ephemPublicKeyBuf), hexToBytes(ciphertextBuf));

  return bytesToHex(messageBuff);
}

export function unpackEncryptedMessage(encryptedMessage: string) {
  const messageBuff = hexToBytes(encryptedMessage);
  const nonceBuf = bytesToBase64(messageBuff.slice(0, 24));
  const ephemPublicKeyBuf = bytesToBase64(messageBuff.slice(24, 56));
  const ciphertextBuf = bytesToBase64(messageBuff.slice(56));

  return {
    messageBuff: bytesToHex(messageBuff),
    version: 'x25519-xsalsa20-poly1305',
    nonce: nonceBuf,
    ephemPublicKey: ephemPublicKeyBuf,
    ciphertext: ciphertextBuf,
  } as EthEncryptedData & {
    messageBuff: string;
  };
}

export interface NoteAccountConstructor {
  netId: string | number;
  blockNumber?: number;
  // hex
  recoveryKey?: string;
  Echoer: Echoer;
}

export class NoteAccount {
  netId: number;
  blockNumber?: number;
  // Dedicated 32 bytes private key only used for note encryption, backed up to an Echoer and local for future derivation
  // Note that unlike the private key it shouldn't have the 0x prefix
  recoveryKey: string;
  // Address derived from recoveryKey, only used for frontend UI
  recoveryAddress: string;
  // Note encryption public key derived from recoveryKey
  recoveryPublicKey: string;
  Echoer: Echoer;

  constructor({ netId, blockNumber, recoveryKey, Echoer }: NoteAccountConstructor) {
    if (!recoveryKey) {
      recoveryKey = bytesToHex(crypto.getRandomValues(new Uint8Array(32))).slice(2);
    }

    this.netId = Math.floor(Number(netId));
    this.blockNumber = blockNumber;
    this.recoveryKey = recoveryKey;
    this.recoveryAddress = computeAddress('0x' + recoveryKey);
    this.recoveryPublicKey = getEncryptionPublicKey(recoveryKey);
    this.Echoer = Echoer;
  }

  /**
   * Intends to mock eth_getEncryptionPublicKey behavior from MetaMask
   * In order to make the recoveryKey retrival from Echoer possible from the bare private key
   */
  static getWalletPublicKey(wallet: Wallet) {
    let { privateKey } = wallet;

    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.replace('0x', '');
    }

    // Should return base64 encoded public key
    return getEncryptionPublicKey(privateKey);
  }

  // This function intends to provide an encrypted value of recoveryKey for an on-chain Echoer backup purpose
  // Thus, the pubKey should be derived by a Wallet instance or from Web3 wallets
  // pubKey: base64 encoded 32 bytes key from https://docs.metamask.io/wallet/reference/eth_getencryptionpublickey/
  getEncryptedAccount(walletPublicKey: string) {
    const encryptedData = encrypt({
      publicKey: walletPublicKey,
      data: this.recoveryKey,
      version: 'x25519-xsalsa20-poly1305',
    });

    const data = packEncryptedMessage(encryptedData);

    return {
      // Use this later to save hexPrivateKey generated with
      // Buffer.from(JSON.stringify(encryptedData)).toString('hex')
      // As we don't use buffer with this library we should leave UI to do the rest
      encryptedData,
      // Data that could be used as an echo(data) params
      data,
    };
  }

  /**
   * Decrypt Echoer backuped note encryption account with private keys
   */
  decryptAccountWithWallet(wallet: Wallet, event: EchoEvents): NoteAccount {
    let { privateKey } = wallet;

    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.replace('0x', '');
    }

    const unpackedMessage = unpackEncryptedMessage(event.encryptedAccount);

    const recoveryKey = decrypt({
      encryptedData: unpackedMessage,
      privateKey,
    });

    return new NoteAccount({
      netId: this.netId,
      blockNumber: event.blockNumber,
      recoveryKey,
      Echoer: this.Echoer,
    });
  }

  decryptNotes(events: EncryptedNotesEvents[]): DecryptedNotes[] {
    const decryptedEvents = [];

    for (const event of events) {
      try {
        const unpackedMessage = unpackEncryptedMessage(event.encryptedNote);

        const [address, noteHex] = decrypt({
          encryptedData: unpackedMessage,
          privateKey: this.recoveryKey,
        }).split('-');

        decryptedEvents.push({
          blockNumber: event.blockNumber,
          address,
          noteHex,
        });
      } catch {
        // decryption may fail for foreign notes
        continue;
      }
    }

    return decryptedEvents;
  }
}
