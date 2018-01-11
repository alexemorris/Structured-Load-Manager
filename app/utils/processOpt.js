const path = require('path');
const colors = require('colors');
const fs = require('fs-extra');
const _ = require('lodash');

const parseOpt = require('../../functions/parsers/optParser');
const findFile = require('./findFile');
const fileHash = require('./fileHash');

module.exports = function(mappings) {
  console.group('Processing opt file');
  const opt = findFile(mappings, '*.opt');

  if (!opt) {
    console.groupEnd()
    return null;
  }

  const tifHash = fileHash(path.join(mappings.directories.mainInput, mappings.directories.input.image), "*.tif*")

  if (!opt) {
    console.log(`Could not find a dat file in the input directory`.red); return [];
  }

  let data = parseOpt(fs.readFileSync(opt));
  console.log(`Parsed ${data.length} entries from opt`.green);

  console.log(`Creating tif hash`)
  const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
  const map = _.mapValues(_.groupBy(data, 'name'), (x) => x.map(y => {
    tifHash[y.path.toLowerCase()]
  }).sort(collator.compare))

  console.groupEnd();
  return map;
}
