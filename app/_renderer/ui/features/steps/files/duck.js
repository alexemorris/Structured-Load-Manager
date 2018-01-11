import { ipcRenderer } from 'electron';
import path from 'upath';

import { SET_METADATA_PATH } from '../metadata/duck';

export const BROWSE_DIRECTORY = 'ebundleAuthor/steps/files/BROWSE_DIRECTORY';

export const START_VERIFICATION = 'ebundleAuthor/steps/files/START_VERIFICATION';
export const SET_FILES_PROGRESS = 'ebundleAuthor/steps/files/SET_PROGRESS';
export const SET_FILES_ERROR = 'ebundleAuthor/steps/files/SET_ERROR';
export const SET_FILES_RESULTS = 'ebundleAuthor/steps/files/SET_COMPLETE';

const SET_DIRECTORY = 'ebundleAuthor/steps/files/SET_DIRECTORY';

export function browseDirectory(col) {
  return (dispatch) => {
    const dir = ipcRenderer.sendSync('BROWSE_DIRECTORY');
    if (dir) {
      dispatch(setDirectory(dir, col));
    }
  };
}

export function startVerification(col) {
  return () => {
    console.log(col);
    ipcRenderer.send(START_VERIFICATION, {
      type: col
    });
  };
}

export function setResults(results, column) {
  return {
    type: SET_FILES_RESULTS,
    payload: { results, column }
  };
}

export function setProgress(progress, column, missing, blank, verified) {
  return {
    type: SET_FILES_PROGRESS,
    payload: { progress, column, missing, blank, verified }
  };
}


export function setError(error, column) {
  return {
    type: SET_FILES_ERROR,
    payload: { error, column }
  };
}

export function setDirectory(directory, column) {
  return {
    type: SET_DIRECTORY,
    payload: { directory, column }
  };
}


// Reducers
const initialState = {
  native: {
    progress: 0,
    verified: false,
    directory: null,
    results: [],
    error: ''
  },
  text: {
    verified: false,
    progress: 0,
    directory: null,
    results: [],
    error: ''
  },
  thumb: {
    verified: false,
    progress: 0,
    directory: null,
    results: [],
    error: ''
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_METADATA_PATH:
      return {
        native: {
          ...state.native,
          directory: path.dirname(action.payload)
        },
        text: {
          ...state.text,
          directory: path.dirname(action.payload)
        }
      };
    case SET_DIRECTORY:
      return {
        ...state,
        [action.payload.column]: {
          ...state[action.payload.column],
          directory: action.payload.directory
        }
      };
    case START_VERIFICATION:
      return {
        ...state,
        [action.payload.column]: {
          ...state[action.payload.column],
          verified: 0,
          progress: 0,
          results: [],
          error: null
        }
      };
    case SET_FILES_PROGRESS:
      return {
        ...state,
        [action.payload.column]: {
          ...state[action.payload.column],
          ...action.payload
        }
      };
    case SET_FILES_RESULTS:
      return {
        ...state,
        [action.payload.column]: {
          ...state[action.payload.column],
          ...action.payload,
          progress: 1,
          verified: true
        }
      };
    case SET_FILES_ERROR:
      return {
        ...state,
        [action.payload.column]: {
          ...state[action.payload.column],
          progress: 1,
          error: action.payload.error
        }
      };
    default:
      return state;
  }
}
