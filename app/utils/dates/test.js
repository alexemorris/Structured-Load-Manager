const detectDateFormat = require('./detectDateFormat');
const translateDateFormat = require('./translateDateFormat');


describe('Detect Date Format', () => {
  it('Should detect non ambigous dates', () => {
    const output = detectDateFormat(['2017/05/12 12:31:21', '2017/14/12 12:31:21']);
    expect(output).toEqual(['yyyy/d/M HH:mm:ss']);
  });

  it('Should detect ambigous dates', () => {
    const output = detectDateFormat(['2017/05/12 12:31:21', '2017/03/12 12:31:21']);
    expect(output).toEqual(['yyyy/d/M HH:mm:ss', 'yyyy/M/d HH:mm:ss']);
  });
});

describe('Translate Date Format', () => {
  it('Should translate Moment to Java date format', () => {
    const output = translateDateFormat('YYYY/D/M HH:mm:ss');
    expect(output).toEqual('yyyy/d/M HH:mm:ss');
  });

  it('Should translate Java to Moment date format', () => {
    const output = translateDateFormat('yyyy/d/M HH:mm:ss', true);
    expect(output).toEqual('YYYY/D/M HH:mm:ss');
  });

  it('Should be pure', () => {
    const input = 'yyyy/d/M HH:mm:ss';
    const output = translateDateFormat(input, true);
    const reverted = translateDateFormat(output);
    expect(reverted).toEqual(input);
  });
});
