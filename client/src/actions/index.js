import axios from 'axios';
import types from './types';
import dummyData from '../dummy_data/dummy_data';

export function incrementCount(count){
    return {
        type: types.INCREMENT_COUNT,
        payload: ++count,
    }
}

export function getStudentList() {
    const path='/api/get_student_data';
    const response = axios.get(path);

    return {
        type: types.GET_STUDENT_LIST,
        payload: response,
    }
}