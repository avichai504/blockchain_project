// src/utils/CryptoUtils.js

const EC = require('elliptic').ec;
const crypto = require('crypto');

const ec = new EC('secp256k1');

class CryptoUtils {
  static sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static generateKeyPair() {
    const key = ec.genKeyPair();
    return {
      privateKey: key.getPrivate('hex'),
      publicKey: key.getPublic('hex')
    };
  }

  static signData(data, privateKey) {
    const key = ec.keyFromPrivate(privateKey, 'hex');
    const signature = key.sign(CryptoUtils.sha256(data));
    return signature.toDER('hex');
  }

  static verifySignature(data, signature, publicKey) {
    const key = ec.keyFromPublic(publicKey, 'hex');
    return key.verify(CryptoUtils.sha256(data), signature);
  }
}

module.exports = CryptoUtils;
