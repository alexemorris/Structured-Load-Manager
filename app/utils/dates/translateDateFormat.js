module.exports = (formatString, toMoment) => {
  const javaFormatMapping = {
    d: 'D',
    dd: 'DD',
    y: 'YYYY',
    yy: 'YY',
    yyy: 'YYYY',
    yyyy: 'YYYY',
    a: 'a',
    A: 'A',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM',
    h: 'h',
    hh: 'hh',
    H: 'H',
    HH: 'HH',
    m: 'm',
    mm: 'mm',
    s: 's',
    ss: 'ss',
    S: 'SSS',
    SS: 'SSS',
    SSS: 'SSS',
    E: 'ddd',
    EE: 'ddd',
    EEE: 'ddd',
    EEEE: 'dddd',
    EEEEE: 'dddd',
    EEEEEE: 'dddd',
    D: 'DDD',
    w: 'W',
    ww: 'WW',
    z: 'ZZ',
    zzzz: 'Z',
    Z: 'ZZ',
    X: 'ZZ',
    XX: 'ZZ',
    XXX: 'Z',
    u: 'E'
  };

  const momentFormatMapping = {
    D: 'd',
    DD: 'dd',
    YY: 'yy',
    YYY: 'yyyy',
    YYYY: 'yyyy',
    a: 'a',
    A: 'A',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM',
    h: 'h',
    hh: 'hh',
    H: 'H',
    HH: 'HH',
    m: 'm',
    mm: 'mm',
    s: 's',
    ss: 'ss',
    S: 'S',
    SS: 'S',
    SSS: 'S',
    ddd: 'E',
    dddd: 'EEEE',
    DDD: 'D',
    W: 'w',
    WW: 'ww',
    ZZ: 'z',
    Z: 'XXX',
    E: 'u'
  };


  if (formatString === null) {
    return null;
  }

  const mapping = toMoment ? javaFormatMapping : momentFormatMapping;

  const len = formatString.length;
  let i = 0;
  let beginIndex = -1;
  let lastChar = null;
  let currentChar = '';
  let resultString = '';

  for (; i < len; i += 1) {
    currentChar = formatString.charAt(i);
    if (lastChar === null || lastChar !== currentChar) {
      // change detected
      resultString = appendMappedString(formatString, mapping, beginIndex, i, resultString);
      beginIndex = i;
    }
    lastChar = currentChar;
  }
  const output = appendMappedString(formatString, mapping, beginIndex, i, resultString);
  return output;
};

const appendMappedString = (formatString, mapping, beginIndex, currentIndex, resultString) => {
  let tempString;
  let result = resultString;
  if (beginIndex !== -1) {
    tempString = formatString.substring(beginIndex, currentIndex);
    // check if the temporary string has a known mapping
    if (mapping[tempString]) {
      tempString = mapping[tempString];
    }
    result = result.concat(tempString);
  }
  return result;
};
