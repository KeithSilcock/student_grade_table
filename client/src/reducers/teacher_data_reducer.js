import types from "../actions/types";

const DEFAULT_STATE = {
  assignments: [],
  roster: {},
  teacherData: {},
  current_class: {},
  student_data: {},
  activeStudent: {},
  classes: {},
  errors: [],
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
          teacherData: data.teacherData,
          roster: data.roster
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
    case types.UPDATE_SCORE:
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
    case types.GET_STUDENT_NAME:
      if (action.payload.data.success) {
        return {
          ...state,
          newStudentName: {
            first_name: action.payload.data.data.first_name,
            last_name: action.payload.data.data.last_name
          }
        };
      } else {
        if (action.payload.data.errors.length) {
          return {
            ...state,
            errors: [...state.errors, action.payload.data.errors]
          };
        } else {
          return {
            ...state,
            newStudentName: { first_name: action.payload.data.data.first_name }
          };
        }
      }
    case types.CLEAR_GOT_STUDENT_NAME:
      return {
        ...state,
        newStudentName: ""
      };

    case types.ADD_STUDENT_TO_CLASS:
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

    default:
      return state;
  }

  function formatTeacherData(studentData) {
    const { assignment_list, class_list, student_list } = studentData;
    // get all classes, assignments, and grades data formated

    //create student roster of all student names/ids per class
    const temp_roster = {};
    for (
      let studentIndex = 0;
      studentIndex < student_list.length;
      studentIndex++
    ) {
      const student = student_list[studentIndex];
      if (!temp_roster[student.class_id]) {
        temp_roster[student.class_id] = [
          {
            name: `${student.first_name} ${student.last_name}`,
            school_id: student.school_id
          }
        ];
      } else {
        temp_roster[student.class_id] = [
          ...temp_roster[student.class_id],
          {
            name: `${student.first_name} ${student.last_name}`,
            school_id: student.school_id
          }
        ];
      }
    }
    //rename keys of roster
    const roster = {};
    for (
      let keyIndex = 0;
      keyIndex < Object.keys(temp_roster).length;
      keyIndex++
    ) {
      for (let classIndex = 0; classIndex < class_list.length; classIndex++) {
        if (
          Object.keys(temp_roster)[keyIndex] == class_list[classIndex].class_id
        ) {
          roster[class_list[classIndex].class_name] =
            temp_roster[Object.keys(temp_roster)[keyIndex]];
        }
      }
    }

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

    return { teacherData, studentAssignments, classes, roster };
  }
}
