import axios from "axios";
import types from "./types";

export function getTeacherData() {
  const path = "/api/get_teacher_data";
  const response = axios.get(path);
  return {
    type: types.GET_STUDENT_LIST,
    payload: response
  };
}

export function getStudentData() {
  const path = "/api/get_data_for_student";
  debugger;
  const response = axios.get(path);
  return {
    type: types.GET_STUDENT_DATA,
    payload: response
  };
}

export function login(dataToSend = {}) {
  const path = "/api/login";
  dataToSend = {
    school_id: dataToSend.user_name,
    password: dataToSend.password
  };
  const response = axios.post(path, dataToSend);

  return {
    type: types.LOGIN,
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

export function addNewAssignment(assignmentData, class_id) {
  const dataToSend = Object.assign(assignmentData, { class_id });

  const path = "/api/add_new_assignment";
  const response = axios.post(path, dataToSend);

  return {
    type: types.ADD_NEW_ASSIGNMENT,
    payload: response
  };
}

export function deleteAssignment(assignment_id) {
  const dataToSend = { assignment_id };
  const path = "/api/delete_assignment";
  const response = axios.post(path, dataToSend);

  return {
    type: types.DELETE_ASSIGNMENT,
    payload: response
  };
}

export function getStudentName(student_id) {
  const dataToSend = { student_id };
  const path = "/api/get_student_name";
  const response = axios.post(path, dataToSend);

  return {
    type: types.GET_STUDENT_NAME,
    payload: response
  };
}
export function clearGotStudentName() {
  return {
    type: types.CLEAR_GOT_STUDENT_NAME
  };
}

export function addStudentToClass(student) {
  const dataToSend = { ...student };
  const path = "/api/add_student_to_class";
  const response = axios.post(path, dataToSend);

  return {
    type: types.ADD_STUDENT_TO_CLASS,
    payload: response
  };
}

export function changeScore(assignment_info) {
  const path = "/api/update_score";
  const response = axios.post(path, assignment_info);

  return {
    type: types.UPDATE_SCORE,
    payload: response
  };
}

export function setRecentPage(page) {
  return {
    type: types.SET_RECENT_PAGE,
    payload: page
  };
}

export function logout() {
  const path = "/api/logout";
  const response = axios.get(path);

  return {
    type: types.LOGOUT,
    payload: response
  };
}
