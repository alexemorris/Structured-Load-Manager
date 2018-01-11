const encrypt = require('./encrypt');
const decrypt = require('./decrypt');
const crypto = require('crypto');

describe('cryptography', () => {
  it('Should encrypt a random buffer', () => {
    const input = crypto.randomBytes(20);
    const password = crypto.randomBytes(20).toString();
    expect(encrypt(input, password)).not.toBe(input);
  });

  it('Should encrypt and decrypt random buffer', () => {
    const input = crypto.randomBytes(20);
    const password = crypto.randomBytes(20).toString();
    const encrypted = encrypt(input, password);
    const decrypted = decrypt(encrypted, password);
    expect(decrypted).toEqual(input);
  });
});
