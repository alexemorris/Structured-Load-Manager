import { ipcRenderer } from 'electron';
import fs from 'fs-extra';
import path from 'upath';
import Progress from '../progress';

import {
  SET_FILES_PROGRESS,
  SET_FILES_ERROR
} from '../../ui/features/steps/files/duck';

export default (files, uuids, titles, rootDir, type) => {
  console.log(`Building filelist ${type}`);
  const progress = new Progress(files.length, `${type} files`);
  try {
    const initialProgress = 0.05;
    let currentProgress = initialProgress;
    const results = [];
    for (let i = 0; i < files.length; i += 1) {
      const fileName = files[i];
      const uuid = uuids[i];
      const title = titles[i];
      if (!fileName) {
        results.push({
          file: null,
          full: null,
          title,
          blank: true,
          missing: true,
          empty: true,
          uuid
        });
      } else {
        const fullName = path.join(rootDir, fileName);
        try {
          const stats = fs.statSync(fullName);
          if (!stats.isFile()) {
            results.push({
              file: fileName,
              full: fullName,
              blank: false,
              missing: true,
              empty: true,
              title,
              uuid
            });
          } else {
            results.push({
              file: fileName,
              full: fullName,
              blank: false,
              missing: false,
              empty: false,
              title,
              uuid
            });
          }
        } catch (err) {
          results.push({
            file: fileName,
            full: fullName,
            blank: false,
            missing: true,
            empty: false,
            title,
            uuid
          });
        }
      }
      progress.increment(1);
      if ((i / uuids.length) > currentProgress) {
        currentProgress += initialProgress;
        ipcRenderer.send(SET_FILES_PROGRESS,
          { progress: currentProgress, column: type });
      }
    }
    progress.complete();
    return [
      ...results.filter(x => x.missing),
      ...results.filter(x => x.blank && !x.missing),
      ...results.filter(x => !x.blank && !x.missing)
    ];
  } catch (err) {
    console.log(err);
    ipcRenderer.send(SET_FILES_ERROR, { error: err.toString() });
  }
};
