const stringify = require('csv-stringify');

export default (data, columns, options) => (
  new Promise((resolve, reject) => {
    stringify(data, { header: true, columns, delimiter: '\u0014', quote: '\u00fe', escape: '\u00fe', ...options }, (err, output) => {
      if (err) {
        reject(err);
      }
      resolve(output);
    });
  })
);
