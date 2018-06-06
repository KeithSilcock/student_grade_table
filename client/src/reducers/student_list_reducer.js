import types from '../actions/types';

const DEFAULT_STATE = {
    student_list:[],
};

export default function (state=DEFAULT_STATE, action){

    switch (action.type){
        case types.GET_STUDENT_LIST:
            return {...state, student_list:action.payload};

        default:
            return state;
    }
}