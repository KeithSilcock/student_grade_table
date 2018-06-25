import types from "../actions/types";

const DEFAULT_STATE = {
  logged_in: false,
  errors: []
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.TEACHER_LOGGIN:
      if (action.payload.data.success) {
        return { ...state, logged_in: true };
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
