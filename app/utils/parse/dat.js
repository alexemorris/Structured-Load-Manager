const parse = require('csv-parse/lib/sync');

export default (data, options) => parse(data, { delimiter: '\u0014', quote: '\u00fe', escape: '\u00fe', columns: true, ...options });
