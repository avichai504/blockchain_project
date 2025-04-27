const CryptoUtils = require('../utils/CryptoUtils')

class LightWallet {
  constructor(address) {
    this.address = address
    this.transactions = []
  }

  receiveTransaction(transaction) {
    if (transaction.toAddress === this.address || transaction.fromAddress === this.address) {
      this.transactions.push(transaction)
    }
  }

  verifyTransaction(transaction) {
    const { signature, publicKey, ...transactionData } = transaction

    if (!signature || !publicKey) {
      console.log('Transaction missing signature or publicKey.')
      return false
    }

    const dataString = JSON.stringify(transactionData)
    return CryptoUtils.verifySignature(dataString, signature, publicKey)
  }

  getBalance() {
    let balance = 0

    for (const tx of this.transactions) {
      if (tx.toAddress === this.address) {
        balance += tx.amount
      }
      if (tx.fromAddress === this.address) {
        balance -= tx.amount
        balance -= tx.baseFee || 0
        balance -= tx.priorityFee || 0
      }
    }

    return balance
  }
}

module.exports = LightWallet
