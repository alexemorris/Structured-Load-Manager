const moment = require('moment');
const translateFormat = require('./translateDateFormat')

module.exports = (data, formats = [
  'yyyy/d/M HH:mm:ss',
  'd/M/yyyy HH:mm:ss',
  'd/M/yyyy HH:mm',
  'M/d/yyyy HH:mm:ss',
  'M/d/yyyy HH:mm',
  'yyyyMMdd HH:mm',
  'M/d/yyyy',
  'd/M/yyyy',
  'yyyy/M/d HH:mm',
  'yyyy/d/M HH:mm',
  'yyyy/M/d h:mm tt',
  'M/d/yyyy h:mm tt',
  'yyyy/M/d HH:mm:ss',
  'x']) => {
  let candidates = formats.slice(0).map(x => translateFormat(x, true));
  let index = 0;
  const inputList = data.filter(x => x);
  while (candidates.length > 1 && index < inputList.length) {
    candidates = candidates.filter(x => {
      const date = moment(inputList[index], x, true);
      return date.isValid() && date.year() > 1970;
    });
    index += 1;
  }
  return candidates.map(x => translateFormat(x));
};
