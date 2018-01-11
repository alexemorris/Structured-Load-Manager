const crypt = require('crypto');
const zlib = require('zlib');

export default (buffer, password) => {
  const encrypt = crypt.createCipher('aes-256-ctr', password);
  return Buffer.concat([encrypt.update(zlib.gzipSync(buffer)), encrypt.final()]);
};
