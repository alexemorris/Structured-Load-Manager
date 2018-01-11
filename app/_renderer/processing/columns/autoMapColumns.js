import { blankNode } from '../../ui/features/tree/createDuck';
import detectDateFormat from '../../../utils/dates/detectDateFormat';
import { blankSettingsObject } from '../../ui/features/steps/columns/duck';
import Progress from '../progress';

export default (entries, rootPath) => {
  console.log('Automapping columns');
  const header = Object.keys(entries[0]);
  const progress = new Progress(header.length - 1, 'Automapping Columns');
  const isNumeric = (n) => !n || (!isNaN(parseFloat(n)) && isFinite(n));
  let cols = [];
  let proc = [];
  header.filter(x => x && x !== 'Generated GUID').forEach(col => {
    progress.increment(1, `Determining ${col}`);
    const values = entries.map(val => val[col]);
    const valuesSet = [...new Set(values)];
    let type = 'string';
    let mapping = 'direct';
    let dateFormat = null;
    const dateformats = detectDateFormat(values);
    if (dateformats.length === 1) {
      type = 'date';
      mapping = 'date';
      dateFormat = dateformats[0];
    } else if (valuesSet.length < (entries.length / 10)) {
      type = 'categorical';
    } else if (values.every(isNumeric)) {
      type = 'number';
    } else if ([...new Set(values.map(z => z.length))].length < 5) {
      type = 'fixed';
    }
    proc = [...proc, [{
      template: '$[__]'.replace('__', col),
      direct: col,
      expanded: false,
      rootPath,
      type,
      dateFormat,
      mapping,
      script: `this.output = this.values['${col}'];`
    }, col]];
  });
  progress.increment(1, 'Processing results');
  cols = [...proc.map(x => ({
    ...blankNode([], [], blankSettingsObject, 'Column'),
    name: x[1],
    settings: { ...blankSettingsObject, ...x[0] }
  })), ...cols];
  progress.complete();
  return cols;
};
