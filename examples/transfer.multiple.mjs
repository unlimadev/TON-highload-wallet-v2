import { HighloadWalletContractV2 } from 'ton-highload-wallet-contract';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { TonClient4, internal } from '@ton/ton';

const client = new TonClient4({
  endpoint: 'https://mainnet-v4.tonhubapi.com',
});

const mnemonic = [
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
  'word1', 'word2', 'word3',
];

const key = await mnemonicToPrivateKey(mnemonic);
const contract = client.open(HighloadWalletContractV2.create({
  publicKey: key.publicKey,
  workchain: 0,
}));

const result = await contract.sendTransfer({
  secretKey: key.secretKey,
  messages: [
    internal({
      to: 'recipient address #1',
      value: '0.05',
      bounce: true,
    }),
    internal({
      to: 'recipient address #2',
      value: '0.05',
      bounce: true,
    }),
  ],
});

console.log(result);
