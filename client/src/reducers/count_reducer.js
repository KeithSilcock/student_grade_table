import types from '../actions/types';

const DEFAULT_STATE = {
    count:0,
};

export default function (state=DEFAULT_STATE, action){

    switch (action.type){
        case types.INCREMENT_COUNT:
            return {...state, count:action.payload};

        default:
            return state;
    }
}