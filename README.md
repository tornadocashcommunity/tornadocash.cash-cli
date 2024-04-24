<div class="hero" align="center">

<img src="./logo2.png">

# Tornado CLI

Modern Toolsets for [Privacy Pools](https://www.forbes.com/sites/tomerniv/2023/09/07/privacy-pools-bridging-the-gap-between-blockchain-and-regulatory-compliance) on Ethereum

[![Telegram Badge](https://img.shields.io/badge/Join%20Group-telegram?style=flat&logo=telegram&color=blue&link=https%3A%2F%2Ft.me%2Ftornadocli)](https://t.me/tornadocli) [![Element Badge](https://img.shields.io/badge/Join%20Element%20Chat-Element?style=flat&logo=element&color=green&link=https%3A%2F%2Felement.tornadocash.social%2F)](https://element.tornadocash.social) [![Discourse Badge](https://img.shields.io/badge/Discourse-Discourse?style=flat&logo=Discourse&color=black&link=https%3A%2F%2Fforum.tornado.ws%2F)](https://forum.tornado.ws/)

</div>

### About Tornado CLI

Tornado CLI is a complete rewrite of old tornado-cli command line tool with the following changes

 + Rewritten to [TypeScript](https://www.typescriptlang.org/)

 + Built on top of modern tech stacks like [Ethers.js V6](https://docs.ethers.org/v6/) or [TypeChain](https://github.com/dethcrypto/TypeChain)

 + Creates resource heavy Merkle Trees on a separate thread using Web Workers / Worker Threads

 + Resilient API requests made by [cross-fetch](https://www.npmjs.com/package/cross-fetch) and retries, especially for Tor Users

 + Modular design

### How to install Tornado CLI

Download and install the latest [Node.js](https://nodejs.org/en/download/) LTS version (Current: 20.x).

You also need to install [Yarn](https://yarnpkg.com/) 1.x package manager using following command

```bash
$ npm i -g yarn
```

If you have git installed on your system, clone the master branch.

```bash
$ git clone https://git.tornado.ws/tornadocash/tornado-cli
```

Or, download the archive file from git: https://git.tornado.ws/tornadocash/tornado-cli/archive/master.zip

After downloading or cloning the repository, you must install necessary libraries using the following command.

```bash
$ cd tornado-cli
$ yarn
```

If you want to use Tor connection to conceal ip address, install [Tor Browser](https://www.torproject.org/download/) and add `--tor-port 9150` for `yarn start` if you connect tor with browser. (For non tor-browser tor service you can use the default 9050 port).

Note that you should reset your tor connection by restarting the browser every time when you deposit & withdraw otherwise you will have the same exit node used for connection.

### Configuration

Commands like `yarn deposit`, `yarn depositInvoice` or `yarn send` would require either a valid view-only wallet address or mnemonic or a private key to perform actions ( Because, if you want to deposit to pools or send the token, you would need your wallet right? ).

You can apply those values with two options

1. Refer the `VIEW_ONLY` or `MNEMONIC` or `PRIVATE_KEY` value from the `.env.example` file and create a new `.env` file with the appropriate value.

2. Supply command-line options `--view-only` or `--mnemonic` or `--private-key` during the commands.

### How to start

1. `yarn start --help`
2. If you want to use a secure, anonymous tor connection add `--tor-port <torPort>` behind the command or add `TOR_PORT` at the `.env` file.
3. Add `PRIVATE_KEY` to `.env` file (optional, only if you want to use it for many operations) - open `.env.example` file, add private key after `PRIVATE_KEY=` and rename file to `.env`.

#### To deposit:

```bash
$ yarn deposit <netId> <currency> <amount>
```

RPC nodes are now selected automatically however if you want to change you can use the `--rpc-url` option with the RPC URL following behind (Find any from https://chainlist.org)

##### Example:

```bash
$ yarn deposit 1 ETH 0.1

====================================================================

  _____                          _          ____ _     ___
 |_   _|__  _ __ _ __   __ _  __| | ___    / ___| |   |_ _|
   | |/ _ \| '__| '_ \ / _` |/ _` |/ _ \  | |   | |    | |
   | | (_) | |  | | | | (_| | (_| | (_) | | |___| |___ | |
   |_|\___/|_|  |_| |_|\__,_|\__,_|\___/   \____|_____|___|


====================================================================

┌───────────────────────────────────────────────────────┐
│                    Program Options                    │
├──────────┬────────────────────────────────────────────┤
│ IP       │                                            │
├──────────┼────────────────────────────────────────────┤
│ Is Tor   │ false                                      │
└──────────┴────────────────────────────────────────────┘

Confirm? [Y/n]
Y
New deposit: {
  "currency": "eth",
  "amount": "0.1",
  "netId": 1,
  "nullifier": "447406849888912231527060205543641504804080944127170669822752873679919469946",
  "secret": "174744806548157587591107992863852449674497869575837897594110402641101509504",
  "note": "tornado-eth-0.1-1-0x7a558fc1c1169a22661ce7256ff1a525b494916832c6ea10ba8209652a39fd80d3c62ebb20ad83c0777ceb1fd7a463eb0e952fcad9223a6f37cc1cede662",
  "noteHex": "0x7a558fc1c1169a22661ce7256ff1a525b494916832c6ea10ba8209652a39fd80d3c62ebb20ad83c0777ceb1fd7a463eb0e952fcad9223a6f37cc1cede662",
  "invoice": "tornadoInvoice-eth-0.1-1-0x0ad52c6472894d3521e40b27af6c590d0567c11819e9bacd4a872f3cc7056a54",
  "commitmentHex": "0x0ad52c6472894d3521e40b27af6c590d0567c11819e9bacd4a872f3cc7056a54",
  "nullifierHex": "0x2eb4ea29bbf999c40c7ceef35dc5917fbc6ed591fa7eb50b0aea94d3c1254d67"
}

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            Send Transaction?                                               │
├──────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ to                   │ 0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b                                          │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ from                 │                                                                                     │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ data                 │ 0x13d98d1300000000000000000000000012d66f...0000000000000000000000000000000000000000 │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ gasLimit             │ 1238242                                                                             │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ maxFeePerGas         │ 10000000000                                                                         │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ maxPriorityFeePerGas │ 1000000                                                                             │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ value                │ 100000000000000000                                                                  │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ type                 │ 2                                                                                   │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ nonce                │                                                                                     │
├──────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ chainId              │ 1                                                                                   │
└──────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘

Confirm? [Y/n]
Y

Sent transaction 0x0ad52c6472894d3521e40b27af6c590d0567c11819e9bacd4a872f3cc7056a54
```

#### To withdraw:

```bash
$ yarn withdraw <note> <recipient>
```

Note that `--relayer <relayer url>`, `--tor-port <torPort>` and `--rpc-url <rpc url>` are optional parameters, and use `--wallet-withdrawal --private-key <private key>` only if you withdraw without the relayer.

The CLI will select the relayer from the Relayer Registry contract by scoring for more information about how the relayers are being selected you could refer here https://docs.tornado.ws/general/guides/relayer.html.

##### Example:

```bash
$ yarn withdraw tornado-eth-0.1-5-0xf73dd6833ccbcc046c44228c8e2aa312bf49e08389dadc7c65e6a73239867b7ef49c705c4db227e2fadd8489a494b6880bdcb6016047e019d1abec1c7652 0x8589427373D6D84E98730D7795D8f6f8731FDA16
```

### (Optional) Creating Deposit Notes & Invoices offline

One of the main features of tornado-cli is that it supports creating deposit notes & invoices inside the offline computing environment.

After the private-key like notes are backed up somewhere safe, you can copy the created deposit invoices and use them to create new deposit transaction on online environment.

#### To create deposit notes with `create (createDeposit)` command.

```bash
$ yarn createDeposit <chainId> <currency> <amount>
```

To find out chainId value for your network, refer to https://chainlist.org/.

##### Example:

```bash
$ yarn createDeposit 1 ETH 0.1

====================================================================

  _____                          _          ____ _     ___
 |_   _|__  _ __ _ __   __ _  __| | ___    / ___| |   |_ _|
   | |/ _ \| '__| '_ \ / _` |/ _` |/ _ \  | |   | |    | |
   | | (_) | |  | | | | (_| | (_| | (_) | | |___| |___ | |
   |_|\___/|_|  |_| |_|\__,_|\__,_|\___/   \____|_____|___|


====================================================================


New deposit: {
  "currency": "eth",
  "amount": "0.1",
  "netId": 1,
  "nullifier": "211996166335523441594778881807923807770971048532637197153927747977918013739",
  "secret": "443763519478082043322725320022481467938478224697448315688237911974763852521",
  "note": "tornado-eth-0.1-1-0x2be1c7f1d7cc77e96e394b108ddc2bf2b25b8c2158ebb92b6cc347d74efc77e9723c6b6ac0654e00588f7ec8177e8a7dc47bc3b00fe75c7d094dc24729fb",
  "noteHex": "0x2be1c7f1d7cc77e96e394b108ddc2bf2b25b8c2158ebb92b6cc347d74efc77e9723c6b6ac0654e00588f7ec8177e8a7dc47bc3b00fe75c7d094dc24729fb",
  "invoice": "tornadoInvoice-eth-0.1-1-0x24d26c7d0381dc34941b6fe9e0d622c7efadc0bfdc9d3f7e8dcb1e490e6ce9ea",
  "commitmentHex": "0x24d26c7d0381dc34941b6fe9e0d622c7efadc0bfdc9d3f7e8dcb1e490e6ce9ea",
  "nullifierHex": "0x0e3ec1a269e2e143bc8b2dfca40975bc8f5af2754917cd1f839e499162b28324"
}

Transaction Data: {
  "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
  "value": "100000000000000000",
  "data": "0x13d98d1300000000000000000000000012d66f87a04a9e220743712ce6d9bb1b5616b8fc24d26c7d0381dc34941b6fe9e0d622c7efadc0bfdc9d3f7e8dcb1e490e6ce9ea00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000"
}
Done in 4.33s.
```

#### To create corresponding deposit transaction with `depositInvoice` command.

Creating deposit transaction with `depositInvoice` only requires valid deposit note created by `createNote` command, so that the deposit note could be stored without exposed anywhere.

```bash
$ node cli.js depositInvoice <invoice>
```

Parameter `--rpc-url <rpc url>` is optional, if you don't provide it, default RPC (corresponding to note chain) will be used.

##### Example:

```bash
yarn depositInvoice tornadoInvoice-eth-0.1-1-0x24d26c7d0381dc34941b6fe9e0d622c7efadc0bfdc9d3f7e8dcb1e490e6ce9ea
```

### List of rpc & relayers for withdrawal

Refer https://chainlist.org for a full list of available public RPC URLs.

Note that most of the RPC would censor sanctionded pool contracts.

So either you can use the default RPC or find yourself a suitable one.

For the list of avaiable relayers, use the `yarn relayers 1` command.