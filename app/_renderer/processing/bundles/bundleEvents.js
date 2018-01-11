import { ipcRenderer } from 'electron';
import state from '../state';
import Progress from '../progress';

import {
  REQUEST_VALUES,
  RESPOND_VALUES,
  REQUEST_BUNDLE,
  RESPOND_BUNDLE
} from '../../ui/features/steps/bundles/duck';


ipcRenderer.on(REQUEST_VALUES, async () => {
  try {
    const progress = new Progress(null, 'Getting unique values');
    console.log('Bundle values requested');
    const appState = await state.getState();
    const output = appState.columns.map(async x => {
      const col = await state.getColumn(appState, x.uuid);
      return {
        ...x,
        values: [...col.unique]
      };
    });
    progress.complete();
    ipcRenderer.send(RESPOND_VALUES, {
      values: await Promise.all(output)
    });
  } catch (err) {
    console.log(err);
  }
});

ipcRenderer.on(REQUEST_BUNDLE, async (event, bundle) => {
  try {
    console.log('Bundle requested');
    const progress = new Progress(bundle.length, 'Bundle');
    const values = await state.getTable();
    const output = bundle.filter.reduce((acc, curr) => {
      progress.increment(1, `Filtering ${curr.filterColumn}`);
      return acc.filter(x => x[curr.filterColumn] === curr.filterValue);
    }, values);
    progress.complete();
    ipcRenderer.send(RESPOND_BUNDLE, {
      values: output.map(x => x[bundle.column.uuid])
    });
  } catch (err) {
    console.log(err);
  }
});
