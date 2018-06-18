import { combineReducers } from "redux";
import count_reducer from "./count_reducer";
import student_list_reducer from "./student_list_reducer";
import assignment_reducer from "./assignment_reducer";

export default combineReducers({
  countReducer: count_reducer,
  studentData: student_list_reducer,
  assignmentList: assignment_reducer
});
