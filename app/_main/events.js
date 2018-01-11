import { ipcMain, dialog } from 'electron';
import { SEND_APP_STATE, GET_APP_STATE } from '../_renderer/ui/events';

import {
  BROWSE_DIRECTORY,
  START_VERIFICATION,
  SET_FILES_PROGRESS,
  SET_FILES_ERROR,
  SET_FILES_RESULTS
} from '../_renderer/ui/features/steps/files/duck';

import {
  BROWSE_EBUNDLE,
  START_PACKAGING,
  SET_PACKAGING_PROGRESS,
  SET_PACKAGING_ERROR,
  SET_PACKAGING_COMPLETE,
  SET_ENCRYPTING_COMPLETE,
  SET_PACKAGING_FAILED
} from '../_renderer/ui/features/steps/packaging/duck';

import {
  CREATE_SEARCH_INDEX,
  SET_SEARCH_INDEX_PROGRESS,
  SET_SEARCH_INDEX_ERROR,
  SET_SEARCH_INDEX_COMPLETE,
  SET_SEARCH_INDEX_FAILED,
  SET_SEARCH_QUERY,
  SET_SEARCH_RESULTS
} from '../_renderer/ui/features/steps/search/duck';

import {
  BROWSE_METADATA,
  PARSE_METADATA,
  SET_METADATA_ERROR,
  SET_METADATA_COMPLETE
} from '../_renderer/ui/features/steps/metadata/duck';

import {
  REQUEST_COLUMN,
  RESPOND_COLUMN,
  AUTOMAP_COLUMNS,
  SET_COLUMNS
} from '../_renderer/ui/features/steps/columns/duck';

import {
  REQUEST_TABLE,
  RESPOND_TABLE
} from '../_renderer/ui/features/steps/preview/duck';


import {
  REQUEST_VALUES,
  RESPOND_VALUES,
  REQUEST_BUNDLE,
  RESPOND_BUNDLE
} from '../_renderer/ui/features/steps/bundles/duck';


import {
  SET_PROGRESS,
  SET_ERROR,
  SET_COMPLETE
} from '../_renderer/ui/create/constants';


export default (mainWindow, processingWindow) => {

  let channels = [];

  ipcMain.on(BROWSE_METADATA, (event) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Metadata', extensions: ['csv', 'dat'] }]
    }, (filepaths) => {
      if (filepaths) {
        event.returnValue = filepaths[0];
      } else {
        event.returnValue = null;
      }
    });
  });

  ipcMain.on(BROWSE_EBUNDLE, (event) => {
    dialog.showSaveDialog(mainWindow, {
      filters: [{
        name: 'eBundle Output',
        extensions: ['ebundle']
      }]
    }, (filepath) => {
      if (filepath) {
        event.returnValue = filepath;
      } else {
        event.returnValue = null;
      }
    });
  });

  ipcMain.on(BROWSE_DIRECTORY, (event) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    }, (dirpath) => {
      if (dirpath) {
        event.returnValue = dirpath[0];
      } else {
        event.returnValue = null;
      }
    });
  });

  ipcMain.on('BROWSE_DIRECTORY', (event) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    }, (dirpath) => {
      if (dirpath) {
        event.returnValue = dirpath[0];
      } else {
        event.returnValue = null;
      }
    });
  });

  ipcMain.on('BROWSE_FILE', (event) => {
    dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
    }, (dirpath) => {
      if (dirpath) {
        event.returnValue = dirpath[0];
      } else {
        event.returnValue = null;
      }
    });
  });

  ipcMain.on('SET_PROGRESS', (event, arg) => {
    mainWindow.send(SET_PROGRESS, arg);
  });

  ipcMain.on('SET_ERROR', (event, arg) => {
    mainWindow.send(SET_ERROR, arg);
  });

  ipcMain.on('SET_COMPLETE', (event, arg) => {
    mainWindow.send(SET_COMPLETE, arg);
  });

  ipcMain.on(GET_APP_STATE, () => {
    mainWindow.send(GET_APP_STATE);
  });

  ipcMain.on(SEND_APP_STATE, (event, arg) => {
    processingWindow.send(SEND_APP_STATE, arg);
  });

  [
    [
      START_VERIFICATION, [SET_FILES_PROGRESS, SET_FILES_ERROR, SET_FILES_RESULTS],
    ],
    [
      START_PACKAGING, [SET_PACKAGING_PROGRESS, SET_PACKAGING_ERROR,
        SET_PACKAGING_COMPLETE, SET_ENCRYPTING_COMPLETE, SET_PACKAGING_FAILED]
    ],
    [
      CREATE_SEARCH_INDEX, [SET_SEARCH_INDEX_PROGRESS, SET_SEARCH_INDEX_ERROR,
        SET_SEARCH_INDEX_FAILED, SET_SEARCH_INDEX_COMPLETE]
    ],
    [
      SET_SEARCH_QUERY, [SET_SEARCH_RESULTS]
    ],
    [
      PARSE_METADATA, [SET_METADATA_ERROR, SET_METADATA_COMPLETE]
    ],
    [
      REQUEST_COLUMN, [RESPOND_COLUMN]
    ],
    [
      AUTOMAP_COLUMNS, [SET_COLUMNS]
    ],
    [
      REQUEST_TABLE, [RESPOND_TABLE]
    ],
    [
      REQUEST_VALUES, [RESPOND_VALUES]
    ],
    [
      REQUEST_BUNDLE, [RESPOND_BUNDLE]
    ]
  ].forEach(x => {
    if (x[0]) {
      channels.push(x[0]);
      ipcMain.on(x[0], (event, arg) => {
        processingWindow.send(x[0], arg);
      });
    }
    x[1].forEach(y => {
      channels.push(y);
      ipcMain.on(y, (event, arg) => {
        mainWindow.send(y, arg);
        // if (/\/SET_COMPLETE/.test(y)) {
        //   mainWindow.send(SET_COMPLETE);
        // }
        // if (/\/SET_PROGRESS/.test(y)) {
        //   mainWindow.send(SET_PROGRESS, arg);
        // }
        // if (/\/SET_ERROR/.test(y)) {
        //   mainWindow.send(SET_ERROR, arg);
        // }
      });
    });
  });
  return channels;
};
