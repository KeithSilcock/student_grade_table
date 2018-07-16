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
          ...state,
          assignments: action.payload.data.data.assignments,
          classes: action.payload.data.data.classes,
          student_data: {
            name: action.payload.data.data.name,
            id: action.payload.data.data.id
          }
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
