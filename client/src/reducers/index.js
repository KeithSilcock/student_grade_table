import {combineReducers} from  'redux';
import count_reducer from './count_reducer';

export default combineReducers({countReducer:count_reducer})