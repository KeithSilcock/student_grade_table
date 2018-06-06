import types from './types';
import dummyData from '../dummy_data/dummy_data';

export function incrementCount(count){
    return {
        type: types.INCREMENT_COUNT,
        payload: ++count,
    }
}

export function getStudentList() {
    return {
        type: types.GET_STUDENT_LIST,
        payload: dummyData,
    }
}