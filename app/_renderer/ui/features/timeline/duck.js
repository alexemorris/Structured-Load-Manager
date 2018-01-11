import { createStructuredSelector } from 'reselect';

const NEXT_STEP = 'ebundleAuthor/timeline/NEXT_STEP';
const PREV_STEP = 'ebundleAuthor/timeline/PREV_STEP';
const SET_STEP = 'ebundleAuthor/timeline/SET_STEP';

export function nextStep() {
  return {
    type: NEXT_STEP
  };
}

export function prevStep() {
  return {
    type: PREV_STEP
  };
}

export function setStep(number) {
  return {
    type: SET_STEP,
    payload: number
  };
}

// Reducers

const initialState = {
  step: 0
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case NEXT_STEP:
      return { step: state.step + 1 };
    case PREV_STEP:
      return { step: state.step - 1 };
    case SET_STEP:
      return { step: action.payload };
    default:
      return state;
  }
}


// Selectors

const timeline = state => state.timeline;

export const selector = createStructuredSelector({
  timeline
});
