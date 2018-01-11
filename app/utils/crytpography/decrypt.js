const crypt = require('crypto');
const zlib = require('zlib');

export default (buffer, password) => {
  const decipher = crypt.createDecipher('aes-256-ctr', password);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return zlib.unzipSync(decrypted);
};
