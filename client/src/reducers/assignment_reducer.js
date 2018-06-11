import types from '../actions/types';

const DEFAULT_STATE = {
    assignment_list:[],
    errors:[],
};

export default function (state=DEFAULT_STATE, action){

    switch (action.type){
        case types.GET_STUDENT_ASSIGNMENT_LIST:
            if(action.payload.data.success) {
                return {...state, assignment_list: action.payload.data.data};
            }else {
                return {...state, errors: [...state.errors, action.payload.data.errors]
                }
            }
        default:
            return state;
    }
}