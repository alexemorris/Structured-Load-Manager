import { createStructuredSelector, createSelector } from 'reselect';
import { ipcRenderer } from 'electron';

export const CREATE_SEARCH_INDEX = 'ebundleAuthor/steps/search/CREATE_SEARCH_INDEX';
export const SET_SEARCH_INDEX_PROGRESS = 'ebundleAuthor/steps/search/SET_PROGRESS';
export const SET_SEARCH_INDEX_ERROR = 'ebundleAuthor/steps/search/SET_ERROR';
export const SET_SEARCH_INDEX_FAILED = 'ebundleAuthor/steps/search/SET_FAILED';
export const SET_SEARCH_INDEX_COMPLETE = 'ebundleAuthor/steps/search/SET_COMPLETE';
export const SET_SEARCH_QUERY = 'ebundleAuthor/steps/search/SET_SEARCH_QUERY';
export const SET_SEARCH_RESULTS = 'ebundleAuthor/steps/search/SET_SEARCH_RESULTS';
export const TOGGLE_FULL_TEXT = 'ebundleAuthor/steps/search/TOGGLE_FULL_TEXT';
export const RESET_SEARCH_INDEX = 'ebundleAuthor/steps/search/RESET_SEARCH_INDEX';

export function createSearchIndex() {
  return (dispatch) => {
    ipcRenderer.send(CREATE_SEARCH_INDEX);
    dispatch(setProgress({ progress: 0.0001, message: 'Initializing' }));
  };
}

export function sendSearchQuery(query) {
  return (dispatch) => {
    ipcRenderer.send(SET_SEARCH_QUERY, {
      query
    });
    dispatch(setQuery(query));
  };
}

export function setQuery(query) {
  return {
    type: SET_SEARCH_QUERY,
    payload: { query }
  };
}

export function setResults(results) {
  return {
    type: SET_SEARCH_RESULTS,
    payload: { results }
  };
}

export function setFailed(uuid, error) {
  return {
    type: SET_SEARCH_INDEX_FAILED,
    payload: { uuid, error }
  };
}

export function setProgress(arg) {
  return {
    type: SET_SEARCH_INDEX_PROGRESS,
    payload: arg
  };
}

export function setError(error) {
  return {
    type: SET_SEARCH_INDEX_ERROR,
    payload: { error }
  };
}

export function setComplete() {
  return {
    type: SET_SEARCH_INDEX_COMPLETE
  };
}

export function resetSearchIndex() {
  return {
    type: RESET_SEARCH_INDEX
  };
}

export function toggleFullText() {
  return {
    type: TOGGLE_FULL_TEXT
  };
}

// Reducers
const initialState = {
  complete: false,
  error: '',
  progress: 0,
  fulltext: false,
  query: '',
  message: '',
  results: [],
  failed: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return {
        ...state,
        query: action.payload.query
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload.results
      };
    case SET_SEARCH_INDEX_PROGRESS:
      return {
        ...state,
        results: [],
        query: '',
        message: action.payload.message,
        progress: action.payload.progress,
        complete: false
      };
    case SET_SEARCH_INDEX_FAILED:
      return {
        ...state,
        failed: [...state.failed, {
          uuid: action.payload.uuid,
          error: action.payload.error
        }]
      };
    case SET_SEARCH_INDEX_ERROR:
      return {
        ...state,
        results: [],
        error: action.payload.error,
        complete: false,
      };
    case SET_SEARCH_INDEX_COMPLETE:
      return {
        ...state,
        progress: 1,
        complete: true
      };
    case RESET_SEARCH_INDEX:
      return {
        ...state,
        progress: 0,
        complete: false,
        error: ''
      };
    case TOGGLE_FULL_TEXT:
      return {
        ...state,
        fulltext: !state.fulltext
      };
    default:
      return state;
  }
}

// Selectors
const metadata = (state) => state.metadata.entries;

const header = createSelector(
  [metadata], (m) => Object.keys(m[0] ? m[0] : []).filter(x => x.trim())
);

export const selector = createStructuredSelector({
  header
});
