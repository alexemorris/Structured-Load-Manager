import fs from 'fs-extra';
import * as fileDuck from './features/steps/files/duck';
import * as searchDuck from './features/steps/search/duck';
import * as metadataDuck from './features/steps/metadata/duck';
import * as mappingDuck from './features/steps/mapping/duck';
import * as packagingDuck from './features/steps/packaging/duck';

import bundleDuck from './features/steps/bundles/duck';
import columnDuck, { SET_COLUMNS } from './features/steps/columns/duck';

export const SAVE_TEMPLATE = 'ebundleAuthor/root/SAVE_TEMPLATE';
export const LOAD_TEMPLATE = 'ebundleAuthor/root/LOAD_TEMPLATE';
export const GET_APP_STATE = 'ebundleAuthor/root/GET_APP_STATE';
export const SEND_APP_STATE = 'ebundleAuthor/root/SEND_APP_STATE';

export default (ipcRenderer, store) => {
  ipcRenderer.on(SAVE_TEMPLATE, (event, arg) => {
    const state = store.getState();
    const template = {
      mapping: state.mapping,
      columns: state.columns,
      bundles: state.bundles,
      packaging: state.packaging.settings
    };
    fs.writeJsonSync(arg, template);
  });

  ipcRenderer.on(GET_APP_STATE, () => {
    ipcRenderer.send(SEND_APP_STATE, { state: store.getState() });
  });

  ipcRenderer.on(LOAD_TEMPLATE, (event, arg) => {
    console.log(arg);
    const template = fs.readJsonSync(arg);
    console.log(template);
    store.dispatch(columnDuck.creators.setNodes(template.columns));
    store.dispatch(bundleDuck.creators.setNodes(template.bundles));
    store.dispatch(mappingDuck.setMappings(template.mapping));
    if (template.packaging) {
      store.dispatch(packagingDuck.setPackagingSettings(template.packaging));
    }
  });

  ipcRenderer.on(fileDuck.SET_FILES_PROGRESS, (event, { progress, column }) => {
    store.dispatch(fileDuck.setProgress(progress, column));
  });

  ipcRenderer.on(fileDuck.SET_FILES_ERROR, (event, { error, column }) => {
    store.dispatch(fileDuck.setError(error, column));
  });

  ipcRenderer.on(fileDuck.SET_FILES_RESULTS, (event, arg) => {
    store.dispatch(fileDuck.setResults(arg.results, arg.column));
  });

  ipcRenderer.on(searchDuck.SET_SEARCH_INDEX_COMPLETE, () => {
    store.dispatch(searchDuck.setComplete());
  });

  ipcRenderer.on(searchDuck.SET_SEARCH_INDEX_PROGRESS, (event, arg) => {
    store.dispatch(searchDuck.setProgress(arg));
  });

  ipcRenderer.on(searchDuck.SET_SEARCH_INDEX_FAILED, (event, { uuid, error }) => {
    store.dispatch(searchDuck.setFailed(uuid, error));
  });


  ipcRenderer.on(searchDuck.SET_SEARCH_INDEX_ERROR, (event, { error }) => {
    store.dispatch(searchDuck.setError(error));
  });

  ipcRenderer.on(metadataDuck.SET_METADATA_COMPLETE, (event, arg) => {
    store.dispatch(metadataDuck.setComplete(arg));
  });

  ipcRenderer.on(metadataDuck.SET_METADATA_ERROR, (event, error) => {
    store.dispatch(metadataDuck.setError(error));
  });

  ipcRenderer.on(SET_COLUMNS, (event, { columns }) => {
    store.dispatch(columnDuck.creators.setColumns(columns));
  });

  ipcRenderer.on(packagingDuck.SET_PACKAGING_PROGRESS, (event, progress) => {
    store.dispatch(packagingDuck.setProgress(progress));
  });

  ipcRenderer.on(packagingDuck.SET_PACKAGING_FAILED, (event, { uuid, error }) => {
    store.dispatch(packagingDuck.setPackagingFailed(uuid, error));
  });

  ipcRenderer.on(packagingDuck.SET_PACKAGING_COMPLETE, (event, arg) => {
    store.dispatch(packagingDuck.setComplete(arg));
  });

  ipcRenderer.on(packagingDuck.SET_PACKAGING_ERROR, (event, { error }) => {
    store.dispatch(packagingDuck.setError(error));
  });

  ipcRenderer.on(packagingDuck.SET_ENCRYPTING_COMPLETE, () => {
    store.dispatch(packagingDuck.setEncryptingComplete());
  });
};
