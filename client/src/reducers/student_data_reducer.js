import types from "../actions/types";

const DEFAULT_STATE = {
  assignments: [],
  teacherData: {},
  current_class: {},
  student_data: {},
  classes: {},
  errors: []
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.GET_STUDENT_DATA:
      debugger;
      if (action.payload.data.success) {
        return {
          ...state
        };
      } else {
        if (action.payload.data.redirect === "/login") {
          return {
            ...state,
            logged_in: false
          };
        }
        return {
          ...state,
          errors: [...state.errors, action.payload.data.errors]
        };
      }

    default:
      return state;
  }
}
