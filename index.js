const Blockchain = require('./src/blockchain/Blockchain')
const Wallet = require('./src/wallet/Wallet')
const LightWallet = require('./src/wallet/LightWallet')
const MemPool = require('./src/network/MemPool')
const BloomFilter = require('./src/utils/BloomFilter')
const MerkleTree = require('./src/utils/MerkleTree')

const savjeeCoin = new Blockchain()

const fullWallet = new Wallet()
const lightWallet1 = new LightWallet('WalletB')
const lightWallet2 = new LightWallet('WalletC')
const mempool = new MemPool()
const bloomFilter = new BloomFilter()

let totalBurned = 0
let totalRewarded = 0

while (!mempool.isEmpty()) {
  const txBatch = mempool.getNextTransactions(4)

  txBatch.forEach((tx) => {
    const realTransaction = fullWallet.createTransaction(tx.toAddress, tx.amount)
    savjeeCoin.addTransaction(realTransaction)

    totalBurned += 2
    totalRewarded += 3

    bloomFilter.add(JSON.stringify(realTransaction))
  })

  savjeeCoin.minePendingTransactions(fullWallet.address)

  totalRewarded += 50
}

console.log('\nBlockchain:')
console.log(JSON.stringify(savjeeCoin, null, 2))

const lastBlock = savjeeCoin.getLatestBlock()
const merkleTree = new MerkleTree(lastBlock.transactions)

console.log('\nMerkle Root of last block:')
console.log(merkleTree.getMerkleRoot())

for (const block of savjeeCoin.chain) {
  for (const tx of block.transactions) {
    lightWallet1.receiveTransaction(tx)
    lightWallet2.receiveTransaction(tx)
  }
}

const sampleTx = lightWallet1.transactions[0]
const isVerified = lightWallet1.verifyTransaction(sampleTx)

console.log('\nLight Wallet 1 Verification of First Transaction:', isVerified)

console.log('\nBalances:')
console.log(`Full Wallet: ${savjeeCoin.getBalanceOfAddress(fullWallet.address)}`)
console.log(`Light Wallet 1 (${lightWallet1.address}): ${lightWallet1.getBalance()}`)
console.log(`Light Wallet 2 (${lightWallet2.address}): ${lightWallet2.getBalance()}`)

console.log('\n--- Network Summary ---')
const totalCoins =
  savjeeCoin.getBalanceOfAddress(fullWallet.address) +
  lightWallet1.getBalance() +
  lightWallet2.getBalance()

console.log(`Total Coins in network (calculated): ${totalCoins}`)
console.log(`Total Burned Coins (fees): ${totalBurned}`)
console.log(`Total Rewarded Coins (miner rewards + priority fees): ${totalRewarded}`)
