import fs from 'fs-extra';
import path from 'upath';
import _ from 'lodash';
import { ipcRenderer } from 'electron';
import moment from 'moment';
import sandbox from 'sandbox-runner';
import translateDateFormat from '../../../utils/dates/translateDateFormat';
import Progress from '../progress';

const re = /\$\[([^\]]+)\]/ig;
const init = `
  const moment = this.moment;
  const _ = this._
  const fs = this.fs
`;

export default (entries, fullColumn, report = true) => {
  console.log('Building column');
  const column = fullColumn.settings;
  const progress = report ? new Progress(entries.length, fullColumn.name) : null;
  const values = entries.map(v => {
    if (report) progress.increment(1, `Processing column: ${fullColumn.name}`);
    if (!v) return null;
    switch (column.mapping) {
      case 'template':
        return (
          column.template.replace(re, (match, text) => v[text] || match)
        );
      case 'direct':
        return v[column.direct];
      case 'date':
        return moment(column.template.replace(re, (match, text) => v[text] || match),
          translateDateFormat(column.dateFormat, true), true).format('YYYY/MM/DD HH:mm');
      case 'script':
        try {
          return sandbox.run(init + column.script, { values: v, _, moment, fs }).output;
        } catch (err) {
          return err.toString();
        }
      case 'readfile':
        try {
          const inputPath = path.join(column.rootPath,
            column.template.replace(re, (match, text) => v[text] || match));
          if (fs.existsSync(inputPath)) {
            return fs.readFileSync(inputPath).toString();
          }
          return '';
        } catch (err) {
          return err.toString();
        }
      default:
        return null;
    }
  });

  const typed = values.map(v => {
    if (!v) return null;

    switch (column.type) {
      default:
        return v;
    }
  });

  if (report) progress.complete();

  return {
    values: typed,
    unique: new Set(typed)
  };
};
