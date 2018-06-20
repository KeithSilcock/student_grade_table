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
  console.log("changing class to: ", class_id);
  return {
    type: types.CHANGE_ACTIVE_CLASS,
    payload: {
      class_name,
      class_id
    }
  };
}
