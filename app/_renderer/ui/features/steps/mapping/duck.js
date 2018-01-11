export const SET_MAPPING = 'ebundleAuthor/steps/mapping/SET_MAPPING';
export const SET_MAPPINGS = 'ebundleAuthor/steps/mapping/SET_MAPPINGS';


export function setMapping(column, value) {
  return {
    type: SET_MAPPING,
    payload: { column, value }
  };
}

export function setMappings(mappings) {
  return {
    type: SET_MAPPINGS,
    payload: { mappings }
  };
}

// Reducers
const initialState = {
  native: null,
  text: null,
  thumbs: null,
  uuid: null,
  title: null,
  description: null,
  date: null,
  parent: null,
  visible: null
};

export default function mapping(state = initialState, action) {
  switch (action.type) {
    case SET_MAPPING:
      return {
        ...state,
        [action.payload.column]: action.payload.value
      };
    case SET_MAPPINGS:
      console.log(action);
      return Object.keys(initialState).reduce((acc, curr) =>
        ({ ...acc, [curr]: action.payload.mappings[curr] || null }), {});
    default:
      return state;
  }
}
