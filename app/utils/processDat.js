const path = require('path');
const colors = require('colors');
const fs = require('fs-extra');

const parseDat = require('../../functions/parsers/concordanceParser');
const findFile = require('./findFile');

module.exports = function(mappings) {
  console.group('Processing dat file');
  const dat = findFile(mappings, '*.dat');
  if (!dat) {
    console.log(`Could not find a dat file in the input directory`.red);
    process.exit();
  }

  console.log('Parsing data from input dat'.grey);
  let data;
  try {
    data = parseDat(fs.readFileSync(dat));
  } catch (err) {
    console.log(`${err.toString()}`.red)
    process.exit();
  }
  console.log(`Parsed ${data.length} entries from dat`.green);

  console.groupEnd();
  return data;
}
