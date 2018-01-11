import { ipcRenderer } from 'electron';
import path from 'upath';

export const START_PACKAGING = 'ebundleAuthor/steps/package/START_PACKAGING';
export const SET_PACKAGING_PROGRESS = 'ebundleAuthor/steps/package/SET_PROGRESS';
export const SET_PACKAGING_ERROR = 'ebundleAuthor/steps/package/SET_ERROR';
export const SET_PACKAGING_FAILED = 'ebundleAuthor/steps/package/SET_FAILED';
export const SET_PACKAGING_COMPLETE = 'ebundleAuthor/steps/package/SET_COMPLETE';
export const SET_ENCRYPTING_COMPLETE = 'ebundleAuthor/steps/package/SET_ENCRYPTING_COMPLETE';
export const SET_PACKAGING_OUTPUT = 'ebundleAuthor/steps/package/SET_OUTPUT';
export const SET_PACKAGING_SETTINGS = 'ebundleAuthor/steps/package/SET_PACKAGING_SETTINGS';
export const SET_PACKAGING_SETTING = 'ebundleAuthor/steps/package/SET_PACKAGING_SETTING';
export const BROWSE_EBUNDLE = 'ebundleAuthor/steps/package/BROWSE_EBUNDLE';

// Actions

export function startPackaging(password) {
  return (dispatch, getState) => {
    const file = ipcRenderer.sendSync(BROWSE_EBUNDLE);
    if (file) {
      ipcRenderer.send(START_PACKAGING, {
        state: getState(),
        password,
        file
      });
    }
  };
}

export function setProgress({ progress, message }) {
  return {
    type: SET_PACKAGING_PROGRESS,
    payload: { progress, message }
  };
}


export function setError(error) {
  return {
    type: SET_PACKAGING_ERROR,
    payload: { error }
  };
}

export function setEncryptingComplete() {
  return {
    type: SET_ENCRYPTING_COMPLETE
  };
}

export function setComplete(arg) {
  return {
    type: SET_PACKAGING_COMPLETE,
    payload: arg
  };
}

export function setPackagingSetting(column, value) {
  return {
    type: SET_PACKAGING_SETTING,
    payload: {
      column, value
    }
  };
}

export function setPackagingFailed(uuid, error) {
  return {
    type: SET_PACKAGING_FAILED,
    payload: {
      uuid, error
    }
  };
}


export function setPackagingSettings(settings) {
  return {
    type: SET_PACKAGING_SETTINGS,
    payload: { settings }
  };
}


// Reducers
const initialState = {
  output: null,
  complete: false,
  encrypted: false,
  packaging: false,
  progress: 0,
  message: '',
  error: null,
  info: null,
  failed: [],
  settings: {
    title: 'Electronic Bundle',
    author: '',
    version: '',
    description: 'eBundle Author generated eBundle',
    applicants: '',
    authority: '',
    reference: ''
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PACKAGING_SETTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.column]: action.payload.value
        }
      };
    case SET_PACKAGING_SETTINGS:
      return {
        ...state,
        settings: Object.keys(initialState.settings).reduce((acc, curr) => ({
          ...acc,
          [curr]: action.payload.settings[curr] || initialState.settings[curr]
        }), {})
      };
    case SET_PACKAGING_PROGRESS:
      return {
        ...state,
        message: action.payload.message,
        progress: action.payload.progress
      };
    case SET_PACKAGING_FAILED:
      return {
        ...state,
        failed: [...state.failed, {
          uuid: action.payload.uuid,
          error: action.payload.error
        }]
      };
    case SET_PACKAGING_COMPLETE:
      return {
        ...state,
        output: action.payload.filename,
        complete: true
      };
    case SET_ENCRYPTING_COMPLETE:
      return {
        ...state,
        progress: 1,
        encrypted: true
      };
    case SET_PACKAGING_ERROR:
      return {
        ...state,
        error: action.payload.error
      };
    default:
      return state;
  }
}
