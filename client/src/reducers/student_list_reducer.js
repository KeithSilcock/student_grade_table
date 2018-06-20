import types from "../actions/types";

const DEFAULT_STATE = {
  student_data: {},
  errors: []
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.TEACHER_LOGGIN:
      if (action.payload.data.success) {
        return { ...state, student_data: action.payload.data.data };
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
