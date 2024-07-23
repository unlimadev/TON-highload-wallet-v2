import { HighloadWalletContractV2 } from 'ton-highload-wallet-contract';
import { mnemonicToPrivateKey } from '@ton/crypto';
import { Address, TonClient4, internal } from '@ton/ton';
import { beginCell, toNano } from '@ton/core';

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

// Create contract
const key = await mnemonicToPrivateKey(mnemonic);
const contract = client.open(HighloadWalletContractV2.create({
  publicKey: key.publicKey,
  workchain: 0,
}));

const destinationAddress = Address.parse('Your highload wallet address');
const walletAddress = Address.parse('Recipient address ');
const nftAddress = Address.parse('Nft address');

const forwardPayload = beginCell()
  .storeUint(0, 32)
  .storeStringTail('comment')
  .endCell();

const transferNftBody = beginCell()
  .storeUint(0x5fcc3d14, 32)
  .storeUint(0, 64)
  .storeAddress(destinationAddress)
  .storeAddress(walletAddress)
  .storeBit(0)
  .storeCoins(toNano('0'))
  .storeBit(1)
  .storeRef(forwardPayload)
  .endCell();

const result = await contract.sendTransfer({
  secretKey: key.secretKey,
  messages: [
    internal({
      to: nftAddress,
      value: '0.04',
      body: transferNftBody,
    }),
  ],
});

console.log(result);
