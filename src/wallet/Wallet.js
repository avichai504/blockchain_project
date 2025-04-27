const CryptoUtils = require('../utils/CryptoUtils')

class Wallet {
  constructor() {
    const { privateKey, publicKey } = CryptoUtils.generateKeyPair()
    this.privateKey = privateKey
    this.publicKey = publicKey
    this.address = CryptoUtils.sha256(publicKey)
    this.balance = 300
  }

  createTransaction(toAddress, amount) {
    if (amount + 5 > this.balance) {
      throw new Error('Not enough balance to perform transaction')
    }

    const transaction = {
      fromAddress: this.address,
      toAddress: toAddress,
      amount: amount,
      baseFee: 2,
      priorityFee: 3,
      timestamp: Date.now(),
      publicKey: this.publicKey,
    }

    const transactionData = JSON.stringify(transaction)
    const signature = CryptoUtils.signData(transactionData, this.privateKey)

    return {
      ...transaction,
      signature: signature,
    }
  }
}

module.exports = Wallet
