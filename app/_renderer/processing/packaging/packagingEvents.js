import { ipcRenderer } from 'electron';
import buildEbundle from './buildEbundle';
import state from '../state';

import {
  START_PACKAGING,
  SET_PACKAGING_ERROR,
  SET_PACKAGING_PROGRESS
} from '../../ui/features/steps/packaging/duck';

ipcRenderer.on(START_PACKAGING, async (event, arg) => {
    ipcRenderer.send(SET_PACKAGING_PROGRESS, { progress: 0.001, message: 'Initialising packaging' });
    const appState = await state.getState();
    const values = await state.getTable(appState);
    const mapping = appState.mapping;
    const columns = appState.columns;
    const bundles = appState.bundles;
    const settings = appState.packaging.settings;
    const searchIndex = await state.getSearchIndex(appState);
    const nativeList = await state.getFileList(appState, 'native');
    const textList = await state.getFileList(appState, 'text');
    const password = arg.password;
    const metadatadir = appState.metadata.directory;
    const outputFileName = arg.file;
    buildEbundle(values, mapping, columns, bundles, settings, searchIndex,
      nativeList, textList, password, metadatadir, outputFileName);
});
