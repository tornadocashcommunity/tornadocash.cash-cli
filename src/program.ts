import 'dotenv/config';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import process from 'process';
import { createInterface } from 'readline';
import { Command } from 'commander';
import Table from 'cli-table3';
import colors from '@colors/colors';
import moment from 'moment';
import {
  Tornado__factory,
  TornadoRouter__factory,
  RelayerRegistry__factory,
  Aggregator__factory,
  Governance__factory,
  Echoer__factory,
} from '@tornado/contracts';
import {
  JsonRpcProvider,
  Provider,
  TransactionLike,
  Wallet,
  VoidSigner,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
  ZeroAddress,
  MaxUint256,
  Transaction,
  BigNumberish,
} from 'ethers';
import type MerkleTree from '@tornado/fixed-merkle-tree';
import * as packageJson from '../package.json';
import {
  ERC20,
  ERC20__factory,
  Multicall__factory,
  OffchainOracle__factory,
  OvmGasPriceOracle__factory,
} from './typechain';
import {
  parseUrl,
  parseRelayer,
  parseNumber,
  parseMnemonic,
  parseKey,
  parseAddress,
  getProviderOptions,
  getProviderWithNetId,
  getTokenBalances,
  TornadoWallet,
  TornadoVoidSigner,
  tokenBalances,
  Deposit,
  NodeDepositsService,
  DepositsEvents,
  WithdrawalsEvents,
  Relayer,
  RelayerInfo,
  RelayerError,
  NodeRegistryService,
  TornadoFeeOracle,
  TokenPriceOracle,
  calculateSnarkProof,
  NodeEchoService,
  NodeEncryptedNotesService,
  NodeGovernanceService,
  RelayerClient,
  MerkleTreeService,
  multicall,
  Invoice,
  fetchData,
  fetchDataOptions,
  networkConfig,
  getInstanceByAddress,
  subdomains,
  Config,
  enabledChains,
  substring,
  NoteAccount,
  parseRecoveryKey,
} from './services';

const DEFAULT_GAS_LIMIT = 600_000;
const RELAYER_NETWORK = 1;
const TOKEN_PRICE_ORACLE = '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8';

// Where cached events, trees, circuits, and key is saved
const STATIC_DIR = process.env.CACHE_DIR || path.join(__dirname, '../static');
const EVENTS_DIR = path.join(STATIC_DIR, './events');
const TREES_DIR = path.join(STATIC_DIR, './trees');
const MERKLE_WORKER_PATH =
  process.env.DISABLE_MERKLE_WORKER === 'true' ? undefined : path.join(STATIC_DIR, './merkleTreeWorker.js');

// Where we should backup notes and save events
const USER_DIR = process.env.USER_DIR || '.';
const SAVED_DIR = path.join(USER_DIR, './events');

const CIRCUIT_PATH = path.join(__dirname, '../static/tornado.json');
const KEY_PATH = path.join(__dirname, '../static/tornadoProvingKey.bin');

interface packageJson {
  name: string;
  version: string;
  description: string;
}

export type commonProgramOptions = {
  rpc?: string;
  ethRpc?: string;
  graph?: string;
  ethGraph?: string;
  disableGraph?: boolean;
  accountKey?: string;
  relayer?: string;
  walletWithdrawal?: boolean;
  torPort?: number;
  token?: string;
  viewOnly?: string;
  mnemonic?: string;
  mnemonicIndex?: number;
  privateKey?: string;
  nonInteractive?: boolean;
  localRpc?: boolean;
};

export async function promptConfirmation(nonInteractive?: boolean) {
  if (nonInteractive) {
    return;
  }

  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  const query = 'Confirm? [Y/n]\n';

  const confirmation = await new Promise((resolve) => prompt.question(query, resolve));

  if (!confirmation || (confirmation as string).toUpperCase() !== 'Y') {
    throw new Error('User canceled');
  }
}

export async function getIPAddress(fetchDataOptions: fetchDataOptions) {
  const htmlIPInfo = await fetchData('https://check.torproject.org', {
    ...fetchDataOptions,
    method: 'GET',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
  const ip = htmlIPInfo.split('Your IP address appears to be:  <strong>').pop().split('</')[0];
  const isTor = htmlIPInfo.includes('Sorry. You are not using Tor.') ? false : true;

  return {
    ip,
    isTor,
  };
}

export async function getProgramOptions(options: commonProgramOptions): Promise<{
  options: commonProgramOptions;
  fetchDataOptions: fetchDataOptions;
}> {
  options = {
    rpc: options.rpc || (process.env.RPC_URL ? parseUrl(process.env.RPC_URL) : undefined),
    ethRpc: options.ethRpc || (process.env.ETHRPC_URL ? parseUrl(process.env.ETHRPC_URL) : undefined),
    graph: options.graph || (process.env.GRAPH_URL ? parseUrl(process.env.GRAPH_URL) : undefined),
    ethGraph: options.ethGraph || (process.env.ETHGRAPH_URL ? parseUrl(process.env.ETHGRAPH_URL) : undefined),
    disableGraph: Boolean(options.disableGraph) || (process.env.DISABLE_GRAPH === 'true' ? true : undefined),
    accountKey: options.accountKey || (process.env.ACCOUNT_KEY ? parseRecoveryKey(process.env.ACCOUNT_KEY) : undefined),
    relayer: options.relayer || (process.env.RELAYER ? parseRelayer(process.env.RELAYER) : undefined),
    walletWithdrawal:
      Boolean(options.walletWithdrawal) || (process.env.WALLET_WITHDRAWAL === 'true' ? true : undefined),
    torPort: options.torPort || (process.env.TOR_PORT ? parseNumber(process.env.TOR_PORT) : undefined),
    token: options.token || (process.env.TOKEN ? parseAddress(process.env.TOKEN) : undefined),
    viewOnly: options.viewOnly || (process.env.VIEW_ONLY ? parseAddress(process.env.VIEW_ONLY) : undefined),
    mnemonic: options.mnemonic || (process.env.MNEMONIC ? parseMnemonic(process.env.MNEMONIC) : undefined),
    mnemonicIndex:
      options.mnemonicIndex || (process.env.MNEMONIC_INDEX ? parseNumber(process.env.MNEMONIC_INDEX) : undefined),
    privateKey: options.privateKey || (process.env.PRIVATE_KEY ? parseKey(process.env.PRIVATE_KEY) : undefined),
    nonInteractive: Boolean(options.nonInteractive) || (process.env.NON_INTERACTIVE === 'true' ? true : undefined),
    localRpc: Boolean(options.localRpc) || (process.env.LOCAL_RPC === 'true' ? true : undefined),
  };

  const fetchDataOptions = {
    torPort: options.torPort,
  };

  const { ip, isTor } = await getIPAddress(fetchDataOptions);

  const optionsTable = new Table();

  optionsTable.push(
    [{ colSpan: 2, content: 'Program Options', hAlign: 'center' }],
    ['IP', ip],
    ['Is Tor', isTor],
    ...(Object.keys(options)
      .map((key) => {
        const value = (options as unknown as { [key in string]: string })[key];

        if (typeof value !== 'undefined') {
          return [key, (options as unknown as { [key in string]: string })[key]];
        }
      })
      .filter((r) => r) as string[][]),
  );

  console.log('\n' + optionsTable.toString() + '\n');

  await promptConfirmation(options.nonInteractive);

  return {
    options,
    fetchDataOptions,
  };
}

export function getProgramGraphAPI(options: commonProgramOptions, config: Config): string {
  if (options.disableGraph) {
    return '';
  }

  if (!options.graph) {
    return Object.values(config.subgraphs)[0].url;
  }

  return options.graph;
}

export function getProgramProvider(
  netId: BigNumberish,
  rpcUrl: string = '',
  config: Config,
  providerOptions?: getProviderOptions,
): JsonRpcProvider {
  if (!rpcUrl) {
    rpcUrl = Object.values(config.rpcUrls)[0].url;
  }

  return getProviderWithNetId(netId, rpcUrl, config, providerOptions);
}

export function getProgramSigner({
  options,
  provider,
}: {
  options: commonProgramOptions;
  provider: Provider;
}): TornadoVoidSigner | TornadoWallet | undefined {
  if (options.viewOnly) {
    return new TornadoVoidSigner(options.viewOnly, provider);
  }

  if (options.privateKey) {
    return new TornadoWallet(options.privateKey, provider);
  }

  if (options.mnemonic) {
    return TornadoWallet.fromMnemonic(options.mnemonic, provider, options.mnemonicIndex);
  }
}

export async function getProgramRelayer({
  options,
  fetchDataOptions,
  netId,
}: {
  options: commonProgramOptions;
  fetchDataOptions?: fetchDataOptions;
  netId: number | string;
}): Promise<{
  validRelayers?: RelayerInfo[] | Relayer[];
  invalidRelayers?: RelayerError[];
  relayerClient?: RelayerClient;
}> {
  const { ethRpc, ethGraph, relayer, disableGraph } = options;

  const netConfig = networkConfig[`netId${netId}`];

  const ethConfig = networkConfig[`netId${RELAYER_NETWORK}`];

  const {
    aggregatorContract,
    registryContract,
    registrySubgraph,
    constants: { REGISTRY_BLOCK },
  } = ethConfig;

  const provider = getProgramProvider(1, ethRpc, ethConfig, {
    ...fetchDataOptions,
  });

  const graphApi = getProgramGraphAPI(
    {
      disableGraph,
      graph: ethGraph,
    },
    ethConfig,
  );

  const registryService = new NodeRegistryService({
    netId: RELAYER_NETWORK,
    provider,
    graphApi,
    subgraphName: registrySubgraph,
    RelayerRegistry: RelayerRegistry__factory.connect(registryContract as string, provider),
    deployedBlock: REGISTRY_BLOCK,
    fetchDataOptions,
    cacheDirectory: EVENTS_DIR,
    userDirectory: SAVED_DIR,
  });

  const relayerClient = new RelayerClient({
    netId,
    config: netConfig,
    Aggregator: Aggregator__factory.connect(aggregatorContract as string, provider),
    fetchDataOptions,
  });

  if (relayer) {
    if (!relayer.endsWith('.eth')) {
      const relayerStatus = await relayerClient.askRelayerStatus({
        hostname: new URL(relayer).hostname,
      });

      if (relayerStatus) {
        relayerClient.selectedRelayer = {
          netId: relayerStatus.netId,
          url: relayerStatus.url,
          rewardAccount: relayerStatus.rewardAccount,
          currentQueue: relayerStatus.currentQueue,
          tornadoServiceFee: relayerStatus.tornadoServiceFee,
        };
      }

      return {
        validRelayers: relayerClient.selectedRelayer ? [relayerClient.selectedRelayer] : [],
        invalidRelayers: [],
        relayerClient,
      };
    } else {
      const { validRelayers } = await relayerClient.getValidRelayers([{ ensName: relayer }], subdomains, true);
      const relayerStatus = validRelayers[0];

      if (relayerStatus) {
        relayerClient.selectedRelayer = {
          netId: relayerStatus.netId,
          url: relayerStatus.url,
          rewardAccount: relayerStatus.rewardAccount,
          currentQueue: relayerStatus.currentQueue,
          tornadoServiceFee: relayerStatus.tornadoServiceFee,
        };
      }

      return {
        validRelayers,
        invalidRelayers: [],
        relayerClient,
      };
    }
  }

  console.log('\nGetting valid relayers from registry, would take some time\n');

  const { validRelayers, invalidRelayers } = await relayerClient.getValidRelayers(
    await registryService.fetchRelayers(),
    subdomains,
  );

  const relayerStatus = relayerClient.pickWeightedRandomRelayer(validRelayers);

  if (relayerStatus) {
    relayerClient.selectedRelayer = {
      netId: relayerStatus.netId,
      url: relayerStatus.url,
      rewardAccount: relayerStatus.rewardAccount,
      currentQueue: relayerStatus.currentQueue,
      tornadoServiceFee: relayerStatus.tornadoServiceFee,
    };
  }

  return {
    validRelayers,
    invalidRelayers,
    relayerClient,
  };
}

export async function programSendTransaction({
  signer,
  options,
  populatedTransaction,
}: {
  signer: VoidSigner | Wallet;
  options: commonProgramOptions;
  populatedTransaction: TransactionLike;
}) {
  const txTable = new Table();
  // ethers.js doesn't output complete transaction from the contract runner so we populate the transaction once again
  const txObject =
    !populatedTransaction.gasLimit || !populatedTransaction.from
      ? (JSON.parse(JSON.stringify(await signer.populateTransaction(populatedTransaction))) as TransactionLike)
      : (JSON.parse(JSON.stringify(populatedTransaction, null, 2)) as TransactionLike);

  const txKeys = Object.keys(txObject);
  const txValues = Object.values(txObject);
  const txType =
    signer instanceof VoidSigner
      ? 'Unsigned Transaction'
      : options.localRpc
        ? 'Unbroadcasted Transaction'
        : 'Send Transaction?';

  txTable.push(
    [{ colSpan: 2, content: txType, hAlign: 'center' }],
    ...txKeys.map((key, index) => {
      if (key === 'data' && txValues[index]) {
        return ['data', substring(txValues[index], 40)];
      }
      return [key, txValues[index]];
    }),
  );

  if (txType === 'Unsigned Transaction') {
    // delete from field as the Transaction.from method doesn't accept it from unsigned tx
    delete txObject.from;
    const transaction = Transaction.from(txObject);
    console.log('\n' + txTable.toString() + '\n');
    console.log('Sign this transaction:\n');
    console.log(`${transaction.unsignedSerialized}\n`);
    return;
  }

  if (txType === 'Unbroadcasted Transaction') {
    const signedTx = await signer.signTransaction(txObject);
    console.log('\n' + txTable.toString() + '\n');
    console.log('Broadcast transaction:\n');
    console.log(`${signedTx}\n`);
    return;
  }

  console.log('\n' + txTable.toString() + '\n');

  await promptConfirmation(options.nonInteractive);

  const { hash } = await signer.sendTransaction(txObject);

  console.log(`Sent transaction ${hash}\n`);
}

export function tornadoProgram() {
  const { name, version, description } = packageJson as packageJson;

  const program = new Command();

  program.name(name).version(version).description(description);

  program
    .command('create')
    .description('Creates Tornado Cash deposit note and deposit invoice')
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument('<currency>', 'Currency to deposit on Tornado Cash')
    .argument('<amount>', 'Amount to deposit on Tornado Cash')
    .action(async (netId: string | number, currency: string, amount: string) => {
      currency = currency.toLowerCase();

      const config = networkConfig[`netId${netId}`];

      const {
        routerContract,
        nativeCurrency,
        tokens: { [currency]: currencyConfig },
      } = config;

      const {
        decimals,
        tokenAddress,
        instanceAddress: { [amount]: instanceAddress },
      } = currencyConfig;

      const isEth = nativeCurrency === currency;
      const denomination = parseUnits(amount, decimals);

      const deposit = await Deposit.createNote({ currency, amount, netId });

      const { noteHex, note, commitmentHex } = deposit;

      const ERC20Interface = ERC20__factory.createInterface();
      const TornadoRouterInterface = TornadoRouter__factory.createInterface();

      console.log(`New deposit: ${deposit.toString()}\n`);

      await writeFile(`./backup-tornado-${currency}-${amount}-${netId}-${noteHex.slice(0, 10)}.txt`, note, {
        encoding: 'utf8',
      });

      const depositData = TornadoRouterInterface.encodeFunctionData('deposit', [instanceAddress, commitmentHex, '0x']);

      if (!isEth) {
        const approveData = ERC20Interface.encodeFunctionData('approve', [routerContract, MaxUint256]);

        console.log(`Approve Data: ${JSON.stringify({ to: tokenAddress, data: approveData }, null, 2)}]\n`);

        console.log(`Transaction Data: ${JSON.stringify({ to: routerContract, data: depositData }, null, 2)}\n`);
      } else {
        console.log(
          `Transaction Data: ${JSON.stringify({ to: routerContract, value: denomination.toString(), data: depositData }, null, 2)}`,
        );
      }

      process.exit(0);
    });

  program
    .command('deposit')
    .description(
      'Submit a deposit of specified currency and amount from default eth account and return the resulting note. \n\n' +
        'The currency is one of (ETH|DAI|cDAI|USDC|cUSDC|USDT). \n\n' +
        'The amount depends on currency, see config.js file or see Tornado Cash UI.',
    )
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument('<currency>', 'Currency to deposit on Tornado Cash')
    .argument('<amount>', 'Amount to deposit on Tornado Cash')
    .action(async (netId: string | number, currency: string, amount: string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      currency = currency.toLowerCase();
      const { rpc, accountKey } = options;

      const config = networkConfig[`netId${netId}`];

      const {
        multicall: multicallAddress,
        routerContract,
        echoContract,
        nativeCurrency,
        tokens: { [currency]: currencyConfig },
      } = config;

      const {
        decimals,
        tokenAddress,
        instanceAddress: { [amount]: instanceAddress },
      } = currencyConfig;

      const isEth = nativeCurrency === currency;
      const denomination = parseUnits(amount, decimals);

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const signer = getProgramSigner({
        options,
        provider,
      });

      const noteAccount = accountKey
        ? new NoteAccount({
            netId,
            recoveryKey: accountKey,
            Echoer: Echoer__factory.connect(echoContract, provider),
          })
        : undefined;

      if (!signer) {
        throw new Error(
          'Signer not defined, make sure you have either viewOnly address, mnemonic, or private key configured',
        );
      }

      const TornadoProxy = TornadoRouter__factory.connect(routerContract, signer);
      const Multicall = Multicall__factory.connect(multicallAddress, provider);
      const Token = tokenAddress ? ERC20__factory.connect(tokenAddress, signer) : undefined;

      const [ethBalance, tokenBalance, tokenApprovals] = await multicall(Multicall, [
        {
          contract: Multicall,
          name: 'getEthBalance',
          params: [signer.address],
        },
        ...(!isEth
          ? [
              {
                contract: Token as ERC20,
                name: 'balanceOf',
                params: [signer.address],
              },
              {
                contract: Token as ERC20,
                name: 'allowance',
                params: [signer.address, routerContract],
              },
            ]
          : []),
      ]);

      if (isEth && denomination > ethBalance) {
        const errMsg = `Invalid ${currency.toUpperCase()} balance, wants ${amount} have ${formatUnits(ethBalance, decimals)}`;
        throw new Error(errMsg);
      } else if (!isEth && denomination > tokenBalance) {
        const errMsg = `Invalid ${currency.toUpperCase()} balance, wants ${amount} have ${formatUnits(tokenBalance, decimals)}`;
        throw new Error(errMsg);
      }

      if (!isEth && denomination > tokenApprovals) {
        // token approval
        await programSendTransaction({
          signer,
          options,
          populatedTransaction: await (Token as ERC20).approve.populateTransaction(routerContract, MaxUint256),
        });

        // wait until signer sends the approve transaction offline
        if (signer instanceof VoidSigner || options.localRpc) {
          console.log(
            'Signer can not sign or broadcast transactions, please send the token approve transaction first and try again.\n',
          );
          process.exit(0);
        }
      }

      const deposit = await Deposit.createNote({ currency, amount, netId });

      const { note, noteHex, commitmentHex } = deposit;

      const encryptedNote = noteAccount
        ? noteAccount.encryptNote({
            address: instanceAddress,
            noteHex,
          })
        : '0x';

      const backupFile = `./backup-tornado-${currency}-${amount}-${netId}-${noteHex.slice(0, 10)}.txt`;

      console.log(`New deposit: ${deposit.toString()}\n`);

      console.log(`Writing note backup at ${backupFile}\n`);

      await writeFile(backupFile, note, { encoding: 'utf8' });

      if (encryptedNote !== '0x') {
        console.log(`Storing encrypted note on-chain for backup (Account key: ${accountKey})\n`);
      }

      await programSendTransaction({
        signer,
        options,
        populatedTransaction: await TornadoProxy.deposit.populateTransaction(
          instanceAddress,
          commitmentHex,
          encryptedNote,
          {
            value: isEth ? denomination : BigInt(0),
          },
        ),
      });

      process.exit(0);
    });

  program
    .command('depositInvoice')
    .description(
      'Submit a deposit of tornado invoice from default eth account and return the resulting note. \n\n' +
        'Useful to deposit on online computer without exposing note',
    )
    .argument('<invoice>', 'Tornado Cash Invoice generated from create command')
    .action(async (invoiceString: string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;

      const { currency, amount, netId, commitment } = new Invoice(invoiceString);

      const config = networkConfig[`netId${netId}`];

      const {
        multicall: multicallAddress,
        routerContract,
        nativeCurrency,
        tokens: { [currency]: currencyConfig },
      } = config;

      const {
        decimals,
        tokenAddress,
        instanceAddress: { [amount]: instanceAddress },
      } = currencyConfig;

      const isEth = nativeCurrency === currency;
      const denomination = parseUnits(amount, decimals);

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const signer = getProgramSigner({
        options,
        provider,
      });

      if (!signer) {
        throw new Error(
          'Signer not defined, make sure you have either viewOnly address, mnemonic, or private key configured',
        );
      }

      const TornadoProxy = TornadoRouter__factory.connect(routerContract, signer);
      const Multicall = Multicall__factory.connect(multicallAddress, provider);
      const Token = tokenAddress ? ERC20__factory.connect(tokenAddress, signer) : undefined;

      const [ethBalance, tokenBalance, tokenApprovals] = await multicall(Multicall, [
        {
          contract: Multicall,
          name: 'getEthBalance',
          params: [signer.address],
        },
        ...(!isEth
          ? [
              {
                contract: Token as ERC20,
                name: 'balanceOf',
                params: [signer.address],
              },
              {
                contract: Token as ERC20,
                name: 'allowance',
                params: [signer.address, routerContract],
              },
            ]
          : []),
      ]);

      if (isEth && denomination > ethBalance) {
        const errMsg = `Invalid ${currency.toUpperCase()} balance, wants ${amount} have ${formatUnits(ethBalance, decimals)}`;
        throw new Error(errMsg);
      } else if (!isEth && denomination > tokenBalance) {
        const errMsg = `Invalid ${currency.toUpperCase()} balance, wants ${amount} have ${formatUnits(tokenBalance, decimals)}`;
        throw new Error(errMsg);
      }

      if (!isEth && denomination > tokenApprovals) {
        // token approval
        await programSendTransaction({
          signer,
          options,
          populatedTransaction: await (Token as ERC20).approve.populateTransaction(routerContract, MaxUint256),
        });

        // wait until signer sends the approve transaction offline
        if (signer instanceof VoidSigner) {
          console.log(
            'Signer can not sign transactions, please send the token approve transaction first and try again.\n',
          );
          process.exit(0);
        }
      }

      await programSendTransaction({
        signer,
        options,
        populatedTransaction: await TornadoProxy.deposit.populateTransaction(instanceAddress, commitment, '0x', {
          value: isEth ? denomination : BigInt(0),
        }),
      });

      process.exit(0);
    });

  program
    .command('withdraw')
    .description(
      'Withdraw a note to a recipient account using relayer or specified private key. \n\n' +
        'You can exchange some of your deposit`s tokens to ETH during the withdrawal by ' +
        'specifing ETH_purchase (e.g. 0.01) to pay for gas in future transactions. \n\n' +
        'Also see the --relayer option.\n\n',
    )
    .argument('<note>', 'Tornado Cash Deposit Note')
    .argument('<recipient>', 'Recipient to receive withdrawn amount', parseAddress)
    .argument('[ETH_purchase]', 'ETH to purchase', parseNumber)
    .action(
      async (note: string, recipient: string, ethPurchase: number | undefined, cmdOptions: commonProgramOptions) => {
        const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
        const { rpc, walletWithdrawal } = options;

        const deposit = await Deposit.parseNote(note);

        const { netId, currency, amount, commitmentHex, nullifierHex, nullifier, secret } = deposit;

        const config = networkConfig[`netId${netId}`];

        const {
          tornadoSubgraph,
          deployedBlock,
          nativeCurrency,
          routerContract,
          multicall: multicallAddress,
          ovmGasPriceOracleContract,
          tokens: { [currency]: currencyConfig },
        } = config;

        const {
          decimals,
          tokenAddress,
          gasLimit: instanceGasLimit,
          tokenGasLimit,
          instanceAddress: { [amount]: instanceAddress },
        } = currencyConfig;

        const isEth = nativeCurrency === currency;
        const denomination = parseUnits(amount, decimals);
        const firstAmount = Object.keys(currencyConfig.instanceAddress).sort((a, b) => Number(a) - Number(b))[0];
        const isFirstAmount = Number(amount) === Number(firstAmount);

        const provider = getProgramProvider(netId, rpc, config, {
          ...fetchDataOptions,
        });

        const signer = getProgramSigner({
          options,
          provider,
        });
        const noSigner = Boolean(!signer || signer instanceof VoidSigner);

        if (walletWithdrawal && noSigner) {
          throw new Error('Wallet withdrawal is configured however could not find any wallets');
        }

        const graphApi = getProgramGraphAPI(options, config);

        const Tornado = Tornado__factory.connect(instanceAddress, provider);
        const TornadoProxy = TornadoRouter__factory.connect(routerContract, !walletWithdrawal ? provider : signer);
        const Multicall = Multicall__factory.connect(multicallAddress, provider);

        const tornadoFeeOracle = new TornadoFeeOracle(
          ovmGasPriceOracleContract
            ? OvmGasPriceOracle__factory.connect(ovmGasPriceOracleContract, provider)
            : undefined,
        );
        const tokenPriceOracle = new TokenPriceOracle(
          provider,
          Multicall,
          OffchainOracle__factory.connect(TOKEN_PRICE_ORACLE, provider),
        );

        const depositsServiceConstructor = {
          netId,
          provider,
          graphApi,
          subgraphName: tornadoSubgraph,
          Tornado,
          amount,
          currency,
          deployedBlock,
          fetchDataOptions,
          cacheDirectory: EVENTS_DIR,
          userDirectory: SAVED_DIR,
        };

        const depositsService = new NodeDepositsService({
          ...depositsServiceConstructor,
          type: 'Deposit',
        });

        const withdrawalsService = new NodeDepositsService({
          ...depositsServiceConstructor,
          type: 'Withdrawal',
        });

        const merkleTreeService = new MerkleTreeService({
          netId,
          amount,
          currency,
          Tornado,
          merkleWorkerPath: MERKLE_WORKER_PATH,
        });

        const depositEvents = (await depositsService.updateEvents()).events as DepositsEvents[];

        // If we have MERKLE_WORKER_PATH run worker at background otherwise resolve it here
        const depositTreeInitiator = await (async () => {
          if (MERKLE_WORKER_PATH) {
            return () => merkleTreeService.verifyTree(depositEvents) as Promise<MerkleTree>;
          }
          return (await merkleTreeService.verifyTree(depositEvents)) as MerkleTree;
        })();

        let depositTreePromise: Promise<MerkleTree> | MerkleTree;

        if (typeof depositTreeInitiator === 'function') {
          depositTreePromise = depositTreeInitiator();
        } else {
          depositTreePromise = depositTreeInitiator;
        }

        const withdrawalEvents = (await withdrawalsService.updateEvents()).events as WithdrawalsEvents[];

        const depositEvent = depositEvents.find(({ commitment }) => commitment === commitmentHex);

        const withdrawalEvent = withdrawalEvents.find(({ nullifierHash }) => nullifierHash === nullifierHex);

        if (!depositEvent) {
          throw new Error('Deposit not found');
        }

        const complianceTable = new Table();

        const depositDate = new Date(depositEvent.timestamp * 1000);

        complianceTable.push(
          [{ colSpan: 2, content: 'Deposit', hAlign: 'center' }],
          ['Deposit', `${amount} ${currency.toUpperCase()}`],
          [
            'Date',
            `${depositDate.toLocaleDateString()} ${depositDate.toLocaleTimeString()} (${moment.unix(depositEvent.timestamp).fromNow()})`,
          ],
          ['From', depositEvent.from],
          ['Transaction', depositEvent.transactionHash],
          ['Commitment', commitmentHex],
          ['Spent', Boolean(withdrawalEvent)],
        );

        if (withdrawalEvent) {
          const withdrawalDate = new Date(withdrawalEvent.timestamp * 1000);

          complianceTable.push(
            [{ colSpan: 2, content: 'Withdraw', hAlign: 'center' }],
            ['Withdrawal', `${amount} ${currency.toUpperCase()}`],
            ['Relayer Fee', `${formatUnits(withdrawalEvent.fee, decimals)} ${currency.toUpperCase()}`],
            [
              'Date',
              `${withdrawalDate.toLocaleDateString()} ${withdrawalDate.toLocaleTimeString()} (${moment.unix(withdrawalEvent.timestamp).fromNow()})`,
            ],
            ['To', withdrawalEvent.to],
            ['Transaction', withdrawalEvent.transactionHash],
            ['Nullifier', nullifierHex],
          );
        }

        console.log('\n\n' + complianceTable.toString() + '\n');

        if (withdrawalEvent) {
          throw new Error('Note is already spent');
        }

        const [circuit, provingKey, tree, relayerClient, l1Fee, tokenPriceInWei, feeData] = await Promise.all([
          readFile(CIRCUIT_PATH, { encoding: 'utf8' }).then((s) => JSON.parse(s)),
          readFile(KEY_PATH).then((b) => new Uint8Array(b).buffer),
          depositTreePromise,
          !walletWithdrawal
            ? getProgramRelayer({
                options,
                fetchDataOptions,
                netId,
              }).then(({ relayerClient }) => relayerClient)
            : undefined,
          tornadoFeeOracle.fetchL1OptimismFee(),
          !isEth ? tokenPriceOracle.fetchPrices([tokenAddress as string]).then((p) => p[0]) : BigInt(0),
          provider.getFeeData(),
        ]);

        if (!walletWithdrawal && !relayerClient?.selectedRelayer) {
          throw new Error(
            'No valid relayer found for the network, you can either try again, or find any relayers using the relayers command and set with --relayer option',
          );
        }

        const { url, rewardAccount, tornadoServiceFee } = relayerClient?.selectedRelayer || {};

        let gasPrice: bigint = feeData.maxFeePerGas
          ? feeData.maxFeePerGas + (feeData.maxPriorityFeePerGas || BigInt(0))
          : (feeData.gasPrice as bigint);

        if (netId === 56 && gasPrice < parseUnits('3.3', 'gwei')) {
          gasPrice = parseUnits('3.3', 'gwei');
        }

        // If the config overrides default gas limit we override
        const defaultGasLimit = instanceGasLimit ? BigInt(instanceGasLimit) : BigInt(DEFAULT_GAS_LIMIT);
        let gasLimit = defaultGasLimit;

        // If the denomination is small only refund small amount otherwise use the default value
        const refundGasLimit = isFirstAmount && tokenGasLimit ? BigInt(tokenGasLimit) : undefined;

        const ethRefund = ethPurchase
          ? parseEther(`${ethPurchase}`)
          : !isEth
            ? tornadoFeeOracle.defaultEthRefund(gasPrice, refundGasLimit)
            : BigInt(0);

        if (isEth && ethRefund) {
          throw new Error('Can not purchase native assets on native asset withdrawal');
        }

        async function getProof() {
          let relayerFee = BigInt(0);

          if (!walletWithdrawal) {
            relayerFee = tornadoFeeOracle.calculateRelayerFee({
              gasPrice,
              gasLimit,
              l1Fee,
              denomination,
              ethRefund,
              tokenPriceInWei,
              tokenDecimals: decimals,
              relayerFeePercent: tornadoServiceFee,
              isEth,
            });

            if (relayerFee > denomination) {
              const errMsg =
                `Relayer fee ${formatUnits(relayerFee, decimals)} ${currency.toUpperCase()} ` +
                `exceeds the deposit amount ${amount} ${currency.toUpperCase()}.`;
              throw new Error(errMsg);
            }
          }

          const { pathElements, pathIndices } = tree.path((depositEvent as DepositsEvents).leafIndex);

          const { proof, args } = await calculateSnarkProof(
            {
              root: tree.root,
              nullifierHex,
              recipient,
              relayer: !walletWithdrawal ? (rewardAccount as string) : ZeroAddress,
              fee: relayerFee,
              refund: ethRefund,
              nullifier,
              secret,
              pathElements,
              pathIndices,
            },
            circuit,
            provingKey,
          );

          return {
            relayerFee,
            proof,
            args,
          };
        }

        let { relayerFee, proof, args } = await getProof();

        const withdrawOverrides = {
          from: !walletWithdrawal ? (rewardAccount as string) : (signer?.address as string),
          value: args[5] || 0,
        };

        gasLimit = await TornadoProxy.withdraw.estimateGas(instanceAddress, proof, ...args, withdrawOverrides);

        if (gasLimit > defaultGasLimit) {
          ({ relayerFee, proof, args } = await getProof());
          gasLimit = await TornadoProxy.withdraw.estimateGas(instanceAddress, proof, ...args, withdrawOverrides);
        }

        const withdrawTable = new Table();
        withdrawTable.push([{ colSpan: 2, content: 'Withdrawal Info', hAlign: 'center' }]);

        // withdraw using relayer
        if (!walletWithdrawal && relayerClient) {
          withdrawTable.push(
            [{ colSpan: 2, content: 'Withdraw', hAlign: 'center' }],
            ['Withdrawal', `${amount} ${currency.toUpperCase()}`],
            ['Relayer', `${url}`],
            [
              'Relayer Fee',
              `${formatUnits(relayerFee, decimals)} ${currency.toUpperCase()} ` +
                `(${((Number(relayerFee) / Number(denomination)) * 100).toFixed(5)}%)`,
            ],
            ['Relayer Fee Percent', `${tornadoServiceFee}%`],
            [
              'Amount to receive',
              `${Number(formatUnits(denomination - relayerFee, decimals)).toFixed(5)} ${currency.toUpperCase()}`,
            ],
            [`${nativeCurrency.toUpperCase()} purchase`, `${formatEther(ethRefund)} ${nativeCurrency.toUpperCase()}`],
            ['To', recipient],
            ['Nullifier', nullifierHex],
          );

          console.log('\n' + withdrawTable.toString() + '\n');

          await promptConfirmation(options.nonInteractive);

          console.log('Sending withdraw transaction through relay\n');

          await relayerClient.tornadoWithdraw({
            contract: instanceAddress,
            proof,
            args,
          });
        } else {
          // withdraw from wallet

          const txFee = gasPrice * gasLimit;
          const txFeeInToken = !isEth
            ? tornadoFeeOracle.calculateTokenAmount(txFee, tokenPriceInWei, decimals)
            : BigInt(0);
          const txFeeString = !isEth
            ? `(${Number(formatUnits(txFeeInToken, decimals)).toFixed(5)} ${currency.toUpperCase()} worth) ` +
              `(${((Number(formatUnits(txFeeInToken, decimals)) / Number(amount)) * 100).toFixed(5)}%)`
            : `(${((Number(formatUnits(txFee, decimals)) / Number(amount)) * 100).toFixed(5)}%)`;

          withdrawTable.push(
            [{ colSpan: 2, content: 'Withdraw', hAlign: 'center' }],
            ['Withdrawal', `${amount} ${currency.toUpperCase()}`],
            ['From', `${signer?.address}`],
            [
              'Transaction Fee',
              `${Number(formatEther(txFee)).toFixed(5)} ${nativeCurrency.toUpperCase()} ` + txFeeString,
            ],
            ['Amount to receive', `${amount} ${currency.toUpperCase()}`],
            ['To', recipient],
            ['Nullifier', nullifierHex],
          );

          console.log('\n' + withdrawTable.toString() + '\n');

          await promptConfirmation(options.nonInteractive);

          console.log('Sending withdraw transaction through wallet\n');

          await programSendTransaction({
            signer: signer as TornadoVoidSigner | TornadoWallet,
            options,
            populatedTransaction: await TornadoProxy.withdraw.populateTransaction(instanceAddress, proof, ...args),
          });
        }

        process.exit(0);
      },
    );

  program
    .command('compliance')
    .description(
      'Shows the deposit and withdrawal of the provided note. \n\n' +
        'This might be necessary to show the origin of assets held in your withdrawal address. \n\n',
    )
    .argument('<note>', 'Tornado Cash Deposit Note')
    .action(async (note: string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;

      const deposit = await Deposit.parseNote(note);
      const { netId, currency, amount, commitmentHex, nullifierHex } = deposit;

      const config = networkConfig[`netId${netId}`];

      const {
        tornadoSubgraph,
        deployedBlock,
        tokens: { [currency]: currencyConfig },
      } = config;

      const {
        decimals,
        instanceAddress: { [amount]: instanceAddress },
      } = currencyConfig;

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const graphApi = getProgramGraphAPI(options, config);

      const Tornado = Tornado__factory.connect(instanceAddress, provider);

      const depositsServiceConstructor = {
        netId,
        provider,
        graphApi,
        subgraphName: tornadoSubgraph,
        Tornado,
        amount,
        currency,
        deployedBlock,
        fetchDataOptions,
        cacheDirectory: EVENTS_DIR,
        userDirectory: SAVED_DIR,
      };

      const depositsService = new NodeDepositsService({
        ...depositsServiceConstructor,
        type: 'Deposit',
      });

      const withdrawalsService = new NodeDepositsService({
        ...depositsServiceConstructor,
        type: 'Withdrawal',
      });

      const merkleTreeService = new MerkleTreeService({
        netId,
        amount,
        currency,
        Tornado,
        merkleWorkerPath: MERKLE_WORKER_PATH,
      });

      const depositEvents = (await depositsService.updateEvents()).events as DepositsEvents[];

      // If we have MERKLE_WORKER_PATH run worker at background otherwise resolve it here
      const depositTreePromise = await (async () => {
        if (MERKLE_WORKER_PATH) {
          return () => merkleTreeService.verifyTree(depositEvents) as Promise<MerkleTree>;
        }
        return (await merkleTreeService.verifyTree(depositEvents)) as MerkleTree;
      })();

      const [withdrawalEvents] = await Promise.all([
        withdrawalsService.updateEvents().then(({ events }) => events as WithdrawalsEvents[]),
        typeof depositTreePromise === 'function' ? depositTreePromise() : depositTreePromise,
      ]);

      const depositEvent = depositEvents.find(({ commitment }) => commitment === commitmentHex);

      const withdrawalEvent = withdrawalEvents.find(({ nullifierHash }) => nullifierHash === nullifierHex);

      const complianceTable = new Table();
      complianceTable.push([{ colSpan: 2, content: 'Compliance Info', hAlign: 'center' }]);

      if (!depositEvent) {
        complianceTable.push([{ colSpan: 2, content: 'Deposit', hAlign: 'center' }], ['Deposit', 'Not Found']);
      } else {
        const depositDate = new Date(depositEvent.timestamp * 1000);

        complianceTable.push(
          [{ colSpan: 2, content: 'Deposit', hAlign: 'center' }],
          ['Deposit', `${amount} ${currency.toUpperCase()}`],
          [
            'Date',
            `${depositDate.toLocaleDateString()} ${depositDate.toLocaleTimeString()} (${moment.unix(depositEvent.timestamp).fromNow()})`,
          ],
          ['From', depositEvent.from],
          ['Transaction', depositEvent.transactionHash],
          ['Commitment', commitmentHex],
          ['Spent', Boolean(withdrawalEvent)],
        );
      }

      if (withdrawalEvent) {
        const withdrawalDate = new Date(withdrawalEvent.timestamp * 1000);

        complianceTable.push(
          [{ colSpan: 2, content: 'Withdraw', hAlign: 'center' }],
          ['Withdrawal', `${amount} ${currency.toUpperCase()}`],
          ['Relayer Fee', `${formatUnits(withdrawalEvent.fee, decimals)} ${currency.toUpperCase()}`],
          [
            'Date',
            `${withdrawalDate.toLocaleDateString()} ${withdrawalDate.toLocaleTimeString()} (${moment.unix(withdrawalEvent.timestamp).fromNow()})`,
          ],
          ['To', withdrawalEvent.to],
          ['Transaction', withdrawalEvent.transactionHash],
          ['Nullifier', nullifierHex],
        );
      }

      console.log('\n\n' + complianceTable.toString() + '\n');

      process.exit(0);
    });

  program
    .command('syncEvents')
    .description('Sync the local cache file of tornado cash events.\n\n')
    .argument('[netId]', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument('[currency]', 'Currency to sync events')
    .action(
      async (
        netIdOpts: number | string | undefined,
        currencyOpts: string | undefined,
        cmdOptions: commonProgramOptions,
      ) => {
        const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
        const { rpc } = options;

        const networks = netIdOpts ? [netIdOpts] : enabledChains;

        for (const netId of networks) {
          const config = networkConfig[`netId${netId}`];
          const {
            tornadoSubgraph,
            registrySubgraph,
            tokens,
            routerContract,
            echoContract,
            registryContract,
            ['governance.contract.tornadocash.eth']: governanceContract,
            deployedBlock,
            constants: { GOVERNANCE_BLOCK, REGISTRY_BLOCK, NOTE_ACCOUNT_BLOCK, ENCRYPTED_NOTES_BLOCK },
          } = config;

          const provider = getProgramProvider(netId, rpc, config, {
            ...fetchDataOptions,
          });
          const graphApi = getProgramGraphAPI(options, config);

          if (governanceContract) {
            const governanceService = new NodeGovernanceService({
              netId,
              provider,
              // to-do connect governance with subgraph
              graphApi: '',
              subgraphName: '',
              Governance: Governance__factory.connect(governanceContract, provider),
              deployedBlock: GOVERNANCE_BLOCK,
              fetchDataOptions,
              cacheDirectory: EVENTS_DIR,
              userDirectory: SAVED_DIR,
            });

            await governanceService.updateEvents();
          }

          if (registryContract) {
            const registryService = new NodeRegistryService({
              netId,
              provider,
              graphApi,
              subgraphName: registrySubgraph,
              RelayerRegistry: RelayerRegistry__factory.connect(registryContract, provider),
              deployedBlock: REGISTRY_BLOCK,
              fetchDataOptions,
              cacheDirectory: EVENTS_DIR,
              userDirectory: SAVED_DIR,
            });

            await registryService.updateEvents();
          }

          const echoService = new NodeEchoService({
            netId,
            provider,
            graphApi,
            subgraphName: tornadoSubgraph,
            Echoer: Echoer__factory.connect(echoContract, provider),
            deployedBlock: NOTE_ACCOUNT_BLOCK,
            fetchDataOptions,
            cacheDirectory: EVENTS_DIR,
            userDirectory: SAVED_DIR,
          });

          await echoService.updateEvents();

          const encryptedNotesService = new NodeEncryptedNotesService({
            netId,
            provider,
            graphApi,
            subgraphName: tornadoSubgraph,
            Router: TornadoRouter__factory.connect(routerContract, provider),
            deployedBlock: ENCRYPTED_NOTES_BLOCK,
            fetchDataOptions,
            cacheDirectory: EVENTS_DIR,
            userDirectory: SAVED_DIR,
          });

          await encryptedNotesService.updateEvents();

          const currencies = currencyOpts ? [currencyOpts.toLowerCase()] : Object.keys(tokens);

          for (const currency of currencies) {
            const currencyConfig = tokens[currency];
            // Now load the denominations and address
            const amounts = Object.keys(currencyConfig.instanceAddress);

            // And now sync
            for (const amount of amounts) {
              const instanceAddress = currencyConfig.instanceAddress[amount];
              const Tornado = Tornado__factory.connect(instanceAddress, provider);

              const depositsServiceConstructor = {
                netId,
                provider,
                graphApi,
                subgraphName: tornadoSubgraph,
                Tornado,
                amount,
                currency,
                deployedBlock,
                fetchDataOptions,
                cacheDirectory: EVENTS_DIR,
                userDirectory: SAVED_DIR,
              };

              const depositsService = new NodeDepositsService({
                ...depositsServiceConstructor,
                type: 'Deposit',
              });

              const withdrawalsService = new NodeDepositsService({
                ...depositsServiceConstructor,
                type: 'Withdrawal',
              });

              const merkleTreeService = new MerkleTreeService({
                netId,
                amount,
                currency,
                Tornado,
                merkleWorkerPath: MERKLE_WORKER_PATH,
              });

              const depositEvents = (await depositsService.updateEvents()).events;

              // If we have MERKLE_WORKER_PATH run worker at background otherwise resolve it here
              const depositTreePromise = await (async () => {
                if (MERKLE_WORKER_PATH) {
                  return () => merkleTreeService.verifyTree(depositEvents as DepositsEvents[]) as Promise<MerkleTree>;
                }
                return (await merkleTreeService.verifyTree(depositEvents as DepositsEvents[])) as MerkleTree;
              })();

              await Promise.all([
                withdrawalsService.updateEvents(),
                typeof depositTreePromise === 'function' ? depositTreePromise() : depositTreePromise,
              ]);
            }
          }
        }

        process.exit(0);
      },
    );

  program
    .command('relayers')
    .description('List all registered relayers from the tornado cash registry.\n\n')
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .action(async (netIdOpts: number | string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);

      const allRelayers = await getProgramRelayer({
        options,
        fetchDataOptions,
        netId: netIdOpts,
      });

      const validRelayers = allRelayers.validRelayers as RelayerInfo[];
      const invalidRelayers = allRelayers.invalidRelayers as RelayerError[];

      const relayersTable = new Table();

      relayersTable.push(
        [{ colSpan: 8, content: 'Relayers', hAlign: 'center' }],
        [
          'netId',
          'url',
          'ensName',
          'stakeBalance',
          'relayerAddress',
          'rewardAccount',
          'currentQueue',
          'serviceFee',
        ].map((content) => ({ content: colors.red.bold(content) })),
        ...validRelayers.map(
          ({ netId, url, ensName, stakeBalance, relayerAddress, rewardAccount, currentQueue, tornadoServiceFee }) => {
            return [
              netId,
              url,
              ensName,
              stakeBalance ? `${Number(formatEther(stakeBalance)).toFixed(5)} TORN` : '',
              relayerAddress,
              rewardAccount,
              currentQueue,
              `${tornadoServiceFee}%`,
            ];
          },
        ),
      );

      const invalidRelayersTable = new Table();

      invalidRelayersTable.push(
        [{ colSpan: 3, content: 'Invalid Relayers', hAlign: 'center' }],
        ['hostname', 'relayerAddress', 'errorMessage'].map((content) => ({ content: colors.red.bold(content) })),
        ...invalidRelayers.map(({ hostname, relayerAddress, errorMessage }) => {
          return [hostname, relayerAddress, errorMessage ? substring(errorMessage, 40) : ''];
        }),
      );

      console.log(relayersTable.toString() + '\n');
      console.log(invalidRelayersTable.toString() + '\n');

      process.exit(0);
    });

  program
    .command('createAccount')
    .description(
      'Creates and save on-chain account that would store encrypted notes. \n\n' +
        'Would first lookup on on-chain records to see if the notes are stored. \n\n' +
        'Requires a valid signable wallet (mnemonic or a private key) to work (Since they would encrypt or encrypted)',
    )
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .action(async (netId: string | number, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;

      const config = networkConfig[`netId${netId}`];

      const {
        echoContract,
        tornadoSubgraph,
        constants: { ['NOTE_ACCOUNT_BLOCK']: deployedBlock },
      } = config;

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const signer = getProgramSigner({
        options,
        provider,
      });

      const graphApi = getProgramGraphAPI(options, config);

      if (!signer || signer instanceof VoidSigner) {
        throw new Error(
          'No wallet found, make your you have supplied a valid mnemonic or private key before using this command',
        );
      }

      /**
       * Find for any existing note accounts
       */
      const walletPublicKey = NoteAccount.getWalletPublicKey(signer);

      const Echoer = Echoer__factory.connect(echoContract, provider);

      const newAccount = new NoteAccount({
        netId,
        Echoer,
      });

      const echoService = new NodeEchoService({
        netId,
        provider,
        graphApi,
        subgraphName: tornadoSubgraph,
        Echoer,
        deployedBlock,
        fetchDataOptions,
        cacheDirectory: EVENTS_DIR,
        userDirectory: SAVED_DIR,
      });

      console.log('Getting historic note accounts would take a while\n');

      const echoEvents = (await echoService.updateEvents()).events;

      const userEvents = echoEvents.filter(({ address }) => address === signer.address);

      const existingAccounts = newAccount.decryptAccountsWithWallet(signer, userEvents);

      const accountsTable = new Table();

      if (existingAccounts.length) {
        accountsTable.push(
          [{ colSpan: 2, content: `Note Accounts (${netId})`, hAlign: 'center' }],
          [{ colSpan: 2, content: `Backed up by: ${signer.address}`, hAlign: 'center' }],
          ['blockNumber', 'noteAccount'].map((content) => ({ content: colors.red.bold(content) })),
          ...existingAccounts.map(({ blockNumber, recoveryKey }) => {
            return [blockNumber, recoveryKey];
          }),
        );

        console.log(accountsTable.toString() + '\n');
      } else {
        accountsTable.push(
          [{ colSpan: 1, content: `New Note Account (${netId})`, hAlign: 'center' }],
          ['noteAccount'].map((content) => ({ content: colors.red.bold(content) })),
          [newAccount.recoveryKey],
          [{ colSpan: 1, content: `Would be backed up by: ${signer.address}`, hAlign: 'center' }],
        );

        const fileName = `backup-note-account-key-0x${newAccount.recoveryKey.slice(0, 8)}.txt`;

        console.log('\n' + accountsTable.toString() + '\n');

        console.log(`Writing backup to ${fileName}\n`);

        await writeFile(fileName, newAccount.recoveryKey + '\n');

        console.log('Backup encrypted account on-chain to use on UI?\n');

        await promptConfirmation(options.nonInteractive);

        const { data } = newAccount.getEncryptedAccount(walletPublicKey);

        console.log('Sending encrypted note account backup transaction through wallet\n');

        await programSendTransaction({
          signer: signer as TornadoVoidSigner | TornadoWallet,
          options,
          populatedTransaction: await Echoer.echo.populateTransaction(data),
        });
      }

      process.exit(0);
    });

  program
    .command('decryptNotes')
    .description('Fetch notes from deposit events and decrypt them. \n\n' + 'Requires a valid account key to work')
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument(
      '[accountKey]',
      'Account key generated from UI or the createAccount to store encrypted notes on-chain',
      parseRecoveryKey,
    )
    .action(async (netId: string | number, accountKey: string | undefined, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;
      if (!accountKey) {
        accountKey = options.accountKey;
      }

      const config = networkConfig[`netId${netId}`];

      const {
        routerContract,
        echoContract,
        tornadoSubgraph,
        constants: { ENCRYPTED_NOTES_BLOCK },
      } = config;

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const graphApi = getProgramGraphAPI(options, config);

      if (!accountKey) {
        throw new Error(
          'No account key find! Please supply correct account key from either UI or find one with createAccount command',
        );
      }

      const Echoer = Echoer__factory.connect(echoContract, provider);

      const noteAccount = new NoteAccount({
        netId,
        recoveryKey: accountKey,
        Echoer,
      });

      const encryptedNotesService = new NodeEncryptedNotesService({
        netId,
        provider,
        graphApi,
        subgraphName: tornadoSubgraph,
        Router: TornadoRouter__factory.connect(routerContract, provider),
        deployedBlock: ENCRYPTED_NOTES_BLOCK,
        fetchDataOptions,
        cacheDirectory: EVENTS_DIR,
        userDirectory: SAVED_DIR,
      });

      const encryptedNoteEvents = (await encryptedNotesService.updateEvents()).events;

      const accountsTable = new Table();

      accountsTable.push(
        [{ colSpan: 2, content: `Note Accounts (${netId})`, hAlign: 'center' }],
        [{ colSpan: 2, content: `Account key: ${accountKey}`, hAlign: 'center' }],
        ['blockNumber', 'note'].map((content) => ({ content: colors.red.bold(content) })),
        ...noteAccount.decryptNotes(encryptedNoteEvents).map(({ blockNumber, address, noteHex }) => {
          const { amount, currency } = getInstanceByAddress({ netId, address }) as { amount: string; currency: string };

          return [blockNumber, `tornado-${currency}-${amount}-${netId}-${noteHex}`];
        }),
      );

      console.log('\n' + accountsTable.toString() + '\n');

      process.exit(0);
    });

  program
    .command('send')
    .description('Send ETH or ERC20 token to address.\n\n')
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument('<to>', 'To address', parseAddress)
    .argument('[amount]', 'Sending amounts', parseNumber)
    .argument('[token]', 'ERC20 Token Contract to check Token Balance', parseAddress)
    .action(
      async (
        netId: string | number,
        to: string,
        amountArgs: number | undefined,
        tokenArgs: string | undefined,
        cmdOptions: commonProgramOptions,
      ) => {
        const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
        const { rpc, token: tokenOpts } = options;

        const config = networkConfig[`netId${netId}`];

        const { currencyName, multicall: multicallAddress } = config;

        const provider = getProgramProvider(netId, rpc, config, {
          ...fetchDataOptions,
        });

        const signer = getProgramSigner({ options, provider });

        if (!signer) {
          throw new Error(
            'Signer not defined, make sure you have either viewOnly address, mnemonic, or private key configured',
          );
        }

        const tokenAddress = tokenArgs ? parseAddress(tokenArgs) : tokenOpts;

        const Multicall = Multicall__factory.connect(multicallAddress, provider);
        const Token = (tokenAddress ? ERC20__factory.connect(tokenAddress, signer) : undefined) as ERC20;

        // Fetching feeData or nonce is unnecessary however we do this to estimate transfer amounts
        const [feeData, nonce, [{ balance: ethBalance }, tokenResults]] = await Promise.all([
          provider.getFeeData(),
          provider.getTransactionCount(signer.address, 'pending'),
          getTokenBalances({
            provider,
            Multicall,
            currencyName,
            userAddress: signer.address,
            tokenAddresses: tokenAddress ? [tokenAddress] : [],
          }),
        ]);

        const {
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          balance: tokenBalance,
        }: tokenBalances = tokenResults || {};

        const txType = feeData.maxFeePerGas ? 2 : 0;
        const txGasPrice = feeData.maxFeePerGas
          ? feeData.maxFeePerGas + (feeData.maxPriorityFeePerGas || BigInt(0))
          : feeData.gasPrice || BigInt(0);
        const txFees = feeData.maxFeePerGas
          ? {
              maxFeePerGas: feeData.maxFeePerGas,
              maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
            }
          : {
              gasPrice: feeData.gasPrice,
            };

        let toSend: bigint;

        if (amountArgs) {
          if (tokenAddress) {
            toSend = parseUnits(`${amountArgs}`, tokenDecimals);

            if (toSend > tokenBalance) {
              const errMsg = `Invalid ${tokenSymbol} balance, wants ${amountArgs} have ${formatUnits(tokenBalance, tokenDecimals)}`;
              throw new Error(errMsg);
            }
          } else {
            toSend = parseEther(`${amountArgs}`);

            if (toSend > ethBalance) {
              const errMsg = `Invalid ${currencyName} balance, wants ${amountArgs} have ${formatEther(ethBalance)}`;
              throw new Error(errMsg);
            }
          }
        } else {
          if (tokenAddress) {
            toSend = tokenBalance;
          } else {
            const initCost = txGasPrice * BigInt('400000');
            toSend = ethBalance - initCost;

            const estimatedGas = await provider.estimateGas({
              type: txType,
              from: signer.address,
              to,
              value: toSend,
              nonce,
              ...txFees,
            });

            const bumpedGas =
              estimatedGas !== BigInt(21000) && signer.gasLimitBump
                ? (estimatedGas * (BigInt(10000) + BigInt(signer.gasLimitBump))) / BigInt(10000)
                : estimatedGas;

            toSend = ethBalance - txGasPrice * bumpedGas;
          }
        }

        await programSendTransaction({
          signer,
          options,
          populatedTransaction: tokenAddress
            ? await Token.transfer.populateTransaction(to, toSend)
            : await signer.populateTransaction({
                type: txType,
                from: signer.address,
                to,
                value: toSend,
                nonce,
                ...txFees,
              }),
        });

        process.exit(0);
      },
    );

  program
    .command('balance')
    .description('Check ETH and ERC20 balance.\n\n')
    .argument('<netId>', 'Network Chain ID to connect with (see https://chainlist.org for examples)', parseNumber)
    .argument('[address]', 'ETH Address to check balance', parseAddress)
    .argument('[token]', 'ERC20 Token Contract to check Token Balance', parseAddress)
    .action(
      async (
        netId: string | number,
        addressArgs: string | undefined,
        tokenArgs: string | undefined,
        cmdOptions: commonProgramOptions,
      ) => {
        const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
        const { rpc, token: tokenOpts } = options;

        const config = networkConfig[`netId${netId}`];

        const {
          currencyName,
          multicall: multicallAddress,
          ['torn.contract.tornadocash.eth']: tornTokenAddress,
          tokens,
        } = config;

        const provider = getProgramProvider(netId, rpc, config, {
          ...fetchDataOptions,
        });

        const userAddress = addressArgs ? parseAddress(addressArgs) : getProgramSigner({ options, provider })?.address;
        const tokenAddress = tokenArgs ? parseAddress(tokenArgs) : tokenOpts;

        if (!userAddress) {
          throw new Error('Address is required however no user address is supplied');
        }

        const Multicall = Multicall__factory.connect(multicallAddress, provider);

        const tokenAddresses = Object.values(tokens)
          .map(({ tokenAddress }) => tokenAddress)
          .filter((t) => t) as string[];

        if (tornTokenAddress) {
          tokenAddresses.push(tornTokenAddress);
        }

        const tokenBalances = await getTokenBalances({
          provider,
          Multicall,
          currencyName,
          userAddress,
          tokenAddresses: [...(tokenAddress ? [tokenAddress] : tokenAddresses)],
        });

        const balanceTable = new Table({ head: ['Token', 'Contract Address', 'Balance'] });

        balanceTable.push(
          [{ colSpan: 3, content: `User: ${userAddress}`, hAlign: 'center' }],
          ...tokenBalances.map(({ address, name, symbol, decimals, balance }) => {
            return [`${name} (${symbol})`, address, `${formatUnits(balance, decimals)} ${symbol}`];
          }),
        );

        console.log(balanceTable.toString());

        process.exit(0);
      },
    );

  program
    .command('sign')
    .description('Sign unsigned transaction with signer.\n\n')
    .argument('<unsignedTx>', 'Unsigned Transaction')
    .action(async (unsignedTx: string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;

      const deserializedTx = Transaction.from(unsignedTx).toJSON();

      const netId = Number(deserializedTx.chainId);

      const config = networkConfig[`netId${netId}`];

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const signer = getProgramSigner({ options, provider });

      if (!signer || signer instanceof VoidSigner) {
        throw new Error('Signer not defined or not signable signer');
      }

      await programSendTransaction({
        signer,
        options,
        populatedTransaction: deserializedTx,
      });

      process.exit(0);
    });

  program
    .command('broadcast')
    .description('Broadcast signed transaction.\n\n')
    .argument('<signedTx>', 'Signed Transaction')
    .action(async (signedTx: string, cmdOptions: commonProgramOptions) => {
      const { options, fetchDataOptions } = await getProgramOptions(cmdOptions);
      const { rpc } = options;

      const netId = Number(Transaction.from(signedTx).chainId);

      if (!netId) {
        throw new Error('NetId for the transaction is invalid, this command only supports EIP-155 transactions');
      }

      const config = networkConfig[`netId${netId}`];

      const provider = getProgramProvider(netId, rpc, config, {
        ...fetchDataOptions,
      });

      const { hash } = await provider.broadcastTransaction(signedTx);

      console.log(`\nBroadcastd tx: ${hash}\n`);

      process.exit(0);
    });

  // common options
  program.commands.forEach((cmd) => {
    cmd.option('-r, --rpc <RPC_URL>', 'The RPC that CLI should interact with', parseUrl);
    cmd.option('-e, --eth-rpc <ETHRPC_URL>', 'The Ethereum Mainnet RPC that CLI should interact with', parseUrl);
    cmd.option('-g, --graph <GRAPH_URL>', 'The Subgraph API that CLI should interact with', parseUrl);
    cmd.option(
      '-G, --eth-graph <ETHGRAPH_URL>',
      'The Ethereum Mainnet Subgraph API that CLI should interact with',
      parseUrl,
    );
    cmd.option(
      '-d, --disable-graph',
      'Disable Graph API - Does not enable Subgraph API and use only local RPC as an event source',
    );
    cmd.option(
      '-a, --account-key <ACCOUNT_KEY>',
      'Account key generated from UI or the createAccount to store encrypted notes on-chain',
      parseRecoveryKey,
    );
    cmd.option('-R, --relayer <RELAYER>', 'Withdraw via relayer (Should be either .eth name or URL)', parseRelayer);
    cmd.option('-w, --wallet-withdrawal', 'Withdrawal via wallet (Should not be linked with deposits)');
    cmd.option('-T, --tor-port <TOR_PORT>', 'Optional tor port', parseNumber);
    cmd.option('-t, --token <TOKEN>', 'Token Contract address to view token balance', parseAddress);
    cmd.option(
      '-v, --view-only <VIEW_ONLY>',
      'Wallet address to view balance or to create unsigned transactions',
      parseAddress,
    );
    cmd.option(
      '-m, --mnemonic <MNEMONIC>',
      'Wallet BIP39 Mnemonic Phrase - If you did not add it to .env file and it is needed for operation',
      parseMnemonic,
    );
    cmd.option('-i, --mnemonic-index <MNEMONIC_INDEX>', 'Optional wallet mnemonic index', parseNumber);
    cmd.option(
      '-p, --private-key <PRIVATE_KEY>',
      'Wallet private key - If you did not add it to .env file and it is needed for operation',
      parseKey,
    );
    cmd.option(
      '-n, --non-interactive',
      'No confirmation mode - Does not show prompt for confirmation and allow to use scripts non-interactive',
    );
    cmd.option('-l, --local-rpc', 'Local node mode - Does not submit signed transaction to the node');
  });

  return program;
}
