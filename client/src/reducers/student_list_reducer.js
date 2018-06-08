import types from '../actions/types';

const DEFAULT_STATE = {
    student_list:[],
    errors:[],
};

export default function (state=DEFAULT_STATE, action){

    switch (action.type){
        case types.GET_STUDENT_LIST:
            if(action.payload.data.success) {
                return {...state, student_list: action.payload.data.data};
            }else {
                return {...state, errors: [...state.errors, action.payload.data.errors]
                }
            }
        default:
            return state;
    }
}