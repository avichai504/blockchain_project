const CryptoUtils = require('./CryptoUtils')

class BloomFilter {
  constructor(size = 100) {
    this.size = size
    this.storage = Array(size).fill(false)
  }

  _hash1(value) {
    return parseInt(CryptoUtils.sha256(value).substr(0, 8), 16) % this.size
  }

  _hash2(value) {
    return parseInt(CryptoUtils.sha256(value).substr(8, 8), 16) % this.size
  }

  _hash3(value) {
    return parseInt(CryptoUtils.sha256(value).substr(16, 8), 16) % this.size
  }

  add(value) {
    const pos1 = this._hash1(value)
    const pos2 = this._hash2(value)
    const pos3 = this._hash3(value)

    this.storage[pos1] = true
    this.storage[pos2] = true
    this.storage[pos3] = true
  }

  mightContain(value) {
    const pos1 = this._hash1(value)
    const pos2 = this._hash2(value)
    const pos3 = this._hash3(value)

    return this.storage[pos1] && this.storage[pos2] && this.storage[pos3]
  }
}

module.exports = BloomFilter
