import axios from "axios";
import types from "./types";

export function incrementCount(count) {
  return {
    type: types.INCREMENT_COUNT,
    payload: ++count
  };
}

export function getStudentList() {
  const path = "/api/get_student_data";
  const response = axios.get(path);

  return {
    type: types.GET_STUDENT_LIST,
    payload: response
  };
}

export function getStudentAssignmentList() {
  const path = "/api/get_student_assignments";
  const response = axios.get(path);

  return {
    type: types.GET_STUDENT_ASSIGNMENT_LIST,
    payload: response
  };
}

export function teacherLogin(dataToSend = {}) {
  const path = "/api/teacher_login";
  dataToSend = {
    school_id: "ghi789",
    password: "nothanks"
  };
  const response = axios.post(path, dataToSend);

  return {
    type: types.TEACHER_LOGGIN,
    payload: response
  };
}

export function changeActiveClass(class_name, class_id) {
  return {
    type: types.CHANGE_ACTIVE_CLASS,
    payload: {
      class_name,
      class_id
    }
  };
}
export function setActiveStudent(studentData) {
  return {
    type: types.SET_ACTIVE_STUDENT,
    payload: studentData
  };
}

export function setAvailableClasses(availableClasses) {
  return {
    type: types.SET_AVAILABLE_CLASSES,
    payload: availableClasses
  };
}

export function addNewAssignment(assignmentData) {
  debugger;
  const path = "/api/add_new_assignment";
  // dataToSend = {
  //   school_id: "ghi789",
  //   password: "nothanks"
  // };
  const response = axios.post(path, assignmentData);

  return {
    type: types.ADD_NEW_ASSIGNMENT,
    payload: response
  };
}
