import types from "../actions/types";

const DEFAULT_STATE = {
  recentPage: ""
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_RECENT_PAGE:
      return {
        ...state,
        recentPage: action.payload
      };
    default:
      return state;
  }
}
