import { combineReducers } from "redux";
import teacher_data from "./teacher_data_reducer";
import log_in_reducer from "./log_in_reducer";
import nav_reducer from "./nav_reducer";

export default combineReducers({
  loginReducer: log_in_reducer,
  teacherData: teacher_data,
  navData: nav_reducer
});
