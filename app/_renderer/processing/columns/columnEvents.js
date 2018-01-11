import { ipcRenderer } from 'electron';
import path from 'upath';
import fs from 'fs-extra';
import autoMapColumns from './autoMapColumns';

import state from '../state';

import {
  REQUEST_COLUMN,
  RESPOND_COLUMN,
  AUTOMAP_COLUMNS,
  SET_COLUMNS,
  SAVE_MAPPED_COLUMNS
} from '../../ui/features/steps/columns/duck';

import {
  REQUEST_TABLE,
  RESPOND_TABLE
} from '../../ui/features/steps/preview/duck';

import { dat, csv } from '../../../utils/encode';

ipcRenderer.on(REQUEST_COLUMN, async (event, uuid) => {
  const col = await state.getColumn(null, uuid);
  ipcRenderer.send(RESPOND_COLUMN, { values: col.values });
});

ipcRenderer.on(SAVE_MAPPED_COLUMNS, async (event, arg) => {
  const appState = await state.getState();
  const table = await state.getTable(appState);
  const generate = path.extname(arg) === '.dat' ? dat : csv;
  const data = table.map(row => appState.columns.map(col => row[col.uuid]));
  const output = await generate(data, appState.columns.map(x => x.name));
  console.log('Writing csv');
  console.log(arg);
  fs.writeFileSync(arg, output);
  // console.log(arg);
});

ipcRenderer.on(AUTOMAP_COLUMNS, async () => {
  const appState = await state.getState();
  const entries = await state.getEntries(appState);
  const columns = autoMapColumns(entries, appState.metadata.directory);
  ipcRenderer.send(SET_COLUMNS, { columns });
});

ipcRenderer.on(REQUEST_TABLE, async () => {
  ipcRenderer.send(RESPOND_TABLE, {
    rows: await state.getTable()
  });
});
