import { ipcRenderer } from 'electron';
import state from '../state';

import {
  SET_FILES_RESULTS,
  START_VERIFICATION
} from '../../ui/features/steps/files/duck';

ipcRenderer.on(START_VERIFICATION, async (event, { type }) => {
  const results = await state.getFileList(null, type);
  console.log(SET_FILES_RESULTS);
  ipcRenderer.send(SET_FILES_RESULTS, { results, column: type });
});
