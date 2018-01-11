const parse = require('csv-parse/lib/sync');

export default (data, options) => parse(data, options);
