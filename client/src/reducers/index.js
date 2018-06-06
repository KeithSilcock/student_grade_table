import {combineReducers} from  'redux';
import count_reducer from './count_reducer';
import student_list_reducer from './student_list_reducer';

export default combineReducers({
        countReducer:count_reducer,
        studentList: student_list_reducer,
    })