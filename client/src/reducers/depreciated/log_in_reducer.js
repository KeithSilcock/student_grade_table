import types from "../actions/types";

const DEFAULT_STATE = {
  logged_in: false,
  permissions: null,
  errors: []
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.LOGIN:
      if (action.payload.data.success) {
        return {
          ...state,
          logged_in: true,
          permissions: action.payload.data.data.permissions
        };
      } else {
        return {
          ...state,
          errors: [...state.errors, action.payload.data.errors]
        };
      }

    case types.LOGOUT:
      if (action.payload.data.success) {
        return {
          ...state,
          logged_in: false,
          permissions: null
        };
      } else {
        return {
          ...state,
          errors: [...state.errors, action.payload.data.errors]
        };
      }
    default:
      return state;
  }
}
