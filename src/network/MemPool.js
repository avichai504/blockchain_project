// src/network/MemPool.js

const fs = require('fs');
const path = require('path');

class MemPool {
  constructor(filePath = path.join(__dirname, '../../mempool.json')) {
    this.filePath = filePath;
    this.transactions = this.loadTransactions();
  }

  loadTransactions() {
    if (!fs.existsSync(this.filePath)) {
      console.error('MemPool file not found!');
      return [];
    }

    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  getNextTransactions(count = 4) {
    return this.transactions.splice(0, count);
  }

  isEmpty() {
    return this.transactions.length === 0;
  }
}

module.exports = MemPool;
