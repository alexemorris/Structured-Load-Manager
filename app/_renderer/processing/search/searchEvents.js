import { ipcRenderer } from 'electron';
import state from '../state';

import {
  CREATE_SEARCH_INDEX,
  SET_SEARCH_INDEX_COMPLETE,
  SET_SEARCH_INDEX_ERROR,
  SET_SEARCH_QUERY,
  SET_SEARCH_RESULTS
} from '../../ui/features/steps/search/duck';

ipcRenderer.on(CREATE_SEARCH_INDEX, async () => {
  try {
    await state.getSearchIndex();
    ipcRenderer.send(SET_SEARCH_INDEX_COMPLETE);
  } catch (error) {
    ipcRenderer.send(SET_SEARCH_INDEX_ERROR, { error: error.toString() });
  }
});

ipcRenderer.on(SET_SEARCH_QUERY, async (event, { query }) => {
  try {
    const results = await state.getSearchResults(null, query);
    ipcRenderer.send(SET_SEARCH_RESULTS, { results });
  } catch (err) {
    // ipcRenderer.send(SET_SEARCH_INDEX_ERROR, { error: err.toString() });
    console.log(err);
    ipcRenderer.send(SET_SEARCH_RESULTS, { results: [] });
  }
});
