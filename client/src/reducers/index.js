import { combineReducers } from "redux";
import teacher_data from "./teacher_data_reducer";

export default combineReducers({
  teacherData: teacher_data
});
