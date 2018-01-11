import { ipcRenderer } from 'electron';
import state from '../state';
import Progress from '../progress';
import {
  PARSE_METADATA,
  SET_METADATA_ERROR,
  SET_METADATA_COMPLETE
} from '../../ui/features/steps/metadata/duck';

ipcRenderer.on(PARSE_METADATA, async () => {
  try {
    const progress = new Progress(null, 'Metadata');
    state.reset();
    const curr = await state.getState();
    const entries = await state.getEntries(curr);
    progress.complete();
    ipcRenderer.send(SET_METADATA_COMPLETE, {
      rows: state.entries.length,
      columns: Object.keys(entries[0]).length,
      header: Object.keys(entries[0])
    });
  } catch (err) {
    ipcRenderer.send(SET_METADATA_ERROR, {
      error: err.toString()
    });
  }
});
