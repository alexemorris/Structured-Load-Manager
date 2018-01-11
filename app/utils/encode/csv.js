const stringify = require('csv-stringify');

export default (data, columns, options) => (
  new Promise((resolve, reject) => {
    stringify(data, { header: true, columns, ...options }, (err, output) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(output);
    });
  })
);
