const CryptoUtils = require('../utils/CryptoUtils')

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.nonce = 0
    this.merkleRoot = ''
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return CryptoUtils.sha256(
      this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce
    )
  }

  mineBlock(difficulty) {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }
}

module.exports = Block
