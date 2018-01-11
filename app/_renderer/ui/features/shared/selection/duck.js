import { SET_ENTRIES } from '../../steps/metadata/duck';

// import bundleDuck from '../../steps/bundles/duck';
import columnDuck from '../../steps/columns/duck';

export const SET_PREVIEW_BUNDLE = 'ebundleAuthor/shared/selection/SET_PREVIEW_BUNDLE';
export const SET_PREVIEW_COLUMN = 'ebundleAuthor/shared/selection/SET_PREVIEW_COLUMN';
export const SET_PREVIEW_ENTRY = 'ebundleAuthor/shared/selection/SET_PREVIEW_ENTRY';

export function setPreviewBundle(bundle) {
  return {
    type: SET_PREVIEW_BUNDLE,
    payload: { bundle }
  };
}

export function setPreviewColumn(column) {
  return {
    type: SET_PREVIEW_COLUMN,
    payload: { column }
  };
}

// Reducers
const initialState = {
  previewBundle: [],
  previewColumn: null,
  previewEntry: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // case bundleDuck.types.REMOVE_NODE:
    //   return {
    //     ...state,
    //     previewBundle: action.payload.uuid ===
    //  state.previewBundle.reverse()[0] ? [] : state.previewBundle
    //   };
    case columnDuck.types.REMOVE_NODE:
      return {
        ...state,
        previewColumn: action.payload.uuid === state.previewColumn ? null : state.previewColumn
      };
    case SET_PREVIEW_BUNDLE:
      return {
        ...state,
        previewBundle: action.payload.bundle
      };
    case SET_PREVIEW_ENTRY:
      return {
        ...state,
        previewEntry: action.payload.uuid
      };

    case SET_PREVIEW_COLUMN:
      return {
        ...state,
        previewColumn: action.payload.column[0]
      };
    case SET_ENTRIES:
      return initialState;
    default:
      return state;
  }
}
