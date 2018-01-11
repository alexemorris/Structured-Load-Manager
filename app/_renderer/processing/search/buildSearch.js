import { ipcRenderer } from 'electron';
import SearchIndex from './SearchIndex';
import castBool from '../../../utils/castBool';
import Progress from '../progress';

import {
  SET_SEARCH_INDEX_PROGRESS,
  SET_SEARCH_INDEX_COMPLETE,
  SET_SEARCH_INDEX_FAILED
} from '../../ui/features/steps/search/duck';

export default (columns, mapping, rows, fullText, textList, nativeList) => {
  console.log(`Building search index with full text set to ${fullText}`);
  const progress = new Progress(rows.length, 'Search Index');
  const searchIndex = new SearchIndex(columns, fullText);
  const length = rows.length;
  const initialProgress = 0.005;
  let currentProgress = initialProgress;
  rows.forEach((entry, i) => {
    const uuid = entry[mapping.uuid];
    try {
      const title = entry[mapping.title];
      progress.increment(1, `Indexing ${title}`);
      if ((i / rows.length) > currentProgress) {
        currentProgress += initialProgress;
        ipcRenderer.send(SET_SEARCH_INDEX_PROGRESS, { progress: i / length, message: `Indexing ${title}` });
      }
      const inputText = textList[i].full;
      const inputNative = nativeList[i].full;
      if ((mapping.visible && castBool(entry[mapping.visible]))
        || !mapping.visible) {
        searchIndex.addDoc(entry, uuid, inputText, inputNative);
      }
    } catch (err) {
      ipcRenderer.send(SET_SEARCH_INDEX_FAILED, { uuid, error: err.toString() });
    }
  });
  progress.complete();
  ipcRenderer.send(SET_SEARCH_INDEX_COMPLETE);
  return searchIndex;
};
