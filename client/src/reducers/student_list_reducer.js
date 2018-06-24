import types from "../actions/types";

const DEFAULT_STATE = {
  student_data: {},
  activeStudent: {},
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
    case types.SET_ACTIVE_STUDENT:
      return {
        ...state,
        activeStudent: action.payload
      };
    default:
      return state;
  }
}
