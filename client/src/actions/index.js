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

export function getStudentAssignmentList() {
    const path='/api/get_student_assignments';
    const response = axios.get(path);

    return {
        type: types.GET_STUDENT_ASSIGNMENT_LIST,
        payload: response,
    }
}

export function teacherLogin(dataToSend = {}){
    const path='/api/teacher_login';
    dataToSend = {
        school_id:'789ghi',
        password:'nothanks'
    }
    const response = axios.post(path, dataToSend);

    return {
        type: types.TEACHER_LOGGIN,
        payload: response,
    }
}