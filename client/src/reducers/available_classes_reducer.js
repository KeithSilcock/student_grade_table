import types from "../actions/types";

const DEFAULT_STATE = {
  classes: {}
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_AVAILABLE_CLASSES:
      return { ...state, classes: action.payload };
    default:
      return state;
  }
}
