import types from "../actions/types";

const DEFAULT_STATE = {
  recentPage: "",
  smallModalIsOpen: false
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_RECENT_PAGE:
      return {
        ...state,
        recentPage: action.payload
      };

    case types.TOGGLE_SMALL_MODAL:
      return {
        ...state,
        smallModalIsOpen: !state.smallModalIsOpen
      };

    default:
      return state;
  }
}
