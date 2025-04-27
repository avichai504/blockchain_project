// src/utils/MerkleTree.js

const CryptoUtils = require('./CryptoUtils');

class MerkleTree {
  constructor(transactions) {
    this.transactions = transactions;
    this.root = this.buildMerkleTree(this.transactions.map(tx => this.hashTransaction(tx)));
  }

  hashTransaction(transaction) {
    return CryptoUtils.sha256(JSON.stringify(transaction));
  }

  buildMerkleTree(hashes) {
    if (hashes.length === 0) {
      return '';
    }
    if (hashes.length === 1) {
      return hashes[0];
    }

    const newLevel = [];

    for (let i = 0; i < hashes.length; i += 2) {
      if (i + 1 < hashes.length) {
        newLevel.push(CryptoUtils.sha256(hashes[i] + hashes[i + 1]));
      } else {
        // אם אין זוג, משכפלים את האחרון
        newLevel.push(CryptoUtils.sha256(hashes[i] + hashes[i]));
      }
    }

    return this.buildMerkleTree(newLevel);
  }

  getMerkleRoot() {
    return this.root;
  }
}

module.exports = MerkleTree;
