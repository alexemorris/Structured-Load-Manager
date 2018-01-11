// import { createSelector } from 'reselect';
import { ipcRenderer } from 'electron';
import path from 'upath';
// import { creators as columnCreators } from '../columns/duck';

export const BROWSE_METADATA = 'ebundleAuthor/steps/metadata/BROWSE_METADATA';
export const PARSE_METADATA = 'ebundleAuthor/steps/metadata/PARSE_METADATA';
export const SET_METADATA_ERROR = 'ebundleAuthor/steps/metadata/SET_METADATA_ERROR';
export const SET_METADATA_PATH = 'ebundleAuthor/steps/metadata/SET_METADATA_PATH';
export const SET_METADATA_COMPLETE = 'ebundleAuthor/steps/metadata/SET_METADATA_COMPLETE';

export const SET_METADATA_DIRECTORY = 'ebundleAuthor/steps/metadata/SET_METADATA_DIRECTORY';
const SET_METADATA_PROCESSING = 'ebundleAuthor/steps/metadata/SET_METADATA_PROCESSING';

// Actions
export function chooseMetadata() {
  return (dispatch) => {
    const file = ipcRenderer.sendSync(BROWSE_METADATA);
    if (file) {
      dispatch(setMetadataPath(file));
      dispatch(setMetadataProcessing());
      ipcRenderer.send(PARSE_METADATA);
    }
  };
}

export function setMetadataPath(filepath) {
  return {
    type: SET_METADATA_PATH,
    payload: filepath
  };
}

export function setMetadataProcessing() {
  return {
    type: SET_METADATA_PROCESSING
  };
}

export function setComplete(arg) {
  return {
    type: SET_METADATA_COMPLETE,
    payload: arg
  };
}

export function setError(error) {
  return {
    type: SET_METADATA_ERROR,
    payload: error
  };
}

const initialState = {
  directory: null,
  filename: null,
  processing: false,
  invalid: null,
  rows: 0,
  columns: 0,
  header: []
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_METADATA_COMPLETE:
      return {
        ...state,
        ...action.payload,
        processing: false
      };
    case SET_METADATA_PROCESSING:
      return { ...state, processing: true };
    case SET_METADATA_PATH:
      return { ...initialState, directory: path.dirname(action.payload), filename: path.basename(action.payload) }
    case SET_METADATA_ERROR:
      return { ...state, error: action.payload.error };
    default:
      return state;
  }
}
