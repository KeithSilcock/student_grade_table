import types from "../actions/types";

const DEFAULT_STATE = {
  assignments: [],
  teacherData: {},
  current_class: {},
  student_data: {},
  activeStudent: {},
  classes: {},
  errors: [],
  modalIsOpen: false,
  newStudentName: ""
};

export default function(state = DEFAULT_STATE, action) {
  switch (action.type) {
    //student list
    case types.GET_STUDENT_LIST:
      if (action.payload.data.success) {
        const data = formatTeacherData(action.payload.data.data);
        return {
          ...state,
          student_data: action.payload.data.data,
          classes: data.classes,
          assignments: data.studentAssignments,
          teacherData: data.teacherData
        };
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

    //assignments
    case types.CHANGE_ACTIVE_CLASS:
      return { ...state, current_class: action.payload };

    case types.ADD_NEW_ASSIGNMENT:
      if (action.payload.data.success) {
        return {
          ...state
        };
      } else {
        return {
          ...state,
          errors: [...state.errors, action.payload.data.errors]
        };
      }
    case types.DELETE_ASSIGNMENT:
      if (action.payload.data.success) {
        return {
          ...state
        };
      } else {
        return {
          ...state,
          errors: [...state.errors, action.payload.data.errors]
        };
      }

    //classes
    case types.SET_AVAILABLE_CLASSES:
      return { ...state, classes: action.payload };

    //Misc...
    case types.TOGGLE_MODAL:
      const { modalIsOpen } = state;
      return { ...state, modalIsOpen: !modalIsOpen };

    case types.GET_STUDENT_NAME:
      debugger;
      if (action.payload.data.success) {
        return {
          ...state,
          newStudentName: action.payload.data
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

  function formatTeacherData(studentData) {
    const { assignment_list, class_list, student_list } = studentData;
    // get all classes, assignments, and grades data formated

    const teacherData = {};
    // get all class data (and add the current teacher's data)
    const classes = class_list.reduce((initObject, classInfo) => {
      teacherData.first_name = classInfo.first_name;
      teacherData.last_name = classInfo.last_name;

      const classObj = {
        [classInfo.class_name]: {
          class_description: classInfo.description,
          class_id: classInfo.class_id
        }
      };

      return Object.assign(initObject, classObj);
    }, {});

    //get assignment data per student
    const studentAssignments = {};
    for (let index = 0; index < assignment_list.length; index++) {
      const assignment = assignment_list[index];
      try {
        var existingArray =
          studentAssignments[assignment.student_id].assignments;
      } catch (err) {
        if (err.constructor == TypeError) {
          existingArray = [];
        } else {
          throw err;
        }
      }

      //formatting data
      studentAssignments[assignment.student_id] = {
        assignments: [...existingArray, assignment]
      };
    }

    return { teacherData, studentAssignments, classes };
  }
}
