// import { remote } from 'electron';
import fs from 'fs-extra';
import uuidv1 from 'uuid';
import { ipcRenderer } from 'electron';
import md5 from 'md5';
import path from 'upath';
import { csv, dat } from '../../utils/parse';
import buildSearch from './search/buildSearch';
import buildFileList from './filelist/buildFileList';
import buildColumn from './columns/buildColumn';
import buildTable from './columns/buildTable';
import Progress from './progress';

import {
  GET_APP_STATE,
  SEND_APP_STATE
} from '../ui/events';

const parseEntries = (metadata) => {
  console.log(`Parsing ${metadata}`);
  let fileIndex = [];
  if (metadata) {
    const parse = path.extname(metadata) === '.csv' ? csv : dat;
    fileIndex = parse(fs.readFileSync(metadata), { columns: true }).map((x, i) => ({
      ...x,
      'Generated Line Index': pad(i, 6),
      'Generated GUID': uuidv1()
    }));
  }
  return fileIndex;
};

const pad = (n, width, z) => {
  const zi = z || '0';
  const ni = `${n}`;
  return n.length >= width ? ni : new Array(width - (ni.length + 1)).join(zi) + ni;
};

const getAppState = (state) => (
  new Promise((resolve, reject) => {
    if (state) {
      console.log('State returned');
      resolve(state);
    } else {
      console.log('Requesting app state');
      ipcRenderer.send(GET_APP_STATE);
      ipcRenderer.once(SEND_APP_STATE, (event, arg) => {
        console.log('Recieved app state');
        resolve(arg.state);
      });
      setTimeout(() => {
        reject('Processing thread timedout');
      }, 1000);
    }
  })
);

const initialState = {
  entries: [],
  searchIndex: null,
  searchIndexHash: null,
  inverseLookup: {},
  values: [],
  fileMap: {},
  columns: {},
  bundles: {},
  table: {
    hash: null,
    values: []
  }
};

const State = module.exports = {
  ...initialState,
  getState: async (appState) => getAppState(appState),
  getEntries: async (appState) => {
    const state = await getAppState(appState);
    const metadata = path.join(state.metadata.directory, state.metadata.filename);
    if (State.entries.length && metadata === State.metadata) {
      return State.entries;
    }
    State.entries = parseEntries(metadata);
    return State.entries;
  },
  getColumn: async (appState, uuid, report = true) => {
    console.log(`Column ${uuid} requested`);
    if (!uuid) {
      return {
        values: [],
        uuid
      };
    }
    const state = await getAppState(appState);
    const currentColumn = state.columns.filter(x => x.uuid === uuid)[0];
    const columnHash = md5(JSON.stringify(currentColumn));
    if (
      State.columns[uuid] &&
      State.columns[uuid].hash === columnHash) {
      console.log(`Returning column ${uuid} from cache`);
      return State.columns[uuid];
    }
    console.log(`Building column ${uuid}`);
    const entries = await State.getEntries(state);
    State.columns[uuid] = {
      ...buildColumn(entries, currentColumn, report),
      ...currentColumn,
      hash: columnHash
    };
    return State.columns[uuid];
  },
  getAllColumns: async (appState) => {
    console.log('Requested all columns');
    const state = await getAppState(appState);
    const progress = new Progress(state.columns.length, 'Table');
    const output = state.columns.map(async x => {
      const col = await State.getColumn(appState, x.uuid, false);
      progress.increment(1, `Proccesed ${x.name}`);
      return col;
    });
    const waited = await Promise.all(output);
    progress.complete();
    return waited;
  },
  getTable: async (appState) => {
    console.log('Requested table');
    const state = await getAppState(appState);
    const columnsHash = md5(JSON.stringify(state.columns));
    if (
      State.table.values.length &&
      State.table.hash === columnsHash
    ) {
      console.log('Returning table from cache');
      return State.table.values;
    }
    console.log('Requesting table build');
    const values = await State.getAllColumns(state);
    State.table = {
      hash: columnsHash,
      values: buildTable(state.columns.map(x => x.uuid), values.map(x => x.values))
    };
    return State.table.values;
  },
  getFileList: async (appState, type) => {
    console.log(`Request for file list for ${type}`);
    const state = await getAppState(appState);
    if (State.fileMap[type]) {
      console.log(`Return file list for ${type} from cache`);
      return State.fileMap[type];
    }
    const uuids = await State.getColumn(state, state.mapping.uuid);
    const files = await State.getColumn(state, state.mapping[type]);
    const titles = await State.getColumn(state, state.mapping.title);
    const rootDir = state.files[type].directory;
    const results = buildFileList(files.values, uuids.values, titles.values, rootDir, type);
    State.fileMap[type] = results;
    return State.fileMap[type];
  },
  getSearchIndex: async (appState) => {
    console.log('building search index');
    const state = await getAppState(appState);
    console.log(state);
    const indexedHash = md5(state.columns.filter(x => x.settings.indexed).sort((a, b) => a.uuid < b.uuid).map(x => x.uuid).join('-'));
    console.log(indexedHash);
    if (State.searchIndex && indexedHash === State.searchIndexHash) {
      console.log('Returning search index from from cache');
      return State.searchIndex;
    }
    const textList = await State.getFileList(state, 'text');
    const nativeList = await State.getFileList(state, 'native');
    const fullText = state.search.fulltext;
    const { columns, mapping } = state;
    const rows = await State.getTable(state);
    State.searchIndexHash = indexedHash;
    State.searchIndex = buildSearch(columns, mapping, rows, fullText, textList, nativeList);
    return State.searchIndex;
  },
  getSearchResults: async (appState, query, config) => {
    const state = await getAppState(appState);
    const columnsHash = md5(JSON.stringify(state.columns));
    if (
      State.searchIndex &&
      State.table.hash === columnsHash
    ) {
      return State.searchIndex.search(query, config);
    }
    await State.buildSearchIndex();
    return State.searchIndex.search(query, config);
  },
  reset: () => {
    console.log('Resetting State');
    Object.keys(initialState).forEach(x => {
      State[x] = initialState[x];
    });
  }
};
